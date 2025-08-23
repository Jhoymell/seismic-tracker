import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PageTransition from '../components/utils/PageTransition';
import { commonStyles } from '../styles/commonStyles';

const MotionBox = motion(Box);

const NotFoundPage = () => {
  const pageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <PageTransition>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <MotionBox
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          sx={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 4,
            background: 'linear-gradient(135deg, rgba(248, 253, 255, 0.1) 80%, rgba(227, 247, 250, 0.15) 100%)',
            borderRadius: '1.5rem',
            boxShadow: '0 8px 32px rgba(33, 150, 243, 0.15)',
            border: '1px solid rgba(33, 150, 243, 0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Icono principal */}
          <Box sx={{ mb: 3 }}>
            <ErrorOutlineIcon 
              sx={{ 
                fontSize: 80, 
                color: 'primary.main',
                opacity: 0.8
              }} 
            />
          </Box>

          {/* Título 404 */}
          <Typography
            variant="h2"
            sx={{
              ...commonStyles.pageTitle,
              mb: 2,
              fontSize: { xs: '3rem', md: '4rem' },
              fontWeight: 800,
              letterSpacing: '-0.5px',
            }}
          >
            404
          </Typography>

          {/* Subtítulo */}
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              color: 'text.primary',
              fontWeight: 600,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
            }}
          >
            Página no encontrada
          </Typography>

          {/* Descripción */}
          <Typography 
            variant="body1"
            sx={{ 
              color: 'text.secondary', 
              mb: 4,
              maxWidth: '500px',
              lineHeight: 1.6
            }}
          >
            Lo sentimos, la página que estás buscando no existe o ha sido movida. 
            Puedes regresar al inicio para continuar navegando.
          </Typography>

          {/* Botón de acción */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              component={Link}
              to="/"
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              sx={{
                ...commonStyles.primaryButton,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Volver al inicio
            </Button>
          </motion.div>
        </MotionBox>
      </Container>
    </PageTransition>
  );
};

export default NotFoundPage;