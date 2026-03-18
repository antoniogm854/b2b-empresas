"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, MapPin, Phone, Mail } from "lucide-react";
import { settingsService, SiteSettings } from "@/lib/settings-service";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    setMounted(true);
    const loadSettings = async () => {
      const s = await settingsService.getSettings();
      setSettings(s);
    };
    loadSettings();
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-accent/30">
      {/* Navigation */}
      <header 
        id="main-header" 
        className={`fixed top-0 z-50 w-full transition-all duration-500 border-b ${
          mounted && scrolled 
            ? "glass border-border/50 translate-y-0" 
            : "bg-white border-transparent"
        }`}
      >
        <div className={`container flex items-center justify-between mx-auto px-6 transition-all duration-500 ${
          mounted && scrolled ? "h-20" : "h-24"
        }`}>
          <Link href="/" id="site-logo" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
              <Image 
                src="/logo/logo-icon.png" 
                alt="Logo Icon" 
                width={40}
                height={40}
                className="object-contain"
                priority
                suppressHydrationWarning
              />
            </div>
            <div className="relative w-40 h-8">
              <Image 
                src="/logo/logo-text.png" 
                alt="B2B Empresas" 
                width={160}
                height={32}
                className="object-contain logo-emerald"
                priority
                suppressHydrationWarning
              />
            </div>
          </Link>
          
          <nav id="top-nav" className="hidden lg:flex gap-8 text-sm font-black uppercase tracking-widest text-muted-foreground">
            <Link href="/#corporativo" className="hover:text-accent transition-colors">CORPORATIVO</Link>
            <Link href="/#soporte-operativo" className="hover:text-accent transition-colors">SOPORTE OPERATIVO</Link>
            <Link href="/#empresas" className="hover:text-accent transition-colors">EMPRESAS</Link>
            <Link href="/#identidad" className="hover:text-accent transition-colors">IDENTIDAD</Link>
          </nav>

          <div id="auth-controls" className="flex items-center gap-4">
            <Link href="/dashboard" id="btn-login-portal" className="hidden md:block text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl border border-border hover:bg-muted transition-all">
              Login Portal
            </Link>
            <Link href="/admin-console" id="btn-admin-master" className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/10" suppressHydrationWarning>
              {mounted && <ShieldCheck size={14} />} Admin Master
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary/10 pt-20 pb-16 border-t-4 border-border/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-left">
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-primary">Nosotros</p>
              <p className="text-sm text-muted-foreground font-bold leading-relaxed">
                {settings?.about_us || "Cargando..."}
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-primary">Contacto Directo</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground" suppressHydrationWarning>
                  {mounted && <MapPin size={16} className="text-accent" />}
                  <span>{settings?.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground" suppressHydrationWarning>
                  {mounted && <Phone size={16} className="text-accent" />}
                  <span>{settings?.support_phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground" suppressHydrationWarning>
                  {mounted && <Mail size={16} className="text-accent" />}
                  <span>{settings?.support_email}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-primary">Legal</p>
              <div className="flex flex-col gap-2 text-sm font-bold text-muted-foreground">
                <Link href="/privacy" className="hover:text-accent transition-colors">Privacidad</Link>
                <Link href="/terms" className="hover:text-accent transition-colors">Términos de Servicio</Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic">
              © 2026 {settings?.company_name || "b2bempresas.com"} — Powered by Advanced Agentic Engineering
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
