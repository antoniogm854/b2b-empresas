"use client";

import { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  Store,
  Mail,
  AlertTriangle 
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Step1Welcome from "./Step1Welcome";
import Step2Profile from "./Step2Profile";
import Step3Catalog from "./Step3Catalog";
import { QRCodeSVG } from "qrcode.react";
import { authService } from "@/lib/auth-service";
import { companyService } from "@/lib/company-service";
import { catalogService } from "@/lib/catalog-service";
import { Zap } from "lucide-react";
import { useEffect } from "react";

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ url: string; cuup: string } | null>(null);
  const [welcomeBack, setWelcomeBack] = useState(false);
  const [requiresEmailConfirmation, setRequiresEmailConfirmation] = useState(false); // true cuando el usuario retoma registro
  
  const [formData, setFormData] = useState({
    // Step 1
    email: "",
    password: "",
    taxId: "",
    adminName: "",
    phone: "",
    cuup: "",
    // Step 2
    razonSocial: "",
    activityMain: "",
    activitySec1: "",
    activitySec2: "",
    fiscalAddress: "",
    fechaInicio: "",
    representantes: [],
    phoneComm: "",
    website: "",
    social: {
      linkedin: "",
      facebook: "",
      instagram: "",
      youtube: "",
      tiktok: "",
    },
    compliance_score: 0,
    compliance_stars: 0,
    // Step 3
    products: [],
  });

  const [isSaving, setIsSaving] = useState(false);

  // Auto-redirigir si el usuario entra a la página mediante el link del correo
  useEffect(() => {
    const checkRedirectSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Si hay una sesión activa detectada al cargar (ej: porque el usuario hizo clic en el correo)
      if (session?.user && session.user.email) {
        const tenant = await companyService.getTenantByUserEmail(session.user.email);
        
        // Solo redirigir automáticamente si la empresa está en estado "pending" (en proceso de registro)
        if (tenant && tenant.status === 'pending') {
          setFormData(prev => ({
            ...prev,
            cuup: tenant.cuup || tenant.ruc_rut_nit || '',
            taxId: tenant.ruc_rut_nit || '',
            razonSocial: tenant.company_name || '',
            email: tenant.email || session.user.email || '',
            fiscalAddress: tenant.fiscal_address || '',
            activityMain: tenant.activity_main || '',
            activitySec1: tenant.activity_sec1 || '',
            activitySec2: tenant.activity_sec2 || '',
            fechaInicio: tenant.fecha_inicio || '',
            website: tenant.website || '',
            compliance_score: tenant.compliance_score || 1,
            compliance_stars: tenant.compliance_stars || 1,
          }));
          
          const step2Completed = !!tenant.fiscal_address;
          setWelcomeBack(true);
          setStep(step2Completed ? 3 : 2); // Redirige directamente al Paso 2 (o 3 si guardó a medias)
        }
      }
    };
    checkRedirectSession();
  }, []);

  const nextStep = async (data?: any) => {
    setError(null);
    let updatedData = { ...formData, ...data };
    
    // ── PASO 1: Guardar y avanzar ──────────────────────────────────────────────
    if (step === 1) {
      setIsSaving(true);
      try {
        // ── PRE-CHECK: Detectar email ya registrado ANTES del signup ──────────
        // Supabase puede devolver user=null silenciosamente (sin error) cuando
        // el email ya existe y las confirmaciones de email están activas.
        // Por eso consultamos la tabla tenants PRIMERO.
        const { data: existingTenant } = await supabase
          .from('tenants')
          .select('id, company_name, ruc_rut_nit, cuup, fiscal_address, activity_main, activity_sec1, activity_sec2, fecha_inicio, website, compliance_score, compliance_stars, status')
          .eq('email', updatedData.email)
          .maybeSingle();

        if (existingTenant) {
          // ── EMAIL YA REGISTRADO: intentar sign-in y cargar datos ─────────
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: updatedData.email,
            password: updatedData.password
          });

          if (signInError) {
            console.error("Login Supabase Error:", signInError);
            if (signInError.message.includes('Invalid login credentials')) {
              setError('CREDENCIALES INVÁLIDAS. Si borró su usuario en "Auth", borre también la fila en "tenants".');
            } else if (signInError.message.includes('Email not confirmed')) {
              setError('CORREO NO CONFIRMADO. Abra su bandeja de entrada o desactive la confirmación en Supabase.');
            } else {
              setError(`ERROR DE AUTENTICACIÓN: ${signInError.message.toUpperCase()}`);
            }
            setIsSaving(false);
            return;
          }

          // Poblar el form con los datos ya guardados
          updatedData = {
            ...updatedData,
            cuup: existingTenant.cuup || existingTenant.ruc_rut_nit || updatedData.taxId,
            taxId: existingTenant.ruc_rut_nit || updatedData.taxId,
            razonSocial: existingTenant.company_name || updatedData.razonSocial,
            fiscalAddress: existingTenant.fiscal_address || '',
            activityMain: existingTenant.activity_main || '',
            activitySec1: existingTenant.activity_sec1 || '',
            activitySec2: existingTenant.activity_sec2 || '',
            fechaInicio: existingTenant.fecha_inicio || '',
            website: existingTenant.website || '',
            compliance_score: existingTenant.compliance_score || 1,
            compliance_stars: existingTenant.compliance_stars || 1,
          };

          const step2Completed = !!existingTenant.fiscal_address; // Revisamos fiscal_address ya que solo se guarda si se avanzó del Paso 2

          setWelcomeBack(true);
          setFormData(updatedData);
          setStep(step2Completed ? 3 : 2);
          setIsSaving(false);
          return;
        }
        // ── FIN PRE-CHECK ─────────────────────────────────────────────────────

        // Email nuevo: crear cuenta normalmente
        const authData = await authService.signUp(
          updatedData.email,
          updatedData.password,
          updatedData.adminName,
          updatedData.taxId,
          updatedData.phone
        );

        // Check if session is null (meaning email confirmation required)
        if (!authData.session && authData.user) {
          // They registered, but need to confirm email before continuing to step 2 or 3!
          setRequiresEmailConfirmation(true);
          setIsSaving(false);
          return;
        }

        // También verificar si Supabase devolvió user=null (sin error)
        if (!authData?.user && !authData?.session) {
          // Intento de sign-in como fallback (email ya existe en auth pero no en tenants)
          const { error: fallbackSignInError } = await supabase.auth.signInWithPassword({
            email: updatedData.email,
            password: updatedData.password
          });
          if (!fallbackSignInError) {
            setWelcomeBack(true);
            setFormData({ ...updatedData, compliance_score: 1, compliance_stars: 1 });
            setStep(2);
            setIsSaving(false);
            return;
          }
          setError('CORREO YA REGISTRADO — VERIFIQUE SU CONTRASEÑA E INTENTE DE NUEVO.');
          setIsSaving(false);
          return;
        }

        if (authData.cuup) {
          updatedData.cuup = authData.cuup;
        }
        updatedData.compliance_score = 1;
        updatedData.compliance_stars = 1;

        setFormData(updatedData);
        setStep((prev) => prev + 1);

      } catch (err: any) {
        const msg: string = err?.message || '';
        // Detección adicional por si el error llega explícitamente
        const isExistingUser =
          msg.toLowerCase().includes('already registered') ||
          msg.toLowerCase().includes('email already') ||
          err?.status === 422;

        if (isExistingUser) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: updatedData.email, password: updatedData.password
          });
          if (!signInError) {
            setWelcomeBack(true);
            setFormData({ ...updatedData, compliance_score: 1, compliance_stars: 1 });
            setStep(2);
          } else {
            setError('CORREO YA REGISTRADO — VERIFIQUE SU CONTRASEÑA E INTENTE DE NUEVO.');
          }
          setIsSaving(false);
          return;
        }

        setError(err.message || 'Error al registrar la información inicial.');
        setIsSaving(false);
        return;
      } finally {
        setIsSaving(false);
      }
    } else {
      if (data) setFormData((prev) => ({ ...prev, ...data }));
      
      // Auto-guardado al completar el paso 2
      if (step === 2) {
        setIsSaving(true);
        try {
          const allData = { ...formData, ...data };
          const tenant = await companyService.getTenantByUserEmail(allData.email);
          if (tenant) {
            await companyService.updateTenant(tenant.id, {
              company_name: allData.razonSocial,
              ruc_rut_nit: allData.taxId,
              sector: allData.activityMain,
              fiscal_address: allData.fiscalAddress,
              activity_main: allData.activityMain,
              activity_sec1: allData.activitySec1,
              activity_sec2: allData.activitySec2,
              fecha_inicio: allData.fechaInicio,
              representantes: allData.representantes,
              website: allData.website,
              phone: allData.phoneComm,
              compliance_score: allData.compliance_score,
              compliance_stars: allData.compliance_stars,
              trade_name: allData.razonSocial, 
              status: 'active', // <--- AUTO APROBACION DEL ADMIN (CHECK VERDE)
            } as any);
          }
        } catch (err) {
          console.error("Step 2 Auto-save Error:", err);
        } finally {
          setIsSaving(false);
        }
      }
      
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleComplete = async (finalData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const allData = { ...formData, ...finalData };
      
      // 1. Identify the tenant already created in Step 1
      const tenant = await companyService.getTenantByUserEmail(allData.email);
      
      if (!tenant) throw new Error("No se encontró el registro previo de la empresa.");

      // 2. Update Tenant with remaining Step 2 & 3 details
      const updatedTenant = await companyService.updateTenant(tenant.id, {
        company_name: allData.razonSocial,
        ruc_rut_nit: allData.taxId,
        sector: allData.activityMain,
        fiscal_address: allData.fiscalAddress,
        activity_main: allData.activityMain,
        activity_sec1: allData.activitySec1,
        activity_sec2: allData.activitySec2,
        fecha_inicio: allData.fechaInicio,
        representantes: allData.representantes,
        website: allData.website,
        phone: allData.phoneComm,
        compliance_score: allData.compliance_score,
        compliance_stars: allData.compliance_stars,
        trade_name: allData.razonSocial,
        status: 'active', // <--- AUTO APROBACION DEL ADMIN AL FINALIZAR (CHECK VERDE)
      } as any);

      // 3. Save Products in bulk
      if (allData.products.length > 0) {
        await catalogService.bulkCreateProducts(tenant.id, allData.products);
      }

      // 4. Generate success info
      const publicUrl = `https://b2bempresas.com/cdb2b/${tenant.id}`;
      
      setSuccessData({
        url: publicUrl,
        cuup: (updatedTenant as any).cuup || allData.cuup,
      });
      setStep(4); 

    } catch (err: any) {
      console.error("Error finalizing onboarding:", err);
      setError(err.message || "Ocurrió un error inesperado al finalizar.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 4 && successData) {
    return (
      <div className="text-center space-y-10 animate-fade-in">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-[#A2C367] rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-[#A2C367]/40">
            <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[var(--strong-text)]">¡Catálogo Creado!</h2>
          <p className="text-[var(--muted-foreground)] font-bold max-w-md mx-auto">
            Felicidades, has terminado el registro y llenado de tu Catálogo Digital. Aquí tienes tu acceso:
          </p>
        </div>

        <div className="bg-[var(--card)] border-2 border-[var(--border)] p-8 rounded-3xl max-w-sm mx-auto shadow-2xl">
          <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-inner border border-zinc-100">
            <QRCodeSVG value={successData.url} size={200} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] mb-2">Tu Código Único (CUUP)</p>
          <div className="bg-[#A2C367]/10 border border-[#A2C367]/20 py-2 rounded-xl text-[#A2C367] font-black tracking-widest text-xl mb-6">
            {successData.cuup}
          </div>
          
          <div className="space-y-3">
              <button 
                onClick={() => window.open(`https://wa.me/?text=Mira mi Catálogo Digital B2B: ${successData.url}`, '_blank')}
                className="w-full bg-[#25D366] text-white p-4 rounded-xl font-black uppercase tracking-widest italic flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg border-b-4 border-[#128C7E]"
              >
                Compartir en WhatsApp
              </button>
              <button 
                onClick={() => navigator.clipboard.writeText(successData.url)}
                className="w-full bg-[var(--background)] text-[var(--muted-foreground)] p-4 rounded-xl font-black uppercase tracking-widest italic border-2 border-[var(--border)] flex items-center justify-center gap-2 hover:bg-[var(--muted)] transition-all"
              >
                Copiar Link
              </button>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[var(--muted-foreground)] text-sm font-medium italic">
            "Bienvenido a B2BEmpresas. Si deseas agregar más productos, modificar alguna información y/o eliminar algún producto, lo puedes hacer desde el Panel Central de tu Catálogo Digital ya que es Completamente Administrable."
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="text-[#A2C367] font-black uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-8"
          >
            Ir al Panel Administrable
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none" />

      {/* Error display */}
      {error && step < 4 && !requiresEmailConfirmation && (
        <div className="max-w-lg mx-auto mb-8 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 animate-shake">
           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
           <p className="text-red-500 text-xs font-black uppercase italic tracking-tight">{error}</p>
        </div>
      )}

      {/* Progress Bar */}
      {step < 4 && !requiresEmailConfirmation && (
        <div className="flex justify-between mb-12 relative px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                  step >= s ? "bg-[#4B6319] text-[#A2C367] border-2 border-[#A2C367] shadow-lg shadow-[#A2C367]/20" : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                }`}
              >
                {s}
              </div>
              <span className={`text-[10px] mt-2 font-black uppercase tracking-widest ${step >= s ? "text-[#A2C367]" : "text-[var(--muted-foreground)]/60"}`}>
                {s === 1 ? "Registro" : s === 2 ? "Perfil" : "Catálogo"}
              </span>
            </div>
          ))}
          <div className="absolute top-5 left-8 right-8 h-[2px] bg-[var(--muted)] -z-0">
            <div
              className="h-full bg-[#A2C367] transition-all duration-500 shadow-[0_0_10px_rgba(162,195,103,0.5)]"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-8 relative max-w-7xl mx-auto px-4 w-full">
        {requiresEmailConfirmation ? (
          <div className="bg-[var(--muted)]/20 border-2 border-[#A2C367]/30 p-10 rounded-[3rem] text-center space-y-6 max-w-lg mx-auto shadow-2xl shadow-[#A2C367]/10 animate-fade-in-up">
            <div className="w-20 h-20 bg-[#A2C367]/20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-[#A2C367]/30">
               <Mail className="text-[#A2C367]" size={40} />
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-[var(--strong-text)] uppercase tracking-tighter">
              ¡REVISA TU CORREO AHORA, <br/>
              <span className="text-[#A2C367]">Y VALIDA TU REGISTRO!</span>
            </h2>
            <p className="text-[#A2C367] text-sm lg:text-base font-black italic">
              y en Menos de 1 Minuto ya Tendras tu Catalogo Digital GRATIS
            </p>
            <p className="text-[var(--muted-foreground)] text-sm font-bold leading-relaxed px-4">
              Hemos enviado un enlace seguro de validación a <strong className="text-[var(--strong-text)]">{formData.email}</strong>. 
            </p>
            <div className="bg-black/20 border border-white/5 p-5 rounded-2xl flex items-center gap-4 text-left w-full mx-auto mt-6">
               <div className="bg-yellow-500/20 p-3 rounded-xl shrink-0"><AlertTriangle className="text-yellow-500" size={24}/></div>
               <p className="text-xs text-[var(--muted-foreground)] font-bold leading-relaxed">
                 Ve tu bandeja de entrada ahora mismo y haz clic en el botón de confirmación. Al hacerlo, el sistema te redirigirá automáticamente al Paso 2 para continuar.
               </p>
            </div>
            <button 
              onClick={() => { window.location.reload(); }}
              className="mt-8 hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--strong-text)] px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-[var(--border)] cursor-pointer w-full text-center"
            >
              Volver a Iniciar Sesión 
            </button>
          </div>
        ) : (
          <>
            {welcomeBack && step > 1 && step < 4 && (
              <div className="mb-8 bg-gradient-to-r from-[#A2C367]/20 to-emerald-500/10 border-2 border-[#A2C367]/40 rounded-3xl p-6 flex flex-col items-center text-center gap-3 animate-fade-in shadow-lg shadow-[#A2C367]/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#A2C367] rounded-full flex items-center justify-center shrink-0">
                    <Zap size={22} className="text-black" fill="black" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-black text-lg leading-tight uppercase italic">
                      USTED YA CUENTA CON UN REGISTRO INICIAL DE SU CATALOGO DIGITAL GRATIS
                    </p>
                  </div>
                </div>
                <p className="text-[var(--muted-foreground)] font-bold text-sm max-w-md">
                  Por favor continue con su REGISTRO
                </p>
                <div className="flex items-center gap-2 bg-[#A2C367]/10 border border-[#A2C367]/20 rounded-full px-4 py-1.5">
                  <CheckCircle2 size={14} className="text-[#A2C367]" />
                  <span className="text-[#A2C367] text-[10px] font-black uppercase tracking-widest">
                    Continúe desde aquí
                  </span>
                </div>
              </div>
            )}

            {step === 1 && <Step1Welcome onNext={nextStep} initialData={formData} parentError={error} />}
            {step === 2 && (
              <Step2Profile onNext={nextStep} onPrev={prevStep} initialData={formData} />
            )}
            {step === 3 && (
              <Step3Catalog 
                onComplete={handleComplete} 
                onPrev={prevStep} 
                initialData={formData} 
                isLoading={isLoading}
              />
            )}
          </>
        )}
        
        {isLoading && step === 3 && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center flex-col gap-4">
            <div className="w-12 h-12 border-4 border-[#A2C367] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#A2C367] font-black uppercase tracking-widest text-xs animate-pulse">Generando CATÁLOGO DIGITAL...</p>
          </div>
        )}
      </div>
    </div>
  );
}
