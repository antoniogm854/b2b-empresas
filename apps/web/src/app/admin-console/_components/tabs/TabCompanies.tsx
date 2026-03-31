"use client";

import { Users, Building2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface TabCompaniesProps {
  allCompanies: any[];
}

export function TabCompanies({ allCompanies }: TabCompaniesProps) {
  const t = useTranslations('AdminConsole');
  return (
    <div className="p-10 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-3xl font-black text-primary flex items-center italic tracking-tighter">
          <Users className="mr-4 text-accent" size={32} />
          {t('companies_title')}
        </h3>
        <div className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
          {t('companies_total', { count: allCompanies.length })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {allCompanies.length > 0 ? (
          allCompanies.map((c: any) => (
            <div key={c.id} className="group p-8 bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-accent rounded-[3rem] transition-all flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center space-x-8 mb-4 md:mb-0">
                <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center border-2 border-slate-100 shadow-inner group-hover:border-accent/20 transition-colors">
                  <Building2 className="text-slate-300 group-hover:text-accent transition-colors" size={36} />
                </div>
                <div>
                  <p className="font-black text-2xl text-primary tracking-tight">{c.company_name || "Sin Razón Social"}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="text-xs font-black text-accent uppercase tracking-[0.2em]">{c.ruc_rut_nit}</span>
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {c.status === "active" ? t('companies_status_active') : t('companies_status_suspended')}
                    </span>
                    <div className="h-4 w-[1px] bg-slate-200" />
                    <div className="flex flex-col md:flex-row gap-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CUUP: <span className="text-primary">{c.cuup || "N/A"}</span></span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-0 md:border-l border-slate-200 md:pl-3">CID-CUIE: <span className="text-primary font-bold italic">{c.sku_cuie || "N/A"}</span></span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider italic">
                    Registrado el: {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => window.open(`/cdb2b/${c.id}`, "_blank")}
                className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-accent hover:text-primary transition-all shadow-lg active:scale-95"
              >
                {t('companies_view_btn')}
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-muted-foreground bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
            <Users size={64} className="mb-6 text-slate-200 animate-pulse" />
            <p className="font-black uppercase tracking-[0.3em] text-xs">{t('companies_empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
