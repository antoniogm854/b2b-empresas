"use client";

import { MessageCircle, Sparkles, Package, MapPin, Phone, Mail, Globe } from "lucide-react";

interface LayoutProps {
  tenant: any;
  products: any[];
  settings: any;
}

export default function LayoutClassic({ tenant, products, settings }: LayoutProps) {
  const primaryColor = settings.theme?.primary || "#111827";
  const secondaryColor = settings.theme?.secondary || "#10b981";
  
  const promoProducts = products.filter(p => p.is_most_requested);
  const regularProducts = products.filter(p => !p.is_most_requested);

  return (
    <div className="bg-white text-zinc-900 min-h-screen relative" style={{ fontFamily: settings.theme?.font_family || 'Inter' }}>
      {/* Navigation */}
      <nav className="bg-white border-b border-zinc-100 py-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4 text-center">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-2 shadow-md border border-zinc-100 overflow-hidden">
                 {tenant.logo_url ? (
                   <img src={tenant.logo_url} alt="Logo" className="w-full h-full object-contain" />
                 ) : (
                   <div className="w-full h-full bg-zinc-900 flex items-center justify-center font-black text-white text-[10px] italic">B2B</div>
                 )}
              </div>
           </div>
           <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <a href="#promociones" className="hover:text-zinc-900 transition-colors">Promociones</a>
              <a href="#catalogo" className="hover:text-zinc-900 transition-colors">Productos</a>
              <a href="#contacto" className="hover:text-zinc-900 transition-colors">Soporte</a>
           </div>
        </div>
      </nav>

      {/* Hero Header - Centered Classic */}
      <header className="py-28 border-b border-zinc-100 bg-zinc-50/30">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-10">
          <div 
            className="inline-block px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-sm border border-zinc-200/50"
            style={{ backgroundColor: 'white', color: primaryColor }}
          >
            Suministro Industrial Verificado
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-zinc-950 uppercase tracking-tighter leading-[0.9] max-w-5xl mx-auto">
            {settings.content?.slogan || "SOLUCIONES INTEGRALES"}
          </h1>
          <p className="text-zinc-500 font-bold text-xl md:text-2xl max-w-3xl mx-auto uppercase tracking-widest opacity-60">
            {settings.content?.featured_info || tenant.activity_main || "Catálogo Oficial de Proveedor"}
          </p>
          <div className="pt-8">
             <a href="#catalogo" className="bg-zinc-950 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-2xl">
                Explorar Catálogo
             </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-32">
        
        {/* PROMO SECTION */}
        {settings.content?.show_promo_section && promoProducts.length > 0 && (
          <section id="promociones" className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                   <Sparkles className="text-yellow-500" />
                   PRODUCTOS EN <span className="text-emerald-600">PROMOCIÓN</span>
                </h2>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Oportunidades de Suministro por Tiempo Limitado</p>
              </div>
              <div className="h-px flex-1 bg-zinc-100 mx-8 hidden md:block" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {promoProducts.map((p) => (
                <ProductCard key={p.id} product={p} tenant={tenant} settings={settings} featured />
              ))}
            </div>
          </section>
        )}

        {/* MAIN CATALOG */}
        <section id="catalogo" className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                   <Package className="text-zinc-400" />
                   CATÁLOGO <span className="text-zinc-600">MAESTRO</span>
                </h2>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Explora nuestra gama completa de soluciones</p>
              </div>
              <div className="h-px flex-1 bg-zinc-100 mx-8 hidden md:block" />
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {regularProducts.map((p) => (
              <ProductCard key={p.id} product={p} tenant={tenant} settings={settings} />
            ))}
          </div>
        </section>

        {/* INFO BASICA */}
        <section className="bg-zinc-950 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                   Respaldados por <br/> <span className="text-emerald-500">Excelencia Industrial</span>
                 </h2>
                 <p className="text-zinc-400 font-medium text-lg leading-relaxed">
                   Estamos comprometidos con el suministro ininterrumpido a gran escala, garantizando calidad certificada en cada SKU de nuestro catálogo digital.
                 </p>
                 <div className="flex flex-wrap gap-4">
                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
                       <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Empresa</p>
                       <p className="font-bold text-sm">{tenant.company_name}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
                       <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">RUC</p>
                       <p className="font-bold text-sm">{tenant.ruc_rut_nit || 'N/A'}</p>
                    </div>
                 </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] space-y-6">
                 <h3 className="font-black uppercase text-xs tracking-widest text-emerald-500">Credenciales</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                       <span className="text-[10px] font-black text-zinc-500 uppercase">Cumplimiento (Score)</span>
                       <span className="font-black text-xl italic">{tenant.compliance_score || '9.2'}<span className="text-xs opacity-30">/10</span></span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                       <span className="text-[10px] font-black text-zinc-500 uppercase">Confianza B2B</span>
                       <div className="flex text-yellow-500">{'★'.repeat(tenant.compliance_stars || 5)}</div>
                    </div>
                    {tenant.representantes && tenant.representantes.length > 0 && (
                      <div className="pt-4">
                         <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Equipo Directivo</p>
                         <div className="space-y-2">
                            {tenant.representantes.map((r: any, idx: number) => (
                              <p key={idx} className="text-[11px] font-bold text-white uppercase tracking-tight">
                                {r.nombre || r.name} <span className="text-zinc-500 font-medium ml-1">/ {r.cargo || r.role || 'Representante'}</span>
                              </p>
                            ))}
                         </div>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* Standardized Footer */}
      <footer className="bg-zinc-50 py-24 border-t border-zinc-200" id="contacto">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center font-black text-white text-[10px] italic">B2B</div>
                 <h4 className="font-black uppercase text-sm tracking-tighter">{tenant.company_name}</h4>
               </div>
               <p className="text-zinc-500 text-xs font-medium leading-relaxed uppercase tracking-wider">
                 Proveedores estratégicos para la industria latinoamericana. Suministro masivo y logística certificada.
               </p>
            </div>
            
            <div className="space-y-6">
               <h4 className="font-black uppercase text-[10px] tracking-widest text-zinc-400">Canales de Contacto</h4>
               <ul className="space-y-4 font-bold text-xs text-zinc-600 uppercase tracking-wide">
                  <li className="flex items-center gap-3"><Phone size={14} className="text-emerald-500" /> {tenant.phone}</li>
                  <li className="flex items-center gap-3"><Mail size={14} className="text-emerald-500" /> {tenant.email}</li>
               </ul>
            </div>

            <div className="space-y-6">
               <h4 className="font-black uppercase text-[10px] tracking-widest text-zinc-400">Sede Fiscal</h4>
               <ul className="space-y-4 font-bold text-xs text-zinc-600 uppercase tracking-wide">
                  <li className="flex items-start gap-3"><MapPin size={14} className="text-emerald-500 shrink-0 mt-0.5" /> {tenant.fiscal_address || tenant.address || 'Lima, Perú'}</li>
                  {tenant.website && (
                    <li className="flex items-center gap-3"><Globe size={14} className="text-emerald-500" /> {tenant.website}</li>
                  )}
               </ul>
            </div>

            <div className="space-y-6">
               <h4 className="font-black uppercase text-[10px] tracking-widest text-zinc-400">Infraestructura Web</h4>
               <p className="text-zinc-400 text-[10px] font-bold uppercase leading-relaxed">
                 Este catálogo es una Vitrina Certificada by B2B Empresas. El intercambio de datos está protegido por protocolos de seguridad industrial.
               </p>
            </div>
         </div>
      </footer>

      {/* Floating WhatsApp Button */}
      {settings.content?.whatsapp_button && (
        <a 
          href={`https://wa.me/${tenant.phone_commercial || tenant.phone}?text=Consulta sobre el catálogo digital de ${tenant.company_name}`}
          target="_blank"
          className="fixed bottom-10 right-10 w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:scale-110 active:scale-95 transition-all z-[100] group"
        >
          <MessageCircle size={32} />
          <span className="absolute right-20 bg-zinc-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
             Contactar al Proveedor
          </span>
        </a>
      )}
    </div>
  );
}

function ProductCard({ product, tenant, settings, featured = false }: any) {
  const primaryColor = settings.theme?.primary || "#111827";
  const secondaryColor = settings.theme?.secondary || "#10b981";
  const whatsappUrl = `https://wa.me/${tenant.phone_commercial || tenant.phone}?text=Me interesa el producto: ${product.custom_name} del catálogo de ${tenant.company_name}`;

  return (
    <div className={`group space-y-5 flex flex-col h-full bg-white rounded-[2rem] p-4 transition-all hover:bg-zinc-50 border ${featured ? 'border-emerald-100 shadow-xl shadow-emerald-500/5' : 'border-zinc-100 hover:border-zinc-200'}`}>
      <div className="aspect-square bg-white rounded-2xl overflow-hidden relative border border-zinc-100 shadow-inner p-4 flex items-center justify-center">
        {product.images?.[0] || product.image_url ? (
          <img 
            src={product.images?.[0] || product.image_url} 
            alt={product.custom_name} 
            className="object-contain w-full h-full transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <Package size={48} className="text-zinc-100 group-hover:text-zinc-200 transition-colors" />
        )}
        {featured && (
           <div className="absolute top-4 left-4 bg-emerald-600 text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
             OFERTA
           </div>
        )}
      </div>
      <div className="flex-1 flex flex-col space-y-3 px-2">
        <h3 className="font-black uppercase text-[13px] group-hover:text-emerald-600 transition-colors leading-tight line-clamp-2">{product.custom_name}</h3>
        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest leading-none">{product.brand || 'B2B STANDARD'}</p>
        
        <div className="pt-4 flex items-end justify-between mt-auto">
          <div>
            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Precio Unitario</p>
            <span className="text-zinc-950 font-black text-xl italic tracking-tighter">USD {product.unit_price || '0.00'}</span>
          </div>
          <a 
            href={whatsappUrl}
            target="_blank"
            className="p-3 bg-zinc-900 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
            style={{ backgroundColor: primaryColor }}
          >
            <MessageCircle size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
