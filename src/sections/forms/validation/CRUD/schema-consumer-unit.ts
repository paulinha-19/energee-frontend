import * as yup from 'yup';

export const AddConsumerUnitSchema = yup.object().shape({
  uc: yup.string().min(3, 'O uc deve ter pelo menos 3 caracteres').required('Uc é obrigatório'),
  nome: yup.string().min(3, 'O nome deve ter pelo menos 3 caracteres').required('O nome é obrigatório'),
  email: yup.string().email('Insira um email válido').required('Email é obrigatório'),
  password: yup.string().min(8, 'A senha deve ter no mínimo 8 caracteres').required('Senha é obrigatória'),
  telefone: yup
    .string()
    .matches(/^\d+$/, 'O telefone deve conter apenas números')
    .max(15, 'O telefone deve ter no máximo 15 dígitos')
    .required('O telefone é obrigatório'),
  endereco: yup.string().min(3, 'O endereço deve ter no mínimo 3 caracteres').required('O endereço é obrigatório'),
  distribuidora_id: yup.number().nullable().required('Distribuidora é obrigatória'),
  cliente_id: yup.number().nullable().required('Cliente é obrigatório'),
  usina_id: yup.string().optional(),
  concorrente: yup.boolean().required('O campo concorrente é obrigatório'),
  filial_mult: yup.string().min(5, 'O filial mult deve ter pelo menos 5 caracteres').required('Filial mult é obrigatório'),
  filial_sap: yup.string().min(6, 'O filial sap deve ter pelo menos 5 caracteres').required('Filial sap é obrigatório')
});

export const EditConsumerUnitSchema = yup.object().shape({
  uc: yup.string().min(3, 'O uc deve ter pelo menos 3 caracteres').required('Uc é obrigatório'),
  nome: yup.string().min(3, 'O nome deve ter pelo menos 3 caracteres').required('O nome é obrigatório'),
  email: yup.string().email('Insira um email válido').required('Email é obrigatório'),
  password: yup.string().min(8, 'A senha deve ter no mínimo 8 caracteres').required('Senha é obrigatória'),
  telefone: yup
    .string()
    .matches(/^\d+$/, 'O telefone deve conter apenas números')
    .max(15, 'O telefone deve ter no máximo 15 dígitos')
    .required('O telefone é obrigatório'),
  endereco: yup.string().min(3, 'O endereço deve ter no mínimo 3 caracteres').required('O endereço é obrigatório'),
  distribuidora_id: yup.number().nullable().required('Distribuidora é obrigatória'),
  cliente_id: yup.number().nullable().required('Cliente é obrigatório'),
  usina_id: yup.string().optional(),
  concorrente: yup.boolean().required('O campo concorrente é obrigatório'),
  filial_mult: yup.string().min(5, 'O filial mult deve ter pelo menos 5 caracteres').required('Filial mult é obrigatório'),
  filial_sap: yup.string().min(6, 'O filial sap deve ter pelo menos 5 caracteres').required('Filial sap é obrigatório'),
  status: yup.boolean().required('O campo status é obrigatório'),
});
