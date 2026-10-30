import React, { Suspense, lazy } from 'react';
import SmoothScroll from './components/core/SmoothScroll';
import { CustomizerProvider } from './context/CustomizerContext';
import CustomCursor from './components/core/CustomCursor';
import Navbar from './components/layout/Navbar';
import HeroConfiguratorSection from './components/hero/HeroConfiguratorSection';
import TelemetryRibbon from './components/layout/TelemetryRibbon';
import SpecsBentoGrid from './components/specs/SpecsBentoGrid';
import Footer from './components/layout/Footer';

// Code-split modals so secondary Three.js canvas & checkout dialog do not block initial bundle load
const OrderModal = lazy(() => import('./components/layout/OrderModal'));
const Free360Modal = lazy(() => import('./components/customizer/Free360Modal'));

export default function App() {
  return (
    <CustomizerProvider>
      <SmoothScroll>
        <div className="min-h-screen bg-[#EFECE6] text-[#111215] font-sans selection:bg-[#1E40AF] selection:text-white relative">
          {/* Custom CAD Magnetic Cursor */}
          <CustomCursor />

          {/* Top navigation */}
          <Navbar />

          <main>
            {/* 01 & 02 // Unified Hero & Interactive Configurator Stage */}
            <HeroConfiguratorSection />

            {/* Continuous Swiss Telemetry Ribbon */}
            <TelemetryRibbon />

            {/* 03 // Engineering Specs Bento Grid */}
            <SpecsBentoGrid />
          </main>

          {/* Footer with Technical Blueprint */}
          <Footer />

          {/* On-demand Modals */}
          <Suspense fallback={null}>
            {/* Order Checkout & Technical Specification Modal */}
            <OrderModal />

            {/* Fullscreen 360° Inspection Stage */}
            <Free360Modal />
          </Suspense>
        </div>
      </SmoothScroll>
    </CustomizerProvider>
  );
}
