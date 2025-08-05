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
      paper: '#1e1e1e',   // El color para "superficies" como la tarjeta del formulario
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
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