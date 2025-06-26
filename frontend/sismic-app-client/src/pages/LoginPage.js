import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { loginUser } from '../api/auth';
import useAuthStore from '../store/authStore'; // Importar nuestro store
import './LoginPage.css'; // Crearemos este archivo para los estilos

const schema = yup.object().shape({
  email: yup.string().email('Debe ser un correo válido').required('El correo es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore(); // Obtener la acción de login del store

  const { register, handleSubmit, formState: { errors, isSubmitting, isValid, dirtyFields } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      const tokens = await loginUser(data);
      login(tokens); // Guardar tokens y estado del usuario en el store global
      toast.success('¡Bienvenido de nuevo!');
      navigate('/mapa'); // Redirigir al mapa después del login
    } catch (error) {
      toast.error('Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="login-container">
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <h2>Iniciar Sesión</h2>
        <div className="form-group">
          <input type="email" {...register('email')} placeholder="Correo Electrónico" />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
        <div className="form-group">
          <input type="password" {...register('password')} placeholder="Contraseña" />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={!isValid || !dirtyFields.email || !dirtyFields.password || isSubmitting}>
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </button>
        <p className="register-link">
          ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;