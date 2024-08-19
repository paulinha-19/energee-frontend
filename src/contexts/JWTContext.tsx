import React, { createContext, useEffect, useState } from 'react';
import axios from 'utils/axios';
import { JWTContextType, UserProfile } from 'types/auth';

const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('usuarios/login/', { email, password });
      const { access, refresh } = response.data;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh)
      axios.defaults.headers.common.Authorization = `Bearer ${access}`;

      setIsLoggedIn(true);
      setUser({ email });
      window.location.href = "/dashboard";
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
    delete axios.defaults.headers.common.Authorization;
    window.location.href = "/login";
  };

  const resetPassword = async (email: string) => {
    try {
      await axios.post('/auth/users/reset_password/', { email });
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
        isInitialized,
        user,
        login,
        logout,
        resetPassword
      }}
    >
      {children}
    </JWTContext.Provider>
  );
};

export default JWTContext;