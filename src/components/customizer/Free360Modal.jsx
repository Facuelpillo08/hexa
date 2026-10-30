import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { X, RotateCcw, Play, Pause, Volume2, ShoppingBag } from 'lucide-react';
import ProceduralKeyboard3D from '../three/ProceduralKeyboard3D';
import { useCustomizer } from '../../context/CustomizerContext';
import { HexaLogoSymbol } from '../common/HexaLogo';

// Elliptical Studio Ground Shadow for 360 Inspection (512x512 optimized with dynamic underside culling)
function InspectionShadow() {
  const meshRef = useRef();
  const materialRef = useRef();

  const occlusionTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.save();
    ctx.translate(256, 256);
    ctx.scale(1.0, 0.44);

    const grad = ctx.createRadialGradient(0, 0, 5, 0, 0, 240);
    grad.addColorStop(0, 'rgba(10, 12, 18, 0.65)');
    grad.addColorStop(0.3, 'rgba(16, 20, 30, 0.40)');
    grad.addColorStop(0.65, 'rgba(24, 30, 44, 0.12)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 240, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  React.useEffect(() => {
    return () => {
      occlusionTexture.dispose();
    };
  }, [occlusionTexture]);

  // Dynamically fade out shadow when camera orbits underneath so it never occludes bottom plate/weight
  useFrame(({ camera }) => {
    if (!materialRef.current) return;
    const t = THREE.MathUtils.clamp((camera.position.y - (-0.3)) / 1.5, 0, 1);
    materialRef.current.opacity = t * 0.75;
    materialRef.current.visible = t > 0.005;
  });

  return (
    <mesh ref={meshRef} position={[0, -0.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[11.5, 6.2]} />
      <meshBasicMaterial
        ref={materialRef}
        map={occlusionTexture}
        transparent
        opacity={0.75}
        side={THREE.FrontSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function Free360Modal() {
  const {
    isFreeViewOpen,
    setIsFreeViewOpen,
    currentBase,
    currentKeycaps,
    currentSwitch,
    currentKnob,
    totalPrice,
    setCartCount,
    setIsOrderModalOpen,
    triggerSound,
  } = useCustomizer();

  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [lightPreset, setLightPreset] = useState('studio'); // 'studio' | 'dramatic' | 'highkey'
  const orbitControlsRef = useRef();

  // Close on ESC key
  useEffect(() => {
    if (!isFreeViewOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsFreeViewOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFreeViewOpen, setIsFreeViewOpen]);

  if (!isFreeViewOpen) return null;

  const handleResetCamera = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset();
    }
  };

  const handleAddToCart = () => {
    setCartCount((c) => c + 1);
    setIsFreeViewOpen(false);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#EDEAE4] overflow-hidden select-none animate-fade-in">
      {/* Background Subtle Grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Top Header Bar HUD */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-[#C7CBD1] bg-[#EDEAE4]/80 backdrop-blur-md font-mono">
        {/* Left: Brand & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-1 bg-white border border-[#C7CBD1] shadow-xs text-xs">
            <HexaLogoSymbol mode="light" className="w-3.5 h-3.5 shrink-0" accentColor="#1E40AF" />
            <span className="font-bold text-[#111215]">HEXA // KX-75</span>
            <span className="text-[#8C939E]">//</span>
            <span className="text-[#525860] font-semibold">VISTA LIBRE 360° ENSAMBLADO</span>
          </div>
        </div>

        {/* Center: Live Specs Pills */}
        <div className="hidden lg:flex items-center gap-2 text-[11px]">
          <span className="px-2.5 py-1 bg-white/70 border border-[#C7CBD1] text-[#111215]">
            CHASIS: <b className="text-[#1E40AF]">{currentBase.name}</b>
          </span>
          <span className="px-2.5 py-1 bg-white/70 border border-[#C7CBD1] text-[#111215]">
            TECLAS: <b className="text-[#1E40AF]">{currentKeycaps.name}</b>
          </span>
          <span className="px-2.5 py-1 bg-white/70 border border-[#C7CBD1] text-[#111215]">
            SWITCH: <b className="text-[#1E40AF]">{currentSwitch.name}</b>
          </span>
          <span className="px-2.5 py-1 bg-white/70 border border-[#C7CBD1] text-[#111215]">
            PERILLA: <b className="text-[#1E40AF]">{currentKnob.name}</b>
          </span>
        </div>

        {/* Right: Controls & Close */}
        <div className="flex items-center gap-2">
          {/* Auto-Rotate Toggle */}
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white hover:bg-[#111215] hover:text-white border border-[#C7CBD1] transition-all cursor-pointer shadow-xs"
            title="Alternar rotación automática"
          >
            {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              AUTO-ROTACIÓN: {isAutoRotate ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white hover:bg-[#111215] hover:text-white border border-[#C7CBD1] transition-all cursor-pointer shadow-xs"
            title="Centrar vista"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CENTRAR</span>
          </button>

          {/* Close Modal */}
          <button
            onClick={() => setIsFreeViewOpen(false)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-[#111215] hover:bg-[#1E40AF] text-white transition-all cursor-pointer shadow-sm group"
          >
            <span>CERRAR</span>
            <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>
      </header>

      {/* Main 3D Canvas Stage */}
      <div className="relative flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing">
        <Suspense fallback={null}>
          <Canvas
            camera={{
              position: [0, 5.5, 7.8],
              fov: 34,
            }}
            gl={{
              antialias: true,
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.18,
              powerPreference: 'high-performance',
            }}
            dpr={[1, 1.25]}
          >
            {/* Ambient Lighting */}
            <ambientLight intensity={1.3} color="#FFFFFF" />

            {/* Key Lighting Rig */}
            <directionalLight
              position={[6, 12, 8]}
              intensity={3.2}
              color="#FFFFFF"
            />
            <directionalLight
              position={[-6, 10, -6]}
              intensity={2.8}
              color="#FFFFFF"
            />
            <directionalLight
              position={[-8, 6, 4]}
              intensity={1.4}
              color="#EEF2FF"
            />
            <directionalLight
              position={[0, -2, 4]}
              intensity={0.9}
              color="#FFFBF0"
            />
            <pointLight position={[0, 4, 1]} intensity={0.9} color="#FFFFFF" />

            {/* Soft Elliptical Ground Shadow */}
            <InspectionShadow />

            {/* Assembled 3D Keyboard Model */}
            <ProceduralKeyboard3D assembledMode={true} />

            {/* Free 360° Orbit Controls */}
            <OrbitControls
              ref={orbitControlsRef}
              enableDamping={true}
              dampingFactor={0.06}
              autoRotate={isAutoRotate}
              autoRotateSpeed={1.0}
              enableZoom={true}
              enablePan={true}
              minDistance={3.2}
              maxDistance={14}
            />
          </Canvas>
        </Suspense>

        {/* Floating Hint Overlay */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <div className="glass-panel px-4 py-2 border border-[#C7CBD1] font-mono text-[10px] text-[#525860] flex items-center gap-2 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E40AF] animate-pulse" />
            <span className="font-semibold text-[#111215]">INTERACCIÓN 360°:</span>
            <span>ARRASTRÁ PARA ROTAR EN CUALQUIER ÁNGULO · SCROLL PARA ZOOM · PROBÁ ESCRIBIR O CLIQUEAR TECLAS</span>
          </div>
        </div>
      </div>

      {/* Bottom Floating Footer HUD */}
      <footer className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 border-t border-[#C7CBD1] bg-[#EDEAE4]/90 backdrop-blur-md font-mono">
        {/* Left: Quick Sound Test & Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={triggerSound}
            className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-[#111215] hover:text-white border border-[#111215] text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#1E40AF]" />
            <span>PROBAR SWITCH ({currentSwitch.name})</span>
          </button>
          <span className="text-[10px] text-[#525860] hidden md:inline">
            RESPUESTA ACÚSTICA PROCEDURAL ACTIVA // {currentSwitch.force}
          </span>
        </div>

        {/* Right: Price & Order Action */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[9px] text-[#8C939E] block">PRECIO TOTAL:</span>
            <span className="text-lg font-black text-[#111215] leading-none">
              ${totalPrice.toFixed(2)} USD
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer group"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>AÑADIR AL CARRITO</span>
            <span className="group-hover:translate-x-1 transition-transform">↗</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

