import axiosServices from 'utils/axios';

export const refreshToken = async (refreshToken: string | null, originalRequest: any): Promise<any> => {
  try {
    // Tenta renovar o token usando o refresh token
    const response = await axiosServices.post('auth/jwt/refresh/', { refresh: refreshToken });
    const newAccessToken = response.data.access;

    // Armazena o novo token de acesso
    localStorage.setItem('accessToken', newAccessToken);

    // Atualiza o header para as futuras requisições
    axiosServices.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

    // Reenvia a requisição original com o novo token
    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
    return axiosServices(originalRequest); // Tenta novamente a requisição original
  } catch (error) {
    // Se houver falha, redireciona o usuário para a página de login
    console.error('Erro ao tentar renovar o token:', error);

    // Remove os tokens inválidos
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Redireciona para a página de login
    alert('Sua sessão expirou. Por favor, faça login novamente.');
    window.location.href = '/login';
    throw error; // Lança o erro para controle
  }
};