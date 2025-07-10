// src/components/register/validationSchemas.js
import * as yup from 'yup';

// Usamos 'export const' para una exportación nombrada
export const accountSchema = yup.object().shape({
  email: yup.string().email('Debe ser un correo válido').required('El correo es obligatorio'),
  username: yup.string().required('Un nombre de usuario es obligatorio'),
  password: yup.string()
    .required('La contraseña es obligatoria')
    .min(8, 'Debe tener al menos 8 caracteres')
    .matches(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .matches(/[a-z]/, 'Debe contener al menos una minúscula')
    .matches(/[0-9]/, 'Debe contener al menos un número')
    .matches(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
  password_confirm: yup.string()
    .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir')
    .required('Debes confirmar la contraseña'),
});

// Usamos 'export const' de nuevo para la segunda exportación nombrada
export const personalSchema = yup.object().shape({
  first_name: yup.string().required('El nombre es obligatorio'),
  last_name: yup.string().required('Los apellidos son obligatorios'),
  telefono: yup.string().min(8, 'El teléfono parece demasiado corto').required('El teléfono es obligatorio'),
  fecha_nacimiento: yup.date()
    .required('La fecha de nacimiento es obligatoria')
    .typeError('Introduce una fecha válida')
    .max(new Date(), "No puedes nacer en el futuro"),
});