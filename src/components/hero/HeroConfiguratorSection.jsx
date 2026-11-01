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

      // Nav visibility toggle (Zero-render direct DOM transform: no React context re-renders during scroll)
      const shouldHideNav = progress > 0.05 && progress < 0.65;
      const navEl = document.getElementById('main-navbar');
      if (navEl) {
        if (shouldHideNav) {
          navEl.style.transform = 'translate3d(-50%, -100px, 0)';
          navEl.style.opacity = '0';
          navEl.style.pointerEvents = 'none';
        } else {
          navEl.style.transform = 'translate3d(-50%, 0, 0)';
          navEl.style.opacity = '1';
          navEl.style.pointerEvents = 'auto';
        }
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

      // Configurator glides in synchronously between 0.52 and 0.82
      const configRaw = Math.min(1, Math.max(0, (progress - 0.52) / 0.30));
      const configOpacity = configRaw * configRaw * (3 - 2 * configRaw);
      const configVisible = progress > 0.48;
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
      className="relative bg-[#EDEAE4] min-h-[175vh]"
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

          {/* Top Bar HUD: Floating Utility Pills */}
          <div className="max-w-[1720px] mx-auto w-full flex items-center justify-end pointer-events-auto">
            <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs">
              <button
                onClick={toggleExplodedView}
                className="flex items-center gap-1.5 glass-panel-elevated px-3 py-1.5 sm:px-3.5 sm:py-2 border border-[#C7CBD1] font-bold text-[#111215] hover:bg-[#111215] hover:text-white transition-all shadow-tech cursor-pointer group"
              >
                <Layers className="w-3.5 h-3.5 text-[#1E40AF] group-hover:text-white transition-colors" />
                <span>{explodedView ? 'UNIFICAR' : 'DESPIECE 3D'}</span>
              </button>

              <button
                onClick={() => setIsFreeViewOpen(true)}
                className="flex items-center gap-1.5 glass-panel-elevated px-3 py-1.5 sm:px-3.5 sm:py-2 border border-[#C7CBD1] font-bold text-[#111215] hover:bg-[#1E40AF] hover:text-white transition-all shadow-tech cursor-pointer group"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#1E40AF] group-hover:text-white group-hover:rotate-180 transition-transform duration-500" />
                <span>VISTA 360°</span>
                <span className="text-[10px] text-[#1E40AF] group-hover:text-white">↗</span>
              </button>

              <div className="hidden xl:flex items-center gap-2 font-mono text-[10px] text-[#525860] glass-panel px-3 py-2 border border-[#C7CBD1]">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                <span className="font-bold text-[#111215]">TECLADO ACTIVO:</span>
                <span>ESCRIBÍ</span>
              </div>
            </div>
          </div>

          {/* Unified Expanded Bottom Console Dock (Options Always Visible) */}
          <div className="max-w-[1720px] mx-auto w-full pointer-events-auto">
            <div className="glass-panel-elevated border border-[#C7CBD1] p-3 sm:p-4 lg:p-5 shadow-2xl font-mono flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Left Side: Category Tabs & Always-Visible Options Deck */}
              <div className="flex-1 min-w-0 flex flex-col gap-3">
                {/* Tabs Row */}
                <div className="flex items-center justify-between gap-2 border-b border-[#C7CBD1]/70 pb-2.5">
                  <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
                    {[
                      { id: 'base', num: '01', label: 'CHASIS' },
                      { id: 'keycaps', num: '02', label: 'TECLAS' },
                      { id: 'switches', num: '03', label: 'SWITCHES' },
                      { id: 'knob', num: '04', label: 'PERILLA' },
                    ].map((tab) => {
                      const isSel = (activeHotspot || 'base') === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveHotspot(tab.id);
                            triggerSound();
                          }}
                          className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-[10px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                            isSel
                              ? 'bg-[#1E40AF] text-white border-[#1E40AF] shadow-xs'
                              : 'bg-white/80 text-[#525860] hover:text-[#111215] border-[#C7CBD1] hover:bg-white'
                          }`}
                        >
                          <span className={isSel ? 'text-white/80' : 'text-[#8C939E]'}>{tab.num} //</span>
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Contextual Action: Sound test if switches active */}
                  {(activeHotspot || 'base') === 'switches' && (
                    <button
                      onClick={triggerSound}
                      className="hidden sm:flex items-center gap-1.5 bg-white hover:bg-[#111215] hover:text-white text-[#111215] border border-[#111215] px-3 py-1 text-[10px] font-bold transition-colors cursor-pointer shadow-xs shrink-0"
                    >
                      <Volume2 className="w-3 h-3 text-[#1E40AF]" />
                      <span>PROBAR ACÚSTICA</span>
                    </button>
                  )}
                </div>

                {/* Options Cards Deck (Always Visible!) */}
                <div className="overflow-x-auto pb-1 no-scrollbar">
                  {/* Category 1: Base */}
                  {(activeHotspot || 'base') === 'base' && (
                    <div className="flex items-stretch gap-2 min-w-max">
                      {Object.values(BASE_OPTIONS).map((b) => {
                        const isSel = baseKey === b.id;
                        return (
                          <button
                            key={b.id}
                            onClick={() => setBaseKey(b.id)}
                            className={`flex items-center gap-3 px-3.5 py-2.5 border transition-all cursor-pointer min-w-[170px] ${
                              isSel
                                ? 'bg-white border-[#1E40AF] ring-2 ring-[#1E40AF]/25 shadow-md'
                                : 'bg-white/70 border-[#C7CBD1] hover:bg-white text-[#525860]'
                            }`}
                          >
                            <span
                              className="w-5 h-5 rounded-full border border-[#9CA3AF] shrink-0 shadow-inner"
                              style={{ backgroundColor: b.colorHex }}
                            />
                            <div className="text-left flex flex-col min-w-0">
                              <span className="text-[11px] font-bold text-[#111215] truncate">{b.name}</span>
                              <span className="text-[9px] text-[#525860]">
                                {b.priceDelta > 0 ? `+$${b.priceDelta} USD` : 'INCLUIDO'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Category 2: Keycaps */}
                  {(activeHotspot || 'base') === 'keycaps' && (
                    <div className="flex items-stretch gap-2 min-w-max">
                      {Object.values(KEYCAP_OPTIONS).map((kOpt) => {
                        const isSel = keycapKey === kOpt.id;
                        return (
                          <button
                            key={kOpt.id}
                            onClick={() => setKeycapKey(kOpt.id)}
                            className={`flex items-center gap-3 px-3.5 py-2.5 border transition-all cursor-pointer min-w-[170px] ${
                              isSel
                                ? 'bg-white border-[#1E40AF] ring-2 ring-[#1E40AF]/25 shadow-md'
                                : 'bg-white/70 border-[#C7CBD1] hover:bg-white text-[#525860]'
                            }`}
                          >
                            <div className="flex -space-x-1.5 shrink-0">
                              <span
                                className="w-4 h-4 rounded-full border border-white shadow-xs"
                                style={{ backgroundColor: kOpt.alphaColor }}
                              />
                              <span
                                className="w-4 h-4 rounded-full border border-white shadow-xs"
                                style={{ backgroundColor: kOpt.accentColor }}
                              />
                            </div>
                            <div className="text-left flex flex-col min-w-0">
                              <span className="text-[11px] font-bold text-[#111215] truncate">{kOpt.name}</span>
                              <span className="text-[9px] text-[#525860]">
                                {kOpt.priceDelta > 0 ? `+$${kOpt.priceDelta} USD` : 'INCLUIDO'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Category 3: Switches */}
                  {(activeHotspot || 'base') === 'switches' && (
                    <div className="flex items-stretch gap-2 min-w-max">
                      {Object.values(SWITCH_OPTIONS).map((sOpt) => {
                        const isSel = switchKey === sOpt.id;
                        return (
                          <button
                            key={sOpt.id}
                            onClick={() => {
                              setSwitchKey(sOpt.id);
                              triggerSound();
                            }}
                            className={`flex items-center gap-3 px-3.5 py-2.5 border transition-all cursor-pointer min-w-[190px] ${
                              isSel
                                ? 'bg-[#1E40AF] text-white border-[#1E40AF] shadow-md'
                                : 'bg-white border-[#C7CBD1] hover:bg-[#F8F7F4] text-[#111215]'
                            }`}
                          >
                            <span
                              className="w-4 h-4 rounded-full shrink-0 border border-black/10"
                              style={{ backgroundColor: sOpt.stemColor }}
                            />
                            <div className="text-left flex flex-col min-w-0">
                              <span className="text-[11px] font-bold truncate">{sOpt.name}</span>
                              <span className={`text-[9px] ${isSel ? 'text-white/80' : 'text-[#525860]'}`}>
                                {sOpt.feel} // {sOpt.priceDelta > 0 ? `+$${sOpt.priceDelta} USD` : 'INC'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Category 4: Knob */}
                  {(activeHotspot || 'base') === 'knob' && (
                    <div className="flex items-stretch gap-2 min-w-max">
                      {Object.values(KNOB_OPTIONS).map((kOpt) => {
                        const isSel = knobKey === kOpt.id;
                        return (
                          <button
                            key={kOpt.id}
                            onClick={() => setKnobKey(kOpt.id)}
                            className={`flex items-center gap-3 px-3.5 py-2.5 border transition-all cursor-pointer min-w-[170px] ${
                              isSel
                                ? 'bg-white border-[#1E40AF] ring-2 ring-[#1E40AF]/25 shadow-md'
                                : 'bg-white/70 border-[#C7CBD1] hover:bg-white text-[#525860]'
                            }`}
                          >
                            <span
                              className="w-5 h-5 rounded-full border border-[#9CA3AF] shrink-0 shadow-inner"
                              style={{ backgroundColor: kOpt.colorHex }}
                            />
                            <div className="text-left flex flex-col min-w-0">
                              <span className="text-[11px] font-bold text-[#111215] truncate">{kOpt.name}</span>
                              <span className="text-[9px] text-[#525860]">
                                {kOpt.priceDelta > 0 ? `+$${kOpt.priceDelta} USD` : 'INCLUIDO'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Vertical Divider (Desktop) */}
              <div className="hidden lg:block w-[1px] self-stretch bg-[#C7CBD1]" />

              {/* Right Side: Price Counter & Instant Add to Cart */}
              <div className="flex items-center justify-between lg:flex-col lg:items-end lg:justify-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#C7CBD1]/60">
                <div className="text-left lg:text-right">
                  <div className="flex items-center gap-1.5 text-[9px] text-[#525860] uppercase mb-0.5">
                    <span>KX-75</span>
                    <span className="text-[#1E40AF] font-bold">// ENSAMBLE</span>
                  </div>
                  <span
                    ref={priceDisplayRef}
                    className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-[#111215] tracking-tight leading-none block"
                  >
                    ${totalPrice.toFixed(2)} USD
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="bg-[#1E40AF] hover:bg-[#1D4ED8] text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 shadow-[0_4px_16px_rgba(30,64,175,0.3)] hover:shadow-[0_6px_22px_rgba(30,64,175,0.45)] flex items-center gap-2 cursor-pointer shrink-0 group active:scale-98"
                >
                  <span>AÑADIR AL CARRITO</span>
                  <span className="text-sm transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5">
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
