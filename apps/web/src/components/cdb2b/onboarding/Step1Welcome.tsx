"use client";

import { useState, useEffect, useRef } from "react";
import { validateRUC } from "@/lib/sunat";
import { supabase } from "@/lib/supabase";

interface Step1Props {
  onNext: (data: any) => void;
  initialData: any;
  parentError?: string | null;
}

export default function Step1Welcome({ onNext, initialData, parentError }: Step1Props) {
  const [formData, setFormData] = useState({
    email: initialData.email || "",
    password: initialData.password || "",
    taxId: initialData.taxId || "",
    adminName: initialData.adminName || "",
    phone: initialData.phone || "",
    phonePrefix: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isEmailRegistered, setIsEmailRegistered] = useState(false);

  useEffect(() => {
    if (parentError) {
      setSuccess(false);
      setIsLoading(false);
    }
  }, [parentError]);

  // Refs for focus trap
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const taxIdRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const adminNameRef = useRef<HTMLInputElement>(null);

  const refs: Record<string, React.RefObject<HTMLInputElement | null>> = {
    email: emailRef,
    password: passRef,
    taxId: taxIdRef,
    phone: phoneRef,
    adminName: adminNameRef,
  };

  // Detección automática de código de país por IP
  useEffect(() => {
    if (!formData.phonePrefix) {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => {
          const countryCodes: Record<string, string> = {
            PE: "+51", CL: "+56", CO: "+57", MX: "+52", ES: "+34", AR: "+54", EC: "+593", BO: "+591", BR: "+55", US: "+1",
          };
          const prefix = countryCodes[data.country_code] || "+";
          setFormData((prev) => ({ ...prev, phonePrefix: prefix }));
        })
        .catch(() => {
          setFormData((prev) => ({ ...prev, phonePrefix: "+" }));
        });
    }
  }, []);

  // Prefetch RUC data when 11 digits are entered
  useEffect(() => {
    if (formData.taxId.length === 11) {
      validateRUC(formData.taxId).then(res => {
         if (res.valid) {
            setFormData(prev => ({ ...prev, ...res.data }));
         }
      });
    }
  }, [formData.taxId]);

  const [isValidatingEmail, setIsValidatingEmail] = useState(false);

  const validateField = async (name: string, value: string) => {
    let msg = "";
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        msg = "POR FAVOR INGRESE UN CORREO ELECTRÓNICO VALIDO";
      } else {
        const domain = value.split("@")[1]?.toLowerCase();
        const commonTypos = ["gmal.com", "yaho.com", "hotmal.com", "outlok.com"];
        if (commonTypos.includes(domain)) {
          msg = `DOMINIO @${domain} NO PARECE VALIDO. ¿QUISISTE DECIR @${domain.replace('mal', 'mail').replace('yaho', 'yahoo').replace('outlok', 'outlook')}?`;
        } else {
          setIsValidatingEmail(true);
          try {
            // First check if email exists in DB
            const { data } = await supabase.from('tenants').select('id').eq('email', value).maybeSingle();
            if (data) {
                // Email is already registered
                setIsEmailRegistered(true);
                setFieldErrors(prev => ({ ...prev, email: "" })); 
            } else {
                setIsEmailRegistered(false);
                // Web Existence Check (DNS MX)
                const response = await fetch('/api/validate-domain', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ domain })
                });
                const dnsData = await response.json();
                if (dnsData.valid === false) {
                  msg = `DOMINIO @${domain} NO EXISTE O NO TIENE SERVIDORES DE CORREO ACTIVOS.`;
                }
            }
          } catch (err) {
            console.error("DNS/DB check failed:", err);
          } finally {
            setIsValidatingEmail(false);
          }
        }
      }
    }
    if (name === "password" && value.length < 8) {
      msg = "LA CONTRASEÑA DEBE TENER AL MENOS 8 CARACTERES";
    }
    if (name === "adminName") {
      const parts = value.trim().split(/\s+/);
      if (parts.length < 2) msg = "POR FAVOR INGRESE NOMBRE Y APELLIDO COMPLETO";
    }
    if (name === "taxId") {
      if (!/^\d{11}$/.test(value)) msg = "EL RUC DEBE TENER 11 DÍGITOS NUMÉRICOS";
    }
    if (name === "phone") {
      const clean = value.replace(/\D/g, "");
      // Solo validar longitud si no está vacío. Si está vacío, se validará al dar clic en COMENZAR.
      if (value !== "" && formData.phonePrefix === "+51" && clean.length !== 9) {
        msg = "EL NUMERO CELULAR PARA PERU DEBE TENER EXACTAMENTE 9 DIGITOS";
      } else if (value !== "" && clean.length < 7) {
        msg = "EL NUMERO DE TELEFONO ES DEMASIADO CORTO";
      }
    }

    setFieldErrors(prev => ({ ...prev, [name]: msg }));
    return msg === "";
  };

  const handleBlur = async (name: string, e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") return; 
    
    const isValid = await validateField(name, val);
    if (!isValid) {
      setTimeout(() => {
        refs[name]?.current?.focus();
      }, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim accidental whitespace
    const parsedEmail = formData.email.trim();
    const parsedPass = formData.password.trim();

    const isEmailValid = await validateField("email", parsedEmail);
    const isPassValid = await validateField("password", parsedPass);

    if (isEmailRegistered) {
      if (!isEmailValid || !isPassValid) {
        setError("CONTRASEÑA INCORRECTA O INCOMPLETA. DEBE TENER AL MENOS 8 CARACTERES.");
        return;
      }
      setIsLoading(true);
      setError(null);
      // Skip RUC and success screen, let OnboardingWizard handle the immediate login jump
      onNext({ ...formData, email: parsedEmail, password: parsedPass });
      return;
    }

    const isNameValid = await validateField("adminName", formData.adminName);
    const isTaxValid = await validateField("taxId", formData.taxId);
    const isPhoneValid = await validateField("phone", formData.phone);

    if (!isEmailValid || !isPassValid || !isNameValid || !isTaxValid || !isPhoneValid) {
      setError("POR FAVOR CORRIJA LOS ERRORES EN EL FORMULARIO");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const rucResult = await validateRUC(formData.taxId);
      if (!rucResult.valid) {
        setFieldErrors(prev => ({ ...prev, taxId: (rucResult.message || "RUC INVALIDO").toUpperCase() }));
        throw new Error((rucResult.message || "ERROR EN LA VALIDACIÓN DEL RUC").toUpperCase());
      }

      if (rucResult.data?.estado !== "ACTIVO" || rucResult.data?.condicion !== "HABIDO") {
        setFieldErrors(prev => ({ ...prev, taxId: "EMPRESA NO ACTIVA O NO HABIDA" }));
        throw new Error("SU EMPRESA NO SE ENCUENTRA ACTIVA – VERIFICAR SUS DATOS POR FAVOR");
      }

      setSuccess(true);
      setTimeout(() => {
        onNext({ 
          ...formData, 
          phone: `${formData.phonePrefix} ${formData.phone}`,
          ...rucResult.data 
        });
      }, 2000);

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="w-20 h-20 bg-[#A2C367] rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-[#A2C367]/40">
          <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter">¡Felicidades!</h2>
        <p className="text-zinc-400 text-lg">Ya estás a un paso de tener tu propio Catálogo Digital en menos de un minuto.</p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-[#A2C367] rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-[#A2C367] rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-[#A2C367] rounded-full animate-bounce" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-2xl mx-auto">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tightest uppercase italic leading-[0.8] mb-8">
          <span className="block whitespace-nowrap text-[#A2C367]">BIENVENIDO A TU</span>
          <span className="block whitespace-nowrap">CATÁLOGO DIGITAL</span>
          <span className="block whitespace-nowrap text-[#A2C367] text-[1.2em] drop-shadow-[0_0_20px_rgba(162,195,103,0.4)]">GRATIS</span>
        </h1>
        <p className="text-zinc-500 font-bold text-sm tracking-tight">
          Regístrate en 1 minuto y obtén tu Catálogo Digital Profesional Gratis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
             <p className="text-red-500 text-xs font-black uppercase italic tracking-tight">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Fila 1: Correo */}
          <div className="group">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 block group-focus-within:text-emerald-500 transition-colors">
                CORREO ELECTRONICO (*USUARIO - NOMBRE)
              </label>
              {isValidatingEmail && (
                <span className="text-[9px] text-[#A2C367] font-black animate-pulse flex items-center gap-1 uppercase italic">
                  <div className="w-1.5 h-1.5 bg-[#A2C367] rounded-full animate-ping" />
                  Verificando Web...
                </span>
              )}
            </div>
            <input
              ref={emailRef}
              type="email"
              required
              autoComplete="off"
              className={`w-full bg-zinc-900 border-2 p-4 rounded-xl font-bold focus:outline-none transition-all placeholder:text-zinc-700 ${fieldErrors.email ? 'border-red-500' : 'border-zinc-800 focus:border-[#A2C367]'}`}
              placeholder="Ej: admin@tuempresa.com"
              value={formData.email}
              onChange={(e) => {
                 const val = e.target.value;
                 setFormData(prev => ({...prev, email: val}));
                 if (fieldErrors.email) validateField("email", val);
              }}
              onBlur={(e) => handleBlur("email", e)}
            />
            {fieldErrors.email && <p className="text-[9px] text-red-500 font-black mt-1 uppercase italic">{fieldErrors.email}</p>}
          </div>

          {/* Fila 2: Contraseña */}
          <div className="group">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 mb-1 block group-focus-within:text-emerald-500 transition-colors">
              CONTRASEÑA (MIN 8 CARACTERES) (*USUARIO - CONTRASEÑA)
            </label>
            <input
              ref={passRef}
              type="password"
              required
              autoComplete="new-password"
              className={`w-full bg-[var(--input)] border-2 p-4 rounded-xl font-bold focus:outline-none transition-all placeholder:text-[var(--muted-foreground)]/50 ${fieldErrors.password ? 'border-red-500' : 'border-[var(--border)] focus:border-[#A2C367]'}`}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => {
                const val = e.target.value;
                setFormData(prev => ({...prev, password: val}));
                if (fieldErrors.password) validateField("password", val);
              }}
              onBlur={(e) => handleBlur("password", e)}
            />
            {fieldErrors.password && <p className="text-[9px] text-red-500 font-black mt-1 uppercase italic">{fieldErrors.password}</p>}
          </div>

          {isEmailRegistered && (
            <div className="bg-[#A2C367]/10 border border-[#A2C367]/20 p-4 rounded-xl flex items-center justify-center gap-2 mb-4 animate-fade-in text-center">
              <span className="text-[#A2C367] text-[10px] font-black uppercase tracking-widest leading-relaxed">
                ESTA CUENTA YA TIENE UN REGISTRO PREVIO. <br className="hidden md:block"/> INGRESE SU CONTRASEÑA PARA RETOMAR SU REGISTRO O INGRESAR.
              </span>
            </div>
          )}

          {/* Mostrar Error Local si Existe */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 animate-shake mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <p className="text-red-500 text-xs font-black uppercase italic tracking-tight">{error}</p>
            </div>
          )}

          {/* Mostrar Error Local del Padre Justo Arriba del Botón */}
          {parentError && !error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 animate-shake mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <p className="text-red-500 text-xs font-black uppercase italic tracking-tight">{parentError}</p>
            </div>
          )}

          {!isEmailRegistered && (
            <>
              {/* Fila 3: RUC (Izquierda) y Teléfono (Derecha) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] ml-1 mb-1 block group-focus-within:text-emerald-500 transition-colors">
                    RUC/ID PROVEEDOR (11 DIGITOS)
                  </label>
              <input
                ref={taxIdRef}
                type="text"
                required
                maxLength={11}
                autoComplete="off"
                className={`w-full bg-[var(--input)] border-2 p-4 rounded-xl font-bold focus:outline-none transition-all placeholder:text-[var(--muted-foreground)]/50 ${fieldErrors.taxId ? 'border-red-500' : 'border-[var(--border)] focus:border-[#A2C367]'}`}
                placeholder="20123456789"
                value={formData.taxId}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setFormData(prev => ({...prev, taxId: val}));
                  if (fieldErrors.taxId) validateField("taxId", val);
                }}
                onBlur={(e) => handleBlur("taxId", e)}
              />
              {fieldErrors.taxId && <p className="text-[9px] text-red-500 font-black mt-1 uppercase italic">{fieldErrors.taxId}</p>}
            </div>
            
            <div className="group">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 mb-1 block group-focus-within:text-emerald-500 transition-colors">
                TELEFONO DE CONTACTO
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  tabIndex={-1}
                  className="w-20 bg-[var(--muted)]/50 border-2 border-[var(--border)] p-4 rounded-xl font-black text-center text-[#A2C367]"
                  value={formData.phonePrefix}
                />
                <input
                  ref={phoneRef}
                  type="text"
                  required
                  className={`flex-1 bg-[var(--input)] border-2 p-4 rounded-xl font-bold focus:outline-none transition-all placeholder:text-[var(--muted-foreground)]/50 ${fieldErrors.phone ? 'border-red-500' : 'border-[var(--border)] focus:border-[#A2C367]'}`}
                  placeholder="987 654 321"
                  value={formData.phone}
                  onChange={(e) => {
                    // Permitir dígitos, espacios, guiones y paréntesis para formato humano
                    const val = e.target.value.replace(/[^0-9\s-()]/g, '');
                    setFormData(prev => ({...prev, phone: val}));
                    if (fieldErrors.phone) validateField("phone", val);
                  }}
                  onBlur={(e) => handleBlur("phone", e)}
                />
              </div>
              {fieldErrors.phone && <p className="text-[9px] text-red-500 font-black mt-1 uppercase italic">{fieldErrors.phone}</p>}
            </div>
          </div>

          {/* Fila 4: Nombre Administrador */}
          <div className="group">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] ml-1 mb-1 block group-focus-within:text-emerald-500 transition-colors">Nombre Administrador</label>
            <input
              ref={adminNameRef}
              type="text"
              required
              className={`w-full bg-[var(--input)] border-2 p-4 rounded-xl font-bold focus:outline-none transition-all placeholder:text-[var(--muted-foreground)]/50 ${fieldErrors.adminName ? 'border-red-500' : 'border-[var(--border)] focus:border-[#A2C367]'}`}
              placeholder="Nombre y Apellido"
              value={formData.adminName}
              onChange={(e) => {
                const val = e.target.value;
                setFormData(prev => ({...prev, adminName: val}));
                if (fieldErrors.adminName) validateField("adminName", val);
              }}
              onBlur={(e) => handleBlur("adminName", e)}
            />
              {fieldErrors.adminName && <p className="text-[9px] text-red-500 font-black mt-1 uppercase italic">{fieldErrors.adminName}</p>}
            </div>
          </>
        )}
        </div>

        <div className="text-center py-5 px-6 bg-[var(--muted)]/40 rounded-xl border border-[var(--border)]/50 my-6">
          <p className="text-[11px] font-bold text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            <span className="text-[#A2C367] text-lg leading-none align-middle mr-1">*</span> 
            Completa la mayor cantidad de información posible y obtén el máximo puntaje <strong className="text-[var(--strong-text)]">COMPLIANCE</strong>. Un perfil corporativo detallado proyecta una imagen de empresa confiable y responsable, fundamental para establecer <strong className="text-[#A2C367]">Alianzas Estratégicas Sostenibles en el Tiempo</strong>.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-premium-neon mt-2"
        >
          <div className="flex flex-col items-center">
            <span className="text-[10px] opacity-70 mb-0.5">{isEmailRegistered ? "RETOMAR SESIÓN" : "COMENZAR AHORA"}</span>
            <span className="text-xl">
              {isLoading ? "Validando información..." : (isEmailRegistered ? "Continuar Registro Previo" : "Crear mi Cuenta Gratis")}
            </span>
          </div>
        </button>
      </form>
    </div>
  );
}
