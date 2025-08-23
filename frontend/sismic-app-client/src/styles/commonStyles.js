// Common styles to maintain consistency across the application
// and eliminate code duplication

export const gradients = {
  // Main background gradient used in page containers (más transparente para mostrar el fondo 3D)
  primaryBackground: 'linear-gradient(135deg, rgba(10, 18, 30, 0.8) 80%, rgba(16, 19, 26, 0.9) 100%)',
  
  // Text gradient for titles and headings
  primaryText: 'linear-gradient(90deg, #2196f3, #00bcd4, #00e5ff, #2196f3)',
  
  // Button gradients
  primaryButton: 'linear-gradient(90deg, #2196f3, #00bcd4)',
  primaryButtonHover: 'linear-gradient(90deg, #00bcd4, #2196f3)',
  
  // Card gradients (más transparente)
  lightCard: 'linear-gradient(135deg, rgba(248, 253, 255, 0.1) 80%, rgba(227, 247, 250, 0.15) 100%)',
  
  // Footer gradient (más transparente)
  footer: 'linear-gradient(90deg, rgba(16, 19, 26, 0.9) 60%, rgba(26, 35, 50, 0.9) 100%)',
};

export const colors = {
  primary: '#2196f3',
  secondary: '#00bcd4',
  accent: '#00e5ff',
  textLight: '#e3f7fa',
  textSecondary: '#b3e5fc',
  textMuted: '#b3b3b3',
  success: '#4caf50',
  error: '#f44336',
};

export const shadows = {
  primary: '0 2px 16px 0 #00bcd422',
  primaryHover: '0 8px 32px 0 rgba(33,150,243,0.25)',
  button: '0 4px 20px 0 rgba(33,150,243,0.15)',
  text: '0 2px 12px #00e5ff33',
  glow: '0 -2px 32px 0 #2196f355',
};

export const spacing = {
  borderRadius: '1rem',
  borderRadiusLarge: '1.5rem',
  borderRadiusSmall: '0.5rem',
};

// Common component styles
export const commonStyles = {
  // Page container style
  pageContainer: {
    background: gradients.primaryBackground,
    borderRadius: spacing.borderRadius,
    boxShadow: shadows.primary,
    padding: { xs: 2, sm: 4 },
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Page title style
  pageTitle: {
    background: gradients.primaryText,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 800,
    letterSpacing: '-0.3px',
    filter: `drop-shadow(${shadows.text})`,
    textAlign: 'center',
    marginBottom: '1rem',
  },
  
  // Primary button style
  primaryButton: {
    borderRadius: '12px',
    fontWeight: 700,
    background: gradients.primaryButton,
    boxShadow: shadows.button,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: '12px 24px',
    fontSize: '1rem',
    textTransform: 'none',
    
    '&:hover': {
      transform: 'translateY(-2px)',
      background: gradients.primaryButtonHover,
      boxShadow: shadows.primaryHover,
    },
    
    '&:active': {
      transform: 'translateY(0px)',
    },
  },
  
  // Card style
  lightCard: {
    background: gradients.lightCard,
    borderRadius: spacing.borderRadius,
    boxShadow: shadows.primary,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    
    '&:hover': {
      boxShadow: shadows.primaryHover,
      transform: 'translateY(-2px)',
    },
  },
  
  // Enhanced form container style
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 253, 255, 0.9) 100%)',
    backdropFilter: 'blur(15px)',
    borderRadius: '1.5rem',
    padding: { xs: 3, sm: 4 },
    boxShadow: '0 12px 48px rgba(33, 150, 243, 0.12), 0 8px 32px rgba(0, 188, 212, 0.08)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '450px',
    
    // Efecto de brillo en el borde superior
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #2196f3, #00bcd4, #00e5ff, #2196f3)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 3s infinite linear',
    },
    
    // Definir la animación shimmer
    '@keyframes shimmer': {
      '0%': { backgroundPosition: '200% 0%' },
      '100%': { backgroundPosition: '-200% 0%' },
    },
  },
  
  // Enhanced form field styles
  formField: {
    width: '100%',
    marginTop: '16px',
    marginBottom: '8px',
    
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      fontSize: '1rem',
      
      '& fieldset': {
        borderColor: 'rgba(33, 150, 243, 0.3)',
        borderWidth: '2px',
        transition: 'all 0.3s ease',
      },
      
      '&:hover fieldset': {
        borderColor: 'rgba(33, 150, 243, 0.6)',
      },
      
      '&.Mui-focused fieldset': {
        borderColor: '#2196f3',
        boxShadow: '0 0 16px rgba(33, 150, 243, 0.2)',
      },
      
      '&.Mui-error fieldset': {
        borderColor: '#f44336',
        boxShadow: '0 0 16px rgba(244, 67, 54, 0.2)',
      },
    },
    
    '& .MuiInputLabel-root': {
      color: 'rgba(33, 150, 243, 0.8)',
      fontWeight: 600,
      fontSize: '1rem',
      
      '&.Mui-focused': {
        color: '#2196f3',
      },
      
      '&.Mui-error': {
        color: '#f44336',
      },
    },
    
    '& .MuiFormHelperText-root': {
      fontWeight: 500,
      marginLeft: '12px',
      fontSize: '0.875rem',
      
      '&.Mui-error': {
        color: '#f44336',
      },
    },
  },
  
  // Icon container for forms
  iconContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(0, 188, 212, 0.15) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    position: 'relative',
    
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: '-2px',
      borderRadius: '50%',
      background: 'linear-gradient(45deg, #2196f3, #00bcd4)',
      opacity: 0.3,
      zIndex: -1,
    },
  },

  // Nuevos estilos mejorados para inputs con texto blanco
  styledInput: {
    '& .MuiInputLabel-root': {
      color: colors.textSecondary,
      fontWeight: 500,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: colors.primary,
      fontWeight: 600,
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(33, 150, 243, 0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: colors.primary,
        borderWidth: '2px',
      },
      '& input': {
        color: '#ffffff !important',
        fontWeight: 500,
        fontSize: '16px',
      },
      '& textarea': {
        color: '#ffffff !important',
        fontWeight: 500,
        fontSize: '16px',
      },
    },
    '& .MuiInputAdornment-root': {
      color: colors.textSecondary,
    },
    '& .MuiFormHelperText-root': {
      color: colors.textSecondary,
      fontSize: '0.875rem',
      marginLeft: '8px',
    },
    '& .MuiFormHelperText-root.Mui-error': {
      color: colors.error,
      fontWeight: 500,
    },
  },

  // Estilo para inputs con iconos
  inputWithIcon: {
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      color: colors.primary,
      fontSize: '1.2rem',
    },
  },
};

// Animation variants for framer-motion
export const animations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  },
  
  featureCard: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
  },
  
  scaleOnHover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
};