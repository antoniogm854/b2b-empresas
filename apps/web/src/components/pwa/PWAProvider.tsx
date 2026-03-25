"use client";

import { useEffect } from "react";

import { OfflineIndicator } from "./OfflineIndicator";

import { PWAInstallPrompt } from "./PWAInstallPrompt";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js?v=3")
          .then((registration) => {
            // SW registered
          })
          .catch((registrationError) => {
            // SW registration failed
          });
      });
    }
  }, []);

  return (
    <>
      <OfflineIndicator />
      <PWAInstallPrompt />
      {children}
    </>
  );
}
