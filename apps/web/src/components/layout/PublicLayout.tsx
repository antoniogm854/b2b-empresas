"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Landmark, LayoutDashboard, UserCircle, MessageSquare, Briefcase, Info, Cpu, Layers, Linkedin, Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import Script from "next/script";
import CountryLanguageSelector from "../shared/CountryLanguageSelector";
import { SiteSettings, settingsService } from "@/lib/settings-service";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  
  const nav = useTranslations("Nav");
  const footer = useTranslations("Footer");

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

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-foreground selection:bg-primary/30">
      {/* 📊 Tracking & Measurement (Placeholders) */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PLACEHOLDER-ID');
          `,
        }}
      />
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'PIXEL-PLACEHOLDER-ID');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* 🚀 Industrial Navbar v6.0 */}
      <header 
        className={`fixed top-0 z-50 w-full transition-all duration-500 border-b ${
          scrolled 
            ? "glass backdrop-blur-md border-[var(--border)]/50 shadow-sm" 
            : "bg-transparent border-transparent"
        }`}
      >
        <div className={`container mx-auto px-6 flex items-center justify-between transition-all duration-500 ${
          scrolled ? "h-16" : "h-24"
        }`}>
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110">
              <Image 
                src="/logo/logo-icon.png" 
                alt="Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col ml-1">
              <span className="text-lg font-black uppercase tracking-tighter italic text-[var(--strong-text)] leading-none">
                B2B <span className="text-[var(--primary)]">EMPRESAS</span>
              </span>
            </div>
          </Link>

          {/* 🧭 Main Navigation (Legacy v1.0 / v6.0 Refined) */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-[var(--panel-subtext)]">
            <Link href="/#soluciones" className="hover:text-[var(--cat-yellow)] transition-colors">{nav('solutions') || 'Soluciones'}</Link>
            <Link href="/#recursos" className="hover:text-[var(--cat-yellow)] transition-colors">{nav('resources') || 'Recursos'}</Link>
            <Link href="/#sectores" className="hover:text-[var(--cat-yellow)] transition-colors">{nav('sectors') || 'Sectores'}</Link>
            <Link href="/#identidad" className="hover:text-[var(--cat-yellow)] transition-colors">{nav('identity') || 'Identidad'}</Link>
            
            <div className="h-4 w-px bg-[var(--border)] mx-2" />
            
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[var(--cat-yellow)] hover:text-black transition-all font-black">
              <UserCircle size={14} />
              {nav('login') || 'Iniciar Sesión'}
            </Link>
            
            <Link 
              href="/master" 
              className="bg-zinc-950 border border-zinc-800 text-[var(--primary)] px-6 py-2.5 rounded-xl hover:bg-[var(--cat-yellow)] hover:text-black hover:border-black transition-all shadow-xl active:scale-95 flex items-center gap-2 font-black italic"
            >
              CONTROL MASTER
            </Link>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <CountryLanguageSelector />
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 text-[var(--primary)]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden glass border-b border-[var(--border)] overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className="p-6 flex flex-col gap-5 text-sm font-black uppercase tracking-widest">
             <Link href="/#soluciones" onClick={() => setIsMobileMenuOpen(false)}>{nav('solutions') || 'Soluciones'}</Link>
             <Link href="/#recursos" onClick={() => setIsMobileMenuOpen(false)}>{nav('resources') || 'Recursos'}</Link>
             <Link href="/#sectores" onClick={() => setIsMobileMenuOpen(false)}>{nav('sectors') || 'Sectores'}</Link>
             <Link href="/#identidad" onClick={() => setIsMobileMenuOpen(false)}>{nav('identity') || 'Identidad'}</Link>
             <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--primary)]">{nav('login') || 'Iniciar Sesión'}</Link>
             <Link href="/master" onClick={() => setIsMobileMenuOpen(false)} className="bg-zinc-900 border border-zinc-800 text-[var(--primary)] p-4 rounded-xl text-center hover:bg-[var(--cat-yellow)] hover:text-black hover:border-black transition-all font-black uppercase text-xs tracking-widest">
                CONTROL MASTER
             </Link>
          </div>
        </div>
      </header>

      {/* 📺 Industrial Super Leaderboard (Section 11.1) */}
      <div className="w-full bg-transparent mt-16 py-4 flex items-center justify-center border-b border-dashed border-zinc-200/20">
        <div className="container mx-auto px-6 flex justify-center">
          <Link href="/marketplace" className="relative w-full max-w-[970px] h-[90px] rounded-lg overflow-hidden group shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 bg-gradient-to-r from-[#1a2e0e] via-[#2d4d1a] to-[#1a2e0e] border border-white/5 flex items-center justify-center">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-40 grayscale mix-blend-overlay">
               <Image src="/hero.webp" alt="Industrial texture — B2B Empresas" fill className="object-cover" />
            </div>
            
            {/* Minimalist Graphic Elements */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:rotate-180 transition-transform duration-1000">
               <Cpu size={24} className="text-white/20" />
            </div>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:-rotate-180 transition-transform duration-1000">
               <Layers size={21} className="text-white/20" />
            </div>

            {/* Core Content: Perfectly Centered */}
            <div className="relative z-10 text-center space-y-0.5">
               <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tightest italic leading-none drop-shadow-md">
                 B2B <span className="text-[var(--primary)] text-3xl md:text-4xl">EMPRESAS</span>
               </h3>
               <p className="text-[10px] md:text-xs font-black text-white/50 uppercase tracking-[0.5em] italic">
                 RED MAESTRA INDUSTRIAL
               </p>
            </div>

            {/* Interactive Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </Link>
        </div>
      </div>

      <main className="flex-grow pt-0">
        {children}
      </main>

      {/* 📥 Footer Corporativo Legado (Restaurado) */}
      <footer id="identidad" className="bg-[#556B2F]/95 text-white pt-24 pb-12 border-t-8 border-[var(--primary)] relative overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/hero.webp')] bg-cover bg-center mix-blend-overlay grayscale"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            <div className="space-y-6">
               <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6">Síguenos:</h4>
               <div className="grid grid-cols-3 gap-6 w-fit">
                 <Link href="#" className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-[#556B2F] transition-all shadow-lg"><Linkedin size={24}/></Link>
                 <Link href="#" className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-[#556B2F] transition-all shadow-lg"><Facebook size={24}/></Link>
                 <Link href="#" className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-[#556B2F] transition-all shadow-lg"><Instagram size={24}/></Link>
                 <Link href="#" className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-[#556B2F] transition-all shadow-lg"><Youtube size={24}/></Link>
                 <Link href="#" className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-[#556B2F] transition-all shadow-lg">
                   <span className="font-bold text-xl">𝕏</span>
                 </Link>
                 <Link href="#" className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-[#556B2F] transition-all shadow-lg"><Phone size={24}/></Link>
               </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6">Links de Interés</h4>
              <ul className="flex flex-col gap-3 text-sm font-medium text-white/80">
                <li><Link href="/privacy" className="hover:text-white hover:translate-x-1 inline-block transition-transform">{footer('privacy')}</Link></li>
                <li><Link href="/terms" className="hover:text-white hover:translate-x-1 inline-block transition-transform">{footer('links') === 'Links de Interés' ? 'Términos y Condiciones' : 'Terms and Conditions'}</Link></li>
                <li><Link href="/quality" className="hover:text-white hover:translate-x-1 inline-block transition-transform">{footer('quality')}</Link></li>
                <li><Link href="/security" className="hover:text-white hover:translate-x-1 inline-block transition-transform">{footer('security')}</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6">Sobre B2B Empresas</h4>
              <ul className="flex flex-col gap-3 text-sm font-medium text-white/80">
                <li><Link href="/confianza" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Confianza</Link></li>
                <li><Link href="/sostenibilidad" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Sostenibilidad</Link></li>
                <li><Link href="/inversores" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Inversores</Link></li>
                <li><Link href="/marketing" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Publicidad y Marketing</Link></li>
                <li><Link href="/socios" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Conviértase en Nuestro Socio Estratégico</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6">Identidad - Contáctanos</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <Mail size={16} className="text-white flex-shrink-0" />
                  <span>contactanos@b2bempresas.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <Mail size={16} className="text-white flex-shrink-0" />
                  <span>member@b2bempresas.com</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6">Region America</h4>
              <div className="flex items-start gap-3 text-sm font-medium text-white/90">
                <MapPin size={16} className="text-white flex-shrink-0 mt-1" />
                <ul className="flex flex-col gap-y-1 text-xs opacity-80 leading-relaxed font-bold">
                  <li>Perú – Lima</li>
                  <li>México – Ciudad de México</li>
                  <li>Colombia – Bogotá</li>
                  <li>Chile – Santiago de Chile</li>
                  <li>Bolivia – Sucre</li>
                  <li>Argentina – Buenos Aires</li>
                  <li>Brasil – Brasilia</li>
                  <li>Venezuela – Caracas</li>
                  <li>Ecuador – Quito</li>
                </ul>
              </div>
            </div>
            
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">
              © {new Date().getFullYear()} {settings?.company_name || "B2B EMPRESAS"} — LATAM INDUSTRIAL PLATFORM — v6.1.8-INDUSTRIAL-PREMIUM
            </p>
            <div className="flex items-center gap-4">
              <CountryLanguageSelector />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
