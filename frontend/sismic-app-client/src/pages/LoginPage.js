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
  Container, 
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Grid
} from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

// Importaciones locales
import { loginUser } from '../api/auth';
import useAuthStore from '../store/authStore';
import PageTransition from '../components/utils/PageTransition';
import theme from '../theme';

// Esquema de validación para el formulario de login
const schema = yup.object().shape({
  email: yup.string().email('Debe ser un correo válido').required('El correo es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria'),
});

const MotionBox = motion(Box);

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

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  return (
    <PageTransition>
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
            background: 'linear-gradient(135deg, #0a121e 80%, #10131a 100%)',
            padding: { xs: 2, sm: 4 },
            borderRadius: '1rem',
            boxShadow: '0 2px 16px 0 #00bcd422',
          }}
        >
          <Typography 
            component="h1" 
            variant="h5"
            sx={{
              mb: 3,
              background: 'linear-gradient(90deg, #2196f3, #00bcd4, #00e5ff, #2196f3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 800,
              letterSpacing: '-0.3px',
              filter: 'drop-shadow(0 2px 12px #00e5ff33)',
            }}
          >
            Iniciar Sesión
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
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
                  boxShadow: '0 4px 20px 0 rgba(33,150,243,0.15)',
                  background: 'linear-gradient(90deg, #2196f3, #00bcd4)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #00bcd4, #2196f3)',
                    boxShadow: '0 8px 32px 0 rgba(33,150,243,0.25)',
                  },
                }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
              </Button>
            </motion.div>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Typography variant="body2">
                  <Link to="/olvide-mi-password" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2">
                  <Link to="/registro" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                    Regístrate aquí
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </MotionBox>
      </Container>
      <Dialog
        open={showInactivityModal}
        onClose={handleCloseModal}
        TransitionComponent={Fade}
        transitionDuration={700} // antes 200, ahora 0.7s consistente
        PaperProps={{ sx: { borderRadius: '1rem', padding: '1rem' } }}
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
          <Button onClick={handleCloseModal} variant="contained" autoFocus>
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </PageTransition>
  );
};

export default LoginPage;