"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { companyService } from "@/lib/company-service";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    companyName: "",
    slug: "",
    taxId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validations
      if (!/^\d+$/.test(formData.taxId)) {
        throw new Error("El RUC/ID debe contener solo números.");
      }
      
      const nameParts = formData.fullName.trim().split(/\s+/);
      if (nameParts.length < 2) {
        throw new Error("Por favor, ingrese al menos un nombre y un apellido.");
      }
      
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.fullName)) {
        throw new Error("El nombre solo debe contener letras.");
      }

      // Generate temporary name and slug based on RUC
      const tempName = `Empresa ${formData.taxId}`;
      const tempSlug = `ruc-${formData.taxId}-${Math.random().toString(36).substring(7)}`;

      await companyService.createCompany({
        name: tempName,
        slug: tempSlug,
        tax_id: formData.taxId,
        // We'll update the email/name in the profile later or via metadata
      });
      
      // Redirect to the info entry page (Profile/Setup)
      router.push("/dashboard/profile?new=true");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "No se pudo crear el catálogo. El RUC ya podría estar registrado.");
    } finally {
      setIsLoading(false);
    }
  };
   // ... rest of the file remains the same but with loading and error states handled below

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Visual Side (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 relative bg-primary overflow-hidden">
        {mounted && (
          <Image
            src="/hero.webp"
            alt="Business"
            fill
            className="object-cover opacity-30 grayscale"
            suppressHydrationWarning
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
        <div className="relative z-10 p-20 flex flex-col justify-end h-full animate-fade-in-up">
          <h2 className="text-5xl font-black text-primary-foreground leading-tight mb-6">
            LLEVA TU EMPRESA <br />
            AL SIGUIENTE <span className="text-accent underline">NIVEL</span>.
          </h2>
          <p className="text-primary-foreground/70 text-xl font-medium max-w-md">
            Únete a la red B2B más avanzada y digitaliza tu fuerza de ventas en minutos.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20 relative">
        <div className="absolute top-8 left-8 md:top-12 md:left-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
              <Image 
                src="/logo/logo-icon.png" 
                alt="Logo Icon" 
                width={40}
                height={40}
                className="object-contain"
                priority
                suppressHydrationWarning
              />
            </div>
            <div className="relative w-40 h-8">
              <Image 
                src="/logo/logo-text.png" 
                alt="B2B Empresas" 
                width={160}
                height={32}
                className="object-contain logo-emerald"
                priority
                suppressHydrationWarning
              />
            </div>
          </Link>
        </div>

        <div className="w-full max-w-md space-y-12 mt-12 md:mt-0">
          <div className="space-y-4 text-center">
            <h1 
              className="font-black tracking-tightest uppercase italic text-[#064e3b] leading-tight"
              style={{ fontFamily: "'Bodoni MT Black', 'Bodoni MT', serif" }}
            >
              <span className="text-2xl sm:text-4xl block whitespace-nowrap">TU CATALOGO DIGITAL</span>
              <span className="text-xl sm:text-3xl block whitespace-nowrap">"REGISTRATE GRATIS"</span>
            </h1>
            <div className="space-y-1 text-left text-muted-foreground font-bold text-xs sm:text-sm leading-tight tracking-tight">
              <p>Tenemos la Mejor Herramienta de Gestión Comercial Industrial</p>
              <p>Exclusivamente Clientes B2B - Compras y Ventas Corporativas</p>
              <p>“Su Catalogo Digital en 1 minutos y Sin Costo”</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 group">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center space-x-3 animate-shake">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <p className="text-red-500 text-xs font-black uppercase tracking-tight">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* 1. RUC/ID de Registro */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 animate-reveal">1. RUC/ID de Registro</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ej: 20601234567"
                  className="w-full bg-muted border-none p-4 rounded-2xl font-bold focus:ring-2 focus:ring-accent transition-all outline-none disabled:opacity-50"
                  value={formData.taxId}
                  onChange={(e) => setFormData({...formData, taxId: e.target.value.replace(/\D/g, '')})}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* 2. Correo Corporativo */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 animate-reveal [animation-delay:100ms]">2. Correo Corporativo</label>
                <input
                  type="email"
                  placeholder="juan@tuempresa.com"
                  className="w-full bg-muted border-none p-4 rounded-2xl font-bold focus:ring-2 focus:ring-accent transition-all outline-none disabled:opacity-50"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* 3. Nombre Completo – Administrador */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 animate-reveal [animation-delay:200ms]">3. Nombre Completo – Administrador</label>
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  className="w-full bg-muted border-none p-4 rounded-2xl font-bold focus:ring-2 focus:ring-accent transition-all outline-none disabled:opacity-50"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')})}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground p-5 rounded-2xl text-lg font-black uppercase tracking-wider hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                "Crear mi Catálogo"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground font-medium">
            ¿Ya tienes una cuenta? <a href="#" className="text-primary font-black underline decoration-accent decoration-2 underline-offset-4">Inicia Sesión</a>
          </p>
        </div>
      </div>
    </div>
  );
}
