"use client";

import { usePathname } from "next/navigation";
import { X, Smartphone, Zap, Monitor } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useState, useEffect } from "react";

export function PWAInstallPrompt() {
  const pathname = usePathname();
  const { isInstallable, isStandalone, installApp } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Show on homepage and login/register
  const shouldShow = pathname === "/" || pathname === "/login" || pathname === "/register";

  if (!mounted || isStandalone || isDismissed || !shouldShow) return null;

  return (
    <div className="fixed top-24 sm:top-24 right-4 sm:right-6 z-[90] animate-fade-in-right max-w-[calc(100vw-2rem)] sm:max-w-xs transition-all duration-500">
      <div className="bg-slate-900/90 backdrop-blur-xl text-white p-5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-white/10 ring-1 ring-white/20">
        <button 
          onClick={() => setIsDismissed(true)}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-20"
        >
          <X size={16} />
        </button>
        
        <button 
          onClick={installApp}
          className="relative w-full bg-[#4B6319] text-white p-5 rounded-[2rem] shadow-[0_0_20px_rgba(162,195,103,0.3)] flex flex-col items-center gap-3 hover:bg-[#3d5114] transition-all hover:scale-[1.05] group/btn border-2 border-[#A2C367]/30 overflow-hidden mb-6 ring-2 ring-[#A2C367]/20 ring-offset-2 ring-offset-slate-900"
          style={{ 
            boxShadow: '0 0 15px rgba(162, 195, 103, 0.4), inset 0 0 10px rgba(162, 195, 103, 0.2)',
          }}
        >
          <div className="absolute inset-0 bg-white/5 group-hover/btn:bg-white/10 transition-colors" />
          
          <div className="bg-[#A2C367] text-[#2E3D10] p-2.5 rounded-xl relative z-10 shadow-[0_0_10px_#A2C367]">
            <Monitor size={24} className="animate-pulse" />
          </div>
          
          <div className="flex flex-col items-center text-center relative z-10">
            <p className="font-black text-[10px] uppercase tracking-[0.2em] leading-tight opacity-70 mb-0.5">INSTALAR APLICATIVO</p>
            <p className="font-black text-xl lg:text-2xl uppercase tracking-tighter leading-none text-[#A2C367] drop-shadow-[0_0_8px_rgba(162,195,103,0.8)]">RECUPERAR ICONO</p>
          </div>
        </button>
        
        <div className="flex items-start gap-4 px-2">
          <div className="bg-white/10 p-2.5 rounded-xl hidden sm:block">
            <Smartphone size={20} className="text-[#A2C367]" />
          </div>
          <div className="space-y-1 text-left">
            <p className="text-[10px] font-bold text-white/60 leading-tight italic uppercase tracking-wider">
              Recupera el acceso directo en tu escritorio para una gestión industrial de alta precisión.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#A2C367]/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
