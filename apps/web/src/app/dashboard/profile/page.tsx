"use client";

import { Suspense, useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  Globe, 
  Save, 
  ShieldCheck,
  Loader2
} from "lucide-react";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { companyService } from "@/lib/company-service";
import { authService } from "@/lib/auth-service";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function ProfileContent() {
  const [formData, setFormData] = useState({
    id: "",
    businessName: "",
    trade_name: "",
    taxId: "",
    category: "",
    activityMain: "",
    activitySec1: "",
    activitySec2: "",
    bio: "",
    address: "",
    fiscal_address: "",
    website: "",
    email: "",
    phone_prefix: "+51",
    phone_number: "",
    phone_commercial_prefix: "+51",
    phone_commercial_number: "",
    contact_name: "",
    slug: "",
    logo_url: "",
    fecha_inicio: "",
    estado_sunat: "",
    condicion_sunat: "",
    linkedin_url: "",
    facebook_url: "",
    instagram_url: "",
    youtube_url: "",
    tiktok_url: "",
    allow_scraping: false,
    representantes: [] as { nombre: string; porcentaje: string }[]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: "", type: "" });
  const [step, setStep] = useState(1);
  
  const searchParams = useSearchParams();
  const isNewUser = searchParams.get("new") === "true";

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        const user = await authService.getCurrentUser();
        if (!user || !user.email) return;

        const tenant = await companyService.getTenantByUserEmail(user.email);

        if (tenant) {
          const splitPhone = (fullPhone: string) => {
            if (!fullPhone) return { prefix: "+51", number: "" };
            const parts = fullPhone.split(" ");
            if (parts.length > 1 && parts[0].startsWith("+")) {
              return { prefix: parts[0], number: parts.slice(1).join(" ") };
            }
            if (fullPhone.startsWith("+")) {
               // Caso donde no hay espacio pero hay +
               return { prefix: fullPhone.substring(0, 3), number: fullPhone.substring(3) };
            }
            return { prefix: "+51", number: fullPhone };
          };

          const contactPhone = splitPhone(tenant.phone);
          const commercialPhone = splitPhone(tenant.phone_commercial || tenant.phone);

          setFormData({
            id: tenant.id,
            businessName: tenant.company_name || "",
            trade_name: tenant.trade_name || "",
            taxId: tenant.ruc_rut_nit || '',
            category: tenant.sector || '',
            activityMain: tenant.activity_main || '',
            activitySec1: tenant.activity_sec1 || '',
            activitySec2: tenant.activity_sec2 || '',
            bio: tenant.description || '',
            address: tenant.address || '',
            fiscal_address: tenant.fiscal_address || '',
            website: tenant.website || '',
            email: tenant.email || '',
            phone_prefix: contactPhone.prefix,
            phone_number: contactPhone.number,
            phone_commercial_prefix: commercialPhone.prefix,
            phone_commercial_number: commercialPhone.number,
            contact_name: tenant.contact_name || user?.user_metadata?.full_name || '',
            slug: tenant.slug || "",
// ... rest same
            logo_url: tenant.logo_url || "",
            fecha_inicio: tenant.fecha_inicio || "",
            estado_sunat: tenant.estado_sunat || "ACTIVO",
            condicion_sunat: tenant.condicion_sunat || "HABIDO",
            linkedin_url: tenant.linkedin_url || "",
            facebook_url: tenant.facebook_url || "",
            instagram_url: tenant.instagram_url || "",
            youtube_url: tenant.youtube_url || "",
            tiktok_url: tenant.tiktok_url || "",
            allow_scraping: tenant.allow_scraping || false,
            representantes: Array.isArray(tenant.representantes) ? tenant.representantes : []
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

  const calculateCompliance = () => {
    let score = 0;
    if (formData.businessName) score += 1;
    if (formData.taxId) score += 1;
    if (formData.logo_url) score += 1;
    if (formData.bio) score += 1;
    if (formData.address) score += 1;
    if (formData.email) score += 1;
    if (formData.phone_number) score += 1;
    if (formData.website) score += 1;
    if (formData.linkedin_url || formData.facebook_url) score += 1;
    if (formData.estado_sunat === "ACTIVO" && formData.condicion_sunat === "HABIDO") score += 1;
    
    const stars = Math.ceil(score / 2);
    return { score, stars };
  };

  const { score, stars } = calculateCompliance();

  const handleSave = async (isFinal = false) => {
    try {
      setIsSaving(true);
      setSaveMessage({ text: "Guardando...", type: "info" });
      if (!formData.id) throw new Error("ID de empresa no encontrado.");

      const result = await companyService.updateTenant(formData.id, {
        company_name: formData.businessName,
        trade_name: formData.trade_name, // Cambiado de bio para mayor consistencia
        ruc_rut_nit: formData.taxId,
        description: formData.bio,
        sector: formData.category,
        activity_main: formData.activityMain,
        activity_sec1: formData.activitySec1,
        activity_sec2: formData.activitySec2,
        address: formData.address,
        fiscal_address: formData.fiscal_address,
        website: formData.website,
        email: formData.email,
        phone: `${formData.phone_prefix} ${formData.phone_number}`.trim(),
        phone_commercial: `${formData.phone_commercial_prefix} ${formData.phone_commercial_number}`.trim(),
        contact_name: formData.contact_name,
        slug: formData.slug,
        logo_url: formData.logo_url,
        fecha_inicio: formData.fecha_inicio,
        estado_sunat: formData.estado_sunat,
        condicion_sunat: formData.condicion_sunat,
        linkedin_url: formData.linkedin_url,
        facebook_url: formData.facebook_url,
        instagram_url: formData.instagram_url,
        youtube_url: formData.youtube_url,
        tiktok_url: formData.tiktok_url,
        allow_scraping: formData.allow_scraping,
        representantes: formData.representantes
      });

      if ((result as any)?._partial_sync) {
        setSaveMessage({ 
          text: "Datos básicos guardados. Para campos avanzados (Fecha, Redes, etc.) ejecute el script SQL proporcionado.", 
          type: "warning" 
        });
      } else {
        setSaveMessage({ text: "¡Perfil Industrial actualizado al 100%!", type: "success" });
      }

      setTimeout(() => setSaveMessage({ text: "", type: "" }), 6000);
      if (isFinal) window.location.href = "/dashboard";
    } catch (err: any) {
      setSaveMessage({ text: `Error: ${err.message}`, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhoneChange = (field: 'phone_number' | 'phone_commercial_number', value: string) => {
    // Permitir espacios y números
    const cleanValue = value.replace(/[^\d\s]/g, '');
    setFormData(prev => ({ ...prev, [field]: cleanValue }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  // Efecto para asegurar prefijo de país (+51) en campos vacíos
  useEffect(() => {
    if (!isLoading) {
      if (!formData.phone_prefix) setFormData(p => ({ ...p, phone_prefix: "+51" }));
      if (!formData.phone_commercial_prefix) setFormData(p => ({ ...p, phone_commercial_prefix: "+51" }));
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-[var(--accent)] rounded-full animate-spin" />
        <p className="font-black uppercase tracking-widest text-[var(--muted-foreground)] animate-pulse">Cargando Datos Maestros...</p>
      </div>
    );
  }
  return (
    <div className="space-y-10 animate-fade-in-up pb-20 relative font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-[var(--strong-text)]">
            Perfil de Empresa
          </h1>
          <p className="text-[var(--muted-foreground)] font-bold uppercase tracking-widest text-[10px] mt-2">
            Gestión de Identidad y Compliance Industrial Premium
          </p>
        </div>
        <button 
          onClick={() => handleSave()}
          disabled={isSaving}
          className="bg-[var(--primary)] text-white px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center hover:bg-[var(--deep-section)] hover:scale-[1.02] transition-all shadow-xl shadow-[var(--primary)]/20 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
          {isSaving ? "Guardando..." : "Grabar Perfil"}
        </button>
      </div>

      {saveMessage.text && (
        <div className={`p-6 rounded-[2rem] font-black uppercase text-[10px] tracking-widest animate-reveal flex items-center gap-4 border shadow-sm ${
          saveMessage.type === 'success' ? 'bg-green-50/50 text-green-600 border-green-200' : 
          saveMessage.type === 'error' ? 'bg-red-50/50 text-red-600 border-red-200' : 
          'bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/20'
        }`}>
          <div className={`w-2.5 h-2.5 rounded-full animate-bounce ${
            saveMessage.type === 'success' ? 'bg-green-500' : 
            saveMessage.type === 'error' ? 'bg-red-500' : 
            'bg-[var(--primary)]'
          }`} />
          {saveMessage.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          
          {/* SECCIÓN A: NIVEL BÁSICO */}
          <section className="glass p-10 md:p-14 rounded-[3rem] border border-[var(--border)] space-y-10 shadow-xl relative overflow-hidden backdrop-blur-md">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
             
             <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-5">
                  <div className="p-3 bg-[var(--primary)] text-white rounded-2xl shadow-lg shadow-[var(--primary)]/20">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-[var(--strong-text)]">A. Registro Proveedor</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">Nivel Básico - Identidad Validada</p>
                  </div>
                </div>

                <div className={`px-5 py-2.5 rounded-2xl border flex items-center gap-4 ${
                  formData.estado_sunat === "ACTIVO" && formData.condicion_sunat === "HABIDO" 
                  ? "bg-green-500/10 border-green-500/20 text-green-700" 
                  : "bg-red-500/10 border-red-500/20 text-red-700"
                }`}>
                  <div className={`w-2 h-2 rounded-full ${formData.estado_sunat === "ACTIVO" ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                  <div className="text-[9px] font-black uppercase tracking-widest leading-none">
                    SUNAT: {formData.estado_sunat} / {formData.condicion_sunat}
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1">Correo Electrónico (Usuario)</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    className="w-full bg-[var(--muted)]/30 border border-[var(--border)] p-5 rounded-2xl font-bold text-sm outline-none opacity-60 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1">RUC / ID Proveedor</label>
                  <input 
                    type="text" 
                    value={formData.taxId}
                    className="w-full bg-[var(--muted)]/30 border border-[var(--border)] p-5 rounded-2xl font-bold text-sm outline-none opacity-60 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1">Nombre Administrador</label>
                  <input 
                    type="text" 
                    value={formData.contact_name}
                    onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                    className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] p-5 rounded-2xl font-bold transition-all outline-none text-sm shadow-sm"
                    placeholder="Nombre del responsable"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1">Teléfono de Contacto</label>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      value={formData.phone_prefix}
                      onChange={(e) => setFormData({...formData, phone_prefix: e.target.value})}
                      className="w-24 bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] p-5 rounded-2xl font-bold transition-all outline-none text-sm shadow-sm text-center"
                      placeholder="+51"
                    />
                    <input 
                      type="text" 
                      value={formData.phone_number}
                      onChange={(e) => handlePhoneChange('phone_number', e.target.value)}
                      className="flex-1 bg-white/40 dark:bg-black/40 border border-[var(--border)] focus:border-[var(--primary)] p-5 rounded-2xl font-bold transition-all outline-none text-sm shadow-sm"
                      placeholder="900 000 000"
                    />
                  </div>
                </div>
             </div>

             {/* Password Update Group */}
             <div className="pt-8 border-t border-[var(--border)]">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-600 flex items-center justify-center">
                     <Save size={20} />
                  </div>
                  <div>
                     <h4 className="font-black uppercase text-[10px] tracking-widest text-[var(--strong-text)]">Seguridad de Cuenta - Cambiar Contraseña</h4>
                     <p className="text-[9px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mt-1">Deje en blanco si no desea cambiar su contraseña</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input 
                    type="password" 
                    placeholder="Nueva Contraseña" 
                    className="bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] p-5 rounded-2xl font-bold text-sm outline-none transition-all"
                  />
                  <input 
                    type="password" 
                    placeholder="Confirmar Contraseña" 
                    className="bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] p-5 rounded-2xl font-bold text-sm outline-none transition-all"
                  />
               </div>
             </div>
          </section>

          {/* SECCIÓN B: NIVEL PRO */}
          <section className="glass p-10 md:p-14 rounded-[3rem] border border-[var(--border)] space-y-10 shadow-xl relative overflow-hidden backdrop-blur-md">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--secondary)]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
             
             <div className="flex items-center space-x-5">
                <div className="p-3 bg-[var(--secondary)] text-black rounded-2xl shadow-lg shadow-[var(--secondary)]/20">
                  <Building2 size={28} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-[var(--strong-text)]">B. Registro Proveedor</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)]">Nivel Pro - Especialidad Industrial</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1">Razón Social</label>
                  <input 
                    type="text" 
                    value={formData.businessName}
                    readOnly
                    className="w-full bg-[var(--muted)]/30 border border-[var(--border)] p-5 rounded-2xl font-bold text-sm outline-none opacity-60 cursor-not-allowed"
                  />
                </div>
                
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1">Domicilio Fiscal</label>
                  <input 
                    type="text" 
                    value={formData.fiscal_address}
                    placeholder="Ej. Av. Industrial 123, Lima, Perú"
                    className="w-full bg-[var(--muted)]/30 border border-[var(--border)] p-5 rounded-2xl font-bold text-sm outline-none opacity-60 cursor-not-allowed"
                    readOnly
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1">Actividad Económica Principal</label>
                  <input 
                    type="text" 
                    value={formData.activityMain}
                    onChange={(e) => setFormData({...formData, activityMain: e.target.value})}
                    className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] p-5 rounded-2xl font-bold transition-all outline-none text-sm shadow-sm"
                    placeholder="Ej. Suministros Eléctricos Industriales"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1">Actividad Secundaria 1</label>
                  <input 
                    type="text" 
                    value={formData.activitySec1}
                    onChange={(e) => setFormData({...formData, activitySec1: e.target.value})}
                    className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] p-5 rounded-2xl font-bold transition-all outline-none text-sm shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1">Actividad Secundaria 2</label>
                  <input 
                    type="text" 
                    value={formData.activitySec2}
                    onChange={(e) => setFormData({...formData, activitySec2: e.target.value})}
                    className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] p-5 rounded-2xl font-bold transition-all outline-none text-sm shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1">Teléfono Comercial</label>
                   <div className="flex gap-3">
                    <input 
                        type="text" 
                        value={formData.phone_commercial_prefix}
                        onChange={(e) => setFormData({...formData, phone_commercial_prefix: e.target.value})}
                        className="w-24 bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] p-5 rounded-2xl font-bold transition-all outline-none text-sm shadow-sm text-center"
                        placeholder="+51"
                      />
                      <input 
                        type="text" 
                        value={formData.phone_commercial_number}
                        onChange={(e) => handlePhoneChange('phone_commercial_number', e.target.value)}
                        className="flex-1 bg-white/40 dark:bg-black/40 border border-[var(--border)] focus:border-[var(--primary)] p-5 rounded-2xl font-bold transition-all outline-none text-sm shadow-sm"
                        placeholder="900 000 000"
                      />
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1">Página Web</label>
                   <div className="flex items-center bg-[var(--background)] border border-[var(--border)] focus-within:border-[var(--primary)] rounded-2xl transition-all shadow-sm overflow-hidden">
                      <div className="px-4 bg-[var(--muted)]/50 border-r border-[var(--border)] py-5">
                         <Globe size={16} className="text-[var(--muted-foreground)]" />
                      </div>
                      <input 
                        type="url" 
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        className="w-full bg-transparent p-5 outline-none font-bold text-sm"
                        placeholder="https://www.empresa.com"
                      />
                   </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1">Fecha de Inicio de Actividad</label>
                  <input 
                    type="date" 
                    value={formData.fecha_inicio}
                    onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                    className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] p-5 rounded-2xl font-bold transition-all outline-none text-sm shadow-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1">URL Personalizada (Slug)</label>
                  <input 
                    type="text" 
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                    className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] p-5 rounded-2xl font-bold transition-all outline-none text-sm shadow-sm"
                  />
                </div>

                <div className="space-y-6 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1">Representantes Legales</label>
                    <button 
                      type="button"
                      onClick={() => setFormData({
                        ...formData, 
                        representantes: [...formData.representantes, { nombre: "", porcentaje: "" }]
                      })}
                      className="text-[9px] font-black uppercase tracking-widest bg-[var(--primary)]/10 text-[var(--primary)] px-4 py-2 rounded-xl hover:bg-[var(--primary)]/20 transition-all"
                    >
                      + Añadir Representante
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.representantes.map((rep, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center animate-reveal">
                        <div className="md:col-span-7">
                          <input 
                            type="text"
                            value={rep.nombre}
                            placeholder="Nombre Apellido"
                            onChange={(e) => {
                              const newReps = [...formData.representantes];
                              newReps[index].nombre = e.target.value;
                              setFormData({...formData, representantes: newReps});
                            }}
                            className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] p-4 rounded-xl font-bold text-sm outline-none transition-all shadow-sm"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <input 
                            type="text"
                            value={rep.porcentaje}
                            placeholder="% Acciones"
                            onChange={(e) => {
                              const newReps = [...formData.representantes];
                              newReps[index].porcentaje = e.target.value;
                              setFormData({...formData, representantes: newReps});
                            }}
                            className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[var(--primary)] p-4 rounded-xl font-bold text-sm outline-none transition-all shadow-sm"
                          />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                          <button 
                            type="button"
                            onClick={() => {
                              const newReps = formData.representantes.filter((_, i) => i !== index);
                              setFormData({...formData, representantes: newReps});
                            }}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                    {formData.representantes.length === 0 && (
                      <p className="text-[9px] font-bold text-[var(--muted-foreground)] uppercase italic tracking-widest py-4 border-2 border-dashed border-[var(--border)] rounded-2xl text-center">
                        No hay representantes legales registrados. Pulse "+" para añadir.
                      </p>
                    )}
                  </div>
                </div>
             </div>

             {/* Redes Sociales */}
             <div className="pt-8 border-t border-[var(--border)]">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)] ml-1 block mb-6">Canales Digitales Articulados</label>
                <div className="space-y-4">
                   {[
                     { id: 'linkedin_url', label: 'LinkedIn Professional Link', icon: 'LN', placeholder: 'https://linkedin.com/company/mi-empresa' },
                     { id: 'facebook_url', label: 'Facebook Business Fanpage', icon: 'FB', placeholder: 'https://facebook.com/mi-empresa' },
                     { id: 'instagram_url', label: 'Instagram Corporate Profile', icon: 'IG', placeholder: 'https://instagram.com/mi.empresa' },
                     { id: 'youtube_url', label: 'YouTube Official Channel', icon: 'YT', placeholder: 'https://youtube.com/@miempresa' },
                     { id: 'tiktok_url', label: 'TikTok Brand Profile', icon: 'TK', placeholder: 'https://tiktok.com/@mi.empresa' },
                   ].map((social) => (
                    <div key={social.id} className="group relative">
                       <div className="flex items-center bg-[var(--background)] border border-[var(--border)] group-focus-within:border-[var(--primary)] p-2 rounded-2xl transition-all shadow-sm">
                          <div className="w-12 h-12 flex items-center justify-center bg-[var(--muted)]/50 border-r border-[var(--border)] font-black text-[10px] text-[var(--primary)] shrink-0">
                            {social.icon}
                          </div>
                          <input 
                            type="text" 
                            value={(formData as any)[social.id]} 
                            onChange={(e) => setFormData({...formData, [social.id]: e.target.value})}
                            placeholder={social.placeholder}
                            className="bg-transparent border-none outline-none text-xs font-bold w-full px-5 py-3"
                          />
                       </div>
                    </div>
                   ))}
                </div>
             </div>
          </section>

          {/* COMPLIANCE DISCLOSURE */}
          <section className="bg-[var(--deep-section)] text-white p-12 md:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden border border-white/5">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px'}} />
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
              
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-white/10 rounded-full border border-white/20">
                       <ShieldCheck size={40} className="text-[var(--primary)]" />
                    </div>
                    <div>
                       <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">Compliance B2B Empresas</h3>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)]">Marco de Buenas Prácticas Industriales</p>
                    </div>
                 </div>

                 <div className="space-y-6 text-[11px] md:text-[13px] font-medium leading-relaxed uppercase tracking-wider opacity-80 text-justify border-l-2 border-[var(--primary)] pl-8">
                    <p>
                      En B2B Empresas, operamos bajo un marco de **Compliance Operativo** que asegura que todos los proveedores registrados cuenten con identidad fiscal válida (RUC/ID Activo y Habido). Nuestra prioridad es **"hacer lo correcto"**, garantizando que la información comercial sea veraz, ética y alineada con las normativas industriales vigentes.
                    </p>
                    <p>
                      El Proveedor es el único responsable de la exactitud de las fichas técnicas, precios, stock y toda información publicada en su Catálogo Digital. B2B Empresas actúa como un facilitador tecnológico y auditor de identidad, pero no garantiza la legalidad, fidelidad y disponibilidad final del producto, la cual debe ser confirmada directamente entre las partes.
                    </p>
                    <p>
                      Todo el contenido visual, logotipos y catálogos generados están protegidos. Queda prohibida la reproducción total o parcial de la base de datos de productos para fines ajenos a la prospección comercial dentro de nuestro ecosistema. Al utilizar nuestro Catálogo Digital o navegar en www.b2bempresas.com, usted acepta estos lineamientos de buenas prácticas y convivencia industrial.
                    </p>
                 </div>

                 <div className="pt-6 flex items-center gap-4">
                    <div className="w-12 h-[1px] bg-white/20"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40 italic">Sello de Confianza Industrial v2.05</span>
                 </div>
              </div>
          </section>
        </div>

        {/* Sidebar Info - Simplified */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[var(--deep-section)] text-white p-12 rounded-[3.5rem] space-y-8 relative overflow-hidden shadow-2xl border border-white/5">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-[var(--primary)]/20 rounded-full blur-3xl animate-pulse" />
            
            <div className="flex items-center justify-between relative z-10">
               <ShieldCheck size={56} className="text-[var(--primary)]" />
               <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">Compliance Score</p>
                  <h4 className="text-5xl font-black italic">{score}/10</h4>
               </div>
            </div>

            <div className="relative z-10 space-y-6">
               <div className="flex gap-2">
                 {[1, 2, 3, 4, 5].map((s) => (
                    <ShieldCheck 
                    key={s} 
                    size={24} 
                    className={s <= stars ? 'text-[var(--primary)]' : 'text-white/10'} 
                    fill={s <= stars ? 'currentColor' : 'none'}
                    />
                 ))}
               </div>

               <h3 className="text-2xl font-black uppercase italic leading-none tracking-tighter">Estatus de<br/>Garantía B2B</h3>
               
               <div className="space-y-3">
                 <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest mb-1">
                   <span>Nivel de Confianza</span>
                   <span>{stars * 20}%</span>
                 </div>
                 <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[var(--primary)] h-full transition-all duration-1000" style={{width: `${stars * 20}%`}} />
                 </div>
               </div>

               <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                 <ImageUpload 
                   label="Logo Corporativo"
                   description="Sharp PNG/SVG"
                   onUpload={(url) => setFormData({...formData, logo_url: url})}
                   maxSizeMB={1}
                 />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-[var(--accent)] rounded-full animate-spin" />
        <p className="font-black uppercase tracking-widest text-[var(--muted-foreground)] animate-pulse">Iniciando Panel de Perfil...</p>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
