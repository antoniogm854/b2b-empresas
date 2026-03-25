"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X, Smartphone, Zap } from "lucide-react";
import Link from "next/link";

export function PWAInstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  
  // Only show on the homepage
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [isVisible, deferredPrompt]);

  const handleInstallClick = async () => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      alert("¡El CATÁLOGO DIGITAL ya está instalado y listo para usar!");
      setIsVisible(false);
      return;
    }

    if (!deferredPrompt) {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isIOS) {
        alert("Para instalar en iPhone/iPad:\n\n1. Toca el botón 'Compartir' (cuadrado con flecha).\n2. Selecciona 'Agregar a Inicio'.");
      } else if (isMobile) {
        alert("Para instalar en Android:\n\n1. Toca los 3 puntos del navegador (arriba a la derecha).\n2. Selecciona 'Instalar aplicación'.");
      } else {
        alert("Para instalar en PC (Chrome/Edge):\n\n1. Haz clic en el icono de 'Instalar' en la barra de direcciones (derecha).\n2. O ve a los 3 puntos (Menú) > 'Guardar y compartir' > 'Instalar esta página'.");
      }
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible || pathname === "/register" || !isHomePage) return null;

  return (
    <div className="fixed top-24 sm:top-24 right-4 sm:right-6 z-[90] animate-fade-in-right max-w-[calc(100vw-2rem)] sm:max-w-xs transition-all duration-500">
      <div className="bg-[#2E3D10] text-white p-5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-white/10">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-20"
        >
          <X size={16} />
        </button>
        
        <Link 
          href="/cdb2b/onboarding"
          className="relative w-full bg-[#4B6319] text-white p-5 rounded-[2rem] shadow-[0_0_20px_rgba(162,195,103,0.3)] flex flex-col items-center gap-3 hover:bg-[#3d5114] transition-all hover:scale-[1.05] group/btn border-2 border-[#A2C367]/30 overflow-hidden mb-6 ring-2 ring-[#A2C367]/20 ring-offset-2 ring-offset-[#2E3D10]"
          style={{ 
            boxShadow: '0 0 15px rgba(162, 195, 103, 0.4), inset 0 0 10px rgba(162, 195, 103, 0.2)',
            animation: 'pulse-neon 3s ease-in-out infinite'
          }}
        >
          <div className="absolute inset-0 bg-white/5 group-hover/btn:bg-white/10 transition-colors" />
          
          <div className="bg-[#A2C367] text-[#2E3D10] p-2.5 rounded-xl relative z-10 shadow-[0_0_10px_#A2C367]">
            <Zap size={20} className="animate-pulse" />
          </div>
          
          <div className="flex flex-col items-center text-center relative z-10">
            <p className="font-black text-[10px] uppercase tracking-[0.2em] leading-tight opacity-70 mb-0.5">INSTALACIÓN</p>
            <p className="font-black text-xl lg:text-2xl uppercase tracking-tighter leading-none text-[#A2C367] drop-shadow-[0_0_8px_rgba(162,195,103,0.8)]">CATÁLOGO DIGITAL</p>
          </div>
        </Link>
        
        <div className="flex items-start gap-4 px-2">
          <div className="bg-white/10 p-2.5 rounded-xl hidden sm:block">
            <Smartphone size={20} className="text-[#A2C367]" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-white/60 leading-tight italic">
              Activa tu registro como PROVEEDOR y despliega tu entorno digital de alta precisión.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#A2C367]/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
