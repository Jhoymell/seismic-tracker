import PageTransition from '../components/utils/PageTransition';
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form'; // FormProvider es clave para formularios por pasos
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import zxcvbn from 'zxcvbn';

// Importaciones de MUI
import { Box, Stepper, Step, StepLabel, Button, CircularProgress } from '@mui/material';

// Importaciones de nuestros componentes y lógica
import { registerUser } from '../api/auth';
import AccountStep from '../components/register/AccountStep';
import PersonalStep from '../components/register/PersonalStep';
import { accountSchema, personalSchema } from '../components/register/validationSchemas';
import { 
  SectionBackground, 
  StyledCard, 
  GradientTitle,
  GradientSubtitle,
  PageContainer
} from '../components/shared/StyledComponents';

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
        <SectionBackground>
          <Toaster position="top-center" />
          <PageContainer maxWidth="md">
            <StyledCard>
              <GradientTitle variant="h4" component="h1" sx={{ textAlign: 'center', mb: 1 }}>
                Crear una Cuenta
              </GradientTitle>
              <GradientSubtitle sx={{ textAlign: 'center', mb: 4, fontSize: { xs: '1rem', md: '1.2rem' } }}>
                Únete a nuestra plataforma de monitoreo sísmico global
              </GradientSubtitle>
              
              <Stepper 
                activeStep={activeStep} 
                sx={{ 
                  mb: 4, 
                  width: '100%',
                  '& .MuiStepLabel-label': {
                    color: 'text.primary',
                    fontWeight: 600,
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
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 4, gap: 2 }}>
                <Button 
                  disabled={activeStep === 0} 
                  onClick={handleBack}
                  variant="outlined"
                  sx={{
                    borderRadius: '12px',
                    fontWeight: 600,
                    px: 3,
                    borderColor: '#2196f3',
                    color: '#2196f3',
                    '&:hover': {
                      borderColor: '#00bcd4',
                      color: '#00bcd4',
                      background: 'rgba(33, 150, 243, 0.05)',
                    },
                  }}
                >
                  Atrás
                </Button>
                
                {activeStep < steps.length - 1 ? (
                  <Button 
                    variant="contained" 
                    onClick={handleNext}
                    sx={{
                      borderRadius: '12px',
                      fontWeight: 700,
                      px: 3,
                      background: 'linear-gradient(90deg, #2196f3, #00bcd4)',
                      boxShadow: '0 4px 20px 0 rgba(33,150,243,0.15)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #00bcd4, #2196f3)',
                        boxShadow: '0 8px 32px 0 rgba(33,150,243,0.25)',
                      },
                    }}
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    form="register-form"
                    variant="contained"
                    disabled={methods.formState.isSubmitting}
                    sx={{
                      borderRadius: '12px',
                      fontWeight: 700,
                      px: 3,
                      background: 'linear-gradient(90deg, #2196f3, #00bcd4)',
                      boxShadow: '0 4px 20px 0 rgba(33,150,243,0.15)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #00bcd4, #2196f3)',
                        boxShadow: '0 8px 32px 0 rgba(33,150,243,0.25)',
                      },
                    }}
                  >
                    {methods.formState.isSubmitting ? <CircularProgress size={24}/> : 'Crear Cuenta'}
                  </Button>
                )}
              </Box>
            </StyledCard>
          </PageContainer>
        </SectionBackground>
      </PageTransition>
    );
};

export default RegisterPage;