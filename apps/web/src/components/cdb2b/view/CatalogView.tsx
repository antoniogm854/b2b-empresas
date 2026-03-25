"use client";

import { useState, useEffect } from "react";
import LayoutClassic from "./LayoutClassic";
import LayoutModern from "./LayoutModern";
import LayoutTechSpec from "./LayoutTechSpec";
import { analyticsService } from "@/lib/analytics-service";

interface CatalogViewProps {
  tenant: any;
  products: any[];
}

export default function CatalogView({ tenant, products }: CatalogViewProps) {
  // Extract catalog settings or use defaults
  const settings = tenant.catalog_settings || {
    template_id: "classic",
    theme: {
      primary: "#4B6319",
      secondary: "#A2C367",
      font_family: "Inter",
      font_size: "medium"
    },
    content: {
      slogan: tenant.description || "Soluciones Industriales de Alto Impacto",
      featured_info: tenant.sector || "Suministro Global B2B",
      show_promo_section: true,
      whatsapp_button: true
    }
  };

  useEffect(() => {
    if (tenant.id) {
      analyticsService.trackCatalogView(tenant.id);
    }
  }, [tenant.id]);

  const template = settings.template_id || "classic";
  
  const renderLayout = () => {
    switch (template) {
      case "classic":
        return <LayoutClassic tenant={tenant} products={products} settings={settings} />;
      case "tech_spec":
        return <LayoutTechSpec tenant={tenant} products={products} settings={settings} />;
      case "modern":
      default:
        // Default to Classic as per the latest "Industrial Premium" standard (v6.0)
        return <LayoutClassic tenant={tenant} products={products} settings={settings} />;
    }
  };

  return (
    <div 
      className="min-h-screen bg-background text-foreground transition-all duration-500"
      style={{ fontFamily: settings.theme?.font_family || 'Inter' }}
    >
      {renderLayout()}
      
      {/* Branding B2B Empresas */}
      <footer className="py-8 bg-zinc-950 text-center border-t border-zinc-900 relative z-20">
         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
           Potenciado por <span className="text-emerald-500">B2B Empresas</span> © {new Date().getFullYear()}
         </p>
      </footer>
    </div>
  );
}
