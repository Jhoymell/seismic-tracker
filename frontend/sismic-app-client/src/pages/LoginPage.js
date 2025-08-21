import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';

// Importaciones de MUI (Componentes y Herramientas)
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
} from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

// Importaciones locales
import { loginUser } from '../api/auth';
import useAuthStore from '../store/authStore';
import PageTransition from '../components/utils/PageTransition';
import { 
  SectionBackground, 
  FormContainer, 
  GradientTitle,
  GradientSubtitle
} from '../components/shared/StyledComponents';

// Esquema de validación para el formulario de login
const schema = yup.object().shape({
  email: yup.string().email('Debe ser un correo válido').required('El correo es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  // --- LÓGICA PARA EL MODAL DE INACTIVIDAD ---
  const [showInactivityModal, setShowInactivityModal] = useState(
    location.state?.reason === 'inactivity'
  );

  useEffect(() => {
    // Limpia el estado de la navegación para que el modal no reaparezca
    if (location.state?.reason === 'inactivity') {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleCloseModal = () => {
    setShowInactivityModal(false);
  };
  // ------------------------------------

  const onSubmit = async (data) => {
    try {
      const tokens = await loginUser(data);
      const decodedToken = jwtDecode(tokens.access);
      login(tokens);
      toast.success(`¡Bienvenido de nuevo, ${decodedToken.first_name}!`);
      navigate('/mapa');
    } catch (error) {
      toast.error('Correo o contraseña incorrectos.');
    }
  };

  return (
    <PageTransition>
      <SectionBackground>
        <Toaster position="top-center" />
        <FormContainer maxWidth="sm">
          <GradientTitle variant="h4" component="h1" sx={{ textAlign: 'center', mb: 1 }}>
            Iniciar Sesión
          </GradientTitle>
          <GradientSubtitle sx={{ textAlign: 'center', mb: 4, fontSize: { xs: '1rem', md: '1.2rem' } }}>
            Accede a tu cuenta para monitorear la actividad sísmica global
          </GradientSubtitle>
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Correo Electrónico"
              autoComplete="email"
              autoFocus
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
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
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
              </Button>
            </motion.div>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2">
                <Link to="/olvide-mi-password" style={{ color: '#2196f3', textDecoration: 'none' }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </Typography>
              <Typography variant="body2">
                <Link to="/registro" style={{ color: '#2196f3', textDecoration: 'none' }}>
                  Regístrate aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </FormContainer>
      </SectionBackground>
      <Dialog
        open={showInactivityModal}
        onClose={handleCloseModal}
        TransitionComponent={Fade}
        transitionDuration={700}
        PaperProps={{ 
          sx: { 
            borderRadius: '1.5rem', 
            padding: '1rem',
            background: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(33, 150, 243, 0.1)',
          } 
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AccessTimeFilledIcon color="primary" fontSize="large" />
          <Typography variant="h6" component="div" fontWeight="bold">
            Sesión Finalizada
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Para proteger tu cuenta, tu sesión se ha cerrado automáticamente por inactividad.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseModal} 
            variant="contained" 
            autoFocus
            sx={{
              borderRadius: '12px',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #2196f3, #00bcd4)',
              '&:hover': {
                background: 'linear-gradient(90deg, #00bcd4, #2196f3)',
              },
            }}
          >
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </PageTransition>
  );
};

export default LoginPage;