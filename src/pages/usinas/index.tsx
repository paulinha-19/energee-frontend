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
import { getClientData, getDistributor, deletePlantsAdmin, getOnePlant, getPlants, getGenerator } from 'services';
import useAuth from 'hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import FormPlants from './FormPlants';
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
  { id: 'gerador', label: 'Gerador', minWidth: 170, align: 'center' },
  { id: 'status', label: 'Status', minWidth: 150, align: 'left' },
  { id: 'distribuidora', label: 'Distribuidora', minWidth: 150 },
  { id: 'actions', label: 'Ações', minWidth: 200, align: 'center' }
];

export default function Plants() {
  const theme = useTheme();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedPlants, setSelectedPlants] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  // Fetch clients data using useQuery
  const {
    data: plantsCrud,
    isLoading: isLoadingPlants,
    isError: isErrorPlants
  } = useQuery({
    queryKey: ['plants-crud', page, rowsPerPage], // Inclui a página e o rowsPerPage no queryKey
    queryFn: () => getPlants(page + 1, rowsPerPage), // Passa a página e o page_size para a função
    enabled: user?.role === 'AD'
  });

  // Fetch clients data using useQuery
  const { data: clientsCrud, isLoading: isLoadingClients } = useQuery({
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

  const { data: generatorsCrud, refetch: refetchGenerator }: any = useQuery({
    queryKey: ['generators-crud'],
    queryFn: () => getGenerator(),
    enabled: true
  });

  const clients = clientsCrud?.items || [];
  const distributors = distributorsCrud?.items || [];
  const plants = plantsCrud?.items || [];
  const generators = generatorsCrud?.items || [];

  const deleteMutation = useMutation({
    mutationFn: (id: any) => deletePlantsAdmin(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['plants-crud'] });
      setConfirmDeleteOpen(false);
      enqueueSnackbar('Usina deletada com sucesso', {
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
      setErrorDetail(error?.detail || 'Ocorreu um erro ao excluir a usina.');
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
    queryClient.invalidateQueries({ queryKey: ['plants-crud'] });
  };

  const handleDeleteClick = (plant: any) => {
    setIsEditing(false);
    setSelectedPlants(plant);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPlants) {
      deleteMutation.mutate(selectedPlants.id);
    }
  };

  const handleAddClick = () => {
    setSelectedPlants(null);
    setIsEditing(false);
    setOpenModal(true);
  };

  // Fetch plant details data using useQuery
  const {
    data: plantDetail,
    isLoading: isLoadingPlantDetail,
    isError: isErrorPlantDetail
  } = useQuery({
    queryKey: ['plants-detail', selectedPlants?.id],
    queryFn: () => getOnePlant(selectedPlants?.id),
    enabled: !!selectedPlants?.id && user?.role === 'AD',
    retry: 2
  });

  const handleEditClick = async (plant: any) => {
    setIsEditing(true);
    setSelectedPlants(plant);
    if (!isLoadingPlantDetail) {
      setOpenModal(true);
    }
  };

  if (user?.role !== 'AD') {
    return <Typography>Você não tem permissão para gerenciar as usinas.</Typography>;
  }

  useEffect(() => {
    if (isEditing && isErrorPlantDetail) {
      setOpenModal(false);
      setErrorModalOpen(true);
      setErrorDetail('Ocorreu um erro ao tentar recuperar os dados da usina selecionada. Por favor, tente novamente.');
    }
    if (isErrorPlants) {
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
  }, [isEditing, isErrorPlantDetail, isErrorPlants]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography variant="h1">Usinas</Typography>
        <Button variant="contained" onClick={handleAddClick} size="small" startIcon={<Add />}>
          Adicionar usina
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
              {isLoadingPlants ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <CircularProgress />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Carregando os dados da tabela...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                plants.map((row: any) => (
                  <TableRow sx={{ py: 3 }} hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell align="left">{row.nome}</TableCell>
                    <TableCell align="left">{row.uc}</TableCell>
                    <TableCell align="center">{row.gerador ?? '------'}</TableCell>
                    <TableCell align="left">
                      <Chip label={row.status ? 'Ativo' : 'Inativo'} color={row.status ? 'success' : 'error'} variant="outlined" />
                    </TableCell>
                    <TableCell align="left">{row.distribuidora}</TableCell>
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
          count={plantsCrud?.total_items || 0} // Total de itens retornados pelo backend
          rowsPerPage={rowsPerPage} // Quantidade de itens por página
          page={page} // Página atual
          onPageChange={handleChangePage} // Função que atualiza a página
          onRowsPerPageChange={handleChangeRowsPerPage} // Atualiza o número de itens por página
          labelRowsPerPage="Itens por página:"
        />
      </MainCard>

      {openModal && !isLoadingPlantDetail && (
        <CustomModalForm open={openModal} modalToggler={setOpenModal}>
          <FormPlants
            plant={plantDetail}
            isEditing={isEditing}
            distributors={distributors}
            clients={clients}
            generators={generators}
            onCancel={() => setOpenModal(false)}
            setOpenModal={setOpenModal}
            user={user}
          />
        </CustomModalForm>
      )}

      {isLoadingPlantDetail && openModal && (
        <CustomModalForm open={openModal} modalToggler={setOpenModal}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h6">Carregando os dados da usina...</Typography>
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
          <DialogContentText id="alert-dialog-description">Você tem certeza que deseja excluir esta usina?</DialogContentText>
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