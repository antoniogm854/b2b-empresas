"use client";

import { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  Globe, 
  Save, 
  ShieldCheck
} from "lucide-react";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { companyService } from "@/lib/company-service";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    id: "",
    businessName: "",
    taxId: "",
    category: "",
    bio: "",
    address: "",
    website: "",
    email: "",
    phone: "",
    slug: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: "", type: "" });
  const [coords, setCoords] = useState({ lat: -12.046374, lng: -77.042793 }); // Lima default
  const [isMapping, setIsMapping] = useState(false);
  
  const searchParams = useSearchParams();
  const isNewUser = searchParams.get("new") === "true";

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        const ownerId = '00000000-0000-0000-0000-000000000000'; // Simulation
        
        const { data: companies, error } = await supabase
          .from('companies')
          .select('*')
          .eq('owner_id', ownerId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (companies && companies.length > 0) {
          const company = companies[0];
          setFormData({
            id: company.id,
            businessName: company.name?.startsWith('Empresa ') ? '' : (company.name || ""),
            taxId: company.tax_id || '',
            category: company.industry || '',
            bio: company.description || '',
            address: company.address || '',
            website: company.website || '',
            email: company.email_corporate || '',
            phone: company.phone_whatsapp || '',
            slug: company.slug || ""
          });
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage({ text: "Guardando...", type: "info" });

      await companyService.updateCompany(formData.id, {
        name: formData.businessName,
        tax_id: formData.taxId,
        description: formData.bio,
        industry: formData.category,
        address: formData.address,
        website: formData.website,
        email_corporate: formData.email,
        phone_whatsapp: formData.phone,
        slug: formData.slug
      });

      setSaveMessage({ text: "¡Perfil actualizado con éxito!", type: "success" });
      setTimeout(() => setSaveMessage({ text: "", type: "" }), 3000);
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setSaveMessage({ text: `Error: ${err.message}`, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tightest uppercase italic">Perfil de Empresa</h1>
          <p className="text-muted-foreground font-semibold mt-2">Gestiona tu identidad corporativa y datos comerciales.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-4 border-accent border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Save size={20} className="mr-2" />
          )}
          {isSaving ? "Guardando" : "Guardar Cambios"}
        </button>
      </div>

      {saveMessage.text && (
        <div className={`p-4 rounded-2xl font-black uppercase text-xs tracking-widest animate-reveal flex items-center gap-3 ${
          saveMessage.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
          saveMessage.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
          'bg-accent/10 text-accent border border-accent/20'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            saveMessage.type === 'success' ? 'bg-green-500' : 
            saveMessage.type === 'error' ? 'bg-red-500' : 
            'bg-accent'
          }`} />
          {saveMessage.text}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-accent rounded-full animate-spin" />
          <p className="font-black uppercase tracking-widest text-muted-foreground animate-pulse">Cargando Datos Maestros...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-background p-10 rounded-[3rem] border-2 border-muted/50 space-y-8">
              <div className="flex items-center space-x-4 mb-4">
                <Building2 className="text-accent" size={32} />
                <h2 className="text-2xl font-black uppercase italic">Datos Generales</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Nombre Comercial {isNewUser && <span className="text-accent italic animate-pulse">(Requerido para activar catálogo)</span>}</label>
                  <input 
                    type="text" 
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    placeholder="Ej: Distribuidora Maya Industrial"
                    className={`w-full bg-muted/30 border-2 p-4 rounded-2xl font-bold transition-all outline-none ${
                      isNewUser && !formData.businessName ? 'border-accent/50 animate-pulse' : 'border-transparent focus:border-accent'
                    }`}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">RUC / Registro</label>
                  <input 
                    type="text" 
                    value={formData.taxId}
                    readOnly
                    className="w-full bg-muted/30 border-2 border-transparent p-4 rounded-2xl font-bold transition-all outline-none opacity-80"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">URL / Slug de Catálogo</label>
                  <input 
                    type="text" 
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                    className={`w-full bg-muted/30 border-2 p-4 rounded-2xl font-bold transition-all outline-none ${
                      isNewUser && formData.slug.startsWith('ruc-') ? 'border-accent/50' : 'border-transparent focus:border-accent'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Categoría Industrial</label>
                  <input 
                    type="text" 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-muted/30 border-2 border-transparent focus:border-accent p-4 rounded-2xl font-bold transition-all outline-none"
                    placeholder="Ej: Suministros Eléctricos"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Bio Industrial</label>
                  <textarea 
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Describe la especialidad de tu empresa..."
                    className="w-full bg-muted/30 border-2 border-transparent focus:border-accent p-4 rounded-2xl font-bold transition-all outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-background p-10 rounded-[3rem] border-2 border-muted/50 space-y-8">
              <div className="flex items-center space-x-4 mb-4">
                <MapPin className="text-accent" size={32} />
                <h2 className="text-2xl font-black uppercase italic">Ubicación y Contacto</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Dirección Fiscal / Comercial</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full bg-muted/30 border-2 border-transparent focus:border-accent p-4 rounded-2xl font-bold transition-all outline-none pr-12"
                    />
                    <MapPin className="absolute right-4 top-4 text-muted-foreground" size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Email Corporativo</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-muted/30 border-2 border-transparent focus:border-accent p-4 rounded-2xl font-bold transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Teléfono de Contacto</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-muted/30 border-2 border-transparent focus:border-accent p-4 rounded-2xl font-bold transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Simulated Map Selector */}
            <div className="bg-background p-10 rounded-[3rem] border-2 border-muted/50 space-y-8 overflow-hidden relative">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <Globe className="text-accent" size={32} />
                  <h2 className="text-2xl font-black uppercase italic">Geolocalización Industrial</h2>
                </div>
              </div>

              <div 
                className="relative w-full h-[300px] bg-slate-900 rounded-[2.5rem] overflow-hidden cursor-crosshair group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width;
                  const y = (e.clientY - rect.top) / rect.height;
                  setCoords({
                    lat: -12.046374 + (0.5 - y) * 0.1,
                    lng: -77.042793 + (x - 0.5) * 0.1
                  });
                  setIsMapping(true);
                  setTimeout(() => setIsMapping(false), 1000);
                }}
              >
                <div className="absolute inset-0 opacity-20 pointer-events-none" 
                     style={{backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
                
                <div 
                  className={`absolute w-12 h-12 -ml-6 -mt-12 flex items-center justify-center`}
                  style={{ left: '50%', top: '50%' }}
                >
                  <MapPin className="text-accent fill-accent/20 animate-bounce" size={48} />
                </div>

                {isMapping && (
                  <div className="absolute inset-0 flex items-center justify-center bg-accent/10 backdrop-blur-[2px]">
                    <p className="bg-background px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs">Ubicación Fijada</p>
                  </div>
                )}
              </div>
              
              <p className="text-center text-[10px] font-bold text-muted-foreground italic">
                Haz clic en el mapa para posicionar tu planta o almacén principal.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary text-primary-foreground p-10 rounded-[3rem] space-y-6 relative overflow-hidden">
              <ShieldCheck size={64} className="text-accent mb-4" />
              <h3 className="text-2xl font-black uppercase italic leading-tight">Estado de Verificación</h3>
              <div className="flex items-center space-x-2 bg-white/10 p-4 rounded-2xl border border-white/20">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                <p className="text-sm font-black uppercase tracking-widest">En Revisión</p>
              </div>
              <p className="text-sm font-medium text-primary-foreground/70">
                Perfil validado automáticamente para catálogos iniciales. Activa el motor de proximidad completando tu dirección.
              </p>
            </div>

            <div className="bg-background p-10 rounded-[3rem] border-2 border-muted/50">
              <ImageUpload 
                label="Logotipo Corporativo"
                description="Sube el logo de tu catálogo digital (PNG/JPG)"
                onUpload={(url) => {}}
                maxSizeMB={1}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
