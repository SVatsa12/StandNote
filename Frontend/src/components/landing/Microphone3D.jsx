// Microphone3D.jsx - Professional Studio Microphone
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export default function Microphone3D() {
  const groupRef = useRef();
  const soundWavesRef = useRef([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Gentle rotation animation
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.2;
    }

    // Animate sound waves
    soundWavesRef.current.forEach((wave, i) => {
      if (wave) {
        const offset = i * 0.5;
        wave.scale.x = 1 + Math.sin(time * 2 + offset) * 0.3;
        wave.scale.z = 1 + Math.sin(time * 2 + offset) * 0.3;
        wave.material.opacity = 0.3 + Math.sin(time * 2 + offset) * 0.2;
      }
    });
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.3}
      floatIntensity={0.5}
    >
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Microphone Mesh Grille (Top) */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <sphereGeometry args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.75]} />
          <meshStandardMaterial
            color="#d1d5db"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>

        {/* Mesh Pattern Overlay */}
        <mesh position={[0, 1.3, 0]}>
          <sphereGeometry args={[0.51, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.75]} />
          <meshStandardMaterial
            color="#9ca3af"
            metalness={0.98}
            roughness={0.1}
            wireframe={true}
            wireframeLinewidth={2}
          />
        </mesh>

        {/* Upper Ring Connector */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.36, 0.12, 32]} />
          <meshStandardMaterial
            color="#374151"
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>

        {/* Main Microphone Body */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.28, 1.3, 32]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>

        {/* Detail Ring 1 */}
        <mesh position={[0, 0.5, 0]}>
          <torusGeometry args={[0.33, 0.025, 16, 32]} />
          <meshStandardMaterial
            color="#6b7280"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Detail Ring 2 */}
        <mesh position={[0, -0.2, 0]}>
          <torusGeometry args={[0.3, 0.025, 16, 32]} />
          <meshStandardMaterial
            color="#6b7280"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Brand Badge Area */}
        <mesh position={[0, 0.15, 0.33]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.5, 0.2]} />
          <meshStandardMaterial
            color="#111827"
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>

        {/* Gold Accent Stripe */}
        <mesh position={[0, 0.15, 0.34]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.45, 0.03]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={1}
            roughness={0}
            emissive="#fbbf24"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Bottom Connector */}
        <mesh position={[0, -0.7, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.22, 0.18, 32]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* XLR Base */}
        <mesh position={[0, -0.95, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.35, 32]} />
          <meshStandardMaterial
            color="#0a0e1a"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>

        {/* XLR Pins */}
        {[0, 120, 240].map((angle, i) => {
          const x = Math.cos((angle * Math.PI) / 180) * 0.1;
          const z = Math.sin((angle * Math.PI) / 180) * 0.1;
          return (
            <mesh key={i} position={[x, -1.08, z]}>
              <cylinderGeometry args={[0.018, 0.018, 0.08, 16]} />
              <meshStandardMaterial
                color="#ffd700"
                metalness={1}
                roughness={0}
              />
            </mesh>
          );
        })}

        {/* Sound Waves */}
        {[1.2, 1.7, 2.2].map((radius, i) => (
          <mesh
            key={i}
            ref={(el) => (soundWavesRef.current[i] = el)}
            position={[0, 1.3, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[radius, 0.04, 16, 100]} />
            <meshStandardMaterial
              color="#818CF8"
              transparent
              opacity={0.3}
              emissive="#818CF8"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}
