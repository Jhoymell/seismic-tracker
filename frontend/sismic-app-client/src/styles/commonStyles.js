// Common styles to maintain consistency across the application
// and eliminate code duplication

export const gradients = {
  // Main background gradient used in page containers
  primaryBackground: 'linear-gradient(135deg, #0a121e 80%, #10131a 100%)',
  
  // Text gradient for titles and headings
  primaryText: 'linear-gradient(90deg, #2196f3, #00bcd4, #00e5ff, #2196f3)',
  
  // Button gradients
  primaryButton: 'linear-gradient(90deg, #2196f3, #00bcd4)',
  primaryButtonHover: 'linear-gradient(90deg, #00bcd4, #2196f3)',
  
  // Card gradients
  lightCard: 'linear-gradient(135deg, #f8fdff 80%, #e3f7fa 100%)',
  
  // Footer gradient
  footer: 'linear-gradient(90deg, #10131a 60%, #1a2332 100%)',
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
  },
  
  // Primary button style
  primaryButton: {
    borderRadius: '50px',
    fontWeight: 'bold',
    background: gradients.primaryButton,
    boxShadow: shadows.button,
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
      background: gradients.primaryButtonHover,
      boxShadow: shadows.primaryHover,
    },
  },
  
  // Card style
  lightCard: {
    background: gradients.lightCard,
    borderRadius: spacing.borderRadius,
    boxShadow: shadows.primary,
  },
  
  // Form container style
  formContainer: {
    marginTop: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: gradients.primaryBackground,
    padding: { xs: 2, sm: 4 },
    borderRadius: spacing.borderRadius,
    boxShadow: shadows.primary,
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