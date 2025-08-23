// ========================================
// COMPONENTE: HomePage
// PROPÓSITO: Página principal de la aplicación - página de aterrizaje con presentación del proyecto
// ========================================

import React, { useRef, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion'; // Para animaciones suaves
import { Link } from 'react-router-dom'; // Para navegación sin recargar página
import useAuthStore from '../store/authStore'; // Estado global de autenticación

// Importamos los iconos que usaremos para las características
import QueryStatsIcon from '@mui/icons-material/QueryStats'; // Icono para datos en tiempo real
import FilterAltIcon from '@mui/icons-material/FilterAlt'; // Icono para filtros
import NewspaperIcon from '@mui/icons-material/Newspaper'; // Icono para noticias

// Importamos el componente de preview del mapa
import MapPreview from '../components/home/MapPreview';

// Importamos los estilos comunes para mantener consistencia
import { gradients, shadows, commonStyles, animations } from '../styles/commonStyles';

/**
 * COMPONENTE PRINCIPAL: HomePage
 * 
 * Esta es la página de aterrizaje que presenta el proyecto a los visitantes:
 * 1. Sección héroe con título animado y botones de acción
 * 2. Sección de características principales
 * 3. Preview del mapa sísmico
 * 4. Información adicional y call-to-action
 * 
 * Características especiales:
 * - Animación del gradiente del título principal
 * - Botones dinámicos según estado de autenticación
 * - Scroll suave entre secciones
 * - Diseño responsivo completo
 */
const HomePage = () => {
  // ========================================
  // HOOKS Y ESTADO
  // ========================================
  
  // Verificamos si el usuario está autenticado para mostrar botones apropiados
  const { isAuthenticated } = useAuthStore();

  // ========================================
  // CONFIGURACIÓN DE DATOS
  // ========================================
  
  /**
   * Array con las características principales de la aplicación
   * Cada característica incluye icono, título y descripción
   */
  const features = [
    {
      icon: <QueryStatsIcon fontSize="large" color="primary" />,
      title: 'Datos en Tiempo Real',
      description: 'Visualiza los últimos eventos sísmicos globales gracias a nuestra integración directa con la API de USGS, actualizada constantemente. Accede a información precisa y actualizada para tomar decisiones informadas en todo momento.'
    },
    {
      icon: <FilterAltIcon fontSize="large" color="primary" />,
      title: 'Filtros Avanzados',
      description: 'Analiza la información de forma precisa utilizando filtros interactivos por magnitud, fecha y ubicación geográfica. Personaliza tu experiencia y encuentra exactamente lo que buscas.'
    },
    {
      icon: <NewspaperIcon fontSize="large" color="primary" />,
      title: 'Noticias y Análisis',
      description: 'Mantente informado con las últimas noticias y análisis relevantes sobre la actividad sísmica, gestionadas por nuestros administradores y expertos en la materia.'
    }
  ];

  // Gradientes y colores asociados para las cards (armonizan con la paleta principal)
  const featureStyles = [
    {
      bg: 'linear-gradient(135deg, rgba(33,150,243,0.18) 0%, rgba(0,188,212,0.12) 100%)',
      border: '1px solid rgba(33,150,243,0.35)',
      glow: '0 8px 32px -8px rgba(33,150,243,0.35)'
    },
    {
      bg: 'linear-gradient(135deg, rgba(0,188,212,0.18) 0%, rgba(0,229,255,0.12) 100%)',
      border: '1px solid rgba(0,188,212,0.35)',
      glow: '0 8px 32px -8px rgba(0,188,212,0.35)'
    },
    {
      bg: 'linear-gradient(135deg, rgba(0,229,255,0.18) 0%, rgba(33,150,243,0.12) 100%)',
      border: '1px solid rgba(0,229,255,0.35)',
      glow: '0 8px 32px -8px rgba(0,229,255,0.35)'
    }
  ];

  // ========================================
  // FUNCIONES AUXILIARES
  // ========================================
  
  /**
   * Función para scroll suave hacia la sección de características
   * Se activa cuando el usuario hace clic en "Descubre las Características"
   */
  const scrollToFeatures = () => {
    const section = document.getElementById('features-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ========================================
  // ANIMACIÓN DEL GRADIENTE DEL TÍTULO
  // ========================================
  
  // Ref para manipular directamente el elemento del título
  const gradientRef = useRef(null);

  /**
   * Efecto que crea una animación continua del gradiente del título principal
   * Usa requestAnimationFrame para optimizar el rendimiento
   */
  useEffect(() => {
    let frameId;
    let deg = 0; // Grados de rotación del gradiente
    
    const animate = () => {
      deg = (deg + 0.5) % 360; // Incrementa gradualmente y reinicia cada 360°
      if (gradientRef.current) {
        // Actualiza el gradiente con la nueva rotación
        gradientRef.current.style.background = `linear-gradient(${deg}deg, #2196f3, #00bcd4, #00e5ff, #2196f3)`;
      }
      frameId = requestAnimationFrame(animate); // Programa el siguiente frame
    };
    
    animate(); // Inicia la animación
    
    // Limpieza: cancela la animación cuando el componente se desmonta
    return () => cancelAnimationFrame(frameId);
  }, []); // Solo se ejecuta una vez al montar el componente

  // ========================================
  // RENDERIZADO DEL COMPONENTE
  // ========================================

  return (
    // Wrapper principal con animación de fade-in
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      
      {/* ========================================
          SECCIÓN HÉROE - PRESENTACIÓN PRINCIPAL
          ======================================== */}
      <Box
        sx={{
          height: 'calc(100vh - 64px)', // Altura completa menos el header
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center', 
          textAlign: 'center', 
          p: 3,
        }}
      >
        <Container maxWidth="md">
          {/* Contenedor del título principal con fondo semitransparente */}
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(10,18,30,0.85)', // Fondo oscuro semitransparente
              borderRadius: '1.5rem',
              padding: '0.7em 1.2em',
              boxShadow: '0 4px 32px 0 #0008', // Sombra sutil
              marginBottom: 12,
              maxWidth: '100%',
            }}
          >
            {/* Título principal con gradiente animado */}
            <h1
              ref={gradientRef} // Ref para la animación del gradiente
              style={{
                fontSize: '3.2rem',
                fontWeight: 800,
                margin: 0,
                // Gradiente inicial (será sobrescrito por la animación)
                background: 'linear-gradient(90deg, #2196f3 10%, #fff 50%, #00bcd4 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                // Efectos visuales avanzados
                filter: 'drop-shadow(0 2px 32px #00e5ff88) drop-shadow(0 1px 0 #fff)',
                letterSpacing: '-1px',
                lineHeight: 1.1,
                userSelect: 'none', // No seleccionable
                cursor: 'pointer',
                animation: 'pulseGlow 2.5s infinite alternate', // Animación de pulso
                textShadow: '0 2px 8px #fff, 0 1px 0 #2196f3',
                wordBreak: 'break-word', // Ajuste responsivo del texto
              }}
            >
              Monitoreando el Pulso de Nuestro Planeta
            </h1>
          </div>

          {/* Definición de animación CSS personalizada */}
          <style>{`
            @keyframes pulseGlow {
              0% { filter: drop-shadow(0 2px 32px #00e5ff88) drop-shadow(0 1px 0 #fff); }
              100% { filter: drop-shadow(0 2px 64px #2196f388) drop-shadow(0 1px 0 #fff); }
            }
          `}</style>

          {/* Subtítulo animado con información descriptiva */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <Typography
              variant="h5"
              sx={{
                my: 3,
                background: gradients.primaryText, // Gradiente consistente
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
                fontSize: { xs: '1.2rem', md: '1.7rem' }, // Responsivo
                letterSpacing: '-0.5px',
                textShadow: shadows.text,
              }}
            >
              Una plataforma interactiva para la visualización y análisis de datos sísmicos globales en tiempo real.<br />
              <span style={{ color: '#2196f3', fontWeight: 700, textShadow: '0 1px 8px #2196f3' }}>
                ¡Explora, aprende y mantente seguro!
              </span>
            </Typography>
          </motion.div>

          {/* ========================================
              BOTONES DE ACCIÓN PRINCIPALES
              ======================================== */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            
            {/* Botón principal - cambia según el estado de autenticación */}
            <Button 
              component={Link} 
              to={isAuthenticated ? "/mapa" : "/registro"} 
              variant="contained" 
              size="large" 
              sx={{
                ...commonStyles.primaryButton, // Estilos consistentes
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
              }}
            >
              {isAuthenticated ? "Ver Mapa en Vivo" : "Regístrate para Empezar"}
            </Button>

            {/* Botón de login - solo visible para usuarios no autenticados */}
            {!isAuthenticated && (
              <Button 
                component={Link} 
                to="/login" 
                variant="outlined" 
                size="large" 
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: '#2196f3',
                  borderColor: '#2196f3',
                  background: '#fff',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    background: '#e3f2fd',
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    transform: 'scale(1.05)', // Efecto de crecimiento
                    boxShadow: '0 8px 32px 0 rgba(33,150,243,0.10)'
                  }
                }}
              >
                Iniciar Sesión
              </Button>
            )}

            {/* Botón de navegación a características */}
            <Button 
              onClick={scrollToFeatures} 
              variant="text" 
              size="large" 
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: '50px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                color: '#00bcd4',
                textDecoration: 'underline',
                '&:hover': {
                  color: '#2196f3',
                  background: 'rgba(33,150,243,0.05)',
                  textDecoration: 'underline',
                  transform: 'scale(1.05)'
                }
              }}
            >
              Descubre las Características
            </Button>
          </Box>
        </Container>
      </Box>

      {/* SECCIÓN DE CARACTERÍSTICAS CON HOVER EFFECTS */}
      <Box id="features-section" sx={{ py: 8, background: gradients.primaryBackground }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom sx={{
            ...commonStyles.pageTitle,
            fontSize: { xs: '2rem', md: '2.5rem' },
            letterSpacing: '-1px',
            mb: 2,
            textAlign: 'center',
            display: 'block',
          }}>
            Una Herramienta Completa
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ mb: 6, fontSize: { xs: '1rem', md: '1.2rem' }, color: '#222', fontWeight: 500 }}>
            Todo lo que necesitas para explorar y entender la actividad sísmica mundial.<br />
            <span style={{ color: '#00bcd4', fontWeight: 700 }}>Descubre información, filtra eventos y mantente informado en un solo lugar.</span>
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => {
              const style = featureStyles[index % featureStyles.length];
              return (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    variants={animations.featureCard}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    whileHover={{ scale: 1.04, translateY: -6 }}
                    style={{ cursor: 'pointer' }}
                    onClick={scrollToFeatures}
                  >
                    <Paper elevation={0} sx={{
                      position: 'relative',
                      p: 4,
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      borderRadius: '24px',
                      background: style.bg,
                      backdropFilter: 'blur(6px)',
                      border: style.border,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                      transition: 'box-shadow .35s, transform .35s',
                      overflow: 'hidden',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), transparent 60%)',
                        pointerEvents: 'none'
                      },
                      '&:hover': {
                        boxShadow: style.glow
                      }
                    }}>
                      <Box sx={{
                        width: 74,
                        height: 74,
                        borderRadius: '22px',
                        mx: 'auto',
                        mb: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(140deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 90%)',
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.09), 0 4px 18px -4px rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(4px)',
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" fontWeight={700} gutterBottom sx={{
                        background: 'linear-gradient(90deg,#2196f3,#00e5ff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '1.25rem',
                        letterSpacing: '-0.5px'
                      }}>
                        {feature.title}
                      </Typography>
                      <Typography sx={{
                        fontSize: '0.95rem',
                        lineHeight: 1.5,
                        color: 'rgba(0,0,0,0.72)',
                        fontWeight: 500
                      }}>
                        {feature.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
      {/* --- NUEVA SECCIÓN DE VISTA PREVIA DEL MAPA --- */}
      <Box sx={{ py: 10, background: gradients.primaryBackground }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            <Box sx={{
              display: 'inline-block',
              background: 'rgba(10,18,30,0.95)',
              borderRadius: '1.5rem',
              px: { xs: 2, md: 4 },
              py: { xs: 1, md: 2 },
              boxShadow: shadows.primary,
              mb: 3,
              mx: 'auto',
              maxWidth: '100%',
            }}>
              <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom sx={{
                ...commonStyles.pageTitle,
                fontSize: { xs: '2rem', md: '2.5rem' },
                letterSpacing: '-1px',
                m: 0,
                textAlign: 'center',
                display: 'block',
              }}>
                Explora el Mapa en Tiempo Real
              </Typography>
            </Box>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <Typography variant="body1" textAlign="center" sx={{ mb: 6, fontSize: { xs: '1rem', md: '1.2rem' }, color: '#00bcd4', fontWeight: 600, letterSpacing: '0.5px' }}>
              Una vista previa de los últimos eventos sísmicos registrados a nivel mundial.
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Paper elevation={3} sx={{
              ...commonStyles.lightCard,
              borderRadius: '1.5rem',
              p: { xs: 1, md: 3 },
              background: gradients.primaryBackground,
              maxWidth: 900,
              mx: 'auto',
            }}>
              <MapPreview />
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </motion.div>
  );
};

export default HomePage;