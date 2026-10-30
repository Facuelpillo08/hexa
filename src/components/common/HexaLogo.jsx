import React from 'react';

/**
 * HEXA Official Vector Logo Component
 * Swiss Precision / CNC Mechanical Keyboard Identity
 * 
 * Concept: "Hex-H Switch Bridge"
 * - Hexagonal perimeter silhouette (HEXA)
 * - Monumental architectural "H" dual-pillar monogram
 * - Integrated mechanical Cherry MX switch stem (+) in Electric Cobalt (#1E40AF / #3B82F6)
 */

export function HexaLogoSymbol({
  className = 'w-6 h-6',
  mode = 'auto', // 'auto' | 'dark' | 'light'
  accentColor = '#1E40AF',
  ...props
}) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="HEXA Monogram Logo"
      {...props}
    >
      <title>HEXA Official Monogram</title>
      {/* Left Hexagonal CNC Pillar */}
      <path
        d="M 52 82 L 104 52 L 104 204 L 52 174 Z"
        className={
          mode === 'dark'
            ? 'fill-white'
            : mode === 'light'
            ? 'fill-[#111215]'
            : 'fill-current'
        }
      />

      {/* Right Hexagonal CNC Pillar */}
      <path
        d="M 152 52 L 204 82 L 204 174 L 152 204 Z"
        className={
          mode === 'dark'
            ? 'fill-white'
            : mode === 'light'
            ? 'fill-[#111215]'
            : 'fill-current'
        }
      />

      {/* Mechanical Cherry MX Switch Stem Bridge (Cobalt Core) */}
      <path
        d="M 120 104 H 136 V 120 H 152 V 136 H 136 V 152 H 120 V 136 H 104 V 120 H 120 Z"
        fill={accentColor}
      />
    </svg>
  );
}

export function HexaLogoLockup({
  className = 'h-7',
  mode = 'auto',
  accentColor = '#1E40AF',
  showSubtext = false,
  ...props
}) {
  const textColor =
    mode === 'dark'
      ? 'text-white'
      : mode === 'light'
      ? 'text-[#111215]'
      : 'text-current';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} {...props}>
      <HexaLogoSymbol
        className="h-full w-auto aspect-square shrink-0"
        mode={mode}
        accentColor={accentColor}
      />
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1.5 font-mono">
          <span className={`font-display font-black text-sm tracking-tight uppercase ${textColor}`}>
            HEXA
          </span>
          <span className="text-[#3B82F6] font-light text-xs tracking-tighter">
            //
          </span>
          <span className={`font-bold text-xs tracking-wider uppercase opacity-90 ${textColor}`}>
            CUSTOM
          </span>
        </div>
        {showSubtext && (
          <span className="font-mono text-[9px] text-[#8C939E] tracking-widest uppercase mt-0.5">
            KX-75 // SWISS CALIBRATION
          </span>
        )}
      </div>
    </div>
  );
}

export default HexaLogoSymbol;

