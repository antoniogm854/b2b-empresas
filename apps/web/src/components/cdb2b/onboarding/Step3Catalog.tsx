"use client";

import { useState, useEffect } from "react";
import { Bot, Image as ImageIcon, FileText, CheckCircle2, ChevronRight, X, Sparkles, UploadCloud } from "lucide-react";

interface Step3Props {
  onComplete: (data: any) => void;
  onPrev: () => void;
  initialData: any;
  isLoading?: boolean;
}

interface ProductEntry {
  id: string;
  skuCUIM: string;
  skuCUIE: string;
  skuMPN: string;
  skuGG: string;
  skuGE: string;
  category: string;
  name: string;
  description: string;
  unit: string;
  brand: string;
  model: string;
  price: string;
  stock: string;
  series: string;
  color: string;
  size: string;
  material: string;
  origin: string;
  observations: string;
  location: string;
  dispatch: string;
  presentation: string;
  isCertified: boolean;
  isMostRequested: boolean;
  images: any[];
  files: any[];
}

export default function Step3Catalog({ onComplete, onPrev, initialData }: Step3Props) {
  const [products, setProducts] = useState<ProductEntry[]>(initialData.products || []);
  const [isAdding, setIsAdding] = useState(false);
  const [isSimulatingScrape, setIsSimulatingScrape] = useState(initialData.authImport === true && (!initialData.products || initialData.products.length === 0));

  useEffect(() => {
    if (isSimulatingScrape) {
      const timer = setTimeout(() => {
        setIsSimulatingScrape(false);
        // Add a dummy scraped product if they allowed web sync
        if (products.length === 0) {
          const skus = generateSKUs();
          setProducts([{
            id: Math.random().toString(36).substring(7),
            skuCUIM: skus.cuim,
            skuCUIE: skus.cuie,
            skuMPN: "MPN-DEMO-01",
            skuGG: "HERRAMIENTAS",
            skuGE: "ELÉCTRICAS",
            category: "Maquinaria",
            name: "Producto Importado desde su Web (Ejemplo)",
            description: "Información extraída automáticamente.",
            unit: "UN",
            brand: initialData.razonSocial || "Su Empresa",
            model: "Mod-2026",
            price: "0.00",
            stock: "100",
            series: "",
            color: "Industrial",
            size: "Estándar",
            material: "Acero",
            origin: "Importado",
            observations: "Favor validar la información importada.",
            location: initialData.domicilioFiscal || "",
            dispatch: "Inmediato",
            presentation: "Caja",
            isCertified: true,
            isMostRequested: true,
            images: [],
            files: [],
          }]);
        }
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isSimulatingScrape]);

  const getCatalogPoints = () => {
    if (products.length > 20) return 2;
    if (products.length > 0) return 1;
    return 0;
  };
  const getCatalogStars = () => {
    if (products.length > 20) return 1.5;
    if (products.length > 0) return 1;
    return 0;
  };

  const currentScore = (initialData.compliance_score || 2) + getCatalogPoints();
  const currentStars = (initialData.compliance_stars || 1) + getCatalogStars();

  const [newProduct, setNewProduct] = useState<Partial<ProductEntry>>({
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
    location: initialData.domicilioFiscal || "",
    observations: "",
    isMostRequested: false,
    isCertified: false,
    images: [],
    files: []
  });

  const [imageError, setImageError] = useState("");
  const [fileError, setFileError] = useState("");

  const generateSKUs = () => {
    const cuup = initialData.taxId || "B2B";
    const random = Math.floor(1000 + Math.random() * 9000);
    return {
      cuim: `CUIM-${random}`,
      cuie: `CUIE-${cuup}-${random}`
    };
  };

  const addProduct = () => {
    if (!newProduct.name || newProduct.name.trim() === "") return;
    const skus = generateSKUs();
    
    const product: ProductEntry = {
      id: Math.random().toString(36).substring(7),
      skuCUIM: skus.cuim,
      skuCUIE: skus.cuie,
      skuMPN: newProduct.skuMPN || "S/N",
      skuGG: newProduct.skuGG || "GG",
      skuGE: newProduct.skuGE || "GE",
      category: newProduct.category || "General",
      name: newProduct.name!,
      description: newProduct.description || "",
      unit: newProduct.unit || "UN",
      brand: newProduct.brand || "Sin Marca",
      model: newProduct.model || "S/M",
      price: newProduct.price || "0.00",
      stock: newProduct.stock || "0",
      series: newProduct.series || "",
      color: newProduct.color || "",
      size: newProduct.size || "",
      material: newProduct.material || "",
      origin: newProduct.origin || "Nacional",
      observations: newProduct.observations || "",
      location: newProduct.location || initialData.domicilioFiscal || "",
      dispatch: newProduct.dispatch || "A convenir",
      presentation: newProduct.presentation || "Unidad",
      isCertified: !!newProduct.isCertified,
      isMostRequested: !!newProduct.isMostRequested,
      images: newProduct.images || [],
      files: newProduct.files || [],
    };
    
    setProducts([product, ...products]);
    setNewProduct({
      name: "", skuMPN: "", skuGG: "", skuGE: "", category: "", brand: "", model: "",
      price: "", stock: "0", unit: "PZA", presentation: "", series: "", origin: "",
      color: "", size: "", material: "", dispatch: "", location: initialData.domicilioFiscal || "",
      observations: "", isMostRequested: false, isCertified: false, images: [], files: []
    });
    setIsAdding(false);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  if (isSimulatingScrape) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-in">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-zinc-800 border-t-[#A2C367] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Bot className="w-12 h-12 text-[#A2C367] animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-4 max-w-lg">
          <h2 className="text-2xl font-black uppercase italic tracking-widest text-[#A2C367] flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6" /> Sincronización Web Activada
          </h2>
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
            Nuestros bots están escaneando la página web autorizada buscando sus catálogos, imágenes y fichas técnicas...
          </p>
          <div className="flex justify-center gap-2 pt-4">
            <div className="w-3 h-3 bg-[#A2C367] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 bg-[#A2C367] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-3 h-3 bg-[#A2C367] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-black tracking-tightest uppercase italic leading-none text-[var(--strong-text)]">
          Ya estás en tu <span className="text-[#A2C367]">Catálogo Digital</span>
        </h2>
        <p className="text-[#A2C367] font-black text-[10px] uppercase tracking-widest animate-pulse border border-[#A2C367]/20 bg-[#A2C367]/5 py-2 px-4 rounded-full inline-block">
           🛠️ Módulo de Gestión Industrial Activo
        </p>
      </div>

      <div className="bg-[var(--card)] border-2 border-[var(--border)] p-6 rounded-2xl flex items-center justify-between shadow-lg max-w-3xl mx-auto">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#A2C367]">Puntaje de Compliance Estimado</p>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-black italic text-[var(--strong-text)]">{currentScore}</span>
            <span className="text-[var(--muted-foreground)]/40 text-xl font-black">/ 10</span>
          </div>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Objetivo de Visibilidad</p>
          <p className="text-xs font-bold text-[var(--muted-foreground)]/60">
            {products.length < 20 ? `Faltan ${20 - products.length} para máximo nivel` : "¡Catálogo Premium Alcanzado!"}
          </p>
        </div>
      </div>

      <div className="bg-[var(--card)] border-2 border-[var(--border)] p-8 rounded-2xl space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between border-b-2 border-[var(--border)] pb-4 gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--strong-text)] flex items-center gap-2">
              Productos Cargados <span className="bg-[var(--muted)] text-[var(--muted-foreground)] py-1 px-3 rounded-md">{products.length}</span>
            </h3>
            <p className="text-[9px] text-[var(--muted-foreground)] uppercase font-bold tracking-widest">
              Asegúrese de cargar los datos técnicos comerciales correctos para el buscador maestro.
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
            className="flex items-center gap-2 bg-[#A2C367] text-zinc-950 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#b5d677] transition-all shadow-lg disabled:opacity-50"
          >
            <span className="text-lg leading-none">+</span>
            Agregar Nuevo Producto
          </button>
        </div>

        {/* Add Product Form */}
        {isAdding && (
          <div className="bg-[var(--background)] border-2 border-[#A2C367]/50 p-6 md:p-8 rounded-2xl space-y-8 animate-in slide-in-from-top-4 duration-300 shadow-[0_0_30px_rgba(162,195,103,0.1)] relative">
            <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 transition-colors">
              <X size={24} />
            </button>
            
            <div className="border-b border-[var(--border)] pb-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-[#A2C367] flex items-center gap-2">
                <Bot className="w-5 h-5"/> Configuración Técnica del Producto
              </h4>
              <span className="text-[10px] text-[var(--muted-foreground)] italic block mt-1">* Completar los campos con la mayor veracidad técnica posible.</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Bloque Nombre Completo */}
              <div className="md:col-span-4 group">
                <label className="text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-1 ml-1 block">Nombre Comercial / Descripción Corta *</label>
                <input
                  type="text"
                  placeholder="Ej: Motor Trifásico 5HP Alta Eficiencia"
                  className="w-full bg-[var(--input)] border-2 border-[var(--border)] p-4 rounded-xl text-sm font-bold focus:border-[#A2C367] focus:outline-none transition-all placeholder:text-[var(--muted-foreground)]/40"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>

              {/* Sección Códigos y Clasificación */}
              <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div className="group">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-1 ml-1 block cursor-help" title="Manufacturer Part Number">SKU-MPN</label>
                  <input
                    type="text"
                    placeholder="Ref. Fabricante"
                    className="w-full bg-[var(--input)] border border-[var(--border)] p-3 rounded-lg text-xs font-bold focus:border-[#A2C367] focus:outline-none"
                    value={newProduct.skuMPN}
                    onChange={(e) => setNewProduct({ ...newProduct, skuMPN: e.target.value })}
                  />
                </div>
                <div className="group">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1 block">Grupo Gral (GG)</label>
                  <input
                    type="text"
                    placeholder="Ej: Eléctricos"
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs font-bold focus:border-[#A2C367] focus:outline-none"
                    value={newProduct.skuGG}
                    onChange={(e) => setNewProduct({ ...newProduct, skuGG: e.target.value })}
                  />
                </div>
                <div className="group">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1 block">Grupo Específico (GE)</label>
                  <input
                    type="text"
                    placeholder="Ej: Transformadores"
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs font-bold focus:border-[#A2C367] focus:outline-none"
                    value={newProduct.skuGE}
                    onChange={(e) => setNewProduct({ ...newProduct, skuGE: e.target.value })}
                  />
                </div>
                <div className="group">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1 block">Categoría B2B</label>
                  <input
                    type="text"
                    placeholder="Categoría"
                    className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs font-bold focus:border-[#A2C367] focus:outline-none"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  />
                </div>
              </div>

              {/* Fila Comercial 1 */}
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1 block">Marca</label>
                <input
                  type="text"
                  placeholder="Marca"
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs font-bold focus:border-[#A2C367] focus:outline-none"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1 block">Modelo / Serie</label>
                <input
                  type="text"
                  placeholder="Modelo"
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs font-bold focus:border-[#A2C367] focus:outline-none"
                  value={newProduct.model}
                  onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1 block flex justify-between">
                  <span>Precio Referencial (Opcional)</span>
                  <span className="text-emerald-500">USD/PEN</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs font-bold text-emerald-400 focus:border-[#A2C367] focus:outline-none"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1 block">Stock Base / Mínimo</label>
                <input
                  type="number"
                  placeholder="Ej: 100"
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs font-bold focus:border-[#A2C367] focus:outline-none"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                />
              </div>

              {/* Fila Comercial 2 */}
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1 block">Unidad de Medida</label>
                <input
                  type="text"
                  placeholder="PZA, UN, LTR, KG"
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs font-bold focus:border-[#A2C367] focus:outline-none uppercase"
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1 block">Presentación / Empaque</label>
                <input
                  type="text"
                  placeholder="Ej: Caja x 12"
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs font-bold focus:border-[#A2C367] focus:outline-none"
                  value={newProduct.presentation}
                  onChange={(e) => setNewProduct({ ...newProduct, presentation: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1 block">Color Secundario</label>
                <input
                  type="text"
                  placeholder="Ej: Gris Metalizado"
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs font-bold focus:border-[#A2C367] focus:outline-none"
                  value={newProduct.color}
                  onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                />
              </div>
               <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1 block">Material / Aleación</label>
                <input
                  type="text"
                  placeholder="Ej: Aluminio Inox"
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs font-bold focus:border-[#A2C367] focus:outline-none"
                  value={newProduct.material}
                  onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
                />
              </div>

              {/* Fila Técnica Logística */}
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1 block">Dimensiones / Talla</label>
                <input
                  type="text"
                  placeholder="Ej: 10x20x5 cm"
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs font-bold focus:border-[#A2C367] focus:outline-none"
                  value={newProduct.size}
                  onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                />
              </div>
               <div className="group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1 block">Procedencia (País)</label>
                <input
                  type="text"
                  placeholder="País de Fabricación"
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs font-bold focus:border-[#A2C367] focus:outline-none"
                  value={newProduct.origin}
                  onChange={(e) => setNewProduct({ ...newProduct, origin: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1 block">Disponibilidad de Despacho</label>
                <input
                  type="text"
                  placeholder="Ej: Entrega en almacén Ate / Despacho Inmediato"
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs font-bold focus:border-[#A2C367] focus:outline-none"
                  value={newProduct.dispatch}
                  onChange={(e) => setNewProduct({ ...newProduct, dispatch: e.target.value })}
                />
              </div>

              {/* Extras de Logística */}
               <div className="md:col-span-2 group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1 block">Detalle u Observación</label>
                <input
                  type="text"
                  placeholder="Observación importante comercial..."
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs font-bold focus:border-[#A2C367] focus:outline-none"
                  value={newProduct.observations}
                  onChange={(e) => setNewProduct({ ...newProduct, observations: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 group">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1 ml-1 block">Ubicación Física Actual</label>
                <input
                  type="text"
                  placeholder="Domicilio o Almacén"
                  className="w-full bg-[var(--input)] border border-[var(--border)] p-3 rounded-lg text-xs font-bold focus:border-[#A2C367] focus:outline-none text-[var(--foreground)]"
                  value={newProduct.location}
                  onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                />
              </div>

              {/* Subida Multimedia B2B */}
              <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Imagenes */}
                <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#A2C367] flex gap-2 items-center">
                      <ImageIcon className="w-4 h-4"/> Imágenes del Producto
                    </label>
                    <span className="text-[9px] text-zinc-500 font-bold bg-zinc-950 px-2 py-1 rounded">Máx 3</span>
                  </div>
                  <p className="text-[9px] text-zinc-400 mb-4 pr-4 leading-relaxed">
                    Sube buenas fotos referenciales (Max 2MB). No te preocupes por el fondo, la magia de <strong className="text-emerald-400">Inteligencia Artificial B2B</strong> extraerá tu producto puro.
                  </p>
                  <label className="border-2 border-dashed border-[#A2C367]/40 hover:border-[#A2C367] hover:bg-[#A2C367]/5 flex flex-col items-center justify-center p-6 rounded-lg cursor-pointer transition-all bg-zinc-950/50">
                    <UploadCloud className="w-6 h-6 text-[#A2C367] mb-2"/>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest text-center">Seleccionar Imágen</span>
                    {imageError && <span className="text-red-500 text-[9px] mt-2 block">{imageError}</span>}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      multiple 
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.some(f => f.size > 2 * 1024 * 1024)) {
                          setImageError("El peso máximo por imagen es de 2MB");
                          return;
                        }
                        if (files.length > 3) {
                          setImageError("Solo se permiten máximo 3 imágenes");
                          return;
                        }
                        setImageError("");
                        setNewProduct({...newProduct, images: files.map(f => f.name)});
                      }}
                    />
                  </label>
                  {newProduct.images && newProduct.images.length > 0 && (
                     <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                        {newProduct.images.map((img, i) => (
                           <div key={i} className="bg-zinc-800 text-[8px] text-zinc-300 px-2 py-1 rounded border border-zinc-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                              {img}
                           </div>
                        ))}
                     </div>
                  )}
                </div>

                {/* PDFs */}
                <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex gap-2 items-center">
                      <FileText className="w-4 h-4"/> Fichas Técnicas / Certificados
                    </label>
                    <span className="text-[9px] text-zinc-500 font-bold bg-zinc-950 px-2 py-1 rounded">MÁX 3 .PDF</span>
                  </div>
                  <p className="text-[9px] text-zinc-400 mb-4 pr-4 leading-relaxed">
                    Asegura tu confiabilidad empresarial subiendo certificaciones ISO, MTC, Fichas de Seguridad (MSDS) o Manuales de tu producto (Máx 5MB).
                  </p>
                  <label className="border-2 border-dashed border-blue-400/40 hover:border-blue-400 hover:bg-blue-400/5 flex flex-col items-center justify-center p-6 rounded-lg cursor-pointer transition-all bg-zinc-950/50">
                    <UploadCloud className="w-6 h-6 text-blue-400 mb-2"/>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest text-center">Subir Archivo PDF</span>
                    {fileError && <span className="text-red-500 text-[9px] mt-2 block">{fileError}</span>}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf" 
                      multiple 
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.some(f => f.size > 5 * 1024 * 1024)) {
                          setFileError("El peso máximo por PDF es de 5MB");
                          return;
                        }
                        if (files.length > 3) {
                          setFileError("Solo se permiten máximo 3 PDF");
                          return;
                        }
                        setFileError("");
                        setNewProduct({...newProduct, files: files.map(f => f.name)});
                      }}
                    />
                  </label>
                  {newProduct.files && newProduct.files.length > 0 && (
                     <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                        {newProduct.files.map((file, i) => (
                           <div key={i} className="bg-blue-900/30 text-[8px] text-blue-200 px-2 py-1 rounded border border-blue-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                              {file}
                           </div>
                        ))}
                     </div>
                  )}
                </div>
              </div>

              {/* Botones de Estrellato y Certificacion */}
              <div className="md:col-span-4 flex flex-col md:flex-row gap-4 mt-4">
                <label className="flex-1 bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500"
                    checked={newProduct.isCertified}
                    onChange={(e) => setNewProduct({ ...newProduct, isCertified: e.target.checked })}
                  />
                  <div>
                    <span className="block text-xs font-black uppercase tracking-widest text-blue-400 mb-0.5">Normado / Certificado</span>
                    <span className="block text-[9px] text-zinc-500">Mi producto cuenta con estándares certificados de calidad industrial.</span>
                  </div>
                </label>

                <label className="flex-1 bg-zinc-950 border-2 border-dashed border-[#A2C367] p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-[#A2C367]/5 relative overflow-hidden transition-colors">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#A2C367]/30 to-transparent blur-2xl"></div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-[#A2C367] focus:ring-[#A2C367] relative z-10"
                    checked={newProduct.isMostRequested}
                    onChange={(e) => setNewProduct({ ...newProduct, isMostRequested: e.target.checked })}
                  />
                  <div className="relative z-10">
                    <span className="block text-xs font-black uppercase tracking-widest text-[#A2C367] mb-0.5 animate-pulse flex items-center gap-1"><Sparkles className="w-3 h-3"/> MÁS PEDIDO - Producto Estrella</span>
                    <span className="block text-[9px] text-zinc-400">Marque esta casilla para destacar abismalmente este producto en su landing principal.</span>
                  </div>
                </label>
              </div>

            </div>

            <div className="flex gap-4 pt-6 border-t border-[var(--border)]/50">
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 bg-[var(--input)] text-[var(--muted-foreground)] border-2 border-[var(--border)]/50 p-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:text-[var(--strong-text)] transition-all"
              >
                Descartar Cambios
              </button>
              <button
                onClick={addProduct}
                disabled={!newProduct.name}
                className="flex-[2] btn-premium-neon py-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
              >
                <div className="flex flex-col items-center">
                  <span className="text-[10px] opacity-70 mb-0.5 uppercase tracking-widest font-bold">Autorizar y Subir</span>
                  <span className="text-sm font-black">Cargar Producto Industrial</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Lista de Productos Renderizados */}
        <div className="space-y-3">
          {products.length === 0 && !isAdding ? (
            <div className="text-center py-16 bg-[var(--background)] border-2 border-dashed border-[var(--border)] rounded-2xl">
               <Bot className="w-10 h-10 text-[var(--muted-foreground)]/30 mx-auto mb-4" />
               <p className="text-[var(--muted-foreground)]/60 font-bold italic uppercase text-[11px] tracking-widest">
                Catálogo Operativo Vacío.
               </p>
               <p className="text-[var(--muted-foreground)]/40 font-bold uppercase text-[9px] mt-2 mb-6">No se encontraron productos sincronizados.</p>
               <button 
                 onClick={() => setIsSimulatingScrape(true)} 
                 className="bg-[#A2C367]/10 text-[#A2C367] px-6 py-3 rounded-xl border border-[#A2C367]/20 hover:bg-[#A2C367]/20 uppercase text-[10px] font-black tracking-widest flex items-center gap-2 mx-auto transition-all shadow-[0_0_15px_rgba(162,195,103,0.1)]"
               >
                 <Sparkles className="w-4 h-4" /> Forzar Extracción Web IA
               </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p.id} className={`bg-[var(--card)] rounded-xl border ${p.isMostRequested ? 'border-[#A2C367] shadow-[0_0_15px_rgba(162,195,103,0.15)] bg-gradient-to-b from-[var(--background)] to-[#2c3d10]/20' : 'border-[var(--border)]'} relative overflow-hidden transition-all hover:border-[var(--accent)] flex flex-col`}>
                  
                  {p.isMostRequested && (
                    <div className="bg-[#A2C367] text-zinc-950 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 shadow-md w-full">
                      <Sparkles className="w-3 h-3"/> MÁS PEDIDO - Producto Estrella
                    </div>
                  )}
                  
                  <div className="p-4 border-b border-[var(--border)] flex gap-4">
                    <div className={`w-20 h-20 shrink-0 ${p.isMostRequested ? 'bg-[#A2C367]/10 border-[#A2C367]/50 text-[#A2C367]' : 'bg-[var(--muted)] border-[var(--border)] text-[var(--muted-foreground)]'} rounded-lg flex flex-col items-center justify-center font-black text-[9px] uppercase border`}>
                      <span className="opacity-50">CUIM</span>
                      <span className="text-xs">{p.skuCUIM.replace('CUIM-','')}</span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-black text-xs uppercase tracking-tight text-[var(--strong-text)] leading-tight line-clamp-2">{p.name}</h4>
                        <button
                          onClick={() => removeProduct(p.id)}
                          className="text-[var(--muted-foreground)] hover:text-red-500 transition-colors p-1.5 bg-[var(--muted)] rounded-lg border border-[var(--border)]"
                          title="Eliminar producto"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest mt-2">
                        Categoría: <span className="text-[var(--strong-text)]">{p.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-2 flex-1">
                     <div className="text-[9px] uppercase tracking-widest text-[var(--muted-foreground)] font-bold leading-tight">
                        Marca <br/><span className="text-[var(--strong-text)] text-[11px] truncate block pr-2">{p.brand}</span>
                     </div>
                     <div className="text-[9px] uppercase tracking-widest text-[var(--muted-foreground)] font-bold leading-tight">
                        Modelo/Serie <br/><span className="text-[var(--strong-text)] text-[11px] truncate block pr-2">{p.model}</span>
                     </div>
                     <div className="text-[9px] uppercase tracking-widest text-[var(--muted-foreground)] font-bold leading-tight">
                        Ref. Pieza (MPN) <br/><span className="text-[var(--strong-text)] text-[11px] truncate block pr-2">{p.skuMPN}</span>
                     </div>
                     <div className="text-[9px] uppercase tracking-widest text-[var(--muted-foreground)] font-bold leading-tight">
                        Certificado/Norma <br/>
                        {p.isCertified ? <span className="text-blue-400 flex items-center gap-1 mt-0.5"><CheckCircle2 className="w-3 h-3"/> SÍ, Verificado</span> : <span className="text-[var(--muted-foreground)]/40 mt-0.5 block">NO APLICA</span>}
                     </div>
                     <div className="text-[9px] uppercase tracking-widest text-[var(--muted-foreground)] font-bold col-span-2 flex items-center gap-3 border-t border-[var(--border)]/50 pt-3 mt-1">
                        <span className="text-[var(--muted-foreground)]/40 mr-1">Multimedia:</span>
                        {p.images.length > 0 && <span className="text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 shadow-sm"><ImageIcon className="w-3 h-3"/> {p.images.length} IMG</span>}
                        {p.files.length > 0 && <span className="text-blue-400 flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 shadow-sm"><FileText className="w-3 h-3"/> {p.files.length} PDF</span>}
                        {p.images.length === 0 && p.files.length === 0 && <span className="text-zinc-700 italic">Pendiente de subir</span>}
                     </div>
                  </div>

                  <div className="bg-[var(--muted)]/50 border-t border-[var(--border)] p-4 flex justify-between items-center rounded-b-xl">
                      <div>
                         <span className="text-[9px] font-black uppercase text-[var(--muted-foreground)] block mb-1">Stock Base</span>
                         <span className="text-[var(--strong-text)] text-sm font-bold flex items-end gap-1 leading-none">{p.stock} <span className="text-[var(--muted-foreground)] text-[10px] mb-[1px]">{p.unit}</span></span>
                      </div>
                      <div className="text-right">
                         <span className="text-[9px] font-black uppercase text-[var(--muted-foreground)] block mb-1">Precio Referencial</span>
                         <span className="text-[#A2C367] text-xl font-black tracking-tight leading-none">{Number(p.price) > 0 ? `USD ${p.price}` : 'Consultar'}</span>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-center py-5 px-6 bg-[var(--muted)]/40 rounded-xl border border-[var(--border)]/50 my-6 shadow-inner">
        <p className="text-[11px] font-bold text-[var(--muted-foreground)] leading-relaxed max-w-2xl mx-auto">
          <span className="text-[#A2C367] text-lg leading-none align-middle mr-1">*</span> 
          Completa la mayor cantidad de información y productos posibles para asegurar tu máximo puntaje <strong className="text-[var(--strong-text)]">COMPLIANCE</strong>. Un Catálogo detallado proyecta confiabilidad y es clave para <strong className="text-[#A2C367]">Alianzas Estratégicas Sostenibles en el Tiempo</strong>.
        </p>
      </div>

      <div className="flex flex-col gap-5 items-center pt-2 pb-12">
         <button
          onClick={() => onComplete({ products, compliance_score: currentScore, compliance_stars: currentStars })}
          className="w-full max-w-md btn-premium-neon py-6 group relative overflow-hidden ring-4 ring-[#A2C367]/20"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
          <div className="flex flex-col items-center relative z-10">
            <span className="text-[10px] opacity-70 mb-1 tracking-widest uppercase font-black">¡TODO LISTO PARA VENDER!</span>
            <span className="text-2xl font-black italic flex items-center gap-2">
               Activar mi Catálogo Digital <ChevronRight className="w-6 h-6 animate-pulse"/>
            </span>
          </div>
        </button>
        <button
          onClick={onPrev}
          className="text-zinc-600 font-extrabold uppercase tracking-[0.2em] text-[10px] hover:text-[#A2C367] transition-all bg-zinc-900 px-6 py-2 rounded-full border border-zinc-800"
        >
          ← Regresar al Paso Anterior
        </button>
      </div>
    </div>
  );
}
