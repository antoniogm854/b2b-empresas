"use client";

import { useState, useEffect } from "react";

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkStandalone = () => {
      setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
    };

    checkStandalone();

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      // Fallback instructions if prompt is not available
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isIOS) {
        alert("Para instalar en iPhone/iPad:\n\n1. Toca el botón 'Compartir' (cuadrado con flecha).\n2. Selecciona 'Agregar a Inicio'.");
      } else if (isMobile) {
        alert("Para instalar en Android:\n\n1. Toca los 3 puntos del navegador.\n2. Busca 'Instalar aplicación' o 'Agregar a pantalla de inicio'.");
      } else {
        alert("Para recuperar el icono en PC:\n\n1. Busca un icono de (+) o 'Instalar' en la barra de direcciones de Chrome/Edge (a la derecha).\n2. O ve a: Menú (3 puntos) > 'Guardar y compartir' > 'Instalar esta página'.");
      }
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    } catch (err) {
      console.error("Install prompt error:", err);
    }
  };

  return { isInstallable, isStandalone, installApp };
}
