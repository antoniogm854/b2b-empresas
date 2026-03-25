"use client";

import { use, useState, useEffect } from "react";
import { 
  ArrowLeft, 
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Loader2,
  Zap,
  Tag,
  AlertTriangle,
  FileText,
  Info,
  ShieldCheck,
  Building2,
  Save,
  Package,
  Globe
} from "lucide-react";
import { formatCurrency } from "@/lib/currency-utils";
import Link from "next/link";
import { catalogService, Product } from "@/lib/catalog-service";
import { aiService } from "@/lib/ai-service";
import { useRouter } from "next/navigation";

export default function InventoryEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true);
        const data = await catalogService.getProductById(id);
        if (data) {
          setProduct(data);
        }
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleSave = async () => {
    if (!product) return;
    try {
      setIsSaving(true);
      setSaveMessage({ text: "Sincronizando...", type: "info" });
      await catalogService.updateProduct(id, product);
      setSaveMessage({ text: "¡Producto actualizado!", type: "success" });
      setTimeout(() => setSaveMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      setSaveMessage({ text: "Error al guardar", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIOptimize = async () => {
    if (!product) return;
    try {
      setIsOptimizing(true);
      const result = await aiService.analyzeProduct(product.custom_name, product.custom_description || "");
      setProduct({
        ...product,
        custom_description: result.optimizedName || product.custom_description
      });
      setSaveMessage({ text: "Descripción optimizada por IA", type: "success" });
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-[var(--accent)] rounded-full animate-spin" />
        <p className="font-black uppercase tracking-widest text-[var(--muted-foreground)] animate-pulse">Cargando SKU Industrial...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-20 text-center space-y-6">
        <div className="bg-red-50 text-red-500 p-8 rounded-[2rem] inline-block border border-red-100">
           <AlertTriangle size={48} className="mx-auto" />
        </div>
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">SKU No Encontrado</h2>
        <Link href="/dashboard/catalog" className="text-[var(--primary)] font-black uppercase text-xs underline">Volver al Catálogo</Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/catalog" className="p-4 bg-[var(--muted)] rounded-2xl hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-[var(--strong-text)]">Editor de SKU</h1>
            <p className="text-[var(--muted-foreground)] font-bold uppercase tracking-widest text-[10px] mt-2">
              Gestión de Catálogo Maestro <span className="mx-2 text-gray-300">|</span> ID: {product.id.substring(0,8)}
            </p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[var(--deep-section)] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center hover:bg-[var(--primary)] hover:scale-105 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
          {isSaving ? "Guardando" : "Actualizar Item"}
        </button>
      </div>

      {saveMessage.text && (
        <div className={`p-6 rounded-[2rem] font-black uppercase text-[10px] tracking-widest animate-reveal flex items-center gap-4 border shadow-sm ${
          saveMessage.type === 'success' ? 'bg-green-50/50 text-green-600 border-green-200' : 
          saveMessage.type === 'error' ? 'bg-red-50/50 text-red-600 border-red-200' : 
          'bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/20'
        }`}>
          <div className={`w-2.5 h-2.5 rounded-full animate-bounce ${
            saveMessage.type === 'success' ? 'bg-green-500' : 
            saveMessage.type === 'error' ? 'bg-red-500' : 
            'bg-[var(--primary)]'
          }`} />
          {saveMessage.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Info Card */}
          <div className="bg-[var(--card)] p-12 rounded-[2.5rem] border border-[var(--border)] space-y-8 animate-reveal shadow-sm">
            <div className="flex items-center space-x-5">
              <div className="p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl">
                <Package size={28} />
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[var(--strong-text)]">Detalles de Venta</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1">Precio Unitario ($)</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-[var(--muted-foreground)]">S/</div>
                  <input 
                    type="number" 
                    value={product.unit_price}
                    onChange={(e) => setProduct({...product, unit_price: parseFloat(e.target.value)})}
                    className="w-full bg-[var(--muted)]/50 border border-[var(--border)] focus:border-[var(--primary)] p-5 pl-12 rounded-2xl font-bold transition-all outline-none text-sm shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1">Estado de Stock</label>
                <select 
                  value={product.stock_available ? "available" : "not_available"}
                  onChange={(e) => setProduct({...product, stock_available: e.target.value === "available"})}
                  className="w-full bg-[var(--muted)]/50 border border-[var(--border)] focus:border-[var(--primary)] p-5 rounded-2xl font-bold transition-all outline-none text-sm shadow-inner appearance-none"
                >
                  <option value="available">Disponible en Almacén</option>
                  <option value="on_request">A Pedido / Importación</option>
                  <option value="not_available">Sin Stock Temporal</option>
                </select>
              </div>

              <div className="space-y-3 md:col-span-2 relative">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1">Descripción Optimizada</label>
                  <button 
                    onClick={handleAIOptimize}
                    disabled={isOptimizing}
                    className="text-[var(--primary)] font-black uppercase text-[9px] tracking-[0.1em] flex items-center gap-2 hover:bg-[var(--primary)]/5 p-2 rounded-lg transition-all"
                  >
                    {isOptimizing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    {isOptimizing ? "Sincronizando con IA..." : "Optimizar con IA"}
                  </button>
                </div>
                <textarea 
                  rows={6}
                  value={product.custom_description || ""}
                  onChange={(e) => setProduct({...product, custom_description: e.target.value})}
                  className="w-full bg-[var(--muted)]/50 border border-[var(--border)] focus:border-[var(--primary)] p-6 rounded-[2rem] font-bold transition-all outline-none resize-none text-sm shadow-inner leading-relaxed"
                  placeholder="Describa las capacidades industriales del item..."
                />
              </div>
            </div>
          </div>

          {/* Visibility Section */}
          <div className="bg-[var(--card)] p-10 rounded-[3rem] border border-[var(--border)] space-y-8 shadow-sm">
            <div className="flex items-center space-x-5">
              <div className="p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl">
                <Tag size={28} />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-[var(--strong-text)]">Visibilidad Digital</h2>
            </div>
            
            <div className="flex items-center justify-between p-8 bg-[var(--muted)]/30 rounded-[2.5rem] border border-[var(--border)] group hover:border-[var(--primary)]/30 transition-all">
              <div>
                <p className="font-black text-lg text-[var(--strong-text)] uppercase tracking-tightest italic">Publicar en Catálogo</p>
                <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mt-1">El producto será visible para compradores industriales.</p>
              </div>
              <div 
                onClick={() => setProduct({...product, is_active: !product.is_active})}
                className={`w-16 h-8 rounded-full relative cursor-pointer transition-all duration-300 ${product.is_active ? 'bg-[var(--primary)]' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${product.is_active ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[var(--deep-section)] text-white p-12 rounded-[3.5rem] space-y-8 relative overflow-hidden shadow-2xl border border-white/5">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-[var(--primary)]/20 rounded-full blur-3xl animate-pulse" />
            
            <div className="flex items-center space-x-4">
              <FileText className="text-[var(--primary)]" size={32} />
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Datos del GCM</h3>
            </div>
            
            <div className="space-y-6 relative z-10">
               <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                 <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Marca / Origen</p>
                 <p className="font-black text-sm uppercase">SIEMENS INDUSTRIAL</p>
               </div>

               <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                 <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Puntuación de Relevancia</p>
                 <div className="flex items-center gap-3">
                   <TrendingUp size={20} className="text-[var(--primary)]" />
                   <p className="font-black text-xl italic tracking-tighter">98/100</p>
                 </div>
               </div>

               <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase tracking-widest italic">
                 Este SKU está vinculado al Catálogo Maestro Global (GCM). Los cambios realizados aquí son estrictamente comerciales para su catálogo digital.
               </p>
            </div>
          </div>

          <div className="bg-[var(--muted)]/50 p-10 rounded-[3rem] border-2 border-dashed border-[var(--border)] space-y-6 animate-reveal">
            <div className="flex items-center gap-3 text-amber-600">
               <AlertTriangle size={20} />
               <h4 className="font-black uppercase text-[10px] tracking-[0.2em]">ALERTA DE PRECIOS</h4>
            </div>
            <p className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest leading-relaxed">
              Las variaciones de precio se reflejarán instantáneamente en su Catálogo PWA e instalaciones móviles de clientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
