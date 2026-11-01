import React, { useState, useEffect, useRef, useId } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import {
  Cpu,
  Layers,
  Activity,
  Volume2,
  ShieldCheck,
  Wrench,
  ArrowUpRight,
  Zap,
  Radio,
  Sliders,
  Sparkles,
  Gauge,
  CornerDownRight,
  Disc,
} from 'lucide-react';
import { useCustomizer } from '../../context/CustomizerContext';

const LAYERS_DATA = [
  {
    num: '01',
    code: 'CAPA-PBT-15',
    name: 'KEYCAPS DOBLE INYECCIÓN PBT 1.5MM',
    shortName: 'Keycaps PBT',
    category: 'SUPERFICIE DE CONTACTO',
    thickness: '1.5 mm',
    material: 'PBT Grado Industrial 85% Resina Pura',
    acoustic: 'Atenuación de frecuencias altas agudas (+2kHz)',
    desc: 'Moldeado termoplástico de doble disparo con tipografía indeleble que jamás se desgasta ni produce brillo por fricción. Perfil Cherry esculpido ergonómicamente para minimizar la fatiga articular durante sesiones de trabajo continuo.',
    blueprintSpec: 'Tolerancia dimensional ±0.02mm // Resistencia UV grado automotriz',
  },
  {
    num: '02',
    code: 'PLACA-FR4-FLEX',
    name: 'PLACA POLICARBONATO & FR4 CON CORTES FLEX-CUT',
    shortName: 'Placa FR4 Flex',
    category: 'SISTEMA DE SUSPENSIÓN',
    thickness: '1.5 mm',
    material: 'Compuesto FR4 Epóxico de Grado Electrónico',
    acoustic: 'Afinación tímbrica profunda y eliminación del impacto rígido',
    desc: 'Canales perimetrales calculados mediante simulación de elementos finitos (FEA). Distribuye la energía del impacto de cada pulsación a lo largo de toda la superficie del teclado, otorgando un retorno suave y consistente en cada hilera.',
    blueprintSpec: '18 puntos perimetrales de absorción con gasket de silicona líquida',
  },
  {
    num: '03',
    code: 'DAMP-PORON-XRD',
    name: 'MEMBRANA ACÚSTICA VISCOELÁSTICA PORON® XRD',
    shortName: 'Espuma PORON® XRD',
    category: 'ABSORCIÓN Y AISLAMIENTO',
    thickness: '3.5 mm',
    material: 'Uretano Celular de Alta Densidad Rogers PORON® XRD',
    acoustic: 'Reducción de reverberación de -28 dB en cámara sellada',
    desc: 'Estructura celular micro-abierta que disipa hasta el 90% de la energía de choque y dispersa las ondas estacionarias. Elimina por completo el eco metálico o sonido de caja hueca típico de chasis de aluminio macizo.',
    blueprintSpec: 'Densidad 240 kg/m³ // Resistencia a la compresión permanente < 2%',
  },
  {
    num: '04',
    code: 'PCB-KAILH-HWS',
    name: 'PCB HOT-SWAP MULTICAPA CON SOCKETS KAILH GEN-3',
    shortName: 'PCB Hot-Swap',
    category: 'NÚCLEO ELECTRÓNICO',
    thickness: '1.6 mm',
    material: 'FR4 Multicapa con Pistas Enchapadas en Oro 24K',
    acoustic: 'Filtro anti-vibración y desacople de interferencia magnética',
    desc: 'Permite el intercambio de cualquier switch mecánico de 3 y 5 pines en caliente sin herramientas de soldadura. Equipado con diodos de protección electrostática (ESD) de hasta 15.000V y microcontrolador ARM Cortex-M4.',
    blueprintSpec: '50.000 ciclos de inserción mecánica // Tasa de sondeo 1.000Hz (1ms)',
  },
  {
    num: '05',
    code: 'CHASIS-CNC-6063',
    name: 'CHASIS MONOBLOQUE ALUMINIO AEROESPACIAL 6063-T6',
    shortName: 'Chasis CNC 6063',
    category: 'ESTRUCTURA DE CONTENCIÓN',
    thickness: '22.4 mm',
    material: 'Bloque Macizo de Aleación 6063-T6 de Grado Aeronáutico',
    acoustic: 'Masa inercial de 1.850 gramos para eliminación de vibración parásita',
    desc: 'Mecanizado a lo largo de 3 horas por centro de maquinado CNC de 5 ejes a partir de un lingote macizo. Acabado con chorro de microesferas de vidrio #180 y anodizado electrolítico de capa dura de 18 micrones.',
    blueprintSpec: 'Tolerancia de mecanizado ±0.01mm // Ángulo de escritura fijo de 7.2°',
  },
];

export default function SpecsBentoGrid() {
  const { currentSwitch, activeKeyPressed, triggerSound } = useCustomizer();
  const [activeLayer, setActiveLayer] = useState(2); // Default on Poron XRD Damping
  const [liveLatency, setLiveLatency] = useState(0.8);
  const [lastKeyPressed, setLastKeyPressed] = useState('ESPACIO');
  const [pulseActive, setPulseActive] = useState(false);
  const [soundWaveActive, setSoundWaveActive] = useState(false);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const tier1Ref = useRef(null);
  const tier2Ref = useRef(null);
  const tier3Ref = useRef(null);

  // GSAP ScrollTrigger Animations fully synchronized with Lenis SmoothScroll
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Header reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Tier 1 Metric cards stagger
      if (tier1Ref.current) {
        gsap.fromTo(
          tier1Ref.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: tier1Ref.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 3. Tier 2 Architectural Exploded diagram
      if (tier2Ref.current) {
        gsap.fromTo(
          tier2Ref.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: tier2Ref.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 4. Tier 3 Technical Accreditations
      if (tier3Ref.current) {
        gsap.fromTo(
          tier3Ref.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: tier3Ref.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 5. Kinetic Parallax on Monumental Numeral "02"
      gsap.to('.specs-watermark', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.0,
        },
        y: 80,
        ease: 'none',
      });
    }, sectionRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };

    return () => ctx.revert();
  }, []);

  // Listen to live key press events to update the architectural debounce gauge
  useEffect(() => {
    if (activeKeyPressed) {
      setLastKeyPressed(activeKeyPressed.toUpperCase());
      const newLatency = Number((0.68 + Math.random() * 0.24).toFixed(2));
      setLiveLatency(newLatency);
      setPulseActive(true);
      const timer = setTimeout(() => setPulseActive(false), 300);
      return () => clearTimeout(timer);
    }
  }, [activeKeyPressed]);

  const handleSoundTest = () => {
    triggerSound();
    setSoundWaveActive(true);
    setTimeout(() => setSoundWaveActive(false), 600);
  };

  const layersData = LAYERS_DATA;
  const currentLayerData = layersData[activeLayer];

  return (
    <section
      id="componentes"
      ref={sectionRef}
      className="relative border-t border-b border-[#C7CBD1] bg-[#EDEAE4] overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 0, 0, 0.035) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.035) 1px, transparent 1px)
        `,
        backgroundSize: '88px 88px',
      }}
    >
      {/* Precision Architectural Dividing Line */}
      <div className="w-full border-b border-[#C7CBD1] bg-[#E7E4DD] px-4 sm:px-8 lg:px-12 py-2.5 flex items-center justify-between font-mono text-[10px] text-[#525860] uppercase select-none relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#1E40AF]"></span>
          <span className="font-bold text-[#111215]">HEXA // DIVISIÓN ESTRUCTURAL</span>
          <span className="text-[#8C939E]">//</span>
          <span>03 ESPECIFICACIONES TÉCNICAS</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[#8C939E]">
          <span>CNC TOLERANCE ±0.01MM</span>
          <span>//</span>
          <span className="font-bold text-[#111215]">CAD BLUEPRINT</span>
          <span className="text-[#1E40AF]">↓</span>
        </div>
      </div>

      {/* Monumental Watermark Numeral in Background */}
      <div className="specs-watermark absolute right-4 sm:right-12 top-12 font-display font-black text-[120px] sm:text-[220px] lg:text-[280px] text-outline-monumental select-none pointer-events-none leading-none opacity-10 z-0 will-change-transform">
        02
      </div>

      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 pt-16 sm:pt-24 pb-16 sm:pb-24">
        {/* =========================================================================
            HEADER: Monumental Architectural Headline
            ========================================================================= */}
        <div
          ref={headerRef}
          className="border-b border-[#C7CBD1] pb-8 sm:pb-12 mb-10 sm:mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-6"
        >
          <div className="max-w-4xl">
            <div className="flex items-center gap-2.5 font-mono text-[10px] sm:text-xs text-[#525860] uppercase tracking-widest mb-3">
              <span className="w-2 h-2 bg-[#1E40AF]"></span>
              <span className="font-bold text-[#111215]">02 // ESPECIFICACIONES DE PRECISIÓN</span>
              <span className="text-[#8C939E]">—</span>
              <span className="text-[#1E40AF] font-semibold">BLUEPRINT ARCHITECTURE</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-[#111215] uppercase tracking-tighter leading-[0.92]">
              INGENIERÍA <span className="text-[#1E40AF]">&amp;</span> ANATOMÍA <span className="text-[#8C939E]">//</span> KX-75
            </h2>
            <p className="mt-4 font-sans text-sm sm:text-base text-[#525860] max-w-2xl leading-relaxed">
              Cada milímetro ha sido esculpido a partir de aleaciones aeroespaciales, tolerancias micrométricas y amortiguación viscoelástica calibrada para un sonido y tacto sin precedentes.
            </p>
          </div>
        </div>

        {/* =========================================================================
            TIER 1: 3 MONUMENTAL METRIC CARDS (High-Fashion Swiss Style)
            ========================================================================= */}
        <div ref={tier1Ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Card 1: Debounce Latency Gauge */}
          <div className={`border border-[#C7CBD1] bg-white p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xs hover:border-[#1E40AF] relative ${pulseActive ? 'ring-2 ring-[#1E40AF]/30' : ''}`}>
            <div className="flex items-center justify-between border-b border-[#C7CBD1]/60 pb-3 mb-6 font-mono text-[11px]">
              <span className="font-bold text-[#111215] flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#1E40AF]" />
                01 // LATENCIA DEBOUNCE
              </span>
              <span className="text-[10px] bg-[#16A34A]/10 text-[#16A34A] font-bold px-2 py-0.5 border border-[#16A34A]/20">
                1000 HZ POLLING
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-[#111215] tracking-tight leading-none">
                  {liveLatency.toFixed(2)}
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#1E40AF]">ms</span>
              </div>
              <p className="font-mono text-[10px] sm:text-xs text-[#525860] uppercase tracking-wider mb-6">
                FILTRADO DIGITAL ANTI-REBOTE N-KEY ROLLOVER
              </p>

              {/* Animated Live Oscilloscope Wave */}
              <div className="border border-[#C7CBD1] bg-[#F8F7F4] p-3 mb-4 rounded-xs">
                <div className="flex items-center justify-between font-mono text-[9px] text-[#8C939E] mb-2">
                  <span>OSCILOSCOPIO DE ENTRADA</span>
                  <span className="text-[#1E40AF] font-semibold">EVENTO: {lastKeyPressed}</span>
                </div>
                <div className="h-8 flex items-center justify-between gap-1">
                  {[40, 65, 30, 85, 95, 45, 20, 70, 50, 90, 60, 35, 80, 55, 30].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-[#1E40AF]/80 rounded-full transition-all duration-150"
                      style={{
                        height: pulseActive ? `${Math.min(100, h * 1.2)}%` : `${h * 0.45}%`,
                        opacity: pulseActive ? 1 : 0.4,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#C7CBD1]/60 flex items-center justify-between font-mono text-[10px] text-[#525860]">
              <span>TIEMPO DE RESPUESTA REAL</span>
              <span className="font-bold text-[#111215]">PRECISIÓN &lt; 1.0 MS</span>
            </div>
          </div>

          {/* Card 2: Monobloc CNC Weight & Rigidity */}
          <div className="border border-[#C7CBD1] bg-white p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xs hover:border-[#1E40AF]">
            <div className="flex items-center justify-between border-b border-[#C7CBD1]/60 pb-3 mb-6 font-mono text-[11px]">
              <span className="font-bold text-[#111215] flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1E40AF]" />
                02 // MASA &amp; INTEGRIDAD ESTRUCTURAL
              </span>
              <span className="text-[10px] bg-[#EDEAE4] text-[#111215] font-bold px-2 py-0.5 border border-[#C7CBD1]">
                CNC 6063-T6
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-[#111215] tracking-tight leading-none">
                  1.850
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#111215]">g</span>
              </div>
              <p className="font-mono text-[10px] sm:text-xs text-[#525860] uppercase tracking-wider mb-6">
                ALUMINIO MACIZO // ANODIZADO MICRO-BEAD
              </p>

              {/* Engineering Tolerances List */}
              <div className="space-y-2 border border-[#C7CBD1] bg-[#F8F7F4] p-3 mb-4 font-mono text-[10px]">
                <div className="flex justify-between items-center text-[#525860]">
                  <span>TOLERANCIA DE FRESADO</span>
                  <span className="font-bold text-[#111215]">±0.01 MM</span>
                </div>
                <div className="flex justify-between items-center text-[#525860]">
                  <span>TRATAMIENTO SUPERFICIAL</span>
                  <span className="font-bold text-[#111215]">MICRO-CHORRO #180</span>
                </div>
                <div className="flex justify-between items-center text-[#525860]">
                  <span>ÁNGULO ERGONÓMICO</span>
                  <span className="font-bold text-[#1E40AF]">7.2° INCLINACIÓN FIJA</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#C7CBD1]/60 flex items-center justify-between font-mono text-[10px] text-[#525860]">
              <span>AISLAMIENTO ACÚSTICO</span>
              <span className="font-bold text-[#111215]">CERO RESONANCIA</span>
            </div>
          </div>

          {/* Card 3: Acoustic Attenuation & Sound Test */}
          <div className="border border-[#C7CBD1] bg-white p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xs hover:border-[#1E40AF]">
            <div className="flex items-center justify-between border-b border-[#C7CBD1]/60 pb-3 mb-6 font-mono text-[11px]">
              <span className="font-bold text-[#111215] flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-[#1E40AF]" />
                03 // ABSORCIÓN ACÚSTICA
              </span>
              <span className="text-[10px] bg-[#1E40AF]/10 text-[#1E40AF] font-bold px-2 py-0.5 border border-[#1E40AF]/20">
                5 CAPAS DAMPING
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-[#1E40AF] tracking-tight leading-none">
                  -28
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#111215]">dB</span>
              </div>
              <p className="font-mono text-[10px] sm:text-xs text-[#525860] uppercase tracking-wider mb-6">
                DISIPACIÓN DE FRECUENCIAS PARÁSITAS HUECAS
              </p>

              {/* Sound Test Interactive Button */}
              <button
                onClick={handleSoundTest}
                className={`w-full py-3 px-4 border border-[#111215] text-[#111215] hover:bg-[#111215] hover:text-white font-mono text-[11px] font-bold tracking-wider flex items-center justify-between transition-all duration-200 cursor-pointer mb-4 ${
                  soundWaveActive ? 'bg-[#111215] text-white shadow-md' : 'bg-transparent'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Volume2 className={`w-3.5 h-3.5 ${soundWaveActive ? 'animate-bounce text-[#1E40AF]' : ''}`} />
                  TEST ACÚSTICO // {currentSwitch.name.toUpperCase()}
                </span>
                <span>PULSAR ↗</span>
              </button>
            </div>

            <div className="pt-4 border-t border-[#C7CBD1]/60 flex items-center justify-between font-mono text-[10px] text-[#525860]">
              <span>PERFIL DE SWITCH ACTIVO</span>
              <span className="font-bold text-[#1E40AF]">{currentSwitch.feel}</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TIER 2: ARCHITECTURAL EXPLODED SECTION (Corte Técnico & Ficha de Capas)
            ========================================================================= */}
        <div ref={tier2Ref} className="border border-[#C7CBD1] bg-[#F8F7F4] shadow-xs mb-12 sm:mb-16 overflow-hidden">
          {/* Subheader Bar */}
          <div className="border-b border-[#C7CBD1] px-6 sm:px-10 py-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#1E40AF]"></span>
              <h3 className="font-mono text-xs sm:text-sm font-black text-[#111215] uppercase tracking-wider">
                CORTE TÉCNICO // ESTRUCTURA GASKET MOUNT MULTICAPA
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#525860]">
              <span>SELECCIONA UNA CAPA PARA INSPECCIONAR SUS PROPIEDADES FÍSICAS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#C7CBD1]">
            {/* Left Column: Interactive Architectural Layer Stack Visualizer */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] text-[#8C939E] uppercase tracking-wider block mb-4">
                  DIAGRAMA DE DESPIECE ESTRUCTURAL (5 CAPAS)
                </span>

                <div className="space-y-2.5">
                  {layersData.map((layer, index) => {
                    const isSelected = activeLayer === index;
                    return (
                      <div
                        key={layer.num}
                        onClick={() => {
                          setActiveLayer(index);
                          triggerSound();
                        }}
                        className={`p-3.5 border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#111215] text-white border-[#111215] shadow-md -translate-x-1'
                            : 'bg-white hover:bg-white/80 text-[#111215] border-[#C7CBD1]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-mono text-xs font-bold px-2 py-0.5 border ${
                              isSelected
                                ? 'bg-white/20 border-white/30 text-white'
                                : 'bg-[#EDEAE4] border-[#C7CBD1] text-[#525860]'
                            }`}
                          >
                            {layer.num}
                          </span>
                          <div>
                            <span className="font-display font-bold text-xs sm:text-sm uppercase tracking-tight block">
                              {layer.shortName}
                            </span>
                            <span
                              className={`font-mono text-[9px] uppercase tracking-wider ${
                                isSelected ? 'text-white/70' : 'text-[#8C939E]'
                              }`}
                            >
                              {layer.category}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`font-mono text-xs font-bold block ${
                              isSelected ? 'text-[#38BDF8]' : 'text-[#1E40AF]'
                            }`}
                          >
                            {layer.thickness}
                          </span>
                          <span
                            className={`font-mono text-[9px] ${
                              isSelected ? 'text-white/60' : 'text-[#8C939E]'
                            }`}
                          >
                            ESPESOR
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Technical Footnote */}
              <div className="pt-6 mt-6 border-t border-[#C7CBD1] flex items-center justify-between font-mono text-[10px] text-[#525860]">
                <span>ENSAMBLAJE DE PRECISIÓN</span>
                <span className="text-[#1E40AF] font-bold">100% MODULAR</span>
              </div>
            </div>

            {/* Right Column: Layer Detailed Engineering Blueprint Spec */}
            <div className="lg:col-span-7 p-6 sm:p-10 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#C7CBD1] pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1E40AF]">
                      CAPA {currentLayerData.num} // 05
                    </span>
                    <span className="text-[#8C939E]">•</span>
                    <span className="font-mono text-[10px] text-[#525860] uppercase tracking-wider">
                      {currentLayerData.code}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] bg-[#EDEAE4] text-[#111215] font-semibold px-2.5 py-1 border border-[#C7CBD1]">
                    ESPESOR: {currentLayerData.thickness}
                  </span>
                </div>

                <h4 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#111215] uppercase tracking-tight leading-tight mb-4">
                  {currentLayerData.name}
                </h4>

                <p className="font-sans text-sm sm:text-base text-[#525860] leading-relaxed mb-6">
                  {currentLayerData.desc}
                </p>

                {/* Blueprint Parameters Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-[#C7CBD1] bg-[#F8F7F4] p-4 sm:p-6 mb-6 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-[#8C939E] uppercase tracking-wider block mb-1">
                      COMPOSICIÓN DE MATERIAL
                    </span>
                    <p className="font-semibold text-[#111215] leading-snug">
                      {currentLayerData.material}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C939E] uppercase tracking-wider block mb-1">
                      RESPUESTA ACÚSTICA CALIBRADA
                    </span>
                    <p className="font-semibold text-[#1E40AF] leading-snug">
                      {currentLayerData.acoustic}
                    </p>
                  </div>
                </div>

                <div className="font-mono text-[11px] text-[#525860] bg-white border border-[#C7CBD1] p-3 flex items-center gap-2">
                  <CornerDownRight className="w-3.5 h-3.5 text-[#1E40AF] shrink-0" />
                  <span>{currentLayerData.blueprintSpec}</span>
                </div>
              </div>

              {/* Bottom Quick-Layer Pill Switcher */}
              <div className="pt-6 mt-8 border-t border-[#C7CBD1] flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[10px] text-[#8C939E] uppercase tracking-wider">
                  NAVEGACIÓN DE CAPAS:
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {layersData.map((l, idx) => (
                    <button
                      key={l.num}
                      onClick={() => {
                        setActiveLayer(idx);
                        triggerSound();
                      }}
                      className={`px-3 py-1 border transition-colors cursor-pointer ${
                        activeLayer === idx
                          ? 'bg-[#1E40AF] text-white border-[#1E40AF] font-bold'
                          : 'bg-white hover:bg-[#EDEAE4] text-[#111215] border-[#C7CBD1]'
                      }`}
                    >
                      {l.num} {l.shortName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TIER 3: FOUR TECHNICAL ACCREDITATIONS & STANDARDS
            ========================================================================= */}
        <div ref={tier3Ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x border border-[#C7CBD1] bg-white divide-[#C7CBD1]">
          {/* Spec 1: QMK / VIA */}
          <div className="p-6 sm:p-8 flex flex-col justify-between hover:bg-[#F8F7F4] transition-colors duration-200">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#1E40AF] font-bold mb-3">
                <Cpu className="w-4 h-4" />
                <span>01 // ARM CORTEX-M4</span>
              </div>
              <h5 className="font-display font-black text-lg text-[#111215] mb-2 uppercase tracking-tight">
                FIRMWARE QMK / VIA NATIVO
              </h5>
              <p className="font-sans text-xs text-[#525860] leading-relaxed">
                Reprogramación instantánea de teclas, macros al vuelo y capas independientes en memoria flash sin software en segundo plano.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#C7CBD1]/60 font-mono text-[10px] text-[#1E40AF] font-bold">
              100% OPEN SOURCE ↗
            </div>
          </div>

          {/* Spec 2: Optical Encoder ALPS */}
          <div className="p-6 sm:p-8 flex flex-col justify-between hover:bg-[#F8F7F4] transition-colors duration-200">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#1E40AF] font-bold mb-3">
                <Sliders className="w-4 h-4" />
                <span>02 // ENCODER ROTATORIO</span>
              </div>
              <h5 className="font-display font-black text-lg text-[#111215] mb-2 uppercase tracking-tight">
                CONTROL ANALÓGICO CNC
              </h5>
              <p className="font-sans text-xs text-[#525860] leading-relaxed">
                24 pasos táctiles por vuelta con freno mecánico inercial, acabado moleteado de diamante y pulsador de cambio de modo.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#C7CBD1]/60 font-mono text-[10px] text-[#1E40AF] font-bold">
              1.000.000 CICLOS ↗
            </div>
          </div>

          {/* Spec 3: Universal Hot-Swap Kailh */}
          <div className="p-6 sm:p-8 flex flex-col justify-between hover:bg-[#F8F7F4] transition-colors duration-200">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#1E40AF] font-bold mb-3">
                <Wrench className="w-4 h-4" />
                <span>03 // SOCKETS KAILH</span>
              </div>
              <h5 className="font-display font-black text-lg text-[#111215] mb-2 uppercase tracking-tight">
                COMPATIBILIDAD 3 &amp; 5 PINES
              </h5>
              <p className="font-sans text-xs text-[#525860] leading-relaxed">
                Reemplazo de switches en caliente sin soldador. Contactos de bronce fosforoso bañados en oro de 24 quilates.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#C7CBD1]/60 font-mono text-[10px] text-[#1E40AF] font-bold">
              50.000 CICLOS HWS ↗
            </div>
          </div>

          {/* Spec 4: USB-C & ESD Protection */}
          <div className="p-6 sm:p-8 flex flex-col justify-between hover:bg-[#F8F7F4] transition-colors duration-200">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#1E40AF] font-bold mb-3">
                <Zap className="w-4 h-4" />
                <span>04 // CONECTOR USB-C</span>
              </div>
              <h5 className="font-display font-black text-lg text-[#111215] mb-2 uppercase tracking-tight">
                PROTECCIÓN ESD 15KV
              </h5>
              <p className="font-sans text-xs text-[#525860] leading-relaxed">
                Puerto embutido central con aislamiento galvánico de alta velocidad y blindaje electromagnético anti-interferencias.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#C7CBD1]/60 font-mono text-[10px] text-[#1E40AF] font-bold">
              CONEXIÓN DIRECTA ↗
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
