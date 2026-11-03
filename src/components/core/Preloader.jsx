import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCustomizer } from '../../context/CustomizerContext';

export default function Preloader() {
  const { isSceneReady, setIsPreloaderActive } = useCustomizer();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  const containerRef = useRef(null);
  const lettersRef = useRef([]);
  const subBlockRef = useRef(null);
  const hasFinishedRef = useRef(false);

  const LETTERS = ['H', 'E', 'X', 'A'];

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

      if (rawProgress < 1) {
        animFrameId = requestAnimationFrame(step);
      }
    };

    animFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameId);
  }, []);

  // Entrance animation: Staggered Mask Reveal
  useEffect(() => {
    if (!lettersRef.current.length || !subBlockRef.current) return;

    // Reset initial states
    gsap.set(lettersRef.current, { y: '120%', opacity: 0 });
    gsap.set(subBlockRef.current, { opacity: 0, y: 25 });

    const ctx = gsap.context(() => {
      // Staggered letters emergence
      gsap.to(lettersRef.current, {
        y: '0%',
        opacity: 1,
        duration: 1.05,
        stagger: 0.08,
        ease: 'power4.out',
        delay: 0.05,
      });

      // Sub-block reveal
      gsap.to(subBlockRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        delay: 0.35,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  // Exit trigger when progress reaches 100% and Three.js confirms scene is ready
  useEffect(() => {
    if (progress < 100 || hasFinishedRef.current) return;

    // Safety timeout: if Three.js takes longer than 1.5s after 100%, trigger anyway
    let safetyTimer = setTimeout(() => {
      triggerExit();
    }, 1500);

    if (isSceneReady) {
      clearTimeout(safetyTimer);
      triggerExit();
    }

    return () => clearTimeout(safetyTimer);
  }, [progress, isSceneReady]);

  const triggerExit = () => {
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

      // 1. Letters disappear upward through their invisible mask
      tl.to(
        lettersRef.current,
        {
          y: '-125%',
          duration: 0.55,
          stagger: 0.04,
          ease: 'power3.in',
        },
        0
      );

      // 2. Sub-block fades and lifts
      tl.to(
        subBlockRef.current,
        {
          opacity: 0,
          y: -30,
          duration: 0.4,
          ease: 'power2.in',
        },
        0.08
      );

      // 3. Main container curtain wipe up
      tl.to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 0.95,
          ease: 'expo.inOut',
        },
        0.22
      );
    }, 140);
  };

  if (!visible) return null;

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
      <div className="flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto w-full">
        {/* Colossal "HEXA" Typography with Individual Masked Characters */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
          {LETTERS.map((char, idx) => (
            <div
              key={idx}
              className="overflow-hidden inline-flex items-center justify-center"
            >
              <span
                ref={(el) => (lettersRef.current[idx] = el)}
                className="inline-block font-display font-black text-[22vw] sm:text-[18vw] md:text-[15vw] leading-none text-[#F3F4F6] tracking-tight will-change-transform"
                style={{ textShadow: '0 10px 40px rgba(0,0,0,0.8)' }}
              >
                {char}
              </span>
            </div>
          ))}
        </div>

        {/* Sub-Hero Centered Block: Progress Bar & Large Monospace Counter */}
        <div
          ref={subBlockRef}
          className="flex flex-col items-center justify-center will-change-[transform,opacity]"
        >
          {/* Sobriety 240px Progress Bar */}
          <div className="w-56 sm:w-64 md:w-72 h-[2.5px] bg-white/10 rounded-full overflow-hidden mb-4 relative">
            <div
              className="h-full bg-gradient-to-r from-[#1E40AF] via-[#3B82F6] to-[#38BDF8] transition-all duration-75 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Large Monospace Digital Percentage */}
          <div className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest text-[#F3F4F6] mb-3">
            [ {String(progress).padStart(3, '0')}% ]
          </div>

          {/* Technical Status Caption */}
          <div className="font-mono text-[9px] sm:text-[11px] uppercase tracking-widest text-[#94A3B8] flex items-center gap-2">
            {progress < 100 ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
                <span>CALIBRANDO SISTEMA 3D // KX-75</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                <span className="text-[#38BDF8] font-bold">
                  SISTEMA LISTO // DESPLEGANDO HERO
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
