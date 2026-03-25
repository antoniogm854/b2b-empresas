"use client";

import React from "react";
import { X, ShoppingCart, Info, Share2, Star } from "lucide-react";

interface QuickViewProps {
  product: any;
  onClose: () => void;
  onAction?: () => void;
  actionLabel?: string;
}

export default function ProductQuickView({ product, onClose, onAction, actionLabel }: QuickViewProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-primary/20 backdrop-blur-sm animate-fade-in">
      <div 
        className="fixed inset-0 cursor-pointer" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-2xl h-screen bg-background shadow-2xl animate-slide-in-right overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-8 py-6 border-b flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black uppercase tracking-widest bg-accent/20 text-accent px-3 py-1 rounded-full">
              {product.brand || "Estándar Industrial"}
            </span>
            <span className="text-xs font-bold text-muted-foreground">REF: {product.id}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-10">
          {/* Header Image Area */}
          <div className="w-full h-80 bg-muted rounded-[3rem] overflow-hidden flex items-center justify-center relative group">
            <div className="font-black text-muted-foreground text-2xl uppercase opacity-20 group-hover:opacity-40 transition-opacity">
              IMAGEN MAESTRA
            </div>
            <div className="absolute bottom-6 right-6 flex space-x-2">
              <button className="p-3 bg-background rounded-xl shadow-lg hover:scale-110 transition-transform">
                <Share2 size={18} />
              </button>
              <button className="p-3 bg-background rounded-xl shadow-lg hover:scale-110 transition-transform">
                <Star size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-black italic tracking-tightest uppercase">
              {product.custom_name || product.product_name || product.name || "Item Industrial"}
            </h2>
            <p className="text-lg font-medium text-muted-foreground leading-relaxed">
              {product.custom_description || product.description || product.specs || "Especificaciones técnicas completas para aplicaciones industriales de alta exigencia."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 p-6 rounded-3xl border border-muted">
              <p className="text-xs font-black uppercase text-muted-foreground mb-1">Categoría</p>
              <p className="font-bold">{product.category || "General"}</p>
            </div>
            <div className="bg-muted/30 p-6 rounded-3xl border border-muted">
              <p className="text-xs font-black uppercase text-muted-foreground mb-1">Disponibilidad</p>
              <p className="font-bold text-green-500">Stock Inmediato</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-black uppercase tracking-tighter flex items-center">
              <Info size={20} className="mr-2 text-accent" />
              Detalles Técnicos
            </h3>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between py-3 border-b border-muted/50 text-sm">
                  <span className="font-bold text-muted-foreground">Parámetro Industrial #{i}</span>
                  <span className="font-black uppercase tracking-wider">Valor Detallado</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-10 sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent">
            <button 
              onClick={onAction}
              className="w-full bg-primary text-primary-foreground p-6 rounded-[2rem] text-lg font-black uppercase tracking-widest hover:bg-primary/90 hover:scale-[1.01] transition-all shadow-2xl shadow-primary/30 flex items-center justify-center"
            >
              <ShoppingCart className="mr-3" />
              {actionLabel || "Añadir a mi lista"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
