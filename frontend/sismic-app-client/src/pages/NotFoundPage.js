import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PageTransition from '../components/utils/PageTransition';
import { commonStyles, gradients } from '../styles/commonStyles';

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
          background: gradients.primaryBackground,
          borderRadius: '1rem',
          boxShadow: '0 2px 16px 0 #00bcd422',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            ...commonStyles.pageTitle,
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' },
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
            ...commonStyles.primaryButton,
            px: 3,
          }}
        >
          Volver al inicio
        </Button>
      </Box>
    </PageTransition>
  );
};

export default NotFoundPage;