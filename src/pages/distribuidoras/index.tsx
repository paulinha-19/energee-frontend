import { ChangeEvent, useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorIcon from '@mui/icons-material/Error';
import { Add } from 'iconsax-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MainCard from 'components/MainCard';
import CustomModalForm from 'sections/apps/customer/CustomModalForm';
import { getDistributor, deleteClientData, deleteDistributor } from 'services';
import DistributorForm from './DistributorForm';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const columns: any[] = [
  { id: 'nome', label: 'Nome', minWidth: 170 },
  { id: 'status', label: 'Status', minWidth: 100, align: 'left' },
  { id: 'actions', label: 'Ações', minWidth: 170, align: 'center' }
];

export default function Distribuitors() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState<any | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const isEditing = !!selectedDistributor;

  const {
    data: distributorsCrud,
    isError: isErrorDistributor,
    isLoading: isLoadingDistributor
  }: any = useQuery({
    queryKey: ['distributors-crud', page, rowsPerPage],
    queryFn: () => getDistributor(page + 1, rowsPerPage),
    enabled: true
  });

  const distributors = distributorsCrud?.items || [];

  const mutation = useMutation({
    mutationFn: (data) => {
      if (!selectedDistributor) return Promise.reject(new Error('Nenhuma distribuidora selecionada'));
      return axios.patch(`https://painel.energee.com.br/api/v1/distribuidoras/${selectedDistributor.id.toString()}`, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['distributors-crud'] });
      setModalOpen(false);
      enqueueSnackbar('Distribuidora atualizada com sucesso', {
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
    },
    onError: (error: any) => {
      setModalOpen(false);
      setErrorDetail(error.response.data.detail || 'Erro ao atualizar a distribuidora');
      setErrorModalOpen(true);
      console.error(error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDistributor(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['distributors-crud'] });
      setConfirmDeleteOpen(false);
    },
    onError: (error: any) => {
      setConfirmDeleteOpen(false);
      console.error('error', error);
      setErrorDetail(error?.detail || 'Erro ao excluir a distribuidora');
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
    queryClient.invalidateQueries({ queryKey: ['distributors-crud'] });
  };

  const handleEditClick = (distributor: any) => {
    setSelectedDistributor(distributor);
    setModalOpen(true);
  };

  const handleDeleteClick = (distributor: any) => {
    setSelectedDistributor(distributor);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDistributor) {
      deleteMutation.mutate(selectedDistributor.id.toString());
    }
  };

  const handleAddClick = () => {
    setSelectedDistributor(null);
    setModalOpen(true);
  };

  const handleSave = (data: any) => {
    if (isEditing) {
      mutation.mutate(data);
    }
  };

  useEffect(() => {
    if (isErrorDistributor) {
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
  }, [isErrorDistributor]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography variant="h1">Distribuidoras</Typography>
        <Button variant="contained" onClick={handleAddClick} size="small" startIcon={<Add />}>
          Adicionar Distribuidora
        </Button>
      </Box>
      <MainCard content={false} title="" secondary={null}>
        <TableContainer sx={{ maxHeight: 430 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead
              sx={{
                '& th': {
                  borderTop: `1px solid ${theme.palette.divider}`,
                  borderBottom: `2px solid ${theme.palette.divider} !important`
                }
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
              {isLoadingDistributor ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <CircularProgress />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Carregando os dados da tabela...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                distributors.map((row: any) => (
                  <TableRow sx={{ py: 3 }} hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell align="left">{row.nome}</TableCell>
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
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={distributors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página:"
        />
      </MainCard>
      {modalOpen && (
        <CustomModalForm open={modalOpen} modalToggler={setModalOpen}>
          <DistributorForm distributor={selectedDistributor} onSave={handleSave} onCancel={() => setModalOpen(false)} />
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
          <DialogContentText id="alert-dialog-description">Você tem certeza que deseja excluir esta distribuidora?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Excluir
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
