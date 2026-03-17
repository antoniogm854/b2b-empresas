"use client";

import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
      <div className="bg-destructive text-destructive-foreground px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-white/20">
        <WifiOff size={20} className="animate-pulse" />
        <span className="text-xs font-black uppercase tracking-widest italic">Modo Offline Activo</span>
      </div>
    </div>
  );
}
