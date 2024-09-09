import { useState, ChangeEvent, MouseEvent, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import MainCard from 'components/MainCard';
import { CSVExport } from 'components/third-party/react-table';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorIcon from '@mui/icons-material/Error';
import { Add } from 'iconsax-react';
import CustomModalForm from 'sections/apps/customer/CustomModalForm';
import { getClientData, getDistributor, deleteClientData, getOneClientData } from 'services';
import useAuth from 'hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import FormCustomerClient from './FormCustomerClient';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

// table columns
interface ColumnProps {
  id: string;
  label: string;
  minWidth: number;
  align?: 'right' | 'left' | 'inherit' | 'center' | 'justify' | undefined;
  format?: (value: Date | number) => string | boolean;
}

const columns: ColumnProps[] = [
  { id: 'nome', label: 'Nome', minWidth: 170 },
  { id: 'uc', label: 'UC', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 170, align: 'left' },
  { id: 'actions', label: 'Ações', minWidth: 170, align: 'center' }
];

export default function Clients() {
  const theme = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [customerModal, setCustomerModal] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  // Fetch clients data using useQuery
  const {
    data: clientsCrud,
    refetch: refetchClients,
    isLoading: isLoadingClients,
    isError: isErrorClients
  } = useQuery({
    queryKey: ['clients-crud', page, rowsPerPage],
    queryFn: () => getClientData(page + 1, rowsPerPage),
    enabled: user?.role === 'AD'
  });

  // Fetch distributors data using useQuery
  const { data: distributorsCrud } = useQuery({
    queryKey: ['distributors-crud'],
    queryFn: () => getDistributor(),
    enabled: user?.role === 'AD'
  });

  const clients = clientsCrud?.items || [];
  const distributors = distributorsCrud?.items || [];

  const mutation = useMutation({
    mutationFn: (data) => {
      if (!selectedClient) return Promise.reject(new Error('Nenhum cliente selecionado'));
      return axios.patch(`https://painel.energee.com.br/api/v1/usuarios/clientes/${selectedClient.id}`, data);
    },
    onSuccess: (data) => {
      console.log('Cliente atualizado com sucesso:', data);
      queryClient.invalidateQueries({ queryKey: ['clients-crud'] });
      setCustomerModal(false);
      enqueueSnackbar('Cliente atualizado com sucesso', {
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
    },
    onError: (error: any) => {
      setCustomerModal(false);
      setErrorModalOpen(true);
      console.error('Entrei aqui ao tentar atualizar o cliente:', error);
      setErrorDetail(error.response?.data?.detail || 'Ocorreu um erro ao tentar atualizar o cliente. Por favor, tente novamente.');
      console.error('Erro ao tentar atualizar o cliente:', error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => deleteClientData(id),
    onSuccess: (data) => {
      console.log('Cliente deletado com sucesso:', data);
      queryClient.invalidateQueries({ queryKey: ['clients-crud'] });
      setConfirmDeleteOpen(false);
      enqueueSnackbar('Cliente deletado com sucesso', {
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
    },
    onError: (error: any) => {
      setConfirmDeleteOpen(false);
      setErrorDetail(error?.detail || 'Ocorreu um erro ao excluir o cliente');
      setErrorModalOpen(true);
    }
  });

  // Ao mudar a página, atualiza a página no estado e refaz a busca
  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage); // Atualiza a página
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
    setRowsPerPage(+event?.target?.value!); // Atualiza o número de itens por página
    setPage(0); // Volta para a primeira página ao mudar o número de itens
    queryClient.invalidateQueries({ queryKey: ['clients-crud'] });
  };

  const handleDeleteClick = (client: any) => {
    setIsEditing(false);
    setSelectedClient(client);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedClient) {
      deleteMutation.mutate(selectedClient.id);
    }
  };

  const handleAddClick = () => {
    setSelectedClient(null);
    setIsEditing(false);
    setCustomerModal(true);
  };

  // Fetch generator details data using useQuery
  const {
    data: clientDetail,
    isLoading: isLoadingClientDetail,
    isError
  } = useQuery({
    queryKey: ['generator-detail', selectedClient?.id],
    queryFn: () => getOneClientData(selectedClient?.id),
    enabled: !!selectedClient?.id && user?.role === 'AD',
    retry: 2
  });

  const handleEditClick = async (client: any) => {
    setIsEditing(true);
    setSelectedClient(client);
    if (!isLoadingClientDetail) {
      setCustomerModal(true);
    }
  };

  const handleSave = (data: any) => {
    console.log('data', data);
    if (isEditing) {
      mutation.mutate(data);
      setCustomerModal(false);
      refetchClients();
    }
  };

  if (user?.role !== 'AD') {
    return <Typography>Você não tem permissão para gerenciar clientes.</Typography>;
  }

  console.log('isLoadingClients', isLoadingClients);
  useEffect(() => {
    if (isEditing && isError) {
      setCustomerModal(false);
      setErrorModalOpen(true);
      setErrorDetail('Ocorreu um erro ao tentar recuperar os dados do gerador. Por favor, tente novamente.');
    }
    if (isErrorClients) {
      // Exibe a primeira notificação de erro
      enqueueSnackbar('Erro ao exibir os dados da tabela', {
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });

      // Após 3 segundos (3000ms), exibe a segunda notificação
      setTimeout(() => {
        enqueueSnackbar('Não se preocupe, a página será atualizada!', {
          variant: 'info',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        });

        // Após 3 segundos (3000ms) da segunda notificação, recarrega a página
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }, 3000); // Espera o primeiro snackbar desaparecer antes de exibir o segundo
    }
  }, [isEditing, isError, isErrorClients]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography variant="h1">Clientes</Typography>
        <Button variant="contained" onClick={handleAddClick} size="small" startIcon={<Add />}>
          Adicionar cliente
        </Button>
      </Box>
      <MainCard content={false} title="">
        <TableContainer sx={{ maxHeight: 430 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead
              sx={{
                '& th': { borderTop: `1px solid ${theme.palette.divider}`, borderBottom: `2px solid ${theme.palette.divider} !important` }
              }}
            >
              <TableRow>
                {columns.map((column: any) => (
                  <TableCell sx={{ minWidth: column.minWidth, position: 'sticky !important' }} key={column.id} align={column.align}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingClients ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <CircularProgress />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Carregando os dados da tabela...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((row: any) => (
                  <TableRow sx={{ py: 3 }} hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell align="left">{row.nome}</TableCell>
                    <TableCell align="left">{row.uc}</TableCell>
                    <TableCell align="left">
                      <Chip label={row.status ? 'Ativo' : 'Inativo'} color={row.status ? 'success' : 'error'} variant="outlined" />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        sx={{ mr: 1 }}
                        onClick={() => handleEditClick(row)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(row)}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={clientsCrud?.total_items || 0} // Total de itens retornados pelo backend
          rowsPerPage={rowsPerPage} // Quantidade de itens por página
          page={page} // Página atual
          onPageChange={handleChangePage} // Função que atualiza a página
          onRowsPerPageChange={handleChangeRowsPerPage} // Atualiza o número de itens por página
          labelRowsPerPage="Itens por página:"
        />
      </MainCard>

      {customerModal && !isLoadingClientDetail && (
        <CustomModalForm open={customerModal} modalToggler={setCustomerModal}>
          <FormCustomerClient
            client={clientDetail}
            isEditing={isEditing}
            distributors={distributors}
            onSave={handleSave}
            onCancel={() => setCustomerModal(false)}
            setCustomerModal={setCustomerModal}
          />
        </CustomModalForm>
      )}

      {isLoadingClientDetail && customerModal && (
        <CustomModalForm open={customerModal} modalToggler={setCustomerModal}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h6">Carregando os dados do cliente...</Typography>
          </Box>
        </CustomModalForm>
      )}

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirmar Exclusão'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Você tem certeza que deseja excluir este cliente?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de erro ao tentar excluir */}
      <Dialog
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <Box textAlign="center" p={3}>
          <IconButton disableRipple sx={{ color: 'warning.main' }}>
            <ErrorIcon fontSize="large" style={{ width: '80px', height: '80px', marginTop: 2 }} />
          </IconButton>
          <DialogContent>
            <DialogContentText sx={{ fontSize: 20, mt: 4 }} id="error-dialog-description">
              {errorDetail}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button onClick={() => setErrorModalOpen(false)} variant="contained" sx={{ bgcolor: '#7F56D9', color: '#FFF' }}>
              OK
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
