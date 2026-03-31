// ✅ SERVER COMPONENT — Renderizado en servidor, indexable por Google.
// ISR: Revalida datos del catálogo cada hora sin rebuild completo.
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck, ArrowRight, CheckCircle2, Factory,
  Layers, Briefcase, Cpu, Target, Zap,
  MessageSquare, Share2, MousePointer2, Smartphone,
} from "lucide-react";
import { showcaseService, FeaturedProduct } from "@/lib/showcase-service";
import PublicLayout from "@/components/layout/PublicLayout";
import { formatCurrency } from "@/lib/currency-utils";
import { getTranslations } from "next-intl/server";
import HomeProductGrid from "./_components/HomeProductGrid";

// ISR: revalidar cada hora — balance entre frescura y performance
export const revalidate = 3600;

export default async function Home() {
  const t = await getTranslations("Index");

  // Datos obtenidos en SERVIDOR — invisible para el usuario, rápido para Google
  let featured: FeaturedProduct[] = [];
  try {
    featured = await showcaseService.getFeaturedProducts(6);
  } catch (e) {
    console.error("Error fetching featured products:", e);
  }

  return (
    <PublicLayout>
      <div className="flex flex-col min-h-screen bg-transparent text-slate-900 selection:bg-[var(--cat-yellow)] selection:text-black">

        {/* ── SEO: Organization + WebSite Schema ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "B2B Empresas",
                "url": "https://www.b2bempresas.com",
                "logo": "https://www.b2bempresas.com/logo/logo-full.png",
                "description": "Infraestructura Digital B2B de alta precisión para el Sector Industrial de Latinoamérica.",
                "areaServed": ["PE", "CL", "CO", "MX", "AR", "BR"],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "customer support",
                  "availableLanguage": ["Spanish", "Portuguese", "English"],
                  "url": "https://wa.me/51990670153"
                },
                "sameAs": [
                  "https://www.linkedin.com/company/b2bempresas",
                  "https://www.facebook.com/b2bempresas"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "B2B Empresas",
                "url": "https://www.b2bempresas.com",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://www.b2bempresas.com/marketplace?query={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              }
            ])
          }}
        />

        {/* ── Hero Section v6.0 ── */}
        <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-transparent pt-4 pb-32">

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl space-y-10 text-left">

              {/* ── Badge de Gestión (Reposicionado y Compacto) ── */}
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-400 animate-reveal shadow-sm mb-1">
                <Zap size={16} fill="currentColor" className="text-[var(--cat-yellow-dark)] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">
                  GESTIÓN - DESARROLLO - SOLUCIONES EMPRESARIALES
                </span>
              </div>

              <div className="space-y-0">
                <h1 className="text-7xl md:text-9xl lg:text-[11.5rem] font-black leading-[0.8] tracking-tightest uppercase italic animate-reveal [animation-delay:200ms] flex flex-col items-start overflow-visible -mt-1">
                  <span className="text-slate-950 block">LA RED</span>
                  <span className="text-[#4B6319] block animate-neon-flicker relative pb-4">
                    MAES<span className="decorated-t">T</span>RA
                  </span>
                  <span className="text-slate-950 block text-5xl md:text-7xl lg:text-[7rem] -mt-2">
                    PARA SU EMPRESA
                  </span>
                </h1>
              </div>

              <p className="text-lg md:text-xl text-[var(--panel-subtext)] font-bold max-w-2xl leading-relaxed animate-reveal [animation-delay:400ms]">
                {t("hero_desc")}
              </p>

              {/* WhatsApp Alert Integration v6.0 */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl inline-flex items-center gap-4 animate-reveal [animation-delay:500ms]">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-black">
                  <MessageSquare size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Nueva v6.0</p>
                  <p className="text-xs font-bold text-zinc-600">Alertas WhatsApp: Sabrás cuándo te visitan en tiempo real.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-8 animate-reveal [animation-delay:600ms]">
                <Link
                  href="#soluciones"
                  className="bg-white border-4 border-slate-900 px-24 py-7 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-[var(--cat-yellow)] hover:text-black hover:border-[var(--cat-yellow-dark)] transition-all flex items-center justify-center shadow-2xl active:scale-95 md:min-w-[450px]"
                >
                  SABER MAS DE NOSOTROS - B2B
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[var(--primary)]/10 to-transparent pointer-events-none" />
        </section>

        {/* ── SOLUCIONES CORPORATIVAS B2B ── */}
        <section id="soluciones" className="py-24 bg-transparent relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-[var(--strong-text)] uppercase italic">
                {t("solutions_title") || "SOLUCIONES CORPORATIVAS B2B"}
              </h2>
              <div className="w-20 h-2 bg-[var(--primary)] mb-6" />
              <p className="text-lg text-[var(--panel-subtext)] font-bold italic opacity-70">
                {t("solutions_desc")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { title: "INTELIGENCIA COMERCIAL", desc: "Mapeo y segmentación de oportunidades en mercados corporativos.", icon: Layers },
                { title: "PLATAFORMA SAAS INDUSTRIAL", desc: "Despliegue automático de Catálogos Digitales PWA para cada proveedor.", icon: Cpu },
                { title: "ALIANZAS ESTRATÉGICAS", desc: "Conexión vertical entre fabricantes, importadores y el usuario final.", icon: Target },
              ].map((item, i) => (
                <div key={i} className="bg-white p-12 rounded-[3.5rem] border-2 border-slate-100 hover:border-[var(--cat-yellow)] transition-all group shadow-xl">
                  <div className="w-20 h-20 bg-slate-50 border-2 border-slate-50 rounded-3xl flex items-center justify-center text-slate-400 mb-10 group-hover:bg-[var(--cat-yellow)] group-hover:text-black group-hover:border-black transition-all">
                    <item.icon size={36} />
                  </div>
                  <h3 className="text-xl font-black mb-4 uppercase tracking-tighter italic text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-400 font-bold leading-relaxed mb-10 uppercase tracking-wide italic">{item.desc}</p>
                  <Link href="/register" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-3 group-hover:gap-5 transition-all">
                    {t("know_more")} <ArrowRight size={16} className="text-[var(--cat-yellow-dark)]" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RECURSOS ESTRATÉGICOS ── */}
        <section id="recursos" className="py-24 bg-transparent relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-[var(--strong-text)] uppercase italic">
                {t("resources_title") || "RECURSOS ESTRATÉGICOS"}
              </h2>
              <div className="w-20 h-2 bg-[var(--primary)] mx-auto mb-6" />
              <p className="text-sm text-[var(--panel-subtext)] font-bold opacity-60">
                {t("resources_desc")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: "ENTORNO DIGITAL DE PRECISIÓN", desc: "Infraestructura escalable que soporta integraciones masivas de catálogos.", sub: "SEGURIDAD DE INFORMACIÓN", icon: ShieldCheck },
                { title: "LOGÍSTICA Y OPERACIONES B2B", desc: "Documentación de procedimientos, plantillas de licitaciones y guías.", sub: "POLÍTICAS DE CALIDAD", icon: Factory },
              ].map((item, i) => (
                <div key={i} className="bg-white p-12 rounded-[3.5rem] border-2 border-zinc-100 flex gap-8 items-center shadow-sm hover:shadow-xl transition-all">
                  <div className="w-20 h-20 bg-zinc-50 rounded-2xl flex items-center justify-center text-[var(--primary)] shrink-0">
                    <item.icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-[var(--strong-text)] mb-3">{item.title}</h3>
                    <p className="text-sm text-[var(--panel-subtext)] font-medium leading-relaxed mb-4 opacity-70">{item.desc}</p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] flex items-center gap-2 cursor-pointer">
                      {item.sub} <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CÓMO FUNCIONA ── */}
        <section id="como-funciona" className="py-32 bg-transparent relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-[var(--strong-text)] uppercase italic">
                En solo <span className="text-[var(--primary)]">3 pasos</span>
              </h2>
              <p className="text-lg text-[var(--panel-subtext)] font-bold italic">
                La plataforma más rápida y sencilla para digitalizar tu oferta industrial.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-20 relative">
              <div className="hidden md:block absolute top-[45%] left-0 w-full h-1 bg-[var(--cat-yellow)]/20 z-0" />
              {[
                { step: "01", title: "Crea tu Catálogo", desc: "Regístrate con tu RUC y sube las fotos de tus productos. Nosotros generamos tu vitrina profesional al instante.", Icon: MousePointer2 },
                { step: "02", title: "Comparte el Link", desc: "Envía tu link único por WhatsApp, correo o redes sociales. Sin que tus clientes descarguen nada.", Icon: Share2 },
                { step: "03", title: "Recibe la Alerta", desc: "Cada vez que un cliente abra tu catálogo, te avisaremos inmediatamente vía WhatsApp para que cierres la venta.", Icon: MessageSquare },
              ].map((item, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-32 h-32 rounded-[3.5rem] bg-white border-4 border-slate-100 shadow-2xl flex items-center justify-center text-slate-800 mb-10 group-hover:scale-110 group-hover:border-[var(--cat-yellow)] transition-all duration-500 relative">
                    <div className="absolute -top-6 -left-6 w-14 h-14 bg-[var(--cat-yellow)] text-black border-4 border-white rounded-2xl flex items-center justify-center font-black italic shadow-xl text-xl">
                      {item.step}
                    </div>
                    <item.Icon size={48} />
                  </div>
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter text-slate-900 italic">{item.title}</h3>
                  <p className="text-[12px] text-slate-400 font-bold leading-relaxed max-w-[280px] mx-auto uppercase tracking-widest italic">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTORES INDUSTRIALES ── */}
        <section id="sectores" className="py-24 bg-transparent relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-[var(--strong-text)] uppercase italic">
                {t("sectors_title") || "SECTORES INDUSTRIALES"}
              </h2>
              <div className="w-20 h-2 bg-[var(--primary)] mx-auto mb-6" />
              <p className="text-sm text-[var(--panel-subtext)] font-bold opacity-60 italic">
                {t("sectors_desc")}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["MINERÍA", "CONSTRUCCIÓN", "AGROINDUSTRIA", "ENERGÍA Y GAS", "METALMECÁNICA", "LOGÍSTICA", "SERVICIOS IT B2B", "MANUFACTURA"].map((sector, i) => (
                <div key={i} className="bg-white border border-zinc-200 py-6 px-4 rounded-2xl text-center font-black text-xs tracking-widest text-zinc-400 hover:text-[var(--primary)] hover:border-[var(--primary)] hover:shadow-lg transition-all cursor-pointer uppercase">
                  {sector}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── IDENTIDAD ── */}
        <section id="identidad" className="py-24 bg-transparent relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-[var(--strong-text)] uppercase italic">
                {t("identity_title") || "IDENTIDAD"}{" "}
                <span className="text-[var(--primary)]">{t("identity_subtitle") || "INDUSTRIAL"}</span>
              </h2>
              <div className="w-20 h-2 bg-[var(--primary)] mx-auto" />
            </div>

            <div className="max-w-5xl mx-auto bg-[#556B2F] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-10 grayscale">
                <Image src="/hero.webp" alt="Fondo identidad industrial B2B" fill className="object-cover" sizes="100vw" />
              </div>
              <div className="relative z-10 space-y-8">
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic">
                  CONFIABILIDAD, PRECISIÓN E INNOVACIÓN CONTINUA.
                </h3>
                <p className="text-white/80 text-lg font-medium leading-relaxed max-w-3xl mx-auto">
                  {t("identity_desc")}
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  {["CONFIANZA", "SOSTENIBILIDAD", "INVERSORES"].map((btn, i) => (
                    <Link key={i} href={`/${btn.toLowerCase()}`} className="px-8 py-3 rounded-full border border-white/30 text-white font-black text-xs tracking-widest hover:bg-white hover:text-[#556B2F] transition-all">
                      {btn}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFICIOS ── */}
        <section className="py-24 bg-transparent border-y-2 border-slate-50/10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { title: "Catálogo Propio", desc: "Identidad visual premium que transmite confianza industrial.", icon: Briefcase },
                { title: "Integración WhatsApp", desc: "Comunicación directa sin intermediarios ni comisiones.", icon: Smartphone },
                { title: "Alerta Instantánea", desc: "Sabe exactamente cuándo tienes un prospecto caliente.", icon: Zap },
              ].map((benefit, i) => (
                <div key={i} className="flex gap-8 items-start group">
                  <div className="p-6 bg-slate-50 rounded-3xl text-slate-300 border-2 border-slate-50 shrink-0 shadow-inner group-hover:bg-[var(--cat-yellow)] group-hover:text-black group-hover:border-black transition-all duration-300">
                    <benefit.icon size={28} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-2 italic">{benefit.title}</h4>
                    <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest italic">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── VALIDACIÓN SUNAT ── */}
        <section className="py-32 bg-transparent text-foreground relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[var(--cat-yellow)]" />
          <div className="container mx-auto px-6">
            <div className="bg-white/5 border border-white/10 p-12 md:p-24 rounded-[5rem] flex flex-col md:flex-row items-center gap-20 backdrop-blur-3xl shadow-4xl">
              <div className="w-56 h-56 bg-white p-8 rounded-[3.5rem] shrink-0 rotate-3 shadow-4xl flex items-center justify-center border-8 border-slate-900">
                <Image src="/logo/logo-icon.png" alt="Verificación SUNAT — B2B Empresas" width={140} height={140} className="object-contain grayscale contrast-125" />
              </div>
              <div className="space-y-8 text-center md:text-left">
                <div className="inline-block px-6 py-2 bg-[var(--cat-yellow)] text-black rounded-full shadow-lg">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">SISTEMA DE VERIFICACIÓN CAT</span>
                </div>
                <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
                  Identidad <br /> <span className="text-[var(--cat-yellow)]">SUNAT</span> Verificada
                </h3>
                <p className="text-lg md:text-xl text-slate-400 font-bold leading-relaxed max-w-2xl italic">
                  Solo empresas con RUC activo pueden operar. Esto garantiza una red exclusiva de negocios formales, eliminando el spam industrial.
                </p>
                <div className="flex flex-wrap gap-8 justify-center md:justify-start pt-4">
                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-500">
                    <ShieldCheck size={20} className="text-[var(--cat-yellow)]" /> CONSULTA RUC
                  </div>
                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-500">
                    <ShieldCheck size={20} className="text-[var(--cat-yellow)]" /> ANTI-FRAUDE industrial
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIOS ── */}
        <section className="py-32 bg-transparent">
          <div className="container mx-auto px-6">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-slate-900">
                Socios <span className="text-[var(--cat-yellow-dark)]">Activos</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                { quote: "Gracias a la alerta instantánea de WhatsApp, puedo llamar al cliente justo cuando está viendo mi ficha técnica. He cerrado 30% más ventas este mes.", author: "Gerente Comercial - Suministros SAC", rating: 5 },
                { quote: "Tener mi propio catálogo digital con validación SUNAT nos dio la formalidad que necesitábamos para venderle a las grandes mineras.", author: "Director Operativo - Maquinarias del Sur", rating: 5 },
                { quote: "La plataforma es increíblemente fácil de usar. Subí 100 productos en una tarde y ya tengo mi vitrina funcionando.", author: "Fundador - TechParts CAT", rating: 5 },
              ].map((testimony, i) => (
                <div key={i} className="bg-white p-12 rounded-[4rem] border-2 border-slate-100 space-y-8 shadow-2xl relative">
                  <div className="flex gap-1 text-[var(--cat-yellow-dark)]">
                    {Array(testimony.rating).fill(0).map((_, j) => (
                      <CheckCircle2 key={j} size={20} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xl font-bold italic text-slate-900 leading-relaxed uppercase tracking-tight">"{testimony.quote}"</p>
                  <div className="pt-6 border-t-2 border-slate-50">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{testimony.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATÁLOGO MAESTRO B2B ── */}
        <section id="catalogo" className="py-24 bg-transparent relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-[var(--strong-text)]">
                  {t("catalog_title") || "CATÁLOGO MAESTRO B2B"}
                </h2>
                <p className="text-lg text-[var(--panel-subtext)] font-bold max-w-2xl mx-auto opacity-70">
                  Explora millones de suministros vinculados directamente al Catálogo Maestro B2B (CMb2b).
                </p>
              </div>

              {/* Client Component: búsqueda interactiva + grilla */}
              <HomeProductGrid
                featured={featured}
                searchPlaceholder={t("search_placeholder") || "Buscar SKU-CUIM, Código, Nombre..."}
                searchBtn={t("search_btn") || "BUSCAR PRODUCTO"}
                catalogEmpty={t("catalog_empty") || "EL CATÁLOGO MAESTRO SE ENCUENTRA EN ACTUALIZACIÓN."}
              />
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="py-32 bg-transparent relative overflow-hidden">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-5xl mx-auto bg-slate-900 p-12 md:p-24 rounded-[5rem] space-y-12 relative overflow-hidden shadow-4xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--cat-yellow)]/10 blur-[150px] -mr-48 -mt-48" />
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic text-white leading-none">
                ¿Listo para <br />
                <span className="text-[var(--cat-yellow)]">Liderar?</span>
              </h2>
              <p className="text-xl text-slate-400 font-bold uppercase tracking-widest italic leading-relaxed">
                ÚNETE A LA RED DE PROVEEDORES <br /> MÁS CONFIABLE DE LATINOAMÉRICA.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-8 pt-4">
                <Link href="/register" className="bg-[var(--cat-yellow)] text-black px-12 py-7 rounded-[2rem] font-black uppercase text-xl tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-cat border-b-8 border-[var(--cat-yellow-dark)] active:border-b-0">
                  Comenzar Gratis
                </Link>
                <Link href="https://wa.me/51990670153" className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-12 py-7 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all">
                  <MessageSquare size={24} /> Contacto Directo
                </Link>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic">
                REGISTRO RUC | SIN TARJETAS | 100% SEGURO
              </p>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
