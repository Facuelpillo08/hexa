import React from 'react';
import { useCustomizer } from '../../context/CustomizerContext';
import { HexaLogoSymbol } from '../common/HexaLogo';

export default function Navbar() {
  const { cartCount, setIsOrderModalOpen, isNavHidden } = useCustomizer();

  const isHidden = isNavHidden;

  const scrollToSection = (id) => {
    if (id === 'hero' || id === 'top') {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    if (id === 'configurador') {
      const container = document.getElementById('configurador');
      if (container) {
        const maxScroll = container.offsetHeight - window.innerHeight;
        const targetScroll = container.offsetTop + maxScroll * 0.75;
        if (window.__lenis) {
          window.__lenis.scrollTo(targetScroll, { duration: 1.2 });
        } else {
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
      }
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      if (window.__lenis) {
        window.__lenis.scrollTo(el, { duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      id="main-navbar"
      className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out translate-y-0 opacity-100 pointer-events-auto w-auto max-w-[95vw] will-change-transform"
    >
      <div className="bg-[#111317] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full flex items-center gap-3 sm:gap-5 shadow-2xl border border-white/10 font-mono text-xs backdrop-blur-md">
        {/* Brand */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('hero');
          }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <HexaLogoSymbol
            mode="dark"
            className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 group-hover:scale-105 transition-transform"
            accentColor="#3B82F6"
          />
          <span className="font-display font-black text-sm sm:text-base text-white tracking-tight uppercase whitespace-nowrap">
            HEXA <span className="text-[#3B82F6] font-light text-xs sm:text-sm">//</span> CUSTOM
          </span>
        </a>

        <span className="text-[#4B5563] hidden md:inline">/</span>

        {/* Navigation Direct Links */}
        <nav className="hidden md:flex items-center gap-5 text-[11px] uppercase tracking-wider text-gray-300">
          <button
            onClick={() => scrollToSection('configurador')}
            className="hover:text-white transition-colors cursor-pointer py-0.5"
          >
            CONFIGURADOR
          </button>
          <button
            onClick={() => scrollToSection('componentes')}
            className="hover:text-white transition-colors cursor-pointer py-0.5"
          >
            COMPONENTES
          </button>
          <button
            onClick={() => scrollToSection('soporte')}
            className="hover:text-white transition-colors cursor-pointer py-0.5"
          >
            SOPORTE
          </button>
        </nav>

        {/* Cart Trigger: Cobalt Pill Button */}
        <button
          onClick={() => setIsOrderModalOpen(true)}
          className="bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-[10px] sm:text-[11px] font-bold px-3.5 sm:px-4 py-1.5 rounded-full flex items-center gap-1.5 tracking-wider transition-all duration-200 cursor-pointer shadow-xs shrink-0"
        >
          <span>CARRITO</span>
          <span>{String(cartCount).padStart(2, '0')}</span>
        </button>
      </div>
    </header>
  );
}
