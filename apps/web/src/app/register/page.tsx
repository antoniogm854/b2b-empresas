"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    companyName: "",
    slug: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit:", formData);
    // Success simulation
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Visual Side (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 relative bg-primary overflow-hidden">
        <Image
          src="/hero.png"
          alt="Business"
          fill
          className="object-cover opacity-30 grayscale"
        />
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
      <div className="flex-1 flex items-center justify-center p-8 md:p-20">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tightest uppercase italic">Comienza Gratis</h1>
            <p className="text-muted-foreground font-semibold">Crea tu cuenta de proveedor y publica tu primer catálogo.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 group">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  className="w-full bg-muted border-none p-4 rounded-2xl font-bold focus:ring-2 focus:ring-accent transition-all outline-none"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Correo Corporativo</label>
                <input
                  type="email"
                  placeholder="juan@tuempresa.com"
                  className="w-full bg-muted border-none p-4 rounded-2xl font-bold focus:ring-2 focus:ring-accent transition-all outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nombre de la Empresa</label>
                <input
                  type="text"
                  placeholder="Ej: Importaciones Industriales"
                  className="w-full bg-muted border-none p-4 rounded-2xl font-bold focus:ring-2 focus:ring-accent transition-all outline-none"
                  value={formData.companyName}
                  onChange={(e) => {
                    const val = e.target.value;
                    const slug = val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                    setFormData({...formData, companyName: val, slug: slug});
                  }}
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
                    className="flex-1 bg-transparent border-none font-bold outline-none text-primary"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground p-5 rounded-2xl text-lg font-black uppercase tracking-wider hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/20"
            >
              Crear mi Catálogo
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
