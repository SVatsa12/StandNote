// Scene3D.jsx - Main 3D scene component
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import FloatingDocuments from './FloatingDocuments';
import WaveformVisualization from './WaveformVisualization';

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#818CF8" />
      <pointLight position={[10, 5, 5]} intensity={0.5} color="#F59E0B" />
    </>
  );
}

function Scene3DContent() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
        autoRotate
        autoRotateSpeed={0.5}
      />
      
      <Lights />
      
      {/* Main 3D Objects */}
      <FloatingDocuments />
      <WaveformVisualization />
      
      {/* Ground Shadows */}
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        scale={15}
        blur={2}
        far={4}
      />
      
      {/* Environment */}
      <Environment preset="city" />
    </>
  );
}

export default function Scene3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene3DContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
