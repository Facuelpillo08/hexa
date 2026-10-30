import React, { useState, useEffect } from 'react';
import { X, Check, Download, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCustomizer } from '../../context/CustomizerContext';
import { HexaLogoSymbol } from '../common/HexaLogo';

export default function OrderModal() {
  const {
    isOrderModalOpen,
    setIsOrderModalOpen,
    currentBase,
    currentKeycaps,
    currentSwitch,
    currentKnob,
    totalPrice,
  } = useCustomizer();

  const [orderSent, setOrderSent] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOrderModalOpen) return;
    setOrderSent(false); // Reset confirmation state on fresh open
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOrderModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOrderModalOpen, setIsOrderModalOpen]);

  if (!isOrderModalOpen) return null;

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Hola HEXA // CUSTOM! Deseo encargar mi teclado mecánico KX-75 con la siguiente configuración:\n\n` +
        `• BASE: ${currentBase.name}\n` +
        `• SWITCHES: ${currentSwitch.name} (${currentSwitch.tag})\n` +
        `• PERILLA CNC: ${currentKnob.name}\n` +
        `• KEYCAPS: ${currentKeycaps?.name || 'PBT CLÁSICO'} (${currentKeycaps?.spec || 'Cherry Profile'})\n` +
        `• TOTAL: $${totalPrice.toFixed(2)} USD\n\n` +
        `Por favor confírmenme el tiempo de ensamblado y entrega. Gracias!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleDownloadSpecs = () => {
    const specsData = `HEXA // CUSTOM — SISTEMA MODULAR KX-75
FICHA TÉCNICA Y RESUMEN DE ORDEN // 2024
--------------------------------------------------
BASE / CHASIS: ${currentBase.name} (${currentBase.spec})
SWITCHES: ${currentSwitch.name} (${currentSwitch.tag})
PERILLA: ${currentKnob.name}
KEYCAPS: ${currentKeycaps?.name || 'PBT CLÁSICO'} (${currentKeycaps?.spec || 'Cherry Profile'})
ESTADO: LISTO PARA ENSAMBLE
PRECIO TOTAL: $${totalPrice.toFixed(2)} USD
TIEMPO ESTIMADO DE FABRICACIÓN: 48 HORAS
--------------------------------------------------
HEXA LABORATORIES // INGENIERÍA DE ALTA PRECISIÓN`;

    const blob = new Blob([specsData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HEXA_ORDEN_KX75_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      onClick={() => setIsOrderModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121316]/50 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#F4F3EF] border-2 border-[#121316] max-w-xl w-full p-6 sm:p-8 shadow-panel relative font-mono text-xs max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOrderModalOpen(false)}
          className="absolute top-5 right-5 text-[#5A6065] hover:text-[#121316] border border-[#C7CBD1] p-1 bg-white hover:bg-[#EAE8E3] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-2 text-[#1E40AF] font-semibold text-[11px]">
          <HexaLogoSymbol mode="light" className="w-4 h-4 shrink-0" accentColor="#1E40AF" />
          <span>ORDEN ACTIVA // KX-75 ENSAMBLE PERSONALIZADO</span>
        </div>
        <h3 className="font-display font-bold text-2xl text-[#121316] uppercase mb-6">
          RESUMEN DE ENSAMBLE TÉCNICO
        </h3>

        {/* Itemized specs list */}
        <div className="space-y-2.5 bg-[#EAE8E3] p-4 border border-[#C7CBD1] mb-6">
          <div className="flex justify-between items-center pb-2 border-b border-[#C7CBD1]">
            <span className="text-[#5A6065]">01 // BASE & CHASIS:</span>
            <span className="font-semibold text-[#121316]">{currentBase.name}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-[#C7CBD1]">
            <span className="text-[#5A6065]">02 // SWITCHES MECÁNICOS:</span>
            <span className="font-semibold text-[#121316]">{currentSwitch.name} ({currentSwitch.tag})</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-[#C7CBD1]">
            <span className="text-[#5A6065]">03 // PERILLA CNC:</span>
            <span className="font-semibold text-[#121316]">{currentKnob.name}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-[#C7CBD1]">
            <span className="text-[#5A6065]">04 // SET DE KEYCAPS:</span>
            <span className="font-semibold text-[#121316]">{currentKeycaps?.name || 'PBT CLÁSICO'}</span>
          </div>
          <div className="flex justify-between items-center pt-2 text-sm font-bold">
            <span className="text-[#121316]">TOTAL FINAL:</span>
            <span className="text-[#1E40AF] text-lg font-mono">${totalPrice.toFixed(2)} USD</span>
          </div>
        </div>

        {orderSent ? (
          <div className="p-4 bg-[#16A34A]/10 border border-[#16A34A] text-[#16A34A] flex items-center gap-3 mb-6">
            <Check className="w-5 h-5 flex-shrink-0" />
            <div>
              <span className="font-bold block">¡ORDEN REGISTRADA CON ÉXITO!</span>
              <span className="text-[11px]">Un ingeniero de ensamble revisará tu ficha técnica.</span>
            </div>
          </div>
        ) : (
          /* Action Buttons */
          <div className="space-y-3 mb-6">
            <button
              onClick={() => setOrderSent(true)}
              className="w-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white py-3.5 font-mono text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-tech"
            >
              <span>CONFIRMAR Y FINALIZAR COMPRA</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleWhatsAppOrder}
                className="bg-white hover:bg-[#EAE8E3] border border-[#121316] text-[#121316] py-2.5 px-3 font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>PEDIR VÍA WHATSAPP</span>
              </button>

              <button
                onClick={handleDownloadSpecs}
                className="bg-white hover:bg-[#EAE8E3] border border-[#121316] text-[#121316] py-2.5 px-3 font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#1E40AF]" />
                <span>EXPORTAR FICHA TXT</span>
              </button>
            </div>
          </div>
        )}

        {/* Footnote */}
        <div className="flex items-center justify-between text-[10px] text-[#5A6065] pt-4 border-t border-[#C7CBD1]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#1E40AF]" />
            HEXA VERIFIED HARDWARE
          </span>
          <span>SISTEMA MODULAR KX-75</span>
        </div>
      </div>
    </div>
  );
}

