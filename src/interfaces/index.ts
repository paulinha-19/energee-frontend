// Define as interfaces para o gráfico de produção
export interface ProductionDataAdmin {
  geracao: string[];
  consumo: string[];
  labels: string[];
}

export interface ProductionDataClient {
  consumo_mensal: string[];
  labels: string[];
}

// Define as interfaces para o gráfico financeiro
export interface FinancialDataAdmin {
  valor: string[];
  labels: string[];
}

export interface FinancialDataClient {
  valor_inicial: string[];
  valor_pago: string[];
  desconto: string[];
  labels: string[];
}

// Interface for the data of clients, reference and distributors
export interface SelectDashboard {
  id: number;
  name: string;
}

// Define the interface for client data - select dashboard
export interface Client {
  id: number;
  uc: string;
  nome: string;
  status: boolean;
}

export interface ClientResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  items: Client[];
}

// Define the interface for the user data returned by the API
export interface InfoUser {
  id: number;
  role: 'AD' | 'CL' | 'GE';
  nome: string;
  email: string;
}

export interface Distributor {
  id: number;
  nome: string;
  status: boolean;
}

export interface DistributorResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  items: Distributor[];
}

export interface DistributorEdit {
  status: boolean;
}

export interface DistributorEditResponse {
  msg: string;
  id: number;
  nome: string;
  status: boolean;
}

// CRUD client
export interface CreateClientRequest {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  password: string;
  status: boolean;
  distribuidoras: number[]; // Array with the IDs of the distribuitors
}

export interface EditClientRequest {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  status: boolean;
  distribuidoras: number[];
}

//CRUD generators
export interface Generators {
  id: number;
  uc: string;
  nome: string;
  status: true;
  cliente: string;
  distribuidora: string;
}

export interface GetGenerators {
  total_items: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  items: Generators[];
}

export interface PostGenerator {
  uc: string;
  nome: string;
  password: string;
  email: string;
  telefone: string;
  endereco: string;
  status: boolean;
  cpf_cnpj: string;
  cliente_id: string;
  distribuidora_id: string;
}

export interface EditGenerator {
  uc?: string;
  nome: string;
  email: string;
  endereco: string;
  telefone: string;
  cpf_cnpj: string;
  status: boolean;
  cliente_id: string;
  distribuidora_id: string;
}

//CRUD plants

export interface Plants {
  id: number;
  nome: string;
  uc: string;
  status: boolean;
  gerador?: string;
  distribuidora: string;
  fonte: string;
}

export interface PlantsResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  items: Plants[];
}

export interface PostPlants {
  uc: string;
  nome: string;
  potencia: string;
  geracao_media: string;
  fonte: string;
  data_contrato: string | null;
  vencimento_contrato: string | null;
  imposto: string;
  desconto_gestao: string;
  ponta: boolean;
  status: boolean;
  consumidores_exclusivos: boolean;
  administrador_id?: number | null;
  distribuidora_id: number | null;
  cliente_id: number | null;
  gerador_id: number | null;
}

export interface PlantsResponse {
  msg: string;
  id: number;
  nome: string;
  uc: string;
  potencia: string;
  geracao_media: string;
  fonte: string;
  data_contrato: string;
  vencimento_contrato: string;
  imposto: string;
  desconto_gestao: string;
  ponta: boolean;
  status: boolean;
  consumidores_exclusivos: boolean;
  administrador_id?: number | null;
  distribuidora_id: number | null;
  cliente_id: number | null;
  gerador_id: number | null;
}

export interface EditPlants {
  nome: string;
  uc: string;
  potencia: string;
  geracao_media: string;
  fonte: string;
  data_contrato: string;
  vencimento_contrato: string;
  imposto: string;
  desconto_gestao: string;
  ponta: boolean;
  status: boolean;
  consumidores_exclusivos: boolean;
  distribuidora_id: number | null;
  cliente_id: number | null;
  gerador_id: number | null;
}

//CRUD consumer unit
export interface PostConsumerUnit {
  telefone: string;
  endereco: string;
  uc: string;
  nome: string;
  email: string;
  password: string;
  distribuidora_id: string;
  cliente_id: string;
  concorrente: boolean;
  usina_id: string;
  filial_mult: string;
  filial_sap: string;
  status?: boolean;
}

export interface EditConsumerUnit {
  telefone: string;
  endereco: string;
  uc: string;
  nome: string;
  email: string;
  password: string;
  distribuidora_id: string;
  cliente_id: string;
  concorrente: boolean;
  usina_id: string;
  filial_mult: string;
  filial_sap: string;
  status: boolean;
}
