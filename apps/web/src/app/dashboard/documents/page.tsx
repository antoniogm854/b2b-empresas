"use client";

import { useState } from "react";
import { 
  FileText, 
  Upload, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Trash2,
  ExternalLink,
  ShieldAlert
} from "lucide-react";

export default function DocumentsPage() {
  const [docs, setDocs] = useState([
    { id: 1, name: "RUC Digital - Sunat.pdf", type: "Requerido", status: "verified", date: "12 Mar 2026" },
    { id: 2, name: "Certificación ISO 9001.pdf", type: "Opcional", status: "pending", date: "15 Mar 2026" },
  ]);

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tightest uppercase italic">Centro de Documentos</h1>
          <p className="text-muted-foreground font-semibold mt-2">Valida tu empresa para obtener el sello de "Proveedor Verificado".</p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-background px-6 py-4 rounded-2xl border-2 border-muted/50 flex items-center space-x-3">
            <ShieldCheck className="text-accent" size={24} />
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground leading-none">Puntaje de Confianza</p>
              <p className="text-lg font-black italic">85 / 100</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Document List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-background p-10 rounded-[3rem] border-2 border-muted/50 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase italic flex items-center">
                <FileText className="mr-3 text-accent" size={28} />
                Expediente Digital
              </h2>
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center hover:scale-105 transition-all">
                <Upload size={16} className="mr-2" />
                Subir Nuevo
              </button>
            </div>

            <div className="space-y-4">
              {docs.map((doc) => (
                <div key={doc.id} className="group flex items-center justify-between p-6 bg-muted/20 hover:bg-muted/40 border-2 border-transparent hover:border-accent/30 rounded-[2rem] transition-all">
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 rounded-2xl ${doc.status === 'verified' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="font-black text-sm">{doc.name}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-[10px] font-black uppercase bg-background px-2 py-0.5 rounded-md border border-muted/50">
                          {doc.type}
                        </span>
                        <p className="text-[10px] font-bold text-muted-foreground">Subido el {doc.date}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right hidden md:block">
                      <p className={`text-[10px] font-black uppercase flex items-center justify-end ${doc.status === 'verified' ? 'text-green-600' : 'text-amber-600'}`}>
                        {doc.status === 'verified' ? <CheckCircle2 size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                        {doc.status === 'verified' ? 'Verificado' : 'En Revisión'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                       <button className="p-3 bg-background rounded-xl hover:text-accent transition-colors shadow-sm">
                        <ExternalLink size={16} />
                      </button>
                      <button className="p-3 bg-background rounded-xl hover:text-red-500 transition-colors shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-muted/10 p-10 rounded-[3rem] border-2 border-dashed border-muted/50">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center">
              <ShieldAlert className="mr-2 text-accent" size={18} />
              Requisitos de Validación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-xs font-bold leading-relaxed">RUC debe estar habido y activo en SUNAT.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-xs font-bold leading-relaxed">Documentos deben ser legibles (PDF o JPG alta resolución).</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-xs font-bold leading-relaxed">Certificaciones ISO deben tener vigencia mínima de 6 meses.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <p className="text-xs font-bold leading-relaxed">Nombre del titular debe coincidir con el registro del Dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-primary text-primary-foreground p-10 rounded-[3rem] relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-black uppercase italic leading-tight">Estado de la Cuenta</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-primary-foreground/60 border-b border-white/10 pb-4">
                  <span>Identidad</span>
                  <span className="text-green-400">Validada</span>
                </div>
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-primary-foreground/60 border-b border-white/10 pb-4">
                  <span>Ubicación</span>
                  <span className="text-green-400">Validada</span>
                </div>
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-primary-foreground/60">
                  <span>Certificaciones</span>
                  <span className="text-amber-400">1 Pendiente</span>
                </div>
              </div>
              
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20 mt-8">
                <div className="flex items-center space-x-3 mb-2">
                  <AlertCircle size={20} className="text-accent" />
                  <p className="text-sm font-black italic uppercase">Acción Requerida</p>
                </div>
                <p className="text-xs font-medium text-primary-foreground/70 leading-relaxed italic">
                  Completa tu perfil al 100% para aparecer en los primeros resultados del motor de proximidad.
                </p>
              </div>
            </div>
            {/* Abstract Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-32 -mt-32" />
          </div>

          <div className="bg-accent text-primary p-8 rounded-[3rem] shadow-xl shadow-accent/20">
            <h4 className="text-lg font-black uppercase italic mb-3">Sello Gold</h4>
            <p className="text-xs font-bold leading-relaxed mb-6 italic">
              Al cargar tu ISO 9001/14001 obtienes el distintivo Gold automático en el CATÁLOGO DIGITAL.
            </p>
            <button className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-all">
              Saber más
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
