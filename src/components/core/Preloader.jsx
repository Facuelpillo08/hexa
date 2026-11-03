import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCustomizer } from '../../context/CustomizerContext';

export default function Preloader() {
  const { isSceneReady, setIsPreloaderActive } = useCustomizer();
  const [progress, setProgress] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [visible, setVisible] = useState(true);

  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const hasFinishedRef = useRef(false);

  const FULL_TITLE = 'HEXA // KX-75';

  // Smooth cinematic progress counter (0 -> 100% across ~2.1 seconds)
  useEffect(() => {
    let startTime = null;
    let animFrameId = null;
    const DURATION = 2100; // ms

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(elapsed / DURATION, 1);

      // Smooth custom cubic ease-out
      const easedProgress = Math.min(
        100,
        Math.round((1 - Math.pow(1 - rawProgress, 2.8)) * 100)
      );

      setProgress(easedProgress);

      // Typewriter reveal: map progress (0-80%) to characters
      const charIndex = Math.min(
        FULL_TITLE.length,
        Math.floor((rawProgress / 0.8) * FULL_TITLE.length)
      );
      setTypedText(FULL_TITLE.slice(0, Math.max(1, charIndex)));

      if (rawProgress < 1) {
        animFrameId = requestAnimationFrame(step);
      }
    };

    animFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameId);
  }, []);

  // Exit trigger when progress reaches 100% and Three.js confirms scene is ready
  useEffect(() => {
    if (progress < 100 || hasFinishedRef.current) return;

    // Safety timeout: if Three.js takes longer than 1.5s after 100%, trigger anyway
    let safetyTimer = setTimeout(() => {
      triggerCurtainWipe();
    }, 1500);

    if (isSceneReady) {
      clearTimeout(safetyTimer);
      triggerCurtainWipe();
    }

    return () => clearTimeout(safetyTimer);
  }, [progress, isSceneReady]);

  const triggerCurtainWipe = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    // Small hold (140ms) on 100% so the user registers the completed calibration
    setTimeout(() => {
      if (!containerRef.current) {
        setIsPreloaderActive(false);
        setVisible(false);
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          setIsPreloaderActive(false);
          setVisible(false);
        },
      });

      // Parallax upward shutter wipe
      tl.to(innerRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.65,
        ease: 'power3.in',
      }, 0);

      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 0.95,
        ease: 'expo.inOut',
      }, 0.15);
    }, 140);
  };

  if (!visible) return null;

  // SVG stroke-dashoffset (1 -> 0 as progress goes 0% -> 75%)
  const strokeOffset = Math.max(0, 1 - progress / 75);
  // Fill opacity fades in smoothly between 70% and 100%
  const fillAlpha = Math.min(1, Math.max(0, (progress - 70) / 30));

  return (
    <aside
      ref={containerRef}
      role="status"
      aria-label="Cargando experiencia 3D de HEXA"
      className="fixed inset-0 z-[100] bg-[#0C0D0F] text-[#F3F4F6] flex flex-col items-center justify-center select-none overflow-hidden will-change-transform"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px)
        `,
        backgroundSize: '72px 72px',
      }}
    >
      {/* CAD Registration Markers in Corners */}
      <div className="absolute top-6 left-6 font-mono text-[9px] sm:text-[10px] text-[#64748B] tracking-wider uppercase pointer-events-none">
        <span className="text-[#3B82F6] font-bold">+</span> 46.2044° N // GENEVA LABS
      </div>
      <div className="absolute top-6 right-6 font-mono text-[9px] sm:text-[10px] text-[#64748B] tracking-wider uppercase pointer-events-none">
        SYS.INIT // <span className="text-[#F3F4F6] font-semibold">KX-75</span>
      </div>
      <div className="absolute bottom-6 left-6 font-mono text-[9px] sm:text-[10px] text-[#64748B] tracking-wider uppercase pointer-events-none">
        CNC 6063 // GASKET ARCHITECTURE
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-[9px] sm:text-[10px] text-[#64748B] tracking-wider uppercase pointer-events-none">
        {progress < 100 ? (
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-ping" />
            CALIBRANDO
          </span>
        ) : (
          <span className="text-[#38BDF8] font-bold">READY // DESPLEGANDO</span>
        )}
      </div>

      {/* Main Architectural Stage */}
      <div
        ref={innerRef}
        className="flex flex-col items-center justify-center text-center px-4 max-w-sm mx-auto will-change-[transform,opacity]"
      >
        {/* Animated Wireframe SVG Monogram */}
        <div className="relative mb-6">
          <svg
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_0_25px_rgba(59,130,246,0.18)]"
          >
            {/* Left Pillar */}
            <path
              d="M 52 82 L 104 52 L 104 204 L 52 174 Z"
              stroke="#F3F4F6"
              strokeWidth="2.5"
              strokeLinejoin="round"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={strokeOffset}
              fill="#F3F4F6"
              fillOpacity={fillAlpha}
              style={{ transition: 'fill-opacity 0.25s ease-out' }}
            />

            {/* Right Pillar */}
            <path
              d="M 152 52 L 204 82 L 204 174 L 152 204 Z"
              stroke="#F3F4F6"
              strokeWidth="2.5"
              strokeLinejoin="round"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={strokeOffset}
              fill="#F3F4F6"
              fillOpacity={fillAlpha}
              style={{ transition: 'fill-opacity 0.25s ease-out' }}
            />

            {/* Mechanical Switch Stem Core (+) in Electric Cobalt */}
            <path
              d="M 120 104 H 136 V 120 H 152 V 136 H 136 V 152 H 120 V 136 H 104 V 120 H 120 Z"
              stroke="#3B82F6"
              strokeWidth="2.5"
              strokeLinejoin="round"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={strokeOffset}
              fill="#1E40AF"
              fillOpacity={fillAlpha}
              style={{ transition: 'fill-opacity 0.25s ease-out' }}
            />
          </svg>
        </div>

        {/* Brand Lockup with Typewriter Effect */}
        <div className="flex items-center justify-center font-display font-black text-xl sm:text-2xl tracking-widest uppercase text-[#F3F4F6] mb-2 min-h-[32px]">
          <span>{typedText}</span>
          <span className="text-[#3B82F6] font-mono text-lg ml-0.5 animate-pulse">▌</span>
        </div>

        <p className="font-mono text-[9px] sm:text-[10px] text-[#94A3B8] tracking-widest uppercase mb-7">
          MODULAR KEYBOARD SYSTEM
        </p>

        {/* 1px Precision Calibration Bar */}
        <div className="w-48 sm:w-56 h-[1.5px] bg-white/10 overflow-hidden relative mb-4 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-[#1E40AF] via-[#3B82F6] to-[#38BDF8] transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Monospace Digital Percentage */}
        <div className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-[#94A3B8]">
          [ {String(progress).padStart(3, '0')}% ]
        </div>
      </div>
    </aside>
  );
}
