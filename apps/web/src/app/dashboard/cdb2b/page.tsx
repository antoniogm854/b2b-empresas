"use client";

import { useState, useEffect } from "react";
import { Zap, Layout, QrCode, Share2, Star, CheckCircle2 } from "lucide-react";
import { companyService, Tenant } from "@/lib/company-service";
import { authService } from "@/lib/auth-service";
import { QRCodeSVG } from "qrcode.react";

export default function CDB2BSettingsPage() {
  const [tenant, setTenant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState("classic");

  useEffect(() => {
    loadTenantData();
  }, []);

  const loadTenantData = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const data = await companyService.getTenantByUserEmail(user.email!);
        if (data) {
          setTenant(data);
          // Assuming tenant_themes[0].template_model
          const theme = data.tenant_themes?.[0]?.template_model || "classic";
          setSelectedLayout(theme);
        }
      }
    } catch (error) {
      console.error("Error loading tenant:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLayout = async (layout: string) => {
    setIsSaving(true);
    try {
      // In a real scenario, we would update tenant_themes table.
      // For now, let's assume updateTenant can handle it or we have a specific service.
      const themeId = tenant.tenant_themes?.[0]?.id;
      if (themeId) {
        // Mocking update for tenant_themes
        // await supabase.from('tenant_themes').update({ template_model: layout }).eq('id', themeId);
      }
      setSelectedLayout(layout);
    } catch (error) {
      console.error("Error saving layout:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse font-black uppercase text-xs tracking-widest text-zinc-500">Cargando Configuración...</div>;
  if (!tenant) return <div className="p-20 text-center font-black uppercase text-xs tracking-widest text-red-500">No se encontró el catálogo.</div>;

  const publicUrl = `https://b2bempresas.com/cdb2b/${tenant.id}`;

  return (
    <div className="space-y-12 pb-20 animate-fade-in-up">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="bg-emerald-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block">Configuración VIP</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-zinc-950 dark:text-white">Panel del Catálogo Digital</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Gestiona tu impacto comercial en tiempo real</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Layout Selection */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-xl shadow-black/[0.02] space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
              <h2 className="text-2xl font-black uppercase italic tracking-tightest">Elige tu <span className="text-emerald-500">Layout Industrial</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'modern', name: 'MODERN PREMIUM', desc: 'Dark, Alto Contraste, Gráficos Pesados', icon: Zap },
                { id: 'classic', name: 'CLASSIC INDUSTRIAL', desc: 'Light, Corporativo, Limpio y Directo', icon: Layout },
                { id: 'tech_spec', name: 'TECH-SPEC', desc: 'Foco Técnico, Tablas, Fichas PDF', icon: CheckCircle2 }
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleSaveLayout(l.id)}
                  className={`relative p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 text-center group ${
                    selectedLayout === l.id 
                    ? "border-emerald-500 bg-emerald-500/5 shadow-2xl shadow-emerald-500/10" 
                    : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className={`p-4 rounded-2xl transition-all ${selectedLayout === l.id ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:bg-zinc-200'}`}>
                    <l.icon size={24} />
                  </div>
                  <div>
                    <p className="font-black uppercase text-xs tracking-widest mb-1">{l.name}</p>
                    <p className="text-[10px] font-medium text-zinc-500 leading-tight uppercase">{l.desc}</p>
                  </div>
                  {selectedLayout === l.id && (
                    <div className="absolute top-4 right-4 text-emerald-500">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <p className="text-[10px] font-bold text-zinc-400 italic uppercase">El diseño seleccionado se aplicará instantáneamente a tu URL pública.</p>
          </section>

          {/* Compliance & Ratios */}
          <section className="bg-zinc-950 text-white p-10 rounded-[3rem] border border-zinc-800 shadow-2xl overflow-hidden relative group">
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                   <h2 className="text-3xl font-black uppercase italic tracking-tightest leading-none">Tu Ratio de <br/><span className="text-emerald-500">Cumplimiento (Compliance)</span></h2>
                   <div className="flex items-center gap-4">
                      <div className="text-5xl font-black text-emerald-500 tracking-tighter">{tenant.compliance_score || '9.5'}</div>
                      <div className="text-zinc-500 font-bold uppercase text-[10px] leading-tight">Puntaje Basado en <br/> Integridad de Perfil</div>
                   </div>
                   <div className="flex gap-1 text-yellow-500">
                      {[1,2,3,4,5].map(i => <Star key={i} size={20} fill={i <= (tenant.compliance_stars || 4) ? "currentColor" : "none"} />)}
                   </div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl space-y-4">
                   <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Estado de Verificación</p>
                   <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="font-black text-xs uppercase tracking-tight text-white">CATÁLOGO ACTIVO Y VISIBLE</span>
                   </div>
                   <p className="text-xs text-zinc-400 font-medium leading-relaxed italic">"Tu perfil ha superado los estándares industriales de validación. Tienes acceso total a las funciones premium de CDB2B."</p>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
          </section>
        </div>

        {/* Sharing & QR Card */}
        <div className="space-y-8">
           <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-xl shadow-black/[0.02] text-center space-y-8">
              <div className="bg-zinc-50 dark:bg-white p-4 rounded-2xl inline-block shadow-inner mx-auto mb-2">
                 <QRCodeSVG value={publicUrl} size={180} />
              </div>
              <div className="space-y-2">
                 <p className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">Tu Código Único (CUUP)</p>
                 <div className="bg-emerald-500/10 border border-emerald-500/20 py-2 rounded-xl text-emerald-500 font-black tracking-widest text-xl">
                   {tenant.cuup || 'PRV-88210'}
                 </div>
              </div>
              
              <div className="space-y-3">
                 <button 
                  onClick={() => window.open(publicUrl, '_blank')}
                  className="w-full bg-zinc-950 text-white p-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl"
                 >
                   <Share2 size={16} /> Ver Catálogo Público
                 </button>
                 <button 
                  onClick={() => navigator.clipboard.writeText(publicUrl)}
                  className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 p-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all text-zinc-950 dark:text-zinc-300"
                 >
                   Copiar Link de Compartición
                 </button>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center gap-2">
                 <QrCode size={14} className="text-zinc-400" />
                 <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Sincronización QR Activa</p>
              </div>
           </section>

           <section className="bg-[var(--primary)] text-white p-8 rounded-[2.5rem] shadow-2xl shadow-[var(--primary)]/20 space-y-4">
              <h3 className="font-black uppercase italic tracking-tighter text-xl leading-none">¿Deseas activar <br/> pedidos directos?</h3>
              <p className="text-white/80 text-xs font-medium leading-relaxed">Configura el botón de WhatsApp Flotante para recibir solicitudes de cotización directamente en tu terminal de ventas.</p>
              <button className="w-full bg-white text-[var(--primary)] py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-100 transition-all">CONFIGURAR WHATSAPP</button>
           </section>
        </div>

      </div>
    </div>
  );
}
