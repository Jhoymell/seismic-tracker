import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const LeftNav = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/mapa">Mapa de Sismos</Link></li>
            <li><Link to="/perfil">Mi Perfil</Link></li>
            {/* Podríamos añadir lógica para el link de admin si user.tipo === 'ADMINISTRADOR' */}
            <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Iniciar Sesión</Link></li>
            <li><Link to="/registro">Registrarse</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default LeftNav;