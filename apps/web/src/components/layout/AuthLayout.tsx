"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";


interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-50" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[var(--primary)]/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-[var(--primary)]/5 blur-[100px] rounded-full pointer-events-none" />

      {/* 🛠️ Brand Header */}
      <div className="mb-6 flex flex-col items-center gap-4">
        <Link href="/" className="group transition-transform hover:scale-105">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            <Image 
              src="/logo/logo-icon.png" 
              alt="B2B Logo" 
              fill 
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <h1 className="text-sm font-black uppercase tracking-[0.3em] text-[var(--panel-subtext)] italic">
          <span className="text-[var(--primary)]">B2B</span> EMPRESAS
        </h1>
      </div>

      {/* 📦 Auth Box */}
      <div className="w-full max-w-md animate-reveal">
        {children}
      </div>

      {/* 🔧 Minimal Footer */}
      <div className="mt-12 flex items-center gap-6">
        <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-[var(--panel-subtext)] hover:text-[var(--primary)] transition-colors">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
