import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Importaciones de MUI para el tema y la normalización de CSS
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Importación para animaciones de página
import { AnimatePresence } from 'framer-motion';

// Importación de nuestro tema personalizado y el layout principal
import theme from './theme';
import MainLayout from './components/layout/MainLayout';

// Importación de todas nuestras páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

// Importación de nuestros componentes de rutas protegidas
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useInactivityTimeout from './hooks/useInactivityTimeout';




// Creamos un sub-componente para poder usar el hook 'useLocation'
// que es necesario para que AnimatePresence funcione con las rutas.
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const {logout, isAuthenticated} = useAuthStore();

  useInactivityTimeout(isAuthenticated ? logout : () => {},navigate, 20 * 60 * 1000); 

  return (
    <MainLayout>
      <AnimatePresence mode="wait">
        {/*
          La 'key' y 'location' son cruciales aquí. Le dicen a AnimatePresence
          que la página ha cambiado y que debe ejecutar las animaciones de salida/entrada.
        */}
        <Routes location={location} key={location.pathname}>
          {/* Rutas Públicas: Cualquiera puede acceder a ellas. */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          {/* Rutas Protegidas: Solo para usuarios autenticados. */}
          <Route element={<ProtectedRoute />}>
            <Route path="/mapa" element={<MapPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>

          {/* Ruta de Administrador: Solo para usuarios con rol de 'ADMINISTRADOR'. */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          
          {/* Ruta para páginas no encontradas */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </MainLayout>
  );
}


function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Envolvemos la app con el LocalizationProvider */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Router>
          {/* El componente AppContent contiene toda la lógica de renderizado
              para asegurar que se renderice una sola vez y de forma correcta. */}
          <AppContent />
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;