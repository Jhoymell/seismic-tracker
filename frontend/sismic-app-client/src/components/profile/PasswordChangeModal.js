import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { changePassword } from '../../api/user'; // Crearemos esta función

const PasswordChangeModal = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await changePassword(data);
      toast.success(response.detail);
      reset();
      onClose(); // Cierra el modal en caso de éxito
    } catch (error) {
      // Muestra errores específicos del backend
      if (error.response && error.response.data) {
          const apiErrors = error.response.data;
          Object.keys(apiErrors).forEach(key => {
              toast.error(`${apiErrors[key]}`);
          });
      } else {
          toast.error('Ocurrió un error.');
      }
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Cambiar Contraseña</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Contraseña Actual</label>
            <input type="password" {...register('old_password', { required: true })} />
          </div>
          <div className="form-group">
            <label>Nueva Contraseña</label>
            <input type="password" {...register('new_password1', { required: true })} />
          </div>
          <div className="form-group">
            <label>Confirmar Nueva Contraseña</label>
            <input type="password" {...register('new_password2', { required: true })} />
            {errors.new_password2 && <p className="error-message">{errors.new_password2.message}</p>}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="action-btn edit-btn">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="action-btn create-btn">
              {isSubmitting ? 'Cambiando...' : 'Cambiar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;