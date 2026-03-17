"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-accent/30">
      {/* Navigation */}
      <header id="main-header" className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-border/50">
        <div className="container flex h-20 items-center justify-between mx-auto px-6">
          <Link href="/" id="site-logo" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12 shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-black text-lg">B2B</span>
            </div>
            <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              b2bempresas.com
            </span>
          </Link>
          
          <nav id="top-nav" className="hidden lg:flex gap-8 text-sm font-black uppercase tracking-widest text-muted-foreground">
            <Link href="/#características" className="hover:text-accent transition-colors">Características</Link>
            <Link href="/#planes" className="hover:text-accent transition-colors">Planes</Link>
            <Link href="/#empresas" className="hover:text-accent transition-colors">Empresas</Link>
            <Link href="/#contacto" className="hover:text-accent transition-colors">Contacto</Link>
          </nav>

          <div id="auth-controls" className="flex items-center gap-4">
            <Link href="/dashboard" id="btn-login-portal" className="hidden md:block text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl border border-border hover:bg-muted transition-all">
              Login Portal
            </Link>
            <Link href="/admin-console" id="btn-admin-master" className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/10">
              <ShieldCheck size={14} /> Admin Master
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary/10 pt-20 pb-16 border-t-4 border-border/10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic">
            © 2026 b2bempresas.com — Powered by Advanced Agentic Engineering
          </p>
        </div>
      </footer>
    </div>
  );
}
