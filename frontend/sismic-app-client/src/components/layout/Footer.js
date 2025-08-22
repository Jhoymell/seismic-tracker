import React from 'react';
import { Box, Container, Typography, Grid, Link as MuiLink } from '@mui/material';
import { motion } from 'framer-motion';
import { gradients, colors, shadows } from '../../styles/commonStyles';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 8,
        background: gradients.footer,
        borderTop: `1px solid ${colors.secondary}15`,
        color: colors.textLight,
        boxShadow: shadows.glow,
        position: 'relative',
        zIndex: 10,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Información principal */}
          <Grid item xs={12} md={8}>
            <motion.div 
              initial={{ opacity: 0, y: 12 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <Typography variant="h6" sx={{
                color: colors.textLight,
                fontWeight: 700,
                mb: 2,
                background: gradients.primaryText,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
              }}>
                Seismic Tracker
              </Typography>
              <Typography variant="body1" sx={{
                color: colors.textSecondary,
                fontWeight: 500,
                letterSpacing: '0.3px',
                fontSize: { xs: '0.95rem', md: '1rem' },
                lineHeight: 1.6,
                mb: 1,
              }}>
                Plataforma avanzada para el monitoreo y análisis de actividad sísmica global en tiempo real.
                Desarrollada con tecnología de vanguardia para la investigación científica y la prevención.
              </Typography>
            </motion.div>
          </Grid>
          
          {/* Enlaces y créditos */}
          <Grid item xs={12} md={4}>
            <motion.div 
              initial={{ opacity: 0, y: 12 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            >
              <Typography variant="body2" sx={{
                color: colors.textSecondary,
                fontWeight: 500,
                letterSpacing: '0.3px',
                fontSize: { xs: '0.9rem', md: '0.95rem' },
                textAlign: { xs: 'center', md: 'right' },
                mb: 2,
              }}>
                Fuente de datos: 
                <MuiLink 
                  href="https://earthquake.usgs.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{
                    color: colors.secondary,
                    textDecoration: 'none',
                    fontWeight: 600,
                    ml: 1,
                    '&:hover': {
                      color: colors.accent,
                      textDecoration: 'underline',
                    }
                  }}
                >
                  USGS Earthquake Hazards Program
                </MuiLink>
              </Typography>
              <Typography variant="body2" sx={{
                color: colors.textSecondary,
                fontWeight: 500,
                letterSpacing: '0.3px',
                fontSize: { xs: '0.9rem', md: '0.95rem' },
                textAlign: { xs: 'center', md: 'right' },
              }}>
                {'© '}
                {new Date().getFullYear()}
                {' | Desarrollado por '}
                <motion.span 
                  whileHover={{ scale: 1.05 }} 
                  transition={{ type: 'spring', stiffness: 250 }} 
                  style={{ 
                    color: colors.secondary, 
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Jhoymell Lizano
                </motion.span>
                {' & '}
                <motion.span 
                  whileHover={{ scale: 1.05 }} 
                  transition={{ type: 'spring', stiffness: 250 }} 
                  style={{ 
                    color: colors.secondary, 
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Fabián Marín
                </motion.span>
              </Typography>
            </motion.div>
          </Grid>
        </Grid>
        
        {/* Separador decorativo */}
        <Box 
          sx={{
            mt: 4,
            pt: 3,
            borderTop: `1px solid ${colors.secondary}20`,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{
            color: colors.textMuted,
            fontStyle: 'italic',
            fontSize: '0.8rem',
          }}>
            "Vigilando el pulso sísmico de nuestro planeta para un futuro más seguro"
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;