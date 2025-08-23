import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './LeftNav.css';

/**
 * Componente LeftNav - Barra lateral de navegación principal
 * 
 * Funcionalidades:
 * - Navegación responsiva con comportamiento adaptativo según el tamaño de pantalla
 * - En desktop: Se expande al hacer hover, se contrae automáticamente
 * - En móvil: Se abre/cierra con clic, incluye backdrop para cerrar
 * - Diferentes opciones de menú según el estado de autenticación
 * - Soporte para usuarios administradores
 * - Botón hamburguesa integrado con animación CSS
 * 
 * Estados:
 * - isSidebarOpen: Control global del sidebar (principalmente móvil)
 * - expanded: Control local de expansión (principalmente desktop)
 * 
 * @returns {JSX.Element} LeftNav component
 */
const LeftNav = () => {
  const { isAuthenticated, logout, user, isSidebarOpen, closeSidebar, toggleSidebar } = useAuthStore();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  /**
   * Maneja el cierre de sesión y navegación
   */
  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate('/login');
  };

  /**
   * Cierra el sidebar al hacer clic en un enlace (especialmente útil en móvil)
   */
  const handleLinkClick = () => {
    closeSidebar();
    setExpanded(false);
  };

  /**
   * Maneja el toggle del botón hamburguesa
   * - En móvil: usa el estado global del sidebar
   * - En desktop: usa el estado local de expansión
   */
  const handleToggleClick = () => {
    if (window.innerWidth <= 600) {
      toggleSidebar();
    } else {
      setExpanded(!expanded);
    }
  };

  /**
   * Expande el sidebar al hacer hover (solo en desktop)
   */
  const handleMouseEnter = () => {
    if (window.innerWidth > 600 && !isSidebarOpen) {
      setExpanded(true);
    }
  };

  /**
   * Contrae el sidebar al quitar el hover (solo en desktop)
   */
  const handleMouseLeave = () => {
    if (window.innerWidth > 600 && !isSidebarOpen) {
      setExpanded(false);
    }
  };

  /**
   * Limpia estados al cambiar el tamaño de ventana para evitar conflictos
   */
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

  return (
    <>
      {/* Barra lateral principal */}
      <nav
        className={`left-nav ${(isSidebarOpen || expanded) ? 'open expanded' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Encabezado con botón hamburguesa y título */}
        <div className="left-nav__header">
          <button 
            className="left-nav__toggle" 
            onClick={handleToggleClick}
            aria-label="Alternar menú lateral"
            title="Abrir/Cerrar menú"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <span className="nav-label app-title">Menú</span>
        </div>

        {/* Lista de navegación */}
        <ul>
          <li>
            <Link className="nav-item" to="/" onClick={handleLinkClick}>
              <span className="nav-label">Inicio</span>
            </Link>
          </li>

          {/* Opciones para usuarios autenticados */}
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
              {/* Opción exclusiva para administradores */}
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
            /* Opciones para usuarios no autenticados */
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
        aria-hidden="true"
      />
    </>
  );
};

export default LeftNav;