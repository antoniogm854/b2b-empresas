"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  Globe, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  ArrowRight,
  Eye,
  Sparkles,
  Loader2,
  Zap,
  Link as LinkIcon,
  Download,
  Upload,
  FileDown,
  BarChart3
} from "lucide-react";
import { companyService } from "@/lib/company-service";
import { aiService } from "@/lib/ai-service";
import Link from "next/link";
import AdPlacements from "@/components/catalog/AdPlacements";
import ProductQuickView from "@/components/dashboard/QuickView";
import { 
  catalogService, 
  Product, 
  CatalogMasterProduct 
} from "@/lib/catalog-service";
import { authService } from "@/lib/auth-service";
import { useEffect } from "react";
import { formatCurrency } from "@/lib/currency-utils";
import { useSearchParams } from "next/navigation";

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
  const [isImporting, setIsImporting] = useState(false);

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

  return (
    <div className="space-y-10 animate-fade-in relative z-10 pb-20">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 mb-2">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-10 bg-[#A2C367] rounded-full shadow-[0_0_15px_#A2C367]" />
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic text-[var(--strong-text)] leading-none">
              GESTIÓN <span className="brand-t-detail text-[#A2C367]">DE</span> <br/><span className="text-[#A2C367]">PRODUCTOS</span> B2B
            </h1>
          </div>
          <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px] pl-5 border-l border-zinc-800 ml-1">
             INTELIGENCIA INDUSTRIAL <span className="text-[#A2C367] mx-2">/</span> GESTIÓN DE SKU GLOBAL
          </p>
        </div>
        
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-md">
          <button 
            onClick={() => setActiveTab("mine")}
            className={`flex items-center px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === "mine" ? "bg-[#A2C367] text-black shadow-[0_0_20px_rgba(162,195,103,0.3)]" : "text-zinc-500 hover:text-white"
            }`}
          >
            <Package size={16} className="mr-2" />
            MIS PRODUCTOS
          </button>
          <button 
            onClick={() => setActiveTab("gcm")}
            className={`flex items-center px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === "gcm" ? "bg-[#A2C367] text-black shadow-[0_0_20px_rgba(162,195,103,0.3)]" : "text-zinc-500 hover:text-white"
            }`}
          >
            <Globe size={16} className="mr-2" />
            MAESTRO GLOBAL
          </button>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-6 bg-[var(--panel-bg)] p-6 rounded-[2.5rem] border border-[var(--panel-border)] backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#A2C367]/20 to-transparent" />
        
        <div className="flex-1 flex items-center space-x-6 w-full">
          <div className="flex-1 flex items-center bg-[var(--background)] px-8 py-5 rounded-2xl border border-[var(--panel-border)] focus-within:border-[#A2C367] focus-within:shadow-[0_0_25px_rgba(162,195,103,0.1)] transition-all group/search shadow-inner">
            <Search className="text-[var(--panel-subtext)] mr-5 group-focus-within:text-[#A2C367] transition-colors" size={22} />
            <input 
              type="text" 
              placeholder={activeTab === "mine" ? "Escanear SKU, Nombre o Categoría..." : "Búsqueda Profunda en el Catálogo Maestro Global..."}
              className="bg-transparent border-none outline-none font-bold text-sm w-full placeholder:text-[var(--panel-subtext)]/50 text-[var(--panel-text)] uppercase tracking-widest"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 text-zinc-500 hover:text-[#A2C367] hover:border-[#A2C367]/50 transition-all shadow-xl group/filter">
            <Filter size={22} className="group-hover/filter:scale-110 transition-transform" />
          </button>
        </div>

        {activeTab === "mine" && (
          <div className="flex items-center gap-3 shrink-0 w-full xl:w-auto overflow-x-auto pb-4 xl:pb-0 scrollbar-hide">
            <button 
              onClick={handleDownloadTemplate} 
              className="bg-black/40 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl border border-zinc-800 text-zinc-500 hover:text-blue-400 hover:border-blue-400/50 transition-all font-black text-[10px] uppercase tracking-widest whitespace-nowrap shadow-xl"
            >
              <FileDown size={18} /> Plantilla CSV
            </button>
            <button 
              onClick={handleExportCSV} 
              className="bg-black/40 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl border border-zinc-800 text-zinc-500 hover:text-purple-400 hover:border-purple-400/50 transition-all font-black text-[10px] uppercase tracking-widest whitespace-nowrap shadow-xl"
            >
              <Download size={18} /> Backup
            </button>
            <label className="bg-[#A2C367] hover:bg-[#b0d275] cursor-pointer text-black flex items-center justify-center gap-3 px-10 py-5 rounded-2xl shadow-[0_0_30px_rgba(162,195,103,0.2)] transition-all font-black text-xs uppercase tracking-widest whitespace-nowrap border border-white/20 active:scale-95">
              {isImporting ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />} 
              {isImporting ? 'PROCESANDO...' : 'CARGA MASIVA B2B'}
              <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} disabled={isImporting} />
            </label>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 bg-zinc-900/20 rounded-[4rem] border-2 border-dashed border-zinc-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#A2C367]/5 to-transparent animate-pulse" />
              <Loader2 className="w-16 h-16 text-[#A2C367] animate-spin mb-6 relative z-10" />
              <p className="font-black uppercase tracking-[0.4em] text-zinc-500 text-xs relative z-10">Sincronizando Fichas Técnicas...</p>
            </div>
          ) : activeTab === "mine" ? (
            <div className="grid grid-cols-1 gap-8">
              {myProducts.length > 0 ? (
                myProducts.map((p: Product) => (
                  <div key={p.id} className="bg-black/40 p-8 rounded-[2.5rem] border border-zinc-900 flex flex-col md:flex-row items-center justify-between group hover:border-[#A2C367] hover:shadow-[0_0_40px_rgba(162,195,103,0.05)] transition-all gap-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#A2C367]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-center space-x-8 w-full md:w-auto relative z-10">
                      <div className="w-24 h-24 bg-zinc-900 rounded-[1.8rem] flex items-center justify-center font-black text-[10px] text-zinc-700 uppercase border border-zinc-800 shadow-inner group-hover:border-[#A2C367]/30 transition-colors">
                        <Package size={36} className="opacity-20 group-hover:text-[#A2C367] transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-black text-xl text-white truncate uppercase tracking-tight">{p.custom_name}</h3>
                          {p.master_product_id && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#A2C367]/10 text-[#A2C367] text-[8px] font-black uppercase tracking-widest rounded-full border border-[#A2C367]/20 shadow-sm">
                              <CheckCircle2 size={12} /> VERIFICADO CMb2b
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                          <span className="w-2 h-0.5 bg-[#A2C367]"></span> ID: {p.id.substring(0,8)} <span className="text-zinc-800 mx-1">|</span> 
                          STATUS: <span className={p.is_active ? 'text-[#A2C367]' : 'text-red-500'}>
                            {p.is_active ? 'OPERATIVO' : 'FUERA DE LÍNEA'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-8 border-t md:border-t-0 border-zinc-900 pt-8 md:pt-0 relative z-10">
                      <div className="text-left md:text-right border-r border-zinc-900 pr-8">
                        <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest mb-1">Valor Unitario</p>
                        <p className="text-3xl font-black text-white tracking-tighter italic">{formatCurrency(p.unit_price || 0)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          className="w-14 h-14 rounded-2xl transition-all flex items-center justify-center relative group/btn bg-zinc-900 text-zinc-500 hover:bg-[#A2C367] hover:text-black border border-zinc-800 hover:border-[#A2C367] shadow-xl"
                          title="Impulsar Ventas"
                        >
                          <Zap size={24} />
                        </button>
                        <button 
                           onClick={() => setSelectedProduct(p)}
                           className="w-14 h-14 bg-zinc-900 text-zinc-500 rounded-2xl hover:bg-white hover:text-black transition-all border border-zinc-800 flex items-center justify-center shadow-xl"
                           title="Vista Técnica"
                         >
                           <Eye size={24} />
                         </button>
                        <Link 
                          href={`/dashboard/catalog/edit/${p.id}`}
                          className="w-14 h-14 bg-zinc-900 text-zinc-500 rounded-2xl hover:bg-[#4B6319] hover:text-white transition-all border border-zinc-800 flex items-center justify-center shadow-xl"
                          title="Gestionar SKU"
                        >
                          <ArrowRight size={24} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-32 bg-[var(--panel-bg)] rounded-[4rem] border-2 border-dashed border-[var(--panel-border)] flex flex-col items-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[#A2C367]/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-24 h-24 bg-[var(--background)] rounded-full flex items-center justify-center text-[var(--panel-subtext)] mb-8 border border-[var(--panel-border)] group-hover:border-[#A2C367]/30 transition-all shadow-xl">
                    <Package size={48} className="opacity-20 group-hover:text-[#A2C367] transition-all" />
                  </div>
                  <h3 className="text-3xl font-black text-[var(--panel-text)] uppercase tracking-tighter italic">Bóveda de Productos Vacía</h3>
                  <p className="text-[var(--panel-subtext)] font-bold uppercase text-[9px] tracking-[0.3em] mt-3 max-w-xs leading-relaxed">
                    Aún no haz inicializado tu inventario en el CMb2b.
                  </p>
                  <button onClick={() => setActiveTab("gcm")} className="mt-10 bg-[var(--primary)] text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-2xl relative z-10 border border-white/20">IMPORTAR DEL MAESTRO GLOBAL</button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {masterProducts.length > 0 ? (
                masterProducts.map((p: CatalogMasterProduct) => (
                  <div key={p.id} className="bg-black/40 p-10 rounded-[3.5rem] border border-zinc-900 flex flex-col group hover:border-[#A2C367] hover:shadow-[0_0_50px_rgba(162,195,103,0.05)] transition-all relative overflow-hidden">
                    <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#A2C367]/5 rounded-full group-hover:scale-150 transition-transform duration-1000 blur-3xl"></div>
                    
                    <span className="absolute top-10 right-10 text-[9px] font-black uppercase tracking-widest bg-[#A2C367] text-black px-5 py-2 rounded-full z-20 shadow-xl border border-white/20">
                      {p.brand || 'B2B'}
                    </span>
                    <div className="w-full h-56 bg-zinc-900 rounded-[2.5rem] mb-10 flex items-center justify-center font-black text-zinc-800 uppercase border border-zinc-800 shadow-inner group-hover:border-[#A2C367]/20 transition-all">
                      <Package size={56} className="opacity-10 group-hover:opacity-30 group-hover:text-[#A2C367] group-hover:scale-110 transition-all duration-700" />
                    </div>
                    <h3 className="font-black text-2xl mb-2 text-white tracking-tight italic uppercase line-clamp-2 leading-none">{p.product_name}</h3>
                    <p className="text-[10px] font-black text-[#A2C367] mb-10 uppercase tracking-[0.2em]">{p.model || 'SERIE INDUSTRIAL PRO'}</p>
                  
                    <div className="pt-10 border-t border-zinc-900 flex items-center justify-between mt-auto relative z-10">
                      <div>
                        <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest mb-1">CÓDIGO UNIFICADO</p>
                        <p className="text-sm font-black text-white uppercase italic">{p.sku_cuim || 'CM-B2B-PEND'}</p>
                      </div>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => setSelectedProduct(p)}
                          className="w-14 h-14 bg-zinc-900 text-zinc-500 rounded-2xl hover:bg-white hover:text-black transition-all border border-zinc-800 flex items-center justify-center shadow-xl"
                        >
                          <Eye size={24} />
                        </button>
                        <button 
                          onClick={() => handleLinkProduct(p)}
                          className="bg-[#A2C367] text-black px-8 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(162,195,103,0.3)] flex items-center gap-3 active:scale-95"
                        >
                          <LinkIcon size={16} /> VINCULAR SKU
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-32 bg-black/20 rounded-[4rem] border-2 border-dashed border-zinc-900">
                  <Globe size={64} className="mx-auto text-zinc-800 mb-8 opacity-20 animate-spin-slow" />
                  <p className="font-black uppercase tracking-[0.4em] text-zinc-600 text-xs italic">La Búsqueda Global no arrojó resultados industriales</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar / Ads */}
        <div className="lg:col-span-4 space-y-12 h-fit md:sticky md:top-32">
          <div className="bg-[var(--panel-bg)] p-12 rounded-[3.5rem] border border-[var(--panel-border)] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A2C367]/5 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 blur-2xl rounded-full" />
            
            <h2 className="text-2xl font-black mb-10 flex items-center gap-4 uppercase italic tracking-tighter text-[var(--panel-text)] relative z-10">
              <Sparkles className="text-[#A2C367] animate-pulse" />
              <span>Sugerencias IA</span>
            </h2>
            <div className="relative z-10 grayscale hover:grayscale-0 transition-all duration-700">
               <AdPlacements category="Industrial" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#4B6319] to-[#2c3d10] p-10 rounded-[3rem] border border-white/10 shadow-2xl text-white relative overflow-hidden">
             <div className="absolute -right-8 -bottom-8 opacity-10">
                <BarChart3 size={160} />
             </div>
             <h4 className="text-xl font-black uppercase italic tracking-tighter mb-4">Compliance Score</h4>
             <p className="text-xs font-bold text-white/70 uppercase tracking-widest leading-relaxed mb-8">Mejore su visibilidad técnica para atraer más compradores industriales.</p>
             <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div className="h-full bg-white rounded-full shadow-[0_0_15px_white]" style={{ width: '65%' }} />
             </div>
             <div className="flex justify-between items-center mt-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#A2C367]">Excelente Progreso</span>
                <span className="text-sm font-black">6.5 <span className="text-[10px] opacity-50">/ 10</span></span>
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
