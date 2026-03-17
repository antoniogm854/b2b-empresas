"use client";

import { useState, useEffect } from "react";
import { Sparkles, X, Smartphone } from "lucide-react";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

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
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-6 z-[90] animate-fade-in-right max-w-xs">
      <div className="bg-primary text-primary-foreground p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group border border-white/10">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
        
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-2xl">
            <Smartphone size={24} className="text-accent" />
          </div>
          <div className="space-y-1">
            <h4 className="font-black uppercase tracking-tight text-sm italic">ACTIVACIÓN APP_CD</h4>
            <p className="text-[10px] font-medium text-white/70 leading-tight">
              Activa el acceso directo a tu catálogo industrial para una respuesta inmediata.
            </p>
          </div>
        </div>

        <button 
          onClick={handleInstallClick}
          className="w-full mt-6 bg-accent text-accent-foreground py-3 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:scale-105 transition-transform"
        >
          <Sparkles size={14} /> Activar Ahora
        </button>

        {/* Decorative elements */}
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
