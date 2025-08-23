import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

// Importaciones de MUI
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';

// Importación para animaciones
import { motion } from 'framer-motion';

// Importación de la función de la API
import { requestPasswordReset } from '../api/auth';

// Esquema de validación
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Debe ser un correo válido")
    .required("El correo es obligatorio"),
});

// Componente Box animado
const MotionBox = motion(Box);

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const [successMessage, setSuccessMessage] = useState('');

  // Manejo del envío del formulario
  const onSubmit = async (data) => {
    try {
      await requestPasswordReset(data.email);
      setSuccessMessage('Si existe una cuenta con ese correo, recibirás las instrucciones para restablecer tu contraseña.');
      toast.success('Solicitud enviada correctamente');
    } catch (error) {
      // No mostramos error específico por seguridad
      setSuccessMessage('Si existe una cuenta con ese correo, recibirás las instrucciones para restablecer tu contraseña.');
      toast.success('Solicitud enviada correctamente');
    }
  };

  // Variantes de animación
  const formVariants = {
    hidden: { 
      opacity: 0, 
      y: 20
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      } 
    },
  };

  return (
    <Container component="main" maxWidth="xs">
      <Toaster position="top-center" />
      
      <MotionBox
        variants={formVariants}
        initial="hidden"
        animate="visible"
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'background.paper',
          padding: { xs: 3, sm: 4 },
          borderRadius: '1.5rem',
          boxShadow: '0 8px 32px rgba(33, 150, 243, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(33, 150, 243, 0.1)',
          background: 'linear-gradient(135deg, rgba(248, 253, 255, 0.1) 80%, rgba(227, 247, 250, 0.15) 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #2196f3, #00bcd4, #00e5ff)',
          },
        }}
      >
        <Box
          sx={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <LockResetIcon color="primary" sx={{ fontSize: 35 }} />
        </Box>
        
        <Typography 
          component="h1" 
          variant="h5" 
          sx={{ 
            mb: 2,
            fontWeight: 800,
            background: 'linear-gradient(90deg, #2196f3, #00bcd4, #00e5ff, #2196f3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.3px',
            filter: 'drop-shadow(0 2px 12px #00e5ff33)',
          }}
        >
          Recuperar Contraseña
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center" 
          sx={{ mb: 3 }}
        >
          Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
        </Typography>

        {successMessage && (
          <Alert 
            severity="info" 
            sx={{ 
              width: '100%', 
              mb: 3,
              '& .MuiAlert-icon': {
                fontSize: '24px'
              }
            }}
            elevation={1}
          >
            {successMessage}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Correo Electrónico"
            autoComplete="email"
            autoFocus
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={!!successMessage}
          />

          <motion.div whileHover={!successMessage && { scale: 1.02 }} whileTap={!successMessage && { scale: 0.98 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 700,
                boxShadow: '0 4px 20px 0 rgba(33,150,243,0.15)',
                background: 'linear-gradient(90deg, #2196f3, #00bcd4)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #00bcd4, #2196f3)',
                  boxShadow: '0 8px 32px 0 rgba(33,150,243,0.25)',
                },
              }}
              disabled={isSubmitting || !!successMessage}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Enviar Instrucciones"
              )}
            </Button>
          </motion.div>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            <Link
              to="/login"
              style={{ color: '#2196f3', textDecoration: 'none' }}
            >
              Volver al inicio de sesión
            </Link>
          </Typography>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default ForgotPasswordPage;