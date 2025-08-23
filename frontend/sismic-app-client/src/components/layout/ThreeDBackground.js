// ========================================
// COMPONENTE: ThreeDBackground
// PROPÓSITO: Fondo 3D interactivo con campo de estrellas para toda la aplicación
// ========================================

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { Box } from '@mui/material';
import * as random from 'maath/random/dist/maath-random.esm';

// ========================================
// COMPONENTE: Stars
// PROPÓSITO: Genera y anima un campo de estrellas en 3D
// ========================================

const Stars = () => {
  const ref = useRef();
  
  // ========================================
  // GENERACIÓN DE ESTRELLAS
  // ========================================
  
  /**
   * Genera 5000 estrellas en posiciones aleatorias dentro de una esfera
   * useMemo evita regenerar las posiciones en cada render
   */
  const sphere = useMemo(() => {
    try {
      return random.inSphere(new Float32Array(5000), { radius: 1.5 });
    } catch {
      // Fallback: generar posiciones manualmente si hay error
      const positions = new Float32Array(5000);
      for (let i = 0; i < positions.length; i += 3) {
        const r = Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i] = r * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = r * Math.cos(phi);
      }
      return positions;
    }
  }, []);

  // ========================================
  // ANIMACIÓN DEL CAMPO DE ESTRELLAS
  // ========================================
  
  /**
   * useFrame ejecuta esta función en cada frame (60 FPS)
   * Crea una rotación lenta y constante del campo de estrellas
   */
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10; // Rotación horizontal lenta
      ref.current.rotation.y -= delta / 15; // Rotación vertical más lenta
    }
  });

  return (
    <Points 
      ref={ref} 
      positions={sphere} 
      stride={3} 
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.005} // Tamaño pequeño para efecto sutil
        sizeAttenuation={true} // Las estrellas más lejanas se ven más pequeñas
        depthWrite={false} // Mejora el rendimiento
      />
    </Points>
  );
};

// ========================================
// COMPONENTE PRINCIPAL: ThreeDBackground
// ========================================

/**
 * COMPONENTE PRINCIPAL: ThreeDBackground
 * 
 * Funcionalidades principales:
 * 1. Renderiza un fondo 3D fijo que cubre toda la pantalla
 * 2. Muestra un campo de estrellas animado
 * 3. Se posiciona detrás de todos los demás elementos (z-index: -1)
 * 4. Proporciona una experiencia visual inmersiva y temática
 * 
 * Características técnicas:
 * - Utiliza React Three Fiber para renderizado 3D
 * - Optimizado para rendimiento con useMemo y useFrame
 * - Posicionamiento absoluto que no interfiere con la UI
 * - Animación suave de 60 FPS
 */
const ThreeDBackground = () => (
  <Box 
    sx={{ 
      width: '100vw',  // Ancho completo de la ventana
      height: '100vh', // Alto completo de la ventana
      position: 'fixed', // Posición fija para que no se mueva con scroll
      top: 0, 
      left: 0, 
      zIndex: -1, // ¡CRUCIAL! Lo coloca detrás de todos los elementos
      pointerEvents: 'none', // Permite que los clicks pasen a través
    }}
  >
    {/* ========================================
        CANVAS 3D CON REACT THREE FIBER
    ======================================== */}
    <Canvas 
      camera={{ 
        position: [0, 0, 1], // Posición de la cámara
        fov: 60 // Campo de visión
      }}
      dpr={Math.min(window.devicePixelRatio, 2)} // Optimización para diferentes pantallas
    >
      {/* Componente de estrellas animadas */}
      <Stars />
    </Canvas>
  </Box>
);

export default ThreeDBackground;
