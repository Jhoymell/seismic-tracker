// ========================================
// COMPONENTE: ThreeDBackground
// PROPÓSITO: Fondo 3D con efecto de estrellas para la aplicación
// ========================================

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

/**
 * COMPONENTE: AnimatedStars
 * Crea un campo de estrellas animado con movimiento suave
 */
const AnimatedStars = ({ count = 5000 }) => {
  const ref = useRef();
  
  // Generar posiciones aleatorias para las estrellas
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2000; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2000; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2000; // z
    }
    return pos;
  }, [count]);

  // Animación de rotación suave
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.0001;
      ref.current.rotation.y = state.clock.elapsedTime * 0.0002;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={1.5} 
        sizeAttenuation 
        color="#ffffff"
        transparent
        opacity={0.8}
      />
    </points>
  );
};

/**
 * COMPONENTE: NebulaEffect
 * Añade un efecto de nebulosa de fondo
 */
const NebulaEffect = () => {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.0001;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -500]}>
      <planeGeometry args={[2000, 2000]} />
      <meshBasicMaterial 
        color="#000428"
        transparent
        opacity={0.3}
      />
    </mesh>
  );
};

/**
 * COMPONENTE PRINCIPAL: ThreeDBackground
 * Renderiza el fondo 3D completo con Canvas y efectos
 */
const ThreeDBackground = ({ 
  children, 
  enableControls = false,
  starsCount = 5000,
  backgroundColor = "#000011"
}) => {
  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Canvas 3D como fondo */}
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
        {/* Configurar el color de fondo */}
        <color attach="background" args={[backgroundColor]} />
        
        {/* Iluminación ambiental suave */}
        <ambientLight intensity={0.1} />
        
        {/* Efectos de estrellas y nebulosa */}
        <AnimatedStars count={starsCount} />
        <NebulaEffect />
        
        {/* Controles opcionales para debugging */}
        {enableControls && (
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.1}
          />
        )}
      </Canvas>

      {/* Contenido de la aplicación encima del fondo 3D */}
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

export default ThreeDBackground;
