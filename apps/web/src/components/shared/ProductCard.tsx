import React from 'react';
import Image from 'next/image';
import { CheckCircle, ShieldCheck } from 'lucide-react';

export interface ProductMaster {
  id: string;
  sku_cuim: string;
  sku_gg: string;
  sku_ge: string;
  product_name: string;
  brand: string;
  is_certified: boolean;
  is_example: boolean;
  image_url_1?: string;
}

export default function ProductCard({ product }: { product: ProductMaster }) {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden relative group h-full flex flex-col">
      {/* Badges Flotantes */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.is_example && (
          <div className="bg-[#A2C367] text-[#2E3D10] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">
            Producto Ejemplo
          </div>
        )}
        {product.is_certified && (
          <div className="bg-[#4B6319] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md flex items-center gap-1">
            <ShieldCheck size={10} /> Certificado
          </div>
        )}
      </div>

      {/* Imagen */}
      <div className="w-full h-48 bg-gray-50 relative overflow-hidden flex items-center justify-center p-6 border-b border-gray-100">
        {product.image_url_1 ? (
          <Image 
            src={product.image_url_1} 
            alt={product.product_name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500 py-4 px-4"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 font-black uppercase tracking-widest text-xs">
            Sin Imagen
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex gap-2 mb-2">
          <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
            {product.sku_gg}
          </span>
          <span className="text-[10px] font-black text-[#A2C367] bg-[#F5F5F5] px-2 py-0.5 rounded border border-[#A2C367]/20">
            {product.sku_ge}
          </span>
        </div>

        <h4 className="font-bold text-gray-900 leading-tight mb-2 line-clamp-2 hover:text-[#4B6319] transition-colors cursor-pointer">
          {product.product_name}
        </h4>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Marca</span>
            <span className="text-sm font-black text-[#2E3D10]">{product.brand}</span>
          </div>
          {product.sku_cuim && (
            <div className="text-right flex flex-col">
              <span className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">CUIM B2B</span>
              <span className="text-xs font-mono font-bold text-gray-600">{product.sku_cuim}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
