import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, ShieldCheck, Truck, ArrowUpRight, CheckCircle2, FileText } from 'lucide-react';
import { useCustomizer } from '../../context/CustomizerContext';
import { HexaLogoSymbol } from '../common/HexaLogo';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const {
    currentBase,
    currentKeycaps,
    currentSwitch,
    currentKnob,
    totalPrice,
    setIsOrderModalOpen,
  } = useCustomizer();

  const footerRef = useRef(null);
  const blueprintRef = useRef(null);
  const summaryRef = useRef(null);
  const bottomBarRef = useRef(null);

  // GSAP ScrollTrigger synchronized with Lenis SmoothScroll
  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      if (blueprintRef.current) {
        gsap.fromTo(
          blueprintRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: blueprintRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (summaryRef.current) {
        gsap.fromTo(
          summaryRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            delay: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: summaryRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (bottomBarRef.current) {
        gsap.fromTo(
          bottomBarRef.current.children,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: bottomBarRef.current,
              start: 'top 95%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Parallax scrub on Monumental Numeral "04"
      gsap.to('.footer-watermark', {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1.0,
        },
        y: -50,
        ease: 'none',
      });
    }, footerRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  const handleExportSpecs = () => {
    const specsData = `HEXA // CUSTOM — SISTEMA MODULAR KX-75
FICHA TÉCNICA DE FABRICACIÓN
==================================================
REF DE ENSAMBLE: KX75-CH-${Date.now().toString(36).toUpperCase()}
TOLERANCIA MECÁNICA: ±0.01 mm
--------------------------------------------------
01 // BASE / CHASIS: ${currentBase.name} (${currentBase.spec})
02 // SWITCHES: ${currentSwitch.name} (${currentSwitch.tag} - ${currentSwitch.feel})
03 // PERILLA CNC: ${currentKnob.name}
04 // KEYCAPS: ${currentKeycaps?.name || 'PBT CLÁSICO'} (${currentKeycaps?.spec || 'Perfil Cherry'})
05 // AMORTIGUACIÓN: 5 Capas PORON® XRD Viscoelástico
06 // CONTROLADOR: ARM Cortex-M4 32-bit (QMK / VIA)
07 // POLLING RATE: 1000Hz (1ms) N-Key Rollover
--------------------------------------------------
PRECIO ESTIMADO TOTAL: $${totalPrice.toFixed(2)} USD
DIMENSIONES EXTERIORES: 322.00 mm x 138.00 mm x 32.00 mm
PESO TOTAL CALIBRADO: 1.850 gramos
--------------------------------------------------
HEXA LABORATORIES // INDUSTRIAL SPECIFICATION
BERLIN // TOKYO // SAN FRANCISCO`;

    const blob = new Blob([specsData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'HEXA_KX75_FICHA_TECNICA.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <footer
      id="soporte"
      ref={footerRef}
      className="relative bg-[#F8F7F4] border-t border-[#C7CBD1] overflow-hidden"
    >
      {/* Monumental Watermark Numeral */}
      <div className="footer-watermark absolute right-8 bottom-12 font-display font-black text-[160px] sm:text-[260px] lg:text-[340px] text-outline-monumental select-none pointer-events-none leading-none opacity-10 z-0 will-change-transform">
        04
      </div>

      <div className="max-w-[1720px] mx-auto relative z-10">
        {/* Top Technical Blueprint Schematic Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#C7CBD1]">
          {/* Blueprint Graphic Vector */}
          <div
            ref={blueprintRef}
            className="lg:col-span-8 p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-[#C7CBD1] flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs text-[#525860] mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#1E40AF]"></span>
                  <span className="font-bold text-[#111215] uppercase tracking-wider">
                    PLANO TÉCNICO // KX-75 SCHEMATIC DRAWING
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span>ESCALA 1:1</span>
                  <span className="text-[#8C939E]">//</span>
                  <span>ANSI 75% MODULAR</span>
                  <span className="text-[#8C939E]">//</span>
                  <span className="text-[#1E40AF] font-bold">CAD REV 04.9</span>
                </div>
              </div>

              {/* Schematic SVG Vector Blueprint with CAD Crosshairs */}
              <div className="border border-[#C7CBD1] bg-[#EFECE6]/90 p-5 sm:p-8 relative font-mono overflow-x-auto shadow-inner">
                {/* 4 Corner Crosshairs */}
                <span className="absolute top-2 left-2 text-[10px] text-[#8C939E]">+</span>
                <span className="absolute top-2 right-2 text-[10px] text-[#8C939E]">+</span>
                <span className="absolute bottom-2 left-2 text-[10px] text-[#8C939E]">+</span>
                <span className="absolute bottom-2 right-2 text-[10px] text-[#8C939E]">+</span>

                <div className="min-w-[560px]">
                  {/* Crosshairs & Dimension Callouts */}
                  <div className="flex items-center justify-between text-[10px] text-[#525860] mb-3 border-b border-dashed border-[#C7CBD1] pb-1.5">
                    <span className="flex items-center gap-1 font-semibold text-[#111215]">
                      <span>←</span> 322.00 MM ANCHO TOTAL <span>→</span>
                    </span>
                    <span className="text-[#1E40AF] font-bold">ANGULACIÓN 7.5° NATURAL</span>
                    <span className="flex items-center gap-1 font-semibold text-[#111215]">
                      <span>↑</span> 19.50 MM ALTURA FRONTAL
                    </span>
                  </div>

                  {/* Orthogonal Blueprint Box Graphic */}
                  <div className="h-44 border-2 border-[#111215] relative flex flex-col justify-between p-3.5 bg-white/70 backdrop-blur-xs">
                    {/* Top Row Markers */}
                    <div className="flex justify-between items-center text-[10px]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 border border-[#111215] bg-[#1E40AF]"></span>
                        <span className="font-bold text-[#111215]">// ESCAPE NODE (0,0)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#525860]">PERILLA ROTATIVA CNC</span>
                        <div className="w-7 h-7 border-2 border-[#1E40AF] rounded-full flex items-center justify-center text-[#1E40AF] text-[9px] font-black">
                          ROT
                        </div>
                      </div>
                    </div>

                    {/* Middle Graphic Spec Watermark */}
                    <div className="my-auto text-center font-mono py-2 border-y border-dashed border-[#C7CBD1]">
                      <span className="text-xs sm:text-sm font-black text-[#111215] tracking-[0.2em] uppercase block">
                        HEXA // KX-75 DUAL GASKET MOUNT CHAMBER
                      </span>
                      <span className="text-[10px] text-[#525860] mt-0.5 block">
                        ALUMINIO CNC MONOBLOQUE 6063-T6 // ANODIZADO MICROARENADO
                      </span>
                    </div>

                    {/* Bottom Row Markers */}
                    <div className="flex justify-between items-center text-[10px] text-[#525860]">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#111215]">PUERTO CENTRAL TYPE-C</span>
                        <span className="text-[#8C939E]">// 1000HZ ULTRA FAST</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#1E40AF] font-bold">
                        <span>FLECHAS DIRECCIONALES ANSI</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Footnotes of Blueprint */}
                  <div className="flex items-center justify-between text-[10px] text-[#525860] mt-3 border-t border-dashed border-[#C7CBD1] pt-1.5">
                    <span>MASA NETA: 1.850 GRAMOS</span>
                    <span>TORNILLERÍA HEX M2.5 INOXIDABLE</span>
                    <span className="text-[#1E40AF] font-bold">CALIBRACIÓN CNC DINÁMICA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Badges */}
            <div className="mt-8 pt-6 border-t border-[#C7CBD1] flex flex-wrap items-center gap-6 font-mono text-xs text-[#525860]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1E40AF]" />
                <span className="font-semibold text-[#111215]">GARANTÍA TOTAL DE 5 AÑOS</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#1E40AF]" />
                <span>ENVÍOS INTERNACIONALES VÍA DHL EXPRESS</span>
              </div>
            </div>
          </div>

          {/* Quick Summary & Configuration Checkout */}
          <div
            ref={summaryRef}
            className="lg:col-span-4 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-[#EFECE6]"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#C7CBD1] mb-6">
                <span className="font-mono text-xs font-bold text-[#111215] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#1E40AF]"></span>
                  RESUMEN DE ENSAMBLE ACTUAL
                </span>
                <span className="font-mono text-[9px] text-[#1E40AF] font-bold bg-white px-2 py-0.5 border border-[#C7CBD1]">
                  EN STOCK
                </span>
              </div>

              {/* Dynamic Bill of Materials (BOM) */}
              <div className="space-y-3 font-mono text-xs mb-8">
                <div className="flex justify-between pb-2 border-b border-[#C7CBD1]">
                  <span className="text-[#525860]">BASE:</span>
                  <span className="font-bold text-[#111215]">{currentBase.name}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#C7CBD1]">
                  <span className="text-[#525860]">SWITCH:</span>
                  <span className="font-bold text-[#111215]">{currentSwitch.name}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#C7CBD1]">
                  <span className="text-[#525860]">PERILLA CNC:</span>
                  <span className="font-bold text-[#111215]">{currentKnob.name}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#C7CBD1]">
                  <span className="text-[#525860]">SET DE KEYCAPS:</span>
                  <span className="font-bold text-[#111215]">{currentKeycaps?.name || 'PBT CLÁSICO'}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#C7CBD1]">
                  <span className="text-[#525860]">AMORTIGUACIÓN:</span>
                  <span className="font-bold text-[#111215]">PORON® XRD 5-LAYER</span>
                </div>
                <div className="flex justify-between pt-3 text-base font-black">
                  <span className="text-[#111215]">TOTAL ESTIMADO:</span>
                  <span className="text-[#1E40AF] text-xl">${totalPrice.toFixed(2)} USD</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white py-4 font-mono text-xs font-bold tracking-wider transition-all duration-200 shadow-[0_4px_20px_rgba(30,64,175,0.3)] hover:shadow-[0_6px_25px_rgba(30,64,175,0.45)] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>PROCEDER AL CHECKOUT</span>
                <span className="text-sm transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </button>

              <button
                onClick={handleExportSpecs}
                className="w-full bg-white hover:bg-[#F8F7F4] border border-[#111215] text-[#111215] py-3.5 font-mono text-xs font-bold tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs group"
              >
                <Download className="w-3.5 h-3.5 text-[#1E40AF] transition-transform group-hover:-translate-y-0.5" />
                <span>DESCARGAR FICHA TÉCNICA</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div
          ref={bottomBarRef}
          className="p-6 sm:px-10 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-[#525860]"
        >
          <div className="flex items-center gap-3">
            <HexaLogoSymbol mode="light" className="w-5 h-5 shrink-0" accentColor="#1E40AF" />
            <span className="font-bold text-[#111215]">HEXA // CUSTOM</span>
            <span className="text-[#8C939E] hidden sm:inline-block">// SISTEMA MODULAR KX-75</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                const container = document.getElementById('configurador');
                if (container) {
                  const targetScroll = container.offsetTop + (container.offsetHeight - window.innerHeight) * 0.65;
                  if (window.__lenis) {
                    window.__lenis.scrollTo(targetScroll, { duration: 1.2 });
                  } else {
                    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                  }
                }
              }}
              className="hover:text-[#1E40AF] transition-colors cursor-pointer"
            >
              CONFIGURADOR ↗
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('componentes');
                if (el) {
                  if (window.__lenis) {
                    window.__lenis.scrollTo(el, { duration: 1.2 });
                  } else {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              className="hover:text-[#1E40AF] transition-colors cursor-pointer"
            >
              PLANOS TÉCNICOS ↗
            </button>
            <button
              onClick={() => {
                if (window.__lenis) {
                  window.__lenis.scrollTo(0, { duration: 1.2 });
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="text-[#111215] font-bold hover:text-[#1E40AF] transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>VOLVER ARRIBA</span>
              <span>↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
