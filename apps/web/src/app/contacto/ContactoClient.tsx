"use client";

import { MessageSquare, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function ContactoClient() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
      <div className="container mx-auto px-6 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          
          {/* Info Side */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-4">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-widest italic text-[var(--primary)]">Soporte Industrial v6.0</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-[var(--strong-text)] leading-none">
                Conectemos tu <br />
                <span className="text-[var(--primary)] text-6xl md:text-8xl">Industria</span>
              </h1>
              <p className="text-xl text-[var(--panel-subtext)] font-semibold max-w-lg leading-relaxed">
                ¿Tienes dudas sobre cómo implementar tu catálogo digital? Nuestro equipo de expertos está listo para asesorarte.
              </p>
            </div>

            <div className="space-y-8">
               <div className="flex gap-6 group cursor-pointer">
                  <div className="w-16 h-16 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-all shadow-xl shadow-[var(--primary)]/5">
                     <MessageSquare size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-[var(--strong-text)]">WhatsApp Corporativo</h3>
                    <p className="text-sm text-[var(--panel-subtext)] font-bold italic">+51 900 000 000</p>
                  </div>
               </div>
               <div className="flex gap-6 group cursor-pointer">
                  <div className="w-16 h-16 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-all shadow-xl shadow-[var(--primary)]/5">
                     <Mail size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-[var(--strong-text)]">Consultas Técnicas</h3>
                    <p className="text-sm text-[var(--panel-subtext)] font-bold italic">soporte@b2bempresas.com</p>
                  </div>
               </div>
               <div className="flex gap-6 group cursor-pointer">
                  <div className="w-16 h-16 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-all shadow-xl shadow-[var(--primary)]/5">
                     <MapPin size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-[var(--strong-text)]">Sede Central</h3>
                    <p className="text-sm text-[var(--panel-subtext)] font-bold italic">San Isidro, Lima - Perú</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="relative">
             {!submitted ? (
               <form 
                 onSubmit={handleSubmit}
                 className="glass p-10 md:p-16 rounded-[4rem] border-zinc-200 dark:border-zinc-800 space-y-8 shadow-2xl shadow-black/5"
               >
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Nombre</label>
                     <input 
                       required
                       type="text" 
                       className="w-full bg-white dark:bg-zinc-900 border border-[var(--border)] py-4 px-6 rounded-2xl focus:border-[var(--primary)] outline-none font-bold"
                     />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">RUC (Opcional)</label>
                     <input 
                       type="text" 
                       className="w-full bg-white dark:bg-zinc-900 border border-[var(--border)] py-4 px-6 rounded-2xl focus:border-[var(--primary)] outline-none font-bold"
                     />
                   </div>
                 </div>

                 <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Correo Corporativo</label>
                   <input 
                     required
                     type="email" 
                     className="w-full bg-white dark:bg-zinc-900 border border-[var(--border)] py-4 px-6 rounded-2xl focus:border-[var(--primary)] outline-none font-bold"
                   />
                 </div>

                 <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Consulta</label>
                   <textarea 
                     rows={5}
                     className="w-full bg-white dark:bg-zinc-900 border border-[var(--border)] py-4 px-6 rounded-2xl focus:border-[var(--primary)] outline-none font-bold lg:text-sm"
                   />
                 </div>

                 <button 
                   disabled={loading}
                   className="w-full bg-[var(--primary)] text-white py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-xl shadow-[var(--primary)]/20"
                 >
                   {loading ? "Enviando..." : "Enviar Consulta"} <Send size={20} />
                 </button>
               </form>
             ) : (
               <div className="glass p-16 md:p-24 rounded-[4rem] border-emerald-500/20 text-center space-y-8 animate-reveal">
                  <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                     <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-4xl font-black uppercase tracking-tight italic text-[var(--strong-text)]">Mensaje Recibido</h2>
                  <p className="text-lg text-[var(--panel-subtext)] font-bold max-w-xs mx-auto">
                    Tu consulta ha sido procesada con éxito. Un asesor técnico se pondrá en contacto contigo a la brevedad.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-[var(--primary)] text-xs font-black uppercase underline underline-offset-8"
                  >
                    Enviar otro mensaje
                  </button>
               </div>
             )}
             
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--primary)]/10 blur-[100px] -z-10 rounded-full"></div>
          </div>

        </div>
      </div>
  );
}
