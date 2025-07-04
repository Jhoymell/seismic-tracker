// src/components/layout/UserHeader.js
import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import useAuthStore from '../../store/authStore';

// URL base de nuestro backend para construir la ruta completa de la imagen
const BACKEND_URL = 'http://127.0.0.1:8000';

const UserHeader = () => {
  const { user } = useAuthStore();
  const avatarSrc = user.ruta_fotografia ? `${BACKEND_URL}${user.ruta_fotografia}` : null;

  // Si no hay usuario, no renderizamos nada.
  if (!user) {
    return null;
  }

  

  // Obtiene las iniciales del nombre del usuario para el fallback del Avatar
  const userInitials = user.first_name ? user.first_name.charAt(0).toUpperCase() : '?';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        marginBottom: '1px' // Pequeña separación con el panel de noticias
      }}
    >
      <Avatar 
        src={avatarSrc} 
        sx={{ width: 48, height: 48, mr: 2, bgcolor: 'secondary.main' }}
      >
        {/* Esto solo se muestra si src es null (no hay foto) */}
        {userInitials} 
      </Avatar>
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {user.first_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.username}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserHeader;