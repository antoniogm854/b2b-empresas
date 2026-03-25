"use client";

import { MessageCircle, Sparkles, Package, MapPin, Phone, Mail, Globe, Database, FileText, ShieldCheck, ArrowUpRight } from "lucide-react";

interface LayoutProps {
  tenant: any;
  products: any[];
  settings: any;
}

export default function LayoutTechSpec({ tenant, products, settings }: LayoutProps) {
  const primaryColor = settings.theme?.primary || "#334155";
  const secondaryColor = settings.theme?.secondary || "#64748b";
  
  const promoProducts = products.filter(p => p.is_most_requested);
  const regularProducts = products.filter(p => !p.is_most_requested);

  return (
    <div className="bg-zinc-50 text-slate-900 min-h-screen relative font-mono text-[11px]" style={{ fontFamily: settings.theme?.font_family || 'Roboto' }}>
      
      {/* Technical Top Bar */}
      <div className="bg-zinc-900 text-zinc-400 py-3 px-6 flex justify-between items-center border-b border-zinc-800">
         <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /> PROCUREMENT SECURE</span>
            <span className="opacity-30">|</span>
            <span className="uppercase tracking-widest">{tenant.company_name} // {tenant.ruc_rut_nit || 'NO_ID'}</span>
         </div>
         <div className="hidden md:flex items-center gap-4">
            <span>ISO 9001 COMPLIANT</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-500">SYSTEM ONLINE</span>
         </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-zinc-200 py-10 shadow-sm relative z-20">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-8">
               <div className="w-24 h-24 bg-zinc-50 border-2 border-zinc-100 rounded-2xl flex items-center justify-center p-4 shadow-inner">
                  {tenant.logo_url ? (
                    <img src={tenant.logo_url} alt="Logo" className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all" />
                  ) : (
                    <Database size={32} className="text-zinc-300" />
                  )}
               </div>
               <div className="space-y-2 text-center md:text-left">
                  {settings.content?.logo_name_url ? (
                    <img src={settings.content.logo_name_url} alt="Brand" className="h-10 w-auto object-contain mx-auto md:mx-0" />
                  ) : (
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none">{tenant.company_name}</h1>
                  )}
                  <p className="font-black uppercase tracking-[.3em]" style={{ color: primaryColor }}>{settings.content?.slogan || "TECHNICAL SPECIFICATIONS CATALOG"}</p>
               </div>
            </div>
            <div className="bg-zinc-950 text-white p-6 rounded-2xl flex items-center gap-8 shadow-xl shadow-zinc-200">
               <div className="text-center">
                  <p className="opacity-40 uppercase tracking-widest text-[8px] mb-1">Compliance</p>
                  <p className="font-black text-xl">{tenant.compliance_score || '9.5'}<span className="text-[10px] opacity-30">/10</span></p>
               </div>
               <div className="w-px h-10 bg-white/10" />
               <div className="text-center">
                  <p className="opacity-40 uppercase tracking-widest text-[8px] mb-1">SKU Count</p>
                  <p className="font-black text-xl">{products.length.toString().padStart(3, '0')}</p>
               </div>
            </div>
         </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
         {/* TECHNICAL SIDEBAR */}
         <aside className="hidden lg:block space-y-10">
            <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-6 shadow-sm">
               <h3 className="font-black uppercase tracking-widest text-zinc-400 text-[10px] border-b pb-2">Navigation_System</h3>
               <nav className="space-y-4 font-black uppercase text-[10px] tracking-widest">
                  <a href="#promociones" className="flex items-center gap-3 text-zinc-400 hover:text-slate-900"><ArrowUpRight size={14} /> Quick_Promos</a>
                  <a href="#catalog" className="flex items-center gap-3 text-slate-900"><ArrowUpRight size={14} /> Main_Inventory</a>
                  <a href="#info" className="flex items-center gap-3 text-zinc-400 hover:text-slate-900"><ArrowUpRight size={14} /> Organization_Data</a>
               </nav>
            </div>
            
            <div className="bg-zinc-950 text-white p-6 rounded-2xl space-y-4 shadow-xl">
               <p className="text-emerald-500 font-black uppercase text-[9px] tracking-[0.2em]">Procurement_Notice</p>
               <p className="text-[10px] font-bold opacity-60 leading-relaxed uppercase">Suministro garantizado bajo contrato marco B2B.</p>
            </div>
         </aside>

         <div className="lg:col-span-3 space-y-24">
            
            {/* PROMO / FEATURED BOXES */}
            {settings.content?.show_promo_section && promoProducts.length > 0 && (
              <section id="promociones" className="space-y-8">
                <div className="flex items-center gap-3 text-emerald-600">
                   <Sparkles size={18} />
                   <h2 className="font-black uppercase tracking-[.4em]">PRIORITY_SUPPLY // PROMOCIONES</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {promoProducts.map(p => (
                      <TechPromoCard key={p.id} product={p} tenant={tenant} settings={settings} />
                   ))}
                </div>
              </section>
            )}

            {/* MAIN TECH TABLE */}
            <section id="catalog" className="space-y-8">
               <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                  <div className="flex items-center gap-3">
                     <Database size={20} />
                     <h2 className="text-xl font-black uppercase tracking-tighter">MASTER_DATA_CATALOG // 2024</h2>
                  </div>
                  <div className="flex items-center gap-2 opacity-40">
                     <FileText size={14} />
                     <span className="uppercase tracking-widest">CSV/PDF EXPORT</span>
                  </div>
               </div>

               <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                       <thead className="bg-zinc-50 border-b border-zinc-200 uppercase tracking-widest text-[9px] font-black text-zinc-400">
                          <tr>
                             <th className="px-8 py-6">SKU_REF</th>
                             <th className="px-8 py-6">Technical_Description</th>
                             <th className="px-8 py-6">Commercial_Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-zinc-100">
                          {regularProducts.map(p => (
                             <TechRow key={p.id} product={p} tenant={tenant} settings={settings} />
                          ))}
                       </tbody>
                    </table>
                  </div>
               </div>
            </section>

            {/* TECHNICAL DETAILS FOOTNOTE */}
            <section id="info" className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="bg-zinc-200/50 p-8 rounded-[2rem] space-y-4 border border-zinc-200">
                  <h4 className="font-black uppercase tracking-widest flex items-center gap-2">
                     <ShieldCheck size={16} className="text-emerald-500" />
                     Quality Assurance
                  </h4>
                  <p className="text-zinc-500 leading-relaxed font-black uppercase text-[10px]">
                     Todos los productos cumplen con normativas industriales.
                  </p>
               </div>
               <div className="bg-zinc-950 text-white p-8 rounded-[2rem] space-y-4 shadow-xl shadow-zinc-200">
                  <h4 className="font-black uppercase tracking-widest text-emerald-500 text-[10px]">Corporate Portal</h4>
                  <p className="opacity-60 leading-relaxed font-black uppercase text-[9px]">
                     Acceso exclusivo para proveedores registrados.
                  </p>
               </div>
            </section>
         </div>
      </div>

      {/* Standardized Footnotes */}
      <footer className="bg-zinc-100 py-20 border-t border-zinc-200 relative z-20" id="contacto">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
               <h5 className="font-black uppercase tracking-widest text-zinc-400 text-[9px]">Legal_ID</h5>
               <p className="font-bold uppercase leading-relaxed text-[10px]">
                  {tenant.company_name}<br/>
                  {tenant.ruc_rut_nit && `RUC: ${tenant.ruc_rut_nit}`}<br/>
                  {tenant.fiscal_address || tenant.address || 'LIMA, PERU'}
               </p>
            </div>
            <div className="space-y-4">
               <h5 className="font-black uppercase tracking-widest text-zinc-400 text-[9px]">Control_Centers</h5>
               <p className="font-bold uppercase leading-relaxed text-[10px]">
                  TEL: {tenant.phone}<br/>
                  MAIL: {tenant.email}<br/>
                  LOC: {tenant.city || 'LIMA'}, {tenant.country || 'PERU'}
               </p>
            </div>
            <div className="space-y-4">
               <h5 className="font-black uppercase tracking-widest text-zinc-400 text-[9px]">Digital_Infrastructure</h5>
               <p className="font-bold uppercase leading-relaxed text-[10px]">
                  Powered by B2B Empresas<br/>
                  Industrial Grade SSL<br/>
                  Secure Cloud Hosting
               </p>
            </div>
            <div className="space-y-4">
               <h5 className="font-black uppercase tracking-widest text-zinc-400 text-[9px]">Status</h5>
               <div className="flex items-center gap-2 font-black text-emerald-600 text-[10px]">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  OPERATIONAL_VERIFIED
               </div>
            </div>
         </div>
      </footer>

      {/* Floating WhatsApp Bridge */}
      {settings.content?.whatsapp_button && (
        <a 
          href={`https://wa.me/${tenant.phone_commercial || tenant.phone}?text=TECH_REQ: Consulta especificaciones del catálogo de ${tenant.company_name}`}
          target="_blank"
          className="fixed bottom-10 right-10 w-14 h-14 bg-zinc-900 text-white rounded-xl flex items-center justify-center shadow-2xl hover:bg-emerald-600 transition-all z-[100] border-2 border-white/5 group"
        >
          <MessageCircle size={28} />
          <span className="absolute right-20 bg-emerald-600 text-white px-5 py-2 rounded-lg font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 shadow-xl pointer-events-none transition-all duration-300 translate-x-4 group-hover:translate-x-0">
             COMMERCIAL_BRIDGE_OPEN
          </span>
        </a>
      )}
    </div>
  );
}

function TechPromoCard({ product, tenant, settings }: any) {
  const primaryColor = settings.theme?.primary || "#334155";
  
  return (
    <div className="bg-white border border-zinc-200 p-6 rounded-3xl space-y-4 shadow-sm relative group overflow-hidden border-b-4" style={{ borderBottomColor: primaryColor }}>
       <div className="w-full aspect-square bg-zinc-50 rounded-2xl p-4 border border-zinc-100 flex items-center justify-center relative z-10">
          {product.images?.[0] || product.image_url ? (
            <img src={product.images?.[0] || product.image_url} alt={product.custom_name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" />
          ) : (
            <Package size={32} className="text-zinc-200" />
          )}
       </div>
       <div className="space-y-2 relative z-10">
          <h4 className="font-black uppercase tracking-tighter truncate text-sm text-slate-900">{product.custom_name}</h4>
          <div className="flex justify-between items-end pt-2">
             <div>
                <p className="text-[8px] opacity-40 font-black uppercase">Promo_Price</p>
                <p className="font-black text-emerald-600 text-lg italic leading-none">USD {product.unit_price || '0.00'}</p>
             </div>
             <a 
               href={`https://wa.me/${tenant.phone_commercial || tenant.phone}?text=REQ_PROMO: ${product.custom_name}`}
               target="_blank"
               className="p-3 bg-zinc-950 text-white rounded-xl hover:bg-emerald-600 transition-all"
             >
                <ArrowUpRight size={18} />
             </a>
          </div>
       </div>
    </div>
  );
}

function TechRow({ product, tenant, settings }: any) {
  const primaryColor = settings.theme?.primary || "#334155";
  const rawCuim = product.sku_cuim || product.sku_cuie || 'N/A';
  const cleanCUIM = rawCuim.replace('CUIM-','');

  return (
    <tr className="hover:bg-zinc-50/80 group transition-colors">
       <td className="px-8 py-6 font-black text-zinc-400 group-hover:text-slate-900">
          REF_{cleanCUIM.slice(0,10)}
       </td>
       <td className="px-8 py-6">
          <div className="space-y-1">
             <p className="font-black uppercase text-xs text-slate-900 group-hover:text-zinc-900 transition-colors">{product.custom_name}</p>
             <p className="opacity-40 uppercase text-[9px] font-bold tracking-widest">{product.model || 'TECHNICAL_STANDAR'}</p>
          </div>
       </td>
       <td className="px-8 py-6 uppercase font-bold text-zinc-500">
          {product.brand || 'B2B_OEM'} // {tenant.country || 'LATAM'}
       </td>
       <td className="px-8 py-6 font-black text-slate-900 text-sm italic">
          USD {product.unit_price || '0.00'}
       </td>
       <td className="px-8 py-6 text-right">
          <a 
            href={`https://wa.me/${tenant.phone_commercial || tenant.phone}?text=REQ_DATA: Solicitud técnica para SKU ${cleanCUIM}`}
            target="_blank"
            className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-700 hover:bg-zinc-950 hover:text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all border border-zinc-200 hover:border-zinc-950"
          >
             SPEC_REQ <ArrowUpRight size={12} />
          </a>
       </td>
    </tr>
  );
}
