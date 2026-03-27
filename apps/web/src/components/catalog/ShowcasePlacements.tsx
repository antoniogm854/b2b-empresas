"use client";

import { useState, useEffect } from "react";
import { 
  Star, 
  MapPin, 
  Package, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Info,
  Zap
} from "lucide-react";
import { showcaseService } from "@/lib/showcase-service";

export default function ShowcasePlacements({ category, productId }: { category: string, productId?: string }) {
  const [premiumShowcase, setPremiumShowcase] = useState<any[]>([]);
  const [nearbySuppliers, setNearbySuppliers] = useState<any[]>([]);
 
  useEffect(() => {
    const loadShowcase = async () => {
      const showcase = await showcaseService.getFeaturedProducts(4);
      setPremiumShowcase(showcase);
      
      if (productId) {
        const nearby = await showcaseService.getNearbySuppliers(productId, "Lima, Peru");
        setNearbySuppliers(nearby);
      }
    };
    loadShowcase();
  }, [category, productId]);
 
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Premium Supplier Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-primary flex items-center space-x-2">
            <TrendingUp size={16} className="text-accent" />
            <span>VITRINA B2B - PROVEEDORES DESTACADOS</span>
          </h3>
          <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full uppercase tracking-widest">Verificado</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {premiumShowcase.map((item) => (
            <div key={item.id} className="bg-[var(--card)] border border-[var(--panel-border)] p-5 rounded-[2rem] hover:border-[#A2C367] transition-all hover:shadow-xl hover:shadow-[#A2C367]/5 group cursor-pointer shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center font-black text-lg uppercase">
                  {item.name[0]}
                </div>
              </div>
              <h4 className="font-black text-sm mb-1 group-hover:text-accent transition-colors uppercase">{item.name}</h4>
              <div className="flex items-center text-[11px] font-bold text-muted-foreground space-x-3">
                <span className="flex items-center text-emerald-600"><ShieldCheck size={12} className="mr-1" /> Validación Industrial</span>
              </div>
            </div>
          ))}
        </div>
      </section>
 
      {/* Nearby Stock Alert */}
      {nearbySuppliers.length > 0 && (
        <section className="bg-primary text-primary-foreground p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <MapPin size={120} />
          </div>
          <h3 className="text-lg font-black mb-6 flex items-center space-x-2 relative z-10 uppercase tracking-tighter">
            <MapPin className="text-accent" />
            <span>Disponibilidad CMb2b Cercana</span>
          </h3>
          <div className="space-y-4 relative z-10">
            {nearbySuppliers.map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-black/40 transition-all cursor-pointer">
                <div>
                  <p className="text-sm font-black uppercase">{s.name}</p>
                  <p className="text-[10px] font-bold text-accent italic uppercase tracking-wider">A solo {s.distance} de tu ubicación</p>
                </div>
                <button className="bg-accent text-primary p-2 rounded-xl hover:scale-110 transition-transform">
                  <ExternalLink size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
 
      {/* Showcase Widget Placeholder */}
      <section className="border-4 border-dashed border-[var(--panel-border)] rounded-[3rem] p-10 flex flex-col items-center justify-center text-center space-y-4 bg-white/5">
        <div className="w-12 h-12 bg-[var(--panel-bg)] rounded-full flex items-center justify-center">
          <Zap size={20} className="text-accent animate-pulse" />
        </div>
        <div className="max-w-xs">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Vitrina B2B</p>
          <p className="text-[10px] font-medium text-muted-foreground/60 italic uppercase tracking-wider">Espacio reservado para integraciones del Catálogo Maestro B2B y vinculación corporativa.</p>
        </div>
      </section>
    </div>
  );
}
