import React, { createContext, useEffect, useState } from 'react';
import axiosServices from 'utils/axios';
import { InfoUser } from 'interfaces';
import { getUserData } from 'services';

type JWTContextType = {
  isLoggedIn: boolean;
  user: InfoUser | null;
  logout: () => void;
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
          console.log("response", response);
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
    } catch (error) {
      console.error('Login failed:', error);
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

  return (
    <JWTContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
      }}
    >
      {children}
    </JWTContext.Provider>
  );
};

export default JWTContext;
