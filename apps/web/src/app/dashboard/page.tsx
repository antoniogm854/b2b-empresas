"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  ArrowUpRight, 
  ShoppingBag, 
  TrendingUp, 
  Clock,
  Building2,
  Zap,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { companyService, Tenant } from "@/lib/company-service";
import { catalogService, Product } from "@/lib/catalog-service";
import { transactionalService, Lead } from "@/lib/transactional-service";
import { authService } from "@/lib/auth-service";

export default function DashboardPage() {
  const [company, setCompany] = useState<Tenant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const user = await authService.getCurrentUser();
      
      if (user && user.email) {
        const companyData = await companyService.getTenantByUserEmail(user.email);
        
        if (companyData) {
          setCompany(companyData);
          const [productsData, leadsData] = await Promise.all([
            catalogService.getTenantProducts(companyData.id),
            transactionalService.getLeads(companyData.id)
          ]);
          setProducts(productsData);
          setLeads(leadsData);
        }
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { 
      label: "Interacciones Totales", 
      value: "1,280", 
      change: "+12.5%", 
      icon: TrendingUp, 
      color: "bg-[#4B6319] shadow-[#4B6319]/20" 
    },
    { 
      label: "Catálogo Activo", 
      value: products.length.toString(), 
      change: `${products.filter(p => p.is_active).length} online`, 
      icon: ShoppingBag, 
      color: "bg-[#A2C367] text-black shadow-[#A2C367]/20" 
    },
    { 
      label: "Prospectos (Leads)", 
      value: leads.length.toString(), 
      change: `${leads.filter(l => l.status === 'new').length} nuevos`, 
      icon: Plus, 
      color: "bg-zinc-800 shadow-black/20" 
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Zap className="animate-bounce text-accent" size={48} />
          <p className="font-black text-xs uppercase tracking-[0.3em] text-muted-foreground">Sincronizando Datos...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="bg-[var(--card)] border border-red-500/20 p-16 rounded-[3rem] text-center space-y-8 shadow-2xl shadow-red-500/5 max-w-2xl mx-auto mt-12 animate-fade-in">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-600">
           <AlertCircle size={56} />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">Empresa no Registrada</h2>
          <p className="text-[var(--muted-foreground)] font-medium max-w-sm mx-auto">
            Detectamos que aún no has vinculado una empresa a tu cuenta. Para activar tu catálogo, completa el perfil corporativo.
          </p>
        </div>
        <button 
          onClick={() => window.location.href = '/register'}
          className="bg-[var(--primary)] text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.05] transition-all"
        >
          COMPLETAR MI PERFIL
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-8 bg-[var(--primary)] rounded-full shadow-[0_0_15px_rgba(75,99,25,0.3)]" />
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-[var(--strong-text)] leading-none">Vista <span className="text-[var(--primary)]">General</span></h1>
          </div>
          <p className="text-[var(--muted-foreground)] font-bold uppercase tracking-[0.3em] text-[10px] pl-5 border-l border-[var(--border)] ml-1">
             Socio Estratégico: <span className="text-[var(--primary)]">{company.company_name}</span> <span className="text-[var(--border)] mx-2">/</span> Gestión B2B
          </p>
        </div>
        <Link 
          href="/dashboard/catalog?tab=gcm"
          className="bg-[#A2C367] text-black px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center hover:scale-105 transition-all shadow-[0_0_30px_rgba(162,195,103,0.2)] group"
        >
          <Plus size={18} className="mr-3 group-hover:rotate-90 transition-transform" />
          Nuevo SKU
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-8 rounded-[3rem] border border-[var(--border)] group shadow-2xl relative overflow-hidden transition-all hover:border-[#A2C367]/40 hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A2C367]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start relative z-10">
              <div className={`${stat.color} p-4 rounded-2xl shadow-xl flex items-center justify-center`}>
                <stat.icon size={26} />
              </div>
              <span className="text-[9px] font-black text-[var(--muted-foreground)] uppercase tracking-widest bg-[var(--muted)] px-4 py-2 rounded-full border border-[var(--border)]">
                Operativo 24/7
              </span>
            </div>
            <div className="mt-10 relative z-10">
              <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-5xl font-black mt-2 tracking-tighter italic text-[var(--strong-text)]">{stat.value}</h3>
              <div className="flex items-center mt-8 p-3 bg-[var(--muted)]/40 rounded-xl w-fit border border-[var(--border)]">
                <span className="text-[#A2C367] flex items-center font-black text-[10px] uppercase tracking-wider">
                  <ArrowUpRight size={14} className="mr-1.5" />
                  {stat.change}
                </span>
                <span className="text-[var(--muted-foreground)] ml-4 text-[9px] font-black uppercase tracking-widest pl-4 border-l border-[var(--border)] text-nowrap">Status Global</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-mesh p-10 rounded-[3.5rem] border border-[#4B6319]/30 shadow-2xl relative overflow-hidden group flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
         <div className="flex items-center gap-8 text-center md:text-left relative z-10">
            <div className="bg-[#A2C367] text-black p-5 rounded-2xl shadow-[0_0_30px_rgba(162,195,103,0.3)]">
               <Zap size={36} />
            </div>
            <div>
               <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[#A2C367]">Catálogo Digital CDB2B</h2>
               <p className="text-[var(--foreground)] opacity-70 font-bold text-xs uppercase tracking-widest mt-2 px-1 rounded-sm bg-black/5 dark:bg-black/20 backdrop-blur-sm">
                 Personaliza tu vitrina industrial y genera tu identidad QR corporativa.
               </p>
            </div>
         </div>
         <Link 
            href="/dashboard/cdb2b"
            className="w-full md:w-auto bg-white text-black px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#A2C367] transition-all shadow-2xl text-center relative z-10"
         >
            GESTIONAR VITRINA
         </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 glass p-12 rounded-[3.5rem] border border-[var(--border)] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#A2C367]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex justify-between items-center mb-12 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-1.5 h-8 bg-[#A2C367] rounded-full shadow-[0_0_10px_#A2C367]"></div>
               <h2 className="text-2xl font-black uppercase italic tracking-tighter text-[var(--strong-text)]">Leads Estratégicos</h2>
            </div>
            <Link href="/dashboard/leads" className="text-[10px] font-black text-[#A2C367] hover:text-[#A2C367]/80 transition-colors uppercase tracking-widest">Ver Registro Maestro</Link>
          </div>
          <div className="space-y-4 relative z-10">
            {leads.slice(0, 5).map((lead, i) => (
              <div key={i} className="flex items-center justify-between p-6 rounded-[1.8rem] bg-[var(--muted)]/20 border border-[var(--border)] hover:border-[#A2C367]/40 hover:bg-[var(--muted)]/40 transition-all cursor-pointer group">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-[1.2rem] bg-[var(--muted)] border border-[var(--border)] text-[var(--primary)] flex items-center justify-center font-black text-2xl italic shadow-inner group-hover:border-[var(--primary)]/50 transition-all">
                    {lead.buyer_name?.substring(0, 2).toUpperCase() || 'LR'}
                  </div>
                  <div>
                    <p className="font-black text-base uppercase tracking-tight text-[var(--strong-text)]">{lead.buyer_name || 'Prospecto Industrial'}</p>
                    <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mt-2 flex items-center gap-2">
                       <Building2 size={12} className="text-[var(--primary)]" /> Cotización Global <span className="text-[var(--border)] mx-1">|</span> {lead.products_interested?.length || 0} SKU INTERÉS
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <p className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full border ${
                    lead.status === 'new' ? 'bg-[#A2C367]/10 text-[#A2C367] border-[#A2C367]/20 shadow-[0_0_10px_rgba(162,195,103,0.1)]' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}>
                    {lead.status === 'new' ? 'PENDIENTE' : lead.status.toUpperCase()}
                  </p>
                  <p className="text-[10px] font-black text-zinc-600 uppercase flex items-center tracking-widest">
                    <Clock size={12} className="mr-2" />
                    {new Date(lead.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {leads.length === 0 && (
              <div className="text-center py-20 bg-zinc-900/20 rounded-[2.5rem] border border-dashed border-zinc-800">
                <p className="font-black uppercase text-[10px] tracking-[0.4em] text-zinc-700">Sin Prospectos Activos en el Sistema</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[var(--deep-section)] text-white p-10 rounded-[3rem] overflow-hidden relative group flex flex-col justify-center min-h-[400px]">
          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                <Zap className="text-[var(--accent)]" size={32} />
              </div>
              <h2 className="text-3xl font-black uppercase italic leading-none tracking-tighter">Sincronización CMb2b</h2>
              <p className="text-white/60 font-medium text-sm leading-relaxed">
                Conectado con el mayor Catálogo Maestro de la industria. Sus productos ahora son visibles para miles de prospectos calificados.
              </p>
            </div>
            
            <Link 
              href="/dashboard/catalog?tab=gcm"
              className="inline-flex items-center justify-center bg-white text-[var(--deep-section)] px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[var(--accent)] transition-all shadow-2xl group/btn"
            >
              GESTIONAR SINCRONIZACIÓN <ChevronRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-white/10 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--primary)]/20 rounded-full blur-[60px] -ml-20 -mb-20" />
        </div>
      </div>
    </div>
  );
}
