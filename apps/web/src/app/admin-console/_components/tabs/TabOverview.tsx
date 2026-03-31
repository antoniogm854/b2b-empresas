"use client";

import { BarChart3, Users, AlertCircle, Zap, TrendingUp } from "lucide-react";
import { AdminStats } from "@/lib/admin-service";
import { useTranslations } from "next-intl";

interface TabOverviewProps {
  stats: AdminStats | null;
}

export function TabOverview({ stats }: TabOverviewProps) {
  const t = useTranslations('AdminConsole');
  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-[500px]">
      <BarChart3 size={48} className="text-accent mb-8 animate-pulse" />
      <h3 className="text-3xl font-black text-primary mb-4">{t('ecosystem_active')}</h3>
      <p className="text-muted-foreground font-bold text-center mb-8 max-w-sm">
        {t('ecosystem_desc')}
      </p>
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4">
          {[
            { id: "stat-companies", label: t('stats_total'), val: stats.totalCompanies, icon: Users, color: "bg-blue-500" },
            { id: "stat-verifications", label: t('stats_pending'), val: stats.pendingVerifications, icon: AlertCircle, color: "bg-orange-500" },
            { id: "stat-showcase", label: t('stats_vitrina'), val: stats.activeShowcase, icon: Zap, color: "bg-accent" },
            { id: "stat-leads", label: t('stats_leads'), val: stats.totalMarketplaceLeads, icon: TrendingUp, color: "bg-green-500" },
          ].map((s) => (
            <div key={s.id} id={s.id} className="bg-white p-6 rounded-[2.5rem] border-2 border-primary/5 shadow-xl hover:translate-y-[-4px] transition-all group text-center">
              <div className={`w-10 h-10 ${s.color} rounded-xl mb-3 flex items-center justify-center text-white shadow-lg mx-auto`}>
                <s.icon size={20} />
              </div>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-3xl font-black text-primary group-hover:text-accent transition-colors">{s.val}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
