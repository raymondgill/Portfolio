"use client";
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

// --- MOVE RANDOM DATA OUTSIDE THE COMPONENT ---
// This ensures the positions are generated only once when the file loads,
// keeping the component "pure" and idempotent.
const PARTICLE_COUNT = 1500;
const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particlePositions[i * 3] = (Math.random() - 0.5) * 15;     // X
  particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 15; // Y
  particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z
}

const navLinks = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#work" },
  { label: "Contact", href: "#contact" },
];

function Scene() {
  const pointsRef = useRef();
  const groupRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const { x, y } = state.mouse;

    // Gentle constant rotation
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.03;
    }

    // Smooth mouse parallax
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        (x * Math.PI) / 10,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        (-y * Math.PI) / 10,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Pass the pre-generated static array here */}
      <Points ref={pointsRef} positions={particlePositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#22d3ee"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        {/* <mesh position={[2, 1, -2]} rotation={[0.5, 0.5, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#22d3ee" wireframe />
        </mesh> */}
      </Float>
    </group>
  );
}

export default function HeroSection() {
  return (
    <div className="relative w-full h-screen bg-[#050505] text-white overflow-hidden selection:bg-cyan-500/30">
      
      {/* 3D Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          {/* <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} /> */}
          <Scene />
        </Canvas>
      </div>

      {/* UI Overlay - Using pointer-events to ensure mouse reaches Canvas */}
      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col">
        
        <nav className="flex justify-between items-center px-10 py-8 pointer-events-auto">
          <div className="flex space-x-10 text-[11px] uppercase tracking-[0.2em] text-gray-500 font-medium">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-white transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase">System Online</span>
          </div>
        </nav>

        <main className="h-full flex flex-col justify-center px-10 -mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="pointer-events-auto"
            >
              <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter">
                We&apos;re Building<br />
                <span className="font-light italic text-gray-300">Cool Experiences</span>
              </h1>
              
              <div className="flex space-x-5 mt-10 text-[10px] font-bold tracking-[0.4em] text-gray-600">
                <span>AI \</span>
                <span>WEB3 \</span>
                <span>UI \</span>
                <span>3D \</span>
                <span>MOTION</span>
              </div>
            </motion.div>

            <div className="flex flex-col lg:items-end space-y-10 pointer-events-auto">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="max-w-xs lg:text-right text-gray-400 text-sm leading-relaxed tracking-wide"
              >
                Crafting Awesome Stories and Killer Designs to Make Brands Stand Out in the Digital Age.
              </motion.p>
              
              <div className="flex items-center space-x-8">
                <a href="#contact" className="text-xs font-bold tracking-widest border-b border-white/20 pb-1 hover:border-white transition-all">
                  CONTACT US
                </a>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center bg-white text-black pl-8 pr-2 py-2 rounded-full cursor-pointer group"
                >
                  <span className="text-xs font-black tracking-tighter mr-6">GET STARTED</span>
                  <div className="bg-blue-600 p-3 rounded-full text-white transition-transform duration-300 group-hover:rotate-90">
                    <Plus size={18} />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>

        <div className="py-10 w-full text-center">
          <span className="text-[9px] uppercase tracking-[0.5em] text-gray-700 animate-pulse">
            Move mouse to interact with background
          </span>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />
    </div>
  );
}