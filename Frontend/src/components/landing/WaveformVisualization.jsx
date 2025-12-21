// WaveformVisualization.jsx - Audio waveform particle visualization
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function WaveformVisualization() {
  const pointsRef = useRef();

  // Create particle-based waveform
  const particleData = useMemo(() => {
    const columns = 80; // Number of vertical columns
    const particlesPerColumn = 30; // Particles in each column
    const count = columns * particlesPerColumn;
    
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const initialHeights = new Float32Array(columns);

    // Generate initial waveform shape
    for (let i = 0; i < columns; i++) {
      initialHeights[i] = Math.random();
    }

    let index = 0;
    for (let col = 0; col < columns; col++) {
      const x = (col / columns) * 8 - 4; // Spread across width
      
      for (let p = 0; p < particlesPerColumn; p++) {
        const i3 = index * 3;
        
        positions[i3] = x;
        positions[i3 + 1] = 0; // Will be updated in animation
        positions[i3 + 2] = -2;
        
        // Color gradient (blue to purple to pink)
        const t = col / columns;
        colors[i3] = 0.4 + t * 0.5;     // R
        colors[i3 + 1] = 0.5 - t * 0.3; // G
        colors[i3 + 2] = 0.95;           // B
        
        index++;
      }
    }

    return { positions, colors, count, columns, particlesPerColumn, initialHeights };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      const { columns, particlesPerColumn } = particleData;
      
      let index = 0;
      for (let col = 0; col < columns; col++) {
        // Create animated waveform height for this column
        const waveHeight = Math.abs(
          Math.sin(time * 2 + col * 0.15) * 
          Math.cos(time * 1.5 + col * 0.1)
        ) * 1.5 + 0.3;
        
        for (let p = 0; p < particlesPerColumn; p++) {
          const i3 = index * 3;
          
          // Distribute particles vertically based on waveform height
          const normalizedPos = (p / particlesPerColumn) - 0.5;
          const particleHeight = normalizedPos * 2;
          
          // Only show particles within the waveform envelope
          if (Math.abs(particleHeight) < waveHeight) {
            positions[i3 + 1] = particleHeight;
          } else {
            positions[i3 + 1] = 100; // Hide particles outside envelope
          }
          
          index++;
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleData.count}
            array={particleData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleData.count}
            array={particleData.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Center line */}
      <mesh position={[0, 0, -2]}>
        <boxGeometry args={[8, 0.01, 0.01]} />
        <meshStandardMaterial
          color="#6366F1"
          transparent
          opacity={0.3}
          emissive="#6366F1"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
