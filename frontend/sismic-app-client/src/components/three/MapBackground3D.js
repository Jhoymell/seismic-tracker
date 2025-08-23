// ========================================
// COMPONENTE: MapBackground3D
// PROPÓSITO: Fondo 3D específico para la página del mapa con efectos sísmicos
// ========================================

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import ParticleField from './ParticleField';

/**
 * COMPONENTE: SeismicWaves
 * Simula ondas sísmicas radiando desde el centro
 */
const SeismicWaves = ({ intensity = 1 }) => {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      // Simular pulsos sísmicos
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1 * intensity;
      ref.current.scale.setScalar(scale);
      ref.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0, -300]}>
        <ringGeometry args={[50, 52, 32]} />
        <meshBasicMaterial 
          color="#ff6b35" 
          transparent 
          opacity={0.3}
          side={2} // DoubleSide
        />
      </mesh>
      <mesh position={[0, 0, -300]}>
        <ringGeometry args={[80, 82, 32]} />
        <meshBasicMaterial 
          color="#ff6b35" 
          transparent 
          opacity={0.2}
          side={2} // DoubleSide
        />
      </mesh>
      <mesh position={[0, 0, -300]}>
        <ringGeometry args={[120, 122, 32]} />
        <meshBasicMaterial 
          color="#ff6b35" 
          transparent 
          opacity={0.1}
          side={2} // DoubleSide
        />
      </mesh>
    </group>
  );
};

/**
 * COMPONENTE PRINCIPAL: MapBackground3D
 * Fondo específico para la página del mapa con temática sísmica
 */
const MapBackground3D = ({ 
  children,
  seismicIntensity = 0.5,
  enableSeismicWaves = true 
}) => {
  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      <Canvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
        camera={{ 
          position: [0, 0, 100], 
          fov: 60,
          near: 0.1,
          far: 2000
        }}
        gl={{ 
          antialias: true,
          alpha: true
        }}
      >
        {/* Fondo con gradiente terrestre */}
        <color attach="background" args={["#0a0e27"]} />
        
        {/* Iluminación específica para el mapa */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={0.3} />
        
        {/* Campo de partículas base */}
        <ParticleField 
          count={3000}
          color="#4ade80"
          size={1.5}
          speed={0.0005}
          range={600}
        />
        
        {/* Partículas adicionales con efecto sísmico */}
        <ParticleField 
          count={1000}
          color="#f59e0b"
          size={2.5}
          speed={0.001}
          range={400}
        />
        
        {/* Ondas sísmicas si están habilitadas */}
        {enableSeismicWaves && (
          <SeismicWaves intensity={seismicIntensity} />
        )}
      </Canvas>

      {/* Contenido del mapa */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1,
        width: '100%',
        height: '100%'
      }}>
        {children}
      </div>
    </div>
  );
};

export default MapBackground3D;
