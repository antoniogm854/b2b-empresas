import MainLayout from "@/components/layout/MainLayout";
import { Leaf, Recycle, ArrowRight, CheckCircle2, Globe } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Sostenibilidad");
  return {
    title: t('seo_title'),
    description: t('seo_desc'),
  };
}

export default async function SostenibilidadPage() {
  const t = await getTranslations("Sostenibilidad");
  return (
    <MainLayout>
       {/* Hero Premium Section */}
       <div className="bg-[var(--deep-section)] text-white py-32 md:py-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/hero.webp')] opacity-10 mix-blend-overlay bg-cover bg-center scale-105"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[var(--background)] to-transparent"></div>
          <div className="container mx-auto px-6 relative z-10">
             <div className="max-w-4xl">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest italic">{t('badge')}</span>
                 </div>
                 <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                    <div className="p-4 bg-[var(--primary)] rounded-2xl shadow-2xl shadow-black/20">
                       <Leaf className="text-white" size={48} />
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter italic leading-[0.9]">
                        {t('h1')} <span className="text-[var(--accent)]">{t('h1_accent')}</span>
                    </h1>
                 </div>
                 <p className="text-xl md:text-2xl text-white/80 font-bold max-w-2xl leading-tight">
                    {t('subtitle')}
                 </p>
             </div>
          </div>
       </div>

       <div className="container mx-auto px-6 py-24 -mt-16 relative z-20">
          <div className="max-w-5xl mx-auto">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-12">
                   <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-black/[0.03] border border-gray-100">
                      <p className="text-3xl font-black uppercase tracking-tight text-[var(--strong-text)] leading-[1.1] mb-12 italic border-l-8 border-[var(--primary)] pl-8">
                        {t('quote')}
                      </p>

                      <article className="prose prose-lg prose-headings:font-black prose-headings:uppercase prose-h2:text-3xl prose-h2:text-[var(--strong-text)] prose-p:text-gray-600 prose-p:leading-relaxed max-w-none">
                         <h2>{t('art_h1')}</h2>
                         <p>
                           {t('art_p1')}
                         </p>

                         <h2>{t('art_h2')}</h2>
                         <p>
                           {t('art_p2')}
                         </p>
                      </article>

                      <div className="mt-16 p-10 bg-[var(--deep-section)] text-white rounded-[2rem] relative overflow-hidden group">
                         <div className="absolute inset-0 bg-[var(--primary)] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                         <div className="relative z-10 flex items-start gap-6">
                            <Recycle size={32} className="text-[var(--accent)] shrink-0 mt-1" />
                            <div>
                               <p className="text-xl font-black uppercase italic tracking-tight mb-2">{t('respect')}</p>
                               <p className="text-white/70 font-medium">{t('cta_desc')}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Sidebar / CTA */}
                <div className="lg:col-span-4 space-y-8">
                   <div className="bg-[var(--primary)] p-10 rounded-[3rem] text-white shadow-xl shadow-[var(--primary)]/20 sticky top-32">
                      <h3 className="text-2xl font-black uppercase italic tracking-tight mb-6">{t('sidebar_title')}</h3>
                      <ul className="space-y-4 mb-10">
                         {[
                            t('sidebar_item1'),
                            t('sidebar_item2'),
                            t('sidebar_item3'),
                            t('sidebar_item4')
                         ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-wide">
                               <CheckCircle2 size={18} className="text-[var(--accent)]" />
                               {item}
                            </li>
                         ))}
                      </ul>
                      <Link 
                        href="/register" 
                        className="group w-full bg-white text-[var(--strong-text)] py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[var(--accent)] transition-all shadow-lg"
                      >
                         {t('sidebar_btn')} <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                      </Link>
                   </div>

                   <div className="bg-gray-100 p-10 rounded-[3rem] border border-gray-200">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 italic">{t('docs_label')}</p>
                      <div className="flex items-center gap-4 text-[var(--strong-text)]">
                         <Globe size={32} className="text-[var(--primary)]" />
                         <span className="font-bold leading-tight uppercase text-xs">{t('audit_status')}</span>
                      </div>
                   </div>
                </div>

             </div>
          </div>
       </div>
    </MainLayout>
  )
}
