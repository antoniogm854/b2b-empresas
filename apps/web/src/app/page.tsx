"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowRight, CheckCircle2, Factory, TrendingUp, Search, Layers, Briefcase, BarChart, Cpu, Target, Users, Zap, ChevronRight } from "lucide-react";
import { 
  adService, 
  FeaturedProduct 
} from "@/lib/ad-service";
import MainLayout from "@/components/layout/MainLayout";
import { formatCurrency } from "@/lib/currency-utils";
import { useTranslations } from "next-intl";

export default function Home() {
  const [featured, setFeatured] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Index");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const productsData = await adService.getFeaturedProducts(6); 
        setFeatured(productsData);
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-[var(--accent)] selection:text-[var(--strong-text)]">
        
        {/* SEO Industrial Infrastructure */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "b2bempresas.com",
              "url": "https://b2bempresas.com",
              "logo": "https://b2bempresas.com/logo/logo-full.png",
              "description": "SOMOS UNA EMPRESA ESPECIALISTAS EN SOLUCIONES INTEGRALES PARA EL ECOSISTEMA CORPORATIVO B2B",
            })
          }}
        />

        {/* Hero Section v1.01 */}
        <section className="relative min-h-[95vh] flex items-start overflow-hidden bg-transparent pt-16 pb-24 border-b border-[var(--border)]/10">
          {/* Fondo Texturizado Sutil */}
          <div className="absolute inset-0 z-0 opacity-20">
            {mounted && (
              <Image 
                src="/hero.webp" 
                alt="Industrial Background" 
                fill 
                className="grayscale object-cover object-bottom"
                priority
                fetchPriority="high"
                suppressHydrationWarning
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--deep-section)]/80 via-transparent to-[var(--deep-section)]"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10 flex flex-col items-center md:items-start text-center md:text-left mt-10 md:mt-12">
            <div className="max-w-[6xl] lg:w-[90%] space-y-10">
              
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[var(--border)] glass text-[var(--primary)] animate-fade-in mx-auto md:mx-0 shadow-sm">
                <Zap size={16} fill="currentColor" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-widest italic">
                  {t('badge')}
                </span>
              </div>
              
               <h1 className="text-[3.2rem] sm:text-7xl md:text-[6rem] lg:text-[8rem] xl:text-[9.5rem] 2xl:text-[11rem] font-black text-[var(--strong-text)] leading-[0.7] tracking-tighter uppercase italic animate-fade-in-up [animation-delay:200ms]">
                <span className="block drop-shadow-2xl">La Red</span>
                <span className="text-[var(--accent)] underline decoration-8 decoration-[var(--accent)]/30 underline-offset-[-10px] block drop-shadow-2xl">
                  Maestra
                </span>
                <span className="block drop-shadow-2xl text-[0.85em] mt-2">
                  {t('title').split(' ').slice(3).join(' ')}
                </span>
              </h1>

              <div className="flex flex-col items-center md:items-start gap-8 animate-fade-in-up delay-300">
                <p className="text-sm md:text-base lg:text-lg text-[var(--foreground)] opacity-90 font-bold max-w-4xl leading-[1.1] tracking-wide">
                  {t('hero_desc')}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 pt-6 w-full sm:w-auto">
                  <Link 
                    href="#soluciones" 
                    className="group bg-[var(--accent)] text-[var(--strong-text)] px-8 py-5 rounded-2xl hover:scale-105 hover:bg-white transition-all flex items-center justify-center gap-4 text-center shadow-[0_20px_40px_-10px_rgba(162,195,103,0.3)] border border-[var(--accent)]/50" 
                  >
                    <span className="text-lg font-black uppercase tracking-tight">{t('cta')}</span>
                    {mounted && <ArrowRight size={24} className="group-hover:translate-x-1 duration-300" />}
                  </Link>
                </div>
              </div>

            </div>
          </div>
          
          <div className="absolute right-0 bottom-0 w-2/3 h-2/3 bg-[var(--primary)]/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>
        </section>

        {/* C. SOLUCIONES */}
        <section id="soluciones" className="py-24 bg-transparent relative">
          <div className="container mx-auto px-6">
            <div className="text-center md:text-left max-w-4xl mx-auto md:mx-0 mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-[var(--strong-text)] uppercase">
                {t('solutions_title').split(' ').slice(0,1).join(' ')} <span className="text-[var(--primary)]">{t('solutions_title').split(' ').slice(1).join(' ')}</span>
              </h2>
              <div className="h-1.5 w-20 bg-[var(--accent)] mx-auto md:mx-0 mb-8 rounded-full" />
              <p className="text-lg text-[var(--muted-foreground)] font-medium">
                {t('solutions_desc')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Inteligencia Comercial",
                  desc: "Mapeo y segmentación de oportunidades en mercados corporativos, cruzando demanda de compradores y capacidad de proveedores.",
                  icon: <BarChart size={28} />
                },
                {
                  title: "Plataforma SaaS Multi-tenant",
                  desc: "Despliegue automático de Catálogos Digitales PWA (Progressive Web Apps) para cada proveedor bajo nuestro paraguas tecnológico.",
                  icon: <Cpu size={28} />
                },
                {
                  title: "Alianzas Estratégicas",
                  desc: "Conexión vertical entre fabricantes, importadores y el usuario final corporativo evitando intermediarios ineficientes.",
                  icon: <Target size={28} />
                }
              ].map((feature, i) => (
                <div key={i} className="group p-10 rounded-3xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/30 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col">
                  <div className="w-16 h-16 bg-[var(--muted)] text-[var(--primary)] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300" suppressHydrationWarning>
                    {mounted && feature.icon}
                  </div>
                  <h3 className="text-xl font-black mb-4 tracking-tight uppercase text-[var(--strong-text)]">{feature.title}</h3>
                  <p className="text-[var(--muted-foreground)] leading-relaxed font-medium text-sm flex-grow">{feature.desc}</p>
                  <div className="mt-8 pt-6 border-t border-[var(--border)]">
                    <Link href={i === 0 ? "/marketing" : i === 1 ? "/socios" : "/socios"} className="text-[var(--primary)] text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                       {t('know_more')} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* D. RECURSOS */}
        <section id="recursos" className="py-24 bg-[var(--card)]/30 backdrop-blur-sm relative border-y border-[var(--border)]/10">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-[var(--strong-text)] uppercase">
                {t('resources_title').split(' ').slice(0,1).join(' ')} <span className="text-[var(--primary)]">{t('resources_title').split(' ').slice(1).join(' ')}</span>
              </h2>
              <div className="h-1.5 w-20 bg-[var(--accent)] mx-auto mb-8 rounded-full" />
              <p className="text-lg text-[var(--muted-foreground)] font-medium">
                {t('resources_desc')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[var(--background)] rounded-3xl p-10 border border-[var(--border)] flex gap-6 group hover:shadow-xl transition-all">
                <div className="bg-[var(--card)] p-4 rounded-2xl shadow-sm h-fit group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                  <Briefcase className="text-[var(--primary)] group-hover:text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black mb-2 uppercase text-[var(--strong-text)]">Entorno Digital de Precisión</h3>
                  <p className="text-sm font-medium text-[var(--muted-foreground)] leading-relaxed mb-4">Infraestructura escalable que soporta integraciones masivas de catálogos, certificaciones de producto, bases de datos de proveedores evaluados e históricos de precios mayoristas corporativos.</p>
                  <Link href="/security" className="text-[var(--primary)] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    SEGURIDAD DE INFORMACIÓN <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
              <div className="glass rounded-3xl p-10 border border-[var(--border)] flex gap-6 group hover:shadow-xl transition-all">
                <div className="bg-[var(--card)] p-4 rounded-2xl shadow-sm h-fit group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                  <Layers className="text-[var(--primary)] group-hover:text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black mb-2 uppercase text-[var(--strong-text)]">Logística y Operaciones B2B</h3>
                  <p className="text-sm font-medium text-[var(--muted-foreground)] leading-relaxed mb-4">Documentación de procedimientos, plantillas de licitaciones estandarizadas y guías de importación directa a nivel Latinoamérica para reducir fricción en las compras internacionales.</p>
                  <Link href="/quality" className="text-[var(--primary)] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    POLÍTICAS DE CALIDAD <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* E. SECTORES */}
        <section id="sectores" className="py-24 bg-[var(--background)] relative">
          <div className="container mx-auto px-6">
            <div className="text-center md:text-left max-w-4xl mx-auto md:mx-0 mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-[var(--strong-text)] uppercase">
                {t('sectors_title').split(' ').slice(0,1).join(' ')} <span className="text-[var(--primary)]">{t('sectors_title').split(' ').slice(1).join(' ')}</span>
              </h2>
              <div className="h-1.5 w-20 bg-[var(--accent)] mx-auto md:mx-0 mb-8 rounded-full" />
              <p className="text-lg text-[var(--muted-foreground)] font-medium">
                {t('sectors_desc')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Minería', 'Construcción', 'Agroindustria', 'Energía y Gas', 'Metalmecánica', 'Logística', 'Servicios IT B2B', 'Manufactura'].map((sector, i) => (
                <div key={i} className="group glass p-6 rounded-2xl shadow-sm hover:shadow-xl hover:bg-[var(--primary)] transition-all duration-300 border border-[var(--border)]">
                  <h3 className="text-sm font-black uppercase text-center text-[var(--foreground)] group-hover:text-[var(--primary-foreground)] transition-colors">{sector}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* F. IDENTIDAD */}
        <section id="identidad_section" className="py-24 bg-[var(--card)] relative">
          <div className="container mx-auto px-6 text-center">
             <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-[var(--strong-text)] uppercase">
                {t('identity_title')} <span className="text-[var(--primary)]">{t('identity_subtitle').split(' ').slice(1).join(' ')}</span>
              </h2>
              <div className="h-1.5 w-20 bg-[var(--accent)] mx-auto mb-12 rounded-full" />
              <div className="bg-[var(--deep-section)] text-white p-12 rounded-3xl max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/hero.webp')] bg-cover mix-blend-overlay"></div>
                <div className="relative z-10">
                  <Users size={48} className="text-[var(--accent)] mx-auto mb-6" />
                  <p className="text-xl md:text-2xl font-black uppercase tracking-tight leading-relaxed mb-8 text-white">
                    Confiabilidad, Precisión e Innovación Continua.
                  </p>
                  <p className="text-white/80 font-medium max-w-2xl mx-auto mb-10">
                    Nacimos ante la necesidad de modernizar las cadenas de abastecimiento pesado. Somos más que un buscador, somos la columna vertebral tecnológica del aprovisionamiento empresarial en Latinoamérica garantizando transparencia, control de calidad y negociaciones sin intermediarios.
                  </p>
                  <div className="flex flex-wrap justify-center gap-6">
                    <Link href="/confianza" className="px-6 py-3 border border-white/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-[var(--deep-section)] transition-all">
                      CONFIANZA
                    </Link>
                    <Link href="/sostenibilidad" className="px-6 py-3 border border-white/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-[var(--deep-section)] transition-all">
                      SOSTENIBILIDAD
                    </Link>
                    <Link href="/inversores" className="px-6 py-3 border border-white/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-[var(--deep-section)] transition-all">
                      INVERSORES
                    </Link>
                  </div>
                </div>
              </div>
          </div>
        </section>

        {/* G. BUSCADOR PRODUCTOS INDUSTRIALES B2B & H. CATALOGO MAESTRO B2B */}
        <section id="catalogo-maestro" className="py-32 bg-[var(--background)] relative border-t border-[var(--border)]">
          <div className="container mx-auto px-6">
            
            {/* Buscador */}
            <div className="bg-[var(--card)] p-8 md:p-12 rounded-[2rem] shadow-xl border border-[var(--border)] -mt-48 relative z-20 mb-20 max-w-5xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[var(--strong-text)] mb-4">
                {t('catalog_title')}
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] font-medium mb-8">Explora millones de suministros vinculados directamente al Catálogo Maestro B2B (CMb2b).</p>
              
              <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={24} />
                  <input 
                    type="text" 
                    placeholder={t('search_placeholder')}
                    className="w-full bg-[var(--background)] border-2 border-[var(--border)] text-lg sm:text-xl py-6 pl-16 pr-6 rounded-2xl focus:outline-none focus:border-[var(--primary)] focus:bg-[var(--card)] text-[var(--foreground)] transition-colors"
                  />
                </div>
                <button className="bg-[var(--primary)] text-white px-10 py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-[var(--deep-section)] transition-colors shadow-lg shadow-[var(--primary)]/20 whitespace-nowrap">
                  {t('search_btn')}
                </button>
              </div>
            </div>

            {/* Catálogo Maestro B2B info */}
            <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-3xl">
                <div className="flex flex-col">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4 text-[var(--strong-text)]">
                    Catálogo Maestro <span className="text-[var(--primary)]">B2B</span>
                  </h2>
                  <p className="text-[var(--muted-foreground)] font-medium text-lg leading-relaxed">
                    Estandarizamos los datos de cada producto industrial a través del Código Único de Identificación Maestro <strong className="text-[var(--strong-text)]">(SKU-CUIM)</strong>. 
                  </p>
                </div>
              </div>
            </div>

            {/* Productos Cards del CMb2b */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-[480px] bg-[var(--card)] animate-pulse rounded-3xl" />
                ))
              ) : featured.length > 0 ? (
                featured.map((product: FeaturedProduct) => (
                  <div key={product.id} className="group bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden hover:border-[var(--accent)] hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative">
                    {/* Badge CMb2b */}
                    <div className="absolute top-4 right-4 z-10 bg-[var(--primary)] text-[10px] text-white font-black px-3 py-1 rounded shadow-md uppercase tracking-widest">
                      CMb2b
                    </div>
                    
                    <div className="aspect-[4/3] bg-[var(--muted)] relative overflow-hidden flex-shrink-0">
                      {mounted && (
                        <Image 
                          src={product.image_url || "/hero.webp"} 
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                        />
                      )}
                      <div className="absolute top-4 left-4 flex gap-2">
                         <span className="bg-white/90 backdrop-blur-sm text-[var(--primary)] text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                           <ShieldCheck size={12} className="text-[var(--accent)]" /> Verificado
                         </span>
                      </div>
                    </div>
                    
                    <div className="p-8 flex flex-col flex-grow bg-[var(--card)]">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[9px] font-black tracking-widest uppercase text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-1 rounded">SKU-CUIM: AUTO{product.id.substring(0,6)}</span>
                      </div>
                      
                      <h3 className="text-xl font-black tracking-tight leading-snug group-hover:text-[var(--primary)] transition-colors uppercase mb-6 text-[var(--strong-text)] flex-grow">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-end justify-between mt-auto pt-4 border-t border-[var(--border)]">
                        <p className="text-xl font-black text-[var(--strong-text)]">
                          {formatCurrency(product.price)}
                        </p>
                        <button className="text-[var(--primary)] text-sm font-black uppercase hover:underline flex items-center gap-1 group/btn">
                           Ver Ficha Técnica <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-24 bg-[var(--card)] border-2 border-dashed border-[var(--border)] rounded-3xl text-center flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-[var(--muted)] rounded-full flex items-center justify-center text-[var(--muted-foreground)] shadow-sm" suppressHydrationWarning>
                    {mounted && <TrendingUp size={32} />}
                  </div>
                  <p className="font-bold text-[var(--muted-foreground)] uppercase tracking-widest text-sm">{t('catalog_empty')}</p>
                </div>
              )}
            </div>

            {/* Fin Catálogo Maestro B2B info */}

          </div>
        </section>

        {/* Global Floating Actions */}
      </div>
    </MainLayout>
  );
}
