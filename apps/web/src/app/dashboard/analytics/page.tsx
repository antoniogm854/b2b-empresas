"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  Target, 
  Map as MapIcon,
  ArrowUpRight,
  Zap,
  Loader2,
  FileText,
  Download
} from "lucide-react";
import { analyticsService } from "@/lib/analytics-service";
import { generateExecutiveReportPDF, ReportStats } from "@/lib/pdf/report-service";
import { CompanyData } from "@/lib/pdf/quote-generator";
import { authService } from "@/lib/auth-service";
import { companyService, Tenant } from "@/lib/company-service";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const user = await authService.getCurrentUser();
        if (user && user.email) {
          const tenantData = await companyService.getTenantByUserEmail(user.email);
          if (tenantData) {
            setTenant(tenantData);
            const stats = await analyticsService.getCompanyMetrics(tenantData.id);
            setMetrics(stats);
          }
        }
      } catch (error) {
        console.error("Error loading analytics data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDownloadReport = () => {
    if (!metrics) return;

    const reportStats: ReportStats = {
      totalLeads: metrics.realLeads,
      pendingLeads: metrics.realLeads > 5 ? 5 : metrics.realLeads, 
      totalViews: metrics.views || 0,
      topProducts: metrics.topProducts.map((p: any) => ({
        name: p.name,
        views: p.views
      })),
      period: new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' })
    };

    const companyData: CompanyData = {
      name: tenant?.company_name || "Empresa Industrial B2B",
      ruc: tenant?.ruc_rut_nit || "N/A",
      address: tenant?.fiscal_address || "N/A",
      phone: tenant?.phone || "N/A",
      email: tenant?.email || "N/A"
    };

    generateExecutiveReportPDF(reportStats, companyData);
  };

  const stats = [
    { label: "Impacto Visual", sublabel: "Vistas Únicas", value: metrics?.views || 0, icon: MousePointerClick, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Intención de Compra", sublabel: "Contactos Recibidos", value: metrics?.realLeads || 0, icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Engagement Ratio", sublabel: "% Conversión", value: `${metrics?.conversionRate?.toFixed(1) || 0}%`, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="relative w-24 h-24">
           <div className="absolute inset-0 border-4 border-accent/20 rounded-full" />
           <div className="absolute inset-0 border-4 border-accent rounded-full border-t-transparent animate-spin" />
        </div>
        <div className="text-center space-y-2">
           <p className="font-black uppercase tracking-[.3em] text-zinc-900">Sincronizando Nodo Central</p>
           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Accediendo a Master_Data_Catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-2 h-8 bg-accent rounded-full" />
             <h1 className="text-5xl font-black tracking-tightest uppercase italic leading-none">Control_Hub <span className="text-accent underline decoration-8 underline-offset-8">v1.01</span></h1>
          </div>
          <p className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.2em] pl-5">Inteligencia de Mercado y Ratios de Conversión Industrial</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={handleDownloadReport}
            className="flex-1 md:flex-none bg-zinc-950 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-zinc-200 group"
          >
            <Download size={16} className="text-accent group-hover:animate-bounce" /> Reporte Ejecutivo PDF
          </button>
          <div className="hidden lg:flex bg-white px-6 py-4 rounded-2xl border-2 border-zinc-100 items-center space-x-3 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Protocolo Live_Sync Activo</span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-[3.5rem] border-2 border-zinc-50 hover:border-accent hover:shadow-2xl hover:shadow-accent/5 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.02] rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" style={{ color: stat.color }} />
            
            <div className="relative z-10 flex flex-col h-full">
               <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-10 shadow-inner`}>
                 <stat.icon size={28} />
               </div>
               <div className="space-y-1 mb-6">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[.2em]">{stat.label}</p>
                  <p className="text-xs font-black text-zinc-900 uppercase tracking-widest">{stat.sublabel}</p>
               </div>
               <div className="flex items-end justify-between mt-auto pt-6 border-t border-zinc-50">
                 <h3 className="text-6xl font-black tabular-nums tracking-tighter italic">{stat.value}</h3>
                 <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg group-hover:animate-pulse">
                   <ArrowUpRight size={20} />
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Heatmap / Popular Products */}
        <div className="lg:col-span-12">
          <div className="bg-zinc-950 text-white rounded-[4rem] overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
            
            <div className="p-12 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-accent/20 p-4 rounded-2xl border border-white/10">
                   <BarChart3 className="text-accent" size={32} />
                </div>
                <div>
                   <h2 className="text-3xl font-black uppercase italic tracking-tighter">Ranking_Productos_2026</h2>
                   <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Análisis de Interés Industrial por SKU</p>
                </div>
              </div>
              <div className="flex gap-2">
                 {['Día', 'Semana', 'Mes'].map(t => (
                   <button key={t} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${t === 'Mes' ? 'bg-accent text-zinc-950' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}>{t}</button>
                 ))}
              </div>
            </div>
            
            <div className="p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
                {(metrics?.topProducts || []).length > 0 ? (
                  metrics.topProducts.map((item: any, i: number) => (
                    <div key={i} className="group cursor-default">
                      <div className="flex justify-between items-end mb-4 px-2">
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black text-accent/50 group-hover:text-accent transition-colors tabular-nums tracking-[0.5em]">{`0${i+1}`}</span>
                           <p className="font-black text-sm uppercase tracking-widest text-white/90 group-hover:text-white transition-colors">{item.name}</p>
                        </div>
                        <p className="text-[10px] font-black text-white/50">{item.views} VISTAS</p>
                      </div>
                      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-accent transition-all duration-1000 ease-out relative" 
                          style={{ width: `${metrics?.views ? (item.views / metrics.views) * 120 : 0}%`, maxWidth: '100%' }}
                        >
                           <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                    <p className="text-white/20 font-black uppercase tracking-[0.5em] animate-pulse">Iniciando Sensor de Demanda...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Insights */}
        <div className="lg:col-span-12">
           <div className="bg-gradient-to-br from-zinc-50 to-white p-12 lg:p-20 rounded-[4.5rem] border-2 border-zinc-100 flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden group">
             {/* Map Graphic Simulation */}
             <div className="relative z-10 w-full lg:w-1/2 space-y-10">
               <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-accent/10 px-4 py-1.5 rounded-full w-fit">
                     <MapIcon size={14} className="text-accent" />
                     <span className="text-[10px] font-black uppercase text-accent tracking-widest">Geo_Intelligence Root</span>
                  </div>
                  <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-none text-zinc-950">Alcance Industrial</h3>
                  <p className="text-lg font-bold text-zinc-500 italic leading-relaxed uppercase tracking-tight">
                    Tráfico concentrado en zonas estratégicas de <span className="text-zinc-950 underline decoration-4 decoration-accent underline-offset-8">Lima Norte</span> y <span className="text-zinc-950 underline decoration-4 decoration-accent underline-offset-8">Callao Industrial</span>.
                  </p>
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                 <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl transition-all">
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Cluster Top</p>
                   <p className="text-2xl font-black italic tracking-tighter">Huari / Los Olivos</p>
                   <div className="mt-4 flex items-center gap-2">
                      <div className="h-1 flex-1 bg-zinc-50 rounded-full overflow-hidden">
                         <div className="h-full bg-accent w-[85%]" />
                      </div>
                      <span className="text-[9px] font-black">85%</span>
                   </div>
                 </div>
                 <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl transition-all">
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Radio Activo</p>
                   <p className="text-2xl font-black italic tracking-tighter">12.5 KM <span className="text-xs opacity-30 text-zinc-400 uppercase">Perímetro</span></p>
                   <div className="mt-4 flex items-center gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-widest">
                      <Zap size={10} /> +12% Crecimiento
                   </div>
                 </div>
               </div>
             </div>
             
             <div className="relative z-10 lg:w-auto">
                <div className="relative">
                   <div className="absolute inset-0 bg-accent blur-[100px] opacity-20 animate-pulse rounded-full" />
                   <div className="bg-zinc-950 p-16 rounded-full border-[10px] border-white shadow-2xl relative hover:scale-110 transition-transform duration-700">
                      <MapIcon size={120} className="text-accent" />
                   </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
