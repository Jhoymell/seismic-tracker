// src/components/layout/UserHeader.js
import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import { motion } from 'framer-motion'; // agregado
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
        // Estilo consistente con HomePage
        background: 'linear-gradient(135deg, #0a121e 80%, #10131a 100%)',
        color: '#e3f7fa',
        marginBottom: '1px'
      }}
    >
      <motion.div whileHover={{ scale: 1.06 }} transition={{ duration: 0.2 }}>
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
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            m: 0,
            background: 'linear-gradient(90deg, #2196f3, #00bcd4, #00e5ff, #2196f3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.3px'
          }}
        >
          {user.first_name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#b3e5fc' }}>
          {user.username}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserHeader;