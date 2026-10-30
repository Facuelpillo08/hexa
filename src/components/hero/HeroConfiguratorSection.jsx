import React, { useState, useEffect, useRef } from 'react';
import { Layers, RotateCw, Activity, Cpu, ShieldCheck, Volume2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import KeyboardCanvas from '../three/KeyboardCanvas';
import {
  useCustomizer,
  BASE_OPTIONS,
  SWITCH_OPTIONS,
  KNOB_OPTIONS,
  KEYCAP_OPTIONS,
} from '../../context/CustomizerContext';

export default function HeroConfiguratorSection() {
  const containerRef = useRef(null);
  const heroContentRef = useRef(null);
  const monumentRef = useRef(null);
  const kxRef = useRef(null);
  const n75Ref = useRef(null);
  const configOverlayRef = useRef(null);
  const priceDisplayRef = useRef(null);
  const lastNavHidden = useRef(false);

  const {
    baseKey,
    setBaseKey,
    currentBase,
    keycapKey,
    setKeycapKey,
    currentKeycaps,
    switchKey,
    setSwitchKey,
    currentSwitch,
    knobKey,
    setKnobKey,
    currentKnob,
    explodedView,
    explodedOverride,
    setExplodedOverride,
    toggleExplodedView,
    totalPrice,
    triggerSound,
    setCartCount,
    setIsOrderModalOpen,
    setScrollProgress,
    setIsNavHidden,
    activeHotspot,
    setActiveHotspot,
    isFreeViewOpen,
    setIsFreeViewOpen,
  } = useCustomizer();

  const [displayPrice, setDisplayPrice] = useState(totalPrice);

  // Setup GSAP ScrollTrigger on container with direct DOM transforms (Zero-render scrolling)
  useEffect(() => {
    if (!containerRef.current) return;

    const applyScrollStyles = (progress) => {
      setScrollProgress(progress);

      // Nav visibility toggle (only updates React state when boolean actually changes)
      const shouldHideNav = progress > 0.05 && progress < 0.60;
      if (shouldHideNav !== lastNavHidden.current) {
        lastNavHidden.current = shouldHideNav;
        setIsNavHidden(shouldHideNav);
      }

      // Auto-reset manual exploded override when scrolling back towards hero
      if (progress < 0.50 && explodedOverride !== null) {
        setExplodedOverride(null);
      }

      // Hero fades out gently between 0.02 and 0.12
      const heroRaw = Math.max(0, 1 - Math.max(0, (progress - 0.02) / 0.10));
      const heroOpacity = heroRaw * heroRaw * (3 - 2 * heroRaw);
      const heroVisible = progress < 0.14;

      if (heroContentRef.current) {
        heroContentRef.current.style.opacity = heroOpacity;
        heroContentRef.current.style.pointerEvents = heroVisible ? 'auto' : 'none';
        heroContentRef.current.style.transform = `translate3d(0, ${progress * 80}px, 0)`;
      }

      if (monumentRef.current) {
        monumentRef.current.style.opacity = heroOpacity;
      }
      if (kxRef.current) {
        kxRef.current.style.transform = `translate3d(-${progress * 360}px, 0, 0)`;
      }
      if (n75Ref.current) {
        n75Ref.current.style.transform = `translate3d(${progress * 360}px, 0, 0)`;
      }

      // Configurator glides in synchronously between 0.56 and 0.74
      const configRaw = Math.min(1, Math.max(0, (progress - 0.56) / 0.18));
      const configOpacity = configRaw * configRaw * (3 - 2 * configRaw);
      const configVisible = progress > 0.54;
      const configTranslateY = (1 - configOpacity) * 20;

      if (configOverlayRef.current) {
        configOverlayRef.current.style.opacity = configOpacity;
        configOverlayRef.current.style.pointerEvents = configVisible ? 'auto' : 'none';
        configOverlayRef.current.style.transform = `translate3d(0, ${configTranslateY}px, 0)`;
      }
    };

    let ticking = false;
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            applyScrollStyles(self.progress);
            ticking = false;
          });
          ticking = true;
        }
      },
    });

    applyScrollStyles(st.progress);

    return () => {
      st.kill();
    };
  }, [setScrollProgress, setIsNavHidden, explodedOverride, setExplodedOverride]);

  // GSAP animated price counter with race condition prevention
  useEffect(() => {
    const obj = { val: displayPrice };
    const tween = gsap.to(obj, {
      val: totalPrice,
      duration: 0.4,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayPrice(obj.val);
        if (priceDisplayRef.current) {
          priceDisplayRef.current.innerText = `$${obj.val.toFixed(2)} USD`;
        }
      },
    });
    return () => {
      tween.kill();
    };
  }, [totalPrice]);

  const handleAddToCart = () => {
    setCartCount((c) => c + 1);
    setIsOrderModalOpen(true);
  };

  return (
    <section
      id="configurador"
      ref={containerRef}
      className="relative bg-[#EDEAE4] min-h-[360vh]"
    >
      {/* Sticky 100vh Viewport Stage */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden">
        {/* Subtle Architectural Square Grid */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.045) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.045) 1px, transparent 1px)
            `,
            backgroundSize: '88px 88px',
          }}
        />

        {/* Monumental KX 75 Graphic Typography with Lateral Parallax */}
        <div
          ref={monumentRef}
          className="absolute inset-0 flex items-center justify-between px-6 sm:px-12 lg:px-16 pointer-events-none select-none z-0 overflow-hidden will-change-transform"
        >
          <span
            ref={kxRef}
            className="font-display font-black text-[29vw] leading-none text-[#23262B] tracking-tighter uppercase will-change-transform"
          >
            KX
          </span>
          <span
            ref={n75Ref}
            className="font-display font-black text-[29vw] leading-none text-[#23262B] tracking-tighter uppercase will-change-transform"
          >
            75
          </span>
        </div>

        {/* =========================================================================
            BACKGROUND 3D CANVAS STAGE (Full-Screen, Centered, Single GPU Context)
            ========================================================================= */}
        <div className="absolute inset-0 w-full h-full pointer-events-auto z-10">
          <KeyboardCanvas />
        </div>

        {/* =========================================================================
            PHASE 1: HERO OVERLAY (Matched to Reference Layout)
            ========================================================================= */}
        <div
          ref={heroContentRef}
          className="absolute bottom-5 sm:bottom-8 left-0 right-0 z-20 px-4 sm:px-8 max-w-[1780px] mx-auto flex flex-col md:flex-row items-center md:items-end justify-between gap-4 will-change-[transform,opacity]"
        >
          {/* Left Column: Spec & Headline */}
          <div className="text-left w-full md:w-auto">
            <span className="font-mono text-[10px] sm:text-xs text-[#525860] uppercase tracking-wider font-semibold block mb-1">
              CNC 6063 ALUMINUM — GASKET MOUNT
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#111215] tracking-tight uppercase leading-none">
              REDEFINE THE INPUT <span className="text-[#1E40AF]">//</span> KX-75
            </h1>
          </div>
        </div>

        {/* =========================================================================
            PHASE 2: CONFIGURATOR OVERLAY (Awwwards 3D In-Situ Hotspot Experience)
            ========================================================================= */}
        <div
          ref={configOverlayRef}
          style={{ opacity: 0, pointerEvents: 'none', transform: 'translate3d(0, 20px, 0)' }}
          className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-3 sm:p-8 pt-20 sm:pt-24 pb-3 sm:pb-8 will-change-[transform,opacity]"
        >
          {/* Monumental Watermark Numeral for Section 02 (Desktop only) */}
          <div className="hidden sm:block absolute right-8 top-16 font-display font-black text-[120px] sm:text-[220px] lg:text-[280px] text-outline-monumental select-none pointer-events-none leading-none opacity-20">
            02
          </div>

          {/* Top Bar HUD */}
          <div className="max-w-[1720px] mx-auto w-full flex items-center justify-end pointer-events-auto">
            {/* Quick Pills on Mobile Top HUD */}
            <div className="flex sm:hidden items-center gap-1.5 font-mono text-[10px]">
              <button
                onClick={toggleExplodedView}
                className="flex items-center gap-1 glass-panel-elevated px-2.5 py-1 border border-[#C7CBD1] font-bold text-[#111215] cursor-pointer shadow-xs active:bg-[#111215] active:text-white"
              >
                <Layers className="w-3 h-3 text-[#1E40AF]" />
                <span>{explodedView ? 'UNIR' : 'DESPIECE'}</span>
              </button>
              <button
                onClick={() => setIsFreeViewOpen(true)}
                className="flex items-center gap-1 glass-panel-elevated px-2.5 py-1 border border-[#C7CBD1] font-bold text-[#111215] cursor-pointer shadow-xs active:bg-[#1E40AF] active:text-white"
              >
                <RotateCw className="w-3 h-3 text-[#1E40AF]" />
                <span>360°</span>
              </button>
            </div>
          </div>

          {/* Bottom Row HUD: Left Controls + Right Checkout Card */}
          <div className="max-w-[1720px] mx-auto w-full flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-2.5 sm:gap-4 pointer-events-auto">
            {/* Controls & Options Deck */}
            <div className="flex flex-col gap-2 sm:gap-2.5 w-full sm:w-auto max-w-xl">
              {/* Docked Options Drawer (Active when a part is selected) */}
              {activeHotspot && (
                <div className="glass-panel-elevated border border-[#C7CBD1] p-2.5 sm:p-4 shadow-xl font-mono text-[#111215] animate-fade-in w-full">
                  <div className="flex items-center justify-between pb-1.5 sm:pb-2 border-b border-[#C7CBD1] mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#1E40AF]"></span>
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase truncate">
                        {activeHotspot === 'base' && '01 // ACABADO DE CHASIS CNC'}
                        {activeHotspot === 'keycaps' && '02 // SET DE TECLAS PBT'}
                        {activeHotspot === 'switches' && '03 // PERFIL DE SWITCH MECÁNICO'}
                        {activeHotspot === 'knob' && '04 // PERILLA MULTIFUNCIÓN CNC'}
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveHotspot(null)}
                      className="text-[10px] text-[#8C939E] hover:text-[#111215] font-bold px-1.5 py-0.5 border border-transparent hover:border-[#C7CBD1] cursor-pointer"
                      title="Cerrar panel"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Panel Content: Chasis */}
                  {activeHotspot === 'base' && (
                    <div>
                      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-1.5 max-h-36 sm:max-h-56 overflow-y-auto pr-0.5">
                        {Object.values(BASE_OPTIONS).map((b) => {
                          const isSel = baseKey === b.id;
                          return (
                            <button
                              key={b.id}
                              onClick={() => setBaseKey(b.id)}
                              className={`flex flex-col items-center justify-center p-1.5 sm:p-2 border transition-all cursor-pointer ${
                                isSel
                                  ? 'border-[#1E40AF] bg-white ring-2 ring-[#1E40AF]/20 shadow-xs'
                                  : 'border-[#C7CBD1] bg-white/70 hover:bg-white'
                              }`}
                            >
                              <span
                                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mb-1 border border-[#9CA3AF] shrink-0"
                                style={{ backgroundColor: b.colorHex }}
                              />
                              <span className="text-[9px] sm:text-[10px] font-bold block truncate w-full text-center">
                                {b.name}
                              </span>
                              <span className="text-[8px] sm:text-[9px] text-[#525860]">
                                {b.priceDelta > 0 ? `+$${b.priceDelta}` : 'INC'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[8px] sm:text-[9px] text-[#525860] leading-tight truncate">
                        {currentBase.spec}
                      </p>
                    </div>
                  )}

                  {/* Panel Content: Keycaps */}
                  {activeHotspot === 'keycaps' && (
                    <div>
                      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-1.5 max-h-36 sm:max-h-56 overflow-y-auto pr-0.5">
                        {Object.values(KEYCAP_OPTIONS).map((kOpt) => {
                          const isSel = keycapKey === kOpt.id;
                          return (
                            <button
                              key={kOpt.id}
                              onClick={() => setKeycapKey(kOpt.id)}
                              className={`flex flex-col items-center justify-center p-1.5 sm:p-2 border transition-all cursor-pointer ${
                                isSel
                                  ? 'border-[#1E40AF] bg-white ring-2 ring-[#1E40AF]/20 shadow-xs'
                                  : 'border-[#C7CBD1] bg-white/70 hover:bg-white'
                              }`}
                            >
                              <div className="flex -space-x-1 mb-1">
                                <span
                                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-white shadow-xs"
                                  style={{ backgroundColor: kOpt.alphaColor }}
                                />
                                <span
                                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-white shadow-xs"
                                  style={{ backgroundColor: kOpt.accentColor }}
                                />
                              </div>
                              <span className="text-[9px] sm:text-[10px] font-bold block truncate w-full text-center">
                                {kOpt.name}
                              </span>
                              <span className="text-[8px] sm:text-[9px] text-[#525860]">
                                {kOpt.priceDelta > 0 ? `+$${kOpt.priceDelta}` : 'INC'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[8px] sm:text-[9px] text-[#525860] leading-tight truncate">
                        {currentKeycaps.spec}
                      </p>
                    </div>
                  )}

                  {/* Panel Content: Switches */}
                  {activeHotspot === 'switches' && (
                    <div>
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-1.5">
                        {Object.values(SWITCH_OPTIONS).map((sOpt) => {
                          const isSel = switchKey === sOpt.id;
                          return (
                            <button
                              key={sOpt.id}
                              onClick={() => {
                                setSwitchKey(sOpt.id);
                                triggerSound();
                              }}
                              className={`flex flex-col items-start p-1.5 sm:p-2 border transition-all cursor-pointer ${
                                isSel
                                  ? 'bg-[#1E40AF] text-white border-[#1E40AF] shadow-xs'
                                  : 'bg-white border-[#C7CBD1] text-[#111215] hover:bg-[#F8F7F4]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: sOpt.stemColor }}
                                />
                                <span className="text-[9px] sm:text-[10px] font-bold truncate">{sOpt.name}</span>
                              </div>
                              <span className="text-[8px] opacity-80 block truncate w-full">{sOpt.brandLabel}</span>
                              <span className="text-[8px] sm:text-[9px] mt-0.5 font-semibold">
                                {sOpt.priceDelta > 0 ? `+$${sOpt.priceDelta} USD` : 'INCLUIDO'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#C7CBD1]/60">
                        <button
                          onClick={triggerSound}
                          className="bg-white hover:bg-[#111215] hover:text-white border border-[#111215] py-1 px-2.5 text-[9px] sm:text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
                        >
                          <Volume2 className="w-3 h-3 text-[#1E40AF]" />
                          <span>PROBAR ACÚSTICA</span>
                        </button>
                        <span className="text-[8px] sm:text-[9px] text-[#525860] truncate">
                          {currentSwitch.feel} // {currentSwitch.force}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Panel Content: Knob */}
                  {activeHotspot === 'knob' && (
                    <div>
                      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-1.5 max-h-36 sm:max-h-56 overflow-y-auto pr-0.5">
                        {Object.values(KNOB_OPTIONS).map((kOpt) => {
                          const isSel = knobKey === kOpt.id;
                          return (
                            <button
                              key={kOpt.id}
                              onClick={() => setKnobKey(kOpt.id)}
                              className={`flex flex-col items-center justify-center p-1.5 sm:p-2 border transition-all cursor-pointer ${
                                isSel
                                  ? 'border-[#1E40AF] bg-white ring-2 ring-[#1E40AF]/20 shadow-xs'
                                  : 'border-[#C7CBD1] bg-white/70 hover:bg-white'
                              }`}
                            >
                              <span
                                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mb-1 border border-[#9CA3AF] shrink-0"
                                style={{ backgroundColor: kOpt.colorHex }}
                              />
                              <span className="text-[9px] sm:text-[10px] font-bold block truncate w-full text-center">
                                {kOpt.name}
                              </span>
                              <span className="text-[8px] sm:text-[9px] text-[#525860]">
                                {kOpt.priceDelta > 0 ? `+$${kOpt.priceDelta}` : 'INC'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[8px] sm:text-[9px] text-[#525860] leading-tight truncate">
                        ALPS OPTICAL ROTARY ENCODER // RESPUESTA HÁPTICA ESCALONADA
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Part Quick-Select Tabs */}
              <div className="flex items-center gap-1 sm:gap-1.5 glass-panel p-1 sm:p-1.5 border border-[#C7CBD1] font-mono text-[9px] sm:text-[10px] shadow-sm">
                {[
                  { id: 'base', label: '01 // CHASIS' },
                  { id: 'keycaps', label: '02 // TECLAS' },
                  { id: 'switches', label: '03 // SWITCHES' },
                  { id: 'knob', label: '04 // PERILLA' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveHotspot(activeHotspot === tab.id ? null : tab.id)}
                    className={`flex-1 sm:flex-none text-center px-1.5 sm:px-3 py-1 font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeHotspot === tab.id
                        ? 'bg-[#1E40AF] text-white shadow-xs'
                        : 'bg-transparent text-[#111215] hover:bg-white/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Exploded View Toggle, Free 360 Inspection & Physical Keyboard Indicator */}
              <div className="hidden sm:flex flex-wrap items-center gap-2.5">
                <button
                  onClick={toggleExplodedView}
                  className="flex items-center gap-2 glass-panel-elevated px-3.5 py-2 font-mono text-xs font-bold text-[#111215] hover:bg-[#111215] hover:text-white transition-all shadow-tech cursor-pointer group border border-[#C7CBD1]"
                >
                  <Layers className="w-3.5 h-3.5 text-[#1E40AF] group-hover:text-white" />
                  <span>{explodedView ? 'UNIFICAR ENSAMBLE' : 'ALTERNAR DESPIECE 3D'}</span>
                </button>

                <button
                  onClick={() => setIsFreeViewOpen(true)}
                  className="flex items-center gap-2 glass-panel-elevated px-3.5 py-2 font-mono text-xs font-bold text-[#111215] hover:bg-[#1E40AF] hover:text-white transition-all shadow-tech cursor-pointer group border border-[#C7CBD1]"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#1E40AF] group-hover:text-white group-hover:rotate-180 transition-transform duration-500" />
                  <span>VISTA LIBRE 360°</span>
                  <span className="text-[10px] text-[#1E40AF] group-hover:text-white">↗</span>
                </button>

                <div className="hidden xl:flex items-center gap-2 font-mono text-[10px] text-[#525860] glass-panel px-3 py-2 border border-[#C7CBD1]">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                  <span className="font-bold text-[#111215]">TECLADO FÍSICO ACTIVO:</span>
                  <span>PRESIONÁ CUALQUIER TECLA</span>
                </div>
              </div>
            </div>

            {/* Mobile Bottom Action Bar */}
            <div className="sm:hidden glass-panel-elevated border border-[#C7CBD1] p-2 sm:p-2.5 flex items-center justify-between gap-3 shadow-xl font-mono">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-[9px] text-[#525860] uppercase">
                  <span>TOTAL ESTIMADO</span>
                  <span className="text-[#1E40AF] font-bold">// KX-75</span>
                </div>
                <span className="font-display font-black text-lg text-[#111215] tracking-tight leading-none">
                  ${totalPrice.toFixed(2)} USD
                </span>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-[#1E40AF] hover:bg-[#1D4ED8] text-white px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>AÑADIR</span>
                <span className="text-sm">↗</span>
              </button>
            </div>

            {/* Desktop: Floating Checkout Card */}
            <div className="hidden sm:block glass-panel-elevated border border-[#C7CBD1] p-4 sm:p-5 w-full sm:w-80 shadow-2xl font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-[#C7CBD1] mb-3 text-[10px]">
                <span className="text-[#525860] font-bold uppercase">ENSAMBLE SELECCIONADO</span>
                <span className="text-[#1E40AF] font-bold border border-[#1E40AF]/30 px-1.5 py-0.2 bg-white">
                  KX-75
                </span>
              </div>

              {/* Dynamic BOM summary tags */}
              <div className="space-y-1.5 text-[10px] text-[#525860] mb-3">
                <div className="flex justify-between">
                  <span>BASE:</span>
                  <span className="font-bold text-[#111215]">{currentBase.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>TECLAS:</span>
                  <span className="font-bold text-[#111215]">{currentKeycaps.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>SWITCH:</span>
                  <span className="font-bold text-[#111215]">{currentSwitch.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>PERILLA:</span>
                  <span className="font-bold text-[#111215]">{currentKnob.name}</span>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="pt-2 border-t border-[#C7CBD1]">
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <span className="text-[9px] text-[#8C939E] block">TOTAL:</span>
                    <span
                      ref={priceDisplayRef}
                      className="font-black text-2xl text-[#111215] tracking-tight block"
                    >
                      ${totalPrice.toFixed(2)} USD
                    </span>
                  </div>
                  <span className="text-[9px] bg-[#111215] text-white px-2 py-0.5 font-bold uppercase tracking-wider">
                    LISTO PARA ENSAMBLE
                  </span>
                </div>

                {/* Inspect in 360 Action */}
                <button
                  onClick={() => setIsFreeViewOpen(true)}
                  className="w-full mb-2 flex items-center justify-center gap-2 bg-white hover:bg-[#111215] hover:text-white text-[#111215] border border-[#111215] py-2 text-[11px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-xs group"
                >
                  <RotateCw className="w-3 h-3 text-[#1E40AF] group-hover:text-white group-hover:rotate-180 transition-transform duration-500" />
                  <span>INSPECCIONAR EN 360°</span>
                  <span className="text-[9px] text-[#1E40AF] group-hover:text-white">↗</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white py-3 text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-[0_4px_20px_rgba(30,64,175,0.3)] hover:shadow-[0_6px_25px_rgba(30,64,175,0.45)] cursor-pointer group"
                >
                  <span>AÑADIR AL CARRITO</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
