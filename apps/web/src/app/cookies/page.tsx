"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { Cookie, Info, ShieldCheck } from "lucide-react";

export default function CookiesPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="flex items-center gap-4 text-[var(--primary)] mb-8">
            <Cookie size={40} />
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
              Política de <span className="text-zinc-400">Cookies</span>
            </h1>
          </div>

          <section className="glass p-8 md:p-12 rounded-[2.5rem] border-[var(--border)]/30 space-y-8 text-zinc-400 leading-relaxed font-medium">
            <div className="space-y-4">
              <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                <Info size={20} className="text-[var(--primary)]" />
                ¿Qué son las cookies?
              </h2>
              <p>Las cookies son pequeños archivos de texto que se almacenan en su navegador para mejorar su experiencia, recordar sus preferencias de idioma y realizar el seguimiento de visitas para generar alertas WhatsApp precisas.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                <ShieldCheck size={20} className="text-[var(--primary)]" />
                Uso de Cookies Técnicas
              </h2>
              <p>Utilizamos cookies esenciales para mantener su sesión iniciada en el "Centro de Control" y para diferenciar entre visitantes únicos en los catálogos digitales de nuestros socios.</p>
            </div>

            <div className="pt-10 border-t border-white/5 text-[10px] uppercase font-black tracking-widest text-zinc-600">
              Protocolo de Transparencia Industrial v6.0 — 2026
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
