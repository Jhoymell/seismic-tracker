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
  CircularProgress,
  Alert,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';

// Importación para animaciones
import { motion } from 'framer-motion';

// Importación de la función de la API
import { requestPasswordReset } from '../api/auth';
import { 
  SectionBackground, 
  FormContainer, 
  GradientTitle,
  GradientSubtitle,
} from '../components/shared/StyledComponents';

// Esquema de validación
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Debe ser un correo válido")
    .required("El correo es obligatorio"),
});

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

  return (
    <SectionBackground>
      <Toaster position="top-center" />
      <FormContainer maxWidth="sm">
        <Box
          sx={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.2), rgba(0, 188, 212, 0.2))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            mx: 'auto',
            border: '2px solid rgba(33, 150, 243, 0.3)',
          }}
        >
          <LockResetIcon sx={{ fontSize: 40, color: '#2196f3' }} />
        </Box>
        
        <GradientTitle variant="h4" component="h1" sx={{ textAlign: 'center', mb: 1 }}>
          Recuperar Contraseña
        </GradientTitle>
        
        <GradientSubtitle sx={{ textAlign: 'center', mb: 4, fontSize: { xs: '1rem', md: '1.2rem' } }}>
          Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña
        </GradientSubtitle>

        {successMessage && (
          <Alert 
            severity="info" 
            sx={{ 
              width: '100%', 
              mb: 3,
              borderRadius: '12px',
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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
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
                background: 'linear-gradient(90deg, #2196f3, #00bcd4)',
                boxShadow: '0 4px 20px 0 rgba(33,150,243,0.15)',
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
      </FormContainer>
    </SectionBackground>
  );
};

export default ForgotPasswordPage;