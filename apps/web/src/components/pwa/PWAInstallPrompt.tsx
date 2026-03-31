"use client";

import { usePathname } from "next/navigation";
import { X, Smartphone, Zap, Monitor } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useState, useEffect } from "react";
import Link from "next/link";

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
        
        <div className="flex flex-col gap-4">
          <Link 
            href="/register"
            onClick={(e: React.MouseEvent) => {
              // Also try to install when clicking, but don't block navigation
              installApp();
            }}
            className="w-full bg-[#CCFF00] text-[#052e16] py-6 rounded-[2rem] font-black uppercase hover:scale-[1.02] transition-all shadow-[0_0_30px_-5px_#CCFF00] flex flex-col items-center justify-center group text-center leading-[0.9] border-2 border-white/20"
          >
            <span className="text-[18px] tracking-[0.2em] mb-1 opacity-80">INSTALACION</span>
            <span className="text-[26px] sm:text-[28px] tracking-[-0.02em] whitespace-nowrap">CATALOGO DIGITAL</span>
          </Link>
          
          <div className="flex items-center gap-4 px-2">
            <div className="bg-white/10 p-2.5 rounded-xl">
              <Zap size={20} className="text-[#CCFF00] animate-pulse" />
            </div>
            <div className="space-y-0.5 text-left">
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Activación Profesional</p>
              <p className="text-[9px] font-bold text-white/50 leading-tight uppercase tracking-wider">
                Inicia tu registro y activa tu entorno digital.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#A2C367]/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
