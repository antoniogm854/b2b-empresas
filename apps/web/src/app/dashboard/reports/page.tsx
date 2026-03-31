"use client";

import { useState, useEffect, useRef } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  Target, 
  Map as MapIcon,
  ArrowUpRight,
  Zap,
  Loader2,
  FileText,
  Download,
  Upload,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Search,
  Mail,
  Phone,
  MessageSquare,
  Package,
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  CheckCheck
} from "lucide-react";

// Services
import { analyticsService } from "@/lib/analytics-service";
import { generateExecutiveReportPDF, ReportStats } from "@/lib/pdf/report-service";
import { CompanyData, generateQuotePDF } from "@/lib/pdf/quote-generator";
import { authService } from "@/lib/auth-service";
import { companyService, Tenant } from "@/lib/company-service";
import { transactionalService, Lead, LeadStatus } from "@/lib/transactional-service";
import { chatService, ChatMessage, Conversation } from "@/lib/chat-service";
import { supabase } from "@/lib/supabase";

export default function UnifiedReportsPage() {
  const [activeTab, setActiveTab] = useState<"analytics" | "documents" | "leads" | "messages">("analytics");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);

  // Analytics Metrics
  const [metrics, setMetrics] = useState<any>(null);

  // Documents State
  const [docs, setDocs] = useState([
    { id: 1, name: "RUC Digital - Sunat.pdf", type: "Requerido", status: "verified", date: "12 Mar 2026" },
    { id: 2, name: "Certificación ISO 9001.pdf", type: "Opcional", status: "pending", date: "15 Mar 2026" },
  ]);

  // Leads State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);

  // Messages State
  const [chats, setChats] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function initData() {
      setLoading(true);
      try {
        const u = await authService.getCurrentUser();
        if (u && u.email) {
          setUser(u);
          const comp = await companyService.getTenantByUserEmail(u.email);
          if (comp) {
            setTenant(comp);
            
            // Load Analytics
            const stats = await analyticsService.getCompanyMetrics(comp.id);
            setMetrics(stats);
            
            // Load Leads
            const leadData = await transactionalService.getLeads(comp.id);
            setLeads(leadData);
            
            // Load Chats
            const convs = await chatService.getConversations();
            setChats(convs);
          }
        }
      } catch (error) {
        console.error("Error loading reports data:", error);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  // Realtime subscription for messages
  useEffect(() => {
    if (activeChat && activeTab === "messages") {
      loadChatMessages(activeChat.id);
      
      const subscription = chatService.subscribeToMessages(activeChat.id, (payload) => {
        const newMsg = payload.new as ChatMessage;
        setMessages((prev) => [...prev, newMsg]);
      });

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [activeChat, activeTab]);

  useEffect(() => {
    if (activeTab === "messages") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  const loadChatMessages = async (chatId: string) => {
    try {
      const data = await chatService.getMessages(chatId);
      setMessages(data);
    } catch (error) {
      console.error("Error loading chat messages:", error);
    }
  };

  // HANDLERS
  const handleDownloadExecutiveReport = () => {
    if (!metrics || !tenant) return;
    const reportStats: ReportStats = {
      totalLeads: metrics.realLeads,
      pendingLeads: metrics.realLeads > 5 ? 5 : metrics.realLeads, 
      totalViews: metrics.views || 0,
      topProducts: metrics.topProducts.map((p: any) => ({ name: p.name, views: p.views })),
      period: new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' })
    };
    const compData: CompanyData = {
      name: tenant.company_name || "Empresa Industrial B2B",
      ruc: tenant.ruc_rut_nit || "N/A",
      address: tenant.fiscal_address || "N/A",
      phone: tenant.phone || "N/A",
      email: tenant.email || "N/A"
    };
    generateExecutiveReportPDF(reportStats, compData);
  };

  const handleLeadStatusUpdate = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await transactionalService.updateLeadStatus(leadId, newStatus);
      setLeads(leads.map((l: Lead) => l.id === leadId ? { ...l, status: newStatus } : l));
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };

  const handleGenerateQuotePDF = async (lead: Lead) => {
    if (!tenant) return;
    setIsGeneratingQuote(true);
    try {
      const myComp: CompanyData = {
        name: tenant.company_name || "Empresa B2B",
        ruc: tenant.ruc_rut_nit || "N/A",
        address: tenant.address || "N/A",
        phone: tenant.phone || "N/A",
        email: tenant.email || "N/A"
      };
      const mappedLead = {
        customerName: lead.customer_name || lead.buyer_name || "Cliente",
        customerEmail: lead.customer_email || lead.buyer_email || "cliente@b2b.com",
        customerCompany: "Empresa Cliente", 
        createdAt: new Date(lead.created_at).toLocaleDateString(),
        items: (lead.quote_items || []).map((item: any, index: number) => ({
          id: `item-${index}`,
          name: item.name,
          description: item.specs || item.description,
          quantity: item.qty || 1,
          price: item.price || 0
        }))
      };
      generateQuotePDF(mappedLead, myComp);
    } finally {
      setIsGeneratingQuote(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    const textToSend = newMessage;
    setNewMessage("");
    try {
      await chatService.sendMessage(activeChat.id, textToSend);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
        <Loader2 className="animate-spin text-accent" size={48} />
        <p className="font-black uppercase tracking-widest text-muted-foreground animate-pulse">Sincronizando Centro de Inteligencia...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      {/* HEADER & TABS */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tightest italic">Centro de Reportes y Estadísticas</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1 text-accent">Inteligencia de Mercado y Gestión Industrial Unificada</p>
          </div>
          {activeTab === "analytics" && (
            <button 
              onClick={handleDownloadExecutiveReport}
              className="bg-zinc-950 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl"
            >
              <Download size={14} className="text-accent" /> Exportar Reporte Ejecutivo PDF
            </button>
          )}
        </div>

        {/* MODERN TABS UI */}
        <div className="flex flex-wrap items-center gap-2 bg-muted/20 p-1.5 rounded-2xl w-fit">
          <TabButton active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} icon={BarChart3} label="Analitica" />
          <TabButton active={activeTab === "documents"} onClick={() => setActiveTab("documents")} icon={FileText} label="Documentos" />
          <TabButton active={activeTab === "leads"} onClick={() => setActiveTab("leads")} icon={Users} label="Cotizaciones" />
          <TabButton active={activeTab === "messages"} onClick={() => setActiveTab("messages")} icon={MessageSquare} label="Mensajería" />
        </div>
      </div>

      <div className="min-h-[500px]">
        {/* TABS CONTENT */}
        {activeTab === "analytics" && metrics && (
          <div className="space-y-12 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard label="Impacto Visual" val={metrics.views || 0} icon={MousePointerClick} color="text-emerald-500" sub="Vistas Únicas" />
              <StatCard label="Intención" val={metrics.realLeads || 0} icon={Target} color="text-blue-500" sub="Contactos Recibidos" />
              <StatCard label="Engagement" val={`${metrics.conversionRate?.toFixed(1) || 0}%`} icon={TrendingUp} color="text-amber-500" sub="% Conversión" />
            </div>
            
            {/* Top Products */}
            <div className="bg-zinc-950 text-white rounded-[3rem] p-10 shadow-2xl">
              <h2 className="text-2xl font-black uppercase italic mb-8 border-b border-white/5 pb-6 flex items-center gap-4">
                 <BarChart3 className="text-accent" /> Ranking de Interés por Productos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {metrics.topProducts.map((item: any, i: number) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span className="text-white/60">{item.name}</span>
                      <span className="text-accent">{item.views} vistas</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${(item.views / metrics.views) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
            <div className="lg:col-span-8 bg-background p-8 rounded-[3rem] border-2 border-muted/50 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-black uppercase italic">Expediente Digital</h2>
                <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center hover:scale-105 transition-all">
                  <Upload size={14} className="mr-2" /> Subir Certificación
                </button>
              </div>
              <div className="space-y-4">
                {docs.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-5 bg-muted/20 rounded-[2rem] border-2 border-transparent hover:border-accent/20 transition-all">
                     <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${doc.status === 'verified' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                           <FileText size={20} />
                        </div>
                        <div>
                           <p className="font-black text-xs uppercase">{doc.name}</p>
                           <p className="text-[9px] font-bold text-muted-foreground uppercase">{doc.type} • {doc.date}</p>
                        </div>
                     </div>
                     <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${doc.status === 'verified' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        {doc.status === 'verified' ? 'Verificado' : 'En Revisión'}
                     </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-4 bg-primary text-primary-foreground p-8 rounded-[3rem] space-y-6 flex flex-col justify-center">
              <ShieldCheck size={48} className="text-accent" />
              <h3 className="text-3xl font-black uppercase italic leading-none">Confianza Industrial</h3>
              <p className="text-sm font-medium text-primary-foreground/70 leading-relaxed italic">
                La validación de documentos incrementa tu puntaje de cumplimiento y tu visibilidad en el Marketplace Global.
              </p>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                 <p className="text-[10px] font-black uppercase tracking-widest mb-1">Score Actual</p>
                 <p className="text-2xl font-black">85 / 100</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "leads" && (
          <div className="flex bg-background rounded-[3rem] border-2 border-muted/50 overflow-hidden h-[600px] animate-fade-in-up shadow-xl">
            {/* List */}
            <div className="w-1/3 border-r h-full flex flex-col bg-muted/10">
               <div className="p-6 border-b">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                     <input type="text" placeholder="Buscar cotizaciones..." className="w-full bg-muted border-none p-3 pl-10 rounded-xl font-bold text-xs" />
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto">
                 {leads.map(lead => (
                   <div 
                    key={lead.id} 
                    onClick={() => setSelectedLead(lead)}
                    className={`p-5 border-b cursor-pointer transition-all hover:bg-muted/30 ${selectedLead?.id === lead.id ? "bg-muted border-l-4 border-l-accent" : ""}`}
                   >
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${lead.status === "pending" ? "bg-accent text-primary" : "bg-muted text-muted-foreground"}`}>
                        {lead.status}
                      </span>
                      <h4 className="font-black text-xs mt-2 uppercase">{lead.customer_name || lead.buyer_name}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold">{new Date(lead.created_at).toLocaleDateString()}</p>
                   </div>
                 ))}
               </div>
            </div>
            {/* Detail */}
            <div className="flex-1 h-full overflow-y-auto">
              {selectedLead ? (
                <div className="p-8 space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black uppercase">Detalle RFQ</h2>
                    <button 
                      onClick={() => handleGenerateQuotePDF(selectedLead)}
                      className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center"
                    >
                       <FileText size={14} className="mr-2" /> Emitir PDF
                    </button>
                  </div>
                  <div className="bg-muted/20 p-6 rounded-2xl border border-muted">
                    <p className="text-[10px] font-black uppercase text-accent mb-2">Mensaje del Cliente</p>
                    <p className="text-sm font-bold italic">"{selectedLead.message || "Sin mensaje adicional"}"</p>
                  </div>
                  <div className="space-y-4">
                    <p className="font-black text-[10px] uppercase text-muted-foreground">Productos solicitados:</p>
                    {(selectedLead.quote_items || []).map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-background border-2 border-muted/50 p-4 rounded-xl">
                        <span className="font-black text-xs uppercase">{item.name}</span>
                        <span className="font-bold text-xs">{item.qty} Und.</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                  <Package size={48} className="mb-4" />
                  <p className="font-black uppercase text-[10px] tracking-widest">Selecciona un requerimiento</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="flex bg-background rounded-[3rem] border-2 border-muted/50 overflow-hidden h-[600px] animate-fade-in-up shadow-xl">
             <div className="w-1/3 border-r h-full flex flex-col bg-muted/10">
               <div className="flex-1 overflow-y-auto">
                 {chats.map(chat => (
                   <div 
                    key={chat.id} 
                    onClick={() => setActiveChat(chat)}
                    className={`p-6 border-b cursor-pointer transition-all hover:bg-muted/30 ${activeChat?.id === chat.id ? "bg-muted" : ""}`}
                   >
                     <h4 className="font-black text-xs uppercase">{chat.company?.name || chat.buyer?.full_name}</h4>
                     <p className="text-[10px] text-muted-foreground truncate font-bold mt-1">{chat.last_message}</p>
                   </div>
                 ))}
               </div>
             </div>
             <div className="flex-1 flex flex-col h-full overflow-hidden">
               {activeChat ? (
                 <>
                   <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-muted/5">
                     {messages.map(msg => (
                       <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                         <div className={`p-4 rounded-xl text-xs font-bold max-w-[80%] ${msg.sender_id === user?.id ? "bg-primary text-primary-foreground shadow-lg" : "bg-white border"}`}>
                            {msg.text}
                         </div>
                       </div>
                     ))}
                     <div ref={messagesEndRef} />
                   </div>
                   <form onSubmit={handleSendMessage} className="p-4 bg-background border-t">
                     <div className="flex gap-2">
                       <input 
                        type="text" 
                        value={newMessage} 
                        onChange={e => setNewMessage(e.target.value)}
                        className="flex-1 bg-muted border-none p-3 rounded-xl font-bold text-xs" 
                        placeholder="Mensaje corporativo..."
                       />
                       <button className="bg-primary text-white p-3 rounded-xl"><Send size={16}/></button>
                     </div>
                   </form>
                 </>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                   <MessageSquare size={48} className="mb-4" />
                   <p className="font-black uppercase text-[10px] tracking-widest">Inicia una conversación</p>
                 </div>
               )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

// HELPER COMPONENTS
function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
        active 
          ? "bg-white text-zinc-950 shadow-md scale-105" 
          : "text-muted-foreground hover:bg-white/50 hover:text-zinc-700"
      }`}
    >
      <Icon size={14} className={active ? "text-accent" : ""} />
      {label}
    </button>
  );
}

function StatCard({ label, val, icon: Icon, color, sub }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 hover:border-accent/30 transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 w-20 h-20 bg-current opacity-[0.03] translate-x-5 -translate-y-5 rounded-full group-hover:scale-150 transition-all duration-700" style={{ color }} />
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner bg-zinc-50 ${color}`}>
          <Icon size={24} />
        </div>
        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{label}</p>
        <p className="text-xs font-black uppercase text-zinc-600 mb-4">{sub}</p>
        <h3 className="text-4xl font-black italic tracking-tighter tabular-nums">{val}</h3>
      </div>
    </div>
  );
}
