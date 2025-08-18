import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PageTransition from '../components/utils/PageTransition';

const NotFoundPage = () => {
  return (
    <PageTransition>
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 3,
          background: 'linear-gradient(135deg, #0a121e 80%, #10131a 100%)',
          borderRadius: '1rem',
          boxShadow: '0 2px 16px 0 #00bcd422',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            background: 'linear-gradient(90deg, #2196f3, #00bcd4, #00e5ff, #2196f3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 800,
            letterSpacing: '-0.5px',
          }}
        >
          404 - Página no encontrada
        </Typography>
        <Typography sx={{ color: '#b3e5fc', mb: 3 }}>
          La ruta que intentas acceder no existe.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          sx={{
            borderRadius: '12px',
            fontWeight: 700,
            px: 3,
            background: 'linear-gradient(90deg, #2196f3, #00bcd4)',
            boxShadow: '0 4px 20px 0 rgba(33,150,243,0.15)',
            '&:hover': {
              background: 'linear-gradient(90deg, #00bcd4, #2196f3)',
              boxShadow: '0 8px 32px 0 rgba(33,150,243,0.25)',
            },
          }}
        >
          Volver al inicio
        </Button>
      </Box>
    </PageTransition>
  );
};

export default NotFoundPage;