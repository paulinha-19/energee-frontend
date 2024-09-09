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
import { getGenerator, deleteGenerator, getClientData, getDistributor, getOneGenerator } from 'services';
import axios from 'axios';
import useAuth from 'hooks/useAuth';
import FormGenerator from './FormGenerator';
import { enqueueSnackbar } from 'notistack';

const columns: any[] = [
  { id: 'nome', label: 'Nome', minWidth: 170 },
  { id: 'uc', label: 'UC', minWidth: 170 },
  { id: 'distribuidora', label: 'Distribuidora', minWidth: 170 },
  { id: 'status', label: 'Status', minWidth: 100, align: 'left' },
  { id: 'cliente', label: 'Cliente', minWidth: 170 },
  { id: 'actions', label: 'Ações', minWidth: 200, align: 'center' }
];

export default function Generator() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState<any | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: generatorsCrud,
    refetch: refetchGenerator,
    isError: isErrorGenerator,
    isLoading: isLoadingGenerator
  }: any = useQuery({
    queryKey: ['generators-crud', page, rowsPerPage],
    queryFn: () => getGenerator(page + 1, rowsPerPage),
    enabled: true
  });

  // Fetch clients data using useQuery
  const { data: clientsCrud } = useQuery({
    queryKey: ['clients-crud'],
    queryFn: () => getClientData(),
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
  const generators = generatorsCrud?.items || [];

  const mutation = useMutation({
    mutationFn: (data) => {
      if (!selectedGenerator) return Promise.reject(new Error('Nenhum gerador selecionado'));
      return axios.patch(`https://painel.energee.com.br/api/v1/usuarios/geradores/${selectedGenerator.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generators-crud'] });
      setModalOpen(false);
      enqueueSnackbar('Gerador atualizado com sucesso', { variant: 'success' });
    },
    onError: (error: any) => {
      setModalOpen(false);
      setErrorModalOpen(true);
      setErrorDetail(error.response?.data?.detail || 'Ocorreu um erro ao tentar atualizar o gerador. Por favor, tente novamente.');
      console.error('Erro ao tentar atualizar o gerador:', error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => deleteGenerator(id),
    onSuccess: (data) => {
      console.log('data', data);
      queryClient.invalidateQueries({ queryKey: ['generators-crud'] });
      setConfirmDeleteOpen(false);
      enqueueSnackbar(data.msg ? data.msg : 'Gerador excluído com sucesso', {
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
    },
    onError: (error: any) => {
      console.log('error exlusao', error);
      setConfirmDeleteOpen(false);
      setErrorDetail(error?.detail || 'Ocorreu um erro ao tentar excluir o gerador');
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
    queryClient.invalidateQueries({ queryKey: ['generators-crud'] });
  };

  const handleDeleteClick = (distributor: any) => {
    setIsEditing(false);
    setSelectedGenerator(distributor);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsEditing(false);
    if (selectedGenerator) {
      deleteMutation.mutate(selectedGenerator.id);
    }
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setSelectedGenerator(null);
    setModalOpen(true);
  };

  // Fetch generator details data using useQuery
  const {
    data: generatorDetail,
    isLoading: isLoadingGeneratorDetail,
    isError
  } = useQuery({
    queryKey: ['generator-detail', selectedGenerator?.id],
    queryFn: () => getOneGenerator(selectedGenerator?.id),
    enabled: !!selectedGenerator?.id && user?.role === 'AD',
    retry: 2
  });

  const handleEditClick = async (generator: any) => {
    setIsEditing(true);
    setSelectedGenerator(generator);
    if (!isLoadingGeneratorDetail) {
      setModalOpen(true);
    }
  };

  // const handleSave = (data: any) => {
  //   console.log('data', data);
  //   if (isEditing) {
  //     mutation.mutate(data);
  //     setModalOpen(false);
  //   }
  // };

  useEffect(() => {
    if (isEditing && isError) {
      setModalOpen(false);
      setErrorModalOpen(true);
      setErrorDetail('Ocorreu um erro ao tentar recuperar os dados do gerador. Por favor, tente novamente.');
    }
    if (isErrorGenerator) {
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
  }, [isEditing, isError, isErrorGenerator]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography variant="h1">Geradores</Typography>
        <Button variant="contained" onClick={handleAddClick} size="small" startIcon={<Add />}>
          Adicionar Gerador
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
              {isLoadingGenerator ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <CircularProgress />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Carregando os dados da tabela...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                generators.map((row: any) => (
                  <TableRow sx={{ py: 3 }} hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell align="left">{row.nome}</TableCell>
                    <TableCell align="left">{row.uc}</TableCell>
                    <TableCell align="left">{row.distribuidora}</TableCell>
                    <TableCell align="left">
                      <Chip label={row.status ? 'Ativo' : 'Inativo'} color={row.status ? 'success' : 'error'} variant="outlined" />
                    </TableCell>
                    <TableCell align="left">{row.cliente}</TableCell>
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
          count={generators?.total_items || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página:"
        />
      </MainCard>
      {modalOpen && !isLoadingGeneratorDetail && (
        <CustomModalForm open={modalOpen} modalToggler={setModalOpen}>
          <FormGenerator
            clients={clients}
            isEditing={isEditing}
            generator={generatorDetail}
            distributors={distributors}
            onCancel={() => setModalOpen(false)}
            setModalOpen={setModalOpen}
          />{' '}
        </CustomModalForm>
      )}
      {isLoadingGeneratorDetail && modalOpen && (
        <CustomModalForm open={modalOpen} modalToggler={setModalOpen}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h6">Carregando dados do gerador...</Typography>
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
          <DialogContentText id="alert-dialog-description">Você tem certeza que deseja excluir este gerador?</DialogContentText>
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
