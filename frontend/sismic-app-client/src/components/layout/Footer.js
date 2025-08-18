import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 8,
        background: 'linear-gradient(90deg, #10131a 60%, #1a2332 100%)',
        borderTop: 'none',
        textAlign: 'center',
        color: '#e3f7fa',
        boxShadow: '0 -2px 32px 0 #2196f355',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <Container maxWidth="lg">
        {/* animación sutil al entrar */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: 'easeOut' }}>
          <Typography variant="body2" sx={{
            color: '#b3e5fc',
            fontWeight: 500,
            letterSpacing: '0.5px',
            fontSize: { xs: '1rem', md: '1.1rem' },
            textShadow: '0 1px 8px #2196f355',
          }}>
            {'© '}
            {new Date().getFullYear()}
            {' Proyecto Sismológico | Desarrollado por '}
            {/* realce en hover sobre autores */}
            <motion.span whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 250 }} style={{ color: '#00bcd4', fontWeight: 700 }}>
              Jhoymell Lizano y Fabian Marin
            </motion.span>.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;