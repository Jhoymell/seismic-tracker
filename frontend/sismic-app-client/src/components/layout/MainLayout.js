import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import LeftNav from './LeftNav';
import NewsPanel from './NewsPanel';
import Footer from './Footer';
import UserHeader from './UserHeader';
import useAuthStore from '../../store/authStore';
import './MainLayout.css';

// MainLayout: Estructura principal de la aplicación
// Incluye Header, navegación lateral, contenido principal, panel derecho y Footer
const MainLayout = ({ children }) => {
  // Obtiene el estado de autenticación del usuario
  const { isAuthenticated } = useAuthStore();

  return (
    // Contenedor principal con layout vertical y altura mínima de pantalla completa
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header superior */}
      <Header />
      {/* Zona central: navegación lateral, contenido principal y panel derecho */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Menú lateral izquierdo */}
        <LeftNav />
        {/* Contenido principal de la página con scroll vertical */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
          {children}
        </Box>
        {/* --- SOLUCIÓN DE VISIBILIDAD --- */}
        {isAuthenticated && (
          <Box 
            component="aside"
            sx={{ 
              width: 280, 
              borderLeft: '1px solid', 
              borderColor: 'divider', 
              display: 'flex', 
              flexDirection: 'column' 
            }}
          >
            <UserHeader />
            <NewsPanel />
          </Box>
        )}
      </Box>
      {/* Footer fijo al final */}
      <Footer />
    </Box>
  );
};

export default MainLayout;