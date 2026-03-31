"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { FeaturedProduct } from "@/lib/showcase-service";
import { formatCurrency } from "@/lib/currency-utils";
import { useState } from "react";

interface HomeProductGridProps {
  featured: FeaturedProduct[];
  searchPlaceholder?: string;
  searchBtn?: string;
  catalogEmpty?: string;
}

export default function HomeProductGrid({
  featured,
  searchPlaceholder = "Buscar SKU-CUIM, Código, Nombre...",
  searchBtn = "BUSCAR PRODUCTO",
  catalogEmpty = "EL CATÁLOGO MAESTRO SE ENCUENTRA EN ACTUALIZACIÓN.",
}: HomeProductGridProps) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? featured.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.sku.toLowerCase().includes(query.toLowerCase())
      )
    : featured;

  return (
    <>
      {/* Modern Search v6.0 */}
      <div className="glass p-3 rounded-[2.5rem] border-zinc-200 shadow-2xl flex flex-col md:flex-row gap-3">
        <div className="flex-grow relative group">
          <svg
            className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--primary)] transition-colors w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-16 pl-16 pr-8 bg-zinc-50 border-none rounded-[2rem] font-bold text-lg focus:ring-2 focus:ring-[var(--primary)]/20 transition-all outline-none"
            aria-label="Buscar productos en el catálogo maestro B2B"
          />
        </div>
        <Link
          href={`/marketplace${query ? `?query=${encodeURIComponent(query)}` : ""}`}
          className="bg-[#556B2F] text-white px-10 h-16 rounded-[2rem] font-black uppercase tracking-[0.2em] italic hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#556B2F]/20 flex items-center justify-center"
        >
          {searchBtn}
        </Link>
      </div>

      {/* Featured Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
        {filtered.length > 0 ? (
          filtered.slice(0, 3).map((item, i) => (
            <div
              key={item.id}
              className="glass rounded-[2.5rem] border-zinc-200 overflow-hidden group hover:shadow-2xl transition-all shadow-sm"
            >
              <div className="relative h-64 bg-slate-50 border-b border-zinc-100 flex items-center justify-center overflow-hidden">
                {item.image_url && item.image_url !== "/hero.webp" ? (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 relative">
                    {i % 2 === 0 && (
                      <div className="absolute inset-0 bg-[#A2C367]/10 blur-3xl rounded-full animate-pulse" />
                    )}
                    <Package
                      size={48}
                      className={`${i % 2 === 0 ? "text-[#A2C367]" : "text-zinc-400"} opacity-30 mb-4 relative z-10 scale-125`}
                    />
                    <div
                      className={`font-black uppercase tracking-widest italic relative z-10 text-[10px] leading-tight ${i % 2 === 0 ? "text-[#A2C367]/50" : "text-zinc-500"}`}
                    >
                      IMAGEN EN <br /> DESARROLLO
                    </div>
                  </div>
                )}
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-[var(--panel-subtext)] border border-zinc-200 z-20">
                  SKU-CUIM: {item.sku}
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 bg-[var(--primary)] text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg z-20">
                  CMB2B
                </div>
              </div>
              <div className="p-8 text-left space-y-4">
                <h3 className="font-black uppercase tracking-tighter italic text-[var(--strong-text)] leading-tight h-12 line-clamp-2">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <span className="text-xl font-black text-[#556B2F]">
                    {formatCurrency(item.price)}
                  </span>
                  <Link
                    href="/marketplace"
                    className="text-[10px] font-black uppercase tracking-widest text-[var(--panel-subtext)] flex items-center gap-2 hover:text-[var(--primary)] transition-colors"
                  >
                    VER FICHA TÉCNICA <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-3 py-20 bg-zinc-100 rounded-[3rem] text-zinc-400 font-black uppercase tracking-[0.3em] italic text-center">
            {catalogEmpty}
          </div>
        )}
      </div>
    </>
  );
}
