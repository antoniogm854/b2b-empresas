"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Package, 
  Building2, 
  Send, 
  CheckCircle, 
  Loader2,
  ArrowRight
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { catalogService, CatalogMasterProduct } from "@/lib/catalog-service";
import { transactionalService } from "@/lib/transactional-service";
import { authService } from "@/lib/auth-service";
import PublicLayout from "@/components/layout/PublicLayout";
import { useTranslations } from "next-intl";
import SearchFilters from "@/components/catalog/SearchFilters";

export default function MarketplaceClient() {
  const t = useTranslations("Marketplace");
  const searchParams = useSearchParams();
  
  const [searchResults, setSearchResults] = useState<CatalogMasterProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CatalogMasterProduct | null>(null);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [sendingRFQ, setSendingRFQ] = useState(false);
  const [rfqSent, setRfqSent] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    authService.getCurrentUser().then(setUser);
    // Cargar listas para filtros
    catalogService.getUniqueCategories().then(setCategories);
    catalogService.getUniqueBrands().then(setBrands);
  }, []);

  // Efecto para búsqueda paramétrica al cambiar la URL
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const filters = {
          query: searchParams.get("query") || undefined,
          category: searchParams.get("category") || undefined,
          brand: searchParams.get("brand") || undefined,
          minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
          maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
        };
        const results = await catalogService.searchParametric(filters);
        setSearchResults(results as any);
        setSelectedProduct(null);
      } catch (error) {
        console.error("Error in parametric search:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [searchParams]);

  const selectProduct = async (product: CatalogMasterProduct) => {
    setSelectedProduct(product);
    setLoading(true);
    try {
      const companyOffers = await transactionalService.getSuppliersByProduct(product.id);
      setSuppliers(companyOffers);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMassRFQ = async () => {
    if (!selectedProduct) return;
    setSendingRFQ(true);
    try {
      await transactionalService.createMultiSupplierRFQ({
        customer_name: user?.user_metadata?.full_name || "Comprador Marketplace",
        customer_email: user?.email || "comprador@b2bempresas.com",
        message: `Solicitud de cotización masiva para ${selectedProduct.product_name}.`
      }, selectedProduct.id);
      setRfqSent(true);
      setTimeout(() => setRfqSent(false), 3000);
    } catch (error) {
      console.error("Error sending mass RFQ:", error);
    } finally {
      setSendingRFQ(false);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#FBFCFE] p-8 pt-32 transition-colors">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter italic animate-reveal">
              Marketplace <span className="text-[var(--cat-yellow-dark)] drop-shadow-sm">B2B</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-bold uppercase tracking-widest animate-reveal [animation-delay:200ms]">
               INFRAESTRUCTURA DE SUMINISTRO INDUSTRIAL <span className="text-[var(--cat-yellow-dark)] ml-2">CAT V1.03</span>
            </p>
          </div>

          {/* New Search & Filter Component */}
          <div className="max-w-4xl mx-auto animate-reveal [animation-delay:400ms]">
            <SearchFilters categories={categories} brands={brands} />
          </div>

          {/* Grid de Productos Industrial Premium */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-[var(--strong-text)] flex items-center gap-3 mb-8 uppercase italic tracking-tighter">
              <Package className="w-6 h-6 text-[var(--primary)]" />
              RESULTADOS DE BÚSQUEDA <span className="text-[var(--primary)]">[{searchResults.length}]</span>
            </h2>
            
            {loading && searchResults.length === 0 ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-slate-900" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {searchResults.map((product) => (
                  <div key={product.id} className="bg-white rounded-3xl border-2 border-slate-100 flex flex-col group hover:border-[var(--cat-yellow)] hover:shadow-2xl transition-all relative overflow-hidden h-full shadow-sm">
                    
                    {/* Imagen y Marca */}
                    <div className="w-full aspect-square bg-slate-50 relative overflow-hidden group/img border-b-2 border-slate-100">
                      <span className="absolute top-4 left-4 text-[9px] font-black uppercase tracking-widest bg-slate-950 text-white px-4 py-2 rounded-xl z-20 shadow-lg">
                        {product.brand || 'B2B CAT'}
                      </span>
                      {product.image_url_1 ? (
                        <Image
                          src={product.image_url_1}
                          alt={product.product_name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                          className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <Package size={48} className="opacity-10 mb-2 text-slate-900" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 leading-none">SIN IMAGEN</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Detalles */}
                    <div className="p-6 flex flex-col flex-grow">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 truncate">
                        ID: {product.sku_cuim || product.id.substring(0,6)}
                      </p>
                      <h3 className="font-black text-sm text-slate-900 uppercase tracking-tighter leading-tight mb-3 line-clamp-2" title={product.product_name}>
                        {product.product_name}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-6 font-bold uppercase tracking-wide italic" title={product.description || ''}>
                        {product.description || 'Ficha técnica no detallada.'}
                      </p>
                      
                      {/* Botón Cotizar */}
                      <div className="mt-auto pt-6 border-t-2 border-slate-50">
                        <button 
                          onClick={() => {
                            selectProduct(product);
                            handleMassRFQ();
                          }}
                          disabled={sendingRFQ}
                          className="w-full bg-[var(--cat-yellow)] text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-3 group/btn shadow-cat border-b-4 border-[var(--cat-yellow-dark)] active:border-b-0"
                        >
                          {sendingRFQ && selectedProduct?.id === product.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Send className="w-5 h-5 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                          )}
                          COTIZAR ALL
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[var(--card)] rounded-[2rem] border-2 border-dashed border-[var(--border)] max-w-2xl mx-auto">
                <Package className="w-16 h-16 text-[var(--muted)] mx-auto mb-6 opacity-30" />
                <h3 className="text-xl font-black text-[var(--strong-text)] uppercase tracking-tighter italic">No se encontraron resultados</h3>
                <p className="text-[var(--muted-foreground)] mt-2 text-sm">Modifique los filtros de búsqueda para encontrar ofertas corporativas.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}
