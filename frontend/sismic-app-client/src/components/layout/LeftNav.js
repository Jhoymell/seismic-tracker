import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './LeftNav.css';

const LeftNav = () => {
  const { isAuthenticated, logout, user, isSidebarOpen, closeSidebar, toggleSidebar } = useAuthStore();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate('/login');
  };

  const handleLinkClick = () => {
    closeSidebar();
    setExpanded(false);
  };

<<<<<<< HEAD
=======
  const handleToggleClick = () => {
    if (window.innerWidth <= 600) {
      // En móvil, usar el estado global del sidebar
      toggleSidebar();
    } else {
      // En desktop/tablet, usar el estado local de expansión
      setExpanded(!expanded);
    }
  };

  // Mejorar la gestión del hover en desktop
  const handleMouseEnter = () => {
    if (window.innerWidth > 600 && !isSidebarOpen) {
      setExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 600 && !isSidebarOpen) {
      setExpanded(false);
    }
  };

  // Limpiar estados al cambiar tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 600) {
        closeSidebar(); // Cerrar sidebar móvil si estaba abierto
      } else {
        setExpanded(false); // Cerrar expansión desktop si estaba abierta
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [closeSidebar]);

>>>>>>> 5616187fc8f3c0555c2fc5c1a994722a8e24d155
  return (
    <>
      <nav
        className={`left-nav ${(isSidebarOpen || expanded) ? 'open expanded' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Encabezado con ícono hamburguesa y título */}
        <div className="left-nav__header">
          <button 
            className="left-nav__toggle" 
            onClick={handleToggleClick}
            aria-label="Alternar menú lateral"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <span className="nav-label app-title">Menú</span>
        </div>

        <ul>
          <li>
            <Link className="nav-item" to="/" onClick={handleLinkClick}>
              <span className="nav-label">Inicio</span>
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link className="nav-item" to="/mapa" onClick={handleLinkClick}>
                  <span className="nav-label">Mapa de Sismos</span>
                </Link>
              </li>
              <li>
                <Link className="nav-item" to="/perfil" onClick={handleLinkClick}>
                  <span className="nav-label">Mi Perfil</span>
                </Link>
              </li>
              {user?.tipo_usuario === 'ADMINISTRADOR' && (
                <li>
                  <Link className="nav-item" to="/admin" onClick={handleLinkClick}>
                    <span className="nav-label">Panel Admin</span>
                  </Link>
                </li>
              )}
              <li>
                <button className="nav-item" onClick={handleLogout}>
                  <span className="nav-label">Cerrar Sesión</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link className="nav-item" to="/login" onClick={handleLinkClick}>
                  <span className="nav-label">Iniciar Sesión</span>
                </Link>
              </li>
              <li>
                <Link className="nav-item" to="/registro" onClick={handleLinkClick}>
                  <span className="nav-label">Registrarse</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Backdrop para cerrar en móviles/tablets cuando está abierto */}
      <div
        className={`backdrop ${isSidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
      />
    </>
  );
};

export default LeftNav;