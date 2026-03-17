"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter, 
  Search,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { adService, FeaturedProduct } from "@/lib/ad-service";

export default function AdminAdsPage() {
  const [requests, setRequests] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      // En un entorno real, filtraríamos por ad_status=pending desde el servicio
      // Aquí simulamos la carga de productos destacados para revisión
      const data = await adService.getFeaturedProducts(20);
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await adService.updateAdStatus(id, status);
      alert(`Anuncio ${status === 'approved' ? 'Aprobado' : 'Rechazado'} correctamente.`);
      loadRequests();
    } catch (e) {
      alert("Acceso Administrador Requerido (Simulado)");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 text-primary mb-2">
              <ShieldCheck size={24} />
              <span className="text-xs font-black uppercase tracking-widest italic">Panel de Control Propietario</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tightest uppercase italic">
              Autorización de <span className="text-accent underline decoration-4">Anuncios</span>
            </h1>
            <p className="text-muted-foreground font-semibold mt-4">
              Revisa y aprueba las solicitudes de promoción industrial para monetización.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl border-2 border-muted flex items-center gap-3">
              <Clock className="text-yellow-500" size={20} />
              <span className="font-black text-sm">3 PENDIENTES</span>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-[3rem] border-2 border-muted overflow-hidden shadow-xl">
          <div className="p-8 border-b border-muted bg-muted/20 flex justify-between items-center">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <Search className="text-muted-foreground" size={20} />
              <input 
                type="text" 
                placeholder="Buscar por empresa o producto..." 
                className="bg-transparent border-none outline-none font-bold text-sm w-full"
              />
            </div>
            <button className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
              <Filter size={16} />
              <span>Filtrar</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-muted">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Producto / Empresa</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Categoría</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Precio Ref</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estado</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Acciones de Propietario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {[
                  { id: "1", name: "Motor IE4 Premium", company: "Industrial Corp", category: "Motores", price: "$2,500", status: "pending" },
                  { id: "2", name: "Tablero IP65", company: "Power Solutions", category: "Electricidad", price: "$1,800", status: "pending" },
                ].map((req) => (
                  <tr key={req.id} className="hover:bg-muted/10 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center font-black text-[10px] text-muted-foreground">IMG</div>
                        <div>
                          <p className="font-black text-lg">{req.name}</p>
                          <p className="text-xs font-bold text-muted-foreground uppercase">{req.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 font-bold text-sm">{req.category}</td>
                    <td className="p-6 font-black text-primary italic">{req.price}</td>
                    <td className="p-6">
                      <span className="bg-yellow-100 text-yellow-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                        {req.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleAction(req.id, 'rejected')}
                          className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md active:scale-95"
                          title="Rechazar"
                        >
                          <XCircle size={20} />
                        </button>
                        <button 
                          onClick={() => handleAction(req.id, 'approved')}
                          className="p-3 rounded-xl bg-green-50 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-md active:scale-95"
                          title="Aprobar y Publicar"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button className="p-3 rounded-xl bg-muted text-primary hover:bg-primary hover:text-white transition-all">
                          <ExternalLink size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-primary p-10 rounded-[3rem] text-primary-foreground relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-black mb-4 uppercase italic">Recordatorio de Conciliación</h3>
              <p className="text-primary-foreground/70 font-medium leading-relaxed">
                Asegúrate de haber recibido el pago por el servicio de promoción antes de autorizar la publicación. 
                Una vez aprobado, el producto tendrá visibilidad prioritaria en la Vitrina Destacada por el tiempo estipulado.
              </p>
            </div>
            <button className="bg-accent text-primary px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-all shadow-2xl shadow-accent/20">
              Ver Historial de Cobros
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        </div>
      </div>
    </div>
  );
}
