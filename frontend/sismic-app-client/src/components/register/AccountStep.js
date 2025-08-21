import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Grid, InputAdornment, Box, LinearProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const slideVariants = {
  hidden: { x: '100vw', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'tween', duration: 0.4 } },
  exit: { x: '-100vw', opacity: 0, transition: { ease: 'easeInOut', duration: 0.3 } },
};

// Recibe los props del estado de la contraseña desde el padre
const AccountStep = ({ passwordStrength, passwordChecks }) => {
  const { control, formState: { errors, touchedFields } } = useFormContext();

  // const strengthLabels = ["Muy Débil", "Débil", "Regular", "Fuerte", "Muy Fuerte"]; // Removed unused variable
  const strengthColors = ["error", "error", "warning", "success", "success"];

  const getAdornment = (fieldName) => {
    if (touchedFields[fieldName] && !errors[fieldName]) {
      return <InputAdornment position="end"><CheckCircleIcon color="success" /></InputAdornment>;
    }
    if (errors[fieldName]) {
      return <InputAdornment position="end"><ErrorIcon color="error" /></InputAdornment>;
    }
    return null;
  };

  const getFieldSx = (fieldName) => ({
    ...(touchedFields[fieldName] && !errors[fieldName] && {
      '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': { borderColor: 'success.main' },
        '& fieldset': { borderColor: 'success.main' },
        '&:hover fieldset': { borderColor: 'success.main' },
      },
      '& label.Mui-focused': { color: 'success.main' }
    }),
  });

  return (
    <motion.div variants={slideVariants} initial="hidden" animate="visible" exit="exit">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller name="email" control={control} render={({ field }) => (
            <TextField {...field} fullWidth label="Correo Electrónico" sx={getFieldSx('email')} error={!!errors.email} helperText={errors.email?.message} InputProps={{endAdornment: getAdornment('email')}}/>
          )}/>
        </Grid>
        <Grid item xs={12}>
          <Controller name="username" control={control} render={({ field }) => (
            <TextField {...field} fullWidth label="Nombre de Usuario" sx={getFieldSx('username')} error={!!errors.username} helperText={errors.username?.message} InputProps={{endAdornment: getAdornment('username')}}/>
          )}/>
        </Grid>
        <Grid item xs={12}>
          <Controller name="password" control={control} render={({ field }) => (
            <TextField {...field} fullWidth type="password" label="Contraseña" error={!!errors.password} helperText={errors.password?.message} />
          )}/>
        </Grid>
         <Grid item xs={12}>
            <Box sx={{ width: '100%', mb: 1 }}>
              <Typography variant='caption' component="div" color="text.secondary" sx={{mb: 1}}>Fortaleza: {passwordStrength.label}</Typography>
              <LinearProgress variant="determinate" value={(passwordStrength.score + 1) * 20} color={strengthColors[passwordStrength.score]} />
              <Box sx={{mt: 1.5}}>
                {Object.entries(passwordChecks).map(([key, value]) => {
                  const labels = {length: "8 caracteres", uppercase: "1 mayúscula", lowercase: "1 minúscula", number: "1 número", specialChar: "1 símbolo"};
                  return (
                    <Typography key={key} variant="caption" sx={{ color: value ? 'success.main' : 'error.main', mr: 2, display: 'inline-flex', alignItems: 'center' }}>
                      {value ? <CheckCircleIcon sx={{fontSize: '1rem', mr: 0.5}}/> : <ErrorIcon sx={{fontSize: '1rem', mr: 0.5}}/>}
                      {labels[key]}
                    </Typography>
                  )
                })}
              </Box>
            </Box>
        </Grid>
        <Grid item xs={12}>
          <Controller name="password_confirm" control={control} render={({ field }) => (
            <TextField {...field} fullWidth type="password" label="Confirmar Contraseña" sx={getFieldSx('password_confirm')} error={!!errors.password_confirm} helperText={errors.password_confirm?.message} InputProps={{endAdornment: getAdornment('password_confirm')}} />
          )}/>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default AccountStep;