import React from 'react';
import { motion } from 'framer-motion';

/**
 * Variantes de animación para las transiciones de página
 * 
 * Estados:
 * - initial: Estado inicial cuando la página va a entrar
 * - in: Estado final cuando la página está visible
 * - out: Estado final cuando la página va a salir
 */
const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

/**
 * Configuración de transición para las animaciones de página
 * 
 * Propiedades:
 * - type: 'tween' para transiciones suaves sin rebote
 * - ease: 'anticipate' para un efecto elegante
 * - duration: 0.4 segundos para balance entre velocidad y suavidad
 */
const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

/**
 * Componente PageTransition - Wrapper para transiciones entre páginas
 * 
 * Funcionalidades:
 * - Proporciona animaciones suaves de entrada y salida para páginas
 * - Utiliza Framer Motion para animaciones fluidas
 * - Se integra con React Router para transiciones automáticas
 * - Efecto de fade in/out uniforme en toda la aplicación
 * 
 * Uso:
 * ```jsx
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 * ```
 * 
 * @param {Object} props - Props del componente
 * @param {ReactNode} props.children - Contenido de la página a animar
 * @returns {JSX.Element} PageTransition component
 */
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
