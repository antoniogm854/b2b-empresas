"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { companyService, Tenant } from "@/lib/company-service";
import { catalogService, Product } from "@/lib/catalog-service";
import PublicLayout from "@/components/layout/PublicLayout";
import { Loader2, Package, Smartphone, MessageSquare, Globe, Building2 } from "lucide-react";
import { formatCurrency } from "@/lib/currency-utils";
import Image from "next/image";

export default function ShowcasePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const tenantData = await companyService.getTenantBySlug(slug);
        if (tenantData) {
          setTenant(tenantData);
          const productsData = await catalogService.getTenantProducts(tenantData.id);
          setProducts(productsData);
        }
      } catch (error) {
        console.error("Error loading showcase:", error);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadData();
  }, [slug]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#FBFCFE]">
          <Loader2 className="w-12 h-12 animate-spin text-slate-900" />
        </div>
      </PublicLayout>
    );
  }

  if (!tenant) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#FBFCFE]">
          <Building2 size={80} className="text-slate-200 mb-6" />
          <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Empresa no encontrada</h1>
          <p className="mt-4 text-lg text-slate-400 font-bold max-w-md uppercase tracking-widest">El catálogo digital solicitado no está disponible.</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#FBFCFE] transition-colors duration-500">
        
        {/* Banner / Header Section */}
        <section className="relative h-[45vh] min-h-[350px] bg-slate-900 overflow-hidden">
          {tenant.logo_url && (
            <Image 
              src={tenant.logo_url} 
              alt={tenant.company_name} 
              fill 
              className="object-cover opacity-20 blur-sm grayscale"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-2 bg-[var(--cat-yellow)]" />
          
          <div className="container mx-auto px-6 relative h-full flex flex-col justify-end pb-12">
            <div className="flex flex-col md:flex-row items-end gap-8 animate-reveal">
              <div className="w-40 h-40 md:w-56 md:h-56 bg-white rounded-[3rem] p-8 shadow-4xl flex items-center justify-center border-8 border-slate-950 relative z-10 shrink-0 overflow-hidden">
                {tenant.logo_url ? (
                  <img src={tenant.logo_url} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Building2 size={64} className="text-slate-200" />
                )}
              </div>
              <div className="space-y-4 pb-4">
                <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-lg">
                  {tenant.trade_name || tenant.company_name}
                </h1>
                <div className="flex flex-wrap gap-4 text-slate-300 font-black text-[10px] uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-3 px-5 py-2 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
                    <Package size={14} className="text-[var(--cat-yellow)]" /> {tenant.sector || 'SISTEMA INDUSTRIAL'}
                  </span>
                  <span className="flex items-center gap-3 px-5 py-2 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
                    <Globe size={14} className="text-[var(--cat-yellow)]" /> {tenant.country}
                  </span>
                  {tenant.ruc_rut_nit && (
                    <span className="flex items-center gap-3 px-5 py-2 bg-[var(--cat-yellow)] text-black rounded-xl border border-black shadow-lg">
                      RUC: {tenant.ruc_rut_nit}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              
              {/* Sidebar Info */}
              <div className="lg:col-span-1 space-y-8 animate-reveal [animation-delay:200ms]">
                <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 space-y-8 shadow-2xl">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 italic border-l-4 border-[var(--cat-yellow)] pl-4">Canales de Enlace</h3>
                  <div className="space-y-6 font-black text-[11px] uppercase tracking-widest">
                    <a href={`https://wa.me/${tenant.phone}`} className="flex items-center gap-5 text-slate-600 hover:text-black hover:translate-x-3 transition-all group">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-[var(--cat-yellow)] group-hover:border-black transition-all">
                        <Smartphone size={22} className="text-slate-400 group-hover:text-black" />
                      </div>
                      <span>WhatsApp Operativo</span>
                    </a>
                    {tenant.website && (
                      <a href={tenant.website} className="flex items-center gap-5 text-slate-600 hover:text-black hover:translate-x-3 transition-all group">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-[var(--cat-yellow)] group-hover:border-black transition-all">
                          <Globe size={22} className="text-slate-400 group-hover:text-black" />
                        </div>
                        <span>Website Oficial</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 italic mb-6 border-l-4 border-[var(--cat-yellow)] pl-4">Empresa Registrada</h3>
                  <p className="text-[12px] text-slate-400 font-bold leading-relaxed uppercase tracking-wide italic">
                    {tenant.description || 'Socio estratégico industrial de alta capacidad operativa.'}
                  </p>
                </div>
              </div>

              {/* Main Catalog View */}
              <div className="lg:col-span-3 space-y-10 animate-reveal [animation-delay:400ms]">
                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-8">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">
                    Suministros <span className="text-[var(--cat-yellow-dark)]">Técnicos</span>
                  </h2>
                  <div className="hidden md:block px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                    {products.length} ACTIVOS CAT
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-[3rem] border-2 border-slate-100 overflow-hidden group hover:border-[var(--cat-yellow)] hover:shadow-4xl transition-all shadow-sm">
                      <div className="relative h-72 bg-slate-50 overflow-hidden flex items-center justify-center border-b-2 border-slate-50">
                        {product.image_url ? (
                          <Image src={product.image_url} alt={product.custom_name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <Package size={80} className="text-slate-100" />
                        )}
                        <div className="absolute top-6 left-6 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                          {product.catalog_master?.sku_cuim || product.sku_cuie || 'ID-GEN'}
                        </div>
                        <div className="absolute top-6 right-6 px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 rounded-lg text-[8px] font-black uppercase tracking-widest border border-slate-200">
                          MPN: {product.catalog_master?.sku_mpn || 'N/A'}
                        </div>
                      </div>
                      <div className="p-10 space-y-6 text-left">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-[var(--cat-yellow-dark)] uppercase tracking-[0.2em]">
                            {product.catalog_master?.brand || product.brand || 'Marca Genérica'}
                          </p>
                          <h4 className="font-black text-sm uppercase italic tracking-tighter text-slate-900 leading-tight h-12 line-clamp-2">
                            {product.custom_name}
                          </h4>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t-2 border-slate-50">
                          {product.unit_price ? (
                            <div className="flex flex-col">
                              <span className="text-2xl font-black text-slate-900 leading-none">
                                {formatCurrency(product.unit_price)}
                              </span>
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Precio Referencial</span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Consultar Cotiz.</span>
                          )}
                          <a href={`https://wa.me/${tenant.phone}?text=Me interesa el producto: ${product.custom_name}`} className="w-14 h-14 bg-[var(--cat-yellow)] text-black rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-cat border-b-4 border-[var(--cat-yellow-dark)]">
                            <MessageSquare size={24} fill="currentColor" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="py-24 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-inner">
                    <Package size={80} className="mx-auto text-slate-100 mb-8" />
                    <p className="text-2xl font-black text-slate-200 uppercase italic tracking-[0.3em]">Catálogo en Actualización CAT</p>
                  </div>
                )}

                <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                         <Building2 size={16} className="text-[var(--cat-yellow)]" />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0">Identificador Único Empresa (CID-CUIE)</p>
                         <p className="text-xs font-black text-slate-900 tracking-tighter uppercase italic">{tenant.sku_cuie || 'CORP-GEN-001'}</p>
                      </div>
                   </div>
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] text-center md:text-right leading-relaxed">
                      INFRAESTRUCTURA B2B EMPRESAS © 2026 — LATAM INDUSTRIAL
                   </p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
