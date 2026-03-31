"use client";

import React from "react";
import { ShieldCheck, AlertCircle, KeyRound } from "lucide-react";
import { useTranslations } from "next-intl";

const ADMIN_MASTER = {
  role: "Administrador General",
  user: "AGM - AG",
  email: "antoniogranda.m@gmail.com",
  password: "@SolucionesLatam159",
  phone: "990670153",
};

interface AdminLoginGateProps {
  mounted: boolean;
  loginForm: { password: string };
  loginError: string;
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onRecovery: () => void;
}

export function AdminLoginGate({
  mounted,
  loginForm,
  loginError,
  onFormChange,
  onSubmit,
  onRecovery,
}: AdminLoginGateProps) {
  const t = useTranslations('AdminConsole');
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-[80px] group-hover:bg-accent/30 transition-all duration-1000" />

        <div className="relative z-10">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center shadow-2xl shadow-accent/20 mb-6 group-hover:scale-110 transition-transform duration-500" suppressHydrationWarning>
              {mounted && <ShieldCheck className="text-primary" size={40} />}
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">{t('title')}</h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">{t('admin_subtitle')}</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-2">{t('master_key_label')}</label>
                <div className="relative">
                  <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={loginForm.password}
                    onChange={(e) => onFormChange("password", e.target.value)}
                    className="w-full bg-white/5 border-2 border-white/10 rounded-[2rem] p-6 pl-14 text-white text-lg font-black outline-none focus:border-accent text-center tracking-widest transition-all shadow-inner"
                    required
                    autoComplete="current-password"
                    autoFocus
                  />
                </div>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center space-x-3 mt-4" suppressHydrationWarning>
                {mounted && <AlertCircle className="text-red-500" size={16} />}
                <p className="text-red-500 text-[10px] font-black uppercase leading-tight">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-accent text-primary py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-accent/20 mt-6 active:scale-95"
            >
              {t('unlock_btn')}
            </button>

            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={onRecovery}
                className="flex items-center gap-2 text-[10px] font-black text-white/30 hover:text-accent transition-colors uppercase tracking-widest"
              >
                <KeyRound size={12} />
                {t('forgot_password')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
