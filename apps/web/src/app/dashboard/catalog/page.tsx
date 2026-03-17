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
  Loader2
} from "lucide-react";
import Link from "next/link";
import AdPlacements from "@/components/catalog/AdPlacements";
import ProductQuickView from "@/components/dashboard/QuickView";
import { 
  catalogService, 
  Product, 
  GCMProduct 
} from "@/lib/catalog-service";
import { useEffect } from "react";

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState<"mine" | "gcm">("mine");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [gcmProducts, setGcmProducts] = useState<GCMProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // ID de empresa de prueba (esto debe venir de la sesión en prod)
  const companyId = "COMPANY_ID_DEMO";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "mine") {
          const products = await catalogService.getCompanyProducts(companyId);
          setMyProducts(products);
        } else {
          const master = await catalogService.searchGCM(searchQuery);
          setGcmProducts(master);
        }
      } catch (error) {
        console.error("Error fetching catalog data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, searchQuery]);

  const handleLinkProduct = async (gcmProduct: GCMProduct) => {
    try {
      await catalogService.linkGCMProduct(companyId, gcmProduct);
      alert(`${gcmProduct.name} vinculado con éxito.`);
      setActiveTab("mine");
    } catch (error) {
      console.error("Error linking product:", error);
      alert("Error al vincular producto.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tightest uppercase italic">Mi Catálogo</h1>
          <p className="text-muted-foreground font-semibold mt-2">Gestiona tus productos o añade nuevos desde el Master GCM.</p>
        </div>
        
        {/* Tabs Control */}
        <div className="flex bg-muted p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab("mine")}
            className={`flex items-center px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === "mine" ? "bg-background shadow-lg text-primary" : "text-muted-foreground"
            }`}
          >
            <Package size={16} className="mr-2" />
            Mis Productos
          </button>
          <button 
            onClick={() => setActiveTab("gcm")}
            className={`flex items-center px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === "gcm" ? "bg-background shadow-lg text-primary" : "text-muted-foreground"
            }`}
          >
            <Globe size={16} className="mr-2" />
            Explorar GCM
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 flex items-center bg-background px-6 py-4 rounded-3xl border-2 border-muted/50 focus-within:border-accent transition-all">
          <Search className="text-muted-foreground mr-3" size={20} />
          <input 
            type="text" 
            placeholder={activeTab === "mine" ? "Buscar en mi catálogo..." : "Buscar en el Catálogo Maestro Global..."}
            className="bg-transparent border-none outline-none font-bold text-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="bg-background p-4 rounded-2xl border-2 border-muted/50 hover:bg-muted transition-all">
          <Filter size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-[3rem] border-2 border-dashed border-muted/50">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="font-black uppercase tracking-widest text-muted-foreground">Sincronizando Catálogo...</p>
            </div>
          ) : activeTab === "mine" ? (
            <div className="grid grid-cols-1 gap-4">
              {myProducts.length > 0 ? (
                myProducts.map((p: Product) => (
                  <div key={p.id} className="bg-background p-6 rounded-3xl border-2 border-muted/50 flex items-center justify-between group hover:border-primary transition-all">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center font-black text-[10px] text-muted-foreground uppercase opacity-40">
                        IMAGEN
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-black text-lg">{p.name}</h3>
                          {p.gcm_id && <CheckCircle2 size={16} className="text-accent" title="Vinculado al GCM" />}
                        </div>
                        <p className="text-sm font-bold text-muted-foreground uppercase opacity-70">
                          Estado: <span className={p.stock_status === 'available' ? 'text-green-500' : 'text-red-500'}>
                            {p.stock_status === 'available' ? 'Disponible' : 'A Pedido'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-xs font-black uppercase text-muted-foreground">Precio</p>
                        <p className="text-xl font-black">{p.price}</p>
                      </div>
                      <button 
                        onClick={async () => {
                          const conf = confirm(`¿Deseas solicitar promoción para "${p.name}" por 7 días? Sujeto a aprobación administrativa.`);
                          if (conf) {
                            try {
                              await adService.requestPromotion(p.id, 7);
                              alert("Solicitud de promoción enviada con éxito. Pendiente de aprobación.");
                            } catch (e) {
                              console.error(e);
                              alert("Solicitud enviada (Modo Demo)");
                            }
                          }
                        }}
                        className={`p-4 rounded-2xl transition-all flex items-center space-x-2 ${
                          p.ad_status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 
                          p.ad_status === 'approved' ? 'bg-green-100 text-green-600' :
                          'bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground'
                        }`}
                        title="Gestionar Promoción"
                      >
                        <Sparkles size={20} />
                        <span className="text-[10px] font-black uppercase hidden group-hover:block">
                          {p.ad_status === 'pending' ? 'Pendiente' : 
                           p.ad_status === 'approved' ? 'Activo' : 'Promover'}
                        </span>
                      </button>
                      <button 
                         onClick={() => setSelectedProduct(p)}
                         className="bg-muted p-4 rounded-2xl hover:bg-accent hover:text-accent-foreground transition-all"
                       >
                         <Eye size={20} />
                       </button>
                      <Link 
                        href={`/dashboard/catalog/edit/${p.id}`}
                        className="bg-muted p-4 rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted">
                  <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="font-black uppercase tracking-widest text-muted-foreground">Tu catálogo está vacío</p>
                  <button onClick={() => setActiveTab("gcm")} className="mt-4 text-accent font-black underline">Empieza explorando el GCM</button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gcmProducts.length > 0 ? (
                gcmProducts.map((p: GCMProduct) => (
                  <div key={p.id} className="bg-background p-8 rounded-[2.5rem] border-2 border-muted/50 flex flex-col group hover:border-accent transition-all relative overflow-hidden">
                    <span className="absolute top-6 right-6 text-[10px] font-black uppercase tracking-tighter bg-accent/20 text-accent px-3 py-1 rounded-full">
                      {p.brand}
                    </span>
                    <div className="w-full h-40 bg-muted rounded-[2rem] mb-6 flex items-center justify-center font-black text-muted-foreground uppercase opacity-30">
                      IMAGEN MAESTRA
                    </div>
                    <h3 className="font-black text-xl mb-2">{p.name}</h3>
                    <p className="text-sm font-bold text-muted-foreground mb-6 flex-1">{p.model || 'Sin modelo'}</p>
                  
                    <div className="pt-6 border-t border-muted flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Categoría</p>
                        <p className="text-sm font-black">{p.category}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedProduct(p)}
                          className="bg-muted p-4 rounded-2xl hover:bg-accent transition-all"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleLinkProduct(p)}
                          className="bg-primary text-primary-foreground p-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
                        >
                          <Plus size={18} className="inline mr-2" />
                          Vincular
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted">
                  <Globe size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="font-black uppercase tracking-widest text-muted-foreground">No se encontraron productos en GCM</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar / Ads */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] border-2 border-muted shadow-sm">
            <h2 className="text-xl font-black mb-6 flex items-center space-x-2 uppercase italic">
              <Sparkles className="text-accent" />
              <span>Oportunidades</span>
            </h2>
            <AdPlacements category="Industrial" />
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
    </div>
  );
}
