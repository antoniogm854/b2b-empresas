"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/lib/auth-service";
import { ShieldCheck, Save, Loader2, ArrowLeft } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.updatePassword(password);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Update password error:", err);
      setError("No se pudo actualizar la contraseña. El link puede haber expirado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {mounted && (
          <Image
            src="/b2b_industrial_bg_1774324220155.png"
            alt="Fondo Industrial"
            fill
            className="object-cover opacity-40 scale-105 animate-slow-zoom"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[var(--deep-section)]/80 to-slate-950 opacity-90" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-lg px-6 animate-reveal">
        <div className="bg-slate-900/40 backdrop-blur-3xl p-10 md:p-14 rounded-[3.5rem] border border-white/10 shadow-2xl shadow-black/50 space-y-12">
          
          <div className="space-y-4 text-center">
            <div className="inline-block px-4 py-1.5 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-full mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)]">
                Seguridad de Identidad
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-white flex flex-col leading-none">
              <span>REINICIAR</span>
              <span className="text-[var(--primary)]">CONTRASEÑA</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto opacity-70">
              Ingresa tu nueva clave de acceso industrial.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl flex items-center space-x-4 animate-shake">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-[#A2C367]/10 border border-[#A2C367]/20 p-5 rounded-3xl flex items-center space-x-4">
                <div className="w-2.5 h-2.5 bg-[#A2C367] rounded-full animate-pulse" />
                <p className="text-[#A2C367] text-[10px] font-black uppercase tracking-widest">Contraseña actualizada. Redirigiendo...</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-3 group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 group-focus-within:text-[var(--primary)] transition-colors">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-bold text-white focus:border-[var(--primary)] focus:bg-white/10 transition-all outline-none disabled:opacity-50 text-sm shadow-inner"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || success}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 group-focus-within:text-[var(--primary)] transition-colors">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-bold text-white focus:border-[var(--primary)] focus:bg-white/10 transition-all outline-none disabled:opacity-50 text-sm shadow-inner"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading || success}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="group relative w-full bg-[var(--primary)] text-white py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] overflow-hidden hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-[var(--primary)]/20"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <div className="relative z-10 flex items-center justify-center gap-4">
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>PROCESANDO...</span>
                  </>
                ) : (
                  <>
                    <span>ACTUALIZAR CLAVE</span>
                    <ShieldCheck size={20} />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="pt-2 text-center">
             <Link href="/login" className="inline-flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest hover:text-white transition-colors">
               <ArrowLeft size={14} />
               Volver al Login
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
