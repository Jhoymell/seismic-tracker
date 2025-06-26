import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const LeftNav = () => {
  // Ahora 'user' se está utilizando, por lo que la advertencia desaparecerá
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

            {/* Lógica para mostrar el enlace de admin */}
            {user && user.tipo_usuario === 'ADMINISTRADOR' && (
              <li><Link to="/admin">Panel Admin</Link></li>
            )}

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