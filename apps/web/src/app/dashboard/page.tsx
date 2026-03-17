"use client";

import { 
  Plus, 
  ArrowUpRight, 
  ShoppingBag, 
  TrendingUp, 
  Clock 
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { label: "Vistas Totales", value: "1,240", change: "+12.5%", icon: TrendingUp, color: "bg-blue-500" },
    { label: "Productos en Catálogo", value: "48", change: "2 nuevos", icon: ShoppingBag, color: "bg-accent" },
    { label: "Leads Recibidos", value: "12", change: "+4 hoy", icon: Plus, color: "bg-green-500" },
  ];

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tightest uppercase italic">Panel de Control</h1>
          <p className="text-muted-foreground font-semibold mt-2">Bienvenido de nuevo, aquí tienes un resumen de tu actividad.</p>
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
                Últimos 30 días
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
                <span className="text-muted-foreground ml-2">vs mes anterior</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity (Placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-background p-8 rounded-[3rem] border-2 border-muted/50">
          <h2 className="text-2xl font-black uppercase italic mb-8">Leads Recientes</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-black">
                    JP
                  </div>
                  <div>
                    <p className="font-black text-sm">Juan Pérez</p>
                    <p className="text-xs font-bold text-muted-foreground">Cotización #1204</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-accent uppercase">Nuevo</p>
                  <p className="text-[10px] font-bold text-muted-foreground flex items-center">
                    <Clock size={10} className="mr-1" />
                    Hace 2h
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary text-primary-foreground p-8 rounded-[3rem] overflow-hidden relative">
          <div className="relative z-10 flex flex-col h-full">
            <h2 className="text-2xl font-black uppercase italic mb-4">Master GCM</h2>
            <p className="text-primary-foreground/70 font-medium text-sm max-w-xs mb-10">
              Conecta tus productos directamente con la base de datos industrial para obtener especificaciones automáticas.
            </p>
            <button className="mt-auto bg-accent text-primary p-4 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-all w-fit">
              Explorar Catálogo Maestro
            </button>
          </div>
          {/* Abstract SVG Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-20 -mt-20" />
        </div>
      </div>
    </div>
  );
}
