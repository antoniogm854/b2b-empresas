"use client";

import { Sparkles, ArrowRight } from "lucide-react";

interface PromotionalBannerProps {
  products: any[];
}

export default function PromotionalBanner({ products }: PromotionalBannerProps) {
  const featuredProducts = products.filter(p => p.is_most_requested);
  
  if (featuredProducts.length === 0) return null;

  return (
    <div className="bg-amber-500 text-black py-2 overflow-hidden border-b border-amber-600 relative z-50">
      <div className="flex whitespace-nowrap animate-infinite-scroll hover:[animation-play-state:paused]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-12 px-6">
            {featuredProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <Sparkles size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                  DESTACADO: {p.custom_name}
                  <span className="bg-black/10 px-2 py-0.5 rounded text-[8px] font-bold">¡VER MÁS!</span>
                </span>
                <div className="w-1.5 h-1.5 bg-black/20 rounded-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
