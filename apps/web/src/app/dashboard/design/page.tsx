"use client";

import { useState } from "react";
import { 
  Palette, 
  Layout, 
  Smartphone, 
  Monitor, 
  Check, 
  Upload,
  Save,
  RefreshCw,
  Eye
} from "lucide-react";
import { ImageUpload } from "@/components/dashboard/ImageUpload";

export default function DesignPage() {
  const [primaryColor, setPrimaryColor] = useState("#0f172a");
  const [accentColor, setAccentColor] = useState("#eab308");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-primary mb-2">Personalización PWA</h1>
          <p className="text-muted-foreground font-bold">Define la identidad visual de tu plataforma B2B</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
          <span>{isSaving ? "Guardando..." : "Guardar Cambios"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Editor */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] border-2 border-muted shadow-sm">
            <h2 className="text-xl font-black mb-6 flex items-center space-x-2">
              <Palette className="text-accent" />
              <span>Colores Corporativos</span>
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-sm">Color Primario</p>
                  <p className="text-xs text-muted-foreground font-bold">Navegación y botones principales</p>
                </div>
                <input 
                  type="color" 
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-12 rounded-xl border-none cursor-pointer bg-transparent"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-sm">Color de Acento</p>
                  <p className="text-xs text-muted-foreground font-bold">Detalles, estados y énfasis</p>
                </div>
                <input 
                  type="color" 
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-12 h-12 rounded-xl border-none cursor-pointer bg-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border-2 border-muted shadow-sm">
            <ImageUpload 
              label="Logotipo PWA"
              description="Sube tu logo (512x512px recomendado)"
              onUpload={(url: string) => {}}
              maxSizeMB={2}
            />
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 bg-muted/30 rounded-[4rem] p-10 border-4 border-white shadow-inner">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-sm flex items-center space-x-2">
                <Eye size={16} />
                <span>Vista Previa en Tiempo Real</span>
              </h3>
              <div className="flex bg-white rounded-full p-1 border shadow-sm">
                <button className="p-2 bg-muted rounded-full"><Smartphone size={16} /></button>
                <button className="p-2 text-muted-foreground"><Monitor size={16} /></button>
              </div>
            </div>

            {/* Simulated App Wrapper */}
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-muted aspect-[9/16] max-w-[320px] mx-auto relative group">
              {/* Simulated Sidebar */}
              <div 
                className="absolute top-0 left-0 bottom-0 w-16 flex flex-col items-center py-6 space-y-4 transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-3 pt-6">
                  <div className="w-8 h-8 bg-accent rounded-lg" style={{ backgroundColor: accentColor }} />
                  <div className="w-8 h-8 bg-white/10 rounded-lg" />
                  <div className="w-8 h-8 bg-white/10 rounded-lg" />
                </div>
              </div>
              
              {/* Content Area */}
              <div className="pl-20 pr-6 py-8">
                <div className="h-4 w-24 bg-muted rounded-full mb-6" />
                <div className="h-40 w-full bg-muted rounded-[2rem] mb-6" />
                <div className="h-3 w-full bg-muted rounded-full mb-2" />
                <div className="h-3 w-4/5 bg-muted rounded-full mb-8" />
                
                <button 
                  className="w-full py-4 rounded-xl text-xs font-black text-white shadow-lg transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  ACCIÓN PRINCIPAL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
