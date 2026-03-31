import PublicLayout from "@/components/layout/PublicLayout";
import { Search, Filter, BookOpen, Calendar, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Industrial B2B | Estrategia y Digitalización",
  description: "Artículos, guías y tendencias sobre la transformación digital en el sector industrial de Latinoamérica.",
};

export default function BlogPage() {
  const posts = [
    {
      title: "Cómo digitalizar tu inventario industrial en 10 minutos",
      desc: "Guía paso a paso para pymes que buscan venderle a las grandes mineras sin complicaciones tecnológicas.",
      category: "Guías B2B",
      date: "25 Marzo, 2026",
      image: "/hero.webp",
      slug: "digitalizar-inventario-industrial"
    },
    {
      title: "El impacto de las Alertas WhatsApp en la tasa de cierre comercial",
      desc: "Descubre por qué saber exactamente cuándo te visitan duplica tus posibilidades de éxito en la venta técnica.",
      category: "Estrategia",
      date: "20 Marzo, 2026",
      image: "/media__1774640163823.png",
      slug: "impacto-alertas-whatsapp"
    },
    {
      title: "Validación RUC: La importancia de la formalidad en la red B2B",
      desc: "Por qué b2bempresas.com solo permite empresas verificadas y cómo esto beneficia a tu SEO industrial.",
      category: "Seguridad",
      date: "15 Marzo, 2026",
      image: "/media__1774640790242.png",
      slug: "validacion-ruc-formalidad"
    }
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto px-6 py-32">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-[var(--strong-text)]">
              Blog del <span className="text-[var(--primary)]">Sector</span>
            </h1>
            <p className="text-xl text-[var(--panel-subtext)] font-medium max-w-2xl">
              Novedades, estrategias de venta industrial y actualizaciones críticas de la plataforma b2bempresas.com.
            </p>
          </div>

          <div className="w-full lg:w-96">
             <div className="relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
               <input 
                 type="text" 
                 placeholder="Buscar artículos..." 
                 className="w-full bg-white dark:bg-zinc-900 border border-[var(--border)] py-5 pl-16 pr-6 rounded-2xl focus:border-[var(--primary)] outline-none font-bold italic"
               />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
           <div className="lg:col-span-8 space-y-12">
              {posts.map((post, i) => (
                <article key={i} className="glass overflow-hidden rounded-[3rem] border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row shadow-sm hover:shadow-2xl transition-all group">
                   <div className="w-full md:w-2/5 aspect-square relative overflow-hidden bg-zinc-950">
                      <Image 
                        src={post.image} 
                        alt={post.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                      />
                   </div>
                   <div className="p-10 md:p-12 flex flex-col justify-between flex-grow">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                           <span className="text-[var(--primary)]">{post.category}</span>
                           <span className="text-zinc-500">• {post.date}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic text-[var(--strong-text)] leading-tight">
                           {post.title}
                        </h2>
                        <p className="text-sm text-[var(--panel-subtext)] font-medium leading-relaxed">
                           {post.desc}
                        </p>
                      </div>
                      <Link 
                        href={`/blog/${post.slug}`} 
                        className="mt-8 text-[var(--primary)] text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all"
                      >
                         Leer Artículo Completo <ArrowRight size={16} />
                      </Link>
                   </div>
                </article>
              ))}
           </div>

           <aside className="lg:col-span-4 space-y-12">
              <div className="glass p-10 rounded-[3rem] border-zinc-200 dark:border-zinc-800 space-y-8">
                 <h3 className="text-xl font-black uppercase tracking-widest italic text-[var(--strong-text)]">Tendencias</h3>
                 <div className="space-y-6">
                   {[
                     "Alertas WhatsApp en SMB Industriales",
                     "El auge de la venta B2B directa",
                     "Ciberseguridad en catálogos SAAS"
                   ].map((trend, i) => (
                     <div key={i} className="flex gap-4 items-start group cursor-pointer">
                        <TrendingUp size={20} className="text-[var(--primary)] shrink-0 mt-1" />
                        <p className="text-sm font-bold text-[var(--panel-subtext)] group-hover:text-[var(--primary)] transition-colors">{trend}</p>
                     </div>
                   ))}
                 </div>
              </div>
           </aside>
        </div>
      </div>
    </PublicLayout>
  );
}
