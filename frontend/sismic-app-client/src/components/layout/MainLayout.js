import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import LeftNav from './LeftNav';
import NewsPanel from './NewsPanel';
import Footer from './Footer';
import UserHeader from './UserHeader';
import useAuthStore from '../../store/authStore';

const MainLayout = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      // Forzamos a que el layout principal ocupe exactamente el 100% de la altura de la ventana
      height: '100vh', 
    }}>
      <Header />
      {/* Este Box contendrá las columnas laterales y el contenido principal */}
      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1, 
        // --- CAMBIO CLAVE 1: Evitamos que este contenedor se desborde ---
        overflow: 'hidden' 
      }}>
        <LeftNav />
        
        {/* Este Box es el área de contenido principal */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            // --- CAMBIO CLAVE 2: Le decimos que solo él debe tener scroll si es necesario ---
            overflowY: 'auto' 
          }}
        >
          {children}
        </Box>
        
        {/* Este Box es el panel derecho completo */}
        {isAuthenticated && (
          <Box 
            component="aside"
            sx={{ 
              width: 280, 
              borderLeft: '1px solid', 
              borderColor: 'divider', 
              display: 'flex', 
              flexDirection: 'column',
              // Hacemos que también tenga su propio scroll si su contenido es muy largo
              overflowY: 'auto' 
            }}
          >
            <UserHeader />
            <NewsPanel />
          </Box>
        )}
      </Box>
      {/* El Footer ahora está fuera del contenedor con scroll, por lo que no se moverá */}
    </Box>
  );
};

export default MainLayout;