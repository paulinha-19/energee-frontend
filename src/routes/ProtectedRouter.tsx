import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

type ProtectedRouteProps = {
  element: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
