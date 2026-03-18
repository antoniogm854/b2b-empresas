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
      // In a real scenario, we would also create a profile/user first
      // For this phase, we insert into companies table directly
      await companyService.createCompany({
        name: formData.companyName,
        slug: formData.slug,
        // email and fullName would typically go to a profiles table
      });
      
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError("No se pudo crear el catálogo. El enlace o nombre ya podrían estar en uso.");
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
            <p className="text-muted-foreground font-semibold">Crea tu cuenta de proveedor y publica tu primer catálogo.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 group">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center space-x-3 animate-shake">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <p className="text-red-500 text-xs font-black uppercase tracking-tight">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  className="w-full bg-muted border-none p-4 rounded-2xl font-bold focus:ring-2 focus:ring-accent transition-all outline-none disabled:opacity-50"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Correo Corporativo</label>
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

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nombre de la Empresa</label>
                <input
                  type="text"
                  placeholder="Ej: Importaciones Industriales"
                  className="w-full bg-muted border-none p-4 rounded-2xl font-bold focus:ring-2 focus:ring-accent transition-all outline-none disabled:opacity-50"
                  value={formData.companyName}
                  onChange={(e) => {
                    const val = e.target.value;
                    const slug = val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                    setFormData({...formData, companyName: val, slug: slug});
                  }}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">URL de tu Catálogo</label>
                <div className="flex items-center bg-muted p-4 rounded-2xl">
                  <span className="text-muted-foreground font-bold mr-1">b2bempresas.com/</span>
                  <input
                    type="text"
                    placeholder="tu-empresa"
                    className="flex-1 bg-transparent border-none font-bold outline-none text-primary disabled:opacity-50"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    disabled={isLoading}
                    required
                  />
                </div>
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
