// FloatingDocuments.jsx - Floating document cards
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

function Document({ position, rotation, delay = 0 }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(time + delay) * 0.3;
      meshRef.current.rotation.x = Math.sin(time * 0.5 + delay) * 0.1;
      meshRef.current.rotation.y = rotation[1] + Math.sin(time * 0.3 + delay) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Document card */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 1, 0.02]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Document lines */}
      {[0.3, 0.15, 0, -0.15, -0.3].map((y, i) => (
        <mesh key={i} position={[0, y, 0.011]}>
          <boxGeometry args={[0.6, 0.03, 0.01]} />
          <meshStandardMaterial
            color={i === 0 ? "#4F46E5" : "#D1D5DB"}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function FloatingDocuments() {
  return (
    <group>
      <Document
        position={[-2, 1, -1]}
        rotation={[0, 0.3, 0]}
        delay={0}
      />
      <Document
        position={[2.5, -0.5, -0.5]}
        rotation={[0, -0.5, 0]}
        delay={1}
      />
      <Document
        position={[-2.5, -1, 0]}
        rotation={[0, 0.2, 0]}
        delay={2}
      />
    </group>
  );
}
