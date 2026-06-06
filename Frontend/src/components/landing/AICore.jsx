// AICore.jsx - An animated 3D AI Core representing the intelligence engine
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Icosahedron, MeshDistortMaterial } from '@react-three/drei';

export default function AICore() {
  const coreRef = useRef();
  const outerRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.x = time * 0.2;
      coreRef.current.rotation.y = time * 0.3;
    }
    if (outerRef.current) {
      outerRef.current.rotation.x = -time * 0.1;
      outerRef.current.rotation.y = -time * 0.15;
      outerRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.5;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(time) * 0.1;
      ringRef.current.rotation.y = Math.cos(time) * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Inner solid glowing core */}
      <Sphere ref={coreRef} args={[1, 32, 32]}>
        <meshStandardMaterial 
          color="#3B82F6" 
          emissive="#60A5FA"
          emissiveIntensity={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>

      {/* Outer distorted wireframe shell */}
      <Icosahedron ref={outerRef} args={[1.5, 2]}>
        <MeshDistortMaterial
          color="#818CF8"
          emissive="#4F46E5"
          emissiveIntensity={1}
          wireframe
          distort={0.4}
          speed={2}
          transparent
          opacity={0.3}
        />
      </Icosahedron>

      {/* Orbiting data rings */}
      <group ref={ringRef}>
        <mesh>
          <torusGeometry args={[2.5, 0.02, 16, 100]} />
          <meshStandardMaterial color="#60A5FA" emissive="#3B82F6" emissiveIntensity={2} />
        </mesh>
        
        {/* Orbiting data particles on the ring */}
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={3} />
          </mesh>
        ))}
      </group>
      
      {/* Dynamic point light from the core */}
      <pointLight color="#60A5FA" intensity={2} distance={10} />
    </group>
  );
}
