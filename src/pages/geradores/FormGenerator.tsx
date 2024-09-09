import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  FormHelperText,
  Typography,
  RadioGroup,
  Radio
} from '@mui/material';
import { postGeneratorAdmin, editGeneratorAdmin } from 'services';
import { EditGenerator, PostGenerator } from 'interfaces';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { AddGeneratorSchema, EditGeneratorSchema } from 'sections/forms/validation/CRUD/schema-generator';
import { useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

interface FormCustomerAddProps {
  clients?: any[] | null;
  generator?: any | null;
  isEditing: boolean;
  distributors: any[] | null;
  onCancel: () => void;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function FormGenerator({ clients, generator, isEditing, distributors, onCancel, setModalOpen }: FormCustomerAddProps) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const formik = useFormik<PostGenerator | EditGenerator>({
    initialValues:
      isEditing && generator
        ? {
            uc: generator?.uc || '',
            nome: generator?.nome || '',
            email: generator?.email || '',
            password: '',
            telefone: generator?.telefone ?? '', // Garante que telefone seja uma string vazia se for null/undefined
            endereco: generator?.endereco ?? '', // Garante que endereco seja uma string vazia se for null/undefined
            cpf_cnpj: generator?.cpf_cnpj || '',
            status: generator?.status ?? true,
            cliente_id: generator?.cliente?.id || '',
            distribuidora_id: generator?.distribuidora?.id || ''
          }
        : {
            uc: '',
            nome: '',
            email: '',
            password: '',
            telefone: '',
            endereco: '',
            cpf_cnpj: '',
            status: true,
            cliente_id: '',
            distribuidora_id: ''
          },
    validationSchema: isEditing ? EditGeneratorSchema : AddGeneratorSchema,
    enableReinitialize: true, // Permite que os valores do formik sejam reinicializados quando os initialValues mudarem
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let response;
        if (isEditing) {
          response = await editGeneratorAdmin(values as EditGenerator, generator?.id as any);
          enqueueSnackbar('Gerador atualizado com sucesso', {
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            }
          });
        } else {
          response = await postGeneratorAdmin(values as PostGenerator);
          enqueueSnackbar('Gerador criado com sucesso', {
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            }
          });
        }
        queryClient.invalidateQueries({ queryKey: ['generators-crud'] });
        setModalOpen(false);
      } catch (error: any) {
        enqueueSnackbar(error?.message || 'Erro ao salvar os dados do gerador. Por favor, tente novamente mais tarde.', {
          variant: 'error',
          autoHideDuration: 8000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        });
        setModalOpen(false);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} onSubmit={formik.handleSubmit}>
      <Typography variant="h4" component="div" gutterBottom>
        {isEditing ? 'Editar Gerador' : 'Adicionar Gerador'}
      </Typography>
      <TextField
        label="Uc"
        name="uc"
        value={formik.values.uc}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.uc && Boolean(formik.errors.uc)}
        helperText={formik.touched.uc && formik.errors.uc}
        required
      />
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
        label="Senha"
        name="password"
        type="password"
        value={(formik.values as PostGenerator).password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={(formik.touched as any).password && Boolean((formik.errors as any).password)}
        helperText={(formik.touched as any).password && (formik.errors as any).password}
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
      <TextField
        label="Cpf/Cnpj"
        name="cpf_cnpj"
        value={formik.values.cpf_cnpj}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.cpf_cnpj && Boolean(formik.errors.cpf_cnpj)}
        helperText={formik.touched.cpf_cnpj && formik.errors.cpf_cnpj}
        required
      />
      {/* Select Distribuidoras */}
      <FormControl error={formik.touched.distribuidora_id && Boolean(formik.errors.distribuidora_id)}>
        <InputLabel>Distribuidoras</InputLabel>
        <Select name="distribuidora_id" value={formik.values.distribuidora_id} onChange={formik.handleChange} onBlur={formik.handleBlur}>
          {distributors?.map((distribuidora) => (
            <MenuItem key={distribuidora.id} value={distribuidora.id}>
              {distribuidora.nome}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.distribuidora_id && formik.errors.distribuidora_id && (
          <FormHelperText>{formik.errors.distribuidora_id}</FormHelperText>
        )}
      </FormControl>

      {/* Select Clientes */}
      <FormControl error={formik.touched.cliente_id && Boolean(formik.errors.cliente_id)}>
        <InputLabel>Clientes</InputLabel>
        <Select name="cliente_id" value={formik.values.cliente_id} onChange={formik.handleChange} onBlur={formik.handleBlur}>
          {clients?.map((cliente: any) => (
            <MenuItem key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.cliente_id && formik.errors.cliente_id && <FormHelperText>{formik.errors.cliente_id}</FormHelperText>}
      </FormControl>

      {/* Exibe o campo de status apenas na edição */}
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
