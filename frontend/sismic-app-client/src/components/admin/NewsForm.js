import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  titulo: yup.string().required('El título es obligatorio'),
  contenido: yup.string().required('El contenido es obligatorio'),
});

const NewsForm = ({ initialData, onSubmit, onClose }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initialData || { titulo: '', contenido: '' },
    resolver: yupResolver(schema),
  });

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>{initialData ? 'Editar' : 'Crear'} Noticia</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Título</label>
            <input type="text" {...register('titulo')} />
            {errors.titulo && <p className="error-message">{errors.titulo.message}</p>}
          </div>
          <div className="form-group">
            <label>Contenido</label>
            <textarea rows="5" {...register('contenido')}></textarea>
            {errors.contenido && <p className="error-message">{errors.contenido.message}</p>}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="action-btn edit-btn">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="action-btn create-btn">
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsForm;