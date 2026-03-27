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
        <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle, #4B6319 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.1}} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none" />

      {/* Logo Overlay */}
      <div className="absolute top-10 left-10 z-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl group-hover:bg-white/10 transition-all shadow-2xl">
            <Image 
              src="/logo/logo-icon.png" 
              alt="Logo Icon" 
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black uppercase tracking-tighter italic text-white leading-none">
              B2B
            </span>
            <span className="text-2xl font-black uppercase tracking-tighter italic text-[var(--primary)] leading-none">
              EMPRESAS
            </span>
          </div>
        </Link>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-lg px-6 animate-reveal">
        <div className="bg-slate-900/40 backdrop-blur-3xl p-10 md:p-14 rounded-[3.5rem] border border-white/10 shadow-2xl shadow-black/50 space-y-12">
          
          <div className="space-y-4 text-center">
            <div className="inline-block px-4 py-1.5 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-full mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)]">
                Acceso Corporativo Verificado
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-white flex flex-col leading-none">
              <span>{t('welcome_title')}</span>
              <span className="text-[var(--primary)]">{t('welcome_accent')}</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto opacity-70">
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
                <div className="p-6 bg-white/5 border border-[var(--primary)]/30 rounded-3xl text-center space-y-4">
                  <div className="w-16 h-16 bg-[var(--primary)]/20 rounded-2xl flex items-center justify-center mx-auto text-[var(--primary)] border border-[var(--primary)]/30">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Sesión Activa Detectada</p>
                    <p className="text-sm font-black text-white truncate px-4">{sessionUser.email}</p>
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
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 group-focus-within:text-[var(--primary)] transition-colors">
                      {t('email_label')}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        autoComplete="off"
                        placeholder={t('email_placeholder')}
                        className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-bold text-white focus:border-[var(--primary)] focus:bg-white/10 transition-all outline-none disabled:opacity-50 text-sm shadow-inner"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={isLoading}
                        required
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20">
                        <ShieldCheck size={20} className="text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 group-focus-within:text-[var(--primary)] transition-colors">
                      {t('password_label')}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        autoComplete="new-password"
                        placeholder={t('password_placeholder')}
                        className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-bold text-white focus:border-[var(--primary)] focus:bg-white/10 transition-all outline-none disabled:opacity-50 text-sm shadow-inner"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        disabled={isLoading}
                        required
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20">
                        <Save size={20} className="text-white" />
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

             {!isStandalone && (
               <div className="mt-8 pt-8 border-t border-white/5 w-full text-center">
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
           <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/30 italic">
             LATAM INDUSTRIAL PLATFORM v2.05-PRO | IDENTITY SECURED
           </span>
        </div>
      </div>
    </div>
  );

}
