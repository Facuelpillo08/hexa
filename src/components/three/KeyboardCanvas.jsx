import React, { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ProceduralKeyboard3D from './ProceduralKeyboard3D';
import { useCustomizer } from '../../context/CustomizerContext';

function smoothInterval(val, min, max) {
  if (val <= min) return 0;
  if (val >= max) return 1;
  const t = (val - min) / (max - min);
  return t * t * (3 - 2 * t);
}

// Studio Ground Shadow with photographic elliptical falloff and zero geometric clipping
function StudioGroundShadow() {
  const { scrollProgressRef } = useCustomizer();
  const { size } = useThree();
  const isMobile = size.width < 768;
  const isSmallMobile = size.width < 440;
  const shadowGroup = useRef();
  const occlusionMatRef = useRef();
  const diffuseMatRef = useRef();

  // Mathematically true elliptical shadow texture without clipping artifacts (512x512 optimized)
  const occlusionTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.save();
    ctx.translate(256, 256);
    ctx.scale(1.0, 0.42);

    const grad = ctx.createRadialGradient(0, 0, 5, 0, 0, 240);
    grad.addColorStop(0, 'rgba(10, 12, 18, 0.75)');
    grad.addColorStop(0.28, 'rgba(16, 20, 30, 0.52)');
    grad.addColorStop(0.58, 'rgba(24, 30, 44, 0.22)');
    grad.addColorStop(0.82, 'rgba(32, 38, 52, 0.05)');
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

  const diffuseTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.save();
    ctx.translate(256, 256);
    ctx.scale(1.0, 0.50);

    const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, 240);
    grad.addColorStop(0, 'rgba(12, 15, 22, 0.45)');
    grad.addColorStop(0.35, 'rgba(18, 22, 32, 0.28)');
    grad.addColorStop(0.68, 'rgba(26, 32, 46, 0.10)');
    grad.addColorStop(0.88, 'rgba(34, 40, 54, 0.03)');
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
      diffuseTexture.dispose();
    };
  }, [occlusionTexture, diffuseTexture]);

  useFrame((_, delta) => {
    if (!shadowGroup.current) return;
    const progress = scrollProgressRef?.current ?? 0;
    const scrollMap = THREE.MathUtils.clamp((progress - 0.02) / 0.90, 0, 1);
    const pOrbit = smoothInterval(scrollMap, 0.04, 0.76);
    const pPan = smoothInterval(scrollMap, 0.65, 0.96);

    // Dynamic ground shadow Y tracking:
    // On mobile:
    //   Hero (progress < 0.05): keyboard at y=0.20 -> shadow rests at y=-0.75
    //   Mid-orbit disassembly: chassis drops and tilts down -> shadow drops dynamically to y=-1.35 to stay safely under the floating chassis
    //   Docked configurator: keyboard elevates to y=1.05 with base at y=+0.12 -> shadow rests on floor at y=-0.45
    const midOrbitDip = Math.sin(pOrbit * Math.PI) * (isMobile ? 0.60 : 0.45);
    const targetYMobile = THREE.MathUtils.lerp(-0.75, -0.45, pPan) - midOrbitDip;
    const targetYDesktop = THREE.MathUtils.lerp(-1.48, -2.40, pPan) - midOrbitDip;
    const targetY = isMobile ? targetYMobile : targetYDesktop;

    const targetX = isMobile
      ? (isSmallMobile ? THREE.MathUtils.lerp(-0.06, 0.0, pPan) : 0.0)
      : THREE.MathUtils.lerp(-0.15, -0.65, pPan);

    const targetScale = isMobile
      ? (isSmallMobile ? THREE.MathUtils.lerp(0.32, 0.38, pPan) : THREE.MathUtils.lerp(0.36, 0.42, pPan))
      : THREE.MathUtils.lerp(0.82, 0.88, pPan);

    shadowGroup.current.position.x = THREE.MathUtils.damp(
      shadowGroup.current.position.x,
      targetX,
      9.0,
      delta
    );
    shadowGroup.current.position.y = THREE.MathUtils.damp(
      shadowGroup.current.position.y,
      targetY,
      9.0,
      delta
    );
    shadowGroup.current.scale.set(targetScale, targetScale, targetScale);

    // Rotate shadow footprint to follow keyboard 360 rotation
    const targetRotZ = -0.46 + pOrbit * Math.PI * 2;
    shadowGroup.current.rotation.z = THREE.MathUtils.damp(
      shadowGroup.current.rotation.z,
      targetRotZ,
      9.0,
      delta
    );

    // Soften shadow when keyboard is floating high in zero gravity mid-orbit
    const floatSoftness = 1 - Math.sin(pOrbit * Math.PI) * 0.40;
    if (occlusionMatRef.current) {
      occlusionMatRef.current.opacity = 0.92 * floatSoftness;
    }
    if (diffuseMatRef.current) {
      diffuseMatRef.current.opacity = 0.72 * floatSoftness;
    }
  });

  return (
    <group
      ref={shadowGroup}
      position={isMobile ? [0, -0.75, 0.0] : [-0.15, -1.48, 0.0]}
      rotation={[-Math.PI / 2, 0, -0.46]}
      renderOrder={-1}
    >
      {/* Occlusion Core Shadow: razor sharp grounding directly under the angled keyboard footprint */}
      <mesh position={[0, 0, 0.01]} renderOrder={-1}>
        <planeGeometry args={[10.5, 5.2]} />
        <meshBasicMaterial
          ref={occlusionMatRef}
          map={occlusionTexture}
          transparent
          opacity={0.92}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>

      {/* Broad Diffuse Studio Shadow: soft photographic falloff spreading across the light pool */}
      <mesh position={[0, 0, 0]} renderOrder={-1}>
        <planeGeometry args={[15.0, 7.8]} />
        <meshBasicMaterial
          ref={diffuseMatRef}
          map={diffuseTexture}
          transparent
          opacity={0.72}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function CanvasLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#EAE8E3]/60 backdrop-blur-xs z-20">
      <div className="flex items-center gap-3 font-mono text-xs text-[#5A6065] border border-[#C7CBD1] px-3.5 py-2 bg-[#F4F3EF] shadow-tech">
        <div className="w-2.5 h-2.5 rounded-full bg-[#1E40AF] animate-ping" />
        <span className="font-semibold text-[#121316]">CALIBRANDO MODELO 3D // KX-75 HD</span>
      </div>
    </div>
  );
}

export default function KeyboardCanvas({
  cameraPosition = [0, 7.8, 9.6],
  fov = 32,
  showHeroLabels = false,
  showConfigLabels = false,
  allowOrbit = false,
  className = 'w-full h-full',
}) {
  const { isFreeViewOpen } = useCustomizer();
  const wrapperRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!wrapperRef.current) return;
    let timer = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          if (timer) clearTimeout(timer);
          setIsVisible(true);
        } else {
          // Put the canvas to sleep only during browser idle periods after scrolling has completely stopped
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            if ('requestIdleCallback' in window) {
              window.requestIdleCallback(() => setIsVisible(false), { timeout: 2000 });
            } else {
              setIsVisible(false);
            }
          }, 800);
        }
      },
      { threshold: 0, rootMargin: '300px' }
    );
    observer.observe(wrapperRef.current);
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${className} select-none overflow-hidden`}>
      <Suspense fallback={<CanvasLoader />}>
        <Canvas
          frameloop={isFreeViewOpen || !isVisible ? 'never' : 'always'}
          camera={{
            position: cameraPosition,
            fov: fov,
          }}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 1.25]}
        >
          {/* Precision Studio Key, Rim & Ambient Lighting Rig */}
          <ambientLight intensity={1.25} color="#FFFFFF" />

          {/* Main Key Light: Sculpted top-front-right illumination */}
          <directionalLight
            position={[6.5, 14, 8.5]}
            intensity={3.0}
            color="#FFFFFF"
          />

          {/* Intense Rear Rim Light: Emphasizes CNC chamfers & keycap profiles */}
          <directionalLight
            position={[0, 11, -7.5]}
            intensity={3.6}
            color="#FFFFFF"
          />

          {/* Cool Fill Light: Soft left-side illumination */}
          <directionalLight
            position={[-8, 8, 4]}
            intensity={1.5}
            color="#EEF2FF"
          />

          {/* Floor Bounce Light: Simulates warm light returning from the light floor pedestal */}
          <directionalLight
            position={[0, -2, 4]}
            intensity={0.85}
            color="#FFFBF0"
          />

          {/* Top Center Spotlight on keycaps matrix */}
          <pointLight position={[0, 3.5, 0.5]} intensity={0.8} color="#FFFFFF" />

          {/* Photographic Dual-Tier Studio Ground Shadow */}
          <StudioGroundShadow />

          {/* Procedural 3D Model with Printed Keycaps and High-Fidelity PBR Materials */}
          <ProceduralKeyboard3D
            showHeroLabels={showHeroLabels}
            showConfigLabels={showConfigLabels}
          />

          {/* Damped Interactive OrbitControls with Smooth Bounds - Zoom disabled to allow smooth page scroll */}
          {allowOrbit && (
            <OrbitControls
              enableDamping
              dampingFactor={0.06}
              enableZoom={false}
              enablePan={false}
              minDistance={3.8}
              maxDistance={11}
              maxPolarAngle={Math.PI / 2 - 0.05}
              minPolarAngle={0.15}
            />
          )}
        </Canvas>
      </Suspense>
    </div>
  );
}
