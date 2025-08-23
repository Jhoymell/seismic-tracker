import * as yup from 'yup';

/**
 * Esquemas de validación para el formulario de registro
 * 
 * Utiliza Yup para la validación de formularios en el proceso de registro.
 * Se divide en dos esquemas para un registro paso a paso.
 */

/**
 * Schema de validación para el primer paso: Datos de Cuenta
 * 
 * Campos validados:
 * - email: Formato de email válido y obligatorio
 * - username: Obligatorio (nombre de usuario único)
 * - password: Contraseña segura con múltiples requisitos
 * - password_confirm: Confirmación que debe coincidir con la contraseña
 * 
 * Requisitos de contraseña:
 * - Mínimo 8 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 * - Al menos un carácter especial
 */
export const accountSchema = yup.object().shape({
  email: yup
    .string()
    .email('Debe ser un correo válido')
    .required('El correo es obligatorio'),
    
  username: yup
    .string()
    .required('Un nombre de usuario es obligatorio')
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(30, 'El nombre de usuario no puede exceder 30 caracteres'),
    
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(8, 'Debe tener al menos 8 caracteres')
    .matches(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .matches(/[a-z]/, 'Debe contener al menos una minúscula')
    .matches(/[0-9]/, 'Debe contener al menos un número')
    .matches(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
    
  password_confirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir')
    .required('Debes confirmar la contraseña'),
});

/**
 * Schema de validación para el segundo paso: Información Personal
 * 
 * Campos validados:
 * - first_name: Nombre obligatorio
 * - last_name: Apellidos obligatorios
 * - telefono: Número de teléfono con longitud mínima
 * - fecha_nacimiento: Fecha válida que no sea futura
 * 
 * Validaciones especiales:
 * - La fecha de nacimiento no puede ser en el futuro
 * - El teléfono debe tener al menos 8 caracteres (formato internacional)
 */
export const personalSchema = yup.object().shape({
  first_name: yup
    .string()
    .required('El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
    
  last_name: yup
    .string()
    .required('Los apellidos son obligatorios')
    .min(2, 'Los apellidos deben tener al menos 2 caracteres')
    .max(50, 'Los apellidos no pueden exceder 50 caracteres'),
    
  telefono: yup
    .string()
    .min(8, 'El teléfono parece demasiado corto')
    .max(15, 'El teléfono parece demasiado largo')
    .required('El teléfono es obligatorio'),
    
  fecha_nacimiento: yup
    .date()
    .required('La fecha de nacimiento es obligatoria')
    .typeError('Introduce una fecha válida')
    .max(new Date(), 'No puedes nacer en el futuro')
    .test(
      'age-minimum',
      'Debes tener al menos 13 años para registrarte',
      function(value) {
        if (!value) return false;
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          return age - 1 >= 13;
        }
        return age >= 13;
      }
    ),
});