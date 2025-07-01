import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';

import { getProfile, updateProfile } from '../api/user';
import useAuthStore from '../store/authStore';
import './ProfilePage.css';

// Esquema de validación para la actualización
const schema = yup.object().shape({
  first_name: yup.string().required('El nombre es obligatorio'),
  last_name: yup.string().required('Los apellidos son obligatorios'),
  telefono: yup.string().matches(/^[0-9]+$/, "Debe contener solo números").min(8, 'Debe tener al menos 8 dígitos'),
  // La contraseña es opcional, pero si se escribe, debe cumplir los requisitos
  password: yup.string().transform(value => !!value ? value : undefined).optional().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
  password_confirm: yup.string().oneOf([yup.ref('password'), undefined], 'Las contraseñas deben coincidir'),
  // El campo de la foto no se valida con yup, se maneja por separado
  ruta_fotografia: yup.mixed().optional(),
});

const ProfilePage = () => {
  const { user, login } = useAuthStore(); // Usaremos 'login' para actualizar el store con los nuevos datos

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  // Efecto para cargar los datos del perfil al montar la página
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await getProfile();
        // Usamos 'reset' de react-hook-form para rellenar el formulario
        reset({
          ...profileData,
          fecha_nacimiento: profileData.fecha_nacimiento, // Ya viene en YYYY-MM-DD
        });
      } catch (error) {
        toast.error("No se pudo cargar tu perfil.");
      }
    };
    loadProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    const loadingToast = toast.loading('Actualizando perfil...');
    try {
      // El campo 'ruta_fotografia' del formulario contendrá un objeto FileList
      const profileData = {
        ...data,
        ruta_fotografia: data.ruta_fotografia[0] // Enviamos solo el primer archivo
      };

      const updatedUser = await updateProfile(profileData);
      toast.success('Perfil actualizado correctamente.', { id: loadingToast });

      // Actualizamos el estado global con el nuevo usuario
      const { accessToken, refreshToken } = useAuthStore.getState();
      login({ access: accessToken, refresh: refreshToken }); // Re-login para actualizar datos del token decodificado

    } catch (error) {
      toast.error('Hubo un error al actualizar tu perfil.', { id: loadingToast });
    }
  };

  return (
    <div className="profile-container">
      <Toaster />
      <h2>Mi Perfil</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
        <div className="form-section">
            <h4>Datos Personales</h4>
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" {...register('first_name')} />
              {errors.first_name && <p className="error-message">{errors.first_name.message}</p>}
            </div>
            <div className="form-group">
              <label>Apellidos</label>
              <input type="text" {...register('last_name')} />
              {errors.last_name && <p className="error-message">{errors.last_name.message}</p>}
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input type="tel" {...register('telefono')} />
              {errors.telefono && <p className="error-message">{errors.telefono.message}</p>}
            </div>
            <div className="form-group">
              <label>Foto de Perfil</label>
              <input type="file" accept="image/*" {...register('ruta_fotografia')} />
            </div>
        </div>

        <div className="form-section">
            <h4>Cambiar Contraseña (opcional)</h4>
            <div className="form-group">
              <label>Nueva Contraseña</label>
              <input type="password" {...register('password')} />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>
            <div className="form-group">
              <label>Confirmar Nueva Contraseña</label>
              <input type="password" {...register('password_confirm')} />
              {errors.password_confirm && <p className="error-message">{errors.password_confirm.message}</p>}
            </div>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;