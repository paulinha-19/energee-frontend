import * as yup from 'yup';

export const AddUsinaSchema = yup.object().shape({
  uc: yup.string().required('O campo UC é obrigatório'),
  nome: yup.string().required('O campo nome é obrigatório'),
  potencia: yup.string().required('O campo potência é obrigatório'),
  geracao_media: yup.string().required('O campo geração média é obrigatório'),
  fonte: yup.string().required('O campo fonte é obrigatório'),
  data_contrato: yup.date().required('O campo data de contrato é obrigatório'),
  vencimento_contrato: yup.date().required('O campo vencimento de contrato é obrigatório'),
  imposto: yup.string().required('O campo imposto é obrigatório'),
  desconto_gestao: yup.string().required('O campo desconto de gestão é obrigatório'),
  ponta: yup.boolean().required('O campo ponta é obrigatório'),
  status: yup.boolean().required('O campo status é obrigatório'),
  consumidores_exclusivos: yup.boolean().required('O campo consumidores exclusivos é obrigatório'),
  administrador_id: yup.number().optional(),
  distribuidora_id: yup.number().nullable().required('Distribuidora é obrigatória'),
  cliente_id: yup.number().nullable().required('Cliente é obrigatório'),
  gerador_id: yup.number().nullable().required('Gerador é obrigatório')
});

export const EditUsinaSchema = yup.object().shape({
  nome: yup.string().required('O campo nome é obrigatório'),
  potencia: yup.string().required('O campo potência é obrigatório'),
  geracao_media: yup.string().required('O campo geração média é obrigatório'),
  fonte: yup.string().required('O campo fonte é obrigatório'),
  data_contrato: yup.date().required('O campo data de contrato é obrigatório'),
  vencimento_contrato: yup.date().required('O campo vencimento de contrato é obrigatório'),
  imposto: yup.string().required('O campo imposto é obrigatório'),
  desconto_gestao: yup.string().required('O campo desconto de gestão é obrigatório'),
  ponta: yup.boolean().required('O campo ponta é obrigatório'),
  status: yup.boolean().required('O campo status é obrigatório'),
  consumidores_exclusivos: yup.boolean().required('O campo consumidores exclusivos é obrigatório'),
  distribuidora_id: yup.number().nullable().required('Distribuidora é obrigatória'),
  cliente_id: yup.number().nullable().required('Cliente é obrigatório'),
  gerador_id: yup.number().nullable().required('Gerador é obrigatório')
});
