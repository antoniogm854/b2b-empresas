"use client";

import { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Globe, 
  Save, 
  Upload, 
  ShieldCheck,
  Briefcase
} from "lucide-react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    businessName: "Corporación Industrial del Norte",
    ruc: "20123456789",
    category: "Maquinaria Pesada",
    bio: "Líderes en distribución de motores y sistemas de transmisión para la minería.",
    address: "Av. Industrial 450, Lima, Perú",
    website: "www.indunorte.pe",
    email: "ventas@indunorte.pe",
    phone: "+51 987 654 321"
  });

  const [coords, setCoords] = useState({ lat: -12.046374, lng: -77.042793 }); // Lima default
  const [isMapping, setIsMapping] = useState(false);
  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tightest uppercase italic">Perfil de Empresa</h1>
          <p className="text-muted-foreground font-semibold mt-2">Gestiona tu identidad corporativa y datos comerciales.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center hover:scale-105 transition-all shadow-xl shadow-primary/20">
          <Save size={20} className="mr-2" />
          Guardar Cambios
        </button>
      </div>

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
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Nombre Comercial</label>
                <input 
                  type="text" 
                  value={formData.businessName}
                  className="w-full bg-muted/30 border-2 border-transparent focus:border-accent p-4 rounded-2xl font-bold transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">RUC</label>
                <input 
                  type="text" 
                  value={formData.ruc}
                  className="w-full bg-muted/30 border-2 border-transparent focus:border-accent p-4 rounded-2xl font-bold transition-all outline-none"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Bio Industrial</label>
                <textarea 
                  rows={3}
                  value={formData.bio}
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
                  className="w-full bg-muted/30 border-2 border-transparent focus:border-accent p-4 rounded-2xl font-bold transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Teléfono de Contacto</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  className="w-full bg-muted/30 border-2 border-transparent focus:border-accent p-4 rounded-2xl font-bold transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Interactive Map Selector */}
          <div className="bg-background p-10 rounded-[3rem] border-2 border-muted/50 space-y-8 overflow-hidden relative">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <Globe className="text-accent" size={32} />
                <h2 className="text-2xl font-black uppercase italic">Geolocalización Industrial</h2>
              </div>
              <div className="bg-muted px-4 py-2 rounded-xl border-2 border-transparent">
                <p className="text-[10px] font-black uppercase text-muted-foreground">Coordenadas Actuales</p>
                <code className="text-xs font-black">{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</code>
              </div>
            </div>

            <div 
              className="relative w-full h-[400px] bg-slate-900 rounded-[2.5rem] overflow-hidden cursor-crosshair group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                // Simple linear mapping for simulation
                setCoords({
                  lat: -12.046374 + (0.5 - y) * 0.1,
                  lng: -77.042793 + (x - 0.5) * 0.1
                });
                setIsMapping(true);
                setTimeout(() => setIsMapping(false), 1000);
              }}
            >
              {/* Simulated Map Grid */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" 
                   style={{backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
              
              {/* Animated Scanline */}
              <div className="absolute top-0 left-0 w-full h-1 bg-accent/20 blur-sm animate-scan" />

              {/* Pin Marker */}
              <div 
                className={`absolute w-12 h-12 -ml-6 -mt-12 transition-all duration-500 ease-out flex items-center justify-center`}
                style={{ left: '50%', top: '50%' }}
              >
                <div className="relative">
                  <MapPin className="text-accent fill-accent/20 animate-bounce" size={48} />
                  <div className="absolute -bottom-1 left-1.5 w-9 h-3 bg-black/40 blur-md rounded-full scale-x-150" />
                </div>
              </div>

              {/* Interaction Feedback */}
              {isMapping && (
                <div className="absolute inset-0 flex items-center justify-center bg-accent/10 backdrop-blur-[2px] animate-pulse">
                  <p className="bg-background px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl skew-x-[-12deg]">
                    Ubicación Actualizada
                  </p>
                </div>
              )}

              {/* Map UI Overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                <div className="bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 max-w-xs">
                  <p className="text-[10px] font-black uppercase text-accent mb-1 italic">Radio de Entrega Estimado</p>
                  <p className="text-xs text-white/80 font-medium italic">
                    Tu posición afecta la visibilidad en el motor de proximidad del APP_CD.
                  </p>
                </div>
                <button className="pointer-events-auto bg-white/10 hover:bg-white/20 backdrop-blur-xl p-4 rounded-xl border border-white/20 text-white transition-all active:scale-95">
                  <Globe size={20} />
                </button>
              </div>
            </div>
            
            <p className="text-center text-xs font-bold text-muted-foreground italic">
              Haz clic sobre el mapa para fijar la ubicación exacta de tu almacén o planta industrial.
            </p>
          </div>
        </div>

        {/* Sidebar Status/Certifications */}
        <div className="space-y-8">
          <div className="bg-primary text-primary-foreground p-10 rounded-[3rem] space-y-6 relative overflow-hidden">
            <ShieldCheck size={64} className="text-accent mb-4" />
            <h3 className="text-2xl font-black uppercase italic leading-tight">Estado de Verificación</h3>
            <div className="flex items-center space-x-2 bg-white/10 p-4 rounded-2xl border border-white/20">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
              <p className="text-sm font-black uppercase tracking-widest">En Revisión</p>
            </div>
            <p className="text-sm font-medium text-primary-foreground/70">
              Tu perfil industrial está siendo validado por nuestro equipo para habilitar el motor de proximidad.
            </p>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
          </div>

          <div className="bg-background p-10 rounded-[3rem] border-2 border-muted/50 space-y-6">
            <div className="flex items-center space-x-4">
              <Upload className="text-accent" size={24} />
              <h3 className="font-black uppercase italic">Certificaciones</h3>
            </div>
            <div className="border-2 border-dashed border-muted rounded-2xl p-6 text-center space-y-4">
              <Briefcase size={32} className="mx-auto text-muted-foreground" />
              <p className="text-xs font-bold text-muted-foreground">Sube tu ISO 9001 o certificaciones industriales (PDF/JPG)</p>
              <button className="text-accent font-black uppercase text-[10px] tracking-widest underline">Seleccionar Archivo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
