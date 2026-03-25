"use client";

import { MessageCircle, Sparkles, Package, MapPin, Phone, Mail, Globe, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

interface LayoutProps {
  tenant: any;
  products: any[];
  settings: any;
}

export default function LayoutModern({ tenant, products, settings }: LayoutProps) {
  const primaryColor = settings.theme?.primary || "#10b981";
  const secondaryColor = settings.theme?.secondary || "#34d399";
  
  const promoProducts = products.filter(p => p.is_most_requested);
  const otherProducts = products.filter(p => !p.is_most_requested);

  return (
    <div className="bg-zinc-950 text-white min-h-screen relative" style={{ fontFamily: settings.theme?.font_family || 'Inter' }}>
      {/* Premium Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 flex justify-between items-center pointer-events-none">
         <div className="pointer-events-auto bg-black border border-white/10 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-black italic text-xs">B2B</div>
            <span className="text-[10px] font-black uppercase tracking-widest border-l border-white/20 pl-3">{tenant.company_name}</span>
         </div>
         <button className="pointer-events-auto bg-white text-black px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10">
            CONTACTAR EXPERTO
         </button>
      </nav>

      {/* Hero Header Corporativo */}
      <header className="relative min-h-[90vh] flex items-center overflow-hidden bg-zinc-950 pt-24 pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950 z-10" />
        <div className="absolute inset-0 bg-[url('/hero.webp')] bg-cover bg-center grayscale opacity-20 scale-110" />
        
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-end justify-between gap-12">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12 text-center md:text-left w-full">
             
             {/* Logo Container */}
             <div className="w-40 h-40 md:w-56 md:h-56 bg-zinc-900 border-4 border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl flex-shrink-0 flex items-center justify-center p-6 relative z-30 group">
                {tenant.logo_url ? (
                  <img src={tenant.logo_url} alt={tenant.company_name} className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <span className="font-black text-6xl text-zinc-700 italic tracking-tighter">B2B</span>
                )}
             </div>
             
             {/* Info Básica Empresarial */}
             <div className="space-y-6 pb-2 w-full">
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                 <div 
                   className="px-5 py-2 font-black uppercase text-[10px] tracking-[0.2em] rounded-full shadow-lg"
                   style={{ backgroundColor: primaryColor, color: 'white' }}
                 >
                   PROVEEDOR CERTIFICADO
                 </div>
                 {tenant.ruc_rut_nit && (
                   <div className="bg-zinc-800/80 text-zinc-300 px-5 py-2 font-black uppercase text-[10px] tracking-[0.2em] rounded-full border border-zinc-700 backdrop-blur-sm">
                     RUC: {tenant.ruc_rut_nit}
                   </div>
                 )}
               </div>
               
               <div className="space-y-2">
                 {settings.content?.logo_name_url ? (
                   <img src={settings.content.logo_name_url} alt="Brand" className="h-12 md:h-16 w-auto mx-auto md:mx-0 object-contain mb-4" />
                 ) : (
                   <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-white drop-shadow-2xl max-w-4xl italic">
                     {tenant.company_name}
                   </h1>
                 )}
                 <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-zinc-400 italic">
                    {settings.content?.slogan || "SUMINISTRO INDUSTRIAL"}
                 </h2>
               </div>
               
               <p className="text-zinc-500 font-bold tracking-widest text-xs md:text-sm uppercase max-w-2xl bg-white/5 inline-block px-6 py-2 rounded-xl border border-white/5">
                 {settings.content?.featured_info || tenant.activity_main || "Especialistas en Soluciones Industriales B2B"}
               </p>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-24 space-y-32">
        
        {/* PROMO SECTION */}
        {settings.content?.show_promo_section && promoProducts.length > 0 && (
          <section className="space-y-16">
            <div className="flex items-center gap-8">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                <Sparkles className="text-emerald-500 animate-pulse" />
                OFERTAS <span className="text-emerald-500 underline decoration-8 underline-offset-[12px]" style={{ textDecorationColor: primaryColor }}>DESTACADAS</span>
              </h2>
              <div className="h-[2px] flex-1 bg-zinc-900" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {promoProducts.map((p) => (
                <ProductCard key={p.id} product={p} tenant={tenant} settings={settings} featured />
              ))}
            </div>
          </section>
        )}

        {/* FULL CATALOG SECTION */}
        <section className="space-y-16">
          <div className="flex items-center gap-8">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
               <Package className="text-zinc-700" />
               CATÁLOGO <span className="text-zinc-500 underline decoration-8 underline-offset-[12px] opacity-50">COMPLETO</span>
            </h2>
            <div className="h-[2px] flex-1 bg-zinc-900" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {otherProducts.map((p) => (
              <ProductCard key={p.id} product={p} tenant={tenant} settings={settings} />
            ))}
          </div>
        </section>

        {/* INFO BASICA SECCIÓN */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
           <div className="lg:col-span-8 bg-zinc-900/50 p-12 md:p-20 rounded-[4rem] border border-zinc-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10 space-y-8">
                 <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Sobre la Organización</h3>
                 <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-2xl">
                    Operamos con los estándares más estrictos de cumplimiento industrial. Nuestro catálogo digital está sincronizado en tiempo real con nuestra infraestructura logística global.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.2em]">Razón Social</p>
                       <p className="font-bold text-white text-sm uppercase">{tenant.trade_name || tenant.company_name}</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.2em]">Dirección Legal</p>
                       <p className="font-bold text-white text-sm uppercase">{tenant.fiscal_address || 'Asignada en Perfil'}</p>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="lg:col-span-4 bg-zinc-900 p-12 rounded-[4rem] border border-zinc-800 flex flex-col justify-center space-y-10 group">
              <div className="text-center space-y-2">
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Compliance Industrial</p>
                 <div className="text-5xl font-black italic text-white tracking-tighter">{tenant.compliance_score || '9.8'}<span className="text-xs opacity-30">/10</span></div>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 animate-shimmer" style={{ width: '95%', backgroundColor: primaryColor }} />
              </div>
              <div className="text-center">
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-loose">
                    Proveedor habilitado para <br/> licitaciones de alto volumen.
                 </p>
              </div>
           </div>
        </section>
      </main>

      {/* Standardized Footer */}
      <footer className="bg-zinc-950 py-32 border-t border-zinc-900" id="contacto">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20">
            <div className="space-y-8">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-black text-[12px] italic shadow-2xl shadow-white/10">B2B</div>
                 <h4 className="font-black uppercase text-lg tracking-tighter text-white">{tenant.company_name}</h4>
               </div>
               <p className="text-zinc-500 text-[10px] font-black uppercase leading-relaxed tracking-widest">
                 Liderando el suministro técnico corporativo. Calidad, velocidad y precisión.
               </p>
            </div>
            
            <div className="space-y-8">
               <h4 className="font-black uppercase text-xs tracking-[0.3em] text-zinc-600 underline underline-offset-8" style={{ textDecorationColor: primaryColor }}>Contacto Directo</h4>
               <ul className="space-y-6 font-bold text-xs text-white uppercase tracking-widest">
                  <li className="flex items-center gap-4 transition-colors hover:text-emerald-500"><Phone size={16} className="text-emerald-500" /> {tenant.phone}</li>
                  <li className="flex items-center gap-4 transition-colors hover:text-emerald-500"><Mail size={16} className="text-emerald-500" /> {tenant.email}</li>
               </ul>
            </div>

            <div className="space-y-8">
               <h4 className="font-black uppercase text-xs tracking-[0.3em] text-zinc-600 underline underline-offset-8" style={{ textDecorationColor: primaryColor }}>Geolocalización</h4>
               <ul className="space-y-6 font-bold text-xs text-white uppercase tracking-widest">
                  <li className="flex items-start gap-4 transition-colors hover:text-emerald-500"><MapPin size={16} className="text-emerald-500 shrink-0 mt-0.5" /> {tenant.city}, {tenant.country}</li>
                  {tenant.website && (
                    <li className="flex items-center gap-4 transition-colors hover:text-emerald-500"><Globe size={16} className="text-emerald-500" /> {tenant.website.replace(/^https?:\/\//, '')}</li>
                  )}
               </ul>
            </div>

            <div className="space-y-8">
               <h4 className="font-black uppercase text-xs tracking-[0.3em] text-zinc-600 opacity-30">Legal & Tech</h4>
               <p className="text-zinc-600 text-[9px] font-black uppercase leading-relaxed tracking-widest">
                 Copyright © {new Date().getFullYear()} B2B Empresas. Esta vitrina digital utiliza protocolos de encriptación de grado industrial para la protección de SLUGs y SKU corporativos.
               </p>
            </div>
         </div>
      </footer>

      {/* Floating WhatsApp Button */}
      {settings.content?.whatsapp_button && (
        <a 
          href={`https://wa.me/${tenant.phone_commercial || tenant.phone}?text=Consulta sobre el catálogo digital de ${tenant.company_name}`}
          target="_blank"
          style={{ backgroundColor: primaryColor }}
          className="fixed bottom-12 right-12 w-20 h-20 text-white rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 transition-all z-[100] group border-4 border-white/5"
        >
          <MessageCircle size={40} />
          <div className="absolute right-24 bg-white text-black px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all translate-x-10 group-hover:translate-x-0 shadow-2xl">
             Hablar con un Asesor B2B
          </div>
        </a>
      )}
    </div>
  );
}

function ProductCard({ product, tenant, settings, featured = false }: any) {
  const primaryColor = settings.theme?.primary || "#10b981";
  const whatsappUrl = `https://wa.me/${tenant.phone_commercial || tenant.phone}?text=Me interesa el producto: ${product.custom_name} del catálogo de ${tenant.company_name}`;

  return (
    <div className={`group flex flex-col h-full bg-zinc-900/40 rounded-[3rem] p-6 border transition-all duration-500 ${featured ? 'border-emerald-500/30 bg-zinc-900 shadow-2xl' : 'border-zinc-800/80 hover:border-zinc-600'}`}>
      <div className="aspect-square bg-white rounded-[2.5rem] overflow-hidden relative border-8 border-zinc-950 p-6 flex items-center justify-center group-hover:border-zinc-800 transition-all duration-700">
        {product.images?.[0] || product.image_url ? (
          <img 
            src={product.images?.[0] || product.image_url} 
            alt={product.custom_name} 
            className="object-contain w-full h-full transition-all duration-700 group-hover:scale-125 group-hover:rotate-6" 
          />
        ) : (
          <Package size={64} className="text-zinc-100 group-hover:text-zinc-300 transition-colors" />
        )}
        {featured && (
           <div className="absolute top-6 left-6 bg-emerald-500 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl" style={{ backgroundColor: primaryColor }}>
             TOP SKU
           </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col space-y-6 pt-8 px-2">
        <div className="space-y-2">
           <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.3em]">{product.brand || 'STANDAR INDUSTRIAL'}</p>
           <h3 className="font-black uppercase text-lg group-hover:text-emerald-400 transition-colors leading-[1.1] text-white italic tracking-tighter line-clamp-2">{product.custom_name}</h3>
        </div>
        
        <div className="pt-6 border-t border-zinc-800 flex items-center justify-between mt-auto">
          <div className="space-y-1">
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Referencia Industrial</p>
            <span className="text-white font-black text-2xl italic tracking-tighter">USD {product.unit_price || '0.00'}</span>
          </div>
          <a 
            href={whatsappUrl}
            target="_blank"
            className="w-14 h-14 bg-zinc-950 text-emerald-400 rounded-2xl hover:bg-emerald-500 hover:text-black transition-all border border-zinc-800 flex items-center justify-center active:scale-90"
            style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}
          >
            <Zap size={24} />
          </a>
        </div>
      </div>
    </div>
  );
}
