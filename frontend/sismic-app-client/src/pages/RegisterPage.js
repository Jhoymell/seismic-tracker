// ========================================
// COMPONENTE: RegisterPage
// PROPÓSITO: Maneja el registro de nuevos usuarios con un formulario multi-paso
// ========================================

import PageTransition from '../components/utils/PageTransition';
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form'; // FormProvider permite compartir datos del formulario entre componentes hijos
import { yupResolver } from '@hookform/resolvers/yup'; // Integra validaciones Yup con react-hook-form
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Notificaciones elegantes
import { AnimatePresence } from 'framer-motion'; // Para transiciones entre pasos
import zxcvbn from 'zxcvbn'; // Librería para medir fortaleza de contraseñas

// Importaciones de MUI (Material-UI)
import { 
  Container, 
  Box, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  CircularProgress
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Importaciones de nuestros componentes y lógica personalizada
import { registerUser } from '../api/auth'; // Función que envía datos al backend
import AccountStep from '../components/register/AccountStep'; // Primer paso: datos de cuenta
import PersonalStep from '../components/register/PersonalStep'; // Segundo paso: datos personales
import { accountSchema, personalSchema } from '../components/register/validationSchemas'; // Esquemas de validación
import { commonStyles, animations } from '../styles/commonStyles'; // Estilos comunes
import { motion } from 'framer-motion'; // Para animaciones

// ========================================
// CONFIGURACIÓN INICIAL
// ========================================

// Definimos los nombres de los pasos que aparecerán en el stepper
const steps = ['Datos de Cuenta', 'Información Personal'];

// Asociamos cada paso con su esquema de validación correspondiente
const stepSchemas = [accountSchema, personalSchema];

/**
 * COMPONENTE PRINCIPAL: RegisterPage
 * 
 * Este componente maneja todo el flujo de registro de usuarios:
 * 1. Formulario multi-paso con navegación
 * 2. Validación en tiempo real de cada paso
 * 3. Análisis de fortaleza de contraseña
 * 4. Envío de datos al backend
 * 5. Feedback visual al usuario
 */
const RegisterPage = () => {
  // ========================================
  // ESTADOS LOCALES
  // ========================================
  
  // Controla en qué paso del formulario estamos (0 = primer paso, 1 = segundo paso)
  const [activeStep, setActiveStep] = useState(0);
  
  // Hook de React Router para navegación programática
  const navigate = useNavigate();

  // ========================================
  // FUNCIÓN: onSubmit
  // PROPÓSITO: Maneja el envío final del formulario al backend
  // ========================================
  
  /**
   * Esta función se ejecuta cuando el usuario completa el último paso
   * y hace clic en "Crear Cuenta"
   */
  const onSubmit = async (data) => {
    // Mostramos una notificación de carga mientras procesamos
    const loadingToast = toast.loading('Registrando tu cuenta...');
    
    // Creamos una copia de los datos para no modificar el original
    const submissionData = { ...data };
    
    // Si la fecha de nacimiento es un objeto Date, la convertimos al formato que espera el backend (YYYY-MM-DD)
    if (submissionData.fecha_nacimiento instanceof Date) {
      const year = submissionData.fecha_nacimiento.getFullYear();
      const month = String(submissionData.fecha_nacimiento.getMonth() + 1).padStart(2, '0'); // +1 porque getMonth() devuelve 0-11
      const day = String(submissionData.fecha_nacimiento.getDate()).padStart(2, '0');
      submissionData.fecha_nacimiento = `${year}-${month}-${day}`;
    }
    
    try {
      // Intentamos registrar al usuario enviando los datos al backend
      const response = await registerUser(submissionData);
      
      // Si todo sale bien, mostramos mensaje de éxito
      toast.success(response.message, { id: loadingToast });
      
      // Después de 2 segundos, redirigimos al login
      setTimeout(() => navigate('/login'), 2000);
      
    } catch (error) {
      // Si hay algún error, mostramos mensaje de error
      toast.error('Hubo un error al registrar la cuenta.', { id: loadingToast });
    }
  };

  // ========================================
  // CONFIGURACIÓN DEL FORMULARIO
  // ========================================
  
  // Obtenemos el esquema de validación del paso actual
  const currentValidationSchema = stepSchemas[activeStep];
  
  /**
   * Configuramos react-hook-form con:
   * - Validación usando Yup (yupResolver)
   * - Modo onChange para validación en tiempo real
   * - Valores iniciales vacíos para todos los campos
   */
  const methods = useForm({
    resolver: yupResolver(currentValidationSchema),
    mode: 'onChange', // Valida mientras el usuario escribe
    defaultValues: {
      // Datos de cuenta (paso 1)
      email: '',
      username: '',
      password: '',
      password_confirm: '',
      // Datos personales (paso 2)
      first_name: '',
      last_name: '',
      telefono: '',
      fecha_nacimiento: '', // Se convierte a Date en el componente DatePicker
    }
  });

  // ========================================
  // ANÁLISIS DE FORTALEZA DE CONTRASEÑA
  // ========================================
  
  // Estados para mostrar qué tan segura es la contraseña
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'N/A' });
  const [passwordChecks, setPasswordChecks] = useState({ 
    length: false,      // ¿Tiene al menos 8 caracteres?
    uppercase: false,   // ¿Tiene mayúsculas?
    lowercase: false,   // ¿Tiene minúsculas?
    number: false,      // ¿Tiene números?
    specialChar: false  // ¿Tiene caracteres especiales?
  });
  
  // Observamos el valor actual de la contraseña en tiempo real
  const passwordValue = methods.watch('password', '');

  /**
   * Cada vez que la contraseña cambia, analizamos su fortaleza
   * usando la librería zxcvbn y verificamos nuestros requisitos
   */
  useEffect(() => {
    // zxcvbn analiza la contraseña y da una puntuación de 0-4
    const result = zxcvbn(passwordValue || '');
    const strengthLabels = ["Muy Débil", "Débil", "Regular", "Fuerte", "Muy Fuerte"];
    
    // Actualizamos el estado con la puntuación y etiqueta
    setPasswordStrength({ score: result.score, label: strengthLabels[result.score] });
    
    // Verificamos cada requisito individualmente
    setPasswordChecks({
      length: passwordValue.length >= 8,                    // Al menos 8 caracteres
      uppercase: /[A-Z]/.test(passwordValue),              // Contiene mayúsculas
      lowercase: /[a-z]/.test(passwordValue),              // Contiene minúsculas
      number: /[0-9]/.test(passwordValue),                 // Contiene números
      specialChar: /[^A-Za-z0-9]/.test(passwordValue),     // Contiene caracteres especiales
    });
  }, [passwordValue]); // Se ejecuta cada vez que passwordValue cambia

  // ========================================
  // FUNCIONES DE NAVEGACIÓN ENTRE PASOS
  // ========================================
  
  /**
   * FUNCIÓN: handleNext
   * Avanza al siguiente paso si la validación del paso actual es exitosa
   */
  const handleNext = async () => {
    // Validamos solo los campos del paso actual
    const isStepValid = await methods.trigger();
    
    if (isStepValid) {
      // Si la validación pasa, avanzamos al siguiente paso
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    // Si la validación falla, react-hook-form mostrará automáticamente los errores
  };

  /**
   * FUNCIÓN: handleBack
   * Retrocede al paso anterior (no necesita validación)
   */
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // ========================================
  // RENDERIZADO DEL COMPONENTE
  // ========================================

  return (
    // PageTransition envuelve toda la página para animaciones suaves entre rutas
    <PageTransition>
      <Container component="main" maxWidth="sm">
        {/* Toaster maneja las notificaciones emergentes */}
        <Toaster position="top-center" />
        
        {/* Contenedor principal con estilos mejorados */}
        <motion.div
          variants={animations.fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Box
            sx={{
              ...commonStyles.formContainer,
              marginTop: 4,
              maxWidth: 'none',
              width: '100%',
            }}
          >
            {/* Icono de encabezado */}
            <Box sx={commonStyles.iconContainer}>
              <PersonAddIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>

            {/* ========================================
                TÍTULO DE LA PÁGINA
                ======================================== */}
            <Typography
              component="h1"
              variant="h5"
              sx={{
                ...commonStyles.pageTitle,
                mb: 2,
              }}
            >
              Crear una Cuenta
            </Typography>

            <Typography 
              variant="body2" 
              color="text.secondary" 
              align="center" 
              sx={{ 
                mb: 4,
                color: 'rgba(33, 150, 243, 0.7)',
                fontWeight: 500
              }}
            >
              Únete a la comunidad y explora los datos sísmicos en tiempo real
            </Typography>

            {/* ========================================
                STEPPER - INDICADOR DE PROGRESO
                ======================================== */}
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                mb: 4, 
                width: '100%',
                '& .MuiStepLabel-label': {
                  fontWeight: 600,
                  fontSize: '0.9rem',
                },
                '& .MuiStepIcon-root': {
                  color: 'rgba(33, 150, 243, 0.3)',
                  '&.Mui-active': {
                    color: '#2196f3',
                  },
                  '&.Mui-completed': {
                    color: '#00bcd4',
                  },
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

          {/* ========================================
              FORMULARIO MULTI-PASO
              ======================================== */}
          {/* FormProvider permite que los componentes hijos accedan a los datos del formulario */}
          <FormProvider {...methods}>
            <form id="register-form" onSubmit={methods.handleSubmit(onSubmit)}>
              {/* AnimatePresence maneja las transiciones entre pasos */}
              <AnimatePresence mode="wait">
                {/* PASO 1: Datos de cuenta */}
                {activeStep === 0 && (
                  <AccountStep 
                    key="step1" 
                    passwordStrength={passwordStrength}  // Pasamos análisis de fortaleza
                    passwordChecks={passwordChecks}      // Pasamos verificaciones de requisitos
                  />
                )}
                
                {/* PASO 2: Información personal */}
                {activeStep === 1 && <PersonalStep key="step2" />}
              </AnimatePresence>
            </form>
          </FormProvider>
          
          {/* ========================================
              BOTONES DE NAVEGACIÓN
              ======================================== */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 4 }}>
            {/* Botón "Atrás" - Deshabilitado en el primer paso */}
            <Button 
              disabled={activeStep === 0} 
              onClick={handleBack}
              sx={{
                color: 'rgba(33, 150, 243, 0.7)',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                },
              }}
            >
              Atrás
            </Button>
            
            {/* Condicional: Botón "Siguiente" vs "Crear Cuenta" */}
            {activeStep < steps.length - 1 ? (
              // Si no estamos en el último paso, mostramos "Siguiente"
              <Button 
                variant="contained" 
                onClick={handleNext}
                sx={{
                  ...commonStyles.primaryButton,
                }}
              >
                Siguiente
              </Button>
            ) : (
              // Si estamos en el último paso, mostramos "Crear Cuenta"
              <Button
                type="submit"
                form="register-form" // Conecta con el formulario por ID
                variant="contained"
                disabled={methods.formState.isSubmitting} // Deshabilitar durante envío
                sx={{
                  ...commonStyles.primaryButton,
                }}
              >
                {/* Mostrar spinner mientras se envía, texto normal en otro caso */}
                {methods.formState.isSubmitting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    <Typography variant="button">Creando cuenta...</Typography>
                  </Box>
                ) : (
                  'Crear Cuenta'
                )}
              </Button>
            )}
          </Box>
        </Box>
        </motion.div>
      </Container>
    </PageTransition>
  );
};

// ========================================
// EXPORTACIÓN DEL COMPONENTE
// ========================================
export default RegisterPage;