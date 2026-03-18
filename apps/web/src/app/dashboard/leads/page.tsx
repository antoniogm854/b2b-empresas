"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Clock, 
  FileText, 
  Loader2, 
  Mail, 
  Phone, 
  MessageSquare, 
  Package, 
  Users 
} from "lucide-react";
import { generateQuotePDF } from "@/lib/pdf/quote-generator";
import { transactionalService, Lead, LeadStatus } from "@/lib/transactional-service";

export default function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // ID de empresa demo
  const companyId = "CURRENT_COMPANY_ID";

  useEffect(() => {
    async function fetchLeads() {
      try {
        const data = await transactionalService.getLeads(companyId);
        setLeads(data);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, [companyId]);

  const handleStatusUpdate = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await transactionalService.updateLeadStatus(leadId, newStatus);
      setLeads(leads.map((l: Lead) => l.id === leadId ? { ...l, status: newStatus } : l));
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const myCompany = {
    name: "B2B Empresas INDUSTRIAL SOLUCIONES",
    ruc: "20601234567",
    address: "Av. Industrial 450, Lima, Perú",
    phone: "+51 1 700 8000",
    email: "ventas@b2bempresas.com"
  };

  const handleGeneratePDF = async (lead: Lead) => {
    setIsGenerating(true);
    try {
      const mappedLead = {
        customerName: lead.customer_name,
        customerEmail: lead.customer_email,
        customerCompany: "Empresa Cliente", // Podría venir en metadata
        createdAt: new Date(lead.created_at).toLocaleDateString(),
        items: lead.quote_items.map((item: any, index: number) => ({
          id: `item-${index}`,
          name: item.name,
          description: item.specs || item.description,
          quantity: item.qty || 1,
          price: item.price || 0
        }))
      };

      generateQuotePDF(mappedLead, myCompany);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-accent" size={48} />
        <p className="font-black uppercase tracking-widest text-muted-foreground animate-pulse">Cargando Cotizaciones...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-background rounded-[3rem] border-2 border-muted/50 overflow-hidden h-[calc(100vh-12rem)] animate-fade-in-up">
      {/* Leads List */}
      <div className="w-1/3 border-r h-full flex flex-col bg-muted/10">
        <div className="p-6 border-b space-y-4">
          <h1 className="text-2xl font-black tracking-tightest uppercase italic">Centro de Cotizaciones</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Buscar contactos..."
              className="w-full bg-muted border-none p-3 pl-10 rounded-xl font-bold text-sm outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {leads.length > 0 ? (
            leads.map((lead: Lead) => (
              <div 
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`p-6 border-b cursor-pointer transition-all hover:bg-muted/30 ${
                  selectedLead?.id === lead.id ? "bg-muted/50 border-l-4 border-l-accent" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col gap-1">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full w-fit ${
                      lead.status === "pending" ? "bg-accent text-primary" : 
                      lead.status === "contacted" ? "bg-blue-100 text-blue-700" :
                      lead.status === "completed" ? "bg-green-100 text-green-700" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {lead.status === 'pending' ? 'Pendiente' : 
                       lead.status === 'contacted' ? 'Contactado' : 
                       lead.status === 'completed' ? 'Completado' : 'Cancelado'}
                    </span>
                    {(lead as any).source === 'marketplace' && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 w-fit">
                        Oportunidad Marketplace
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground flex items-center">
                    <Clock size={10} className="mr-1" />
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-black text-sm">{lead.customer_name}</h3>
                <p className="text-xs font-bold text-muted-foreground truncate">{lead.customer_email}</p>
              </div>
            ))
          ) : (
            <div className="p-10 text-center opacity-30 italic font-bold">No hay leads pendientes</div>
          )}
        </div>
      </div>

      {/* Lead Detail */}
      <div className="flex-1 h-full flex flex-col">
        {selectedLead ? (
          <>
            <div className="p-8 border-b flex justify-between items-center bg-background/50 backdrop-blur-xl sticky top-0 z-10">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center font-black text-primary-foreground text-xl">
                  {selectedLead.customer_name[0]}
                </div>
                <div>
                  <h2 className="text-xl font-black">{selectedLead.customer_name}</h2>
                  <div className="flex items-center gap-2">
                    <select 
                      value={selectedLead.status}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusUpdate(selectedLead.id, e.target.value as LeadStatus)}
                      className="text-[10px] font-black uppercase bg-muted border-none rounded-lg px-2 py-1 outline-none cursor-pointer hover:bg-muted/80"
                    >
                      <option value="pending">Marcar: Pendiente</option>
                      <option value="contacted">Marcar: Contactado</option>
                      <option value="completed">Marcar: Completado</option>
                      <option value="cancelled">Marcar: Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleGeneratePDF(selectedLead)}
                disabled={isGenerating}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <FileText size={16} className="mr-2" />
                )}
                {isGenerating ? "Generando..." : "Emitir Cotización PDF"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-muted/30 p-6 rounded-2xl border border-muted">
                  <Mail className="text-accent mb-2" size={20} />
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Email</p>
                  <p className="font-bold text-sm truncate">{selectedLead.customer_email}</p>
                </div>
                <div className="bg-muted/30 p-6 rounded-2xl border border-muted">
                  <Phone className="text-accent mb-2" size={20} />
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Teléfono</p>
                  <p className="font-bold text-sm">{selectedLead.customer_phone || "No provisto"}</p>
                </div>
                <div className="bg-muted/30 p-6 rounded-2xl border border-muted">
                  <MessageSquare className="text-accent mb-2" size={20} />
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Canal</p>
                  <p className="font-bold text-sm italic">
                    {(selectedLead as any).source === 'marketplace' ? 'Marketplace Global' : 'Ecosistema B2B Directo'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase italic tracking-tighter">Requerimiento Técnico (RFQ)</h3>
                <div className="space-y-4">
                  {(selectedLead.quote_items || []).map((item: any, i: number) => (
                    <div key={i} className="bg-background border-2 border-muted/50 rounded-3xl p-6 transition-all hover:border-accent/40">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-muted/40 rounded-xl">
                            <Package size={20} className="text-accent" />
                          </div>
                          <div>
                            <p className="font-black text-sm uppercase">{item.name}</p>
                            <p className="text-[10px] font-bold text-muted-foreground">REF: {item.id || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase text-muted-foreground leading-none">Cantidad</p>
                          <p className="text-lg font-black">{item.qty || 1} Und.</p>
                        </div>
                      </div>
                      <div className="bg-muted/20 p-4 rounded-2xl">
                         <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Especificación técnica</p>
                         <p className="text-xs font-medium italic">{item.specs || item.description || "Referencia básica"}</p>
                      </div>
                    </div>
                  ))}
                  {selectedLead.message && (
                    <div className="bg-accent/5 p-6 rounded-3xl border-2 border-accent/20">
                      <p className="text-[10px] font-black uppercase text-accent mb-2 italic">Mensaje Adicional:</p>
                      <p className="text-sm font-semibold italic">"{selectedLead.message}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-30">
            <Users size={64} className="mb-4" />
            <h2 className="text-2xl font-black uppercase">Selecciona un Lead</h2>
            <p className="font-medium">Haz clic en un contacto de la lista para ver el detalle de su interés.</p>
          </div>
        )}
      </div>
    </div>
  );
}
