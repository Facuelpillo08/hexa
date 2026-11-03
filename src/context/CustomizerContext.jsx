import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { playSwitchSound } from '../utils/soundEngine';

const CustomizerContext = createContext();

export const BASE_OPTIONS = {
  plata: {
    id: 'plata',
    name: 'PLATA',
    colorHex: '#D4D6D8',
    roughness: 0.2,
    metalness: 0.85,
    priceDelta: 0,
    spec: 'ALUMINIO 6063 ANODIZADO NATURAL',
  },
  carbon: {
    id: 'carbon',
    name: 'CARBÓN',
    colorHex: '#22252A',
    roughness: 0.3,
    metalness: 0.7,
    priceDelta: 15,
    spec: 'ALUMINIO 6063 TRATAMIENTO DLC MATE',
  },
  cobalto: {
    id: 'cobalto',
    name: 'COBALTO',
    colorHex: '#1E3A8A',
    roughness: 0.25,
    metalness: 0.8,
    priceDelta: 25,
    spec: 'ALUMINIO 6063 ANODIZADO ELECTROQUÍMICO',
  },
  sage: {
    id: 'sage',
    name: 'OLIVA SAGE',
    colorHex: '#475143',
    roughness: 0.38,
    metalness: 0.55,
    priceDelta: 20,
    spec: 'ALUMINIO 6063 CERAKOTE TÁCTICO MATE',
  },
  cobre: {
    id: 'cobre',
    name: 'COBRE ROSE',
    colorHex: '#B87355',
    roughness: 0.22,
    metalness: 0.92,
    priceDelta: 30,
    spec: 'ALUMINIO 6063 PVD COBRE CEPILLADO',
  },
  borgona: {
    id: 'borgona',
    name: 'BORGOÑA',
    colorHex: '#521B26',
    roughness: 0.25,
    metalness: 0.8,
    priceDelta: 25,
    spec: 'ALUMINIO 6063 ANODIZADO CARMESÍ IMPERIAL',
  },
  ewhite: {
    id: 'ewhite',
    name: 'E-WHITE',
    colorHex: '#ECEEF1',
    roughness: 0.3,
    metalness: 0.18,
    priceDelta: 25,
    spec: 'RECUBRIMIENTO ELECTROFORÉTICO PURO',
  },
  titanio: {
    id: 'titanio',
    name: 'TITANIO',
    colorHex: '#5E646E',
    roughness: 0.28,
    metalness: 0.88,
    priceDelta: 20,
    spec: 'MICRO-SANDBLASTING GUNMETAL AEROESPACIAL',
  },
};

export const SWITCH_OPTIONS = {
  tactil: {
    id: 'tactil',
    name: 'TÁCTIL',
    brandLabel: 'HOLY PANDA',
    tag: 'HEXA YELLOW 55G',
    stemColor: '#EAB308',
    priceDelta: 0,
    feel: 'Bump perceptible, retorno nítido',
    frequency: '800 Hz',
    force: '55 cN',
    travel: '3.5 mm',
  },
  lineal: {
    id: 'lineal',
    name: 'LINEAL',
    brandLabel: 'GATERON',
    tag: 'HEXA RED 45G',
    stemColor: '#EF4444',
    priceDelta: 0,
    feel: 'Suave, silencioso, thock profundo',
    frequency: '400 Hz',
    force: '45 cN',
    travel: '3.8 mm',
  },
  clicky: {
    id: 'clicky',
    name: 'CLICKY',
    brandLabel: 'BOX JADE',
    tag: 'HEXA BLUE 50G',
    stemColor: '#3B82F6',
    priceDelta: 5,
    feel: 'Respuesta acústica nítida',
    frequency: '1200 Hz',
    force: '50 cN',
    travel: '3.6 mm',
  },
};

export const KNOB_OPTIONS = {
  aluminio: {
    id: 'aluminio',
    name: 'ALUMINIO PULIDO',
    colorHex: '#E2E4E8',
    metalness: 0.9,
    roughness: 0.15,
    priceDelta: 0,
    spec: 'ALUMINIO AERONÁUTICO PULIDO A ESPEJO',
  },
  grafito: {
    id: 'grafito',
    name: 'GRAFITO CNC',
    colorHex: '#2B2F36',
    metalness: 0.75,
    roughness: 0.35,
    priceDelta: 8,
    spec: 'ALUMINIO CNC ANODIZADO MATE',
  },
  cobalto: {
    id: 'cobalto',
    name: 'COBALTO ANODIZADO',
    colorHex: '#1E40AF',
    metalness: 0.85,
    roughness: 0.2,
    priceDelta: 10,
    spec: 'COBALTO DEEP BLUE ELECTROQUÍMICO',
  },
  laton: {
    id: 'laton',
    name: 'LATÓN DORADO',
    colorHex: '#D4AF37',
    metalness: 0.95,
    roughness: 0.18,
    priceDelta: 15,
    spec: 'LATÓN MACIZO PULIDO PVD GOLD',
  },
  cobre: {
    id: 'cobre',
    name: 'COBRE ROSA',
    colorHex: '#C87A5B',
    metalness: 0.92,
    roughness: 0.2,
    priceDelta: 15,
    spec: 'COBRE PURO CEPILLADO PVD ROSE',
  },
  carmesi: {
    id: 'carmesi',
    name: 'ROJO CARMESÍ',
    colorHex: '#991B1B',
    metalness: 0.8,
    roughness: 0.22,
    priceDelta: 10,
    spec: 'ANODIZADO RACING CRIMSON RED',
  },
  oliva: {
    id: 'oliva',
    name: 'VERDE SAGE',
    colorHex: '#3D473C',
    metalness: 0.6,
    roughness: 0.32,
    priceDelta: 10,
    spec: 'CERAKOTE TÁCTICO VERDE OLIVA',
  },
  ewhite: {
    id: 'ewhite',
    name: 'E-WHITE PURO',
    colorHex: '#F1F3F5',
    metalness: 0.2,
    roughness: 0.25,
    priceDelta: 12,
    spec: 'BLANCO ELECTROFORÉTICO ULTRA-MATE',
  },
};

export const KEYCAP_OPTIONS = {
  chalk: {
    id: 'chalk',
    name: 'CHALK CLÁSICO',
    alphaColor: '#F4F4F6',
    modColor: '#94A3B8',
    accentColor: '#1E40AF',
    priceDelta: 0,
    spec: 'PBT DOBLE INYECCIÓN PERFIL CHERRY',
  },
  stealth: {
    id: 'stealth',
    name: 'STEALTH CARBÓN',
    alphaColor: '#282C34',
    modColor: '#1A1D23',
    accentColor: '#EAB308',
    priceDelta: 15,
    spec: 'PBT DYE-SUB CON LEYENDAS STEALTH',
  },
  cobalto: {
    id: 'cobalto',
    name: 'CYBER COBALTO',
    alphaColor: '#1E3A8A',
    modColor: '#172554',
    accentColor: '#38BDF8',
    priceDelta: 20,
    spec: 'PBT ANODIZED BLUE DUAL-SHOT',
  },
  retro: {
    id: 'retro',
    name: 'RETRO INDUSTRIAL',
    alphaColor: '#E6DEC8',
    modColor: '#78716C',
    accentColor: '#DC2626',
    priceDelta: 10,
    spec: 'PBT VINTAGE 90S TEXTURADO',
  },
  botanica: {
    id: 'botanica',
    name: 'BOTÁNICA SAGE',
    alphaColor: '#E8EDE6',
    modColor: '#3E4D40',
    accentColor: '#22C55E',
    priceDelta: 15,
    spec: 'PBT FOREST BOTANICAL DUAL-SHOT',
  },
  lavanda: {
    id: 'lavanda',
    name: 'LAVANDA DREAM',
    alphaColor: '#FDF8FF',
    modColor: '#7C3AED',
    accentColor: '#EC4899',
    priceDelta: 18,
    spec: 'PBT PASTEL BLOSSOM DUAL-TONE',
  },
  borgona: {
    id: 'borgona',
    name: 'NOCHE BORGOÑA',
    alphaColor: '#3B1A24',
    modColor: '#1F0D13',
    accentColor: '#E11D48',
    priceDelta: 20,
    spec: 'PBT ROYAL CRIMSON CHERRY PROFILE',
  },
  dolch: {
    id: 'dolch',
    name: 'DOLCH STUDIO',
    alphaColor: '#525866',
    modColor: '#1E242E',
    accentColor: '#06B6D4',
    priceDelta: 15,
    spec: 'PBT DOLCH MONOCROMO STUDIO',
  },
};

export function CustomizerProvider({ children }) {
  const [baseKey, setBaseKey] = useState('plata');
  const [keycapKey, setKeycapKey] = useState('chalk');
  const [switchKey, setSwitchKey] = useState('tactil');
  const [knobKey, setKnobKey] = useState('aluminio');
  const [explodedOverride, setExplodedOverride] = useState(null);
  const scrollProgressRef = useRef(0);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [activeKeyPressed, setActiveKeyPressed] = useState(null);
  const [cartCount, setCartCount] = useState(1);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isFreeViewOpen, setIsFreeViewOpen] = useState(false);
  const [isPreloaderActive, setIsPreloaderActive] = useState(true);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [lastAudioTrigger, setLastAudioTrigger] = useState(Date.now());
  const [activeHotspot, setActiveHotspot] = useState('switches'); // 'base' | 'keycaps' | 'switches' | 'knob'

  const setScrollProgress = (val) => {
    scrollProgressRef.current = val;
  };

  // Scroll lock: freeze Lenis and body scroll when preloader or any modal is open
  useEffect(() => {
    if (isOrderModalOpen || isFreeViewOpen) {
      if (window.__lenis) window.__lenis.stop();
      document.body.style.overflow = 'hidden';
    } else if (isPreloaderActive) {
      // Freeze smooth scroll without altering body overflow to avoid sudden scrollbar layout shift
      if (window.__lenis) window.__lenis.stop();
    } else {
      if (window.__lenis) window.__lenis.start();
      document.body.style.overflow = '';
    }
    return () => {
      if (window.__lenis) window.__lenis.start();
      document.body.style.overflow = '';
    };
  }, [isOrderModalOpen, isFreeViewOpen, isPreloaderActive]);

  // Real physical keyboard listener with comprehensive edge-case protection
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (isOrderModalOpen) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) return;
      // Skip browser shortcuts with modifier keys (except single modifier press)
      if ((e.ctrlKey || e.metaKey || e.altKey) && !['Control', 'Alt', 'Meta', 'Shift'].includes(e.key)) return;

      const code = e.code;
      setActiveKeyPressed(code);

      const charVal = e.key ? e.key.charCodeAt(0) : 65;
      const pitchVar = 0.94 + (Math.abs(charVal) % 12) * 0.012;
      playSwitchSound(switchKey, pitchVar);
      setLastAudioTrigger(Date.now());

      setTimeout(() => {
        setActiveKeyPressed((curr) => (curr === code ? null : curr));
      }, 130);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [switchKey, isOrderModalOpen]);

  // Pricing calculation
  const basePrice = 189.0;
  const currentBase = BASE_OPTIONS[baseKey];
  const currentKeycaps = KEYCAP_OPTIONS[keycapKey];
  const currentSwitch = SWITCH_OPTIONS[switchKey];
  const currentKnob = KNOB_OPTIONS[knobKey];

  const totalPrice =
    basePrice +
    currentBase.priceDelta +
    currentKeycaps.priceDelta +
    currentSwitch.priceDelta +
    currentKnob.priceDelta;

  const isExplodedActive =
    explodedOverride !== null ? explodedOverride : scrollProgressRef.current > 0.4;

  const toggleExplodedView = () => {
    setExplodedOverride((prev) => {
      if (prev === false) return true;
      if (prev === true) return false;
      return scrollProgressRef.current > 0.4 ? false : true;
    });
  };

  const handleSetBaseKey = (key) => {
    setBaseKey(key);
  };

  const handleSetKeycapKey = (key) => {
    setKeycapKey(key);
  };

  const handleSetKnobKey = (key) => {
    setKnobKey(key);
  };

  const handleSetSwitchKey = (key) => {
    setSwitchKey(key);
  };

  const triggerSound = () => {
    playSwitchSound(switchKey);
    setLastAudioTrigger(Date.now());
  };

  return (
    <CustomizerContext.Provider
      value={{
        baseKey,
        setBaseKey: handleSetBaseKey,
        currentBase,
        keycapKey,
        setKeycapKey: handleSetKeycapKey,
        currentKeycaps,
        KEYCAP_OPTIONS,
        switchKey,
        setSwitchKey: handleSetSwitchKey,
        currentSwitch,
        knobKey,
        setKnobKey: handleSetKnobKey,
        currentKnob,
        explodedView: isExplodedActive,
        explodedOverride,
        setExplodedOverride,
        toggleExplodedView,
        scrollProgressRef,
        scrollProgress: scrollProgressRef.current,
        setScrollProgress,
        isNavHidden,
        setIsNavHidden,
        activeKeyPressed,
        setActiveKeyPressed,
        cartCount,
        setCartCount,
        isOrderModalOpen,
        setIsOrderModalOpen,
        isFreeViewOpen,
        setIsFreeViewOpen,
        isPreloaderActive,
        setIsPreloaderActive,
        isSceneReady,
        setIsSceneReady,
        totalPrice,
        triggerSound,
        lastAudioTrigger,
        activeHotspot,
        setActiveHotspot,
      }}
    >
      {children}
    </CustomizerContext.Provider>
  );
}

export function useCustomizer() {
  const context = useContext(CustomizerContext);
  if (!context) {
    throw new Error('useCustomizer must be used within a CustomizerProvider');
  }
  return context;
}
