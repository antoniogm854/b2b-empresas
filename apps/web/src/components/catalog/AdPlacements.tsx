"use client";

import { useState, useEffect } from "react";
import { 
  Star, 
  MapPin, 
  Package, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Info
} from "lucide-react";
import { showcaseService } from "@/lib/showcase-service";

export default function AdPlacements({ category, productId }: { category: string, productId?: string }) {
  const [premiumAds, setPremiumAds] = useState<any[]>([]);
  const [nearbySuppliers, setNearbySuppliers] = useState<any[]>([]);

  useEffect(() => {
    const loadAds = async () => {
      const ads = await showcaseService.getFeaturedProducts(4);
      setPremiumAds(ads);
      
      if (productId) {
        const nearby = await showcaseService.getNearbySuppliers(productId, "Lima, Peru");
        setNearbySuppliers(nearby);
      }
    };
    loadAds();
  }, [category, productId]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Premium Supplier Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-primary flex items-center space-x-2">
            <TrendingUp size={16} className="text-accent" />
            <span>PROVEEDORES DESTACADOS</span>
          </h3>
          <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">PATROCINADO</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {premiumAds.map((ad) => (
            <div key={ad.id} className="bg-[var(--card)] border border-[var(--panel-border)] p-5 rounded-[2rem] hover:border-[#A2C367] transition-all hover:shadow-xl hover:shadow-[#A2C367]/5 group cursor-pointer shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center font-black text-lg">
                  {ad.name[0]}
                </div>
              </div>
              <h4 className="font-black text-sm mb-1 group-hover:text-accent transition-colors">{ad.name}</h4>
              <div className="flex items-center text-[11px] font-bold text-muted-foreground space-x-3">
                <span className="flex items-center text-emerald-600"><ShieldCheck size={12} className="mr-1" /> Verificado</span>
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
          <h3 className="text-lg font-black mb-6 flex items-center space-x-2 relative z-10">
            <MapPin className="text-accent" />
            <span>DISPONIBILIDAD CERCANA</span>
          </h3>
          <div className="space-y-4 relative z-10">
            {nearbySuppliers.map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-black/40 transition-all cursor-pointer">
                <div>
                  <p className="text-sm font-black">{s.name}</p>
                  <p className="text-[10px] font-bold text-accent italic">A solo {s.distance} de tu ubicación</p>
                </div>
                <button className="bg-accent text-primary p-2 rounded-xl hover:scale-110 transition-transform">
                  <ExternalLink size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* External Ad Widget Placeholder */}
      <section className="border-4 border-dashed border-[var(--panel-border)] rounded-[3rem] p-10 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 bg-[var(--panel-bg)] rounded-full flex items-center justify-center">
          <Info size={20} className="text-muted-foreground" />
        </div>
        <div className="max-w-xs">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Publicidad Externa</p>
          <p className="text-[10px] font-medium text-muted-foreground/60 italic">Este espacio está reservado para integraciones dinámicas de redes sociales y banners externos.</p>
        </div>
      </section>
    </div>
  );
}
