import * as yup from 'yup';

export const AddClientSchema = yup.object().shape({
  nome: yup.string().min(3, 'O nome deve ter pelo menos 3 caracteres').required('O nome é obrigatório'),
  email: yup.string().email('Insira um email válido').required('Email é obrigatório'),
  password: yup.string().min(8, 'A senha deve ter no mínimo 8 caracteres').required('Senha é obrigatória'),
  telefone: yup
    .string()
    .matches(/^\d+$/, 'O telefone deve conter apenas números')
    .max(15, 'O telefone deve ter no máximo 15 dígitos')
    .required('O telefone é obrigatório'),
  endereco: yup.string().min(3, 'O endereço deve ter no mínimo 3 caracteres').required('O endereço é obrigatório'),
  distribuidoras: yup.array().of(yup.number()).min(1, 'Selecione pelo menos uma distribuidora').required('Distribuidoras são obrigatórias')
});

export const EditClientSchema = yup.object().shape({
  nome: yup.string().min(3, 'O nome deve ter pelo menos 3 caracteres').required('O nome é obrigatório'),
  email: yup.string().email('Insira um email válido').required('Email é obrigatório'),
  telefone: yup
    .string()
    .matches(/^\d+$/, 'O telefone deve conter apenas números')
    .max(15, 'O telefone deve ter no máximo 15 dígitos')
    .required('O telefone é obrigatório'),
  endereco: yup.string().min(3, 'O endereço deve ter no mínimo 3 caracteres').required('O endereço é obrigatório'),
  distribuidoras: yup.array().of(yup.number()).min(1, 'Selecione pelo menos uma distribuidora').required('Distribuidoras são obrigatórias'),
  status: yup.boolean().required('O status é obrigatório')
});
