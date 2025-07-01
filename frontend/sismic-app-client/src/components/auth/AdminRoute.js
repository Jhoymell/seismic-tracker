import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const AdminRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.tipo_usuario !== 'ADMINISTRADOR') {
    // Si el usuario está logueado pero no es admin, lo mandamos al mapa
    return <Navigate to="/mapa" replace />;
  }

  return <Outlet />; // Si es admin, renderiza la página
};

export default AdminRoute;