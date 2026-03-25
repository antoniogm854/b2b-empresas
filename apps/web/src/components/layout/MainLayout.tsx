"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, MapPin, Phone, Mail, Menu, X, Linkedin, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { settingsService, SiteSettings } from "@/lib/settings-service";
import CountryLanguageSelector from "../shared/CountryLanguageSelector";
import ThemeToggle from "../theme/ThemeToggle";
import { useTranslations } from "next-intl";

// Icono personalizado para X (Twitter) si no usa lucide default "Twitter"
// Y Whatsapp no viene por default, usamos phone

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-accent/30 font-sans">
      {/* Navigation */}
      <header 
        id="main-header" 
        className={`fixed top-0 z-50 w-full transition-all duration-500 border-b ${
          mounted && scrolled 
            ? "glass backdrop-blur-md border-[var(--border)]/50 translate-y-0 shadow-sm" 
            : "bg-transparent border-transparent"
        }`}
      >
        <div className={`container flex items-center justify-between mx-auto px-6 transition-all duration-500 ${
          mounted && scrolled ? "h-20" : "h-24"
        }`}>
          <Link href="/" id="site-logo" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
              <Image 
                src="/logo/logo-icon.png" 
                alt="B2B Empresas Icon" 
                fill
                className="object-contain"
                priority
                suppressHydrationWarning
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 ml-1">
              <span className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic text-[var(--strong-text)] leading-none">
                B2B
              </span>
              <span className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic text-[var(--primary)] leading-none">
                EMPRESAS
              </span>
            </div>
          </Link>
          
          <nav id="top-nav" className="hidden lg:flex gap-8 text-sm font-black uppercase tracking-widest text-[var(--strong-text)]">
            <Link href="/#soluciones" className="hover:text-[var(--primary)] transition-colors opacity-80 hover:opacity-100">{nav('solutions')}</Link>
            <Link href="/#recursos" className="hover:text-[var(--primary)] transition-colors opacity-80 hover:opacity-100">{nav('resources')}</Link>
            <Link href="/#sectores" className="hover:text-[var(--primary)] transition-colors opacity-80 hover:opacity-100">{nav('sectors')}</Link>
            <Link href="/#identidad" className="hover:text-[var(--primary)] transition-colors opacity-80 hover:opacity-100">{nav('identity')}</Link>
          </nav>

          <div id="auth-controls" className="flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-4">
              <ThemeToggle />
              <CountryLanguageSelector />
            </div>
            
            <Link href="/master" id="btn-acceso-corp" className="bg-[var(--primary)] text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-[var(--deep-section)] transition-all flex items-center gap-2 shadow-lg shadow-[var(--primary)]/20" suppressHydrationWarning>
              {mounted && <ShieldCheck size={14} />} {nav('access')}
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-[var(--primary)] hover:opacity-70 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mounted && (isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />)}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <div 
          className={`lg:hidden absolute top-full left-0 w-full glass shadow-2xl border-b border-[var(--border)] transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="flex flex-col p-6 gap-6">
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <CountryLanguageSelector />
            </div>
            <nav className="flex flex-col gap-4 text-base font-black uppercase tracking-widest text-[var(--primary)]">
              <Link href="/#soluciones" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--deep-section)] transition-colors py-2 border-b border-gray-50">{nav('solutions')}</Link>
              <Link href="/#recursos" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--deep-section)] transition-colors py-2 border-b border-gray-50">{nav('resources')}</Link>
              <Link href="/#sectores" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--deep-section)] transition-colors py-2 border-b border-gray-50">{nav('sectors')}</Link>
              <Link href="/#identidad" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--deep-section)] transition-colors py-2 border-b border-gray-50">{nav('identity')}</Link>
              <Link href="/master" onClick={() => setIsMobileMenuOpen(false)} className="mt-4 text-center bg-[var(--primary)] text-white py-4 rounded-xl hover:bg-[var(--deep-section)] transition-colors font-black uppercase tracking-widest text-sm">
                {nav('access')}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer corporativo */}
      <footer id="identidad" className="bg-[var(--deep-section)] text-white pt-24 pb-12 border-t-8 border-[var(--primary)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('/hero.webp')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            <div className="space-y-6">
               <h4 className="text-sm font-black uppercase tracking-widest text-[var(--secondary)] mb-6">Síguenos:</h4>
               <div className="grid grid-cols-3 gap-6 w-fit">
                 <Link href="#" className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--accent)] hover:text-[#000] transition-all shadow-lg"><Linkedin size={24}/></Link>
                 <Link href="#" className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--accent)] hover:text-[#000] transition-all shadow-lg"><Facebook size={24}/></Link>
                 <Link href="#" className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--accent)] hover:text-[#000] transition-all shadow-lg"><Instagram size={24}/></Link>
                 <Link href="#" className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--accent)] hover:text-[#000] transition-all shadow-lg"><Youtube size={24}/></Link>
                 <Link href="#" className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--accent)] hover:text-[#000] transition-all shadow-lg">
                   <span className="font-bold text-xl">𝕏</span>
                 </Link>
                 <Link href="#" className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-[var(--accent)] hover:text-[#000] transition-all shadow-lg"><Phone size={24}/></Link>
               </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-[var(--secondary)] mb-6">{footer('links')}</h4>
              <ul className="flex flex-col gap-3 text-sm font-medium text-white/80">
                <li><Link href="/privacy" className="hover:text-white hover:translate-x-1 inline-block transition-transform">{footer('privacy')}</Link></li>
                <li><Link href="/quality" className="hover:text-white hover:translate-x-1 inline-block transition-transform">{footer('quality')}</Link></li>
                <li><Link href="/security" className="hover:text-white hover:translate-x-1 inline-block transition-transform">{footer('security')}</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-[var(--secondary)] mb-6">{footer('about')}</h4>
              <ul className="flex flex-col gap-3 text-sm font-medium text-white/80">
                <li><Link href="/confianza" className="hover:text-white hover:translate-x-1 inline-block transition-transform">{footer('trust')}</Link></li>
                <li><Link href="/sostenibilidad" className="hover:text-white hover:translate-x-1 inline-block transition-transform">{footer('sustainability')}</Link></li>
                <li><Link href="/inversores" className="hover:text-white hover:translate-x-1 inline-block transition-transform">{footer('investors')}</Link></li>
                <li><Link href="/marketing" className="hover:text-white hover:translate-x-1 inline-block transition-transform">{footer('marketing')}</Link></li>
                <li><Link href="/socios" className="hover:text-white hover:translate-x-1 inline-block transition-transform">{footer('partners')}</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-[var(--secondary)] mb-6">{footer('contact')}</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <Mail size={16} className="text-[var(--secondary)] flex-shrink-0" />
                  <span>contactanos@b2bempresas.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <Mail size={16} className="text-[var(--secondary)] flex-shrink-0" />
                  <span>member@b2bempresas.com</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-[var(--secondary)] mb-6">{footer('region')}</h4>
              <div className="flex items-start gap-3 text-sm font-medium text-white/90">
                <MapPin size={16} className="text-[var(--secondary)] flex-shrink-0 mt-1" />
                <ul className="flex flex-col gap-y-1 text-xs opacity-80 leading-relaxed font-bold">
                  <li>{footer('c1')}</li>
                  <li>{footer('c2')}</li>
                  <li>{footer('c3')}</li>
                  <li>{footer('c4')}</li>
                  <li>{footer('c5')}</li>
                  <li>{footer('c6')}</li>
                  <li>{footer('c7')}</li>
                  <li>{footer('c8')}</li>
                  <li>{footer('c9')}</li>
                </ul>
              </div>
            </div>
            
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">
              © {new Date().getFullYear()} {settings?.company_name || "B2B EMPRESAS"} — LATAM INDUSTRIAL PLATFORM
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
