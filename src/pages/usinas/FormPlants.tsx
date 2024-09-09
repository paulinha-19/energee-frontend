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
import { editPlantsAdmin, postPlantsAdmin } from 'services';
import { EditPlants, InfoUser, PostPlants } from 'interfaces';
import { useFormik } from 'formik';
import { AddUsinaSchema, EditUsinaSchema } from 'sections/forms/validation/CRUD/schema-plants';
import { useSnackbar } from 'notistack';
import { SetStateAction, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface FormPlantsProps {
  plant?: any | null;
  isEditing: boolean;
  distributors: { id: number; nome: string }[];
  clients?: any[] | null;
  generators: any;
  onCancel: () => void;
  setOpenModal: (value: SetStateAction<boolean>) => void;
  user: InfoUser;
}

export default function FormPlants({ plant, isEditing, distributors, clients, generators, onCancel, setOpenModal, user }: FormPlantsProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [openSelect, setOpenSelect] = useState(false); // Estado para controlar o fechamento do Select
  const queryClient = useQueryClient();

  const formik = useFormik<PostPlants | EditPlants>({
    initialValues:
      isEditing && plant
        ? {
            nome: plant?.nome || '',
            uc: plant?.uc || '',
            potencia: plant?.potencia || '',
            geracao_media: plant?.geracao_media || '',
            fonte: plant?.fonte || '',
            data_contrato: plant?.data_contrato || '',
            vencimento_contrato: plant?.vencimento_contrato || '',
            imposto: plant?.imposto || '',
            desconto_gestao: plant?.desconto_gestao || '',
            ponta: plant?.ponta ?? true,
            status: plant?.status ?? true,
            consumidores_exclusivos: plant?.consumidores_exclusivos ?? true,
            distribuidora_id: plant?.distribuidora_id || null,
            cliente_id: plant?.cliente_id || null,
            gerador_id: plant?.gerador_id || null
          }
        : {
            nome: '',
            uc: '',
            potencia: '',
            geracao_media: '',
            fonte: '',
            data_contrato: '',
            vencimento_contrato: '',
            imposto: '',
            desconto_gestao: '',
            ponta: true,
            status: true,
            consumidores_exclusivos: true,
            administrador_id: user.id,
            distribuidora_id: null,
            cliente_id: null,
            gerador_id: null
          },
    validationSchema: isEditing ? EditUsinaSchema : AddUsinaSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      console.log('Submitting values:', values); // Verificar se o submit é chamado corretamente
      try {
        let response;
        if (isEditing) {
          response = await editPlantsAdmin(values as EditPlants, plant?.id as any);
        } else {
          response = await postPlantsAdmin(values as PostPlants);
        }
        queryClient.invalidateQueries({ queryKey: ['plants-crud'] });
        setOpenModal(false);
        enqueueSnackbar(response.msg || 'Dados da usina enviado com sucesso', {
          variant: 'success',
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        });
      } catch (error: any) {
        console.error('Erro ao enviar os dados da usina:', error);
        enqueueSnackbar(error?.detail || 'Erro ao enviar os dados da usina', {
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
        {isEditing ? 'Editar Usina' : 'Adicionar Usina'}
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
        label="Potência"
        name="potencia"
        value={formik.values.potencia}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.potencia && Boolean(formik.errors.potencia)}
        helperText={formik.touched.potencia && formik.errors.potencia}
        required
      />
      <TextField
        label="Geração media"
        name="geracao_media"
        value={formik.values.geracao_media}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.geracao_media && Boolean(formik.errors.geracao_media)}
        helperText={formik.touched.geracao_media && formik.errors.geracao_media}
        required
      />
      <FormControl error={formik.touched.fonte && Boolean(formik.errors.fonte)}>
        <InputLabel>Fonte</InputLabel>
        <Select name="fonte" value={formik.values.fonte} onChange={formik.handleChange} onBlur={formik.handleBlur}>
          <MenuItem value="SL">Solar</MenuItem>
          <MenuItem value="BG">Biogás</MenuItem>
        </Select>
        {formik.touched.fonte && formik.errors.fonte && <FormHelperText>{formik.errors.fonte}</FormHelperText>}
      </FormControl>
      <InputLabel id="data_contrato">Data do contrato</InputLabel>
      <TextField
        type="date"
        name="data_contrato"
        value={formik.values.data_contrato}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.data_contrato && Boolean(formik.errors.data_contrato)}
        helperText={formik.touched.data_contrato && formik.errors.data_contrato}
        required
      />
      <InputLabel id="vencimento_contrato">Vencimento do contrato</InputLabel>
      <TextField
        type="date"
        name="vencimento_contrato"
        value={formik.values.vencimento_contrato}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.vencimento_contrato && Boolean(formik.errors.vencimento_contrato)}
        helperText={formik.touched.vencimento_contrato && formik.errors.vencimento_contrato}
        required
      />
      <TextField
        label="Imposto"
        name="imposto"
        value={formik.values.imposto}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.imposto && Boolean(formik.errors.imposto)}
        helperText={formik.touched.imposto && formik.errors.imposto}
        required
      />
      <TextField
        label="Desconto de gestão"
        name="desconto_gestao"
        value={formik.values.desconto_gestao}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.desconto_gestao && Boolean(formik.errors.desconto_gestao)}
        helperText={formik.touched.desconto_gestao && formik.errors.desconto_gestao}
        required
      />
      {/* Status */}
      <FormControl component="fieldset">
        <FormLabel component="legend">Status</FormLabel>
        <RadioGroup
          aria-label="status"
          name="status"
          value={formik.values.status ? true : false}
          onChange={(e) => formik.setFieldValue('status', e.target.value === 'true')}
        >
          <FormControlLabel value="true" control={<Radio />} label="Ativo" />
          <FormControlLabel value="false" control={<Radio />} label="Inativo" />
        </RadioGroup>
      </FormControl>
      {/* Ponta */}
      <FormControl component="fieldset">
        <FormLabel component="legend">Ponta</FormLabel>
        <RadioGroup
          aria-label="ponta"
          name="ponta"
          value={formik.values.ponta ? true : false}
          onChange={(e) => formik.setFieldValue('ponta', e.target.value === 'true')}
        >
          <FormControlLabel value="true" control={<Radio />} label="Ativo" />
          <FormControlLabel value="false" control={<Radio />} label="Inativo" />
        </RadioGroup>
      </FormControl>
      {/* Consumidores exclusivos */}
      <FormControl component="fieldset">
        <FormLabel component="legend">Consumidores exclusivos</FormLabel>
        <RadioGroup
          aria-label="consumidores_exclusivos"
          name="consumidores_exclusivos"
          value={formik.values.consumidores_exclusivos ? true : false}
          onChange={(e) => formik.setFieldValue('consumidores_exclusivos', e.target.value === 'true')}
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
      {/* Select Gerador */}
      <FormControl error={formik.touched.gerador_id && Boolean(formik.errors.gerador_id)}>
        <InputLabel>Gerador</InputLabel>
        <Select name="gerador_id" value={formik.values.gerador_id} onChange={formik.handleChange} onBlur={formik.handleBlur}>
          {generators?.map((gerador: any) => (
            <MenuItem key={gerador.id} value={gerador.id}>
              {gerador.nome}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.gerador_id && formik.errors.gerador_id && <FormHelperText>{formik.errors.gerador_id}</FormHelperText>}
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
