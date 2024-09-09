import * as yup from 'yup';

export const AddGeneratorSchema = yup.object().shape({
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
  cpf_cnpj: yup.string().required('O CPF/CNPJ é obrigatório'),
  cliente_id: yup.number().required('Cliente é obrigatório'),
  distribuidora_id: yup.number().required('Distribuidora é obrigatória')
});

export const EditGeneratorSchema = yup.object().shape({
  nome: yup.string().min(3, 'O nome deve ter pelo menos 3 caracteres').required('O nome é obrigatório'),
  email: yup.string().email('Insira um email válido').required('Email é obrigatório'),
  password: yup.string().min(8, 'A senha deve ter no mínimo 8 caracteres').required('Senha é obrigatória'),
  telefone: yup
    .string()
    .matches(/^\d+$/, 'O telefone deve conter apenas números')
    .max(15, 'O telefone deve ter no máximo 15 dígitos')
    .required('O telefone é obrigatório'),
  endereco: yup.string().min(3, 'O endereço deve ter no mínimo 3 caracteres').required('O endereço é obrigatório'),
  cpf_cnpj: yup.string().required('O CPF/CNPJ é obrigatório'),
  cliente_id: yup.number().required('Cliente é obrigatório'),
  distribuidora_id: yup.number().required('Distribuidora é obrigatória')
});
