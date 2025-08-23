// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // ¡Activamos el modo oscuro!
    primary: {
      main: '#2196f3', // Un azul profesional y vibrante
    },
    secondary: {
      main: '#00bcd4', // Un acento cian/teal para contraste
    },
    background: {
      default: '#121212', // Un fondo oscuro, pero no negro puro
      paper: 'rgba(30, 30, 30, 0.85)',   // Semi-transparente para mostrar el fondo 3D
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  components: {
    // Personalizar los inputs de texto
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: '#b3b3b3', // Color del label
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#2196f3', // Color del label cuando está enfocado
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)', // Borde normal
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)', // Borde al hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2196f3', // Borde al enfocarse
            },
            '& input': {
              color: '#ffffff', // ¡TEXTO BLANCO EN LOS INPUTS!
            },
            '& textarea': {
              color: '#ffffff', // ¡TEXTO BLANCO EN TEXTAREAS!
            },
          },
        },
      },
    },
    // Personalizar selects
    MuiSelect: {
      styleOverrides: {
        root: {
          color: '#ffffff', // Texto blanco en selects
        },
      },
    },
    // Personalizar autocomplete
    MuiAutocomplete: {
      styleOverrides: {
        input: {
          color: '#ffffff !important', // Texto blanco en autocomplete
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none', // Para que los botones no estén en mayúsculas
      fontWeight: 600,
    }
  },
});

export default theme;