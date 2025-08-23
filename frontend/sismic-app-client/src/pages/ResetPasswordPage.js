import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import zxcvbn from 'zxcvbn';

// Importaciones de MUI
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Importación para animaciones
import { motion } from 'framer-motion';

// Importación de la función de la API
import { confirmPasswordReset } from '../api/auth';
import PageTransition from '../components/utils/PageTransition'; // agregado

// Esquema de validación
const schema = yup.object().shape({
  token: yup
    .string()
    .required('El token es obligatorio.'),
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "La contraseña debe contener al menos una letra mayúscula, una minúscula y un número"
    ),
  confirmPassword: yup
    .string()
    .required("Debe confirmar la contraseña")
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
});

// Componente Box animado
const MotionBox = motion(Box);

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'N/A' });
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });

  // Observar el valor de la contraseña
  const passwordValue = watch('password', '');

  // Efecto para actualizar la fortaleza de la contraseña y los checks
  useEffect(() => {
    const result = zxcvbn(passwordValue || '');
    const strengthLabels = ["Muy Débil", "Débil", "Regular", "Fuerte", "Muy Fuerte"];
    
    setPasswordStrength({ 
      score: result.score, 
      label: strengthLabels[result.score] 
    });

    setPasswordChecks({
      length: passwordValue.length >= 8,
      uppercase: /[A-Z]/.test(passwordValue),
      lowercase: /[a-z]/.test(passwordValue),
      number: /[0-9]/.test(passwordValue),
      specialChar: /[^A-Za-z0-9]/.test(passwordValue),
    });
  }, [passwordValue]);

  const handleTogglePassword = (field) => () => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Manejo del envío del formulario
  const onSubmit = async (data) => {
    try {
      await confirmPasswordReset({ token: data.token, password: data.password });
      toast.success('¡Contraseña restablecida con éxito!');
      setTimeout(() => navigate('/login'), 2000); // Redirige después de mostrar el mensaje
    } catch (error) {
      setErrorMessage('El enlace ha expirado o no es válido. Por favor, solicita un nuevo restablecimiento de contraseña.');
      toast.error('Error al restablecer la contraseña');
    }
  };

  // Variantes de animación
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeInOut" }, // duración consistente
    },
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
            background: 'linear-gradient(135deg, rgba(248, 253, 255, 0.1) 80%, rgba(227, 247, 250, 0.15) 100%)',
            padding: { xs: 3, sm: 4 },
            borderRadius: '1.5rem',
            boxShadow: '0 8px 32px rgba(33, 150, 243, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(33, 150, 243, 0.1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #2196f3, #00bcd4)',
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
              transform: 'rotate(-10deg)',
            }}
          >
            <LockResetIcon 
              color="primary" 
              sx={{ 
                fontSize: 35,
                transform: 'rotate(10deg)',
                transition: 'transform 0.3s ease'
              }} 
            />
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
            Restablecer Contraseña
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center" 
            sx={{ mb: 3 }}
          >
            Crea una nueva contraseña segura para tu cuenta.
          </Typography>

          {errorMessage && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%', 
                mb: 3,
                '& .MuiAlert-icon': {
                  fontSize: '24px'
                }
              }}
              elevation={1}
            >
              {errorMessage}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: '100%' }}
          >
            {/* Indicadores de requisitos de contraseña */}
            <Box sx={{ mb: 2, mt: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                La contraseña debe cumplir con:
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {Object.entries({
                  length: 'Al menos 8 caracteres',
                  uppercase: 'Una mayúscula',
                  lowercase: 'Una minúscula',
                  number: 'Un número',
                  specialChar: 'Un carácter especial'
                }).map(([key, label]) => (
                  <Box
                    key={key}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: passwordChecks[key] ? 'success.main' : 'text.secondary',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: passwordChecks[key] ? 'success.main' : 'text.disabled',
                        transition: 'background-color 0.3s ease'
                      }}
                    />
                    <Typography variant="caption">{label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Indicador de fortaleza */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  Fortaleza de la contraseña:
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: ['error.main', 'warning.main', 'info.main', 'success.main', 'success.dark'][passwordStrength.score],
                    fontWeight: 'bold'
                  }}
                >
                  {passwordStrength.label}
                </Typography>
              </Box>
              <Box 
                sx={{ 
                  mt: 0.5,
                  height: 4,
                  bgcolor: 'grey.200',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${(passwordStrength.score + 1) * 20}%`,
                    bgcolor: ['error.main', 'warning.main', 'info.main', 'success.main', 'success.dark'][passwordStrength.score],
                    transition: 'all 0.3s ease'
                  }}
                />
              </Box>
            </Box>

            <TextField
              margin="normal"
              required
              fullWidth
              label="Token de Restablecimiento"
              {...register("token")}
              error={!!errors.token}
              helperText={errors.token?.message}
              sx={{
                '& label.Mui-focused': {
                  color: 'primary.main'
                }
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Nueva Contraseña"
              type={showPassword ? 'text' : 'password'}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePassword('password')}
                        edge="end"
                        sx={{
                          color: showPassword ? 'primary.main' : 'text.secondary',
                          transition: 'color 0.2s ease'
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </motion.div>
                  </InputAdornment>
                ),
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': {
                    transition: 'border-color 0.2s ease'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }
              }}
              sx={{
                '& label.Mui-focused': {
                  color: 'primary.main'
                }
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirmar Contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword('confirm')}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
            >
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
                disabled={
                  isSubmitting || 
                  !!errorMessage || 
                  !Object.values(passwordChecks).every(Boolean) || 
                  passwordStrength.score < 2
                }
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Cambiar Contraseña"
                )}
              </Button>
            </motion.div>

            {errorMessage && (
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                <Link
                  to="/olvide-mi-password"
                  style={{ color: '#2196f3', textDecoration: 'none' }}
                >
                  Solicitar nuevo restablecimiento
                </Link>
              </Typography>
            )}

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
    </PageTransition>
  );
};

export default ResetPasswordPage;