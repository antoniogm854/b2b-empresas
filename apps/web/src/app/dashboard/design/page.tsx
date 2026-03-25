"use client";

import { useState, useEffect } from "react";
import { 
  Palette, 
  Layout, 
  Smartphone, 
  Monitor, 
  Check, 
  Upload,
  Save,
  RefreshCw,
  Eye,
  Type,
  LayoutGrid,
  Zap,
  Plus,
  MessageCircle,
  Building2,
  Trash2,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { companyService, Tenant } from "@/lib/company-service";
import { authService } from "@/lib/auth-service";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import LayoutClassic from "@/components/cdb2b/view/LayoutClassic";
import LayoutModern from "@/components/cdb2b/view/LayoutModern";
import LayoutTechSpec from "@/components/cdb2b/view/LayoutTechSpec";

// Google Fonts Options
const FONT_OPTIONS = [
  { id: 'Inter', name: 'Inter (Modern)' },
  { id: 'Outfit', name: 'Outfit (Geometric)' },
  { id: 'Roboto', name: 'Roboto (Technical)' },
  { id: 'Montserrat', name: 'Montserrat (Bold)' },
  { id: 'Exo 2', name: 'Exo 2 (Futuristic)' },
  { id: 'Space Grotesk', name: 'Space Grotesk (Tech)' },
];

const COLOR_PRESETS = [
  { name: 'Classic Industrial', primary: '#4B6319', secondary: '#A2C367' },
  { name: 'Steel Blue', primary: '#1E3A8A', secondary: '#60A5FA' },
  { name: 'Engine Red', primary: '#991B1B', secondary: '#F87171' },
  { name: 'Deep Carbon', primary: '#111827', secondary: '#9CA3AF' },
  { name: 'Forest Green', primary: '#064E3B', secondary: '#10B981' },
  { name: 'Golden Hazard', primary: '#78350F', secondary: '#FBBF24' },
];

const TEMPLATES = [
  { id: 'classic', name: 'Classic Industrial', description: 'Estructura sólida y profesional, ideal para distribución masiva.' },
  { id: 'modern', name: 'Modern Premium', description: 'Enfoque visual con grandes héroes y micro-interacciones.' },
  { id: 'tech_spec', name: 'Tech Precision', description: 'Orientado a especificaciones técnicas y listados de precisión.' },
];

export default function DesignPage() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activePreview, setActivePreview] = useState<'mobile' | 'desktop'>('mobile');

  // Local state for edits
  const [settings, setSettings] = useState({
    template_id: "classic",
    theme: {
      primary: "#4B6319",
      secondary: "#A2C367",
      font_family: "Inter",
      font_size: "medium"
    },
    content: {
      slogan: "Soluciones Industriales de Alto Impacto",
      featured_info: "Suministro Global B2B",
      logo_name_url: null as string | null,
      show_promo_section: true,
      whatsapp_button: true
    }
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const user = await authService.getCurrentUser();
        if (user && user.email) {
          const tenantData = await companyService.getTenantByUserEmail(user.email);
          if (tenantData) {
            setTenant(tenantData);
            if (tenantData.catalog_settings) {
              setSettings({
                ...settings,
                ...tenantData.catalog_settings,
                theme: { ...settings.theme, ...tenantData.catalog_settings.theme },
                content: { ...settings.content, ...tenantData.catalog_settings.content }
              });
            }
          }
        }
      } catch (error) {
        console.error("Error loading design settings:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    if (!tenant) return;
    setIsSaving(true);
    try {
      await companyService.updateTenant(tenant.id, {
        catalog_settings: settings
      });
      alert("¡Diseño de Catálogo Actualizado Exitosamente!");
    } catch (error) {
      console.error("Error saving design:", error);
      alert("Error al guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-32 space-y-6">
        <RefreshCw className="w-12 h-12 text-[var(--primary)] animate-spin" />
        <p className="font-black uppercase tracking-widest text-zinc-500 animate-pulse">Cargando Motor de Diseño...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in-up pb-20 relative font-sans">
      {/* Background B2B subtle */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-[-1]" style={{ backgroundImage: 'url("/b2b_profile_bg.png")', backgroundSize: 'cover' }} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-[var(--strong-text)]">
            Diseño de Pagina
          </h1>
          <p className="text-[var(--muted-foreground)] font-bold uppercase tracking-widest text-[10px] mt-2">
            Reingeniería de Identidad Digital y Vitrina Industrial - Modelo Base: Classic Industrial
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[var(--primary)] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center shadow-xl shadow-[var(--primary)]/20 hover:scale-105 transition-all disabled:opacity-50"
        >
          {isSaving ? <RefreshCw size={18} className="animate-spin mr-3" /> : <Save size={18} className="mr-3" />}
          {isSaving ? "Sincronizando..." : "Publicar Cambios"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Editor Panel */}
        <div className="xl:col-span-5 space-y-10">
          
          {/* 1. SELECCIÓN DE MODELO */}
          <section className="bg-white/70 backdrop-blur-md p-10 rounded-[3rem] border border-zinc-200/50 shadow-xl space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-3">
              <LayoutGrid size={24} className="text-[var(--primary)]" />
              1. Seleccionar Modelo
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSettings({...settings, template_id: tpl.id})}
                  className={`p-6 rounded-2xl border-2 text-left transition-all relative group overflow-hidden ${
                    settings.template_id === tpl.id 
                    ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-md" 
                    : "border-zinc-100 bg-white hover:border-zinc-300"
                  }`}
                >
                  {settings.template_id === tpl.id && (
                    <div className="absolute top-4 right-4 text-[var(--primary)]">
                      <CheckCircle2 size={24} />
                    </div>
                  )}
                  <h3 className="font-black uppercase text-xs tracking-widest mb-2 group-hover:text-[var(--primary)] transition-colors">{tpl.name}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold leading-relaxed">{tpl.description}</p>
                </button>
              ))}
            </div>
          </section>

          {/* 2. ESTILO & TIPOGRAFÍA */}
          <section className="bg-white/70 backdrop-blur-md p-10 rounded-[3rem] border border-zinc-200/50 shadow-xl space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-3">
              <Palette size={24} className="text-[var(--primary)]" />
              2. Paleta & Tipografía
            </h2>
            <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Predeterminados Industriales (Presets)</label>
                  <div className="grid grid-cols-2 gap-4">
                    {COLOR_PRESETS.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => setSettings({
                          ...settings, 
                          theme: { ...settings.theme, primary: p.primary, secondary: p.secondary }
                        })}
                        className={`group flex flex-col items-center gap-3 p-4 rounded-3xl border-2 transition-all bg-white ${
                          settings.theme.primary === p.primary ? "border-[var(--primary)] shadow-md" : "border-zinc-100 hover:border-zinc-300"
                        }`}
                      >
                        <div className="flex w-full h-12 rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
                           <div className="flex-1" style={{ backgroundColor: p.primary }} />
                           <div className="flex-1" style={{ backgroundColor: p.secondary }} />
                        </div>
                        <div className="flex flex-col items-center gap-1 w-full">
                           <span className="text-[9px] font-black uppercase tracking-widest truncate">{p.name}</span>
                           <div className="flex gap-2 text-[7px] font-mono font-bold text-zinc-400 uppercase">
                              <span>{p.primary}</span>
                              <span className="opacity-30">|</span>
                              <span>{p.secondary}</span>
                           </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Fuente de Texto (DIGITAR CATALOGO)</label>
                  <div className="grid grid-cols-2 gap-3">
                  {FONT_OPTIONS.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setSettings({...settings, theme: {...settings.theme, font_family: f.id}})}
                      className={`p-4 rounded-xl border-2 text-[10px] font-black uppercase transition-all ${
                        settings.theme.font_family === f.id ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-zinc-100 hover:border-zinc-200"
                      }`}
                      style={{ fontFamily: f.id }}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 3. LOGOS & CONTENIDO */}
          <section className="bg-white/70 backdrop-blur-md p-10 rounded-[3rem] border border-zinc-200/50 shadow-xl space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-3">
              <Building2 size={24} className="text-[var(--primary)]" />
              3. Imagen Corporativa
            </h2>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-4 block">Logotipo Corporativo</label>
                   <div className="w-full aspect-square bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 flex items-center justify-center p-6 relative overflow-hidden group">
                      {tenant?.logo_url ? (
                        <div className="relative w-full h-full">
                          <img src={tenant.logo_url} alt="Logo" className="w-full h-full object-contain" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Trash2 className="text-white cursor-pointer" onClick={() => {}} />
                          </div>
                        </div>
                      ) : (
                        <Upload className="text-zinc-300" size={32} />
                      )}
                   </div>
                </div>
                <div>
                   <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-4 block">Logo Nombre / Marca</label>
                   <div className="w-full aspect-square bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 flex items-center justify-center p-6 relative overflow-hidden group">
                      {settings.content.logo_name_url ? (
                        <div className="relative w-full h-full">
                          <img src={settings.content.logo_name_url} alt="Logo Name" className="w-full h-full object-contain" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Trash2 className="text-white cursor-pointer" onClick={() => setSettings({...settings, content: {...settings.content, logo_name_url: null}})} />
                          </div>
                        </div>
                      ) : (
                        <Upload className="text-zinc-300" size={32} />
                      )}
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Eslógan / Frase de Cabecera</label>
                  <input 
                    type="text" 
                    value={settings.content.slogan}
                    onChange={(e) => setSettings({...settings, content: {...settings.content, slogan: e.target.value}})}
                    placeholder="Ej. Precision en Ingeniería"
                    className="w-full bg-white border border-zinc-200 p-5 rounded-2xl font-bold text-sm outline-none focus:border-[var(--primary)] transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Información Resaltante (Featured Info)</label>
                  <input 
                    type="text" 
                    value={settings.content.featured_info}
                    onChange={(e) => setSettings({...settings, content: {...settings.content, featured_info: e.target.value}})}
                    className="w-full bg-white border border-zinc-200 p-5 rounded-2xl font-bold text-sm outline-none focus:border-[var(--primary)] transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 4. SECCIONES & FUNCIONES */}
          <section className="bg-white/70 backdrop-blur-md p-10 rounded-[3rem] border border-zinc-200/50 shadow-xl space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-3">
              <Zap size={24} className="text-[var(--primary)]" />
              4. Secciones & Atajos
            </h2>
            
            <div className="space-y-4">
               <button 
                onClick={() => setSettings({...settings, content: {...settings.content, show_promo_section: !settings.content.show_promo_section}})}
                className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                  settings.content.show_promo_section ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-zinc-100"
                }`}
               >
                  <div className="flex items-center gap-4 text-left">
                     <div className={`p-3 rounded-xl ${settings.content.show_promo_section ? "bg-[var(--primary)] text-white" : "bg-zinc-100 text-zinc-400"}`}>
                        <Sparkles size={18} />
                     </div>
                     <div>
                        <p className="font-black uppercase text-[10px] tracking-widest">Sección "PRODUCTOS EN PROMOCIÓN"</p>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">Activa vitrina de ofertas resaltada</p>
                     </div>
                  </div>
                  {settings.content.show_promo_section && <CheckCircle2 size={24} className="text-[var(--primary)]" />}
               </button>

               <button 
                onClick={() => setSettings({...settings, content: {...settings.content, whatsapp_button: !settings.content.whatsapp_button}})}
                className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                  settings.content.whatsapp_button ? "border-green-500 bg-green-500/5" : "border-zinc-100"
                }`}
               >
                  <div className="flex items-center gap-4 text-left">
                     <div className={`p-3 rounded-xl ${settings.content.whatsapp_button ? "bg-green-500 text-white" : "bg-zinc-100 text-zinc-400"}`}>
                        <MessageCircle size={18} />
                     </div>
                     <div>
                        <p className="font-black uppercase text-[10px] tracking-widest">Botón Flotante WhatsApp</p>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">Vinculado al Teléfono Comercial</p>
                     </div>
                  </div>
                  {settings.content.whatsapp_button && <CheckCircle2 size={24} className="text-green-500" />}
               </button>
            </div>
          </section>
        </div>

        {/* Live Preview Panel */}
        <div className="xl:col-span-7">
          <div className="sticky top-10 space-y-6">
            <div className="bg-zinc-900 rounded-[3.5rem] p-10 border border-zinc-800 shadow-2xl overflow-hidden relative group">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-[var(--primary)] rounded-full animate-pulse" />
                  <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic flex items-center gap-2">
                    <Smartphone size={16} className="text-[var(--primary)]" />
                    Vista Previa en Tiempo Real
                  </h3>
                </div>
                <div className="flex gap-2 p-1 bg-black/40 border border-zinc-800 rounded-xl">
                  <button 
                    onClick={() => setActivePreview('mobile')}
                    className={`p-2.5 rounded-lg transition-all ${activePreview === 'mobile' ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400"}`}
                  >
                    <Smartphone size={18} />
                  </button>
                  <button 
                    onClick={() => setActivePreview('desktop')}
                    className={`p-2.5 rounded-lg transition-all ${activePreview === 'desktop' ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400"}`}
                  >
                    <Monitor size={18} />
                  </button>
                </div>
              </div>

              {/* Simulación Real Completa del Catálogo Digital */}
              <div 
                className={`mx-auto bg-white rounded-[2.5rem] border-[8px] border-zinc-800 shadow-inner shadow-black/40 overflow-hidden relative transition-all duration-700 font-sans ${activePreview === 'mobile' ? "max-w-[340px] aspect-[9/18.5]" : "max-w-full aspect-video"}`} 
                style={{ fontFamily: settings.theme.font_family, fontSize: '0.5rem' }}
              >
                <div className="absolute inset-0 origin-top scale-[0.35] w-[285%] h-[285%] overflow-auto hide-scrollbar">
                  {settings.template_id === 'classic' && (
                    <LayoutClassic 
                      tenant={tenant} 
                      products={[
                        { id: '1', custom_name: 'Válvula de Control NX', unit_price: '450.00', images: [], is_most_requested: true, brand: 'Industrial' },
                        { id: '2', custom_name: 'Motor Trifásico 5HP', unit_price: '1200.00', images: [], is_most_requested: false, brand: 'Siemens' },
                        { id: '3', custom_name: 'Empaquetadura Kevlar', unit_price: '25.00', images: [], is_most_requested: false, brand: 'Safe' },
                      ]} 
                      settings={settings} 
                    />
                  )}
                  {settings.template_id === 'modern' && (
                    <LayoutModern 
                      tenant={tenant} 
                      products={[
                        { id: '1', custom_name: 'Válvula de Control NX', unit_price: '450.00', images: [], is_most_requested: true, brand: 'Industrial' },
                        { id: '2', custom_name: 'Motor Trifásico 5HP', unit_price: '1200.00', images: [], is_most_requested: false, brand: 'Siemens' },
                        { id: '3', custom_name: 'Empaquetadura Kevlar', unit_price: '25.00', images: [], is_most_requested: false, brand: 'Safe' },
                      ]} 
                      settings={settings} 
                    />
                  )}
                  {settings.template_id === 'tech_spec' && (
                    <LayoutTechSpec 
                      tenant={tenant} 
                      products={[
                        { id: '1', custom_name: 'Válvula de Control NX', unit_price: '450.00', images: [], is_most_requested: true, brand: 'Industrial' },
                        { id: '2', custom_name: 'Motor Trifásico 5HP', unit_price: '1200.00', images: [], is_most_requested: false, brand: 'Siemens' },
                        { id: '3', custom_name: 'Empaquetadura Kevlar', unit_price: '25.00', images: [], is_most_requested: false, brand: 'Safe' },
                      ]} 
                      settings={settings} 
                    />
                  )}
                </div>
              </div>
              
              <div className="mt-8 p-10 bg-[var(--deep-section)]/30 rounded-[2.5rem] border border-white/5 space-y-4">
                 <h4 className="font-black uppercase text-[10px] tracking-widest text-emerald-500 mb-2">Consejo PWA Premium</h4>
                 <p className="text-zinc-500 text-[10px] font-medium leading-relaxed">
                   Use colores que contrasten bien entre sí. El color primario se usa en cabeceras y botones principales, mientras que el color de acento es ideal para llamadas a la acción discretas y estados de éxito.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
