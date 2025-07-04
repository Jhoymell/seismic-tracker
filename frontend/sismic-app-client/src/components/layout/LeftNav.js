import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './LeftNav.css';

const LeftNav = () => {
  const { isAuthenticated, logout, user, isSidebarOpen, closeSidebar } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    closeSidebar(); // Cierra el menú al cerrar sesión
    navigate('/login');
  };

  const handleLinkClick = () => {
    closeSidebar(); // Cierra el menú al hacer clic en un enlace
  };

  return (
    <>
      <nav className={`left-nav ${isSidebarOpen ? 'open' : ''}`} onMouseLeave={closeSidebar}>
        <ul>
          <li><Link to="/" onClick={handleLinkClick}>Inicio</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/mapa" onClick={handleLinkClick}>Mapa de Sismos</Link></li>
              <li><Link to="/perfil" onClick={handleLinkClick}>Mi Perfil</Link></li>
              {user?.tipo_usuario === 'ADMINISTRADOR' && (
                <li><Link to="/admin" onClick={handleLinkClick}>Panel Admin</Link></li>
              )}
              <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={handleLinkClick}>Iniciar Sesión</Link></li>
              <li><Link to="/registro" onClick={handleLinkClick}>Registrarse</Link></li>
            </>
          )}
        </ul>
      </nav>
      {/* El backdrop es un fondo oscuro que aparece detrás del menú */}
      <div 
        className={`backdrop ${isSidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
      />
    </>
  );
};

export default LeftNav;