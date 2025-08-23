// ========================================
// COMPONENTE: LoginBackground3D
// PROPÓSITO: Fondo 3D elegante para la página de login
// ========================================

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import ParticleField from './ParticleField';

/**
 * COMPONENTE: FloatingGeometry
 * Geometrías flotantes con animación suave
 */
const FloatingGeometry = () => {
  const groupRef = useRef();
  const sphere1Ref = useRef();
  const sphere2Ref = useRef();
  const sphere3Ref = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    
    if (sphere1Ref.current) {
      sphere1Ref.current.rotation.x = state.clock.elapsedTime * 0.3;
      sphere1Ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 20;
    }
    
    if (sphere2Ref.current) {
      sphere2Ref.current.rotation.z = state.clock.elapsedTime * 0.2;
      sphere2Ref.current.position.x = Math.cos(state.clock.elapsedTime * 0.3) * 30;
    }
    
    if (sphere3Ref.current) {
      sphere3Ref.current.rotation.y = state.clock.elapsedTime * 0.4;
      sphere3Ref.current.position.z = Math.sin(state.clock.elapsedTime * 0.4) * 15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Esfera principal */}
      <mesh ref={sphere1Ref} position={[-100, 0, -200]}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial 
          color="#3b82f6" 
          transparent 
          opacity={0.3}
          wireframe
        />
      </mesh>
      
      {/* Esfera secundaria */}
      <mesh ref={sphere2Ref} position={[80, -50, -150]}>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial 
          color="#8b5cf6" 
          transparent 
          opacity={0.4}
          wireframe
        />
      </mesh>
      
      {/* Esfera terciaria */}
      <mesh ref={sphere3Ref} position={[0, 70, -180]}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial 
          color="#06b6d4" 
          transparent 
          opacity={0.5}
          wireframe
        />
      </mesh>
    </group>
  );
};

/**
 * COMPONENTE PRINCIPAL: LoginBackground3D
 * Fondo específico para la página de login con estética profesional
 */
const LoginBackground3D = ({ children }) => {
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
        {/* Fondo con gradiente corporativo */}
        <color attach="background" args={["#0f172a"]} />
        
        {/* Iluminación suave y profesional */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} />
        
        {/* Campo de partículas elegantes */}
        <ParticleField 
          count={1500}
          color="#64748b"
          size={1}
          speed={0.0003}
          range={400}
        />
        
        {/* Partículas secundarias con color azul */}
        <ParticleField 
          count={800}
          color="#3b82f6"
          size={1.5}
          speed={0.0002}
          range={300}
        />
        
        {/* Geometrías flotantes */}
        <FloatingGeometry />
      </Canvas>

      {/* Contenido de la página de login */}
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

export default LoginBackground3D;
