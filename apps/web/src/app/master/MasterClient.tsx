"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Lock, ShieldCheck, ChevronRight, LayoutDashboard, Settings, UserCheck, KeyRound, Mail, Eye, EyeOff, X, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

// ─── MASTER CREDENTIALS (single source of truth) ─────────────────────────────
const MASTER_KEY = "B2BMaster2024";
const ADMIN_EMAIL = "antoniogranda.m@gmail.com";
// ─────────────────────────────────────────────────────────────────────────────

type RecoveryStep = 'form' | 'success';

function RecoveryModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<RecoveryStep>('form');
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    if (step === 'success') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) { clearInterval(timer); onClose(); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, onClose]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      setStep('success');
      setError('');
    } else {
      setError('El correo ingresado no corresponde a ninguna cuenta maestra registrada.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6 animate-fade-in">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-8 shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 mb-4">
            <KeyRound size={32} />
          </div>
          <h2 className="text-2xl font-black text-[var(--strong-text)] uppercase tracking-tighter">Recuperar Acceso</h2>
          <p className="text-sm text-[var(--muted-foreground)] font-medium mt-1">
            {step === 'form' ? 'Ingresa tu email maestro para verificar tu identidad.' : 'Identidad verificada correctamente.'}
          </p>
        </div>

        {step === 'form' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email de la cuenta maestra"
                className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-2xl px-5 py-4 pl-12 text-base font-bold focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                required
                autoFocus
              />
            </div>
            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-500 text-xs font-bold">{error}</p>
              </div>
            )}
            <button type="submit" className="w-full bg-[var(--primary)] text-white font-black py-4 rounded-2xl hover:bg-[var(--deep-section)] transition-all shadow-lg flex items-center justify-center gap-3 group">
              Verificar Identidad <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 justify-center bg-green-500/10 border border-green-500/20 rounded-2xl p-3">
              <ShieldCheck size={20} className="text-green-500" />
              <span className="text-green-600 font-black text-sm uppercase tracking-wide">Identidad Confirmada</span>
            </div>

            {/* Master Key revealed */}
            <div className="bg-[var(--muted)] border-2 border-[var(--primary)]/20 rounded-2xl p-5 space-y-2">
              <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest">Clave Maestra — Acceso Corporativo</p>
              <div className="flex items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3">
                <code className="text-xl font-black text-[var(--primary)] tracking-widest">
                  {showKey ? MASTER_KEY : '•'.repeat(MASTER_KEY.length)}
                </code>
                <button onClick={() => setShowKey(v => !v)} className="text-gray-400 hover:text-[var(--primary)] transition-colors shrink-0">
                  {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
              <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-yellow-700 text-xs font-bold">
                No compartas esta clave. Esta ventana se cierra en <strong>{countdown}s</strong>.
              </p>
            </div>

            <button onClick={onClose} className="w-full bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] font-black py-3 rounded-2xl hover:border-red-400 hover:text-red-500 transition-all text-xs uppercase tracking-widest">
              Cerrar Ventana de Recuperación
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MasterClient() {
  const t = useTranslations("Master");
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === MASTER_KEY) {
      setIsUnlocked(true);
      setError("");
    } else {
      setError(t('error_invalid_key'));
    }
  };

  if (!mounted) return null;

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#050B18] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
          <Settings size={300} className="absolute -top-20 -left-20 text-white/5 animate-spin-slow blur-sm" />
          <Settings size={200} className="absolute top-1/2 -right-20 text-white/5 animate-reverse-spin blur-md" />
          <Settings size={150} className="absolute bottom-10 left-1/4 text-white/5 animate-spin-slow blur-sm opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050B18]/50 to-[#050B18]"></div>
        </div>

        {showRecovery && <RecoveryModal onClose={() => setShowRecovery(false)} />}

        {!isUnlocked ? (
          <div className="w-full max-w-md animate-fade-in">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"></div>
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-3xl flex items-center justify-center text-[var(--primary)] mb-4">
                  <Lock size={40} />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-black text-[var(--strong-text)] uppercase tracking-tighter">{t('lock_title')}</h1>
                  <p className="text-sm text-[var(--muted-foreground)] font-medium">{t('lock_subtitle')}</p>
                </div>
                <form onSubmit={handleUnlock} className="w-full space-y-4 pt-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('password_placeholder')}
                    className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-2xl px-6 py-4 text-center text-lg font-bold focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all placeholder:text-gray-400"
                    autoFocus
                  />
                  {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest animate-shake">{error}</p>}
                  <button type="submit" className="w-full bg-[var(--primary)] text-white font-black py-4 rounded-2xl hover:bg-[var(--deep-section)] transition-all shadow-lg flex items-center justify-center gap-3 group">
                    {t('unlock_btn')} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                {/* ── Recovery Link ── */}
                <button
                  onClick={() => setShowRecovery(true)}
                  className="flex items-center gap-2 text-[10px] font-black text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors uppercase tracking-widest"
                >
                  <KeyRound size={12} />
                  ¿Olvidaste la clave maestra?
                </button>

                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  {t('footer_text')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl animate-fade-in-up">
            <div className="text-center mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-black text-[10px] uppercase tracking-widest border border-[var(--primary)]/20">
                <UserCheck size={14} /> {t('verified_badge')}
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-[var(--strong-text)] uppercase tracking-tighter italic leading-none drop-shadow-2xl">
                <span className="block text-white mb-2">{t('red')}</span>
                <span className="text-gold-maestra">{t('maestra').slice(0, 4)}<span className="brand-t-detail text-gold-maestra">{t('maestra').slice(4, 5)}</span>{t('maestra').slice(5)}</span>
              </h2>
              <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px] pt-8">{t('strategy')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link href="/login?mode=welcome&next=/dashboard" className="group">
                <div className="bg-[var(--card)] border border-[var(--border)] p-10 rounded-[3rem] hover:border-[var(--primary)] hover:shadow-2xl transition-all h-full relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-[var(--primary)]/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-[var(--primary)]/20">
                      <LayoutDashboard size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-[var(--strong-text)] uppercase mb-4 tracking-tight">{t('login_title')}</h3>
                    <p className="text-[var(--muted-foreground)] font-medium mb-8 leading-relaxed">{t('login_desc')}</p>
                    <div className="mt-auto flex items-center text-[var(--primary)] font-black uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
                      {t('login_btn')} <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/login?mode=welcome&next=/admin-console" className="group">
                <div className="bg-[var(--card)] border border-[var(--border)] p-10 rounded-[3rem] hover:border-[var(--accent)] hover:shadow-2xl transition-all h-full relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-[var(--accent)]/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="w-16 h-16 bg-[var(--deep-section)] rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-black/20">
                      <Settings size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-[var(--strong-text)] uppercase mb-4 tracking-tight">{t('admin_title')}</h3>
                    <p className="text-[var(--muted-foreground)] font-medium mb-8 leading-relaxed">{t('admin_desc')}</p>
                    <div className="mt-auto flex items-center text-[var(--accent)] font-black uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
                      {t('admin_btn')} <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="mt-16 text-center">
              <button onClick={() => setIsUnlocked(false)} className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] hover:text-red-500 transition-colors">
                {t('logout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
