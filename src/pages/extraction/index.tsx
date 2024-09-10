import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Typography,
  Modal,
  Alert,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions
} from '@mui/material';
import { getClientData, getDistributorData } from 'services';
import useAuth from 'hooks/useAuth';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

export default function Extraction() {
  const { user } = useAuth();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedDistribuidora, setSelectedDistribuidora] = useState<string | null>(null);
  const [selectedDocumento, setSelectedDocumento] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<boolean | null>(null); // Estado para controlar erros

  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => getClientData(),
    enabled: true
  });

  const { data: distributors, isLoading: isLoadingDistributors } = useQuery({
    queryKey: ['distributors', selectedClient],
    queryFn: () => getDistributorData(user?.role === 'AD' ? selectedClient! : user?.id?.toString()!),
    enabled: !!selectedClient
  });

  const uploadExtraction = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post('https://painel.energee.com.br/api/v1/extracao/upload_pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    onSuccess: (data) => {
      setErrorMessage(null);
      setOpenModal(true);
    },
    onError: (error: any) => {
      setErrorMessage(true);
      enqueueSnackbar(error.msg || 'Ocorreu um erro durante a extração. Tente novamente.', {
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    setOpenModal(false);
    enqueueSnackbar('Os valores foram inseridos com sucesso no banco de dados!', {
      variant: 'info',
      autoHideDuration: 5000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
  };

  const handleSubmit = () => {
    if (selectedClient && selectedDistribuidora && selectedDocumento && selectedFile) {
      const formData = new FormData();
      formData.append('cliente', selectedClient);
      formData.append('distribuidora', selectedDistribuidora);
      formData.append('documento', selectedDocumento);
      formData.append('pdf_files', selectedFile);
      uploadExtraction.mutate(formData);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Extração
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }} disabled={isLoadingClients}>
        <InputLabel>Cliente</InputLabel>
        <Select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} displayEmpty>
          {isLoadingClients ? (
            <MenuItem disabled>
              <CircularProgress size={20} />
            </MenuItem>
          ) : (
            clients?.items.map((client: any) => (
              <MenuItem key={client.id} value={client.id}>
                {client.nome}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }} disabled={!selectedClient || isLoadingDistributors}>
        <InputLabel>Distribuidora</InputLabel>
        <Select value={selectedDistribuidora} onChange={(e) => setSelectedDistribuidora(e.target.value)} displayEmpty>
          {isLoadingDistributors ? (
            <MenuItem disabled>
              <CircularProgress size={20} />
            </MenuItem>
          ) : (
            distributors?.items.map((distribuidora: any) => (
              <MenuItem key={distribuidora.id} value={distribuidora.id}>
                {distribuidora.nome}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }} disabled={!selectedDistribuidora}>
        <InputLabel>Tipo de Documento</InputLabel>
        <Select value={selectedDocumento} onChange={(e) => setSelectedDocumento(e.target.value)} displayEmpty>
          <MenuItem value="Conta Agrupada">Conta Agrupada</MenuItem>
          <MenuItem value="Faturas Gerador">Faturas Gerador</MenuItem>
          <MenuItem value="Relatório Azul">Relatório Azul</MenuItem>
        </Select>
      </FormControl>

      {selectedDocumento && (
        <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignItems: 'start' }}>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          {selectedFile && (
            <Button sx={{ mt: 2 }} variant="contained" color="primary" onClick={handleSubmit}>
              Iniciar Extração
            </Button>
          )}
        </Box>
      )}

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText sx={{ fontSize: 20 }} id="alert-dialog-description">
            A Extração foi realizada com sucesso!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} color="primary" variant="outlined">
            Salvar
          </Button>
          <Button onClick={() => setOpenModal(false)} color="info" variant="outlined" autoFocus>
            Baixar csv
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
