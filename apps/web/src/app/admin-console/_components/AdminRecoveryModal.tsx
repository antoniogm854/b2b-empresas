"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertCircle, KeyRound, Mail, Eye, EyeOff, X as XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const ADMIN_MASTER = {
  role: "Administrador General",
  user: "AGM - AG",
  email: "antoniogranda.m@gmail.com",
  password: "@SolucionesLatam159",
  phone: "990670153",
};

export function AdminRecoveryModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations('AdminConsole');
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [countdown, setCountdown] = useState(25);

  React.useEffect(() => {
    if (verified) {
      const t = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { clearInterval(t); onClose(); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(t);
    }
  }, [verified, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === ADMIN_MASTER.email.toLowerCase()) {
      setVerified(true); setError("");
    } else {
      setError(t('recovery_error_email'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors">
          <XIcon size={24} />
        </button>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 mb-4">
            <KeyRound size={32} />
          </div>
          <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">{t('recovery_title')}</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {verified ? t('recovery_verified_desc') : t('recovery_unverified_desc')}
          </p>
        </div>

        {!verified && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('recovery_email_placeholder')}
                className="w-full border-2 border-slate-200 rounded-2xl px-5 py-4 pl-12 font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                required autoFocus />
            </div>
            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-500 text-xs font-bold">{error}</p>
              </div>
            )}
            <button type="submit" className="w-full bg-primary text-white font-black py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-3">
              {t('recovery_verify_btn')} <ShieldCheck size={18} />
            </button>
          </form>
        )}

        {verified && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center bg-green-500/10 border border-green-500/20 rounded-2xl p-3">
              <ShieldCheck size={18} className="text-green-500" />
              <span className="text-green-600 font-black text-sm uppercase tracking-wide">{t('recovery_identity_confirmed')}</span>
            </div>
            <div className="bg-slate-50 border-2 border-primary/10 rounded-2xl p-5 space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('recovery_credentials_label')}</p>
              {[
                { label: t('recovery_role'), value: ADMIN_MASTER.role },
                { label: t('recovery_user'), value: ADMIN_MASTER.user },
                { label: t('recovery_email'), value: ADMIN_MASTER.email },
                { label: t('recovery_phone'), value: ADMIN_MASTER.phone },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                  <code className="font-black text-primary text-sm">{item.value}</code>
                </div>
              ))}
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('recovery_password')}</span>
                <div className="flex items-center gap-3">
                  <code className="font-black text-primary text-sm">
                    {showPass ? ADMIN_MASTER.password : "•".repeat(ADMIN_MASTER.password.length)}
                  </code>
                  <button onClick={() => setShowPass((v) => !v)} className="text-slate-400 hover:text-primary transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
              <AlertCircle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-yellow-700 text-xs font-bold">
                {t.rich('recovery_security_notice', { seconds: countdown, strong: (chunks: any) => <strong>{chunks}</strong> })}
              </p>
            </div>
            <button onClick={onClose} className="w-full border-2 border-slate-200 text-slate-500 font-black py-3 rounded-2xl hover:border-red-400 hover:text-red-500 transition-all text-xs uppercase tracking-widest">
              {t('recovery_close_btn')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
