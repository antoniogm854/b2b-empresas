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

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        // ID de empresa simulado para demostración
        const data = await analyticsService.getCompanyMetrics("CURRENT_COMPANY_ID");
        setMetrics(data);
      } catch (error) {
        console.error("Error loading metrics:", error);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const handleDownloadReport = () => {
    if (!metrics) return;

    const reportStats: ReportStats = {
      totalLeads: metrics.realLeads, // Datos reales de la tabla leads
      pendingLeads: metrics.realLeads > 5 ? 5 : metrics.realLeads, 
      totalViews: metrics.views || 0,
      topProducts: metrics.topProducts.map((p: any) => ({
        name: p.name,
        views: p.views
      })),
      period: new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' })
    };

    const company: CompanyData = {
      name: "Corporación Industrial AGM",
      ruc: "20601234567",
      address: "Av. Industrial 450, Lima",
      phone: "+51 987 654 321",
      email: "contacto@agm-industrial.com"
    };

    generateExecutiveReportPDF(reportStats, company);
  };

  const stats = [
    { label: "Vistas Totales", value: metrics?.views || 0, icon: MousePointerClick, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Leads Reales", value: metrics?.realLeads || 0, icon: Target, color: "text-accent", bg: "bg-accent/10" },
    { label: "Chats Iniciados", value: metrics?.chats || 0, icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-accent" size={48} />
        <p className="font-black uppercase tracking-widest text-muted-foreground animate-pulse">Sincronizando Métricas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tightest uppercase italic">Analytics 2.0</h1>
          <p className="text-muted-foreground font-semibold mt-2">Métricas avanzadas de conversión y rendimiento industrial.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleDownloadReport}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Download size={14} /> Descargar Reporte PDF
          </button>
          <div className="bg-background px-6 py-3 rounded-2xl border-2 border-muted/50 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Datos Live</span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-background p-8 rounded-[3rem] border-2 border-muted/50 hover:border-accent transition-all group">
            <div className={`${stat.bg} ${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border-b-4 border-current/20`}>
              <stat.icon size={32} />
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-5xl font-black tabular-nums">{stat.value}</h3>
              <span className="text-green-500 text-xs font-black flex items-center mb-1">
                <ArrowUpRight size={14} className="mr-1" />
                Live
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Heatmap / Popular Products */}
        <div className="lg:col-span-12">
          <div className="bg-background rounded-[3rem] border-2 border-muted/50 overflow-hidden">
            <div className="p-8 border-b-2 border-muted/30 flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase italic flex items-center">
                <BarChart3 className="mr-3 text-accent" size={28} />
                Mapa de Calor del Catálogo
              </h2>
              <span className="text-[10px] font-black uppercase bg-muted px-3 py-1 rounded-full text-muted-foreground">Items más buscados</span>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                {(metrics?.topProducts || []).length > 0 ? (
                  metrics.topProducts.map((item: any, i: number) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <p className="font-black text-sm uppercase">{item.name}</p>
                        <p className="text-xs font-bold text-muted-foreground">{item.views} vistas</p>
                      </div>
                      <div className="h-4 w-full bg-muted/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent transition-all duration-1000 ease-out" 
                          style={{ width: `${metrics?.views ? (item.views / metrics.views) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-10 text-muted-foreground font-black uppercase tracking-widest">Esperando datos de visualización...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Insights Placeholder */}
        <div className="lg:col-span-12">
           <div className="bg-primary text-primary-foreground p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
             <div className="relative z-10 max-w-xl">
               <h3 className="text-3xl font-black uppercase italic mb-4">Alcance Geográfico</h3>
               <p className="text-lg font-medium text-white/70 italic leading-relaxed">
                 Tus productos están siendo visualizados principalmente en <span className="text-accent underline decoration-2 underline-offset-4">Lima Norte</span> y <span className="text-accent underline decoration-2 underline-offset-4">Callao Industrial</span>.
               </p>
               <div className="flex space-x-4 mt-8">
                 <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/20">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Top Región</p>
                   <p className="text-xl font-black">Lima Centro</p>
                 </div>
                 <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/20">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Distancia Prom.</p>
                   <p className="text-xl font-black">12.5 KM</p>
                 </div>
               </div>
             </div>
             <div className="relative z-10 bg-white/10 p-10 rounded-full border border-white/20">
                <MapIcon size={80} className="text-accent animate-pulse" />
             </div>
             {/* Abstract Glow */}
             <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
           </div>
        </div>
      </div>
    </div>
  );
}
