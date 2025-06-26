import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir a la página de login
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizar el componente de la ruta
  return <Outlet />;
};

export default ProtectedRoute;