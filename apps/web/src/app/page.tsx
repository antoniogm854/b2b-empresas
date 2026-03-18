"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Package, 
  TrendingUp,
  ChevronRight,
  Smartphone,
  CheckCircle2
} from "lucide-react";
import { 
  adService, 
  FeaturedProduct 
} from "@/lib/ad-service";
import { adminService } from "@/lib/admin-service";
import { settingsService, SiteSettings } from "@/lib/settings-service";
import MainLayout from "@/components/layout/MainLayout";
import { formatCurrency } from "@/lib/currency-utils";

export default function Home() {
  const [featured, setFeatured] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, s, settings] = await Promise.all([
          adService.getFeaturedProducts(6), // Pass 6 as argument for count
          adminService.getGlobalStats(),
          settingsService.getSettings()
        ]);
        setFeatured(productsData); // Use setFeatured to update the state
        setStats(s);
        setSiteSettings(settings);
      } catch (e) {
        console.error("Error fetching data:", e); // Changed error message
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-accent/30">
      {/* SEO Industrial Infrastructure */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "b2bempresas.com",
            "url": "https://b2bempresas.com",
            "logo": "https://b2bempresas.com/logo.png",
            "description": "GESTION - DESARROLLO - SOLUCIONES EMPRESARIALES para el sector Industrial.",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+51-000-0000",
              "contactType": "master control"
            }
          })
        }}
      />

      {/* Navigation */}
      <header 
        id="main-header" 
        className={`fixed top-0 z-50 w-full transition-all duration-500 border-b ${
          mounted && scrolled 
            ? "glass border-border/50 translate-y-0" 
            : "bg-transparent border-transparent"
        }`}
      >
        <div className={`container flex items-center justify-between mx-auto px-6 transition-all duration-500 ${
          mounted && scrolled ? "h-20" : "h-28"
        }`}>
          <Link href="/" id="site-logo" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
              <Image 
                src="/logo/logo-icon.png" 
                alt="Logo Icon" 
                width={48}
                height={48}
                className="object-contain"
                priority
                suppressHydrationWarning
              />
            </div>
            <div className="relative w-48 h-10">
              <Image 
                src="/logo/logo-text.png" 
                alt="B2B Empresas" 
                width={192}
                height={40}
                className="object-contain logo-emerald"
                priority
                suppressHydrationWarning
              />
            </div>
          </Link>
          
          <nav id="top-nav" className="hidden lg:flex gap-8 text-sm font-black uppercase tracking-widest text-muted-foreground">
            {["CORPORATIVO", "SOPORTE OPERATIVO", "EMPRESAS", "IDENTIDAD"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} id={`nav-${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-accent transition-colors">{item}</a>
            ))}
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

      <main className="flex-grow pt-20 font-sans cursor-default">
        {/* Hero Section */}
        <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-primary pt-24 pb-48 sm:pb-24">
          <div className="absolute inset-0 z-0 opacity-15">
            {mounted && (
              <Image 
                src="/hero.webp" 
                alt="Industrial Background" 
                fill 
                className="grayscale object-cover"
                priority
                fetchPriority="high"
                suppressHydrationWarning
              />
            )}
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl space-y-12">
              <div className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-accent/20 border border-accent/30 text-accent animate-fade-in mb-4 sm:mb-0" suppressHydrationWarning>
                {mounted && <Zap size={18} className="animate-pulse" />}
                <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest italic text-accent/80">GESTION - DESARROLLO - SOLUCIONES EMPRESARIALES</span>
              </div>
              
               <h1 className="text-4xl sm:text-6xl md:text-[7.5rem] font-black text-primary-foreground leading-[0.9] sm:leading-[0.85] tracking-tightest uppercase italic animate-fade-in-up">
                La Red <br className="hidden sm:block" />
                <span className="text-accent underline decoration-4 sm:decoration-8 decoration-accent/30 underline-offset-[-5px] sm:underline-offset-[-10px]">Maestra</span> <br />
                <span className="whitespace-normal sm:whitespace-nowrap">Para su Empresa.</span>
              </h1>

              <div className="flex flex-col md:row items-start gap-10 animate-fade-in-up delay-200">
                <p className="text-xl md:text-2xl text-primary-foreground/70 font-bold max-w-xl leading-relaxed">
                  Conectamos proveedores líderes con compradores corporativos a través de un ecosistema inteligente de catálogos y aplicaciones de alto rendimiento.
                </p>
                <div className="flex flex-wrap gap-6 pt-4">
                  <Link 
                    href="/register" 
                    className="group bg-accent text-[#064e3b] px-8 sm:px-10 py-4 sm:py-5 rounded-full hover:scale-105 transition-transform flex flex-col items-center justify-center text-center shadow-2xl shadow-accent/20 leading-[0.9]" 
                    style={{ fontFamily: "'Bodoni MT Black', 'Bodoni MT', serif" }}
                    suppressHydrationWarning
                  >
                    <span className="text-[16px] sm:text-[20px] tracking-tight mb-1 whitespace-nowrap">SOPORTE OPERATIVO</span>
                    <span className="text-[24px] sm:text-[32px] tracking-tighter whitespace-nowrap">CATALOGO DIGITAL</span>
                  </Link>
                  <button 
                    className="bg-[#064e3b] text-primary-foreground border-2 border-white/20 px-8 py-4 rounded-2xl hover:bg-[#064e3b]/90 transition-all backdrop-blur-md flex flex-col items-center justify-center text-center leading-none"
                    style={{ fontFamily: "'Bodoni MT Black', 'Bodoni MT', serif" }}
                  >
                    <span className="text-xl uppercase tracking-[0.65em] mb-1">SOMOS TU</span>
                    <span className="text-3xl uppercase tracking-tighter">SOCIO ESTRATEGICO</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Marquee Section */}
        <section className="py-12 bg-muted border-y border-border/50 overflow-hidden relative">
          <div className="flex whitespace-nowrap animate-infinite-scroll">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-12 mx-12 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 pointer-events-none">
                <div className="relative w-32 h-12">
                   {mounted && (
                     <Image 
                       src="/logo/logo-text.png" 
                       alt="Industrial Partner" 
                       width={128}
                       height={48}
                       className="object-contain opacity-100" 
                       suppressHydrationWarning
                     />
                   )}
                </div>
                <div className="w-2 h-2 bg-accent rounded-full" />
              </div>
            ))}
            {/* Duplicate for infinite loop */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={`dup-${i}`} className="flex items-center gap-12 mx-12 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 pointer-events-none">
                <div className="relative w-32 h-12">
                   {mounted && (
                     <Image 
                       src="/logo/logo-text.png" 
                       alt="Industrial Partner" 
                       width={128}
                       height={48}
                       className="object-contain opacity-100" 
                       suppressHydrationWarning
                     />
                   )}
                </div>
                <div className="w-2 h-2 bg-accent rounded-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products Showcase (Empresas) */}
        <section id="empresas" className="py-32 bg-background relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 text-accent mb-4" suppressHydrationWarning>
                  {mounted && <Sparkles size={24} className="animate-spin-slow" />}
                  <span className="text-xs font-black uppercase tracking-widest italic">Vitrina Industrial Verificada</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tightest uppercase italic leading-none">
                  Suministros <span className="text-accent underline decoration-8 decoration-accent/10 underline-offset-[-5px]">Destacados</span>
                </h2>
                <p className="text-muted-foreground font-bold mt-8 text-xl max-w-lg">
                  Equipos industriales de alto rendimiento autorizados bajo estándares de control B2B Empresas.
                </p>
              </div>
              <button className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest bg-muted px-10 py-5 rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all shadow-xl shadow-black/5" suppressHydrationWarning>
                Explorar Todo el Catálogo {mounted && <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-[600px] bg-muted animate-pulse rounded-[3.5rem]" />
                ))
              ) : featured.length > 0 ? (
                featured.map((product: FeaturedProduct) => (
                  <div key={product.id} className="group bg-card rounded-[3.5rem] border-2 border-muted/50 overflow-hidden hover:border-accent transition-all duration-700 hover:shadow-4xl hover:shadow-accent/5 relative">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-accent/0 group-hover:bg-accent/5 transition-all duration-700 blur-3xl industrial-glow-hover opacity-0" />
                    <div className="aspect-[4/5] relative overflow-hidden">
                      {mounted && (
                        <Image 
                          src={product.image_url || "/hero.webp"} 
                          alt={product.name}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2000ms] ease-out"
                          suppressHydrationWarning
                        />
                      )}
                      <div className="absolute top-8 left-8 flex flex-col gap-3">
                         <span className="bg-primary text-primary-foreground text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest shadow-2xl flex items-center gap-2 backdrop-blur-md" suppressHydrationWarning>
                           {mounted && <ShieldCheck size={14} className="text-accent" />} Empresa Verificada
                         </span>
                         <span className="bg-accent text-primary text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest shadow-2xl w-fit">
                           En Stock
                         </span>
                      </div>
                    </div>
                    <div className="p-10 bg-gradient-to-b from-card to-muted/10">
                      <div className="flex justify-between items-start mb-8">
                        <div className="max-w-[70%]">
                          <p className="text-[10px] font-black uppercase text-muted-foreground/60 mb-1">Precio Unitario</p>
                          <p className="text-2xl font-black text-primary group-hover:text-accent transition-colors">
                            {formatCurrency(product.price)}
                          </p>
                          <h3 className="text-2xl md:text-3xl font-black tracking-tightest leading-tight group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-muted-foreground uppercase mb-1">Inversión</span>
                            <span className="font-black text-4xl text-primary italic leading-none">${product.price}</span>
                            <span className="text-[10px] font-bold text-muted-foreground/50 mt-1 uppercase tracking-tighter">Sin I.G.V</span>
                          </div>
                        </div>
                      </div>
                      <button className="w-full bg-secondary py-6 rounded-[1.8rem] font-black uppercase text-sm tracking-widest hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-3 shadow-xl group/btn" suppressHydrationWarning>
                         Solicitar Cotización Técnica {mounted && <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-32 bg-muted/20 border-4 border-dashed border-muted/50 rounded-[4rem] text-center flex flex-col items-center justify-center gap-6">
                  <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground" suppressHydrationWarning>
                    {mounted && <TrendingUp size={40} />}
                  </div>
                  <p className="font-black text-2xl text-muted-foreground uppercase tracking-widest max-w-sm">No hay suministros destacados autorizados hoy.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Background Decorative */}
          <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[200px] -translate-x-1/2" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px] translate-x-1/4 translate-y-1/4" />
        </section>

        {/* Corporativo Section (Features) */}
        <section id="corporativo" className="py-32 bg-secondary/5 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Ecosistema B2B <span className="italic text-accent">Total</span></h2>
              <div className="h-2 w-24 bg-accent mx-auto mb-8 rounded-full" />
              <p className="text-lg text-muted-foreground font-medium">
                Arquitectura diseñada para la máxima velocidad operativa y visibilidad SEO en el mercado global de suministros.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: "Catálogo Maestro (GCM)",
                  desc: "Estandarización absoluta de productos industriales con fichas técnicas inteligentes.",
                  icon: <Globe size={32} />
                },
                {
                  title: "SaaS Multi-tenant",
                  desc: "Cada proveedor obtiene una versión personalizada y optimizada de su catálogo en segundos.",
                  icon: <Package size={32} />
                },
                {
                  title: "Cloud Interconnect",
                  desc: "Sincronización total vía Supabase y Firebase para procesos de cotización en tiempo real.",
                  icon: <Zap size={32} />
                }
              ].map((feature, i) => (
                <div key={i} className="group p-10 rounded-[3rem] bg-card border border-border hover:border-accent hover:shadow-3xl hover:shadow-accent/5 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-10 group-hover:rotate-6 transition-transform" suppressHydrationWarning>
                    {mounted && feature.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Soporte Operativo Section (Apps) */}
        <section id="soporte-operativo" className="py-32 bg-primary relative overflow-hidden">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="animate-fade-in-left">
              <h2 className="text-4xl md:text-6xl font-black text-primary-foreground mb-8 tracking-tighter leading-none">
                TU PROPIA <span className="text-accent underline decoration-accent/30 decoration-8 underline-offset-8">APP B2B</span> <br />
                LISTA PARA ACTIVAR.
              </h2>
              <p className="text-xl text-primary-foreground/70 mb-12 leading-relaxed font-bold">
                No solo es una web. Cada proveedor puede **Activar su Catálogo Digital (CATÁLOGO DIGITAL)** como acceso directo para realizar pedidos offline y recibir notificaciones push de stock.
              </p>
              <div className="flex gap-6">
                <div className="bg-white/10 p-6 rounded-[2rem] border-2 border-white/20 backdrop-blur-md" suppressHydrationWarning>
                  {mounted && <Smartphone className="text-accent mb-4" size={32} />}
                  <p className="text-xs font-black text-accent uppercase tracking-widest mb-1 italic">CATÁLOGO DIGITAL</p>
                  <p className="text-sm text-primary-foreground font-bold italic">Catálogo Digital Interactivo</p>
                </div>
                <div className="bg-white/10 p-6 rounded-[2rem] border-2 border-white/20 backdrop-blur-md" suppressHydrationWarning>
                  {mounted && <TrendingUp className="text-accent mb-4" size={32} />}
                  <p className="text-xs font-black text-accent uppercase tracking-widest mb-1 italic">APP_CBA</p>
                  <p className="text-sm text-primary-foreground font-bold italic">Motor de Cotizaciones B2B</p>
                </div>
              </div>
            </div>
            
            <div className="relative group perspective-2000">
              <div className="bg-accent/10 border-[12px] border-accent/20 rounded-[5rem] p-6 rotate-3 group-hover:rotate-0 transition-all duration-1000 shadow-[0_50px_100px_-20px_rgba(240,187,64,0.3)]">
                <div className="bg-background rounded-[4rem] overflow-hidden aspect-[9/18] relative shadow-inner">
                  <div className="absolute top-0 inset-x-0 h-20 bg-primary flex items-center justify-center pt-4">
                    <span className="text-[10px] font-black tracking-widest text-primary-foreground uppercase italic underline decoration-accent text-center">B2B CATÁLOGO DIGITAL DEMO</span>
                  </div>
                  <div className="p-10 pt-24 space-y-6">
                    <div className="h-6 w-32 bg-muted animate-pulse rounded-full" />
                    <div className="grid grid-cols-2 gap-6">
                      <div className="h-44 bg-muted rounded-3xl" />
                      <div className="h-44 bg-muted rounded-3xl" />
                    </div>
                    <div className="h-12 bg-muted animate-pulse rounded-2xl" />
                  </div>
                  <div className="absolute bottom-10 inset-x-10 flex flex-col gap-3">
                    <div className="h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black uppercase text-[10px]">Ver Detalles</div>
                    <div className="h-14 bg-accent rounded-2xl flex items-center justify-center text-primary font-black uppercase text-[10px]">Solicitar RFQ</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-12 -right-12 bg-white text-primary p-8 rounded-[2.5rem] shadow-4xl animate-float font-black text-sm max-w-[180px] rotate-12 border-4 border-accent/20" suppressHydrationWarning>
                {mounted && <CheckCircle2 className="text-green-500 mb-2" />}
                "Activación en 1-click!" ⚡
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-48 relative overflow-hidden bg-primary group">
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
             {mounted && (
               <Image 
                 src="/hero.webp" 
                 alt="Overlay" 
                 fill 
                 className="grayscale object-cover" 
                 suppressHydrationWarning
               />
             )}
          </div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-6xl md:text-[10rem] font-black text-primary-foreground mb-16 tracking-tightest leading-[0.8]">
              ¿TU EMPRESA <br />
              ESTÁ <span className="text-accent underline decoration-accent/30 decoration-8 underline-offset-[10px] italic">LISTA?</span>
            </h2>
            <Link href="/register" className="inline-block bg-accent text-primary px-20 py-8 rounded-full text-2xl font-black uppercase tracking-tightest hover:scale-110 active:scale-95 transition-transform shadow-4xl shadow-accent/50">
              Crear Catálogo Gratis
            </Link>
            <p className="mt-12 text-primary-foreground/40 font-black uppercase tracking-widest text-sm italic">
              Digitalización total en menos de 10 minutos · Sin compromisos
            </p>
          </div>
        </section>
      </main>

      {/* Identidad Section (Footer) */}
      <footer id="identidad" className="bg-primary pt-32 pb-16 border-t-4 border-accent/20 text-primary-foreground">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-10">
              <div className="relative w-64 h-16">
                {mounted && (
                  <Image 
                    src="/logo/logo-full.png" 
                    alt="B2B Empresas Logo" 
                    fill 
                    className="object-contain brightness-0 invert"
                    suppressHydrationWarning
                  />
                )}
              </div>
            </div>
            <p className="text-muted-foreground max-w-md font-bold text-lg leading-relaxed">
              GESTION - DESARROLLO - SOLUCIONES EMPRESARIALES de alta precisión para el Sector Industrial de Latinoamericana; Lleva tu industria al siguiente nivel. 
              <span className="text-primary block mt-4 italic underline decoration-accent/30">Somos La Plataforma y Entorno 360º de Gestión y Desarrollo Empresarial en Latam</span>
            </p>
          </div>
          
          {["Plataforma", "Compañía", "Recursos"].map((col) => (
            <div key={col}>
              <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-accent italic">{col}</h4>
              <ul className="space-y-5 text-sm font-black uppercase tracking-tight text-muted-foreground">
                <li><a href="#corporativo" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">CORPORATIVO</a></li>
                <li><a href="#soporte-operativo" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">SOPORTE OPERATIVO</a></li>
                <li><a href="#identidad" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">IDENTIDAD</a></li>
              </ul>
            </div>
          ))}
        </div>
        <div className="container mx-auto px-6 mt-32 pt-12 border-t-2 border-border/10 flex flex-col md:row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic">© 2026 b2bempresas.com — Powered by Advanced Agentic Engineering</p>
          <div className="flex gap-10">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="w-6 h-6 bg-muted rounded-full hover:bg-accent transition-colors cursor-pointer" />
            ))}
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp B2B Hotline */}
      {/* Floating WhatsApp B2B Hotline */}
      <a 
        href={`https://wa.me/${settingsService.sanitizePhone(siteSettings?.support_phone || "51924159535")}?text=${encodeURIComponent(siteSettings?.whatsapp_message || "Hola, solicito asistencia corporativa en b2bempresas.com")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 sm:bottom-10 right-6 sm:right-10 z-[100] group"
      >
        <div className="absolute -inset-4 bg-green-500/20 rounded-full blur-xl group-hover:bg-green-500/40 transition-all animate-pulse" />
        <div className="relative bg-green-500 text-white p-3 sm:p-6 rounded-[1.2rem] sm:rounded-[2.5rem] shadow-2xl shadow-green-500/30 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 sm:gap-5 border-2 border-white/30 backdrop-blur-md">
          <div className="flex flex-col items-center text-center leading-tight">
            <span className="text-[8px] sm:text-xs font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-0.5 sm:mb-1" style={{ fontFamily: "'Congenial Black', sans-serif" }}>SOPORTE</span>
            <span className="text-[12px] sm:text-xl font-black uppercase tracking-tighter" style={{ fontFamily: "'Congenial Black', sans-serif" }}>B2B EMPRESAS</span>
          </div>
          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-2xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>
        </div>
      </a>

      {/* Floating Support Technical Registration */}
      <Link 
        href="/register"
        className="fixed bottom-6 sm:bottom-10 left-6 sm:left-10 z-[100] group"
      >
        <div className="absolute -inset-4 bg-accent/10 rounded-full blur-xl group-hover:bg-accent/20 transition-all animate-pulse" />
        <div className="relative bg-[#020617] text-accent p-3 sm:p-6 rounded-[1.2rem] sm:rounded-[2.5rem] shadow-2xl border-2 border-accent/30 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 sm:gap-5 backdrop-blur-md">
          <div className="flex flex-col items-center text-center leading-[0.9]" style={{ fontFamily: "'Bodoni MT Black', 'Bodoni MT', serif" }}>
            <span className="text-[8px] sm:text-[18px] tracking-[0.05em] sm:tracking-[0.1em] mb-1 whitespace-nowrap">SOPORTE TECNICO</span>
            <span className="text-[12px] sm:text-[30px] tracking-tighter whitespace-nowrap">CATALOGO DIGITAL</span>
          </div>
          <div className="w-6 h-6 sm:w-12 sm:h-12 bg-accent/20 rounded-lg sm:rounded-2xl flex items-center justify-center">
            <ShieldCheck size={mounted ? (window?.innerWidth < 640 ? 18 : 28) : 28} className="text-accent" />
          </div>
        </div>
      </Link>
    </div>
  );
}
