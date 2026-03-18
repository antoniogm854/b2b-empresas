"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X, Smartphone } from "lucide-react";
import Link from "next/link";

export function PWAInstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Only show on the homepage
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Fallback for development/review: Show banner briefly if it hasn't appeared
    const timer = setTimeout(() => {
      if (!isVisible && !deferredPrompt) {
        setIsVisible(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
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

  if (!isVisible || !isHomePage) return null;

  return (
    <div className="fixed top-24 sm:top-24 right-4 sm:right-6 z-[90] animate-fade-in-right max-w-[calc(100vw-2rem)] sm:max-w-xs transition-all duration-500">
      <div className="bg-primary text-primary-foreground p-4 sm:p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group border border-white/10">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
        
        <Link 
          href="/register"
          className="w-full bg-[#CCFF00] text-[#052e16] py-5 rounded-[1.5rem] font-black uppercase hover:scale-105 transition-all shadow-[0_0_40px_-5px_#CCFF00] flex flex-col items-center justify-center group mb-6 text-center leading-[0.9]"
          style={{ fontFamily: "'Bodoni MT Black', 'Bodoni MT', serif" }}
        >
          <span className="text-[22px] tracking-[0.22em] mb-1 whitespace-nowrap">INSTALACION</span>
          <span className="text-[32px] tracking-[-0.05em] whitespace-nowrap">CATALOGO DIGITAL</span>
        </Link>
        
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-2xl hidden sm:block">
            <Smartphone size={24} className="text-accent" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium text-white/70 leading-tight italic">
              Inicia tu registro como propietario y activa tu entorno digital de alta precisión.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
