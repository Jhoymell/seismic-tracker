// ========================================
// COMPONENTE: AccountStep
// PROPÓSITO: Primer paso del registro - maneja los datos de la cuenta del usuario
// ========================================

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form'; // Hook para acceder al contexto del formulario
import { TextField, Grid, InputAdornment, Box, LinearProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion'; // Para animaciones de entrada/salida
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icono de validación exitosa
import ErrorIcon from '@mui/icons-material/Error'; // Icono de error
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { commonStyles } from '../../styles/commonStyles';

// ========================================
// CONFIGURACIÓN DE ANIMACIONES
// ========================================

/**
 * Variantes de animación para el deslizamiento del componente
 * - hidden: Estado inicial (fuera de pantalla a la derecha)
 * - visible: Estado visible (posición normal)
 * - exit: Estado de salida (desliza hacia la izquierda)
 */
const slideVariants = {
  hidden: { x: '100vw', opacity: 0 }, // Entra desde la derecha
  visible: { x: 0, opacity: 1, transition: { type: 'tween', duration: 0.4 } }, // Posición final
  exit: { x: '-100vw', opacity: 0, transition: { ease: 'easeInOut', duration: 0.3 } }, // Sale hacia la izquierda
};

/**
 * COMPONENTE PRINCIPAL: AccountStep
 * 
 * Este componente renderiza el primer paso del formulario de registro:
 * 1. Campo de email
 * 2. Campo de nombre de usuario
 * 3. Campo de contraseña con análisis de fortaleza
 * 4. Campo de confirmación de contraseña
 * 
 * @param {Object} props - Props del componente
 * @param {Object} props.passwordStrength - Análisis de fortaleza de la contraseña (score y label)
 * @param {Object} props.passwordChecks - Verificaciones específicas de la contraseña (mayúsculas, números, etc.)
 */
const AccountStep = ({ passwordStrength, passwordChecks }) => {
  // ========================================
  // HOOKS Y CONFIGURACIÓN
  // ========================================
  
  // Accedemos al contexto del formulario para obtener control y estado
  const { control, formState: { errors, touchedFields } } = useFormContext();

  // ========================================
  // CONFIGURACIÓN DE ESTILOS
  // ========================================
  
  // Colores para la barra de progreso de la contraseña según su fortaleza
  const strengthColors = ["error", "error", "warning", "success", "success"];
  // Índices 0-1: Rojo (muy débil/débil), 2: Amarillo (regular), 3-4: Verde (fuerte/muy fuerte)

  // ========================================
  // FUNCIONES AUXILIARES
  // ========================================
  
  /**
   * Determina qué icono mostrar al final de cada campo según su estado de validación
   * @param {string} fieldName - Nombre del campo
   * @returns {JSX.Element|null} - Icono de check o error, o null si no aplica
   */
  const getAdornment = (fieldName) => {
    // Si el campo fue tocado y no tiene errores, mostrar check verde
    if (touchedFields[fieldName] && !errors[fieldName]) {
      return <InputAdornment position="end"><CheckCircleIcon color="success" /></InputAdornment>;
    }
    // Si el campo tiene errores, mostrar X roja
    if (errors[fieldName]) {
      return <InputAdornment position="end"><ErrorIcon color="error" /></InputAdornment>;
    }
    // Si no se ha tocado o no tiene estado definido, no mostrar nada
    return null;
  };

  /**
   * Genera estilos dinámicos para los campos según su estado de validación
   * @param {string} fieldName - Nombre del campo
   * @returns {Object} - Objeto de estilos sx para MUI
   */
  const getFieldSx = (fieldName) => ({
    // Si el campo está válido (tocado y sin errores), aplicar estilos de éxito
    ...(touchedFields[fieldName] && !errors[fieldName] && {
      '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': { borderColor: 'success.main' }, // Borde verde cuando está enfocado
        '& fieldset': { borderColor: 'success.main' }, // Borde verde normal
        '&:hover fieldset': { borderColor: 'success.main' }, // Borde verde en hover
      },
      '& label.Mui-focused': { color: 'success.main' } // Label verde cuando está enfocado
    }),
  });

  // ========================================
  // RENDERIZADO DEL COMPONENTE
  // ========================================

  return (
    // Contenedor principal con animación de deslizamiento
    <motion.div variants={slideVariants} initial="hidden" animate="visible" exit="exit">
      <Grid container spacing={2}>
        
        {/* ========================================
            CAMPO: EMAIL
            ======================================== */}
        <Grid item xs={12}>
          <Controller 
            name="email" 
            control={control} 
            render={({ field }) => (
              <TextField 
                {...field} 
                fullWidth 
                label="Correo Electrónico" 
                type="email"
                sx={{
                  ...commonStyles.formField,
                  ...getFieldSx('email')
                }}
                error={!!errors.email} 
                helperText={errors.email?.message} 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                  endAdornment: getAdornment('email')
                }}
              />
            )}
          />
        </Grid>

        {/* ========================================
            CAMPO: NOMBRE DE USUARIO
            ======================================== */}
        <Grid item xs={12}>
          <Controller 
            name="username" 
            control={control} 
            render={({ field }) => (
              <TextField 
                {...field} 
                fullWidth 
                label="Nombre de Usuario" 
                sx={{
                  ...commonStyles.formField,
                  ...getFieldSx('username')
                }}
                error={!!errors.username} 
                helperText={errors.username?.message} 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                  endAdornment: getAdornment('username')
                }}
              />
            )}
          />
        </Grid>

        {/* ========================================
            CAMPO: CONTRASEÑA
            ======================================== */}
        <Grid item xs={12}>
          <Controller 
            name="password" 
            control={control} 
            render={({ field }) => (
              <TextField 
                {...field} 
                fullWidth 
                type="password" 
                label="Contraseña" 
                sx={commonStyles.formField}
                error={!!errors.password} 
                helperText={errors.password?.message} 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>

        {/* ========================================
            INDICADOR DE FORTALEZA DE CONTRASEÑA
            ======================================== */}
        <Grid item xs={12}>
          <Box sx={{ width: '100%', mb: 1 }}>
            {/* Etiqueta con el nivel de fortaleza */}
            <Typography 
              variant='caption' 
              component="div" 
              color="text.secondary" 
              sx={{mb: 1}}
            >
              Fortaleza: {passwordStrength.label}
            </Typography>
            
            {/* Barra de progreso visual (0-100%) */}
            <LinearProgress 
              variant="determinate" 
              value={(passwordStrength.score + 1) * 20} // Convierte score 0-4 a porcentaje 20-100
              color={strengthColors[passwordStrength.score]} 
            />
            
            {/* Lista de requisitos con iconos de check/error */}
            <Box sx={{mt: 1.5}}>
              {Object.entries(passwordChecks).map(([key, value]) => {
                // Mapeo de claves técnicas a etiquetas legibles
                const labels = {
                  length: "8 caracteres", 
                  uppercase: "1 mayúscula", 
                  lowercase: "1 minúscula", 
                  number: "1 número", 
                  specialChar: "1 símbolo"
                };
                
                return (
                  <Typography 
                    key={key} 
                    variant="caption" 
                    sx={{ 
                      color: value ? 'success.main' : 'error.main', // Verde si cumple, rojo si no
                      mr: 2, 
                      display: 'inline-flex', 
                      alignItems: 'center' 
                    }}
                  >
                    {/* Icono dinámico según si cumple el requisito */}
                    {value ? 
                      <CheckCircleIcon sx={{fontSize: '1rem', mr: 0.5}}/> : 
                      <ErrorIcon sx={{fontSize: '1rem', mr: 0.5}}/>
                    }
                    {labels[key]}
                  </Typography>
                )
              })}
            </Box>
          </Box>
        </Grid>

        {/* ========================================
            CAMPO: CONFIRMAR CONTRASEÑA
            ======================================== */}
        <Grid item xs={12}>
          <Controller 
            name="password_confirm" 
            control={control} 
            render={({ field }) => (
              <TextField 
                {...field} 
                fullWidth 
                type="password" 
                label="Confirmar Contraseña" 
                sx={{
                  ...commonStyles.formField,
                  ...getFieldSx('password_confirm')
                }}
                error={!!errors.password_confirm} 
                helperText={errors.password_confirm?.message} 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                  endAdornment: getAdornment('password_confirm')
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </motion.div>
  );
};

// ========================================
// EXPORTACIÓN DEL COMPONENTE
// ========================================
export default AccountStep;