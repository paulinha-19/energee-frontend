import React, { createContext, useEffect, useState } from 'react';
import axiosServices from 'utils/axios';
import { InfoUser } from 'interfaces';
import { getUserData } from 'services';
import { enqueueSnackbar } from 'notistack';

type JWTContextType = {
  isLoggedIn: boolean;
  user: InfoUser | null;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
};

const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
  const [user, setUser] = useState<InfoUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // Use getUserData to fetch user data
      getUserData()
        .then((response) => {
          setUser(response); // Set the user data
          console.log('response', response);
          setIsLoggedIn(true);
        })
        .catch(() => {
          setIsLoggedIn(false);
          setUser(null);
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosServices.post('usuarios/login/', { email, password });
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      const userData = await getUserData(); // Use getUserData to fetch user data after login
      setUser(userData);
      setIsLoggedIn(true);
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Login failed:', error);
      enqueueSnackbar(error.response.data.detail || 'Falha ao realizar o login', {
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setUser(null);
    delete axiosServices.defaults.headers.common.Authorization;
    window.location.href = '/login';
  };

  const resetPassword = async (email: string) => {
    try {
      await axiosServices.post('/auth/users/reset_password/', { email });
      console.log('Password reset email sent');
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    // todo: this flow need to be recode as it not verified
  };

  return (
    <JWTContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        resetPassword,
        register
      }}
    >
      {children}
    </JWTContext.Provider>
  );
};

export default JWTContext;
