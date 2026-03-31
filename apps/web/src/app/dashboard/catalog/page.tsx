"use client";

import { useState } from "react";
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
  X as XIcon
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
import { useEffect } from "react";
import { formatCurrency } from "@/lib/currency-utils";
import { useSearchParams } from "next/navigation";
import AddProductModal from "@/components/dashboard/AddProductModal";

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
  const [isSyncWizardOpen, setIsSyncWizardOpen] = useState(false);
  const [syncStep, setSyncStep] = useState(1);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [tenantPlan, setTenantPlan] = useState<string>('free');
  const [isImporting, setIsImporting] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showcaseLoading, setShowcaseLoading] = useState<string | null>(null);
  const [showcaseResult, setShowcaseResult] = useState<{ productId: string; result: string; reason: string; failedCriteria?: string[] } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSavingManual, setIsSavingManual] = useState(false);

  // CSV Configuration
  const CSV_HEADERS = [
    "SKU_CUIM", "SKU_MPN", "SKU_CUIE", "NOMBRE", "DESCRIPCION", "PRECIO_USD", 
    "STOCK", "UNIDAD", "MARCA", "MODELO", "COLOR", "TALLA", "MATERIAL", 
    "PROCEDENCIA", "TIEMPO_DESPACHO", "PRESENTACION", "OBSERVACIONES", 
    "CATEGORIA", "CERTIFICADO", "MAS_PEDIDO", "IMAGENES_URLS", "PDFS_URLS"
  ];

  const handleDownloadTemplate = () => {
    // Add BOM for Excel UTF-8
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + CSV_HEADERS.join(",") + "\n" +
      "\"CUIM-0000001\",\"MPN-TEST-1\",\"CUIE-01\",\"Motor Industrial XYZ\",\"Descripción del motor...\",\"1200.50\",\"15\",\"UN\",\"Acme\",\"GTX-200\",\"Rojo\",\"Única\",\"Acero\",\"Alemania\",\"Inmediato\",\"Caja Seca\",\"\",\"Motores\",\"SI\",\"SI\",\"https://b2bempresas.com/img1.jpg\",\"\"";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "b2b_plantilla_catalogo_maestro.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
    if (!myProducts.length) return alert("No tienes productos en tu catálogo para exportar.");
    
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF" + CSV_HEADERS.join(",") + "\n";
    
    myProducts.forEach((p: any) => {
      const meta = p.metadata || {};
      const row = [
        p.sku_cuim || meta.sku_cuim || '',
        meta.sku_mpn || meta.skuMPN || '',
        p.sku_cuie || '',
        p.custom_name || '',
        p.custom_description || '',
        p.unit_price || 0,
        p.stock_quantity || 0,
        meta.unit || 'UN',
        p.brand || '',
        p.model || '',
        meta.color || '',
        meta.size || '',
        meta.material || '',
        p.origin || '',
        p.dispatch_time || '',
        meta.presentation || '',
        meta.observations || '',
        meta.category || '',
        meta.is_certified || meta.isCertified ? 'SI' : 'NO',
        p.is_most_requested ? 'SI' : 'NO',
        (p.images || []).join(';'),
        (p.documents || []).join(';')
      ];
      
      const rowStr = row.map(field => {
        const text = String(field || '').replace(/"/g, '""').replace(/\r?\n/g, " ");
        return `"${text}"`;
      }).join(",");
      
      csvContent += rowStr + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `b2b_catalogo_export_[${new Date().getTime()}].csv`);
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
      
      // Parser estructurado inteligente para leer CSV con comillas internas
      const parseCSVRow = (textRow: string) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for(let i=0; i < textRow.length; i++) {
          const char = textRow[i];
          if (char === '"') {
            if (inQuotes && textRow[i+1] === '"') { current += '"'; i++; } // Escapando doble comilla
            else { inQuotes = !inQuotes; }
          } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current);
        return result;
      };

      const productsPayload = [];
      
      // Index 0 is Header
      for(let i=1; i < lines.length; i++) {
        const rowData = parseCSVRow(lines[i]);
        if (rowData.length < 4) continue; // Si faltan columnas maestras ignorar
        
        productsPayload.push({
          skuCUIM: rowData[0],
          skuMPN: rowData[1],
          skuCUIE: rowData[2],
          name: rowData[3],
          description: rowData[4],
          price: rowData[5] || '0',
          stock: rowData[6] || '0',
          unit: rowData[7],
          brand: rowData[8],
          model: rowData[9],
          color: rowData[10],
          size: rowData[11],
          material: rowData[12],
          origin: rowData[13],
          dispatch: rowData[14],
          presentation: rowData[15],
          observations: rowData[16],
          category: rowData[17],
          isCertified: rowData[18]?.toUpperCase() === 'SI',
          isMostRequested: rowData[19]?.toUpperCase() === 'SI',
          images: rowData[20] ? rowData[20].split(';').filter(Boolean) : [],
          files: rowData[21] ? rowData[21].split(';').filter(Boolean) : []
        });
      }

      if (productsPayload.length === 0) {
        alert("Atención: El archivo CSV no contiene datos válidos compatibles con la plantilla de B2B Empresas.");
        return;
      }

      await catalogService.bulkCreateProducts(tenantId, productsPayload);
      
      // Recargar la data de la DB
      const products = await catalogService.getTenantProducts(tenantId);
      setMyProducts(products);
      
      alert(`¡Catálogo Actualizado Exitosamente!\nSe importaron ${productsPayload.length} productos corporativos mediante Carga Masiva (CSV).`);

    } catch (err: any) {
      console.error("CSV Import Error:", err);
      alert(`Error decodificando el archivo: ${err.message}. Revise que este usando la plantilla correcta.`);
    } finally {
      setIsImporting(false);
      e.target.value = ''; // Reset input para permitir subir el mismo file otra vez
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 0. Get the actual logged-in user's tenant
        let activeTenantId = tenantId;
        if (!activeTenantId) {
          const user = await authService.getCurrentUser();
          if (user && user.email) {
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

  const handleLinkProduct = async (masterProduct: CatalogMasterProduct) => {
    if (!tenantId) return;
    
    setIsOptimizing(true);
    try {
      // 1. Optimize with AI
      const aiResult = await aiService.analyzeProduct(
        masterProduct.product_name, 
        `Marca: ${masterProduct.brand}, Modelo: ${masterProduct.model}`
      );

      // 2. Link with optimized data
      await catalogService.linkMasterProduct(tenantId, masterProduct, {
        custom_name: aiResult.optimizedName,
        custom_description: `OPTIMIZADO POR IA: ${aiResult.optimizedName}. \nEste producto es ideal para el sector de ${aiResult.suggestedCategory}. Certificado para uso industrial.`,
        unit_price: 0,
        stock_available: true
      });

      setActiveTab("mine");
      setSearchQuery("");
    } catch (error) {
      console.error("Error linking product with AI optimization:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleShowcaseSubmit = async (productId: string) => {
    // FREEMIUM → mostrar modal de upgrade
    if (tenantPlan === 'free') {
      setShowUpgradeModal(true);
      return;
    }
    // PRO/Enterprise → ejecutar auto-aprobación
    setShowcaseLoading(productId);
    try {
      const result = await adminService.submitToShowcase(productId);
      setShowcaseResult({ productId, ...result });
    } catch (e) {
      setShowcaseResult({ productId, result: 'error', reason: 'Error al procesar la solicitud.' });
    } finally {
      setShowcaseLoading(null);
    }
  };

  const handleManualSave = async (formData: any) => {
    if (!tenantId) return;
    setIsSavingManual(true);
    try {
      // Mapeo completo de campos industriales según estándar v1.04
      const payload = [{
        skuCUIM: formData.skuCUIM,
        skuMPN: formData.skuMPN,
        skuCUIE: formData.skuCUIE,
        skuGG: formData.skuGG,
        skuGE: formData.skuGE,
        name: formData.name,
        description: formData.observations || '', 
        price: formData.price || '0',
        stock: formData.stock || '0',
        unit: formData.unit,
        brand: formData.brand,
        model: formData.model,
        category: formData.category,
        serial: formData.serial,
        color: formData.color,
        size: formData.size,
        material: formData.material,
        origin: formData.origin,
        dispatch: formData.dispatch,
        location: formData.location,
        presentation: formData.presentation,
        isCertified: formData.isCertified,
        images: formData.images || [],
        documents: formData.documents || []
      }];

      await catalogService.bulkCreateProducts(tenantId, payload);
      
      // Recargar la data
      const products = await catalogService.getTenantProducts(tenantId);
      setMyProducts(products);
      
      setIsAddModalOpen(false);
      alert(`¡Producto "${formData.name}" guardado exitosamente en tu catálogo!`);
    } catch (err: any) {
      console.error("Manual Save Error:", err);
      alert(`Error al guardar el producto: ${err.message}`);
    } finally {
      setIsSavingManual(false);
    }
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
          <button 
            onClick={() => setActiveTab("mine")}
            className={`flex items-center px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
              activeTab === "mine" ? "bg-slate-900 text-white shadow-2xl scale-105" : "text-slate-400 hover:text-slate-900"
            }`}
          >
            <Package size={18} className="mr-3" />
            MIS PRODUCTOS
          </button>
          <button 
            disabled
            className="flex items-center px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all text-slate-300 opacity-50 cursor-not-allowed group relative"
            title="Sincronización Inteligente Disponible en Plan PRO"
          >
            <Globe size={18} className="mr-3" />
            MAESTRO GLOBAL
            <span className="ml-3 bg-[var(--cat-yellow)] text-black text-[9px] px-3 py-1 rounded-full border border-black shadow-sm font-black">PRO</span>
          </button>
        </div>
      </div>

      {/* Product Upload Methods Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Method 1: Manual */}
        <div className="bg-[var(--card)] p-8 rounded-[2rem] border border-[var(--border)] hover:border-[var(--primary)] transition-all group flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-14 h-14 bg-[var(--background)] rounded-full flex items-center justify-center mb-6 border border-[var(--border)] group-hover:bg-[var(--primary)]/10 transition-colors">
              <Package className="text-[var(--strong-text)] group-hover:text-[var(--primary)] w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-[var(--strong-text)] uppercase tracking-wide mb-3">1. INGRESO MANUAL</h3>
            <p className="text-xs font-medium text-[var(--panel-text)] opacity-80 leading-relaxed mb-8">Llenar manualmente toda la información de un producto. Ideal para catálogos pequeños o lanzamientos únicos.</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full bg-[var(--cat-yellow)] text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-cat border-b-4 border-[var(--cat-yellow-dark)] active:border-b-0"
          >
            NUEVO PRODUCTO
          </button>
        </div>

        {/* Method 2: AI / Web Import */}
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 hover:border-blue-400 transition-all group flex flex-col justify-between shadow-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-blue-50 transition-colors">
              <Globe className="text-slate-400 group-hover:text-blue-500 w-7 h-7" />
            </div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">2. EXTRACCIÓN AUTO</h3>
              <span className="bg-blue-100 text-blue-600 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-200">BETA</span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 opacity-80 leading-relaxed mb-6 uppercase tracking-wide">Jalar información desde su página web o PDF.</p>
          </div>
          <button className="w-full bg-slate-50 border-2 border-slate-100 text-slate-300 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] cursor-not-allowed relative z-10" title="Requiere Plan PRO">
            ESCANEAR ENLACE (PRO)
          </button>
        </div>

        {/* Method 3: CSV Import */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border-2 border-slate-900 group hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none text-white">
            <FileDown size={180} />
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20 group-hover:scale-110 transition-transform">
              <FileDown className="text-[var(--cat-yellow)] w-7 h-7" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">3. CARGA MASIVA CSV</h3>
            <p className="text-[11px] font-bold text-slate-300 leading-relaxed mb-8 uppercase tracking-wide">Descargar Excel modelo. Formato estándar para actualizar o crear productos en bloque.</p>
          </div>
          <div className="relative z-10 flex flex-col gap-4">
             <div className="flex gap-4">
               <button onClick={handleDownloadTemplate} className="flex-1 bg-white/10 border border-white/20 text-white py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white hover:text-black transition-all" title="Descargar Formato">
                 FORMATO
               </button>
               <button onClick={handleExportCSV} className="flex-1 bg-white/10 border border-white/20 text-white py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white hover:text-black transition-all" title="Descargar Catálogo Actual">
                 BACKUP
               </button>
             </div>
             <label className="w-full bg-[var(--cat-yellow)] text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-cat">
               {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} 
               IMPORTAR CSV
               <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} disabled={isImporting} />
             </label>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-6 bg-white p-6 rounded-[3rem] border-2 border-slate-100 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--cat-yellow)]/20" />
        
        <div className="flex-1 flex items-center space-x-6 w-full">
          <div className="flex-1 flex items-center bg-slate-50 px-8 py-5 rounded-[1.5rem] border border-slate-100 focus-within:border-[var(--cat-yellow)] focus-within:bg-white transition-all group/search shadow-inner">
            <Search className="text-slate-300 mr-5 group-focus-within:text-slate-600 transition-colors" size={24} />
            <input 
              type="text" 
              placeholder={activeTab === "mine" ? "Escanear SKU, Nombre o Categoría..." : "Búsqueda Profunda en el Catálogo Maestro Global..."}
              className="bg-transparent border-none outline-none font-bold text-sm w-full placeholder:text-slate-300 text-slate-800 uppercase tracking-widest"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="bg-white p-5 rounded-2xl border-2 border-slate-100 text-slate-400 hover:text-[var(--cat-yellow-dark)] hover:border-[var(--cat-yellow)] transition-all shadow-xl group/filter">
            <Filter size={24} className="group-hover/filter:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {/* Main Content */}
        <div className="w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--cat-yellow)]/5 to-transparent animate-pulse" />
              <Loader2 className="w-16 h-16 text-slate-800 animate-spin mb-6 relative z-10" />
              <p className="font-black uppercase tracking-[0.4em] text-slate-400 text-[10px] relative z-10">Sincronizando Inventario Industrial...</p>
            </div>
          ) : activeTab === "mine" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <>
                {myProducts.map((p: Product) => (
                  <div key={p.id} className="bg-white rounded-3xl border-2 border-slate-100 flex flex-col group hover:border-[var(--cat-yellow)] hover:shadow-2xl transition-all relative overflow-hidden h-full shadow-sm">
                    
                    {/* Imagen y Marca */}
                    <div className="w-full aspect-square bg-slate-50 relative overflow-hidden group/img border-b-2 border-slate-100 cursor-pointer" onClick={() => setSelectedProduct(p)}>
                      <span className="absolute top-4 left-4 text-[9px] font-black uppercase tracking-widest bg-slate-900 text-white px-4 py-2 rounded-xl z-20 shadow-lg">
                        {p.brand || 'B2B CAT'}
                      </span>
                      {(p.images && p.images.length > 0) ? (
                        <img src={p.images[0]} alt={p.custom_name} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <Package size={48} className="opacity-10 mb-2 text-slate-900" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 leading-none">SIN IMAGEN</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Detalles */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[70%]">
                          ID: {p.sku_cuie || p.id.substring(0,8)}
                        </p>
                        <Link href={`/dashboard/catalog/edit/${p.id}`} className="text-slate-300 hover:text-slate-900 transition-colors p-2" title="Ficha Técnica Completa">
                          <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                      
                      <h3 className="font-black text-[13px] text-[var(--strong-text)] uppercase tracking-tight leading-tight mb-2 line-clamp-2" title={p.custom_name}>
                        {p.custom_name}
                      </h3>
                      <p className="text-[10px] text-[var(--muted-foreground)] line-clamp-2 leading-relaxed mb-4 font-medium" title={p.custom_description || ''}>
                        {p.custom_description || 'Ficha técnica en desarrollo.'}
                      </p>
                       {/* Boton DESTACAR EN VITRINA */}
                       <div className="pt-3 border-t border-[var(--border)] mt-auto">
                         <button
                           id={`showcase-btn-${p.id}`}
                           onClick={() => handleShowcaseSubmit(p.id)}
                           disabled={showcaseLoading === p.id}
                           className={`w-full py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all flex items-center justify-center gap-2 ${tenantPlan === 'free' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90' : 'bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'}`}
                         >
                           {showcaseLoading === p.id
                             ? <Loader2 size={12} className="animate-spin" />
                             : tenantPlan === 'free'
                               ? <><Crown size={12} /> DESTACAR (PRO)</>
                               : <><Star size={12} /> DESTACAR EN VITRINA</>
                           }
                         </button>
                       </div>
                    </div>
                  </div>
                ))}

                {/* Freemium Limit Placeholders */}
                {Array.from({ length: Math.max(0, 20 - myProducts.length) }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="bg-[var(--background)]/30 rounded-2xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center group hover:border-[var(--primary)]/40 hover:bg-[var(--card)] transition-all relative overflow-hidden h-full min-h-[320px] cursor-not-allowed">
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 bg-[var(--card)] rounded-full flex items-center justify-center mb-5 border border-[var(--border)] group-hover:border-[var(--primary)]/30 group-hover:scale-110 transition-all shadow-inner">
                        <Package size={24} className="text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--strong-text)] opacity-80 mb-2">CUPO B2B DISPONIBLE</span>
                      <span className="text-xs font-bold text-[var(--muted-foreground)] opacity-60">Espacio {myProducts.length + idx + 1} de 20 (FREEMIUM)</span>
                    </div>
                  </div>
                ))}
              </>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {masterProducts.length > 0 ? (
                masterProducts.map((p: CatalogMasterProduct) => (
                  <div key={p.id} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] flex flex-col group hover:border-[var(--primary)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] transition-all relative overflow-hidden h-full">
                    
                    {/* Imagen y Marca */}
                    <div className="w-full aspect-square bg-[var(--background)] relative overflow-hidden group/img border-b border-[var(--border)] cursor-pointer" onClick={() => setSelectedProduct(p)}>
                      <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest bg-[var(--primary)] text-white px-3 py-1.5 rounded-full z-20 shadow-md">
                        {p.brand || 'B2B'}
                      </span>
                      {p.image_url_1 ? (
                        <img src={p.image_url_1} alt={p.product_name} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <Package size={40} className="opacity-10 mb-2 text-[var(--primary)]" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-[var(--primary)]/40 leading-none">SIN IMAGEN</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Detalles */}
                    <div className="p-5 flex flex-col flex-grow">
                      <p className="text-[9px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 truncate">
                        SKU: {p.sku_cuim || 'CM-PEND'}
                      </p>
                      <h3 className="font-black text-[13px] text-[var(--strong-text)] uppercase tracking-tight leading-tight mb-2 line-clamp-2" title={p.product_name}>
                        {p.product_name}
                      </h3>
                      <p className="text-[10px] text-[var(--muted-foreground)] line-clamp-2 leading-relaxed mb-4 font-medium" title={p.description || ''}>
                        {p.description || 'Ficha técnica centralizada.'}
                      </p>
                      
                      {/* Botón Cotizar -> Vincular en el Maestro */}
                      <div className="mt-auto pt-4 border-t border-[var(--border)]">
                        <button 
                          onClick={() => handleLinkProduct(p)}
                          className="w-full border border-[var(--primary)] text-[var(--primary)] py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[var(--primary)] hover:text-white transition-all active:scale-95 text-center flex items-center justify-center gap-2 group/btn"
                        >
                          <LinkIcon size={14} className="group-hover/btn:scale-110 transition-transform" /> VINCULAR
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-[var(--card)] rounded-[2rem] border-2 border-dashed border-[var(--border)]">
                  <Globe size={48} className="mx-auto text-[var(--muted)] mb-6 opacity-30 animate-spin-slow" />
                  <p className="font-black uppercase tracking-widest text-[var(--muted-foreground)] text-xs italic">MAESTRO VACÍO O SIN COINCIDENCIAS</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Horizontal Compliance Score - Footer Widget */}
        <div className="w-full bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 group">
           <div className="absolute top-0 right-0 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none text-black">
              <BarChart3 size={300} />
           </div>
           
           <div className="flex-1 w-full md:w-auto z-10">
             <div className="flex items-center gap-6 mb-3">
               <h4 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Compliance Score</h4>
               <span className="bg-[var(--cat-yellow)] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-black border-2 border-black shadow-sm">Excelente Progreso</span>
             </div>
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-xl">
               Mejore su visibilidad técnica para atraer compradores corporativos. Complete las fichas al 100%.
             </p>
           </div>
           
           <div className="flex-1 w-full relative z-10 max-w-xl">
             <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-200">
                <div className="h-full bg-slate-900 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.2)]" style={{ width: '65%' }} />
             </div>
             <div className="flex justify-between items-center mt-5 text-sm">
                <span className="font-black uppercase tracking-widest text-slate-400 text-xs">Posicionamiento SEO B2B CAT</span>
                <span className="font-black text-3xl text-slate-900">6.5 <span className="text-xs opacity-40">/ 10</span></span>
             </div>
           </div>
        </div>
      </div>

      {/* Product Quick View Sidebar */}
      <ProductQuickView 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)}
        actionLabel={activeTab === "gcm" ? "Vincular a mi Catálogo" : "Editar Detalles"}
        onAction={() => {
          alert(activeTab === "gcm" ? "Producto vinculado con éxito" : "Abriendo editor...");
          setSelectedProduct(null);
        }}
      />

      {/* ══ MODAL UPGRADE PLAN PRO (FREEMIUM) ══ */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowUpgradeModal(false)} />
          <div className="relative bg-zinc-950 border border-amber-500/30 rounded-[3rem] p-10 max-w-lg w-full shadow-2xl shadow-amber-500/10 overflow-hidden">
            {/* Glow effect */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full" />
            
            <button onClick={() => setShowUpgradeModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
              <XIcon size={20} />
            </button>

            <div className="relative z-10 text-center space-y-8">
              {/* Icono premium */}
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/30 rotate-3 hover:rotate-0 transition-transform">
                <Crown size={48} className="text-white" />
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Plan Freemium Activo</p>
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-tight">
                  Tu negocio merece <br />
                  <span className="text-amber-400">ser visto por miles.</span>
                </h2>
                <p className="text-zinc-400 font-medium text-sm leading-relaxed max-w-sm mx-auto">
                  Con el <strong className="text-white">Plan PRO</strong>, tus productos se destacan en la Vitrina B2B y llegan directamente a compradores corporativos que buscan exactamente lo que ofreces.
                </p>
              </div>

              {/* Beneficios PRO */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-3">
                {[
                  '⚡ Productos destacados en Vitrina B2B',
                  '📊 Alertas WhatsApp en tiempo real',
                  '🌐 Catálogo digital ilimitado',
                  '🤖 Optimización IA de fichas técnicas',
                  '📈 Estadísticas avanzadas de visitas',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                    <span className="text-sm font-bold text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-4">
                <a
                  href="https://wa.me/51990670153?text=Quiero%20actualizar%20al%20Plan%20PRO%20de%20B2B%20Empresas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-amber-500/30 flex items-center justify-center gap-3"
                >
                  <Zap size={20} fill="currentColor" /> ACTIVAR PLAN PRO AHORA
                </a>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Continuar con Plan Freemium
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL RESULTADO SHOWCASE (PRO) ══ */}
      {showcaseResult && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowcaseResult(null)} />
          <div className="relative bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl overflow-hidden">
            <button onClick={() => setShowcaseResult(null)} className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 transition-colors">
              <XIcon size={20} />
            </button>
            <div className="text-center space-y-6">
              {showcaseResult.result === 'approved' && (
                <>
                  <div className="w-20 h-20 bg-green-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-green-500/20">
                    <CheckCircle2 size={48} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">¡Producto Destacado!</h3>
                  <p className="text-sm text-gray-500 font-medium">{showcaseResult.reason}</p>
                </>
              )}
              {showcaseResult.result === 'rejected' && (
                <>
                  <div className="w-20 h-20 bg-red-500 rounded-[2rem] flex items-center justify-center mx-auto">
                    <AlertCircle size={48} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Solicitud Rechazada</h3>
                  <p className="text-sm text-gray-500 font-medium">{showcaseResult.reason}</p>
                </>
              )}
              {showcaseResult.result === 'pending_review' && (
                <>
                  <div className="w-20 h-20 bg-amber-500 rounded-[2rem] flex items-center justify-center mx-auto">
                    <Sparkles size={48} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">En Revisión</h3>
                  <p className="text-sm text-gray-500 font-medium mb-4">{showcaseResult.reason}</p>
                  {showcaseResult.failedCriteria && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Criterios pendientes:</p>
                      {showcaseResult.failedCriteria.map((c, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <AlertCircle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                          <span className="text-xs font-bold text-amber-800">{c}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              <button
                onClick={() => setShowcaseResult(null)}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-700 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
      {/* AI Optimizing Overlay */}
      {isOptimizing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center animate-reveal">
          <div className="relative">
            <div className="absolute inset-0 bg-accent rounded-full blur-3xl opacity-20 animate-pulse" />
              <div className="relative bg-[var(--card)] p-12 rounded-[3.5rem] border border-[var(--primary)]/30 flex flex-col items-center space-y-8 shadow-2xl max-w-lg w-full">
                <div className="relative">
                  <div className="absolute inset-0 bg-[var(--primary)] rounded-full blur-2xl opacity-20 animate-pulse" />
                  <Loader2 className="w-20 h-20 text-[var(--primary)] animate-spin relative z-10" />
                  <Sparkles className="absolute -top-3 -right-3 text-[var(--primary)] animate-bounce" />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-[var(--strong-text)]">OPTIMIZACIÓN IA</h3>
                  <p className="text-[var(--muted-foreground)] font-bold text-[10px] uppercase tracking-widest">Analizando fichas técnicas y descripciones corporativas...</p>
                </div>
                <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden border border-[var(--border)]">
                  <div className="h-full bg-[var(--primary)] animate-shimmer" style={{ width: '70%' }} />
                </div>
                <p className="text-xs font-medium text-[var(--primary)]/70 italic text-center">Generando etiquetas SEO y categorización industrial automática</p>
              </div>
            </div>
        </div>
      )}

      {/* Manual Add Modal */}
      <AddProductModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleManualSave}
        loading={isSavingManual}
      />

      {/* Sync Wizard Modal */}
      {isSyncWizardOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-reveal">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsSyncWizardOpen(false)} />
          <div className="relative bg-[var(--card)] w-full max-w-2xl rounded-[3rem] overflow-hidden border border-[var(--border)] shadow-2xl">
             {/* Progress Bar */}
             <div className="h-2 bg-[var(--muted)] w-full">
                <div 
                  className="h-full bg-[var(--primary)] transition-all duration-1000" 
                  style={{ width: `${(syncStep / 3) * 100}%` }}
                />
             </div>

             <div className="p-12 text-center space-y-8">
                {syncStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="w-20 h-20 bg-[var(--primary)]/10 text-[var(--primary)] rounded-3xl flex items-center justify-center mx-auto">
                       <Search size={40} />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[var(--strong-text)]">Detectando Inventario</h2>
                      <p className="text-[var(--muted-foreground)] font-bold text-xs uppercase tracking-widest leading-relaxed">
                        Analizando su catálogo actual para mapear con el GCM Industrial
                      </p>
                    </div>
                    <div className="bg-[var(--muted)]/50 p-6 rounded-2xl border border-[var(--border)] text-left">
                       <div className="space-y-3">
                          {[1,2,3].map(i => (
                            <div key={i} className="flex items-center gap-3">
                               <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                               <div className="h-3 w-48 bg-gray-300/50 rounded-full" />
                            </div>
                          ))}
                       </div>
                    </div>
                    <button 
                      onClick={() => setSyncStep(2)}
                      className="w-full bg-[var(--primary)] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[var(--primary)]/20"
                    >
                      INICIAR ESCANEO INTELIGENTE
                    </button>
                  </div>
                )}

                {syncStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="relative w-20 h-20 mx-auto">
                       <Loader2 size={80} className="text-[var(--primary)] animate-spin" />
                       <Sparkles size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--accent)]" />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[var(--strong-text)]">Mapeo con IA</h2>
                       <p className="text-[var(--muted-foreground)] font-bold text-xs uppercase tracking-widest leading-relaxed">
                         Vinculando sus referencias con el Catálogo Maestro Industrial
                       </p>
                    </div>
                    <div className="p-10 border-2 border-dashed border-[var(--primary)]/30 rounded-[2.5rem] bg-[var(--primary)]/5 relative overflow-hidden">
                       <div className="absolute inset-0 bg-shimmer opacity-10" />
                       <p className="font-black text-sm text-[var(--primary)] animate-pulse uppercase tracking-tighter italic">Optimizando Fichas Técnicas...</p>
                    </div>
                    <button 
                      onClick={() => {
                        setTimeout(() => setSyncStep(3), 2000);
                        setSyncStep(3);
                      }}
                       className="w-full bg-[var(--deep-section)] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest"
                    >
                       PROCESANDO DATOS...
                    </button>
                  </div>
                )}

                {syncStep === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/20">
                       <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[var(--strong-text)]">Sincronización Exitosa</h2>
                       <p className="text-[var(--muted-foreground)] font-bold text-xs uppercase tracking-widest leading-relaxed">
                         Su catálogo ha sido actualizado y optimizado para el Ecosistema B2B
                       </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-[var(--muted)]/50 p-6 rounded-2xl border border-[var(--border)]">
                          <p className="text-2xl font-black text-[var(--primary)]">12</p>
                          <p className="text-[8px] font-black uppercase text-[var(--muted-foreground)] tracking-widest mt-1">PRODUCTOS VINCULADOS</p>
                       </div>
                       <div className="bg-[var(--muted)]/50 p-6 rounded-2xl border border-[var(--border)]">
                          <p className="text-2xl font-black text-blue-600">85%</p>
                          <p className="text-[8px] font-black uppercase text-[var(--muted-foreground)] tracking-widest mt-1">MEJORA EN SEO IA</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => {
                         setIsSyncWizardOpen(false);
                         setActiveTab("mine");
                      }}
                       className="w-full bg-[var(--primary)] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[var(--primary)]/20"
                    >
                       VER MI CATÁLOGO ACTUALIZADO
                    </button>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
