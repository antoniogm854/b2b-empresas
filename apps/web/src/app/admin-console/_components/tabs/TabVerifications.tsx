"use client";

import { ShieldCheck, Filter, CheckCircle2, XCircle, Building2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface PendingCompany {
  id: string;
  name?: string;
  company_name?: string;
  tax_id?: string;
  ruc_rut_nit?: string;
  industry?: string;
  sector?: string;
}

interface TabVerificationsProps {
  pendingCompanies: PendingCompany[];
  onVerify: (id: string, status: boolean) => void;
}

export function TabVerifications({ pendingCompanies, onVerify }: TabVerificationsProps) {
  const t = useTranslations('AdminConsole');
  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black text-primary flex items-center">
          <ShieldCheck className="mr-3 text-accent" />
          {t('verifications_title')}
        </h3>
        <div className="flex items-center space-x-3 text-xs font-bold text-muted-foreground">
          <Filter size={14} />
          <span>{t('verifications_filter')}</span>
        </div>
      </div>

      <div className="space-y-4">
        {pendingCompanies.length > 0 ? (
          pendingCompanies.map((c) => (
            <div key={c.id} className="group p-6 bg-slate-50 hover:bg-white border-2 border-transparent hover:border-accent rounded-[2.5rem] transition-all flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center border border-slate-200">
                  <Building2 className="text-slate-300" size={32} />
                </div>
                <div>
                  <p className="font-black text-lg text-primary">{c.company_name || c.name}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">RUC: {c.ruc_rut_nit || c.tax_id || "N/A"}</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[9px] font-black uppercase tracking-tighter">{c.sector || c.industry}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  id={`verify-approve-${c.id}`}
                  onClick={() => onVerify(c.id, true)}
                  className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                >
                  <CheckCircle2 size={24} />
                </button>
                <button
                  id={`verify-reject-${c.id}`}
                  onClick={() => onVerify(c.id, false)}
                  className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground italic">
            <CheckCircle2 size={48} className="mb-4 text-slate-200" />
            <p>{t('verifications_empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
