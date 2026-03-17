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
import { adService, FeaturedProduct } from "@/lib/ad-service";

export default function Home() {
  const [featured, setFeatured] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const data = await adService.getFeaturedProducts(6);
        setFeatured(data);
      } catch (e) {
        console.error("Error fetching ads:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
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
            "description": "Infraestructura Digital B2B Maestra para el sector Industrial.",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+51-000-0000",
              "contactType": "master control"
            }
          })
        }}
      />

      {/* Navigation */}
      <header id="main-header" className="fixed top-0 z-50 w-full glass border-b border-border/50">
        <div className="container flex h-20 items-center justify-between mx-auto px-6">
          <div id="site-logo" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12 shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-black text-lg">B2B</span>
            </div>
            <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              b2bempresas.com
            </span>
          </div>
          
          <nav id="top-nav" className="hidden lg:flex gap-8 text-sm font-black uppercase tracking-widest text-muted-foreground">
            {["Características", "Planes", "Empresas", "Contacto"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} id={`nav-${item.toLowerCase()}`} className="hover:text-accent transition-colors">{item}</a>
            ))}
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

      <main className="flex-grow pt-20 font-sans cursor-default">
        {/* Hero Section */}
        <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-primary py-24">
          <div className="absolute inset-0 z-0 opacity-15">
            <Image 
              src="/hero.png" 
              alt="Industrial Background" 
              fill 
              style={{ objectFit: 'cover' }}
              className="grayscale"
              priority
            />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl space-y-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent/20 border border-accent/30 text-accent animate-fade-in">
                <Zap size={20} className="animate-pulse" />
                <span className="text-sm font-black uppercase tracking-widest italic">Infraestructura Digital B2B</span>
              </div>
              
              <h1 className="text-6xl md:text-[8.5rem] font-black text-primary-foreground leading-[0.82] tracking-tightest uppercase italic animate-fade-in-up">
                La Red <br />
                <span className="text-accent underline decoration-8 decoration-accent/30 underline-offset-[-10px]">Maestra</span> <br />
                Industrial.
              </h1>

              <div className="flex flex-col md:row items-start gap-10 animate-fade-in-up delay-200">
                <p className="text-xl md:text-2xl text-primary-foreground/70 font-bold max-w-xl leading-relaxed">
                  Conectamos proveedores líderes con compradores corporativos a través de un ecosistema inteligente de catálogos y aplicaciones de alto rendimiento.
                </p>
                <div className="flex flex-wrap gap-6 pt-4">
                  <Link href="/register" className="bg-accent text-primary px-12 py-6 rounded-2xl text-xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-3xl shadow-accent/20">
                    Comenzar Ahora
                  </Link>
                  <button className="bg-white/10 text-primary-foreground border-2 border-white/20 px-12 py-6 rounded-2xl text-xl font-black uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-md">
                    Ver Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Showcase */}
        <section id="featured" className="py-32 bg-background relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 text-accent mb-4">
                  <Sparkles size={24} className="animate-spin-slow" />
                  <span className="text-xs font-black uppercase tracking-widest italic">Vitrina Industrial Verificada</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tightest uppercase italic leading-none">
                  Suministros <span className="text-accent underline decoration-8 decoration-accent/10 underline-offset-[-5px]">Destacados</span>
                </h2>
                <p className="text-muted-foreground font-bold mt-8 text-xl max-w-lg">
                  Equipos industriales de alto rendimiento autorizados bajo estándares de control AGM.
                </p>
              </div>
              <button className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest bg-muted px-10 py-5 rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all shadow-xl shadow-black/5">
                Explorar Todo el Catálogo <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-[600px] bg-muted animate-pulse rounded-[3.5rem]" />
                ))
              ) : featured.length > 0 ? (
                featured.map((product: FeaturedProduct) => (
                  <div key={product.id} className="group bg-card rounded-[3.5rem] border-2 border-muted/50 overflow-hidden hover:border-accent transition-all duration-700 hover:shadow-4xl hover:shadow-accent/5">
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <Image 
                        src={product.image_url || "/hero.png"} 
                        alt={product.name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms] ease-out"
                      />
                      <div className="absolute top-8 left-8 flex flex-col gap-3">
                         <span className="bg-primary text-primary-foreground text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest shadow-2xl flex items-center gap-2 backdrop-blur-md">
                           <ShieldCheck size={14} className="text-accent" /> Empresa Verificada
                         </span>
                         <span className="bg-accent text-primary text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest shadow-2xl w-fit">
                           En Stock
                         </span>
                      </div>
                    </div>
                    <div className="p-10 bg-gradient-to-b from-card to-muted/10">
                      <div className="flex justify-between items-start mb-8">
                        <div className="max-w-[70%]">
                          <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-2 italic">
                            {product.companies?.name || "Proveedor Autorizado"}
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
                      <button className="w-full bg-secondary py-6 rounded-[1.8rem] font-black uppercase text-sm tracking-widest hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-3 shadow-xl group/btn">
                         Solicitar Cotización Técnica <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-32 bg-muted/20 border-4 border-dashed border-muted/50 rounded-[4rem] text-center flex flex-col items-center justify-center gap-6">
                  <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground">
                    <TrendingUp size={40} />
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

        {/* Features Section */}
        <section className="py-32 bg-secondary/5 relative overflow-hidden">
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
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-10 group-hover:rotate-6 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Apps Ecosystem Section */}
        <section id="apps" className="py-32 bg-primary relative overflow-hidden">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="animate-fade-in-left">
              <h2 className="text-4xl md:text-6xl font-black text-primary-foreground mb-8 tracking-tighter leading-none">
                TU PROPIA <span className="text-accent underline decoration-accent/30 decoration-8 underline-offset-8">APP B2B</span> <br />
                LISTA PARA ACTIVAR.
              </h2>
              <p className="text-xl text-primary-foreground/70 mb-12 leading-relaxed font-bold">
                No solo es una web. Cada proveedor puede **Activar su Catálogo Digital (APP_CD)** como acceso directo para realizar pedidos offline y recibir notificaciones push de stock.
              </p>
              <div className="flex gap-6">
                <div className="bg-white/10 p-6 rounded-[2rem] border-2 border-white/20 backdrop-blur-md">
                  <Smartphone className="text-accent mb-4" size={32} />
                  <p className="text-xs font-black text-accent uppercase tracking-widest mb-1 italic">APP_CD</p>
                  <p className="text-sm text-primary-foreground font-bold italic">Catálogo Digital Interactivo</p>
                </div>
                <div className="bg-white/10 p-6 rounded-[2rem] border-2 border-white/20 backdrop-blur-md">
                  <TrendingUp className="text-accent mb-4" size={32} />
                  <p className="text-xs font-black text-accent uppercase tracking-widest mb-1 italic">APP_CBA</p>
                  <p className="text-sm text-primary-foreground font-bold italic">Motor de Cotizaciones B2B</p>
                </div>
              </div>
            </div>
            
            <div className="relative group perspective-2000">
              <div className="bg-accent/10 border-[12px] border-accent/20 rounded-[5rem] p-6 rotate-3 group-hover:rotate-0 transition-all duration-1000 shadow-[0_50px_100px_-20px_rgba(240,187,64,0.3)]">
                <div className="bg-background rounded-[4rem] overflow-hidden aspect-[9/18] relative shadow-inner">
                  <div className="absolute top-0 inset-x-0 h-20 bg-primary flex items-center justify-center pt-4">
                    <span className="text-[10px] font-black tracking-widest text-primary-foreground uppercase italic underline decoration-accent text-center">B2B APP_CD DEMO</span>
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
              <div className="absolute -top-12 -right-12 bg-white text-primary p-8 rounded-[2.5rem] shadow-4xl animate-float font-black text-sm max-w-[180px] rotate-12 border-4 border-accent/20">
                <CheckCircle2 className="text-green-500 mb-2" />
                "Activación en 1-click!" ⚡
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-48 relative overflow-hidden bg-primary group">
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
             <Image 
               src="/hero.png" 
               alt="Overlay" 
               fill 
               style={{ objectFit: 'cover' }}
               className="grayscale" 
             />
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

      {/* Footer */}
      <footer className="bg-secondary/10 pt-32 pb-16 border-t-4 border-border/10">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-black text-xl">B</span>
              </div>
              <span className="text-3xl font-black tracking-tightest">b2bempresas.com</span>
            </div>
            <p className="text-muted-foreground max-w-md font-bold text-lg leading-relaxed">
              La plataforma de infraestructura digital para el sector industrial más avanzada de América Latina. 
              <span className="text-primary block mt-4 italic underline decoration-accent/30">Liderando la industria 4.0</span>
            </p>
          </div>
          
          {["Plataforma", "Compañía", "Recursos"].map((col) => (
            <div key={col}>
              <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-accent italic">{col}</h4>
              <ul className="space-y-5 text-sm font-black uppercase tracking-tight text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Características</a></li>
                <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">Seguridad</a></li>
                <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">API Industrial</a></li>
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
    </div>
  );
}
