import {
  Box,
  Button,
  Alert,
  TextField,
  FormControlLabel,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Distributor } from 'interfaces';

interface FormCustomerEditProps {
  initialData: {
    id?: number; // Campo id opcional
    name: string;
    email: string;
    phone: string;
    address: string;
    password?: string; // Campo senha opcional (para criação)
    distributor: string;
    status?: boolean; // Campo status opcional (para edição)
  };
  distributors: Distributor[];
  onSave: (data: any) => void;
  onCancel: () => void;
  isEditing: boolean; // Indica se o formulário é para edição ou criação
  apiErrors: any | null; // Objeto com os erros da API
}

export default function FormCustomerEdit({ initialData, distributors, onSave, onCancel, isEditing, apiErrors }: FormCustomerEditProps) {
  const formik = useFormik({
    initialValues: {
      id: initialData.id, // Inclua o id nos valores iniciais do Formik
      name: initialData.name,
      email: initialData.email,
      phone: initialData.phone,
      address: initialData.address,
      password: initialData.password || '', // Campo senha opcional
      distributor: initialData.distributor,
      status: initialData.status || true
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Nome é obrigatório'),
      email: Yup.string().email('Email inválido').required('Email é obrigatório'),
      phone: Yup.string()
        .matches(/^[0-9]+$/, 'O campo telefone deve conter apenas números')
        .max(15, 'O campo telefone deve ter no máximo 15 dígitos')
        .required('Telefone é obrigatório'),
      address: Yup.string().required('Endereço é obrigatório'),
      distributor: Yup.string().required('Distribuidora é obrigatória'),
      password: !isEditing
        ? Yup.string()
            .min(8, 'A senha deve ter pelo menos 8 caracteres')
            .matches(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
            .matches(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
            .matches(/[0-9]/, 'A senha deve conter pelo menos um número')
            .matches(/[!@#$%^&*(),.?":{}|<>]/, 'A senha deve conter pelo menos um caractere especial')
            .required('Senha é obrigatória')
        : Yup.string() // Validação de senha apenas na criação
    }),
    onSubmit: (values) => {
      const customerData = {
        ...values,
        id: initialData.id // Certifique-se de incluir o ID no objeto final, se estiver presente
      };
      onSave(customerData);
    }
  });

  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
      {apiErrors && (
        <Box sx={{ mb: 2 }}>
          {apiErrors.map((error: any, index: any) => (
            <Alert key={index} severity="error">
              {error}
            </Alert>
          ))}
        </Box>
      )}
      <TextField
        fullWidth
        label="Nome"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Endereço de e-mail"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Telefone"
        name="phone"
        value={formik.values.phone}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.phone && Boolean(formik.errors.phone)}
        helperText={formik.touched.phone && formik.errors.phone}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Endereço"
        name="address"
        value={formik.values.address}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.address && Boolean(formik.errors.address)}
        helperText={formik.touched.address && formik.errors.address}
        sx={{ mb: 2 }}
      />
      {!isEditing && (
        <TextField
          fullWidth
          label="Senha"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{ mb: 2 }}
        />
      )}
      <FormControl fullWidth sx={{ mb: 2 }} error={formik.touched.distributor && Boolean(formik.errors.distributor)}>
        <InputLabel>Distribuidoras</InputLabel>
        <Select name="distributor" value={formik.values.distributor} onChange={formik.handleChange} onBlur={formik.handleBlur}>
          {distributors.map((dist) => (
            <MenuItem key={dist.id} value={dist.id}>
              {dist.nome}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{formik.touched.distributor && formik.errors.distributor}</FormHelperText>
      </FormControl>
      {isEditing && (
        <RadioGroup row name="status" value={formik.values.status} onChange={formik.handleChange} onBlur={formik.handleBlur}>
          <FormControlLabel value={true} control={<Radio />} label="Ativo" />
          <FormControlLabel value={false} control={<Radio />} label="Inativo" />
        </RadioGroup>
      )}
      {formik.touched.status && formik.errors.status && <FormHelperText error>{formik.errors.status}</FormHelperText>}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" type="submit">
          Salvar
        </Button>
      </Box>
    </Box>
  );
}
