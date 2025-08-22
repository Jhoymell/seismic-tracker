import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Grid, InputAdornment, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-number-input';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const slideVariants = {
  hidden: { x: '100vw', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'tween', duration: 0.4 } },
  exit: { x: '-100vw', opacity: 0, transition: { ease: 'easeInOut', duration: 0.3 } },
};

const PersonalStep = () => {
  const { control, formState: { errors, touchedFields } } = useFormContext();

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
          <Controller name="first_name" control={control} render={({ field }) => (
            <TextField {...field} fullWidth label="Nombre" sx={getFieldSx('first_name')} error={!!errors.first_name} helperText={errors.first_name?.message} InputProps={{endAdornment: getAdornment('first_name')}} />
          )}/>
        </Grid>
        <Grid item xs={12}>
          <Controller name="last_name" control={control} render={({ field }) => (
            <TextField {...field} fullWidth label="Apellidos" sx={getFieldSx('last_name')} error={!!errors.last_name} helperText={errors.last_name?.message} InputProps={{endAdornment: getAdornment('last_name')}} />
          )}/>
        </Grid>
        <Grid item xs={12}>
          <Controller name="telefono" control={control} render={({ field }) => ( <PhoneInput {...field} defaultCountry="CR" international className="phone-input-mui" placeholder="Número de teléfono"/> )} />
          {errors.telefono && <Typography color="error" variant="caption">{errors.telefono.message}</Typography>}
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="fecha_nacimiento"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Fecha de Nacimiento"
                value={field.value}
                onChange={field.onChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    error: !!errors.fecha_nacimiento,
                    helperText: errors.fecha_nacimiento?.message,
                    sx: getFieldSx('fecha_nacimiento'),
                  },
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default PersonalStep;