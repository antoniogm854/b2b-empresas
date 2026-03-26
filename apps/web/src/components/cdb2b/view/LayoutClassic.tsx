import { MessageCircle, Sparkles, Package, MapPin, Phone, Mail, Globe, QrCode, ArrowRight } from "lucide-react";

interface LayoutProps {
  tenant: any;
  products: any[];
  settings: any;
}

export default function LayoutClassic({ tenant, products, settings }: LayoutProps) {
  const primaryColor = settings.theme?.primary || "#4B6319";
  const secondaryColor = settings.theme?.secondary || "#A2C367";
  const fontFamily = settings.theme?.font_family || 'Inter';
  
  const featuredProduct = products.find(p => p.is_most_requested) || products[0];
  const otherProducts = products.filter(p => p.id !== featuredProduct?.id);

  return (
    <div className="bg-white text-zinc-900 min-h-screen relative overflow-hidden" style={{ fontFamily }}>
      {/* Visual background elements like the flyer */}
      <div className="absolute top-0 right-0 w-[60%] h-[40%] bg-zinc-50 -skew-x-12 translate-x-1/4 -z-10" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[30%] bg-zinc-50 skew-x-12 -translate-x-1/4 -z-10" />

      {/* Header / Logo bar */}
      <nav className="max-w-7xl mx-auto px-10 py-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 shadow-xl border border-zinc-100 overflow-hidden">
            {tenant.logo_url ? (
              <img src={tenant.logo_url} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center font-black text-white text-[10px] italic">B2B</div>
            )}
          </div>
          <div>
            <h2 className="font-black uppercase text-sm tracking-tighter leading-none">{tenant.company_name}</h2>
            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mt-1">Suministro Sostenible</p>
          </div>
        </div>
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          <a href="#catalogo" className="hover:text-zinc-900 transition-colors">Productos</a>
          <a href="#especificaciones" className="hover:text-zinc-900 transition-colors">Especificaciones</a>
          <a href="#contacto" className="underline decoration-2 underline-offset-8 text-zinc-900">Contacto Directo</a>
        </div>
      </nav>

      {/* Hero Section - Inspired by the Main Laptop Image */}
      <header className="max-w-7xl mx-auto px-10 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <p className="text-red-600 font-black text-xl italic tracking-tighter uppercase">{tenant.trade_name || 'INDUSTRIAL PREMIUM'}</p>
            <h1 className="text-6xl md:text-8xl font-black text-zinc-950 uppercase tracking-tightest leading-[0.85]">
              {settings.content?.slogan || "CATÁLOGO DE <br/> PRODUCTOS"}
            </h1>
            <p className="text-zinc-500 font-bold text-lg md:text-xl uppercase tracking-widest max-w-xl">
              {settings.content?.featured_info || "Suministro Técnico Certificado para Operaciones Críticas"}
            </p>
          </div>

          {featuredProduct && (
            <div className="bg-zinc-50/50 backdrop-blur-sm border border-zinc-100 p-8 rounded-[2rem] space-y-6 max-w-lg">
               <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Item Destacado</p>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">{featuredProduct.custom_name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-zinc-300 line-through uppercase">USD {(parseFloat(featuredProduct.unit_price) * 1.2).toFixed(2)}</p>
                    <p className="text-3xl font-black italic tracking-tightest" style={{ color: primaryColor }}>USD {featuredProduct.unit_price}</p>
                  </div>
               </div>
               <p className="text-[11px] text-zinc-500 font-medium leading-relaxed uppercase">
                 {featuredProduct.description || "Componente de alta precisión diseñado para entornos industriales exigentes. Disponible para despacho inmediato."}
               </p>
               <div className="pt-2">
                 <a href={`#prod-${featuredProduct.id}`} className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest group">
                   Ver Ficha Técnica <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                 </a>
               </div>
            </div>
          )}
        </div>

        <div className="relative group perspective-1000">
          <div className="aspect-[4/3] bg-white rounded-[3rem] shadow-2xl border border-zinc-100 p-12 flex items-center justify-center transition-transform duration-700 group-hover:rotate-y-12 overflow-hidden shadow-zinc-400/20">
             {featuredProduct?.images?.[0] || featuredProduct?.image_url ? (
                <img 
                  src={featuredProduct.images?.[0] || featuredProduct.image_url} 
                  alt={featuredProduct.custom_name} 
                  className="w-full h-full object-contain filter drop-shadow-2xl" 
                />
             ) : (
                <Package size={120} className="text-zinc-100" />
             )}
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-zinc-950 rounded-[2.5rem] flex items-center justify-center text-white rotate-12 shadow-2xl border-b-8 border-emerald-600">
             <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Ahorro</p>
                <p className="text-4xl font-black italic tracking-tighter">20%</p>
             </div>
          </div>
        </div>
      </header>

      {/* Product Grid - Exactly 3 columns like the flyer */}
      <main className="max-w-7xl mx-auto px-10 py-32 space-y-24" id="catalogo">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {otherProducts.map((p) => (
            <div key={p.id} id={`prod-${p.id}`} className="group space-y-6 flex flex-col h-full bg-white rounded-[2.5rem] p-6 transition-all border border-zinc-50 shadow-sm hover:shadow-2xl hover:shadow-zinc-200/50 hover:border-zinc-200">
              <div className="aspect-square bg-white rounded-[2rem] overflow-hidden relative border border-zinc-100 p-8 flex items-center justify-center group-hover:bg-zinc-50 transition-colors">
                {p.images?.[0] || p.image_url ? (
                  <img src={p.images?.[0] || p.image_url} alt={p.custom_name} className="object-contain w-full h-full transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <Package size={64} className="text-zinc-50" />
                )}
              </div>
              
              <div className="space-y-4 px-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-300 line-through uppercase tracking-tighter">USD {(parseFloat(p.unit_price) * 1.15).toFixed(2)}</p>
                    <p className="text-2xl font-black italic tracking-tightest" style={{ color: primaryColor }}>USD {p.unit_price}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-black uppercase text-sm leading-tight tracking-tightest group-hover:text-emerald-600 transition-colors">{p.custom_name}</h3>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{p.brand || 'CERTIFIED B2B'}</p>
                </div>

                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed uppercase line-clamp-2 italic">
                  {p.description || "Garantía de rendimiento y durabilidad industrial."}
                </p>

                <div className="pt-4 mt-auto">
                   <a 
                    href={`https://wa.me/${tenant.phone_commercial || tenant.phone}?text=Consulta sobre el producto: ${p.custom_name}`} 
                    target="_blank"
                    className="w-full bg-zinc-950 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-black/10"
                   >
                     Solicitar Info <MessageCircle size={16} />
                   </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Section */}
        <section id="especificaciones" className="bg-zinc-900 rounded-[4rem] p-16 text-white relative overflow-hidden text-center space-y-10">
           <div className="absolute inset-0 opacity-10 bg-[url('/b2b_profile_bg.png')] bg-cover bg-center" />
           <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <h2 className="text-4xl font-black uppercase italic tracking-tightest">Infraestructura <span className="text-emerald-500">Transparente</span></h2>
              <p className="text-zinc-400 font-medium text-sm leading-relaxed uppercase tracking-widest">
                Este catálogo no es una tienda directa, es una herramienta de visualización técnica para el suministro industrial masivo. Todas las cotizaciones se formalizan vía canales corporativos oficiales.
              </p>
           </div>
        </section>
      </main>

      {/* Footer structured like the flyer bottom area */}
      <footer className="bg-white py-24 border-t-8 border-zinc-950" id="contacto">
        <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 items-start">
          
          {/* Location Col */}
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center shrink-0">
               <MapPin className="text-red-600" size={24} />
            </div>
            <div className="space-y-1">
               <h4 className="font-black uppercase text-[10px] tracking-widest text-zinc-950">Ubícanos</h4>
               <p className="text-[11px] font-bold text-zinc-500 uppercase leading-snug">
                 {tenant.fiscal_address || tenant.address || "Lima, Perú"} <br/> CP. 15047
               </p>
            </div>
          </div>

          {/* Contact Col */}
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center shrink-0">
               <Phone className="text-zinc-950" size={24} />
            </div>
            <div className="space-y-1">
               <h4 className="font-black uppercase text-[10px] tracking-widest text-zinc-950">Línea Directa</h4>
               <p className="text-[11px] font-bold text-zinc-500 uppercase leading-snug">
                 {tenant.phone} <br/> {tenant.phone_commercial || tenant.phone}
               </p>
            </div>
          </div>

          {/* Website Col */}
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
               <Globe className="text-emerald-600" size={24} />
            </div>
            <div className="space-y-1">
               <h4 className="font-black uppercase text-[10px] tracking-widest text-zinc-950">Plataforma</h4>
               <p className="text-[11px] font-bold text-zinc-500 uppercase leading-snug truncate">
                 {tenant.website?.replace('https://', '') || "b2bempresas.com"}
               </p>
            </div>
          </div>

          {/* QR / Sync Col */}
          <div className="flex items-start gap-5 bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
            <div className="space-y-3">
               <h4 className="font-black uppercase text-[8px] tracking-[0.2em] text-zinc-400">Sincronización Digital</h4>
               <div className="flex items-center gap-2">
                 <QrCode className="text-zinc-950" size={32} />
                 <p className="text-[9px] font-black uppercase leading-tight italic">Escanéa para <br/> Versión Mobile</p>
               </div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-10 mt-20 pt-10 border-t border-zinc-100">
           <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-center leading-relaxed">
             {settings.content?.footer_text || "Términos y Condiciones: Precios sujetos a stock y variación de mercado. Catálogo para fines ilustrativos y visualización B2B."}
           </p>
        </div>
      </footer>
    </div>
  );
}
