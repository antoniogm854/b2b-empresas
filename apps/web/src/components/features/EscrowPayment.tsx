"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert
} from "lucide-react";

interface EscrowPaymentProps {
  amount: number;
  productName: string;
  vendorName: string;
}

export default function EscrowPayment({ amount, productName, vendorName }: EscrowPaymentProps) {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-md mx-auto bg-white rounded-[3rem] shadow-2xl border-2 border-primary/5 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-primary p-8 text-white relative">
        <div className="absolute top-4 right-8 opacity-20">
          <Lock size={60} />
        </div>
        <div className="flex items-center space-x-2 text-accent mb-2">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">AGM Escrow Protection</span>
        </div>
        <h3 className="text-2xl font-black italic">Transacción Segura</h3>
        <p className="text-white/60 text-xs font-bold mt-1">Protección total de fondos hasta la entrega técnica.</p>
      </div>

      <div className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Concepto</p>
              <h4 className="text-lg font-black text-primary">{productName}</h4>
              <p className="text-xs text-slate-400 font-bold italic">Proveedor: {vendorName}</p>
            </div>

            <div className="flex justify-between items-end border-b-2 border-dashed border-slate-100 pb-6">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Monto a Retener</p>
                <p className="text-4xl font-black text-primary">${amount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[9px] font-black uppercase tracking-widest">Saldo Protegido</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="text-accent mt-1" size={16} />
                <p className="text-xs font-bold text-slate-600 leading-tight">Fondos retenidos por AGM hasta conformidad industrial.</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="text-accent mt-1" size={16} />
                <p className="text-xs font-bold text-slate-600 leading-tight">Seguro de transporte incluido en la operación.</p>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full bg-primary hover:bg-accent text-white hover:text-primary py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center space-x-3 group"
            >
              <span>Proceder al Escrow</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col items-center py-8">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="text-accent" size={32} />
              </div>
              <h4 className="text-xl font-black text-primary">Validando Fondos...</h4>
              <p className="text-xs text-muted-foreground font-bold mt-2">Conectando con red interbancaria AGM</p>
            </div>
            
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center space-x-4">
              <ShieldAlert className="text-orange-500" size={24} />
              <p className="text-[10px] font-bold text-orange-800 leading-tight">
                Nota V2.0: Este es un simulador de pasarela de pagos industriales de alto volumen.
              </p>
            </div>

            <button 
              onClick={() => setStep(1)}
              className="w-full border-2 border-slate-100 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50"
            >
              Volver al Resumen
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
        <div className="flex items-center justify-center space-x-4 opacity-40">
           <Building2 size={16} />
           <span className="text-[9px] font-black uppercase tracking-tighter">B2B Empresas Certificado</span>
        </div>
      </div>
    </div>
  );
}
