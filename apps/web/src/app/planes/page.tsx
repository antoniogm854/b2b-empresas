import PublicLayout from "@/components/layout/PublicLayout";
import { Check, X, Zap, Crown, ShieldCheck, MessageSquare, Globe, Infinity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planes e Inversión | B2B EMPRESAS",
  description: "Compara nuestros planes Freemium e Industrial Premium. Digitaliza tu oferta industrial con la red más confiable de Latinoamérica.",
};

export default function PlanesPage() {
  const plans = [
    {
      name: "Freemium",
      desc: "Ideal para pequeñas empresas que inician su digitalización.",
      price: "0",
      featured: false,
      cta: "Comenzar Gratis",
      benefits: [
        { text: "Catálogo en subdominio .b2bempresas.com", included: true },
        { text: "Hasta 5 productos técnicos", included: true },
        { text: "Alertas Web básicas", included: true },
        { text: "Validación RUC SUNAT básica", included: true },
        { text: "Dominio propio .com / .pe", included: false },
        { text: "Alertas WhatsApp de visitas", included: false },
        { text: "Productos ilimitados", included: false },
        { text: "Soporte 24/7 Prioritario", included: false },
      ]
    },
    {
      name: "Industrial Premium",
      desc: "La red de proveedores de élite en Latinoamérica.",
      price: "299",
      featured: true,
      cta: "Activar Premium",
      benefits: [
        { text: "Catálogo en subdominio propio", included: true },
        { text: "Productos ilimitados", included: true },
        { text: "Alertas WhatsApp en tiempo real", included: true },
        { text: "Validación SUNAT Certificada", included: true },
        { text: "Dominio propio personalizado", included: true },
        { text: "Soporte Industrial Dedicado", included: true },
        { text: "Métricas de conversión avanzadas", included: true },
        { text: "Destaque en Catálogo Maestro", included: true },
      ]
    }
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto px-6 py-32">
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-[var(--strong-text)]">
            Planes y <span className="text-[var(--primary)]">Estrategias</span>
          </h1>
          <p className="text-xl text-[var(--panel-subtext)] font-medium">
            Escala tu alcance industrial con nuestras herramientas de digitalización masiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative overflow-hidden p-10 md:p-16 rounded-[4rem] border transition-all duration-500 hover:scale-[1.02] ${
                plan.featured 
                ? 'bg-[var(--primary)] text-white border-transparent shadow-2xl shadow-[var(--primary)]/20 shadow-glow scale-[1.05]' 
                : 'glass border-[var(--border)] dark:border-zinc-800 text-[var(--strong-text)]'
              }`}
            >
              {plan.featured && (
                <div className="absolute top-8 right-8 bg-white/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Crown size={12} /> Lo más recomendado
                </div>
              )}

              <div className="mb-12">
                <h3 className="text-3xl font-black uppercase tracking-tight italic mb-4">{plan.name}</h3>
                <p className={`text-sm font-bold opacity-80 ${plan.featured ? 'text-white/90' : 'text-[var(--panel-subtext)]'}`}>
                  {plan.desc}
                </p>
              </div>

              <div className="mb-16">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black tracking-tight">S/ {plan.price}</span>
                  <span className="text-sm font-bold opacity-70">/ mes</span>
                </div>
              </div>

              <ul className="space-y-6 mb-16">
                {plan.benefits.map((benefit, j) => (
                  <li key={j} className="flex items-center gap-4 text-sm font-bold">
                    <div className={`shrink-0 rounded-full p-1 ${benefit.included ? (plan.featured ? 'bg-white/20' : 'bg-[var(--primary)]/10 text-[var(--primary)]') : 'bg-red-500/10 text-red-500'}`}>
                      {benefit.included ? <Check size={16} /> : <X size={16} />}
                    </div>
                    <span className={!benefit.included ? 'opacity-40' : ''}>{benefit.text}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/register" 
                className={`w-full py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4 transition-all ${
                  plan.featured 
                  ? 'bg-white text-[var(--primary)] hover:bg-zinc-100 shadow-xl' 
                  : 'bg-[var(--primary)] text-white hover:scale-105 shadow-xl shadow-[var(--primary)]/20'
                }`}
              >
                {plan.cta} <ArrowRight size={20} />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 italic">
             ¿Tienes más de 10 sedes? <Link href="/contacto" className="text-[var(--primary)] underline underline-offset-8 decoration-2">Contáctanos para un Plan Enterprise</Link>
           </p>
        </div>
      </div>
    </PublicLayout>
  );
}
