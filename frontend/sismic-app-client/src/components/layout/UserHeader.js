import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';

/**
 * Componente UserHeader - Header del usuario en el panel lateral
 * 
 * Funcionalidades:
 * - Muestra avatar del usuario (foto de perfil o iniciales)
 * - Información básica del usuario (nombre y username)
 * - Animación hover en el avatar
 * - Diseño consistente con el tema de la aplicación
 * - Manejo automático de URL de imágenes del backend
 * 
 * Renderizado condicional:
 * - Solo se muestra si hay un usuario autenticado
 * - Fallback a iniciales si no hay foto de perfil
 * 
 * @returns {JSX.Element|null} UserHeader component o null si no hay usuario
 */

// URL base del backend para construir rutas completas de imágenes
const BACKEND_URL = 'http://127.0.0.1:8000';

const UserHeader = () => {
  const { user } = useAuthStore();
  
  // No renderizar si no hay usuario autenticado
  if (!user) {
    return null;
  }

  // Construir URL completa de la imagen de perfil
  const avatarSrc = user.ruta_fotografia ? `${BACKEND_URL}${user.ruta_fotografia}` : null;
  
  // Obtener iniciales del usuario para fallback del avatar
  const userInitials = user.first_name ? user.first_name.charAt(0).toUpperCase() : '?';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        borderBottom: '1px solid',
        borderColor: 'divider',
        // Gradiente consistente con el diseño de la aplicación
        background: 'linear-gradient(135deg, #0a121e 80%, #10131a 100%)',
        color: '#e3f7fa',
        marginBottom: '1px'
      }}
    >
      {/* Avatar con animación hover */}
      <motion.div 
        whileHover={{ scale: 1.06 }} 
        transition={{ duration: 0.2 }}
      >
        <Avatar
          src={avatarSrc}
          sx={{
            width: 48,
            height: 48,
            mr: 2,
            bgcolor: 'secondary.main',
            boxShadow: '0 2px 16px 0 #00bcd422',
            border: '2px solid rgba(0,188,212,0.55)'
          }}
        >
          {userInitials}
        </Avatar>
      </motion.div>
      
      {/* Información del usuario */}
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            m: 0,
            // Gradiente de texto consistente con el tema
            background: 'linear-gradient(90deg, #2196f3, #00bcd4, #00e5ff, #2196f3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.3px'
          }}
        >
          {user.first_name}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ color: '#b3e5fc' }}
        >
          {user.username}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserHeader;