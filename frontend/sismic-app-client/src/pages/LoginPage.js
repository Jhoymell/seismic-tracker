// ========================================
// COMPONENTE: LoginPage
// PROPÓSITO: Página de inicio de sesión con validación y manejo de errores
// ========================================

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'; // Manejo avanzado de formularios
import { yupResolver } from '@hookform/resolvers/yup'; // Integración con Yup para validación
import * as yup from 'yup'; // Librería de validación de esquemas
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Navegación y ubicación
import toast, { Toaster } from 'react-hot-toast'; // Notificaciones elegantes
import { jwtDecode } from 'jwt-decode'; // Para decodificar tokens JWT
import { motion } from 'framer-motion'; // Animaciones

// Importaciones de MUI (Material-UI)
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Container, 
  CircularProgress, // Indicador de carga
  Dialog, // Modal
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade, // Transición de fade
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'; // Icono de reloj
import LockIcon from '@mui/icons-material/Lock'; // Icono de candado
import EmailIcon from '@mui/icons-material/Email'; // Icono de email
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Importaciones locales
import { loginUser } from '../api/auth'; // Función para autenticar usuario
import useAuthStore from '../store/authStore'; // Estado global de autenticación
import PageTransition from '../components/utils/PageTransition'; // Wrapper de transición
import theme from '../theme'; // Tema personalizado
import { commonStyles, animations } from '../styles/commonStyles'; // Estilos comunes

// ========================================
// ESQUEMA DE VALIDACIÓN
// ========================================

/**
 * Esquema de validación con Yup para el formulario de login
 * Define las reglas que deben cumplir los campos del formulario
 */
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Debe ser un correo válido') // Valida formato de email
    .required('El correo es obligatorio'), // Campo obligatorio
  password: yup
    .string()
    .required('La contraseña es obligatoria'), // Campo obligatorio
});



/**
 * COMPONENTE PRINCIPAL: LoginPage
 * 
 * Maneja el proceso de inicio de sesión del usuario:
 * 1. Formulario de login con validación
 * 2. Autenticación con el backend
 * 3. Manejo de errores y mensajes de éxito
 * 4. Modal de inactividad (cuando el usuario es deslogueado automáticamente)
 * 5. Redirección post-login
 */
const LoginPage = () => {
  // ========================================
  // HOOKS Y ESTADO
  // ========================================
  
  const navigate = useNavigate(); // Para navegación programática
  const location = useLocation(); // Para acceder al estado de la ubicación
  const { login } = useAuthStore(); // Función de login del store global

  // Estados locales para UI
  const [showPassword, setShowPassword] = useState(false);

  // Configuración del formulario con react-hook-form
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema), // Usa el esquema de validación definido arriba
  });

  // ========================================
  // MODAL DE INACTIVIDAD
  // ========================================
  
  // Estado para controlar la visibilidad del modal de inactividad
  const [showInactivityModal, setShowInactivityModal] = useState(
    location.state?.reason === 'inactivity' // Se muestra si el usuario llegó por inactividad
  );

  /**
   * Efecto para limpiar el estado de navegación después de mostrar el modal
   * Evita que el modal reaparezca al refrescar la página
   */
  useEffect(() => {
    if (location.state?.reason === 'inactivity') {
      // Reemplaza el estado actual sin el motivo de inactividad
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  /**
   * Función para cerrar el modal de inactividad
   */
  const handleCloseModal = () => {
    setShowInactivityModal(false);
  };

  // ========================================
  // FUNCIÓN DE ENVÍO DEL FORMULARIO
  // ========================================
  
  /**
   * Maneja el envío del formulario de login
   * @param {Object} data - Datos del formulario (email y password)
   */
  const onSubmit = async (data) => {
    try {
      // Intenta autenticar al usuario con el backend
      const tokens = await loginUser(data);
      
      // Decodifica el token para obtener información del usuario
      const decodedToken = jwtDecode(tokens.access);
      
      // Actualiza el estado global con los tokens y datos del usuario
      login(tokens);
      
      // Muestra mensaje de bienvenida personalizado
      toast.success(`¡Bienvenido de nuevo, ${decodedToken.first_name}!`);
      
      // Redirige al mapa (página principal para usuarios autenticados)
      navigate('/mapa');
      
    } catch (error) {
      // Si hay error de autenticación, muestra mensaje de error
      toast.error('Correo o contraseña incorrectos.');
    }
  };

  // ========================================
  // RENDERIZADO DEL COMPONENTE
  // ========================================

  return (
    <PageTransition>
      <Container component="main" maxWidth="xs">
        {/* Sistema de notificaciones toast */}
        <Toaster position="top-center" />
        
        {/* ========================================
            FORMULARIO PRINCIPAL DE LOGIN
        ======================================== */}
        <Box
          component={motion.div}
          variants={animations.fadeInUp} // Animación de entrada desde abajo
          initial="hidden"
          animate="visible"
          sx={{
            ...commonStyles.formContainer,
            marginTop: 8,
          }}
        >
          {/* Icono de encabezado */}
          <Box sx={commonStyles.iconContainer}>
            <LockIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>

          {/* Título de la página */}
          <Typography 
            component="h1" 
            variant="h5"
            sx={{
              ...commonStyles.pageTitle,
              mb: 3,
            }}
          >
            Iniciar Sesión
          </Typography>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center" 
            sx={{ 
              mb: 3,
              color: 'rgba(33, 150, 243, 0.7)',
              fontWeight: 500
            }}
          >
            Accede a tu cuenta para explorar los datos sísmicos en tiempo real
          </Typography>
          
          {/* Formulario con validación y envío */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
            
            {/* ========================================
                CAMPO DE CORREO ELECTRÓNICO
            ======================================== */}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Correo Electrónico"
              autoComplete="email"
              autoFocus // Se enfoca automáticamente al cargar la página
              {...register('email')} // Registro del campo con react-hook-form
              error={!!errors.email} // Muestra error si existe
              helperText={errors.email?.message} // Texto de ayuda con el mensaje de error
              sx={{
                ...commonStyles.styledInput,
                ...commonStyles.inputWithIcon
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'primary.main', mr: 1 }} />
                  </InputAdornment>
                ),
              }}
            />
            
            {/* ========================================
                CAMPO DE CONTRASEÑA
            ======================================== */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              {...register('password')} // Registro del campo con react-hook-form
              error={!!errors.password} // Muestra error si existe
              helperText={errors.password?.message} // Texto de ayuda con el mensaje de error
              sx={{
                ...commonStyles.styledInput,
                ...commonStyles.inputWithIcon
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'primary.main', mr: 1 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ 
                        color: showPassword ? 'primary.main' : 'text.secondary',
                        transition: 'color 0.2s ease'
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            {/* ========================================
                BOTÓN DE ENVÍO CON ANIMACIÓN
            ======================================== */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting} // Se deshabilita mientras se procesa
                sx={{ 
                  ...commonStyles.primaryButton,
                  mt: 3, 
                  mb: 2, 
                  py: 1.5,
                  width: '100%',
                }}
              >
                {/* Muestra spinner mientras se envía o texto normal */}
                {isSubmitting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    <Typography variant="button">Iniciando sesión...</Typography>
                  </Box>
                ) : (
                  'Ingresar'
                )}
              </Button>
            </motion.div>
            
            {/* ========================================
                ENLACES DE NAVEGACIÓN
            ======================================== */}
            <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
              {/* Enlace para recuperar contraseña */}
              <Grid item>
                <Typography variant="body2">
                  <Link 
                    to="/olvide-mi-password" 
                    style={{ 
                      color: theme.palette.primary.main, 
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'color 0.2s ease'
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Typography>
              </Grid>
              
              {/* Enlace para registro de nuevos usuarios */}
              <Grid item>
                <Typography variant="body2">
                  <Link 
                    to="/registro" 
                    style={{ 
                      color: theme.palette.secondary.main, 
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'color 0.2s ease'
                    }}
                  >
                    Regístrate aquí
                  </Link>
                </Typography>
              </Grid>
            </Grid>

            {/* Enlace para volver al inicio */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2">
                <Link 
                  to="/" 
                  style={{ 
                    color: 'rgba(33, 150, 243, 0.7)', 
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem'
                  }}
                >
                  ← Volver al inicio
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
      
      {/* ========================================
          MODAL DE SESIÓN EXPIRADA POR INACTIVIDAD
      ======================================== */}
      <Dialog
        open={showInactivityModal} // Se muestra cuando el usuario es deslogueado por inactividad
        onClose={handleCloseModal}
        TransitionComponent={Fade} // Animación de fade para mejor UX
        transitionDuration={700} // Duración de la transición (0.7 segundos)
        PaperProps={{ 
          sx: { 
            borderRadius: '1rem', 
            padding: '1rem' 
          } 
        }}
      >
        {/* Título del modal con icono */}
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AccessTimeFilledIcon color="primary" fontSize="large" />
          <Typography variant="h6" component="div" fontWeight="bold">
            Sesión Finalizada
          </Typography>
        </DialogTitle>
        
        {/* Contenido explicativo del modal */}
        <DialogContent>
          <DialogContentText>
            Para proteger tu cuenta, tu sesión se ha cerrado automáticamente por inactividad.
          </DialogContentText>
        </DialogContent>
        
        {/* Botón para cerrar el modal */}
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