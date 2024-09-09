import axios, { AxiosRequestConfig } from 'axios';
import { refreshToken } from 'services/auth';

const axiosServices = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for API calls (add token to header)
axiosServices.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor for API calls (handle errors)
axiosServices.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    const errorMessages = [
      "O token Ã© invÃ¡lido ou expirado",
      "O token é inválido ou expirado",
      "Signature has expired",
      "Falha na autenticaÃ§Ã£o",
      "Falha na autenticação"
    ];
    const dataResponse = JSON.stringify(error.response.data);
    if (
      (error.response.status === 401 || error.response.status === 500) && errorMessages.some((msg) => dataResponse.includes(msg))) {
      originalRequest._retry = true;
      // Verifica se a mensagem de erro contém "O token é inválido ou expirado"
      console.log('Token inválido ou expirado. Tentando atualizar o token...');
      const refreshT = localStorage.getItem('refreshToken');
      if (refreshT) {
        await refreshToken(refreshT, originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.post(url, { ...config });

  return res.data;
};

export default axiosServices;
