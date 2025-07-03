import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- PASO 1: IMPORTAR HERRAMIENTAS DE TEMA DE MUI ---
import { ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

import theme from './theme'; // Importar el tema personalizado

function App() {
  return (
    // --- PASO 3: ENVOLVER TODA LA APP CON EL THEMEPROVIDER ---
    <ThemeProvider theme={theme}>
      {/* CssBaseline es un componente opcional pero recomendado de MUI
          que normaliza los estilos en todos los navegadores. */}
      <CssBaseline />
      <Router>
        <MainLayout>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />

            {/* Rutas Protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/mapa" element={<MapPage />} />
              <Route path="/perfil" element={<ProfilePage />} />
            </Route>

            {/* Ruta de Administrador */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;