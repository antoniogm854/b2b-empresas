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
  AlertCircle
} from "lucide-react";
import { companyService, Company } from "@/lib/company-service";
import { catalogService, Product } from "@/lib/catalog-service";
import { transactionalService, Lead } from "@/lib/transactional-service";

export default function DashboardPage() {
  const [company, setCompany] = useState<Company | null>(null);
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
      // In a real app, the owner_id comes from auth.
      // For this phase, we use the placeholder or the first company found.
      const ownerId = '00000000-0000-0000-0000-000000000000';
      const companyData = await companyService.getCompanyByOwner(ownerId);
      
      if (companyData) {
        setCompany(companyData);
        const [productsData, leadsData] = await Promise.all([
          catalogService.getCompanyProducts(companyData.id),
          transactionalService.getLeads(companyData.id)
        ]);
        setProducts(productsData);
        setLeads(leadsData);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { 
      label: "Vistas Totales", 
      value: "Simulado", 
      change: "+0%", 
      icon: TrendingUp, 
      color: "bg-blue-500" 
    },
    { 
      label: "Productos en Catálogo", 
      value: products.length.toString(), 
      change: `${products.filter(p => p.is_active).length} activos`, 
      icon: ShoppingBag, 
      color: "bg-accent" 
    },
    { 
      label: "Leads Recibidos", 
      value: leads.length.toString(), 
      change: `${leads.filter(l => l.status === 'pending').length} nuevos`, 
      icon: Plus, 
      color: "bg-green-500" 
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
      <div className="bg-red-500/5 border-2 border-red-500/20 p-12 rounded-[3rem] text-center space-y-6">
        <AlertCircle size={48} className="mx-auto text-red-500" />
        <h2 className="text-2xl font-black uppercase tracking-tightest">No se encontró una empresa</h2>
        <p className="text-muted-foreground font-medium max-w-sm mx-auto">Parece que aún no has completado tu registro como proveedor.</p>
        <button 
          onClick={() => window.location.href = '/register'}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl"
        >
          Ir al Registro
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tightest uppercase italic">Panel de Control</h1>
          <p className="text-muted-foreground font-semibold mt-2">Bienvenido, <span className="text-primary">{company.name}</span>. Gestiona tu infraestructura B2B.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-4 rounded-2xl font-black uppercase text-sm tracking-wider flex items-center hover:scale-[1.02] transition-all shadow-xl shadow-primary/20">
          <Plus size={20} className="mr-2" />
          Añadir Producto
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-background p-6 rounded-[2rem] border-2 border-muted/50 hover:border-accent transition-all group">
            <div className="flex justify-between items-start">
              <div className={`${stat.color} p-4 rounded-2xl shadow-lg shadow-background/10 text-white`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest bg-muted px-3 py-1 rounded-full">
                Tiempo Real
              </span>
            </div>
            <div className="mt-8">
              <p className="text-sm font-bold text-muted-foreground">{stat.label}</p>
              <h3 className="text-4xl font-black mt-1">{stat.value}</h3>
              <div className="flex items-center mt-4 text-xs font-black uppercase tracking-tighter">
                <span className="text-green-500 flex items-center">
                  <ArrowUpRight size={14} className="mr-1" />
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-2">Estado Actual</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-background p-8 rounded-[3rem] border-2 border-muted/50">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black uppercase italic">Leads Recientes</h2>
            <Link href="/dashboard/leads" className="text-xs font-black text-primary hover:underline italic">Ver Todos</Link>
          </div>
          <div className="space-y-6">
            {leads.slice(0, 5).map((lead, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-black">
                    {lead.customer_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase">{lead.customer_name}</p>
                    <p className="text-xs font-bold text-muted-foreground">Cotización por {lead.quote_items?.length || 0} productos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                    lead.status === 'pending' ? 'bg-accent text-primary' : 'bg-green-100 text-green-700'
                  }`}>
                    {lead.status === 'pending' ? 'Pendiente' : lead.status}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground flex items-center mt-1">
                    <Clock size={10} className="mr-1" />
                    {new Date(lead.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {leads.length === 0 && (
              <div className="text-center py-10 text-muted-foreground italic font-medium">
                No tienes leads aún. Recibirás notificaciones cuando los clientes coticen tus productos.
              </div>
            )}
          </div>
        </div>

        <div className="bg-primary text-primary-foreground p-8 rounded-[3rem] overflow-hidden relative group">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                <Building2 className="text-primary" size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase italic">Master GCM</h2>
            </div>
            <p className="text-primary-foreground/70 font-medium text-sm max-w-xs mb-10 leading-relaxed">
              Conecta tus productos directamente con la base de datos industrial para obtener especificaciones automáticas y visibilidad premium.
            </p>
            <button 
              onClick={() => window.location.href = '/marketplace'}
              className="mt-auto bg-accent text-primary p-4 px-8 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-[1.05] transition-all w-fit shadow-xl shadow-accent/10"
            >
              Explorar Catálogo Maestro
            </button>
          </div>
          {/* Abstract background effect */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-accent/30 transition-all duration-700" />
        </div>
      </div>
    </div>
  );
}
