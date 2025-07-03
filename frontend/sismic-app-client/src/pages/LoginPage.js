import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Button, TextField, Box, Typography, Container, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion'; // <-- Importar motion

import { loginUser } from '../api/auth';
import useAuthStore from '../store/authStore';

const schema = yup.object().shape({
  email: yup.string().email('Debe ser un correo válido').required('El correo es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria'),
});

// Convertimos el Box de MUI en un componente animado
const MotionBox = motion(Box);

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid, dirtyFields } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      const tokens = await loginUser(data);
      login(tokens);
      toast.success('¡Bienvenido de nuevo!');
      navigate('/mapa');
    } catch (error) {
      toast.error('Correo o contraseña incorrectos.');
    }
  };

  // Definimos variantes para la animación del formulario
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
          backgroundColor: 'background.paper', // Usa colores del tema
          padding: { xs: 2, sm: 4 }, // Padding responsivo
          borderRadius: '1rem',
          boxShadow: 3,
        }}
      >
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Correo Electrónico"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Contraseña"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isValid || !dirtyFields.email || !dirtyFields.password || isSubmitting}
              sx={{ mt: 3, mb: 2, py: 1.5 }} // Padding vertical
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
            </Button>
          </motion.div>
          <Typography variant="body2" align="center">
            ¿No tienes una cuenta?{' '}
            <Link to="/registro" style={{ color: '#2196f3', textDecoration: 'none' }}>
              Regístrate aquí
            </Link>
          </Typography>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default LoginPage;