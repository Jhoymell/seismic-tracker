// ========================================
// COMPONENTE: PersonalStep
// PROPÓSITO: Segundo paso del registro - maneja la información personal del usuario
// ========================================

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form'; // Hook para acceder al contexto del formulario
import { TextField, Grid, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion'; // Para animaciones de entrada/salida
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icono de validación exitosa
import ErrorIcon from '@mui/icons-material/Error'; // Icono de error
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import { commonStyles } from '../../styles/commonStyles';

// ========================================
// CONFIGURACIÓN DE ANIMACIONES
// ========================================

/**
 * Variantes de animación para el deslizamiento del componente
 * - hidden: Estado inicial (fuera de pantalla a la derecha)
 * - visible: Estado visible (posición normal)
 * - exit: Estado de salida (desliza hacia la izquierda)
 * 
 * Nota: Usa las mismas animaciones que AccountStep para consistencia visual
 */
const slideVariants = {
  hidden: { x: '100vw', opacity: 0 }, // Entra desde la derecha
  visible: { x: 0, opacity: 1, transition: { type: 'tween', duration: 0.4 } }, // Posición final
  exit: { x: '-100vw', opacity: 0, transition: { ease: 'easeInOut', duration: 0.3 } }, // Sale hacia la izquierda
};

/**
 * COMPONENTE PRINCIPAL: PersonalStep
 * 
 * Este componente renderiza el segundo paso del formulario de registro:
 * 1. Campo de nombre
 * 2. Campo de apellidos
 * 3. Campo de teléfono (con formato internacional)
 * 4. Campo de fecha de nacimiento
 * 
 * Nota: No recibe props porque toda la información necesaria viene del contexto del formulario
 */
const PersonalStep = () => {
  // ========================================
  // HOOKS Y CONFIGURACIÓN
  // ========================================
  
  // Accedemos al contexto del formulario para obtener control y estado
  const { control, formState: { errors, touchedFields } } = useFormContext();

  // ========================================
  // FUNCIONES AUXILIARES
  // ========================================
  
  /**
   * Determina qué icono mostrar al final de cada campo según su estado de validación
   * @param {string} fieldName - Nombre del campo
   * @returns {JSX.Element|null} - Icono de check o error, o null si no aplica
   * 
   * Esta función es idéntica a la de AccountStep para mantener consistencia
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
   * 
   * Esta función es idéntica a la de AccountStep para mantener consistencia visual
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
            CAMPO: NOMBRE
            ======================================== */}
        <Grid item xs={12}>
          <Controller 
            name="first_name" 
            control={control} 
            render={({ field }) => (
              <TextField 
                {...field} 
                fullWidth 
                label="Nombre" 
                sx={{
                  ...commonStyles.formField,
                  ...getFieldSx('first_name')
                }}
                error={!!errors.first_name} 
                helperText={errors.first_name?.message} 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                  endAdornment: getAdornment('first_name')
                }}
              />
            )}
          />
        </Grid>

        {/* ========================================
            CAMPO: APELLIDOS
            ======================================== */}
        <Grid item xs={12}>
          <Controller 
            name="last_name" 
            control={control} 
            render={({ field }) => (
              <TextField 
                {...field} 
                fullWidth 
                label="Apellidos" 
                sx={{
                  ...commonStyles.formField,
                  ...getFieldSx('last_name')
                }}
                error={!!errors.last_name} 
                helperText={errors.last_name?.message} 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                  endAdornment: getAdornment('last_name')
                }}
              />
            )}
          />
        </Grid>

        {/* ========================================
            CAMPO: TELÉFONO
            ======================================== */}
        <Grid item xs={12}>
          <Controller 
            name="telefono" 
            control={control} 
            render={({ field }) => (
              <TextField 
                {...field} 
                fullWidth 
                label="Número de Teléfono"
                placeholder="+506 8888-8888"
                sx={{
                  ...commonStyles.formField,
                  ...getFieldSx('telefono')
                }}
                error={!!errors.telefono} 
                helperText={errors.telefono?.message || "Incluye el código de país (ej: +506)"} 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                  endAdornment: getAdornment('telefono')
                }}
              />
            )}
          />
        </Grid>

        {/* ========================================
            CAMPO: FECHA DE NACIMIENTO
            ======================================== */}
        <Grid item xs={12}>
          <Controller 
            name="fecha_nacimiento" 
            control={control} 
            render={({ field }) => (
              <TextField 
                {...field} 
                fullWidth 
                type="date" // Input HTML5 de tipo fecha
                label="Fecha de Nacimiento" 
                sx={{
                  ...commonStyles.formField,
                  ...getFieldSx('fecha_nacimiento')
                }}
                error={!!errors.fecha_nacimiento} 
                helperText={errors.fecha_nacimiento?.message} 
                InputLabelProps={{ shrink: true }} // Mantiene el label arriba siempre
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
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
export default PersonalStep;