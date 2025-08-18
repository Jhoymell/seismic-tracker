import PageTransition from '../components/utils/PageTransition';
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form'; // FormProvider es clave para formularios por pasos
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import zxcvbn from 'zxcvbn';

// Importaciones de MUI
import { Container, Box, Typography, Stepper, Step, StepLabel, Button, CircularProgress } from '@mui/material';

// Importaciones de nuestros componentes y lógica
import { registerUser } from '../api/auth';
import AccountStep from '../components/register/AccountStep';
import PersonalStep from '../components/register/PersonalStep';
import { accountSchema, personalSchema } from '../components/register/validationSchemas';

// Definimos nuestros pasos y sus esquemas de validación correspondientes
const steps = ['Datos de Cuenta', 'Información Personal'];
const stepSchemas = [accountSchema, personalSchema];

const RegisterPage = () => {
  // --- CAMBIO 1: Añadimos estado para controlar el paso actual ---
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  // onSubmit debe estar definido antes del return
  const onSubmit = async (data) => {
    const loadingToast = window.toast.loading('Registrando tu cuenta...');
    const submissionData = { ...data };
    if (submissionData.fecha_nacimiento instanceof Date) {
      const year = submissionData.fecha_nacimiento.getFullYear();
      const month = String(submissionData.fecha_nacimiento.getMonth() + 1).padStart(2, '0');
      const day = String(submissionData.fecha_nacimiento.getDate()).padStart(2, '0');
      submissionData.fecha_nacimiento = `${year}-${month}-${day}`;
    }
    try {
      const response = await registerUser(submissionData);
      window.toast.success(response.message, { id: loadingToast });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      window.toast.error('Hubo un error al registrar la cuenta.', { id: loadingToast });
    }
  };

  const currentValidationSchema = stepSchemas[activeStep];
  
  const methods = useForm({
    resolver: yupResolver(currentValidationSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      username: '',
      password: '',
      password_confirm: '',
      first_name: '',
      last_name: '',
      telefono: '',
      fecha_nacimiento: '',
    }
  });

  // --- CAMBIO 2: La lógica de la contraseña ahora vive aquí, en el componente padre ---
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'N/A' });
  const [passwordChecks, setPasswordChecks] = useState({ length: false, uppercase: false, lowercase: false, number: false, specialChar: false });
  
  // Observamos el valor de la contraseña desde el formulario principal
  const passwordValue = methods.watch('password', '');

  useEffect(() => {
    const result = zxcvbn(passwordValue || '');
    const strengthLabels = ["Muy Débil", "Débil", "Regular", "Fuerte", "Muy Fuerte"];
    setPasswordStrength({ score: result.score, label: strengthLabels[result.score] });
    setPasswordChecks({
      length: passwordValue.length >= 8,
      uppercase: /[A-Z]/.test(passwordValue),
      lowercase: /[a-z]/.test(passwordValue),
      number: /[0-9]/.test(passwordValue),
      specialChar: /[^A-Za-z0-9]/.test(passwordValue),
    });
  }, [passwordValue]);

  // --- CAMBIO 3: Funciones para navegar entre pasos ---


  const handleNext = async () => {
    const isStepValid = await methods.trigger();
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };





    return (
      <PageTransition>
        <Container component="main" maxWidth="sm">
          <Toaster position="top-center" />
          <Box
            sx={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'background.paper',
              padding: { xs: 2, sm: 4 },
              borderRadius: '1rem',
              boxShadow: '0 2px 16px 0 #00bcd422', // sombra consistente
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
              Crear una Cuenta
            </Typography>
            <Stepper activeStep={activeStep} sx={{ mb: 4, width: '100%' }}>
              {steps.map((label) => (
                <Step key={label}><StepLabel>{label}</StepLabel></Step>
              ))}
            </Stepper>

        <FormProvider {...methods}>
          <form id="register-form" onSubmit={methods.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <AccountStep 
                  key="step1" 
                  passwordStrength={passwordStrength} 
                  passwordChecks={passwordChecks} 
                />
              )}
              {activeStep === 1 && <PersonalStep key="step2" />}
            </AnimatePresence>
          </form>
        </FormProvider>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 4 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Atrás
          </Button>
          
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              Siguiente
            </Button>
          ) : (
            <Button
              type="submit"
              form="register-form"
              variant="contained"
              disabled={methods.formState.isSubmitting}
            >
              {methods.formState.isSubmitting ? <CircularProgress size={24}/> : 'Crear Cuenta'}
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  </PageTransition>
  );
};

export default RegisterPage;