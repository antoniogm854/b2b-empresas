"use client";

import { useState } from "react";
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Smartphone, 
  Globe,
  CreditCard,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2
} from "lucide-react";
import { rucService, RUCValidationResult } from "@/lib/ruc-service";
import { notificationsService } from "@/lib/notifications-service";

export default function SettingsPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [ruc, setRuc] = useState("");
  const [validationResult, setValidationResult] = useState<RUCValidationResult | null>(null);
  const [showRucForm, setShowRucForm] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [isPushLoading, setIsPushLoading] = useState(false);

  // Perfil simulado
  const profileId = "CURRENT_USER_ID";

  const handleValidate = async () => {
    if (ruc.length !== 11) return;
    setIsVerifying(true);
    try {
      const result = await rucService.validateRUC(ruc);
      setValidationResult(result);
    } catch (error) {
      console.error("Error validating RUC:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUpdateCompany = async () => {
    if (!validationResult?.success || !validationResult.data) return;
    setIsVerifying(true);
    try {
      await rucService.updateCompanyVerification("CURRENT_COMPANY_ID", ruc, validationResult.data);
      alert("Empresa verificada y actualizada correctamente.");
      setShowRucForm(false);
    } catch (error) {
      console.error("Error updating company:", error);
      alert("Error al actualizar la empresa.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePushToggle = async () => {
    setIsPushLoading(true);
    try {
      if (!pushEnabled) {
        const granted = await notificationsService.requestPermission();
        if (granted) {
          await notificationsService.subscribeUser(profileId);
          setPushEnabled(true);
        } else {
          alert("Debes permitir las notificaciones en tu navegador.");
        }
      } else {
        await notificationsService.unsubscribeUser(profileId);
        setPushEnabled(false);
      }
    } catch (error) {
      console.error("Push toggle error:", error);
    } finally {
      setIsPushLoading(false);
    }
  };

  const sections = [
    { 
      title: "Perfil y Cuenta", 
      items: [
        { 
          icon: User, 
          label: "Información de Empresa", 
          desc: ruc ? `RUC: ${ruc} - Verificado` : "Nombre, RUC y descripción",
          action: () => setShowRucForm(true),
          verified: !!validationResult?.success
        },
        { icon: Globe, label: "Dominio y URL", desc: "b2bempresas.com/tu-empresa" },
      ]
    },
    { 
      title: "Seguridad y Accesos", 
      items: [
        { icon: Shield, label: "Contraseña", desc: "Actualizar claves de acceso" },
        { 
          icon: Bell, 
          label: "Notificaciones Push", 
          desc: pushEnabled ? "Alertas activas en este dispositivo" : "Recibe alertas de leads y mensajes",
          action: handlePushToggle,
          customActionLabel: isPushLoading ? "Procesando..." : (pushEnabled ? "Desactivar" : "Activar"),
          active: pushEnabled
        },
      ]
    },
    { 
      title: "Suscripción y Cloud", 
      items: [
        { icon: CreditCard, label: "Plan Actual", desc: "Premium Plan - $99/mes" },
        { icon: Cloud, label: "Integraciones", desc: "Conexión con SAP/ERP" },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-primary mb-2">Configuración</h1>
        <p className="text-muted-foreground font-bold italic">Gestiona tu presencia en el ecosistema B2B</p>
      </div>

      {showRucForm && (
        <div className="mb-12 bg-white rounded-[3rem] border-2 border-accent p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-black text-primary mb-1 flex items-center">
                <Building2 className="mr-2 text-accent" />
                Validación de Identidad Industrial
              </h3>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Vinculación Oficial con SUNAT</p>
            </div>
            <button onClick={() => setShowRucForm(false)} className="text-muted-foreground hover:text-primary transition-colors">
              Cerrar
            </button>
          </div>

          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <input 
                type="text" 
                maxLength={11}
                value={ruc}
                onChange={(e) => setRuc(e.target.value.replace(/\D/g, ""))}
                placeholder="Ingresa tu número de RUC (11 dígitos)"
                className="w-full bg-muted border-none p-4 rounded-2xl font-black text-lg outline-none focus:ring-2 ring-accent transition-all"
              />
            </div>
            <button 
              onClick={handleValidate}
              disabled={isVerifying || ruc.length !== 11}
              className="bg-accent text-primary px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 flex items-center"
            >
              {isVerifying ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              {isVerifying ? "Verificando..." : "Validar Ahora"}
            </button>
          </div>

          {validationResult && (
            <div className={`p-6 rounded-3xl flex items-start space-x-4 ${validationResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              {validationResult.success ? (
                <CheckCircle2 className="text-green-600 shrink-0" />
              ) : (
                <AlertCircle className="text-red-600 shrink-0" />
              )}
              <div>
                <p className={`font-black text-sm mb-1 ${validationResult.success ? "text-green-800" : "text-red-800"}`}>
                  {validationResult.message}
                </p>
                {validationResult.data && (
                  <div className="text-xs font-bold text-green-700/70 space-y-1">
                    <p>RAZÓN SOCIAL: <span className="text-green-900">{validationResult.data.razonSocial}</span></p>
                    <p>ESTADO: <span className="text-green-900">{validationResult.data.estado}</span> | CONDICIÓN: <span className="text-green-900">{validationResult.data.condicion}</span></p>
                    <p>DIRECCIÓN: <span className="text-green-900">{validationResult.data.direccion}</span></p>
                  </div>
                )}
                {validationResult.success && (
                  <button 
                    onClick={handleUpdateCompany}
                    className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-colors flex items-center"
                  >
                    {isVerifying ? <Loader2 className="animate-spin mr-2" size={14} /> : null}
                    Actualizar Datos de Empresa
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-12">
        {sections.map((section, si) => (
          <div key={si} className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-4">{section.title}</h2>
            <div className="bg-white rounded-[3rem] border-2 border-muted overflow-hidden">
              {section.items.map((item: any, ii) => (
                <div 
                  key={ii} 
                  className={`p-6 flex items-center justify-between hover:bg-muted/30 transition-all cursor-pointer border-b last:border-0 ${item.active ? 'bg-accent/5' : ''}`}
                  onClick={item.action}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-muted rounded-2xl relative">
                      <item.icon size={20} className={item.active ? 'text-accent' : 'text-primary'} />
                      {item.verified && (
                        <div className="absolute -top-1 -right-1 bg-white rounded-full">
                          <CheckCircle2 size={14} className="text-green-500 fill-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-black text-sm flex items-center">
                        {item.label}
                        {item.verified && <span className="ml-2 text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-tighter">Verificado</span>}
                        {item.active && <span className="ml-2 text-[9px] bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full uppercase tracking-tighter italic">Dispositivo vinculante</span>}
                      </p>
                      <p className="text-xs text-muted-foreground font-bold">{item.desc}</p>
                    </div>
                  </div>
                  <button className="text-accent font-black text-xs uppercase tracking-widest hover:underline disabled:opacity-50">
                    {item.customActionLabel || (item.label === "Información de Empresa" ? "Gestionar" : "Editar")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 bg-primary/5 rounded-[3rem] border-2 border-primary/10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Smartphone className="text-primary" />
          <p className="text-sm font-black italic">Tu Catálogo Digital está activo y sincronizado para acceso directo.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest">
          Gestionar Tenant
        </button>
      </div>
    </div>
  );
}
