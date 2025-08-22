import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import zxcvbn from 'zxcvbn';
import { changePassword } from '../../api/user';

// Importaciones de MUI
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  CircularProgress,
  Box,
  LinearProgress,
  Typography,
  InputAdornment
} from '@mui/material';

// Importaciones de Iconos de MUI
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

// Esquema de validación para el cambio de contraseña
const passwordSchema = yup.object().shape({
    old_password: yup.string().required('Debes ingresar tu contraseña actual.'),
    new_password1: yup.string()
        .required('Debes ingresar una nueva contraseña.')
        .min(8, 'Debe tener al menos 8 caracteres')
        .matches(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .matches(/[a-z]/, 'Debe contener al menos una minúscula')
        .matches(/[0-9]/, 'Debe contener al menos un número')
        .matches(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
    new_password2: yup.string()
        .oneOf([yup.ref('new_password1'), null], 'Las nuevas contraseñas no coinciden.')
        .required('Debes confirmar la nueva contraseña.')
});

const PasswordChangeModal = ({ open, onClose }) => {
  const { register, handleSubmit, watch, formState: { errors, touchedFields, isSubmitting }, reset } = useForm({
    resolver: yupResolver(passwordSchema),
    mode: 'onChange',
  });

  // --- LÓGICA DE VALIDACIÓN INTERACTIVA ---
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'N/A' });
  const [passwordChecks, setPasswordChecks] = useState({ length: false, uppercase: false, lowercase: false, number: false, specialChar: false });
  
  const newPasswordValue = watch('new_password1', '');
  useEffect(() => {
    // Solo recalculamos si el modal está abierto para optimizar
    if (open) {
      const strengthLabels = ["Muy Débil", "Débil", "Regular", "Fuerte", "Muy Fuerte"];
      const result = zxcvbn(newPasswordValue || '');
      setPasswordStrength({ score: result.score, label: strengthLabels[result.score] });
      setPasswordChecks({
        length: newPasswordValue.length >= 8,
        uppercase: /[A-Z]/.test(newPasswordValue),
        lowercase: /[a-z]/.test(newPasswordValue),
        number: /[0-9]/.test(newPasswordValue),
        specialChar: /[^A-Za-z0-9]/.test(newPasswordValue),
      });
    }
  }, [newPasswordValue, open]);

  // Funciones de ayuda para los estilos visuales de validación
  const getAdornment = (fieldName) => {
    if (touchedFields[fieldName] && !errors[fieldName]) {
      return <InputAdornment position="end"><CheckCircleIcon color="success" /></InputAdornment>;
    }
    if (errors[fieldName]) {
      return <InputAdornment position="end"><ErrorIcon color="error" /></InputAdornment>;
    }
    return null;
  };

  const onSubmit = async (data) => {
    try {
      const response = await changePassword(data);
      toast.success(response.detail);
      reset();
      onClose(); // Cierra el modal
    } catch (error) {
      if (error.response && error.response.data) {
          const apiErrors = error.response.data;
          Object.keys(apiErrors).forEach(key => {
              const message = Array.isArray(apiErrors[key]) ? apiErrors[key].join(', ') : apiErrors[key];
              toast.error(`${key === 'detail' || key === 'old_password' ? '' : key + ': '}${message}`);
          });
      } else {
          toast.error('Ocurrió un error.');
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{component: 'form', onSubmit: handleSubmit(onSubmit)}}>
      <DialogTitle>Cambiar Contraseña</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Para cambiar tu contraseña, por favor, introduce tu contraseña actual seguida de la nueva.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Contraseña Actual"
          type="password"
          fullWidth
          variant="outlined"
          {...register('old_password')}
          error={!!errors.old_password}
          helperText={errors.old_password?.message}
        />
        <TextField
          margin="dense"
          label="Nueva Contraseña"
          type="password"
          fullWidth
          variant="outlined"
          {...register('new_password1')}
          error={!!errors.new_password1}
          helperText={errors.new_password1?.message}
        />
        {/* Checklist y Barra de Fortaleza */}
        {newPasswordValue && (
          <Box sx={{ width: '100%', my: 2 }}>
            <Typography variant='caption' component="div" color="text.secondary" sx={{mb: 1}}>Fortaleza: {passwordStrength.label}</Typography>
            <LinearProgress variant="determinate" value={(passwordStrength.score + 1) * 20} color={["error", "error", "warning", "success", "success"][passwordStrength.score]} />
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
        )}
        <TextField
          margin="dense"
          label="Confirmar Nueva Contraseña"
          type="password"
          fullWidth
          variant="outlined"
          {...register('new_password2')}
          error={!!errors.new_password2}
          helperText={errors.new_password2?.message}
          InputProps={{endAdornment: getAdornment('new_password2')}}
        />
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={24} /> : 'Cambiar Contraseña'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordChangeModal;