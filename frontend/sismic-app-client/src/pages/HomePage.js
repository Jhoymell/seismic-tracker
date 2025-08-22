import React, { useRef, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

// Importamos los iconos que usaremos
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import NewspaperIcon from '@mui/icons-material/Newspaper';

// Importamos nuestro nuevo componente
import MapPreview from '../components/home/MapPreview';

// Importamos los estilos comunes
import { gradients, shadows, commonStyles, animations } from '../styles/commonStyles';


const HomePage = () => {
  const { isAuthenticated } = useAuthStore();

  // Scroll suave a la sección de características
  const scrollToFeatures = () => {
    const section = document.getElementById('features-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

  // Ref para animar el gradiente
  const gradientRef = useRef(null);

  useEffect(() => {
    let frameId;
    let deg = 0;
    const animate = () => {
      deg = (deg + 0.5) % 360;
      if (gradientRef.current) {
        gradientRef.current.style.background = `linear-gradient(${deg}deg, #2196f3, #00bcd4, #00e5ff, #2196f3)`;
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* SECCIÓN HÉROE */}
      <Box
        sx={{
          height: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center', p: 3,
        }}
      >
        <Container maxWidth="md">
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(10,18,30,0.85)',
              borderRadius: '1.5rem',
              padding: '0.7em 1.2em',
              boxShadow: '0 4px 32px 0 #0008',
              marginBottom: 12,
              maxWidth: '100%',
            }}
          >
            <h1
              ref={gradientRef}
              style={{
                fontSize: '3.2rem',
                fontWeight: 800,
                margin: 0,
                background: 'linear-gradient(90deg, #2196f3 10%, #fff 50%, #00bcd4 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 32px #00e5ff88) drop-shadow(0 1px 0 #fff)',
                letterSpacing: '-1px',
                lineHeight: 1.1,
                userSelect: 'none',
                cursor: 'pointer',
                animation: 'pulseGlow 2.5s infinite alternate',
                textShadow: '0 2px 8px #fff, 0 1px 0 #2196f3',
                wordBreak: 'break-word',
              }}
            >
              Monitoreando el Pulso de Nuestro Planeta
            </h1>
          </div>
          <style>{`
            @keyframes pulseGlow {
              0% { filter: drop-shadow(0 2px 32px #00e5ff88) drop-shadow(0 1px 0 #fff); }
              100% { filter: drop-shadow(0 2px 64px #2196f388) drop-shadow(0 1px 0 #fff); }
            }
          `}</style>
          {/* Subtítulo animado y botones modernos */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
            <Typography
              variant="h5"
              sx={{
                my: 3,
                background: gradients.primaryText,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
                fontSize: { xs: '1.2rem', md: '1.7rem' },
                letterSpacing: '-0.5px',
                textShadow: shadows.text,
              }}
            >
              Una plataforma interactiva para la visualización y análisis de datos sísmicos globales en tiempo real.<br />
              <span style={{ color: '#2196f3', fontWeight: 700, textShadow: '0 1px 8px #2196f3' }}>¡Explora, aprende y mantente seguro!</span>
            </Typography>
          </motion.div>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Button component={Link} to={isAuthenticated ? "/mapa" : "/registro"} variant="contained" size="large" sx={{
              ...commonStyles.primaryButton,
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
            }}>
              {isAuthenticated ? "Ver Mapa en Vivo" : "Regístrate para Empezar"}
            </Button>
            {!isAuthenticated && (
              <Button component={Link} to="/login" variant="outlined" size="large" sx={{
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
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 32px 0 rgba(33,150,243,0.10)'
                }
              }}>
                Iniciar Sesión
              </Button>
            )}
            <Button onClick={scrollToFeatures} variant="text" size="large" sx={{
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
            }}>
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
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  variants={animations.featureCard}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  whileHover={animations.scaleOnHover}
                  style={{ cursor: 'pointer' }}
                  onClick={scrollToFeatures}
                >
                  <Paper elevation={3} sx={{
                    ...commonStyles.lightCard,
                    p: 4,
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'box-shadow 0.2s',
                  }}>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#2196f3', fontSize: '1.3rem' }}>{feature.title}</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '1.05rem', color: '#333' }}>{feature.description}</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
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