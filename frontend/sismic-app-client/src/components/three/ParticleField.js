// ========================================
// COMPONENTE: ParticleField
// PROPÓSITO: Campo de partículas flotantes para efectos 3D dinámicos
// ========================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * COMPONENTE: ParticleField
 * Crea un campo de partículas animadas que flotan suavemente
 */
const ParticleField = ({ 
  count = 2000, 
  color = "#00ffff", 
  size = 2,
  speed = 0.001,
  range = 500 
}) => {
  const ref = useRef();
  
  // Generar posiciones y velocidades aleatorias para las partículas
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Posiciones iniciales aleatorias
      positions[i * 3] = (Math.random() - 0.5) * range;
      positions[i * 3 + 1] = (Math.random() - 0.5) * range;
      positions[i * 3 + 2] = (Math.random() - 0.5) * range;
      
      // Velocidades aleatorias pequeñas
      velocities[i * 3] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    
    return { positions, velocities };
  }, [count, range]);

  // Animación de las partículas
  useFrame((state) => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array;
      
      for (let i = 0; i < count; i++) {
        // Movimiento ondulatorio suave
        positions[i * 3] += Math.sin(state.clock.elapsedTime * speed + i * 0.1) * 0.1;
        positions[i * 3 + 1] += Math.cos(state.clock.elapsedTime * speed + i * 0.1) * 0.1;
        positions[i * 3 + 2] += Math.sin(state.clock.elapsedTime * speed * 0.5 + i * 0.1) * 0.05;
        
        // Mantener las partículas dentro del rango
        if (Math.abs(positions[i * 3]) > range / 2) {
          positions[i * 3] *= -0.99;
        }
        if (Math.abs(positions[i * 3 + 1]) > range / 2) {
          positions[i * 3 + 1] *= -0.99;
        }
        if (Math.abs(positions[i * 3 + 2]) > range / 2) {
          positions[i * 3 + 2] *= -0.99;
        }
      }
      
      ref.current.geometry.attributes.position.needsUpdate = true;
      
      // Rotación lenta del conjunto completo
      ref.current.rotation.y = state.clock.elapsedTime * 0.0001;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={size} 
        sizeAttenuation 
        color={color}
        transparent
        opacity={0.6}
        blending={2} // AdditiveBlending para efectos luminosos
      />
    </points>
  );
};

export default ParticleField;
