import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { toCreasedNormals } from 'three-stdlib';
import { playSwitchSound } from '../../utils/soundEngine';
import {
  useCustomizer,
  BASE_OPTIONS,
  SWITCH_OPTIONS,
  KNOB_OPTIONS,
  KEYCAP_OPTIONS,
} from '../../context/CustomizerContext';

// 75% Mechanical Keyboard Layout Specification
const KEYBOARD_LAYOUT = [
  // Function Row (Z: -1.25)
  [
    { id: 'Escape', code: 'Escape', label: 'Esc', w: 1, type: 'accent' },
    { id: 'F1', code: 'F1', label: 'F1', w: 1, type: 'mod' },
    { id: 'F2', code: 'F2', label: 'F2', w: 1, type: 'mod' },
    { id: 'F3', code: 'F3', label: 'F3', w: 1, type: 'mod' },
    { id: 'F4', code: 'F4', label: 'F4', w: 1, type: 'mod' },
    { id: 'F5', code: 'F5', label: 'F5', w: 1, type: 'mod' },
    { id: 'F6', code: 'F6', label: 'F6', w: 1, type: 'mod' },
    { id: 'F7', code: 'F7', label: 'F7', w: 1, type: 'mod' },
    { id: 'F8', code: 'F8', label: 'F8', w: 1, type: 'mod' },
    { id: 'F9', code: 'F9', label: 'F9', w: 1, type: 'mod' },
    { id: 'F10', code: 'F10', label: 'F10', w: 1, type: 'mod' },
    { id: 'F11', code: 'F11', label: 'F11', w: 1, type: 'mod' },
    { id: 'F12', code: 'F12', label: 'F12', w: 1, type: 'mod' },
    { id: 'Delete', code: 'Delete', label: 'Del', w: 1, type: 'mod' },
  ],
  // Number Row (Z: -0.73)
  [
    { id: 'Backquote', code: 'Backquote', label: '~', w: 1, type: 'alpha' },
    { id: 'Digit1', code: 'Digit1', label: '1', w: 1, type: 'alpha' },
    { id: 'Digit2', code: 'Digit2', label: '2', w: 1, type: 'alpha' },
    { id: 'Digit3', code: 'Digit3', label: '3', w: 1, type: 'alpha' },
    { id: 'Digit4', code: 'Digit4', label: '4', w: 1, type: 'alpha' },
    { id: 'Digit5', code: 'Digit5', label: '5', w: 1, type: 'alpha' },
    { id: 'Digit6', code: 'Digit6', label: '6', w: 1, type: 'alpha' },
    { id: 'Digit7', code: 'Digit7', label: '7', w: 1, type: 'alpha' },
    { id: 'Digit8', code: 'Digit8', label: '8', w: 1, type: 'alpha' },
    { id: 'Digit9', code: 'Digit9', label: '9', w: 1, type: 'alpha' },
    { id: 'Digit0', code: 'Digit0', label: '0', w: 1, type: 'alpha' },
    { id: 'Minus', code: 'Minus', label: '-', w: 1, type: 'alpha' },
    { id: 'Equal', code: 'Equal', label: '+', w: 1, type: 'alpha' },
    { id: 'Backspace', code: 'Backspace', label: '←', w: 1.6, type: 'mod' },
    { id: 'Home', code: 'Home', label: 'Home', w: 1, type: 'mod' },
  ],
  // QWERTY Row (Z: -0.21)
  [
    { id: 'Tab', code: 'Tab', label: 'Tab', w: 1.4, type: 'mod' },
    { id: 'KeyQ', code: 'KeyQ', label: 'Q', w: 1, type: 'alpha' },
    { id: 'KeyW', code: 'KeyW', label: 'W', w: 1, type: 'alpha' },
    { id: 'KeyE', code: 'KeyE', label: 'E', w: 1, type: 'alpha' },
    { id: 'KeyR', code: 'KeyR', label: 'R', w: 1, type: 'alpha' },
    { id: 'KeyT', code: 'KeyT', label: 'T', w: 1, type: 'alpha' },
    { id: 'KeyY', code: 'KeyY', label: 'Y', w: 1, type: 'alpha' },
    { id: 'KeyU', code: 'KeyU', label: 'U', w: 1, type: 'alpha' },
    { id: 'KeyI', code: 'KeyI', label: 'I', w: 1, type: 'alpha' },
    { id: 'KeyO', code: 'KeyO', label: 'O', w: 1, type: 'alpha' },
    { id: 'KeyP', code: 'KeyP', label: 'P', w: 1, type: 'alpha' },
    { id: 'BracketLeft', code: 'BracketLeft', label: '{', w: 1, type: 'alpha' },
    { id: 'BracketRight', code: 'BracketRight', label: '}', w: 1, type: 'alpha' },
    { id: 'Backslash', code: 'Backslash', label: '|', w: 1.2, type: 'alpha' },
    { id: 'PageUp', code: 'PageUp', label: 'PgUp', w: 1, type: 'mod' },
  ],
  // ASDF Row (Z: 0.31)
  [
    { id: 'CapsLock', code: 'CapsLock', label: 'Caps', w: 1.6, type: 'mod' },
    { id: 'KeyA', code: 'KeyA', label: 'A', w: 1, type: 'alpha' },
    { id: 'KeyS', code: 'KeyS', label: 'S', w: 1, type: 'alpha' },
    { id: 'KeyD', code: 'KeyD', label: 'D', w: 1, type: 'alpha' },
    { id: 'KeyF', code: 'KeyF', label: 'F', w: 1, type: 'alpha' },
    { id: 'KeyG', code: 'KeyG', label: 'G', w: 1, type: 'alpha' },
    { id: 'KeyH', code: 'KeyH', label: 'H', w: 1, type: 'alpha' },
    { id: 'KeyJ', code: 'KeyJ', label: 'J', w: 1, type: 'alpha' },
    { id: 'KeyK', code: 'KeyK', label: 'K', w: 1, type: 'alpha' },
    { id: 'KeyL', code: 'KeyL', label: 'L', w: 1, type: 'alpha' },
    { id: 'Semicolon', code: 'Semicolon', label: ';', w: 1, type: 'alpha' },
    { id: 'Quote', code: 'Quote', label: '\'', w: 1, type: 'alpha' },
    { id: 'Enter', code: 'Enter', label: 'Enter ↵', w: 2.0, type: 'accent' },
    { id: 'PageDown', code: 'PageDown', label: 'PgDn', w: 1, type: 'mod' },
  ],
  // ZXCV Row (Z: 0.83)
  [
    { id: 'ShiftLeft', code: 'ShiftLeft', label: 'Shift', w: 2.1, type: 'mod' },
    { id: 'KeyZ', code: 'KeyZ', label: 'Z', w: 1, type: 'alpha' },
    { id: 'KeyX', code: 'KeyX', label: 'X', w: 1, type: 'alpha' },
    { id: 'KeyC', code: 'KeyC', label: 'C', w: 1, type: 'alpha' },
    { id: 'KeyV', code: 'KeyV', label: 'V', w: 1, type: 'alpha' },
    { id: 'KeyB', code: 'KeyB', label: 'B', w: 1, type: 'alpha' },
    { id: 'KeyN', code: 'KeyN', label: 'N', w: 1, type: 'alpha' },
    { id: 'KeyM', code: 'KeyM', label: 'M', w: 1, type: 'alpha' },
    { id: 'Comma', code: 'Comma', label: '<', w: 1, type: 'alpha' },
    { id: 'Period', code: 'Period', label: '>', w: 1, type: 'alpha' },
    { id: 'Slash', code: 'Slash', label: '?', w: 1, type: 'alpha' },
    { id: 'ShiftRight', code: 'ShiftRight', label: 'Shift', w: 1.5, type: 'mod' },
    { id: 'ArrowUp', code: 'ArrowUp', label: '↑', w: 1, type: 'accent' },
    { id: 'End', code: 'End', label: 'End', w: 1, type: 'mod' },
  ],
  // Bottom Row (Z: 1.35)
  [
    { id: 'ControlLeft', code: 'ControlLeft', label: 'Ctrl', w: 1.2, type: 'mod' },
    { id: 'MetaLeft', code: 'MetaLeft', label: 'Win', w: 1.1, type: 'mod' },
    { id: 'AltLeft', code: 'AltLeft', label: 'Alt', w: 1.2, type: 'mod' },
    { id: 'Space', code: 'Space', label: '', w: 5.8, type: 'alpha' },
    { id: 'AltRight', code: 'AltRight', label: 'Alt', w: 1.1, type: 'mod' },
    { id: 'Fn', code: 'Fn', label: 'Fn', w: 1.1, type: 'mod' },
    { id: 'ArrowLeft', code: 'ArrowLeft', label: '←', w: 1, type: 'accent' },
    { id: 'ArrowDown', code: 'ArrowDown', label: '↓', w: 1, type: 'accent' },
    { id: 'ArrowRight', code: 'ArrowRight', label: '→', w: 1, type: 'accent' },
  ],
];

// High-Resolution Texture Cache for Crisp Silkscreen Keycap Legends
const keycapTextureCache = new Map();

// Shared geometries and materials for switch assemblies (reused across all 68 switches)
const SWITCH_HOUSING_GEO = new THREE.BoxGeometry(0.35, 0.16, 0.35);
const SWITCH_STEM_GEO = new THREE.BoxGeometry(0.13, 0.14, 0.13);
const SWITCH_CONTACT_GEO = new THREE.BoxGeometry(0.02, 0.08, 0.06);

const SWITCH_HOUSING_MAT = new THREE.MeshStandardMaterial({
  color: '#272A30',
  transparent: true,
  opacity: 0.88,
  roughness: 0.25,
  metalness: 0.1,
});

const SWITCH_CONTACT_MAT = new THREE.MeshStandardMaterial({
  color: '#EAB308',
  metalness: 0.95,
  roughness: 0.15,
});

function getContrastColor(hexColor) {
  if (!hexColor) return '#121316';
  const cleanHex = hexColor.replace('#', '');
  if (cleanHex.length !== 6) return '#121316';
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 135 ? '#121316' : '#FFFFFF';
}

function getKeycapTexture(label, type, w, hexBgColor) {
  if (!label) return null;
  const isDark = getContrastColor(hexBgColor) === '#FFFFFF';
  const cacheKey = `${label}_${w}_${isDark ? 'd' : 'l'}`;
  if (keycapTextureCache.has(cacheKey)) {
    return keycapTextureCache.get(cacheKey);
  }

  const canvas = document.createElement('canvas');
  const baseSize = 128;
  canvas.width = Math.round(baseSize * (w > 1.2 ? Math.min(2.5, w * 0.9) : 1));
  canvas.height = baseSize;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const textColor = isDark ? '#FFFFFF' : '#121316';

  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let fontSize = 36;
  if (label.length > 5) fontSize = 21;
  else if (label.length > 3) fontSize = 26;
  else if (label.length > 1) fontSize = 30;

  ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;
  ctx.fillText(label, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  keycapTextureCache.set(cacheKey, texture);
  return texture;
}

const KEYCAP_GEO_CACHE = new Map();
const LEGEND_GEO_CACHE = new Map();
const keycapMaterialCache = new Map();
const eps = 1e-5;

function createShape(width, height, radius) {
  const shape = new THREE.Shape();
  const a = radius - eps;
  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
  shape.absarc(eps, height - 2 * a, eps, Math.PI, Math.PI / 2, true);
  shape.absarc(width - 2 * a, height - 2 * a, eps, Math.PI / 2, 0, true);
  shape.absarc(width - 2 * a, eps, eps, 0, -Math.PI / 2, true);
  return shape;
}

function getKeycapGeometry(w) {
  const key = Math.round(w * 100);
  if (KEYCAP_GEO_CACHE.has(key)) {
    return KEYCAP_GEO_CACHE.get(key);
  }
  const width = w * 0.44;
  const height = 0.22;
  const depth = 0.44;
  const radius = 0.042;
  const shape = createShape(width, height, radius);
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: depth - radius * 2,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: radius - eps,
    bevelThickness: radius,
    curveSegments: 3,
  });
  geom.center();
  toCreasedNormals(geom, 0.4);
  KEYCAP_GEO_CACHE.set(key, geom);
  return geom;
}

function getLegendGeometry(w) {
  const key = Math.round(w * 100);
  if (LEGEND_GEO_CACHE.has(key)) {
    return LEGEND_GEO_CACHE.get(key);
  }
  const width = w * 0.44;
  const depth = 0.44;
  const geom = new THREE.PlaneGeometry(width * 0.88, depth * 0.88);
  LEGEND_GEO_CACHE.set(key, geom);
  return geom;
}

function getKeycapLegendMaterial(item, hexBgColor) {
  if (!item.label) return null;
  const isDark = getContrastColor(hexBgColor) === '#FFFFFF';
  const cacheKey = `${item.label}_${item.w}_${isDark ? 'd' : 'l'}`;
  if (keycapMaterialCache.has(cacheKey)) {
    return keycapMaterialCache.get(cacheKey);
  }
  const texture = getKeycapTexture(item.label, item.type, item.w, hexBgColor);
  if (!texture) return null;
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  });
  keycapMaterialCache.set(cacheKey, mat);
  return mat;
}

// Single 3D Keycap Component with Dynamic PBT Theme (Zero per-key useFrame loops & 100% shared GPU buffers)
const Keycap = React.memo(function Keycap({
  item,
  x,
  z,
  keycapMaterial,
  stemMaterial,
  legendMaterial,
  onPress,
  setMeshRef,
}) {
  const keycapGeo = useMemo(() => getKeycapGeometry(item.w), [item.w]);
  const legendGeo = useMemo(() => (item.label ? getLegendGeometry(item.w) : null), [item.w, item.label]);

  const handlePointerDown = (e) => {
    e.stopPropagation();
    onPress(item.code);
  };

  return (
    <group position={[x, 0, z]}>
      {/* Switch housing beneath keycap - 100% shared static geometries & materials */}
      <group position={[0, -0.08, 0]}>
        <mesh position={[0, 0, 0]} geometry={SWITCH_HOUSING_GEO} material={SWITCH_HOUSING_MAT} />
        <mesh position={[0, 0.065, 0]} geometry={SWITCH_STEM_GEO} material={stemMaterial} />
        <mesh position={[0.08, 0.02, 0]} geometry={SWITCH_CONTACT_GEO} material={SWITCH_CONTACT_MAT} />
      </group>

      {/* Animated Keycap with Printed Legend */}
      <group
        ref={(el) => setMeshRef(item.code, el)}
        onPointerDown={handlePointerDown}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'auto';
        }}
      >
        <mesh
          geometry={keycapGeo}
          material={keycapMaterial}
          position={[0, 0.09, 0]}
          onPointerDown={handlePointerDown}
        />

        {item.label && legendMaterial && (
          <mesh
            geometry={legendGeo}
            material={legendMaterial}
            position={[0, 0.202, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            onPointerDown={handlePointerDown}
          />
        )}
      </group>
    </group>
  );
});

// Precision Torx Screw Head Component
function TorxScrew({ position }) {
  return (
    <group position={position}>
      <Cylinder args={[0.09, 0.08, 0.04, 16]}>
        <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.15} />
      </Cylinder>
      <Cylinder args={[0.045, 0.045, 0.05, 6]} position={[0, 0.015, 0]}>
        <meshStandardMaterial color="#1E2024" metalness={0.6} roughness={0.3} />
      </Cylinder>
    </group>
  );
}

// Precision Stabilizer Wire & Housing
function MechanicalStabilizer({ width = 2.4, position }) {
  return (
    <group position={position}>
      <mesh position={[0, -0.04, 0.12]}>
        <boxGeometry args={[width, 0.03, 0.03]} />
        <meshStandardMaterial color="#D1D5DB" metalness={0.95} roughness={0.12} />
      </mesh>
      <mesh position={[-width / 2 + 0.1, -0.02, 0.12]}>
        <boxGeometry args={[0.16, 0.14, 0.16]} />
        <meshStandardMaterial color="#1E2024" roughness={0.35} />
      </mesh>
      <mesh position={[width / 2 - 0.1, -0.02, 0.12]}>
        <boxGeometry args={[0.16, 0.14, 0.16]} />
        <meshStandardMaterial color="#1E2024" roughness={0.35} />
      </mesh>
    </group>
  );
}

// Helper smoothstep function for clean phase transitions
function smoothInterval(val, min, max) {
  if (val <= min) return 0;
  if (val >= max) return 1;
  const t = (val - min) / (max - min);
  return t * t * (3 - 2 * t);
}

export default function ProceduralKeyboard3D({
  showHeroLabels = false,
  showConfigLabels = false,
  isHeroMode = false,
  assembledMode = false,
}) {
  const {
    baseKey,
    setBaseKey,
    currentBase,
    keycapKey,
    setKeycapKey,
    currentKeycaps,
    KEYCAP_OPTIONS,
    switchKey,
    setSwitchKey,
    currentSwitch,
    knobKey,
    setKnobKey,
    currentKnob,
    explodedView,
    explodedOverride,
    scrollProgressRef,
    activeKeyPressed,
    setActiveKeyPressed,
    triggerSound,
    activeHotspot,
    setActiveHotspot,
    setIsSceneReady,
  } = useCustomizer();

  const { size } = useThree();
  const isMobile = size.width < 768;
  const isSmallMobile = size.width < 440;

  const rootGroup = useRef();
  const baseGroup = useRef();
  const switchesGroup = useRef();
  const keycapsGroup = useRef();
  const knobGroup = useRef();

  const keyMeshMap = useRef(new Map());
  const activeKeyAnim = useRef({ code: null, y: 0 });

  const setKeyMeshRef = useCallback((code, el) => {
    if (el) keyMeshMap.current.set(code, el);
    else keyMeshMap.current.delete(code);
  }, []);

  const keycapMaterials = useMemo(() => {
    return {
      alpha: new THREE.MeshPhysicalMaterial({
        color: currentKeycaps?.alphaColor || '#F4F4F6',
        roughness: 0.38,
        metalness: 0.04,
        clearcoat: 0.1,
        clearcoatRoughness: 0.15,
      }),
      mod: new THREE.MeshPhysicalMaterial({
        color: currentKeycaps?.modColor || '#94A3B8',
        roughness: 0.42,
        metalness: 0.04,
        clearcoat: 0.1,
        clearcoatRoughness: 0.15,
      }),
      accent: new THREE.MeshPhysicalMaterial({
        color: currentKeycaps?.accentColor || '#1E40AF',
        roughness: 0.28,
        metalness: 0.04,
        clearcoat: 0.25,
        clearcoatRoughness: 0.15,
      }),
      stem: new THREE.MeshStandardMaterial({
        color: currentSwitch?.stemColor || '#EAB308',
        roughness: 0.25,
        metalness: 0.08,
      }),
    };
  }, [currentKeycaps, currentSwitch]);

  useEffect(() => {
    return () => {
      keycapMaterials.alpha.dispose();
      keycapMaterials.mod.dispose();
      keycapMaterials.accent.dispose();
      keycapMaterials.stem.dispose();
    };
  }, [keycapMaterials]);

  const currentScrollAnim = useRef(0);
  const currentExploded = useRef(0);
  const currentRotX = useRef(0.48);
  const currentRotY = useRef(-0.46);
  const currentRotZ = useRef(0.11);
  const currentPosX = useRef(0);
  const currentPosY = useRef(-0.02);
  const currentScale = useRef(0.76);
  const sceneReadyRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (setIsSceneReady) setIsSceneReady(true);
    }, 120);
    return () => clearTimeout(timer);
  }, [setIsSceneReady]);

  useFrame((_, delta) => {
    if (!sceneReadyRef.current) {
      sceneReadyRef.current = true;
      if (setIsSceneReady) setIsSceneReady(true);
    }
    // Consolidated keypress depression damping (zero per-key useFrame hooks)
    if (activeKeyPressed || activeKeyAnim.current.y < -0.001) {
      const targetY = activeKeyPressed ? -0.14 : 0;
      activeKeyAnim.current.y = THREE.MathUtils.damp(activeKeyAnim.current.y, targetY, 28, delta);
      const code = activeKeyPressed || activeKeyAnim.current.code;
      if (code && keyMeshMap.current.has(code)) {
        keyMeshMap.current.get(code).position.y = activeKeyAnim.current.y;
      }
      if (activeKeyPressed) {
        activeKeyAnim.current.code = activeKeyPressed;
      }
    } else if (activeKeyAnim.current.code) {
      if (keyMeshMap.current.has(activeKeyAnim.current.code)) {
        keyMeshMap.current.get(activeKeyAnim.current.code).position.y = 0;
      }
      activeKeyAnim.current.code = null;
      activeKeyAnim.current.y = 0;
    }

    // In assembled inspection mode, keep keyboard locked at center with zero exploded displacement
    if (assembledMode) {
      if (rootGroup.current) {
        const assembledScale = isSmallMobile ? 0.38 : isMobile ? 0.46 : 0.95;
        rootGroup.current.position.set(0, 0, 0);
        rootGroup.current.rotation.set(0.18, 0, 0);
        rootGroup.current.scale.set(assembledScale, assembledScale, assembledScale);
      }
      if (baseGroup.current) {
        baseGroup.current.position.set(0, 0, 0);
        baseGroup.current.rotation.set(0, 0, 0);
      }
      if (switchesGroup.current) switchesGroup.current.position.set(0, 0, 0);
      if (keycapsGroup.current) keycapsGroup.current.position.set(0, 0, 0);
      if (knobGroup.current) {
        knobGroup.current.position.set(3.65, 0.12, -1.25);
        knobGroup.current.rotation.set(0, 0, 0);
      }
      return;
    }

    // Read scroll progress directly from ref (zero React re-renders on scroll)
    const progress = scrollProgressRef?.current ?? 0;

    // Staggered Cinematic Disassembly Sequence normalized across scroll (docking by progress ~ 0.92)
    const scrollMap = THREE.MathUtils.clamp((progress - 0.02) / 0.90, 0, 1);

    // Channel 1: Spatial Progress (always driven continuously by scroll, never frozen by override)
    // Silky smooth damping: lambda = 8.5 preserves the original majestic, unaccelerated keyboard descent
    currentScrollAnim.current = THREE.MathUtils.damp(
      currentScrollAnim.current,
      scrollMap,
      8.5,
      delta
    );
    const sScroll = currentScrollAnim.current;

    // Channel 2: Physical Layer Elevation (Keycaps, Switches, Chassis, Knob)
    // Only allow manual layer override when docked in the configurator (progress >= 0.70)
    const isManualOverride = explodedOverride !== null && progress >= 0.70;
    const targetExploded =
      progress < 0.04
        ? 0.0
        : isManualOverride
          ? (explodedOverride ? 1.0 : 0.0)
          : sScroll;

    currentExploded.current = THREE.MathUtils.damp(
      currentExploded.current,
      targetExploded,
      8.5,
      delta
    );

    const sLayers = currentExploded.current;

    // Staggered Layer Phase Curves (zero-gravity expansion during orbit):
    // 1. Keycaps & Rotary Knob lift first (Phase 1: sLayers 0.04 -> 0.44)
    const pKeycaps = smoothInterval(sLayers, 0.04, 0.44);
    const pKnob = smoothInterval(sLayers, 0.04, 0.44);

    // 2. Switches Plate FR4 & Gaskets extract second (Phase 2: sLayers 0.16 -> 0.64)
    const pSwitches = smoothInterval(sLayers, 0.16, 0.64);

    // 3. CNC Aluminum Chassis drops deeply and tilts (Phase 3: sLayers 0.28 -> 0.86)
    const pBase = smoothInterval(sLayers, 0.28, 0.86);

    // 4. Cinematic 360° Orbital Turn (starts at Hero angle, completes full orbit in center):
    const pOrbit = smoothInterval(sScroll, 0.04, 0.76);
    const targetRotY = -0.46 + pOrbit * Math.PI * 2;

    // Pitch tilt during orbit so the bottom chassis & brass weight face camera cleanly at 180°:
    const backsideTilt = Math.sin(pOrbit * Math.PI) * 0.88;
    const pDockRot = smoothInterval(sScroll, 0.65, 0.96);
    const targetRotX = 0.48 - backsideTilt + pDockRot * 0.04;
    const targetRotZ = THREE.MathUtils.lerp(0.11, 0.12, pDockRot);

    // 5. Lateral Pan towards left column for configurator docking (perfect lockstep with UI glide):
    const pPan = smoothInterval(sScroll, 0.65, 0.96);

    // Responsive scaling:
    // Keyboard native width is ~8.5 units in 3D space.
    // On mobile portrait (aspect ~0.46, width ~3.28 units), scale ~0.30 fits the entire 8.5 unit model with safety padding
    const mobileScale = isSmallMobile
      ? THREE.MathUtils.lerp(0.29, 0.33, pPan)
      : THREE.MathUtils.lerp(0.36, 0.42, pPan);
    const desktopScale = THREE.MathUtils.lerp(0.76, 0.84, pPan);
    const targetScale = isMobile ? mobileScale : desktopScale;

    // Responsive positioning:
    // On desktop:
    //   Hero: x = 0, y = -0.02
    //   Docked: x = -0.65, y = -0.36 (panned left to leave room for right sidebar)
    // On mobile:
    //   Hero: x = -0.06 (compensates -26° Y rotation bias), y = 0.20 (centered between navbar & hero text)
    //   Docked: x = 0, y = 1.05 (raised into upper 40% of viewport, leaving bottom 60% entirely free for customizer)
    const targetPosX = isMobile
      ? (isSmallMobile ? THREE.MathUtils.lerp(-0.06, 0.0, pPan) : 0.0)
      : THREE.MathUtils.lerp(0.0, -0.65, pPan);
    const targetPosY = isMobile
      ? THREE.MathUtils.lerp(0.20, 1.05, pPan)
      : THREE.MathUtils.lerp(-0.02, -0.36, pPan);

    if (rootGroup.current) {
      rootGroup.current.rotation.x = targetRotX;
      rootGroup.current.rotation.y = targetRotY;
      rootGroup.current.rotation.z = targetRotZ;
      rootGroup.current.position.x = targetPosX;
      rootGroup.current.position.y = targetPosY;
      rootGroup.current.scale.set(targetScale, targetScale, targetScale);
    }

    // Layer 1: Base drops down deeply and tilts with dramatic angle
    if (baseGroup.current) {
      baseGroup.current.position.y = -pBase * 1.85;
      baseGroup.current.position.z = pBase * 0.60;
      baseGroup.current.rotation.x = -pBase * 0.16;
    }

    // Layer 2: Switches and PCB middle level float into view
    if (switchesGroup.current) {
      switchesGroup.current.position.y = pSwitches * 0.52;
    }

    // Layer 3: Keycaps group ascends with high levitation clearance
    if (keycapsGroup.current) {
      keycapsGroup.current.position.y = pKeycaps * 1.85;
    }

    // Layer 4: Rotary Knob elevates vertically without rotating (hotspot stays perfectly static)
    if (knobGroup.current) {
      knobGroup.current.position.y = pKnob * 2.25;
      knobGroup.current.rotation.y = 0;
    }
  });

  const computedKeyLayout = useMemo(() => {
    const rows = [];
    const rowSpacing = 0.52;
    const startZ = -1.25;

    KEYBOARD_LAYOUT.forEach((row, rowIndex) => {
      let currentX = -3.72;
      const z = startZ + rowIndex * rowSpacing;

      row.forEach((key) => {
        const keyW = key.w * 0.44;
        const x = currentX + keyW / 2;
        currentX += keyW + 0.06;

        rows.push({
          ...key,
          x,
          z,
        });
      });
    });

    return rows;
  }, []);

  const handleKeyClick = useCallback((code) => {
    setActiveKeyPressed(code);
    const codeHash = (code || 'KeyA').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const pitchVar = 0.94 + (codeHash % 12) * 0.012;
    playSwitchSound(switchKey, pitchVar);
    setTimeout(() => {
      setActiveKeyPressed((curr) => (curr === code ? null : curr));
    }, 140);
  }, [switchKey, setActiveKeyPressed]);

  return (
    <group ref={rootGroup} scale={[1.15, 1.15, 1.15]} position={[0, -0.2, 0]}>
      {/* =========================================================================
          CAPA 1: Base Inferior y Chasis de Aluminio CNC (baseGroup)
          ========================================================================= */}
      <group ref={baseGroup}>
        <RoundedBox
          args={[8.5, 0.52, 3.85]}
          radius={0.14}
          smoothness={6}
          position={[0, -0.32, 0.1]}
        >
          <meshPhysicalMaterial
            color={currentBase.colorHex}
            roughness={currentBase.roughness}
            metalness={currentBase.metalness}
            clearcoat={0.35}
            clearcoatRoughness={0.12}
            reflectivity={0.85}
          />
        </RoundedBox>

        <mesh position={[0, -0.56, 0.1]}>
          <boxGeometry args={[8.3, 0.06, 3.65]} />
          <meshPhysicalMaterial
            color={currentBase.colorHex}
            roughness={currentBase.roughness + 0.05}
            metalness={currentBase.metalness}
          />
        </mesh>

        <mesh position={[0, -0.15, 0.1]}>
          <boxGeometry args={[8.12, 0.22, 3.48]} />
          <meshStandardMaterial
            color="#181A1E"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>

        {[
          [-4.0, -0.06, 0.1],
          [4.0, -0.06, 0.1],
          [-4.0, -0.06, -1.65],
          [4.0, -0.06, -1.65],
          [0, -0.06, -1.7],
          [0, -0.06, 1.88],
        ].map((pos, idx) => (
          <TorxScrew key={idx} position={pos} />
        ))}

        <group position={[0, -0.28, -1.86]}>
          <RoundedBox args={[2.4, 0.24, 0.07]} radius={0.03} smoothness={3}>
            <meshPhysicalMaterial
              color="#B89758"
              metalness={0.92}
              roughness={0.18}
              clearcoat={0.3}
            />
          </RoundedBox>
          <mesh position={[0, 0, -0.025]}>
            <boxGeometry args={[0.56, 0.13, 0.05]} />
            <meshStandardMaterial color="#0A0B0D" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, -0.02]}>
            <boxGeometry args={[0.36, 0.025, 0.04]} />
            <meshStandardMaterial color="#D1D5DB" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>

        {[
          [-3.7, 1.65],
          [3.7, 1.65],
          [-3.7, -1.45],
          [3.7, -1.45],
        ].map(([fx, fz], idx) => (
          <mesh key={idx} position={[fx, -0.6, fz]}>
            <boxGeometry args={[0.65, 0.05, 0.32]} />
            <meshStandardMaterial color="#111215" roughness={0.95} />
          </mesh>
        ))}
      </group>

      {/* =========================================================================
          CAPA 2: Placa Switch Plate FR4 + Gaskets + Switches Mecánicos (switchesGroup)
          ========================================================================= */}
      <group ref={switchesGroup}>
        <RoundedBox
          args={[8.02, 0.06, 3.4]}
          radius={0.03}
          smoothness={3}
          position={[0, -0.06, 0.08]}
        >
          <meshStandardMaterial
            color="#202227"
            roughness={0.55}
            metalness={0.25}
          />
        </RoundedBox>

        {[
          [-4.02, 0, -1.0],
          [-4.02, 0, 1.0],
          [4.02, 0, -1.0],
          [4.02, 0, 1.0],
          [-2.0, 0, -1.7],
          [2.0, 0, -1.7],
          [-2.0, 0, 1.78],
          [2.0, 0, 1.78],
        ].map((gPos, gIdx) => (
          <mesh key={gIdx} position={[gPos[0], -0.06, gPos[2]]}>
            <boxGeometry args={[0.22, 0.07, 0.15]} />
            <meshStandardMaterial color="#1E2024" roughness={0.9} />
          </mesh>
        ))}

        <MechanicalStabilizer width={2.5} position={[-0.9, -0.04, 1.35]} />
        <MechanicalStabilizer width={0.8} position={[3.0, -0.04, 0.31]} />

        <mesh position={[0, -0.11, 0.08]}>
          <boxGeometry args={[7.9, 0.04, 3.28]} />
          <meshStandardMaterial color="#111214" roughness={0.9} />
        </mesh>

      </group>

      {/* =========================================================================
          CAPA 3: Set de Keycaps Doble Inyección PBT (keycapsGroup)
          ========================================================================= */}
      <group ref={keycapsGroup}>
        {computedKeyLayout.map((k) => {
          const mat = keycapMaterials[k.type] || keycapMaterials.alpha;
          const bgCol =
            k.type === 'mod'
              ? currentKeycaps.modColor
              : k.type === 'accent'
              ? currentKeycaps.accentColor
              : currentKeycaps.alphaColor;
          const legendMat = getKeycapLegendMaterial(k, bgCol);
          return (
            <Keycap
              key={k.id}
              item={k}
              x={k.x}
              z={k.z}
              keycapMaterial={mat}
              stemMaterial={keycapMaterials.stem}
              legendMaterial={legendMat}
              onPress={handleKeyClick}
              setMeshRef={setKeyMeshRef}
            />
          );
        })}

      </group>

      {/* =========================================================================
          CAPA 4: Perilla Multifunción CNC (knobGroup)
          ========================================================================= */}
      <group ref={knobGroup} position={[3.65, 0.12, -1.25]}>
        <Cylinder args={[0.34, 0.34, 0.38, 36]}>
          <meshPhysicalMaterial
            color={currentKnob.colorHex}
            metalness={currentKnob.metalness}
            roughness={currentKnob.roughness}
            clearcoat={0.3}
            clearcoatRoughness={0.1}
          />
        </Cylinder>

        <Cylinder args={[0.29, 0.33, 0.08, 36]} position={[0, 0.21, 0]}>
          <meshPhysicalMaterial
            color={currentKnob.colorHex}
            metalness={currentKnob.metalness}
            roughness={currentKnob.roughness}
            clearcoat={0.35}
          />
        </Cylinder>

        <mesh position={[0, 0.25, 0.19]}>
          <boxGeometry args={[0.035, 0.02, 0.13]} />
          <meshStandardMaterial color="#121316" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}
