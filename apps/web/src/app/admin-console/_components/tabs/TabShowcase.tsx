"use client";

import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";

interface PendingShowcase {
  id: string;
  name: string;
  price: number;
  companies: { name: string } | { name: string }[];
}

interface TabShowcaseProps {
  pendingShowcase: PendingShowcase[];
  onAction: (id: string, action: "approved" | "rejected") => void;
}

export function TabShowcase({ pendingShowcase, onAction }: TabShowcaseProps) {
  const t = useTranslations('AdminConsole');
  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black text-primary flex items-center">
          <Zap className="mr-3 text-accent" />
          {t('showcase_title')}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pendingShowcase.length > 0 ? (
          pendingShowcase.map((ad) => (
            <div key={ad.id} className="p-8 bg-slate-50 rounded-[3rem] border-2 border-transparent hover:border-accent hover:bg-white transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                    {Array.isArray(ad.companies) ? ad.companies[0]?.name : ad.companies?.name}
                  </p>
                  <h4 className="text-xl font-black text-primary leading-tight">{ad.name}</h4>
                </div>
                <p className="text-2xl font-black text-accent">${ad.price}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => onAction(ad.id, "approved")}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent transition-colors shadow-xl"
                >
                  {t('showcase_approve_btn')}
                </button>
                <button
                  onClick={() => onAction(ad.id, "rejected")}
                  className="px-6 border-2 border-red-200 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-colors"
                >
                  {t('showcase_reject_btn')}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center py-20 text-muted-foreground italic">
            <Zap size={48} className="mb-4 text-slate-200" />
            <p>{t('showcase_empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
