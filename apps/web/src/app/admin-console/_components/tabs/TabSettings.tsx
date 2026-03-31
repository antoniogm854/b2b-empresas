"use client";

import { Building2 } from "lucide-react";
import { SiteSettings } from "@/lib/settings-service";
import { useTranslations } from "next-intl";

interface TabSettingsProps {
  siteSettings: SiteSettings;
  isSaving: boolean;
  onChange: (settings: SiteSettings) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function TabSettings({ siteSettings, isSaving, onChange, onSubmit }: TabSettingsProps) {
  const t = useTranslations('AdminConsole');
  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-black text-primary flex items-center">
          <Building2 className="mr-3 text-accent" />
          {t('settings_title')}
        </h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { label: t('settings_name'), field: "company_name", type: "text" },
            { label: t('settings_whatsapp'), field: "support_phone", type: "text" },
            { label: t('settings_email'), field: "support_email", type: "email" },
            { label: t('settings_address'), field: "address", type: "text" },
          ].map(({ label, field, type }) => (
            <div key={field} className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">{label}</label>
              <input
                type={type}
                value={(siteSettings as any)[field] || ""}
                onChange={(e) => onChange({ ...siteSettings, [field]: e.target.value })}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-accent rounded-2xl p-4 font-bold outline-none transition-all"
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">{t('settings_about')}</label>
          <textarea
            value={siteSettings.about_us || ""}
            onChange={(e) => onChange({ ...siteSettings, about_us: e.target.value })}
            rows={4}
            className="w-full bg-slate-50 border-2 border-transparent focus:border-accent rounded-2xl p-4 font-bold outline-none transition-all resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">{t('settings_whatsapp_msg')}</label>
          <input
            type="text"
            value={siteSettings.whatsapp_message || ""}
            onChange={(e) => onChange({ ...siteSettings, whatsapp_message: e.target.value })}
            className="w-full bg-slate-50 border-2 border-transparent focus:border-accent rounded-2xl p-4 font-bold outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent transition-all shadow-xl shadow-primary/10 disabled:opacity-50"
        >
          {isSaving ? t('settings_saving_btn') : t('settings_save_btn')}
        </button>
      </form>
    </div>
  );
}
