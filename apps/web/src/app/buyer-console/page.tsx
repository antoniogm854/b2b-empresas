"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  FileText, 
  Filter, 
  MessageSquare, 
  Package, 
  Search, 
  Star,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

export default function BuyerConsolePage() {
  const [activeTab, setActiveTab] = useState("all");

  const rfqs = [
    {
      id: "RFQ-1029",
      product: "Motor Eléctrico Trifásico 10HP",
      category: "Motores e Ingeniería",
      date: "12 Mar 2024",
      status: "open",
      quotes: [
        { supplier: "TECSUP S.A.", price: 1250, delivery: "3 días", rating: 4.8, status: "received" },
        { supplier: "INDUMARKET", price: 1180, delivery: "7 días", rating: 4.5, status: "received" },
        { supplier: "MOTORES LIMA", price: 1300, delivery: "1 día", rating: 4.9, status: "received" },
      ]
    },
    {
      id: "RFQ-1030",
      product: "Fajas Industriales Reforzadas (Set 50)",
      category: "Mantenimiento",
      date: "14 Mar 2024",
      status: "pending",
      quotes: []
    }
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-slate-50 p-8 pt-32">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tightest uppercase italic">Consola <span className="text-accent underline decoration-8 decoration-accent/10 underline-offset-[-5px]">Estratégica</span></h1>
              <p className="text-slate-500 font-bold">Gestione sus licitaciones de alta precisión en el ecosistema B2B Empresas.</p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
               <div className="bg-white p-5 rounded-[2rem] shadow-xl shadow-black/5 border border-slate-100 flex items-center gap-4 min-w-[200px]">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <FileText className="text-blue-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Solicitaciones</p>
                    <p className="text-2xl font-black text-slate-900 leading-none">12</p>
                  </div>
               </div>
               <div className="bg-white p-5 rounded-[2rem] shadow-xl shadow-black/5 border border-slate-100 flex items-center gap-4 min-w-[200px]">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="text-green-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ofertas B2B</p>
                    <p className="text-2xl font-black text-slate-900 leading-none">45</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
              {["all", "open", "pending", "closed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition ${
                    activeTab === tab ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {tab === 'all' ? 'Todas' : tab === 'open' ? 'Abiertas' : tab === 'pending' ? 'Pendientes' : 'Cerradas'}
                </button>
              ))}
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar en mis solicitudes..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          {/* RFQ List */}
          <div className="space-y-6">
            {rfqs.map((rfq) => (
              <div key={rfq.id} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden transition hover:shadow-2xl">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg uppercase">
                          {rfq.id}
                        </span>
                        <span className="text-slate-400 text-sm font-bold flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {rfq.date}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black text-slate-900">{rfq.product}</h2>
                      <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                         <Package className="w-4 h-4" /> {rfq.category}
                      </p>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                        rfq.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {rfq.status === 'open' ? 'Recibiendo Propuestas' : 'En Espera'}
                      </span>
                      <p className="text-xs font-bold text-slate-400">Total de ofertas: {rfq.quotes.length}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-6">
                  {rfq.quotes.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4" /> Comparativa de Ofertas
                      </h3>
                      <div className="overflow-x-auto rounded-3xl border border-slate-100">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-500 tracking-tighter">
                            <tr>
                              <th className="px-6 py-4">Proveedor</th>
                              <th className="px-6 py-4">Precio (Unit)</th>
                              <th className="px-6 py-4">Entrega</th>
                              <th className="px-6 py-4">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {rfq.quotes.map((quote, i) => (
                              <tr key={i} className="group hover:bg-slate-50 transition">
                                <td className="px-6 py-5">
                                  <p className="font-black text-slate-900">{quote.supplier}</p>
                                  <p className="text-[10px] font-bold text-blue-600">Ver Perfil</p>
                                </td>
                                <td className="px-6 py-5">
                                  <p className="text-lg font-black text-slate-900">USD {quote.price}</p>
                                  <p className="text-[10px] font-bold text-green-600">Mejor Precio</p>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                                    {quote.delivery}
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="flex gap-2">
                                    <button className="p-2 rounded-xl bg-slate-100 text-slate-900 border hover:bg-white transition">
                                      <MessageSquare className="w-5 h-5" />
                                    </button>
                                    <button className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-sm hover:scale-105 transition shadow-lg">
                                      Aceptar Oferta
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                         <AlertCircle className="w-8 h-8 text-slate-300" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-400 uppercase text-xs tracking-widest">Aún no se reciben ofertas</h4>
                        <p className="text-slate-400 text-sm font-medium">Los proveedores están revisando su solicitud. Le notificaremos vía WhatsApp.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
