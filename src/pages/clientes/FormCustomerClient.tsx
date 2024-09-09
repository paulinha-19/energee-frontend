import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Typography,
  RadioGroup,
  Radio
} from '@mui/material';
import { postCustomerData, editCustomerData } from 'services';
import { CreateClientRequest, EditClientRequest } from 'interfaces';
import { useFormik } from 'formik';
import { AddClientSchema, EditClientSchema } from 'sections/forms/validation/CRUD/schema-client';
import { useSnackbar } from 'notistack';
import { SetStateAction, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface FormCustomerAddProps {
  client?: any | null;
  isEditing: boolean;
  distributors: { id: number; nome: string }[];
  onSave: (data: any) => void;
  onCancel: () => void;
  setCustomerModal: (value: SetStateAction<boolean>) => void;
}

export default function FormCustomerClient({ client, isEditing, distributors, onSave, onCancel, setCustomerModal }: FormCustomerAddProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [openSelect, setOpenSelect] = useState(false); // Estado para controlar o fechamento do Select
  const queryClient = useQueryClient();

  const formik = useFormik<CreateClientRequest | EditClientRequest>({
    initialValues:
      isEditing && client
        ? {
            nome: client?.nome || '',
            email: client?.email || '',
            telefone: client?.telefone || '',
            endereco: client?.endereco || '',
            distribuidoras: client?.distribuidoras?.id || [],
            status: client?.status ?? true // Só adicionado na edição
          }
        : {
            nome: '',
            email: '',
            telefone: '',
            endereco: '',
            password: '', // Somente para criação
            distribuidoras: [],
            status: true
          },
    validationSchema: isEditing ? EditClientSchema : AddClientSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let response;
        if (isEditing) {
          response = await editCustomerData(values as EditClientRequest, client?.id as any);
        } else {
          response = await postCustomerData(values as CreateClientRequest);
        }
        queryClient.invalidateQueries({ queryKey: ['clients-crud'] });
        setCustomerModal(false);
        enqueueSnackbar(response.msg || 'Dados do cliente enviado com sucesso', {
          variant: 'success',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        });
      } catch (error: any) {
        enqueueSnackbar(error?.detail || 'Erro ao enviar os dados do cliente', {
          variant: 'error',
          autoHideDuration: 8000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        });
        setCustomerModal(false);
      } finally {
        setSubmitting(false);
      }
    }
  });

  // Função para encontrar o nome da distribuidora pelo ID
  const getDistributorName = (id: number) => {
    const distribuidora = distributors.find((d) => d.id === id);
    return distribuidora ? distribuidora.nome : '';
  };

  return (
    <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} onSubmit={formik.handleSubmit}>
      <Typography variant="h4" component="div" gutterBottom>
        {isEditing ? 'Editar Cliente' : 'Adicionar Cliente'}
      </Typography>
      <TextField
        label="Nome"
        name="nome"
        value={formik.values.nome}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.nome && Boolean(formik.errors.nome)}
        helperText={formik.touched.nome && formik.errors.nome}
        required
      />
      <TextField
        label="E-mail"
        name="email"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        required
      />
      <TextField
        label="Telefone"
        name="telefone"
        value={formik.values.telefone}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.telefone && Boolean(formik.errors.telefone)}
        helperText={formik.touched.telefone && formik.errors.telefone}
        required
      />
      <TextField
        label="Endereço"
        name="endereco"
        value={formik.values.endereco}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.endereco && Boolean(formik.errors.endereco)}
        helperText={formik.touched.endereco && formik.errors.endereco}
        required
      />
      {!isEditing && (
        <TextField
          label="Senha"
          name="password"
          type="password"
          value={(formik.values as CreateClientRequest).password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={(formik.touched as any).password && Boolean((formik.errors as any).password)}
          helperText={(formik.touched as any).password && (formik.errors as any).password}
          required
        />
      )}
      {/* Select Distribuidoras */}
      <FormControl error={formik.touched.distribuidoras && Boolean(formik.errors.distribuidoras)}>
        <InputLabel>Distribuidoras</InputLabel>
        <Select
          name="distribuidoras"
          multiple
          value={formik.values.distribuidoras}
          onChange={(e) => {
            formik.handleChange(e);
            setOpenSelect(false); // Fecha o Select após a escolha
          }}
          onBlur={formik.handleBlur}
          open={openSelect}
          onClose={() => setOpenSelect(false)}
          onOpen={() => setOpenSelect(true)}
          renderValue={(selected) =>
            Array.isArray(selected)
              ? selected.map((id) => getDistributorName(id)).join(', ') // Mostra o nome das distribuidoras selecionadas
              : ''
          }
        >
          {distributors?.map((distribuidora) => (
            <MenuItem key={distribuidora.id} value={distribuidora.id}>
              {distribuidora.nome}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.distribuidoras && formik.errors.distribuidoras && <FormHelperText>{formik.errors.distribuidoras}</FormHelperText>}
      </FormControl>

      {/* Status */}
      {isEditing && (
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="status"
            name="status"
            value={formik.values.status ? 'true' : 'false'}
            onChange={(e) => formik.setFieldValue('status', e.target.value === 'true')}
          >
            <FormControlLabel value="true" control={<Radio />} label="Ativo" />
            <FormControlLabel value="false" control={<Radio />} label="Inativo" />
          </RadioGroup>
        </FormControl>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" color="primary" type="submit">
          Salvar
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
}
