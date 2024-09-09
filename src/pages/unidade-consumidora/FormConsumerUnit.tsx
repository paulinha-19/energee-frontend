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
  Radio,
  FormLabel
} from '@mui/material';
import { editConsumerUnitAdmin, editPlantsAdmin, postConsumerUnitAdmin, postPlantsAdmin } from 'services';
import { EditConsumerUnit, EditPlants, InfoUser, PostConsumerUnit, PostPlants } from 'interfaces';
import { useFormik } from 'formik';
import { AddUsinaSchema, EditUsinaSchema } from 'sections/forms/validation/CRUD/schema-plants';
import { useSnackbar } from 'notistack';
import { SetStateAction, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AddConsumerUnitSchema, EditConsumerUnitSchema } from 'sections/forms/validation/CRUD/schema-consumer-unit';

interface FormConsumerUnitProps {
  consumerUnit?: any | null;
  isEditing: boolean;
  distributors: { id: number; nome: string }[];
  clients?: any[] | null;
  plants: any;
  onCancel: () => void;
  setOpenModal: (value: SetStateAction<boolean>) => void;
}

export default function FormConsumerUnit({
  consumerUnit,
  isEditing,
  distributors,
  clients,
  onCancel,
  setOpenModal,
  plants
}: FormConsumerUnitProps) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const formik = useFormik<PostConsumerUnit | EditConsumerUnit>({
    initialValues:
      isEditing && consumerUnit
        ? {
            endereco: consumerUnit?.endereco || '',
            telefone: consumerUnit?.telefone || '',
            uc: consumerUnit?.uc || '',
            password: consumerUnit?.password || '',
            nome: consumerUnit?.nome || '',
            email: consumerUnit?.email || '',
            distribuidora_id: consumerUnit?.distribuidora_id || '',
            cliente_id: consumerUnit?.cliente_id || '',
            concorrente: consumerUnit?.concorrente || false,
            usina_id: consumerUnit?.usina_id || '',
            filial_mult: consumerUnit?.filial_mult || '',
            filial_sap: consumerUnit?.filial_sap || '',
            status: consumerUnit?.status ?? true
          }
        : {
            endereco: '',
            telefone: '',
            uc: '',
            nome: '',
            email: '',
            password: '',
            distribuidora_id: '',
            cliente_id: '',
            concorrente: false,
            usina_id: '',
            filial_mult: '',
            filial_sap: ''
          },
    validationSchema: isEditing ? EditConsumerUnitSchema : AddConsumerUnitSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      console.log('Submitting values:', values);

      try {
        let response;

        // Condicional para transformar o formato dos dados conforme o método
        const transformedValues = {
          ...values,
          usina_id: isEditing ? Number(values.usina_id) : String(values.usina_id), // Corrige `usina_id`
          status: isEditing ? Boolean(values.status) : undefined // Certifica que `status` só é enviado em edição
        };

        if (isEditing) {
          // PATCH para editar a unidade consumidora
          response = await editConsumerUnitAdmin(transformedValues as EditConsumerUnit, consumerUnit?.id as any);
        } else {
          // POST para adicionar uma nova unidade consumidora
          response = await postConsumerUnitAdmin(transformedValues as PostConsumerUnit);
        }

        queryClient.invalidateQueries({ queryKey: ['consumer-units-crud'] });
        setOpenModal(false);
        enqueueSnackbar(response.msg || 'Dados da unidade consumidora enviados com sucesso', {
          variant: 'success',
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        });
      } catch (error: any) {
        console.error('Erro ao enviar os dados da unidade consumidora:', error);
        enqueueSnackbar(error?.detail || 'Erro ao enviar os dados da unidade consumidora', {
          variant: 'error',
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        });
        setOpenModal(false);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} onSubmit={formik.handleSubmit}>
      <Typography variant="h4" component="div" gutterBottom>
        {isEditing ? 'Editar Unidade' : 'Adicionar Unidade'}
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
        label="Email"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        required
      />
      <TextField
        type="password"
        label="Password"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        required
      />
      {/* Status */}
      {isEditing && (
        <FormControl component="fieldset">
          <FormLabel component="legend">Status</FormLabel>
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
      {/* Unidade concorrente */}
      <FormControl component="fieldset">
        <FormLabel component="legend">Unidade concorrente</FormLabel>
        <RadioGroup
          aria-label="concorrente"
          name="concorrente"
          value={formik.values.concorrente ? true : false}
          onChange={(e) => formik.setFieldValue('concorrente', e.target.value === 'true')}
        >
          <FormControlLabel value="true" control={<Radio />} label="Ativo" />
          <FormControlLabel value="false" control={<Radio />} label="Inativo" />
        </RadioGroup>
      </FormControl>
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
