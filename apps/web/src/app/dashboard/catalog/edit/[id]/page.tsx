"use client";

import { use, useState } from "react";
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Package, 
  Globe, 
  Smartphone, 
  QrCode, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle2,
  Info,
  Tag,
  AlertTriangle,
  FileText
} from "lucide-react";
import { formatCurrency } from "@/lib/currency-utils";
import Link from "next/link";

export default function InventoryEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // Simulated product data (would be fetched by ID using the unwrapped id)
  const [product, setProduct] = useState({
    id: id,
    name: "Motor Eléctrico Trifásico 10HP",
    brand: "Siemens",
    originalPrice: 1200,
    price: 1200,
    stock: 5,
    description: "Motor de alta eficiencia para aplicaciones industriales pesadas. IP55, 1750 RPM.",
    customDescription: "",
    status: "active",
    isPublic: true,
    allowWhatsappQuotes: true,
    hasQrCode: false
  });

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/catalog" className="p-3 bg-muted rounded-2xl hover:bg-accent hover:text-accent-foreground transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-4xl font-black tracking-tightest uppercase italic">Editar Producto</h1>
            <p className="text-muted-foreground font-semibold">Personaliza los detalles comerciales del item GCM.</p>
          </div>
        </div>
        <button className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center hover:scale-105 transition-all shadow-xl shadow-primary/20">
          <Save size={20} className="mr-2" />
          Actualizar Item
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Form */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-background p-10 rounded-[3rem] border-2 border-muted/50 space-y-8">
            <div className="flex items-center space-x-4">
              <Package className="text-accent" size={28} />
              <h2 className="text-2xl font-black uppercase italic">Detalles de Inventario</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Precio de Venta ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black">
                    S/
                  </span>
                  <input
                    type="number"
                    value={product?.price}
                    className="w-full bg-muted/50 border-none rounded-2xl py-4 pl-12 pr-4 font-black"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground ml-2 italic">Precio base GCM: {formatCurrency(product.originalPrice)}</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Stock Disponible</label>
                <input 
                  type="number" 
                  value={product.stock}
                  className="w-full bg-muted/30 border-2 border-transparent focus:border-accent p-4 rounded-2xl font-black transition-all outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Descripción Comercial (Personalizada)</label>
                <textarea 
                  rows={4}
                  placeholder="Ej: Entrega inmediata en Lima Metropolitana. Incluye garantía de 2 años."
                  className="w-full bg-muted/30 border-2 border-transparent focus:border-accent p-6 rounded-3xl font-bold transition-all outline-none resize-none"
                />
                <p className="text-[10px] font-bold text-muted-foreground ml-2 flex items-center">
                  <Info size={12} className="mr-1" />
                  Si se deja en blanco, se usará la descripción técnica del GCM.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background p-10 rounded-[3rem] border-2 border-muted/50 space-y-8">
            <div className="flex items-center space-x-4">
              <Tag className="text-accent" size={28} />
              <h2 className="text-2xl font-black uppercase italic">Visibilidad</h2>
            </div>
            
            <div className="flex items-center justify-between p-6 bg-muted/30 rounded-3xl border-2 border-transparent hover:border-accent transition-all">
              <div>
                <p className="font-black text-lg">Estado del Producto</p>
                <p className="text-sm font-bold text-muted-foreground">Ocultar o mostrar este item en tu catálogo público.</p>
              </div>
              <div className="w-16 h-8 bg-accent rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preview & Source Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] border-2 border-muted space-y-6">
            <h3 className="font-black uppercase italic flex items-center">
              <FileText className="mr-2 text-accent" size={20} />
              Datos del GCM
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted/20 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-muted-foreground">Marca</p>
                <p className="font-black">{product.brand}</p>
              </div>
              <div className="p-4 bg-muted/20 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-muted-foreground">Especificación Técnica</p>
                <p className="text-xs font-bold leading-relaxed">{product.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-8 rounded-[3rem] border-2 border-amber-200 space-y-4">
            <div className="flex items-center text-amber-600 space-x-2">
              <AlertTriangle size={24} />
              <h4 className="font-black uppercase text-sm">Control de Calidad</h4>
            </div>
            <p className="text-xs font-bold text-amber-800 leading-relaxed">
              Recuerda que los cambios en el precio afectan directamente a las solicitudes de cotización generadas desde el CATÁLOGO DIGITAL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
