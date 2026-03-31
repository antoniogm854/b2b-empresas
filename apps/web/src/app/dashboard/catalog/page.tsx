"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Globe, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  ArrowRight,
  Sparkles,
  Loader2,
  Zap,
  Link as LinkIcon,
  Upload,
  FileDown,
  BarChart3,
  Crown,
  Star,
  X as XIcon,
  Bot,
  FileText,
  UploadCloud,
  Plus,
  Download
} from "lucide-react";
import { companyService } from "@/lib/company-service";
import { aiService } from "@/lib/ai-service";
import Link from "next/link";
import ProductQuickView from "@/components/dashboard/QuickView";
import { 
  catalogService, 
  Product, 
  CatalogMasterProduct 
} from "@/lib/catalog-service";
import { adminService } from "@/lib/admin-service";
import { authService } from "@/lib/auth-service";
import { formatCurrency } from "@/lib/currency-utils";
import { useSearchParams } from "next/navigation";
import AddProductModal from "@/components/dashboard/AddProductModal";
import ShowcasePlacements from "@/components/catalog/ShowcasePlacements";

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "mine" | "gcm") || "mine";
  
  const [activeTab, setActiveTab] = useState<"mine" | "gcm">(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [masterProducts, setMasterProducts] = useState<CatalogMasterProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // Sync Wizard State (Integrated from Remote)
  const [syncStep, setSyncStep] = useState(1);
  const [syncUrl, setSyncUrl] = useState("");
  const [syncMode, setSyncMode] = useState<"web" | "pdf">("web");
  const [syncFile, setSyncFile] = useState<File | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [tenantId, setTenantId] = useState<string | null>(null);
  const [tenantPlan, setTenantPlan] = useState<string>('free');
  const [isImporting, setIsImporting] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showcaseLoading, setShowcaseLoading] = useState<string | null>(null);
  const [showcaseResult, setShowcaseResult] = useState<{ productId: string; result: string; reason: string; failedCriteria?: string[] } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSavingManual, setIsSavingManual] = useState(false);

  const CSV_HEADERS = [
    "SKU_CUIM", "SKU_MPN", "SKU_CUIE", "NOMBRE", "DESCRIPCION", "PRECIO_USD", 
    "STOCK", "UNIDAD", "MARCA", "MODELO", "COLOR", "TALLA", "MATERIAL", 
    "PROCEDENCIA", "TIEMPO_DESPACHO", "PRESENTACION", "OBSERVACIONES", 
    "CATEGORIA", "CERTIFICADO", "MAS_PEDIDO", "IMAGENES_URLS", "PDFS_URLS"
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let activeTenantId = tenantId;
        if (!activeTenantId) {
          const user = await authService.getCurrentUser();
          if (user?.email) {
            const tenant = await companyService.getTenantByUserEmail(user.email);
            if (tenant) {
              setTenantId(tenant.id);
              setTenantPlan(tenant.plan || 'free');
              activeTenantId = tenant.id;
            }
          }
        }
        if (!activeTenantId) return;
        if (activeTab === "mine") {
          const products = await catalogService.getTenantProducts(activeTenantId);
          setMyProducts(products);
        } else {
          const master = await catalogService.searchMaster(searchQuery);
          setMasterProducts(master);
        }
      } catch (error) {
        console.error("Error fetching catalog data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, searchQuery, tenantId]);

  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + CSV_HEADERS.join(",") + "\n" +
      "\"SKU-CUIM-SUM-26001\",\"MPN-MOTOR-HID\",\"CUIE-CUIM-20602060650-123456\",\"Bomba Hidráulica de Engranajes\",\"Bomba técnica para sistemas pesados...\",\"450.00\",\"5\",\"UN\",\"Rexroth\",\"A10VSO\",\"Gris\",\"Industrial\",\"Hierro\",\"Alemania\",\"5 días\",\"Caja\",\"\",\"Maquinaria\",\"SI\",\"NO\",\"https://images.com/pump.jpg\",\"\"";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "b2b_plantilla_catalogo_maestro.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
    if (!myProducts.length) return alert("No hay productos para exportar.");
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF" + CSV_HEADERS.join(",") + "\n";
    myProducts.forEach((p: any) => {
      const meta = p.metadata || {};
      const row = [
        p.catalog_master?.sku_cuim || '', p.catalog_master?.sku_mpn || '', p.sku_cuie || '',
        p.custom_name || '', p.custom_description || '', p.unit_price || 0,
        p.stock_quantity || 0, meta.unit || 'UN', p.catalog_master?.brand || '',
        p.catalog_master?.model || '', meta.color || '', meta.size || '',
        meta.material || '', p.catalog_master?.origin || '', p.dispatch_time || '',
        meta.presentation || '', meta.observations || '', p.catalog_master?.sku_gg || '',
        p.catalog_master?.is_certified ? 'SI' : 'NO', p.is_most_requested ? 'SI' : 'NO',
        (p.images || []).join(';'), (p.documents || []).join(';')
      ];
      csvContent += row.map(f => `"${String(f || '').replace(/"/g, '""')}"`).join(",") + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `b2b_catalogo_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tenantId) return;
    setIsImporting(true);
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      const parseCSVRow = (r: string) => {
        const res = []; let cur = '', inQ = false;
        for(let i=0; i<r.length; i++){
          if(r[i]==='"' && r[i+1]==='"'){ cur+='"'; i++; }
          else if(r[i]==='"') inQ = !inQ;
          else if(r[i]===',' && !inQ){ res.push(cur); cur=''; }
          else cur += r[i];
        }
        res.push(cur); return res;
      };
      const payload = [];
      for(let i=1; i<lines.length; i++){
        const d = parseCSVRow(lines[i]);
        if(d.length<4) continue;
        payload.push({ skuCUIM: d[0], skuMPN: d[1], skuCUIE: d[2], name: d[3], description: d[4], price: d[5], stock: d[6], unit: d[7], brand: d[8], model: d[9], category: d[17], images: d[20]?.split(';'), files: d[21]?.split(';') });
      }
      await catalogService.bulkCreateProducts(tenantId, payload);
      setMyProducts(await catalogService.getTenantProducts(tenantId));
      alert("¡Importación MASIVA exitosa!");
    } catch (err: any) { alert("Error en importación: " + err.message); }
    finally { setIsImporting(false); e.target.value = ''; }
  };

  const startSync = async () => {
    setSyncError(null);
    setSyncStep(2);
    try {
      let response;
      if (syncMode === "web") {
        response = await fetch('/api/catalog/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: syncUrl, tenantId: tenantId || '00000000-0000-0000-0000-000000000000' })
        });
      } else {
        const formData = new FormData();
        formData.append('file', syncFile!);
        formData.append('tenantId', tenantId || '00000000-0000-0000-0000-000000000000');
        response = await fetch('/api/catalog/sync-pdf', { method: 'POST', body: formData });
      }
      const data = await response.json();
      if (data.success) {
        if (tenantId) setMyProducts(await catalogService.getTenantProducts(tenantId));
        setSyncStep(3);
      } else { setSyncError(data.error); setSyncStep(1); }
    } catch (e) { setSyncError("Error de comunicación con el motor IA."); setSyncStep(1); }
  };

  const handleManualSave = async (formData: any) => {
    if (!tenantId) return;
    setIsSavingManual(true);
    try {
      await catalogService.bulkCreateProducts(tenantId, [{ ...formData, source: 'manual' }]);
      setMyProducts(await catalogService.getTenantProducts(tenantId));
      setIsAddModalOpen(false);
    } catch (e: any) { alert("Error: " + e.message); }
    finally { setIsSavingManual(false); }
  };

  return (
    <div className="space-y-10 animate-fade-in relative z-10 pb-20">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 mb-2">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-12 bg-[var(--cat-yellow)] rounded-full shadow-cat" />
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">
              GESTIÓN <span className="brand-t-detail text-[var(--cat-yellow-dark)]">DE</span> <br/><span className="text-slate-900">PRODUCTOS</span>
            </h1>
          </div>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] pl-5 border-l-2 border-slate-200 ml-1">
             SISTEMA INDIVIDUAL <span className="text-[var(--cat-yellow-dark)] mx-2">/</span> ALTA VISIBILIDAD CAT
          </p>
        </div>
        
        <div className="flex bg-white p-2 rounded-[2rem] border-2 border-slate-100 shadow-xl">
          <button onClick={() => setActiveTab("mine")} className={`flex items-center px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${activeTab === "mine" ? "bg-slate-900 text-white shadow-2xl scale-105" : "text-slate-400 hover:text-slate-900"}`}>
            <Package size={18} className="mr-3" /> MIS PRODUCTOS
          </button>
          <button disabled className="flex items-center px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all text-slate-300 opacity-50 cursor-not-allowed group relative">
            <Globe size={18} className="mr-3" /> MAESTRO GLOBAL
            <span className="ml-3 bg-[var(--cat-yellow)] text-black text-[9px] px-3 py-1 rounded-full border border-black shadow-sm font-black">PRO</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Method 1: Manual */}
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 hover:border-[var(--cat-yellow)] transition-all group flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div>
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-[var(--cat-yellow)]/10 transition-colors">
              <Plus className="text-slate-400 group-hover:text-[var(--cat-yellow-dark)] w-7 h-7" />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">1. INGRESO MANUAL</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Alta técnica uno por uno. Control absoluto.</p>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="w-full bg-[var(--cat-yellow)] text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 transition-all shadow-cat border-b-4 border-[var(--cat-yellow-dark)] mt-6">
            NUEVO PRODUCTO
          </button>
        </div>

        {/* Method 2: AI / Wizard (Merged) */}
        <div className={`col-span-1 border-2 transition-all duration-500 rounded-[2.5rem] shadow-xl overflow-hidden ${syncStep > 1 ? 'md:col-span-2 bg-slate-900 border-slate-900' : 'bg-white border-slate-100'}`}>
          {syncStep === 1 ? (
             <div className="p-8 flex flex-col justify-between h-full group">
               <div>
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-purple-50 transition-colors">
                    <Bot className="text-slate-400 group-hover:text-purple-600 w-7 h-7" />
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">2. EXTRACCIÓN AUTO</h3>
                    <span className="bg-purple-100 text-purple-600 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-purple-200">INTELIGENTE</span>
                  </div>
                  <div className="flex gap-2 mb-4 bg-slate-50 p-1 rounded-xl w-fit border border-slate-100">
                    <button onClick={() => setSyncMode("web")} className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${syncMode === "web" ? "bg-slate-900 text-white" : "text-slate-400"}`}>WEB</button>
                    <button onClick={() => setSyncMode("pdf")} className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${syncMode === "pdf" ? "bg-slate-900 text-white" : "text-slate-400"}`}>PDF</button>
                  </div>
                  <div className="space-y-4">
                    {syncMode === "web" ? (
                      <input 
                        type="url" value={syncUrl} onChange={e => setSyncUrl(e.target.value)}
                        placeholder="https://proveedor.com/catalogo"
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-xs uppercase outline-none focus:border-purple-400 transition-all"
                      />
                    ) : (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 p-4 rounded-2xl cursor-pointer hover:bg-slate-50">
                        {syncFile ? <p className="text-[10px] font-black text-purple-600">{syncFile.name}</p> : <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SUBIR PDF TÉCNICO</p>}
                        <input type="file" accept=".pdf" className="hidden" onChange={e => setSyncFile(e.target.files?.[0] || null)} />
                      </label>
                    )}
                  </div>
               </div>
               <button 
                onClick={startSync}
                disabled={(syncMode==="web" && !syncUrl) || (syncMode==="pdf" && !syncFile)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl mt-6 disabled:opacity-20 transition-all hover:scale-[1.02]"
               >
                 INICIAR IA SYNC
               </button>
             </div>
          ) : syncStep === 2 ? (
            <div className="p-12 flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in">
               <Loader2 className="animate-spin text-[var(--cat-yellow)] w-16 h-16" />
               <h3 className="text-2xl font-black text-white italic tracking-tighter">MOTOR IA ANALIZANDO...</h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trazando productos en {syncMode === 'web' ? 'Dominio Web' : 'Fichero PDF'}</p>
            </div>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center h-full text-center space-y-6 animate-reveal">
               <CheckCircle2 className="text-[var(--cat-yellow)] w-20 h-20" />
               <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">OPERACIÓN EXITOSA</h3>
               <button onClick={() => setSyncStep(1)} className="text-[var(--cat-yellow)] font-black text-[10px] uppercase tracking-[0.3em] hover:underline">VOLVER / NUEVA CARGA</button>
            </div>
          )}
        </div>

        {/* Method 3: CSV */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-150 duration-1000"><FileDown size={120} className="text-white" /></div>
          <div>
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
              <Download className="text-[var(--cat-yellow)] w-7 h-7" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3">3. CARGA MASIVA</h3>
            <div className="flex gap-4 mb-6">
               <button onClick={handleDownloadTemplate} className="flex-1 bg-white/5 border border-white/10 text-white p-3 rounded-xl font-black text-[8px] uppercase tracking-widest hover:bg-white hover:text-black">FORMATO</button>
               <button onClick={handleExportCSV} className="flex-1 bg-white/5 border border-white/10 text-white p-3 rounded-xl font-black text-[8px] uppercase tracking-widest hover:bg-white hover:text-black">BACKUP</button>
            </div>
          </div>
          <label className="w-full bg-[var(--cat-yellow)] text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 transition-all text-center cursor-pointer shadow-cat">
            {isImporting ? 'PROCESANDO...' : 'IMPORTAR CSV'}
            <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} disabled={isImporting} />
          </label>
        </div>
      </div>

      {/* Product Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-xl">
           <div className="flex items-center flex-1 bg-slate-50 px-8 py-4 rounded-2xl border border-slate-100 focus-within:border-[var(--cat-yellow)] transition-all">
             <Search size={20} className="text-slate-300 mr-4" />
             <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="BUSCAR EN MI CATÁLOGO..." className="w-full bg-transparent border-none outline-none font-black text-xs uppercase tracking-widest text-slate-800" />
           </div>
           <div className="ml-6 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">TOTAL: {myProducts.length}</div>
        </div>

        {loading ? (
          <div className="py-40 text-center"><Loader2 className="animate-spin mx-auto text-slate-400" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
             {myProducts.filter(p => !searchQuery || p.custom_name.toUpperCase().includes(searchQuery.toUpperCase())).map(p => (
               <div key={p.id} className="bg-white rounded-[2rem] border-2 border-slate-100 p-6 flex flex-col group hover:border-[var(--cat-yellow)] hover:shadow-2xl transition-all h-full shadow-sm cursor-pointer" onClick={() => setSelectedProduct(p)}>
                  <div className="w-full aspect-square bg-slate-50 rounded-2xl mb-5 overflow-hidden flex items-center justify-center relative border border-slate-100">
                    {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.custom_name}/> : <Package size={48} className="opacity-5 text-slate-900" />}
                    <span className="absolute top-4 left-4 bg-slate-900 text-white text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">{p.catalog_master?.brand || 'CAT'}</span>
                  </div>
                  <h4 className="font-black text-xs text-slate-900 uppercase tracking-tight mb-2 truncate">{p.custom_name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{p.catalog_master?.sku_gg || 'SIN CATEGORÍA'}</p>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-sm font-black text-slate-900 italic">{p.unit_price > 0 ? formatCurrency(p.unit_price, p.currency) : 'CONSULTAR'}</span>
                    <LinkIcon size={14} className="text-slate-200 group-hover:text-[var(--cat-yellow-dark)]" />
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>

      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleManualSave} isSaving={isSavingManual} />
      {selectedProduct && <ProductQuickView product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}
