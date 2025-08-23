// ========================================
// COMPONENTE: UniversalBackground3D
// PROPÓSITO: Componente universal para manejar todos los tipos de fondos 3D
// ========================================

import React from 'react';
import ThreeDBackground from './ThreeDBackground';
import MapBackground3D from './MapBackground3D';
import LoginBackground3D from './LoginBackground3D';
import { getBackgroundConfig } from './backgroundConfig';

/**
 * COMPONENTE PRINCIPAL: UniversalBackground3D
 * 
 * Wrapper inteligente que selecciona el fondo 3D apropiado
 * basado en el tipo de página o configuración especificada
 */
const UniversalBackground3D = ({ 
  children, 
  pageType = 'default',
  customConfig = null,
  seismicData = null // Para páginas que necesitan datos sísmicos
}) => {
  
  // Obtener configuración basada en el tipo de página
  const config = customConfig || getBackgroundConfig(pageType);
  
  // Renderizar el fondo apropiado según el tipo de página
  switch (pageType) {
    case 'map':
      return (
        <MapBackground3D 
          seismicIntensity={
            seismicData?.length 
              ? Math.min(seismicData.length / 100, 1) 
              : config.defaultSeismicIntensity
          }
          enableSeismicWaves={config.enableSeismicWaves && seismicData?.length > 0}
        >
          {children}
        </MapBackground3D>
      );
      
    case 'login':
    case 'register':
    case 'forgot-password':
    case 'reset-password':
      return (
        <LoginBackground3D>
          {children}
        </LoginBackground3D>
      );
      
    case 'profile':
      return (
        <ThreeDBackground
          starsCount={config.particleFields?.[0]?.count || 2000}
          backgroundColor={config.backgroundColor}
          enableControls={false}
        >
          {children}
        </ThreeDBackground>
      );
      
    case 'admin':
      return (
        <ThreeDBackground
          starsCount={config.particleFields?.[0]?.count || 4000}
          backgroundColor={config.backgroundColor}
          enableControls={false}
        >
          {children}
        </ThreeDBackground>
      );
      
    case 'home':
    case 'default':
    default:
      return (
        <ThreeDBackground
          starsCount={config.starsCount}
          backgroundColor={config.backgroundColor}
          enableControls={config.enableControls}
        >
          {children}
        </ThreeDBackground>
      );
  }
};

export default UniversalBackground3D;
