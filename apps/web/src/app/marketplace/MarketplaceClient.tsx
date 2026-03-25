"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Package, 
  Building2, 
  Send, 
  CheckCircle, 
  Loader2,
  ArrowRight
} from "lucide-react";
import { catalogService, CatalogMasterProduct } from "@/lib/catalog-service";
import { transactionalService } from "@/lib/transactional-service";
import { authService } from "@/lib/auth-service";
import MainLayout from "@/components/layout/MainLayout";
import { useTranslations } from "next-intl";

export default function MarketplaceClient() {
  const t = useTranslations("Marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CatalogMasterProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CatalogMasterProduct | null>(null);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [sendingRFQ, setSendingRFQ] = useState(false);
  const [rfqSent, setRfqSent] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    authService.getCurrentUser().then(setUser);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await catalogService.searchMaster(searchQuery);
      setSearchResults(results);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error searching marketplace:", error);
    } finally {
      setLoading(false);
    }
  };

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
    <MainLayout>
      <div className="min-h-screen bg-slate-50 p-8 pt-32">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tightest">{t('title')}</h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg font-bold">
              {t('subtitle')}
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
            <input
              type="text"
              placeholder={t('search_placeholder')}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-xl focus:ring-2 focus:ring-blue-500 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              {t('search_btn')}
            </button>
          </form>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Results List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Package className="w-5 h-5" />
                {t('results_title')} ({searchResults.length})
              </h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {loading && !selectedProduct && (
                  <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                )}
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => selectProduct(product)}
                    className={`w-full text-left p-4 rounded-xl transition border-2 ${
                      selectedProduct?.id === product.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-white bg-white hover:border-blue-200'
                    }`}
                  >
                    <p className="font-bold text-slate-900">{product.product_name}</p>
                    <p className="text-sm text-slate-500">{product.brand} - {product.model}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details & Multi-Supplier View */}
            <div className="lg:col-span-2">
              {selectedProduct ? (
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-start mb-8">
                    <div className="space-y-2">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {selectedProduct.category_id || 'Industrial'}
                      </span>
                      <h2 className="text-3xl font-bold text-slate-900">{selectedProduct.product_name}</h2>
                      <p className="text-slate-500">{selectedProduct.brand} | {selectedProduct.model}</p>
                    </div>
                    
                    <button
                      onClick={handleMassRFQ}
                      disabled={sendingRFQ || suppliers.length === 0}
                      className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition shadow-lg ${
                        rfqSent
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-900 text-white hover:bg-black disabled:bg-slate-300'
                      }`}
                    >
                      {sendingRFQ ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : rfqSent ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      {rfqSent ? t('sent_btn') : t('send_all_btn')}
                    </button>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      {t('offers_title')} ({suppliers.length})
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {suppliers.map((offer) => (
                        <div key={offer.company_id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                              {offer.tenants?.logo_url ? (
                                <img src={offer.tenants.logo_url} alt={offer.tenants.company_name} className="w-full h-full object-cover" />
                              ) : (
                                <Building2 className="w-6 h-6 text-slate-400" />
                              )}
                            </div>
                            <div>
                               <p className="font-bold text-slate-900">{offer.tenants?.company_name}</p>
                               <p className="text-sm text-blue-600 font-medium">{offer.unit_price ? `USD ${offer.unit_price}` : t('price_on_request')}</p>
                            </div>
                          </div>
                          <div className="text-right">
                          </div>
                        </div>
                      ))}
                      {suppliers.length === 0 && !loading && (
                        <p className="col-span-2 text-center py-12 text-slate-400 italic">
                          {t('no_suppliers')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-4 p-12 bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-10 h-10 text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{t('select_product')}</h3>
                    <p className="text-slate-500">{t('select_desc')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
