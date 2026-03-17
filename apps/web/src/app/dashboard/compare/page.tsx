"use client";

import { useState, useEffect } from "react";
import { 
  GitCompare, 
  Zap, 
  Loader2, 
  TrendingUp, 
  CheckCircle2, 
  Minus, 
  ShieldCheck, 
  Info 
} from "lucide-react";
import { transactionalService } from "@/lib/transactional-service";

export default function ComparePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Demo: Comparar productos específicos (IDs de ejemplo)
  const productIds = ["PROD_ID_1", "PROD_ID_2"]; 

  useEffect(() => {
    async function fetchComparison() {
      setLoading(true);
      try {
        const data = await transactionalService.compareProducts(productIds);
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching comparison:", error);
      } finally {
        setLoading(false);
      }
    }
    // fetchComparison(); // Desactivado hasta tener IDs reales, pero la lógica está lista
  }, []);

  const comparisonData = [
    { 
      feature: "Eficiencia Energética", 
      myProduct: "98% (Premium)", 
      marketAvg: "92%", 
      status: "better" 
    },
    { 
      feature: "Tiempo de Entrega", 
      myProduct: "24-48h", 
      marketAvg: "3-5 días", 
      status: "better" 
    },
    { 
      feature: "Certificación ISO", 
      myProduct: "Incluida", 
      marketAvg: "Opcional", 
      status: "match" 
    },
    { 
      feature: "Garantía Industrial", 
      myProduct: "5 años", 
      marketAvg: "2 años", 
      status: "better" 
    },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tightest uppercase italic">Comparador B2B (APP_CBA)</h1>
          <p className="text-muted-foreground font-semibold mt-2">Diferenciación competitiva basada en el Global Catalog Master.</p>
        </div>
        <div className="bg-accent px-6 py-3 rounded-2xl flex items-center space-x-2 text-primary shadow-lg shadow-accent/20">
          <Zap size={20} className="fill-current" />
          <span className="text-xs font-black uppercase tracking-widest leading-none">Análisis en Tiempo Real</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="bg-background rounded-[3rem] border-2 border-muted/50 overflow-hidden shadow-sm">
            <div className="p-8 border-b-2 border-muted/30 bg-muted/5 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic flex items-center">
                <GitCompare className="mr-3 text-accent" size={28} />
                Matriz de Especificaciones
              </h2>
              <span className="text-[10px] font-black uppercase bg-muted px-3 py-1 rounded-full">Filtro: Industrial Premium</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-muted/20">
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Característica</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5">Mi Oferta</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Promedio Sector</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Impacto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/10">
                  {comparisonData.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/5 transition-colors group">
                      <td className="p-8 font-black text-sm uppercase italic">{row.feature}</td>
                      <td className="p-8 font-black text-sm bg-accent/5">{row.myProduct}</td>
                      <td className="p-8 font-bold text-sm text-muted-foreground">{row.marketAvg}</td>
                      <td className="p-8 flex justify-center">
                        {row.status === 'better' && (
                          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center animate-pulse">
                            <TrendingUp size={16} />
                          </div>
                        )}
                        {row.status === 'match' && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            <CheckCircle2 size={16} />
                          </div>
                        )}
                        {row.status === 'worse' && (
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                            <Minus size={16} />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-primary text-primary-foreground p-10 rounded-[3rem] space-y-8 relative overflow-hidden group">
            <h3 className="text-2xl font-black uppercase italic leading-tight">Índice de Ventaja Técnica</h3>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative w-40 h-40 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" className="stroke-white/10 fill-none" strokeWidth="12" />
                  <circle cx="80" cy="80" r="70" className="stroke-accent fill-none" strokeWidth="12" strokeDasharray="440" strokeDashoffset="88" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black tabular-nums">82%</span>
                  <span className="text-[10px] font-black uppercase tracking-tight opacity-60 italic">Market Leader</span>
                </div>
              </div>
              <p className="text-xs text-center font-medium opacity-70 italic leading-relaxed">
                Tu oferta técnica supera al 82% de los proveedores en la categoría de <span className="text-accent underline font-black">Sistemas Críticos</span>.
              </p>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="text-accent shrink-0" size={18} />
                <p className="text-xs font-bold leading-relaxed italic">
                  La integración nativa con GCM aumenta tu credibilidad ante el comprador.
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16" />
          </div>

          <div className="bg-muted/10 p-8 rounded-[3rem] border-2 border-dashed border-muted/50 space-y-6">
            <div className="flex items-center space-x-3">
               <Info className="text-accent" size={20} />
               <h4 className="font-black uppercase italic text-sm">CBA Insight</h4>
            </div>
            <p className="text-xs font-bold text-muted-foreground leading-relaxed italic">
              Emparejar precios con el mercado pero mantener tus specs superiores genera una conversión 3x mayor.
            </p>
            <button className="w-full bg-background border-2 border-muted hover:border-accent hover:bg-accent hover:text-primary py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all">
              Optimizar Oferta Técnica
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
