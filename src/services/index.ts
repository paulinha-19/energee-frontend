import { AxiosRequestConfig, Method } from 'axios';
import axiosServices from '../utils/axios';
import {
  FinancialDataAdmin,
  FinancialDataClient,
  ProductionDataClient,
  ProductionDataAdmin,
  InfoUser,
  DistributorResponse,
  CreateClientRequest,
  EditClientRequest,
  GetGenerators,
  PostGenerator,
  EditGenerator,
  PostPlants,
  EditPlants,
  PlantsResponse
} from 'interfaces';

export const httpRequest = async <T>(method: Method, url: string, data?: any, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await axiosServices.request<T>({
      method,
      url,
      data,
      params,
      ...config
    });

    return response.data;
  } catch (error: any) {
    // Treat error here
    throw error.response?.data || error.message;
  }
};

export const getChartProductionData = async (distribuidora: string | null, referencia: string | null): Promise<ProductionDataClient> => {
  return httpRequest<ProductionDataClient>('GET', 'dashboard/grafico_producao_cliente', null, {
    distribuidora_filtro: distribuidora,
    referencia_filtro: referencia
  });
};

export const getChartFinancialData = async (distribuidora: string | null, referencia: string | null): Promise<FinancialDataClient> => {
  return httpRequest<FinancialDataClient>('GET', 'dashboard/grafico_financeiro_cliente', null, {
    distribuidora_filtro: distribuidora,
    referencia_filtro: referencia
  });
};

export const getChartProductionDataAdmin = async (
  referencia_filtro: string | null,
  cliente_filtro: string | null,
  distribuidora_filtro: string | null
): Promise<ProductionDataAdmin> => {
  return httpRequest<ProductionDataAdmin>('GET', 'dashboard/grafico_producao', null, {
    referencia_filtro,
    cliente_filtro,
    distribuidora_filtro
  });
};

export const getChartFinancialDataAdmin = async (
  referencia_filtro: string | null,
  cliente_filtro: string | null,
  distribuidora_filtro: string | null
): Promise<FinancialDataAdmin> => {
  return httpRequest<FinancialDataAdmin>('GET', 'dashboard/grafico_financeiro', null, {
    referencia_filtro,
    cliente_filtro,
    distribuidora_filtro
  });
};

export const getInfoDashboard = async (
  referencia_filtro: string | null,
  cliente_filtro: string | null,
  distribuidora_filtro: string | null
): Promise<any> => {
  return httpRequest<any>(
    'GET',
    `dashboard?referencia_filtro=${referencia_filtro}&cliente_filtro=${cliente_filtro}&distribuidora_filtro=${distribuidora_filtro}`,
    null,
    null
  );
};

export const getDistributorData = async (id: string): Promise<any> => {
  return httpRequest<any>('GET', `distribuidoras/distribuidoras_cliente/${id}`, null, null);
};

export const postReferenceClientData = async (client: string | null, distribuidora: string | null): Promise<any> => {
  return httpRequest<any>(
    'POST',
    `relatorios/referencia_cliente`,
    {
      cliente: client,
      distribuidora: distribuidora
    },
    null
  );
};

// Specific function to get user data (role, id, etc.)
export const getUserData = async (): Promise<InfoUser> => {
  return httpRequest<InfoUser>('GET', 'usuarios/', null, null);
};

//CRUD distributors
export const getDistributor = async (page = 1, page_size = 10): Promise<DistributorResponse> => {
  return httpRequest<DistributorResponse>('GET', `distribuidoras/?page=${page}&page_size=${page_size}`, null, null);
};
export const patchDistributor = async (id: any, data: any): Promise<any> => {
  return httpRequest<any>('PATCH', `distribuidoras/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const deleteDistributor = async (id: any): Promise<any> => {
  return httpRequest<any>('DELETE', `distribuidoras/${id}`, null, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

//CRUD generators
export const getGenerator = async (page = 1, page_size = 10): Promise<GetGenerators> => {
  return httpRequest<GetGenerators>('GET', `usuarios/geradores/?page=${page}&page_size=${page_size}`, null, null);
};
export const getOneGenerator = async (id: any): Promise<any> => {
  return httpRequest<any>('GET', `usuarios/gerador/${id}`, null, null);
};
export const postGeneratorAdmin = async (data: any): Promise<PostGenerator> => {
  return httpRequest<PostGenerator>('POST', 'usuarios/geradores/', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const editGeneratorAdmin = async (data: any, id: any): Promise<EditGenerator> => {
  return httpRequest<EditGenerator>('PATCH', `usuarios/geradores/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const deleteGenerator = async (id: any): Promise<any> => {
  return httpRequest<any>('DELETE', `usuarios/geradores/${id}`, null, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// CRUD clients
export const getClientData = async (page = 1, page_size = 10): Promise<any> => {
  return httpRequest<any>('GET', `usuarios/clientes/?page=${page}&page_size=${page_size}`, null, null);
};
export const getOneClientData = async (id: any): Promise<any> => {
  return httpRequest<any>('GET', `usuarios/cliente/${id}`, null, null);
};
export const postCustomerData = async (data: CreateClientRequest): Promise<any> => {
  return httpRequest<any>('POST', 'usuarios/clientes/', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const editCustomerData = async (data: EditClientRequest, id: any): Promise<any> => {
  return httpRequest<any>('PATCH', `usuarios/clientes/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const deleteClientData = async (id: any): Promise<void> => {
  return httpRequest<void>('DELETE', `usuarios/clientes/${id}`, null, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// CRUD plants
export const getPlants = async (page = 1, page_size = 10): Promise<any> => {
  return httpRequest<any>('GET', `usinas/?page=${page}&page_size=${page_size}`, null, null);
};
export const getOnePlant = async (id: any): Promise<any> => {
  return httpRequest<any>('GET', `usinas/${id}`, null, null);
};
export const postPlantsAdmin = async (data: any): Promise<any> => {
  return httpRequest<any>('POST', 'usinas/', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const editPlantsAdmin = async (data: any, id: any): Promise<any> => {
  return httpRequest<any>('PATCH', `usinas/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const deletePlantsAdmin = async (id: any): Promise<any> => {
  return httpRequest<any>('DELETE', `usinas/${id}`, null, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

//CRUD consumer unit
export const getConsumerUnit = async (page = 1, page_size = 10): Promise<any> => {
  return httpRequest<any>('GET', `usuarios/unidade_consumidora/?page=${page}&page_size=${page_size}`, null, null);
};
export const getOneConsumerUnit = async (id: any): Promise<any> => {
  return httpRequest<any>('GET', `usuarios/unidade_consumidora/${id}`, null, null);
};
export const postConsumerUnitAdmin = async (data: any): Promise<any> => {
  return httpRequest<any>('POST', 'usuarios/unidade_consumidora/', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const editConsumerUnitAdmin = async (data: any, id: any): Promise<any> => {
  return httpRequest<any>('PATCH', `usuarios/unidade_consumidora/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const deleteConsumerUnitAdmin = async (id: any): Promise<any> => {
  return httpRequest<any>('DELETE', `usuarios/unidade_consumidora/${id}`, null, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
