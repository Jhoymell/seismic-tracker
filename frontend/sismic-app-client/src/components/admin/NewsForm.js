import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material';

// Importaciones de Tiptap
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './MenuBar'; // Importamos nuestra barra de menú
import './Editor.css'; // Importamos los estilos del editor

const schema = yup.object().shape({
  titulo: yup.string().required('El título es obligatorio'),
  contenido: yup.string().required('El contenido es obligatorio').min(15, 'El contenido parece demasiado corto.'),
});

const NewsForm = ({ initialData, onSubmit, onClose }) => {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initialData || { titulo: '', contenido: '' },
    resolver: yupResolver(schema),
  });

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: '1rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          background:
            'linear-gradient(90deg, #2196f3, #00bcd4, #00e5ff, #2196f3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.3px',
        }}
      >
        {initialData ? 'Editar' : 'Crear'} Noticia
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="titulo"
            control={control}
            render={({ field }) => (
              <TextField {...field} autoFocus margin="dense" label="Título" type="text" fullWidth variant="outlined" error={!!errors.titulo} helperText={errors.titulo?.message}/>
            )}
          />

          <Controller
            name="contenido"
            control={control}
            render={({ field }) => <TiptapEditor value={field.value} onChange={field.onChange} />}
          />
          {errors.contenido && <p style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>{errors.contenido.message}</p>}

        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              borderRadius: '12px',
              fontWeight: 700,
              px: 3,
              background: 'linear-gradient(90deg, #2196f3, #00bcd4)',
              boxShadow: '0 4px 20px 0 rgba(33,150,243,0.15)',
              '&:hover': {
                background: 'linear-gradient(90deg, #00bcd4, #2196f3)',
                boxShadow: '0 8px 32px 0 rgba(33,150,243,0.25)',
              },
            }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Componente interno para el editor Tiptap
const TiptapEditor = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div style={{ marginTop: '16px' }}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

export default NewsForm;