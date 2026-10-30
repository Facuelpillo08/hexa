import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TelemetryRibbon() {
  const ribbonRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (!ribbonRef.current || !trackRef.current) return;
    const ctx = gsap.context(() => {
      // Dynamic parallax translation synchronized with Lenis scroll
      gsap.to(trackRef.current, {
        x: '-=180',
        ease: 'none',
        scrollTrigger: {
          trigger: ribbonRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    }, ribbonRef);

    return () => ctx.revert();
  }, []);

  const items = [
    'HEXA // KX-75 ARCHITECTURE',
    'CNC 6063-T6 BILLET ALUMINUM',
    'POLLING RATE: 1000 HZ // 0.12MS LATENCY',
    'HOT-SWAPPABLE 5-PIN Kailh SOCKETS',
    'PORON® 5-LAYER ACOUSTIC GASKET MOUNT',
    'ANODIZED HARD-COAT FINISH // MICRO-BEAD #180',
    '32-BIT ARM CORTEX-M4 DUAL-CORE',
    'QMK / VIA OPEN SOURCE FIRMWARE',
    'ROTARY CNC QUADRATURE ENCODER',
    'FACTORY LUBED MECHANICAL STABILIZERS',
  ];

  return (
    <div
      ref={ribbonRef}
      className="w-full bg-[#121316] text-[#EAE8E3] border-y border-[#121316] overflow-hidden select-none py-2.5 relative z-20"
    >
      <div ref={trackRef} className="w-full will-change-transform">
        <div className="flex w-max animate-marquee font-mono text-[11px] tracking-widest uppercase will-change-transform">
          {/* Track 1 */}
          <div className="flex items-center gap-8 shrink-0 pr-8">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-[#1E40AF] inline-block"></span>
                <span className="font-semibold text-white/90">{item}</span>
                <span className="text-white/30">//</span>
              </div>
            ))}
          </div>

          {/* Track 2 (Seamless loop) */}
          <div className="flex items-center gap-8 shrink-0 pr-8">
            {items.map((item, idx) => (
              <div key={`dup-${idx}`} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-[#1E40AF] inline-block"></span>
                <span className="font-semibold text-white/90">{item}</span>
                <span className="text-white/30">//</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

