import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const containerRef = useRef(null);
  const coordsRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animId;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) setVisible(true);

      // Check if hovering interactive elements
      const target = e.target;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('[role="button"]') ||
        target.closest('.interactive-target')
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    const handleMouseLeave = () => setVisible(false);

    // High-performance hardware accelerated render loop without React re-renders
    const render = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      // Only perform calculations and style mutations when moving
      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        currentX += dx * 0.22;
        currentY += dy * 0.22;
        if (containerRef.current) {
          containerRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
        if (coordsRef.current) {
          coordsRef.current.innerText = `POS: ${Math.round(currentX)},${Math.round(currentY)}`;
        }
      }
      animId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-300"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        willChange: 'transform',
      }}
    >
      {/* Precision Center Dot */}
      <div
        className={`w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ${
          hovered ? 'bg-[#1E40AF] scale-150' : 'bg-[#121316]'
        } ${clicked ? 'scale-75' : ''}`}
      />

      {/* Outer CAD Reticle Ring */}
      <div
        className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ease-out flex items-center justify-center ${
          hovered
            ? 'w-10 h-10 border-[#1E40AF] bg-[#1E40AF]/5 scale-100'
            : 'w-6 h-6 border-[#8C939E]/50 scale-75'
        } ${clicked ? 'scale-90 bg-[#1E40AF]/15' : ''}`}
      >
        {hovered && (
          <>
            {/* Crosshair Corner Ticks */}
            <span className="absolute -top-1 w-1 h-px bg-[#1E40AF]" />
            <span className="absolute -bottom-1 w-1 h-px bg-[#1E40AF]" />
            <span className="absolute -left-1 h-1 w-px bg-[#1E40AF]" />
            <span className="absolute -right-1 h-1 w-px bg-[#1E40AF]" />
          </>
        )}
      </div>

      {/* Live Coordinate Badge when hovering */}
      {hovered && (
        <div
          ref={coordsRef}
          className="absolute top-4 left-4 bg-[#121316] text-white text-[8px] font-mono px-1.5 py-0.5 rounded-none whitespace-nowrap shadow-xs pointer-events-none tracking-widest uppercase"
        >
          POS: 0,0
        </div>
      )}
    </div>
  );
}

