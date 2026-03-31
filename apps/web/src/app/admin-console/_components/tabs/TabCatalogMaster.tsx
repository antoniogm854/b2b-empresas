"use client";

import { useState, useEffect } from "react";
import {
  Search, Package, CheckCircle2, AlertCircle, XCircle,
  RefreshCw, Filter, ChevronDown, Database, Eye,
  Loader2, Tag, BarChart3
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { catalogService } from "@/lib/catalog-service";
import { getSpecsTemplate, SPECS_TEMPLATES } from "@/lib/catalog-utils";
import { Plus, Trash2, Save, X, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";

type ProductStatus = "active" | "review" | "inactive";

interface MasterProduct {
  id: string;
  sku_cuim: string | null;
  sku_gg: string | null;
  product_name: string;
  brand: string | null;
  model: string | null;
  description: string | null;
  image_url_1: string | null;
  status: ProductStatus;
  source: string | null;
  slug: string | null;
  specs_json: Record<string, string> | null;
  is_example: boolean;
  created_at: string;
}

const STATUS_CONFIG: Record<ProductStatus, { key: string, color: string }> = {
  active:   { key: "status_active",   color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  review:   { key: "status_review",   color: "bg-amber-100 text-amber-700 border-amber-200" },
  inactive: { key: "status_inactive", color: "bg-zinc-100 text-zinc-500 border-zinc-200" },
};

export function TabCatalogMaster() {
  const t = useTranslations('AdminConsole');
  const [products, setProducts] = useState<MasterProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | ProductStatus>("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<MasterProduct | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  
  // States for Specs Editor
  const [isEditingSpecs, setIsEditingSpecs] = useState(false);
  const [editingSpecs, setEditingSpecs] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  // Counters
  const total = products.length;
  const activeCount = products.filter(p => p.status === "active").length;
  const reviewCount = products.filter(p => p.status === "review").length;
  const inactiveCount = products.filter(p => p.status === "inactive").length;

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("catalog_master")
        .select("id, sku_cuim, sku_gg, product_name, brand, model, description, image_url_1, status, source, slug, specs_json, is_example, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      const rows = (data || []) as MasterProduct[];
      setProducts(rows);

      // Extract unique categories
      const cats = [...new Set(rows.map(p => p.sku_gg).filter(Boolean))] as string[];
      setCategories(cats);
    } catch (e) {
      console.error("Error fetching catalog_master:", e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: ProductStatus) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from("catalog_master")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      if (selectedProduct?.id === id) setSelectedProduct(prev => prev ? { ...prev, status } : prev);
    } catch (e) {
      console.error("Error updating status:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleEditSpecs = () => {
    if (!selectedProduct) return;
    setEditingSpecs(selectedProduct.specs_json || {});
    setIsEditingSpecs(!isEditingSpecs);
  };

  const handleUpdateSpec = (key: string, value: string) => {
    setEditingSpecs(prev => ({ ...prev, [key]: value }));
  };

  const handleAddCustomSpec = () => {
    if (!newKey.trim()) return;
    setEditingSpecs(prev => ({ ...prev, [newKey.trim()]: newValue.trim() }));
    setNewKey("");
    setNewValue("");
  };

  const handleRemoveSpec = (key: string) => {
    const next = { ...editingSpecs };
    delete next[key];
    setEditingSpecs(next);
  };

  const handleLoadTemplate = (category: string) => {
    const template = SPECS_TEMPLATES[category];
    if (template) {
      setEditingSpecs(prev => ({ ...prev, ...template }));
    }
  };

  const handleSaveMasterChanges = async () => {
    if (!selectedProduct) return;
    setUpdatingId(selectedProduct.id);
    try {
      const updated = await catalogService.updateMasterProduct(selectedProduct.id, {
        specs_json: editingSpecs
      });
      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, ...updated } : p));
      setSelectedProduct(prev => prev ? { ...prev, ...updated } : prev);
      setIsEditingSpecs(false);
    } catch (e) {
      console.error("Error saving master changes:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered view
  const filtered = products.filter(p => {
    const matchSearch = !search || 
      p.product_name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.sku_cuim || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.sku_gg || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    const matchCat = filterCategory === "all" || p.sku_gg === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  return (
    <div className="p-8 space-y-8">

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Database size={20} className="text-primary" />
            </div>
            <h2 className="text-3xl font-black text-primary uppercase tracking-tighter italic">
              {t('catalog_title')}
            </h2>
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">
            {t('catalog_subtitle')}
          </p>
        </div>
        <button
          onClick={fetchProducts}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-primary hover:text-white text-primary rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          {t('update_btn')}
        </button>
      </div>

      {/* ── CONTADORES ── */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: t('total_products'), value: total, color: "text-primary", bg: "bg-primary/5" },
          { label: t('status_active'),  value: activeCount,   color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: t('status_review'), value: reviewCount, color: "text-amber-600",  bg: "bg-amber-50" },
          { label: t('status_inactive'), value: inactiveCount, color: "text-zinc-500",   bg: "bg-zinc-50" },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} rounded-2xl p-5 border border-black/5`}>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── FILTROS ── */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Buscador */}
        <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 gap-3 focus-within:border-primary transition-colors">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder={t('search_placeholder')}
            className="bg-transparent outline-none text-sm font-bold w-full text-slate-700 placeholder:text-slate-400 uppercase tracking-wide"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filtro Status */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 pr-10 font-black text-xs uppercase tracking-widest text-slate-600 outline-none cursor-pointer focus:border-primary transition-colors"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="review">En revisión</option>
            <option value="inactive">Inactivos</option>
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        {/* Filtro Categoría */}
        {categories.length > 0 && (
          <div className="relative">
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 pr-10 font-black text-xs uppercase tracking-widest text-slate-600 outline-none cursor-pointer focus:border-primary transition-colors"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        )}
      </div>

      {/* ── TABLA ── */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={40} className="animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
          <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="font-black uppercase tracking-widest text-muted-foreground text-xs">
            Sin productos que coincidan
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-4 text-left font-black text-[10px] uppercase tracking-widest text-muted-foreground">Producto</th>
                <th className="px-5 py-4 text-left font-black text-[10px] uppercase tracking-widest text-muted-foreground hidden md:table-cell">Categoría</th>
                <th className="px-5 py-4 text-left font-black text-[10px] uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Marca / Modelo</th>
                <th className="px-5 py-4 text-left font-black text-[10px] uppercase tracking-widest text-muted-foreground">Estado</th>
                <th className="px-5 py-4 text-left font-black text-[10px] uppercase tracking-widest text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                  {/* Nombre */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                        {p.image_url_1
                          ? <img src={p.image_url_1} alt={p.product_name} className="w-full h-full object-cover" />
                          : <Package size={16} className="text-muted-foreground" />
                        }
                      </div>
                      <div>
                        <p className="font-black text-[11px] uppercase text-slate-800 leading-tight line-clamp-2 max-w-[200px]">{p.product_name}</p>
                        <p className="text-[9px] font-bold text-muted-foreground">{p.sku_cuim || "SKU pendiente"}</p>
                      </div>
                    </div>
                  </td>

                  {/* Categoría */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="inline-flex items-center gap-1 bg-primary/5 text-primary px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wide">
                      <Tag size={10} />{p.sku_gg || "—"}
                    </span>
                  </td>

                  {/* Marca/Modelo */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <p className="text-xs font-bold text-slate-700">{p.brand || "—"}</p>
                    <p className="text-[9px] text-muted-foreground font-medium">{p.model || "—"}</p>
                  </td>

                  {/* Status badge */}
                  <td className="px-5 py-4">
                    <span className={`inline-block border px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${STATUS_CONFIG[p.status]?.color || STATUS_CONFIG.review.color}`}>
                      {STATUS_CONFIG[p.status] ? t(STATUS_CONFIG[p.status].key) : p.status}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {updatingId === p.id ? (
                        <Loader2 size={14} className="animate-spin text-primary" />
                      ) : (
                        <>
                          {p.status !== "active" && (
                            <button
                              onClick={() => updateStatus(p.id, "active")}
                              title="Activar"
                              className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                          )}
                          {p.status !== "review" && (
                            <button
                              onClick={() => updateStatus(p.id, "review")}
                              title="Enviar a revisión"
                              className="p-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-all"
                            >
                              <AlertCircle size={14} />
                            </button>
                          )}
                          {p.status !== "inactive" && (
                            <button
                              onClick={() => updateStatus(p.id, "inactive")}
                              title="Desactivar"
                              className="p-2 rounded-xl bg-zinc-100 text-zinc-500 hover:bg-zinc-500 hover:text-white transition-all"
                            >
                              <XCircle size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedProduct(p)}
                            title="Ver detalle"
                            className="p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all"
                          >
                            <Eye size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pie de tabla */}
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {t('showing_info', { count: filtered.length, total: total })}
            </p>
            <div className="flex items-center gap-2">
              <BarChart3 size={12} className="text-muted-foreground" />
              <span className="text-[10px] font-bold text-muted-foreground">CMb2b — Catálogo Maestro B2B</span>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DETALLE ── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-white rounded-[3rem] p-8 max-w-lg w-full shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-slate-900 transition-colors"
            >
              <XCircle size={20} />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center">
                {selectedProduct.image_url_1
                  ? <img src={selectedProduct.image_url_1} alt={selectedProduct.product_name} className="w-full h-full object-cover" />
                  : <Package size={32} className="text-muted-foreground" />
                }
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">{selectedProduct.sku_cuim || "SKU-PENDIENTE"}</p>
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 leading-tight">{selectedProduct.product_name}</h3>
                <span className={`inline-block border px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest mt-2 ${STATUS_CONFIG[selectedProduct.status]?.color}`}>
                  {t(STATUS_CONFIG[selectedProduct.status].key)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Marca", value: selectedProduct.brand },
                { label: "Modelo", value: selectedProduct.model },
                { label: "Categoría", value: selectedProduct.sku_gg },
                { label: "Fuente", value: selectedProduct.source },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
                  <p className="text-sm font-black text-slate-800">{value || "—"}</p>
                </div>
              ))}
            </div>

            {selectedProduct.description && (
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">Descripción</p>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">{selectedProduct.description}</p>
              </div>
            )}

            {/* ── SEO SLUG ── */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">Slug SEO (URL)</p>
              <code className="text-[10px] font-mono text-emerald-700 bg-white px-2 py-1 rounded border border-emerald-100 block">
                /productos/{selectedProduct.slug || "generando..."}
              </code>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between pl-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Especificaciones Técnicas (JSON)</p>
                <button
                  onClick={handleToggleEditSpecs}
                  className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline"
                >
                  {isEditingSpecs ? "Cancelar" : "Editar Specs"}
                </button>
              </div>

              <div className="bg-slate-50 rounded-[2rem] p-5 border border-slate-200">
                {isEditingSpecs ? (
                  <div className="space-y-4">
                    {/* Templates Selector */}
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen size={14} className="text-primary shrink-0" />
                      <select 
                        onChange={(e) => handleLoadTemplate(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-2 py-1 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary w-full"
                        defaultValue=""
                      >
                        <option value="" disabled>Cargar Template...</option>
                        {Object.keys(SPECS_TEMPLATES).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Editor List */}
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                      {Object.entries(editingSpecs).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-2 group">
                          <div className="flex-1 bg-white border border-slate-100 rounded-xl px-3 py-1 flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase text-slate-400 select-none">{key.replace(/_/g, ' ')}</span>
                            <input 
                              type="text"
                              value={val}
                              onChange={(e) => handleUpdateSpec(key, e.target.value)}
                              className="bg-transparent text-right text-[10px] font-bold text-primary outline-none w-1/2"
                            />
                          </div>
                          <button onClick={() => handleRemoveSpec(key)} className="p-2 text-rose-400 hover:text-rose-600">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Custom Field */}
                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <input 
                          placeholder="Nombre campo..."
                          value={newKey}
                          onChange={(e) => setNewKey(e.target.value)}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold outline-none"
                        />
                        <input 
                          placeholder="Valor..."
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold outline-none"
                        />
                        <button 
                          onClick={handleAddCustomSpec}
                          className="p-2 bg-primary text-white rounded-xl"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={handleSaveMasterChanges}
                      disabled={updatingId === selectedProduct.id}
                      className="w-full bg-slate-900 text-white rounded-2xl py-3 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all"
                    >
                      {updatingId === selectedProduct.id ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Guardar Especificaciones</>}
                    </button>
                  </div>
                ) : (
                  <>
                    {!selectedProduct.specs_json || Object.keys(selectedProduct.specs_json).length === 0 ? (
                      <p className="text-[10px] font-bold text-muted-foreground text-center py-4 italic">Sin especificaciones técnicas</p>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(selectedProduct.specs_json).map(([key, val]) => (
                          <div key={key} className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-black uppercase text-slate-500">{key.replace(/_/g, ' ')}</span>
                            <span className="text-[11px] font-bold text-primary">{val}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Cambio de estado desde modal */}
            <div className="flex gap-3 pt-2">
              {(["active", "review", "inactive"] as ProductStatus[]).map(st => (
                <button
                  key={st}
                  onClick={() => updateStatus(selectedProduct.id, st)}
                  disabled={selectedProduct.status === st || updatingId === selectedProduct.id}
                  className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                    selectedProduct.status === st
                      ? STATUS_CONFIG[st].color + " cursor-default"
                      : "bg-slate-50 text-muted-foreground hover:bg-slate-200 border-slate-200"
                  }`}
                >
                  {updatingId === selectedProduct.id ? <Loader2 size={12} className="animate-spin mx-auto" /> : t(STATUS_CONFIG[st].key)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
