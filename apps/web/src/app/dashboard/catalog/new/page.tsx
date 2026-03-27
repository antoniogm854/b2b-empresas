"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Bot, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  Sparkles, 
  UploadCloud,
  Save,
  Tag,
  AlertTriangle,
  Info,
  Loader2,
  Package,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { catalogService } from "@/lib/catalog-service";
import { companyService } from "@/lib/company-service";
import { authService } from "@/lib/auth-service";

export default function NewProductPage() {
  const router = useRouter();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [companyTaxId, setCompanyTaxId] = useState("B2B");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    skuMPN: "",
    skuGG: "",
    skuGE: "",
    category: "",
    brand: "",
    model: "",
    price: "",
    stock: "0",
    unit: "PZA",
    presentation: "",
    series: "",
    origin: "",
    color: "",
    size: "",
    material: "",
    dispatch: "",
    location: "",
    observations: "",
    isMostRequested: false,
    isCertified: false,
    images: [] as string[],
    files: [] as string[]
  });

  const [imageError, setImageError] = useState("");
  const [fileError, setFileError] = useState("");
  const [existingProduct, setExistingProduct] = useState<any>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const user = await authService.getCurrentUser();
        if (user && user.email) {
          const tenant = await companyService.getTenantByUserEmail(user.email);
          if (tenant) {
            setTenantId(tenant.id);
            setCompanyTaxId(tenant.tax_id || "B2B");
            setProduct(prev => ({ ...prev, location: tenant.fiscal_address || "" }));
          } else {
            router.push("/dashboard");
          }
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [router]);

  // Validación de Duplicados en Tiempo Real (Semántica + SKU)
  useEffect(() => {
    const checkDuplicate = async () => {
      if (!tenantId || (!product.name && !product.skuMPN)) {
        setExistingProduct(null);
        return;
      }

      setIsCheckingDuplicate(true);
      try {
        const found = await catalogService.findExistingProduct(tenantId, {
          name: product.name,
          category: product.category,
          sku: product.skuMPN
        });
        setExistingProduct(found);
      } catch (err) {
        console.error("Duplicate check error:", err);
      } finally {
        setIsCheckingDuplicate(false);
      }
    };

    const timer = setTimeout(checkDuplicate, 800);
    return () => clearTimeout(timer);
  }, [product.name, product.category, product.skuMPN, tenantId]);

  const handleApplyExisting = () => {
    if (!existingProduct) return;
    setProduct(prev => ({
      ...prev,
      brand: existingProduct.brand || prev.brand,
      model: existingProduct.model || prev.model,
      price: existingProduct.unit_price?.toString() || prev.price,
      stock: existingProduct.stock_quantity?.toString() || prev.stock,
      skuMPN: existingProduct.metadata?.sku_mpn || prev.skuMPN,
      material: existingProduct.metadata?.material || prev.material,
      origin: existingProduct.origin || prev.origin,
      observations: existingProduct.custom_description || existingProduct.metadata?.observations || prev.observations
    }));
  };

  const generateSKUs = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return {
      cuim: `CUIM-${random}`,
      cuie: `CUIE-${companyTaxId}-${random}`
    };
  };

  const handleSave = async () => {
    if (!product.name || !tenantId) return;
    
    setIsSaving(true);
    try {
      const skus = generateSKUs();
      const payload = {
        ...product,
        skuCUIM: skus.cuim,
        skuCUIE: skus.cuie
      };
      
      await catalogService.createProduct(tenantId, payload);
      router.push("/dashboard/catalog?tab=mine");
    } catch (err) {
      console.error("Save error:", err);
      alert("Error al guardar el producto. Inténtelo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-[#A2C367] border-t-transparent rounded-full animate-spin" />
        <p className="font-black uppercase tracking-widest text-[#A2C367] animate-pulse">Iniciando Editor Industrial...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/catalog" className="p-4 bg-zinc-900 rounded-2xl hover:bg-[#A2C367] hover:text-black transition-all border border-zinc-800 shadow-xl">
            <ArrowLeft size={24} />
          </Link>
          <div className="space-y-1">
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-white flex items-center gap-4">
               Carga de <span className="text-[#A2C367]">Producto SKU</span>
             </h1>
             <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px] pl-1">
               Ingreso Manual al Catálogo Maestro B2B (CMb2b)
             </p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving || !product.name}
          className={`${existingProduct ? 'bg-orange-500 hover:bg-orange-600' : 'bg-[#A2C367] hover:bg-[#8fb05a]'} text-black px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center transition-all shadow-xl border border-white/20 disabled:opacity-50`}
        >
          {isSaving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
          {existingProduct ? "ACTUALIZAR FICHA TÉCNICA" : "CARGAR PRODUCTO NUEVO"}
        </button>
      </div>

      {/* Duplicate Alert */}
      {existingProduct && (
        <div className="bg-orange-500/10 border-2 border-orange-500/30 p-8 rounded-[3rem] animate-reveal flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-orange-500/10 backdrop-blur-sm">
           <div className="flex items-center gap-6">
              <div className="p-5 bg-orange-500 text-white rounded-[2rem] shadow-lg">
                 <AlertTriangle size={32} />
              </div>
              <div className="text-left">
                 <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">Producto ya registrado</h4>
                 <p className="text-[10px] font-bold text-orange-200 uppercase tracking-widest mt-1">
                   Se ha detectado una coincidencia en <strong>{existingProduct.metadata?.category || "General"}</strong>. Puede completar o actualizar la información faltante.
                 </p>
              </div>
           </div>
           <button 
             onClick={handleApplyExisting}
             className="bg-white text-orange-600 px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-50 transition-all flex items-center gap-2"
           >
             <Info size={16} /> AUTOCOMPLETAR DATOS GUARDADOS
           </button>
        </div>
      )}

      <div className="bg-zinc-900/40 border-2 border-zinc-800 p-8 md:p-12 rounded-[3.5rem] space-y-12 shadow-2xl backdrop-blur-md">
        
        {/* Sección 1: Identificación y Clasificación */}
        <div className="space-y-8">
           <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
              <div className="p-3 bg-[#A2C367]/10 text-[#A2C367] rounded-xl">
                 <Tag size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[.2em] text-white">Identificación y Clasificación Industrial</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-4 group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">Nombre Comercial / Descripción Corta *</label>
                <input
                  type="text"
                  placeholder="Ej: Motor Trifásico 5HP Alta Eficiencia"
                  className="w-full bg-zinc-950 border-2 border-zinc-800 p-5 rounded-2xl text-sm font-bold focus:border-[#A2C367] focus:outline-none transition-all placeholder:text-zinc-700 text-white"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                />
              </div>

              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">SKU-MPN (Ref Fabricante)</label>
                <input
                  type="text"
                  placeholder="MPN-XXXX"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold focus:border-[#A2C367] focus:outline-none text-white"
                  value={product.skuMPN}
                  onChange={(e) => setProduct({ ...product, skuMPN: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">Grupo General (GG)</label>
                <input
                  type="text"
                  placeholder="Ej: Eléctricos"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold focus:border-[#A2C367] focus:outline-none text-white"
                  value={product.skuGG}
                  onChange={(e) => setProduct({ ...product, skuGG: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">Grupo Específico (GE)</label>
                <input
                  type="text"
                  placeholder="Ej: Transformadores"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold focus:border-[#A2C367] focus:outline-none text-white"
                  value={product.skuGE}
                  onChange={(e) => setProduct({ ...product, skuGE: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">Categoría B2B</label>
                <input
                  type="text"
                  placeholder="Categoría"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold focus:border-[#A2C367] focus:outline-none text-white"
                  value={product.category}
                  onChange={(e) => setProduct({ ...product, category: e.target.value })}
                />
              </div>
           </div>
        </div>

        {/* Sección 2: Especificaciones Técnicas */}
        <div className="space-y-8">
           <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                 <Package size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[.2em] text-white">Especificaciones Técnicas y Origen</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">Marca</label>
                <input
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold focus:border-[#A2C367] focus:outline-none text-white"
                  value={product.brand}
                  onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">Modelo / Serie</label>
                <input
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold focus:border-[#A2C367] focus:outline-none text-white"
                  value={product.model}
                  onChange={(e) => setProduct({ ...product, model: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">Material / Aleación</label>
                <input
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold focus:border-[#A2C367] focus:outline-none text-white"
                  value={product.material}
                  onChange={(e) => setProduct({ ...product, material: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">Procedencia (País)</label>
                <input
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold focus:border-[#A2C367] focus:outline-none text-white"
                  value={product.origin}
                  onChange={(e) => setProduct({ ...product, origin: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">Dimensiones / Talla</label>
                <input
                  type="text"
                  placeholder="Ej: 10x20x5 cm"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold focus:border-[#A2C367] focus:outline-none text-white"
                  value={product.size}
                  onChange={(e) => setProduct({ ...product, size: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">Color Secundario</label>
                <input
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold focus:border-[#A2C367] focus:outline-none text-white"
                  value={product.color}
                  onChange={(e) => setProduct({ ...product, color: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">Descripción Técnica Detallada</label>
                <textarea
                  rows={4}
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold focus:border-[#A2C367] focus:outline-none text-white resize-none"
                  value={product.observations}
                  onChange={(e) => setProduct({ ...product, observations: e.target.value })}
                />
              </div>
           </div>
        </div>

        {/* Sección 3: Datos Comerciales */}
        <div className="space-y-8">
           <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                 <Sparkles size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[.2em] text-white">Logística y Comercialización</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">Precio Ref (USD/PEN)</label>
                <input
                  type="number"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-black text-[#A2C367] focus:border-[#A2C367] focus:outline-none"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">Stock Base</label>
                <input
                  type="number"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold focus:border-[#A2C367] focus:outline-none text-white"
                  value={product.stock}
                  onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">Unidad de Medida</label>
                <input
                  type="text"
                  placeholder="PZA, UN, LTR"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold focus:border-[#A2C367] focus:outline-none text-white uppercase"
                  value={product.unit}
                  onChange={(e) => setProduct({ ...product, unit: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">Presentación</label>
                <input
                  type="text"
                  placeholder="Caja x 12, etc"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold focus:border-[#A2C367] focus:outline-none text-white"
                  value={product.presentation}
                  onChange={(e) => setProduct({ ...product, presentation: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">Disponibilidad de Despacho</label>
                <input
                  type="text"
                  placeholder="Ej: Inmediato / 24 hrs"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold focus:border-[#A2C367] focus:outline-none text-white"
                  value={product.dispatch}
                  onChange={(e) => setProduct({ ...product, dispatch: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1 block">Ubicación de Stock</label>
                <input
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs font-bold focus:border-[#A2C367] focus:outline-none text-white"
                  value={product.location}
                  onChange={(e) => setProduct({ ...product, location: e.target.value })}
                />
              </div>
           </div>
        </div>

        {/* Sección 4: Certificaciones y Destacado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
           <label className="bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 p-6 rounded-[2rem] flex items-center gap-6 cursor-pointer transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full" />
              <input
                type="checkbox"
                className="w-6 h-6 rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500"
                checked={product.isCertified}
                onChange={(e) => setProduct({ ...product, isCertified: e.target.checked })}
              />
              <div className="relative z-10">
                <span className="block text-sm font-black uppercase tracking-widest text-blue-400 mb-1 flex items-center gap-2">
                  <ShieldCheck size={18} /> Normado / Certificado
                </span>
                <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Cumple con estándares de calidad industrial.</span>
              </div>
           </label>

           <label className="bg-zinc-950 border-2 border-dashed border-[#A2C367]/40 p-6 rounded-[2rem] flex items-center gap-6 cursor-pointer hover:bg-[#A2C367]/5 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#A2C367]/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
              <input
                type="checkbox"
                className="w-6 h-6 rounded border-zinc-700 bg-zinc-900 text-[#A2C367] focus:ring-[#A2C367] relative z-20"
                checked={product.isMostRequested}
                onChange={(e) => setProduct({ ...product, isMostRequested: e.target.checked })}
              />
              <div className="relative z-20">
                <span className="block text-sm font-black uppercase tracking-widest text-[#A2C367] mb-1 flex items-center gap-2 animate-pulse">
                  <Sparkles size={18} /> DESTACADO / PROMOCIÓN
                </span>
                <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Aparecerá en la cinta superior del Catálogo Digital.</span>
              </div>
           </label>
        </div>

      </div>

      <div className="flex flex-col items-center gap-6 pt-10">
         <button
          onClick={handleSave}
          disabled={isSaving || !product.name}
          className="w-full max-w-md bg-[#A2C367] text-black py-7 rounded-[2rem] font-black uppercase text-xl italic tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(162,195,103,0.3)] border-b-8 border-[#8fb05a]"
        >
          {isSaving ? "PROCESANDO..." : "CARGAR PRODUCTO NUEVO"}
        </button>
        <Link href="/dashboard/catalog" className="text-zinc-600 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors">
          Cancelar y Volver al Catálogo
        </Link>
      </div>
    </div>
  );
}
