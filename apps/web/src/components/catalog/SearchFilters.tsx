"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { Search, Filter, X, ChevronDown, Tag, DollarSign, Building2 } from "lucide-react";

interface SearchFiltersProps {
  categories?: string[];
  brands?: string[];
  onFilterChange?: (filters: any) => void;
}

export default function SearchFilters({ categories = [], brands = [], onFilterChange }: SearchFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    query: searchParams.get("query") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || ""
  });

  // Sincronizar estado local con URL al cargar o cambiar URL
  useEffect(() => {
    setLocalFilters({
      query: searchParams.get("query") || "",
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || ""
    });
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`);
    if (onFilterChange) onFilterChange(localFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const empty = { query: "", category: "", brand: "", minPrice: "", maxPrice: "" };
    setLocalFilters(empty);
    router.push(pathname);
    if (onFilterChange) onFilterChange(empty);
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Bar Principal */}
      <div className="flex gap-2">
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--primary)] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por SKU, nombre, descripción..."
            value={localFilters.query}
            onChange={(e) => setLocalFilters({...localFilters, query: e.target.value})}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[var(--cat-yellow)]/20 outline-none transition-all shadow-sm"
          />
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`px-6 h-14 rounded-2xl border-2 flex items-center gap-2 font-black text-xs uppercase tracking-widest transition-all ${
            isOpen || Object.values(localFilters).some(v => v !== "" && v !== localFilters.query)
            ? 'bg-slate-900 text-white border-slate-900 shadow-xl'
            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 shadow-sm'
          }`}
        >
          <Filter size={18} />
          <span className="hidden md:inline">Filtros Avanzados</span>
          {Object.values(localFilters).filter(v => v !== "" && v !== localFilters.query).length > 0 && (
            <span className="ml-1 bg-[var(--cat-yellow)] text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">
              {Object.values(localFilters).filter(v => v !== "" && v !== localFilters.query).length}
            </span>
          )}
        </button>
        <button 
          onClick={applyFilters}
          className="bg-[var(--cat-yellow)] text-black px-10 h-14 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-cat border-b-4 border-[var(--cat-yellow-dark)] active:border-b-0"
        >
          Filtrar
        </button>
      </div>

      {/* Panel de Filtros Extendidos */}
      {isOpen && (
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 animate-in fade-in slide-in-from-top-4 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-3xl relative z-20">
          
          {/* Categorías */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
              <Tag size={12} className="text-[var(--cat-yellow-dark)]" /> Categoría
            </label>
            <select 
              value={localFilters.category}
              onChange={(e) => setLocalFilters({...localFilters, category: e.target.value})}
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-[var(--cat-yellow)] focus:bg-white transition-all shadow-inner"
            >
              <option value="">Todas las categorías</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Marcas */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
              <Building2 size={12} className="text-[var(--cat-yellow-dark)]" /> Marca / Fabricante
            </label>
            <select 
              value={localFilters.brand}
              onChange={(e) => setLocalFilters({...localFilters, brand: e.target.value})}
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-[var(--cat-yellow)] focus:bg-white transition-all shadow-inner"
            >
              <option value="">Todas las marcas</option>
              {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
            </select>
          </div>

          {/* Rango de Precios */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
              <DollarSign size={12} className="text-[var(--cat-yellow-dark)]" /> Rango de Precio (USD)
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                placeholder="Min"
                value={localFilters.minPrice}
                onChange={(e) => setLocalFilters({...localFilters, minPrice: e.target.value})}
                className="w-1/2 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-[var(--cat-yellow)] focus:bg-white transition-all shadow-inner"
              />
              <span className="text-slate-300">-</span>
              <input 
                type="number" 
                placeholder="Max"
                value={localFilters.maxPrice}
                onChange={(e) => setLocalFilters({...localFilters, maxPrice: e.target.value})}
                className="w-1/2 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-[var(--cat-yellow)] focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Acciones Footer */}
          <div className="md:col-span-3 pt-6 border-t-2 border-slate-50 flex justify-end gap-4">
            <button 
              onClick={clearFilters}
              className="px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
            >
              Limpiar Filtros
            </button>
            <button 
              onClick={applyFilters}
              className="bg-[var(--primary)] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02] transition-all"
            >
              Aplicar Búsqueda Paramétrica
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
