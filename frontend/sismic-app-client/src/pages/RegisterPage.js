import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import zxcvbn from 'zxcvbn';

import { registerUser } from '../api/auth';
// Importaremos un componente de CSS para los estilos
import './RegisterPage.css';

// 1. Definir el Esquema de Validación con Yup
const schema = yup.object().shape({
  first_name: yup.string().required('El nombre es obligatorio'),
  last_name: yup.string().required('Los apellidos son obligatorios'),
  email: yup.string()
    .email('Debe ser un correo válido')
    .required('El correo es obligatorio')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'El correo no tiene un formato válido'
    ),
  username: yup.string().required('Un nombre de usuario es obligatorio (puede ser tu correo)'),
  telefono: yup.string()
    .matches(/^\d{8,15}$/,
      'Debe contener solo números y tener entre 8 y 15 dígitos')
    .required('El teléfono es obligatorio'),
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
  fecha_nacimiento: yup.date()
    .required('La fecha de nacimiento es obligatoria')
    .typeError('Por favor, introduce una fecha válida')
    .max(new Date(Date.now() - 24 * 60 * 60 * 1000), 'La fecha debe ser anterior a hoy'),
});

const RegisterPage = () => {
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  // 2. Configurar React Hook Form
  const { register, handleSubmit, watch, formState: { errors, isSubmitting, isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange', // Para validar en tiempo real
  });

  // Observamos el campo de la contraseña para el indicador de fortaleza
  const passwordValue = watch('password');

  // Actualizar el indicador de fortaleza en tiempo real
  React.useEffect(() => {
    if (passwordValue) {
      const result = zxcvbn(passwordValue);
      setPasswordStrength(result.score); // score va de 0 a 4
    } else {
      setPasswordStrength(0);
    }
  }, [passwordValue]);

  React.useEffect(() => {
    setPasswordChecks({
      length: (passwordValue || '').length >= 8,
      uppercase: /[A-Z]/.test(passwordValue),
      lowercase: /[a-z]/.test(passwordValue),
      number: /[0-9]/.test(passwordValue),
      specialChar: /[^A-Za-z0-9]/.test(passwordValue),
    });
  }, [passwordValue]);


  // 3. Manejador del envío del formulario
  const onSubmit = async (data) => {
    const submissionData = { ...data };
    // Formatear fecha si es Date
    if (submissionData.fecha_nacimiento instanceof Date) {
      const year = submissionData.fecha_nacimiento.getFullYear();
      const month = String(submissionData.fecha_nacimiento.getMonth() + 1).padStart(2, '0');
      const day = String(submissionData.fecha_nacimiento.getDate()).padStart(2, '0');
      submissionData.fecha_nacimiento = `${year}-${month}-${day}`;
    }
    try {
      const response = await registerUser(submissionData);
      toast.success(response.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      // Mejor manejo de errores de la API
      if (error.response && error.response.data) {
        const apiErrors = error.response.data;
        if (typeof apiErrors === 'string') {
          toast.error(apiErrors);
        } else {
          Object.keys(apiErrors).forEach((key) => {
            const message = Array.isArray(apiErrors[key]) ? apiErrors[key].join(', ') : apiErrors[key];
            toast.error(`${key}: ${message}`);
          });
        }
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Ocurrió un error inesperado. Inténtalo de nuevo.');
      }
    }
};

  const strengthLabels = ["Muy Débil", "Débil", "Regular", "Fuerte", "Muy Fuerte"];

  // 4. Renderizar el Formulario JSX
  return (
    <div className="register-container">
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit(onSubmit)} className="register-form">
        <h2>Crear una Cuenta</h2>
        
        <div className="form-group">
          <input type="text" {...register('first_name')} placeholder="Nombre" />
          {errors.first_name && <p className="error-message">{errors.first_name.message}</p>}
        </div>
        
        <div className="form-group">
          <input type="text" {...register('last_name')} placeholder="Apellidos" />
          {errors.last_name && <p className="error-message">{errors.last_name.message}</p>}
        </div>

        <div className="form-group">
          <input type="email" {...register('email')} placeholder="Correo Electrónico" />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <input type="text" {...register('username')} placeholder="Nombre de Usuario" />
          {errors.username && <p className="error-message">{errors.username.message}</p>}
        </div>
        
        <div className="form-group">
          <input type="tel" {...register('telefono')} placeholder="Teléfono" />
          {errors.telefono && <p className="error-message">{errors.telefono.message}</p>}
        </div>

        <div className="form-group">
          <input type="date" {...register('fecha_nacimiento')} placeholder="Fecha de Nacimiento" />
          {errors.fecha_nacimiento && <p className="error-message">{errors.fecha_nacimiento.message}</p>}
        </div>

        <div className="form-group">
          <input type="password" {...register('password')} placeholder="Contraseña" />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>
        
        {/* Indicador de Fortaleza de Contraseña  */}
        <div className="password-strength-meter">
            <div className={`strength-bar strength-${passwordStrength}`}></div>
            <p>Fortaleza: {passwordValue ? strengthLabels[passwordStrength] : 'N/A'}</p>
        </div>
        <div className="password-checklist">
          <p className={passwordChecks.length ? 'valid' : 'invalid'}>✓ Al menos 8 caracteres</p>
          <p className={passwordChecks.lowercase ? 'valid' : 'invalid'}>✓ Al menos una minúscula</p>
          <p className={passwordChecks.uppercase ? 'valid' : 'invalid'}>✓ Al menos una mayúscula</p>
          <p className={passwordChecks.number ? 'valid' : 'invalid'}>✓ Al menos un número</p>
          <p className={passwordChecks.specialChar ? 'valid' : 'invalid'}>✓ Al menos un carácter especial</p>
        </div>

        <div className="form-group">
          <input type="password" {...register('password_confirm')} placeholder="Confirmar Contraseña" />
          {errors.password_confirm && <p className="error-message">{errors.password_confirm.message}</p>}
        </div>

        <button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;