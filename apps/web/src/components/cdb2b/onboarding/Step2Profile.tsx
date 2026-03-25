"use client";

import { useState, useEffect } from "react";
import { validateRUC } from "@/lib/sunat";
import { RefreshCw } from "lucide-react";

interface Step2Props {
  onNext: (data: any) => void;
  onPrev: () => void;
  initialData: any;
}

export default function Step2Profile({ onNext, onPrev, initialData }: Step2Props) {
  const [isFetchingSunat, setIsFetchingSunat] = useState(false);
  const [socialErrors, setSocialErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    razonSocial: initialData.razonSocial || "",
    activityMain: initialData.activityMain || "",
    activitySec1: initialData.activitySec1 || "",
    activitySec2: initialData.activitySec2 || "",
    phoneComm: initialData.phone || "",
    website: initialData.website || "",
    social: initialData.social || {
      linkedin: "",
      facebook: "",
      instagram: "",
      youtube: "",
      tiktok: "",
    },
    authImport: false,
    fiscalAddress: initialData.domicilioFiscal || initialData.fiscalAddress || "",
    fechaInicio: initialData.fechaInicio || "",
    representantes: Array.isArray(initialData.representantes) ? initialData.representantes : [],
  });

  // Auto-llenado desde SUNAT si hay un RUC/CUUP
  useEffect(() => {
    const fetchSunat = async () => {
      const rucToSearch = initialData.cuup || initialData.taxId;
      // Solo buscar si hay RUC, y si el domicilio fiscal está vacío (para no sobreescribir si ya lo llenó antes)
      if (rucToSearch && rucToSearch.length === 11 && !formData.fiscalAddress) {
        setIsFetchingSunat(true);
        try {
          const res = await validateRUC(rucToSearch);
          if (res.valid && res.data) {
            setFormData(prev => ({
              ...prev,
              razonSocial: res.data.razonSocial || prev.razonSocial,
              fiscalAddress: res.data.domicilioFiscal || prev.fiscalAddress,
            }));
          }
        } catch (e) {
          console.error("Error auto-fetching SUNAT data", e);
        } finally {
          setIsFetchingSunat(false);
        }
      }
    };
    fetchSunat();
  }, []);

  const [compliance, setCompliance] = useState({ score: 0, stars: 0 });

  // Calculate compliance based on new 10-point scale milestones
  useEffect(() => {
    let score = 1; // Base 1 point from Step 1 Registration
    
    if (formData.activityMain && formData.activityMain.trim().length > 3) {
      score += 0.2; // +0.2 points for filling CIIU
    }
    


    // Step 2 Points (+1 for Website/Profile completion)
    if ((formData.website && formData.website.length > 5) || formData.authImport) {
      score += 1; // +1 point for completing Step 2
    }

    // Social networks
    const socialNetworksArr = Object.values(formData.social || {});
    const filledSocials = socialNetworksArr.filter((val: any) => typeof val === "string" && val.trim().length > 5).length;
    score += (filledSocials * 0.1); // +0.1 per filled social link

    const finalScore = Number(score.toFixed(1));
    const finalStars = Math.floor(finalScore); 
    setCompliance({ score: finalScore, stars: finalStars });
  }, [formData]);

  const validateSocialLink = (network: string, url: string) => {
    if (!url || url.trim() === "") {
      setSocialErrors(prev => ({ ...prev, [network]: "" }));
      return true;
    }
    
    const lowerUrl = url.toLowerCase();
    let isValid = false;

    // Verificar si contiene el dominio correspondiente a la red social
    switch (network) {
      case 'linkedin': isValid = lowerUrl.includes('linkedin.com') || lowerUrl.includes('lnkd.in'); break;
      case 'facebook': isValid = lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com') || lowerUrl.includes('fb.watch'); break;
      case 'instagram': isValid = lowerUrl.includes('instagram.com') || lowerUrl.includes('ig.me'); break;
      case 'youtube': isValid = lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be'); break;
      case 'tiktok': isValid = lowerUrl.includes('tiktok.com'); break;
    }

    // Asegurarse de que al menos empiece con un formato de URL básico
    if (!isValid || (!lowerUrl.startsWith('http://') && !lowerUrl.startsWith('https://') && !lowerUrl.includes('www.'))) {
      setSocialErrors(prev => ({ ...prev, [network]: `El enlace es inválido o no pertenece a ${network}.` }));
      return false;
    } else {
      setSocialErrors(prev => ({ ...prev, [network]: "" }));
      return true;
    }
  };

  const handleSocialChange = (network: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social: { ...prev.social, [network]: value }
    }));
    if (value.trim() !== "") {
      validateSocialLink(network, value);
    } else {
      setSocialErrors(prev => ({ ...prev, [network]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar redes sociales antes de avanzar
    let hasErrors = false;
    const networks = ['linkedin', 'facebook', 'instagram', 'youtube', 'tiktok'];
    networks.forEach(net => {
      if (!validateSocialLink(net, (formData.social as any)[net])) {
        hasErrors = true;
      }
    });

    if (hasErrors) return; // Si hay errores, no avanzar
    
    onNext({ ...formData, compliance_score: compliance.score, compliance_stars: compliance.stars });
  };

  return (
    <div className="space-y-10 max-w-2xl mx-auto">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-black tracking-tightest uppercase italic leading-none text-[var(--strong-text)]">
          Perfil Corporativo <span className="text-[#A2C367]">Premium</span>
        </h2>
        <p className="text-[var(--muted-foreground)] font-bold text-sm tracking-tight text-center">
          Completa los datos de tu empresa para aumentar tu nivel de confianza (Compliance).
        </p>
      </div>

      {/* Compliance Indicator */}
      <div className="bg-[var(--card)] border-2 border-[var(--border)] p-6 rounded-2xl flex items-center justify-between shadow-lg">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Puntaje de Compliance</p>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-black italic text-[var(--strong-text)]">{compliance.score}</span>
            <span className="text-[var(--muted-foreground)]/40 text-xl font-black">/ 10</span>
          </div>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Garantía B2B</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg
                key={s}
                className={`w-6 h-6 ${s <= compliance.stars ? "text-yellow-500" : "text-[var(--border)]"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Main Info */}
          <div className="flex flex-col justify-between h-full bg-[var(--muted)]/30 p-6 rounded-2xl border border-[var(--border)]/50">
            <div className="group mb-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 flex justify-between items-center">
                <span>Razón Social</span>
                {isFetchingSunat && <RefreshCw size={12} className="text-[#A2C367] animate-spin" />}
              </label>
              <input
                type="text"
                className={`w-full bg-[var(--input)] border-2 ${isFetchingSunat ? 'border-[#A2C367]/50 opacity-70' : 'border-[var(--border)]'} p-4 rounded-xl font-bold focus:border-[#A2C367] focus:outline-none transition-all`}
                value={formData.razonSocial}
                onChange={(e) => setFormData({...formData, razonSocial: e.target.value})}
              />
            </div>
            <div className="group mb-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 flex justify-between items-center">
                <span>Domicilio Fiscal</span>
                {isFetchingSunat && <RefreshCw size={12} className="text-[#A2C367] animate-spin" />}
              </label>
              <input
                type="text"
                className={`w-full bg-zinc-900 border-2 ${isFetchingSunat ? 'border-[#A2C367]/50 opacity-70' : 'border-zinc-800'} p-4 rounded-xl font-bold mb-2 focus:border-[#A2C367] focus:outline-none transition-all`}
                value={formData.fiscalAddress}
                onChange={(e) => setFormData({...formData, fiscalAddress: e.target.value})}
              />
            </div>
            <div className="group mb-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-1 block">Actividad Económica Principal (CIIU)</label>
              <input
                type="text"
                className="w-full bg-[var(--input)] border-2 border-[var(--border)] p-4 rounded-xl font-bold focus:border-[#A2C367] focus:outline-none transition-all placeholder:text-[var(--muted-foreground)]/50"
                value={formData.activityMain}
                onChange={(e) => setFormData({...formData, activityMain: e.target.value})}
                placeholder="Ejemplo: Venta al por mayor"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 block">Actividad Sec. 1</label>
                <input
                  type="text"
                  className="w-full bg-zinc-900 border-2 border-zinc-800 p-4 rounded-xl font-bold focus:border-[#A2C367] focus:outline-none transition-all placeholder:text-zinc-700"
                  value={formData.activitySec1}
                  onChange={(e) => setFormData({...formData, activitySec1: e.target.value})}
                  placeholder="CIIU..."
                />
              </div>
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-1 block">Actividad Sec. 2</label>
                <input
                  type="text"
                  className="w-full bg-[var(--input)] border-2 border-[var(--border)] p-4 rounded-xl font-bold focus:border-[#A2C367] focus:outline-none transition-all placeholder:text-[var(--muted-foreground)]/50"
                  value={formData.activitySec2}
                  onChange={(e) => setFormData({...formData, activitySec2: e.target.value})}
                  placeholder="CIIU..."
                />
              </div>
            </div>
          </div>

          {/* Social Icons & Status */}
          <div className="h-full">
            <div className="bg-[var(--muted)]/50 p-6 rounded-2xl border-2 border-dashed border-[var(--border)] h-full flex flex-col justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#A2C367] text-center mb-4">Redes Sociales</h3>
              <div className="space-y-3 flex-grow flex flex-col justify-center">
                {['linkedin', 'facebook', 'instagram', 'youtube', 'tiktok'].map((net) => (
                  <div key={net} className="relative group flex flex-col gap-1 w-full">
                    <div className="relative w-full">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 font-black uppercase text-[10px]">{net.substring(0,2)}</span>
                      <input
                        type="url"
                        placeholder={`https://www.${net}.com/perfil`}
                        className={`w-full bg-[var(--input)] border-2 ${socialErrors[net] ? 'border-red-500/50' : 'border-transparent'} pl-12 pr-4 py-3 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#A2C367] focus:border-transparent transition-all outline-none`}
                        value={(formData.social as any)[net]}
                        onChange={(e) => handleSocialChange(net, e.target.value)}
                        onBlur={(e) => validateSocialLink(net, e.target.value)}
                      />
                    </div>
                    {socialErrors[net] && (
                      <span className="text-red-500 text-[9px] font-bold uppercase tracking-widest pl-2 absolute -bottom-3.5 left-0">
                        {socialErrors[net]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FULL WIDTH ROW: Website & Sync */}
          <div className="md:col-span-2 space-y-4">
            <div className="group">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 block">PÁGINA WEB</label>
              <input
                type="url"
                className="w-full bg-[var(--input)] border-2 border-[var(--border)] p-4 rounded-xl font-bold focus:border-[#A2C367] focus:outline-none transition-all"
                placeholder="https://www.tuempresa.com"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
              />
            </div>
            
            <div className="bg-[#A2C367]/5 border border-[#A2C367]/20 p-5 rounded-xl flex items-start gap-4 w-full cursor-pointer hover:bg-[#A2C367]/10 transition-colors"
                 onClick={() => setFormData({...formData, authImport: !formData.authImport})}
            >
              <input
                type="checkbox"
                id="authImport"
                className="mt-1 min-w-[20px] w-5 h-5 rounded border-zinc-800 bg-zinc-950 text-[#A2C367] focus:ring-[#A2C367] pointer-events-none"
                checked={formData.authImport}
                readOnly
              />
              <div className="text-[10px] text-zinc-400 leading-relaxed pointer-events-none">
                <span className="font-black text-[#A2C367] block text-[12px] uppercase tracking-widest mb-1.5">Sincronización Automática</span>
                * Autorizo a B2B Empresas el uso único y exclusivamente de la información de mis productos cargados en mi página web, tienda virtual o catálogo virtual para carga automática en el Catálogo Maestro (CUUP: {initialData.cuup || initialData.taxId}).
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-5 px-6 bg-[var(--muted)]/40 rounded-xl border border-[var(--border)]/50 my-6">
          <p className="text-[11px] font-bold text-[var(--muted-foreground)] leading-relaxed max-w-2xl mx-auto">
            <span className="text-[#A2C367] text-lg leading-none align-middle mr-1">*</span> 
            Completa la mayor cantidad de información posible y obtén el máximo puntaje <strong className="text-[var(--strong-text)]">COMPLIANCE</strong>. Un perfil corporativo detallado proyecta una imagen de empresa confiable y responsable, fundamental para establecer <strong className="text-[#A2C367]">Alianzas Estratégicas Sostenibles en el Tiempo</strong>.
          </p>
        </div>

        <div className="flex gap-4 pt-6 mt-2 border-t border-[var(--border)]/50">
          <button
            type="button"
            onClick={onPrev}
            className="flex-1 bg-[var(--input)] text-[var(--muted-foreground)] p-5 rounded-2xl font-black uppercase tracking-widest italic border-2 border-[var(--border)] hover:bg-[var(--muted)] transition-all"
          >
            Atrás
          </button>
          <button
            type="submit"
            className="flex-[2] btn-premium-neon"
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] opacity-70 mb-0.5">CONTINUAR</span>
              <span className="text-xl">Siguiente Paso</span>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}
