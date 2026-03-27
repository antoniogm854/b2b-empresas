"use client";

import { useState, useEffect } from "react";
import LayoutClassic from "./LayoutClassic";
import LayoutModern from "./LayoutModern";
import LayoutTechSpec from "./LayoutTechSpec";
import PromotionalBanner from "./PromotionalBanner";
import { DEFAULT_CATALOG_SETTINGS } from "@/lib/constants";
import { analyticsService } from "@/lib/analytics-service";

interface CatalogViewProps {
  tenant: any;
  products: any[];
}

export default function CatalogView({ tenant, products }: CatalogViewProps) {
  // Extract catalog settings or use defaults
  const settings = tenant.catalog_settings || DEFAULT_CATALOG_SETTINGS;

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
      <PromotionalBanner products={products} />
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
