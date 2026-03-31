"use client";

import { Lock, XCircle, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

type TabKey = "overview" | "verifications" | "companies" | "showcase" | "catalog" | "diagnostics" | "settings";

const TAB_KEYS: TabKey[] = ["overview", "verifications", "companies", "showcase", "catalog", "diagnostics", "settings"];

interface AdminSidebarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onLogout: () => void;
}

export function AdminSidebar({ activeTab, onTabChange, onLogout }: AdminSidebarProps) {
  const t = useTranslations('AdminConsole');
  return (
    <div className="lg:col-span-3 flex flex-col gap-8">
      <div>
        <div className="flex items-center space-x-2 text-accent mb-2">
          <Lock size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('owner_access')}</span>
        </div>
        <h1 id="admin-title" className="text-4xl md:text-5xl font-black text-primary leading-tight">
          ADMIN <br /><span className="text-accent">MASTER</span>
        </h1>
        <p className="text-xs text-muted-foreground font-bold italic mt-2">{t('desc')}</p>
      </div>

      <div className="flex flex-col gap-2 bg-white p-3 rounded-[2rem] border-2 border-primary/5 shadow-xl">
        {TAB_KEYS.map((tab) => (
          <button
            key={tab}
            id={`tab-${tab}`}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all text-left flex items-center justify-between ${
              activeTab === tab
                ? "bg-primary text-white shadow-lg scale-[1.02]"
                : "text-muted-foreground hover:bg-slate-50 hover:text-primary"
            }`}
          >
            <span>{t(tab)}</span>
            {activeTab === tab && <ChevronRight size={16} className="text-accent" />}
          </button>
        ))}
      </div>

      <button
        onClick={onLogout}
        className="bg-red-500 text-white w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-2 mt-auto"
      >
        <XCircle size={16} />
        {t('logout')}
      </button>
    </div>
  );
}
