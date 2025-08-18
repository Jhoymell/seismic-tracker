import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './LeftNav.css';

const LeftNav = () => {
  const { isAuthenticated, logout, user, isSidebarOpen, closeSidebar } = useAuthStore();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate('/login');
  };

  const handleLinkClick = () => {
    closeSidebar();
  };

  // Ajusta el offset global del layout para que el sidebar no tape el contenido
  useEffect(() => {
    const updateOffset = () => {
      const isDesktop = window.matchMedia('(min-width: 900px)').matches;
      const collapsedDesktop = '72px';
      const collapsedMobile = '64px';
      const expandedDesktop = '260px';

      const offset = isDesktop
        ? ((isSidebarOpen || expanded) ? expandedDesktop : collapsedDesktop)
        : collapsedMobile; // en mobile no empuja el contenido cuando se expande (overlay)

      document.documentElement.style.setProperty('--sidebar-offset', offset);
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, [expanded, isSidebarOpen]);

  return (
    <>
      <nav
        className={`left-nav ${isSidebarOpen || expanded ? 'open expanded' : ''}`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => {
          setExpanded(false);
          closeSidebar();
        }}
      >
        {/* Encabezado con ícono hamburguesa y título */}
        <div className="left-nav__header">
          <button className="left-nav__toggle" aria-label="Menú lateral">
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