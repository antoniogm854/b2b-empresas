"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth-service";
import { useTranslations } from "next-intl";
import { ShieldCheck, Save, Loader2, MonitorDown } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export default function LoginClient() {
  const router = useRouter();
  const t = useTranslations("Login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [nextUrl, setNextUrl] = useState<string>("/dashboard");
  const { isInstallable, isStandalone, installApp } = usePWAInstall();

  useEffect(() => {
    setMounted(true);
    
    // Check if we need to force re-validation (from Master or PWA)
    const params = new URLSearchParams(window.location.search);
    const forceWelcome = params.get('mode') === 'welcome';
    const next = params.get('next');
    if (next) setNextUrl(next);

    if (forceWelcome) {
      authService.signOut().then(() => {
        setSessionUser(null);
      });
    } else {
      authService.getCurrentUser().then(user => {
        if (user) setSessionUser(user);
      });
    }
  }, []);

  const handleContinue = () => {
    router.push(nextUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { user } = await authService.signIn(
        formData.email,
        formData.password
      );

      if (user) {
        router.push(nextUrl);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(t('error_invalid'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Por favor, ingresa tu correo primero.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword(formData.email);
      setResetSent(true);
    } catch (err: any) {
      console.error("Reset error:", err);
      setError("No se pudo enviar el correo de recuperación.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full">
      {/* Login Card content with glass effect optimized for AuthLayout */}
      <div className="bg-white/95 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border-2 border-[var(--primary)]/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] space-y-10 animate-reveal">
          
          <div className="space-y-4 text-center">
            <div className="inline-block px-4 py-1.5 bg-[var(--primary)]/5 border border-[var(--primary)]/10 rounded-full mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)]">
                Acceso Corporativo Verificado
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-[var(--strong-text)] flex flex-col leading-none">
              <span>{t('welcome_title')}</span>
              <span className="text-[var(--primary)]">{t('welcome_accent')}</span>
            </h1>
            <p className="text-[var(--panel-subtext)] text-xs font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
              {t('welcome_desc')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl flex items-center space-x-4 animate-shake">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>
              </div>
            )}

            {resetSent && (
              <div className="bg-[#A2C367]/10 border border-[#A2C367]/20 p-5 rounded-3xl flex items-center space-x-4 border-dashed">
                <div className="w-2.5 h-2.5 bg-[#A2C367] rounded-full animate-pulse" />
                <p className="text-[#A2C367] text-[10px] font-black uppercase tracking-widest">Link de recuperación enviado. Revisa tu correo.</p>
              </div>
            )}

            {sessionUser ? (
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 border-2 border-[var(--primary)]/20 rounded-[2rem] text-center space-y-4">
                  <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center mx-auto text-[var(--primary)] border border-[var(--primary)]/20">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--panel-subtext)] mb-1">Sesión Activa Detectada</p>
                    <p className="text-sm font-black text-[var(--strong-text)] truncate px-4">{sessionUser.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="group relative w-full bg-[var(--primary)] text-white py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] overflow-hidden hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-[var(--primary)]/20 shadow-glow"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10">CONTINUAR AL PANEL</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={async () => {
                      await authService.signOut();
                      setSessionUser(null);
                    }}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors py-2"
                  >
                    Usar Otra Cuenta
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--panel-subtext)] ml-1 group-focus-within:text-[var(--primary)] transition-colors">
                      {t('email_label')}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        autoComplete="off"
                        placeholder={t('email_placeholder')}
                        className="w-full bg-white border-2 border-slate-200 p-5 rounded-2xl font-bold text-[var(--strong-text)] focus:border-[var(--primary)] focus:bg-white transition-all outline-none disabled:opacity-50 text-sm shadow-sm"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={isLoading}
                        required
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-40">
                        <ShieldCheck size={20} className="text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--panel-subtext)] ml-1 group-focus-within:text-[var(--primary)] transition-colors">
                      {t('password_label')}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        autoComplete="new-password"
                        placeholder={t('password_placeholder')}
                        className="w-full bg-white border-2 border-slate-200 p-5 rounded-2xl font-bold text-[var(--strong-text)] focus:border-[var(--primary)] focus:bg-white transition-all outline-none disabled:opacity-50 text-sm shadow-sm"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        disabled={isLoading}
                        required
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-40">
                        <Save size={20} className="text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end px-1">
                    <button 
                      type="button" 
                      onClick={handleForgotPassword}
                      className="text-[9px] font-black uppercase tracking-widest text-[#A2C367] hover:text-white transition-all hover:underline underline-offset-4"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full bg-[var(--primary)] text-white py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] overflow-hidden hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-[var(--primary)]/20"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <div className="relative z-10 flex items-center justify-center gap-4">
                    {isLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>{t('btn_loading')}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('btn_submit')}</span>
                        <ShieldCheck size={20} />
                      </>
                    )}
                  </div>
                </button>
              </>
            )}
          </form>

          <div className="pt-2 text-center">
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed text-center w-full">
               {t('no_account')} <br />
               <Link href="/register" className="text-[var(--primary)] hover:text-white transition-colors underline decoration-[var(--primary)] decoration-2 underline-offset-8">
                 {t('register_link')}
               </Link>
             </p>

             {mounted && !isStandalone && (
               <div className="mt-8 pt-8 border-t border-white/5 w-full text-center animate-fade-in delay-700">
                 <button 
                  type="button"
                  onClick={installApp}
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#A2C367] hover:text-white transition-all bg-white/5 px-6 py-3 rounded-full border border-[#A2C367]/20 hover:border-[#A2C367]/50 shadow-glow shadow-[#A2C367]/10"
                 >
                   <MonitorDown size={14} />
                   <span>¿Perdiste tu icono? Recuperar Acceso Escritorio</span>
                 </button>
               </div>
             )}
          </div>
        </div>

        {/* System ID Badge */}
        <div className="mt-8 text-center animate-fade-in delay-500">
           <span className="text-[8px] font-black uppercase tracking-[0.5em] text-[var(--panel-subtext)] opacity-40 italic">
             LATAM INDUSTRIAL PLATFORM v2.05-PRO | IDENTITY SECURED
           </span>
      </div>
    </div>
  );
}
