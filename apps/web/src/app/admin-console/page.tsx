"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Filter,
  BarChart3,
  Globe,
  Lock,
  Zap,
  Building2,
  Clock
} from "lucide-react";
import { adminService, AdminStats } from "@/lib/admin-service";
import { settingsService, SiteSettings } from "@/lib/settings-service";
import MainLayout from "@/components/layout/MainLayout";

interface Profile {
  full_name: string;
  email: string;
}

interface PendingCompany {
  id: string;
  name: string;
  tax_id: string;
  industry: string;
  is_verified: boolean;
  owner_id: string;
  profiles: Profile | Profile[];
}

interface PendingAd {
  id: string;
  name: string;
  price: number;
  ad_status: string;
  company_id: string;
  companies: { name: string } | { name: string }[];
}

export default function AdminConsole() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingCompanies, setPendingCompanies] = useState<PendingCompany[]>([]);
  const [pendingAds, setPendingAds] = useState<PendingAd[]>([]);
  const [auditResults, setAuditResults] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'ads' | 'diagnostics' | 'settings'>('overview');
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginForm, setLoginForm] = useState({
    role: 'Administrador General',
    user: '',
    email: '',
    password: '',
    phone: ''
  });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    setMounted(true);
    // Check session on mount
    const authSession = sessionStorage.getItem('admin_master_auth');
    if (authSession === 'true') {
      setIsAuthorized(true);
    }
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [s, companies, ads, audit, settings] = await Promise.all([
        adminService.getGlobalStats(),
        adminService.getPendingCompanies() as Promise<PendingCompany[]>,
        adminService.getPendingAds() as Promise<PendingAd[]>,
        adminService.runSystemAudit(),
        settingsService.getSettings()
      ]);
      setStats(s);
      setPendingCompanies(companies);
      setPendingAds(ads);
      setAuditResults(audit);
      setSiteSettings(settings);
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const masterAdmin = {
      role: 'Administrador General',
      user: 'AGM - AG',
      email: 'antoniogranda.m@gmail.com',
      password: '@SolucionesLatam159',
      phone: '990670153'
    };

    if (
      loginForm.role.trim() === masterAdmin.role &&
      loginForm.user.trim() === masterAdmin.user &&
      loginForm.email.trim() === masterAdmin.email &&
      loginForm.password.trim() === masterAdmin.password &&
      loginForm.phone.trim() === masterAdmin.phone
    ) {
      sessionStorage.setItem('admin_master_auth', 'true');
      setIsAuthorized(true);
      resetInactivityTimer();
    } else {
      setLoginError('Credenciales maestras inválidas. Acceso denegado.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_master_auth');
    setIsAuthorized(false);
    window.location.href = '/';
  };

  // 3-Minute Inactivity Timer
  const [lastActivity, setLastActivity] = useState(Date.now());
  const INACTIVITY_LIMIT = 3 * 60 * 1000; // 3 minutes

  const resetInactivityTimer = () => setLastActivity(Date.now());

  useEffect(() => {
    if (!isAuthorized) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetInactivityTimer));

    const checkInterval = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_LIMIT) {
        handleLogout();
      }
    }, 10000); // Check every 10 seconds

    return () => {
      events.forEach(event => document.removeEventListener(event, resetInactivityTimer));
      clearInterval(checkInterval);
    };
  }, [isAuthorized, lastActivity]);

  const handleVerify = async (id: string, status: boolean) => {
    try {
      await adminService.setCompanyVerification(id, status);
      await loadAdminData();
    } catch (error) {
      // Quiet fail in production
    }
  };

  const handleAdAction = async (id: string, action: 'approved' | 'rejected') => {
    try {
      await adminService.updateAdStatus(id, action, action === 'approved' ? 10 : 0);
      await loadAdminData();
    } catch (error) {
      // Quiet fail in production
    }
  };

  const runAudit = async () => {
    setIsLoading(true);
    try {
      const audit = await adminService.runSystemAudit();
      setAuditResults(audit);
    } catch (error) {
      // Quiet fail in production
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;
    setIsSavingSettings(true);
    try {
      await settingsService.updateSettings(siteSettings);
      alert('Configuración actualizada correctamente');
    } catch (error) {
      alert('Error al actualizar configuración. Asegúrese de que la tabla site_settings existe.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (!isAuthorized) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 pt-24">
          <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            {/* Animated background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-[80px] group-hover:bg-accent/30 transition-all duration-1000" />
            
            <div className="relative z-10">
              <div className="flex flex-col items-center mb-10 text-center">
                <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center shadow-2xl shadow-accent/20 mb-6 group-hover:scale-110 transition-transform duration-500" suppressHydrationWarning>
                  {mounted && <ShieldCheck className="text-primary" size={40} />}
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Acceso Restringido</h2>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Acceso Maestro B2B Empresas</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* Función/Rol */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-2">Función</label>
                    <select 
                      value={loginForm.role}
                      onChange={(e) => setLoginForm({...loginForm, role: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm font-black outline-none focus:border-accent transition-all appearance-none"
                    >
                      {['Administrador General', 'Desarrollador', 'Programador', 'Diseñador'].map(role => (
                        <option key={role} value={role} className="bg-[#0f172a]">{role}</option>
                      ))}
                    </select>
                  </div>

                  {/* Usuario */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-2">Usuario</label>
                    <input 
                      type="text"
                      placeholder="Nombre de Usuario"
                      value={loginForm.user}
                      onChange={(e) => setLoginForm({...loginForm, user: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm font-black outline-none focus:border-accent placeholder:text-white/20 transition-all"
                      required
                    />
                  </div>

                  {/* Correo */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-2">Correo Electrónico</label>
                    <input 
                      type="email"
                      placeholder="admin@gmail.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm font-black outline-none focus:border-accent placeholder:text-white/20 transition-all"
                      required
                    />
                  </div>

                  {/* Contraseña */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-2">Contraseña</label>
                    <input 
                      type="password"
                      placeholder="••••••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm font-black outline-none focus:border-accent placeholder:text-white/20 transition-all"
                      required
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-2">Número Teléfono</label>
                    <input 
                      type="tel"
                      placeholder="999 999 999"
                      value={loginForm.phone}
                      onChange={(e) => setLoginForm({...loginForm, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm font-black outline-none focus:border-accent placeholder:text-white/20 transition-all"
                      required
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center space-x-3 mt-4" suppressHydrationWarning>
                    {mounted && <AlertCircle className="text-red-500" size={16} />}
                    <p className="text-red-500 text-[10px] font-black uppercase leading-tight">{loginError}</p>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-accent text-primary py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-accent/20 mt-6 active:scale-95"
                >
                  Girar Llave de Seguridad
                </button>
              </form>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isLoading && !stats) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center">
            <Zap className="animate-bounce text-accent mb-4" size={48} />
            <p className="font-black text-primary uppercase tracking-widest text-xs">Cargando Acceso Maestro...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
            <div className="w-full lg:w-auto">
              <div className="flex items-center space-x-2 text-accent mb-2">
                <Lock size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Owner Access Only</span>
              </div>
              <h1 id="admin-title" className="text-4xl md:text-5xl font-black text-primary leading-tight">
                Consola de <span className="text-accent">Control Maestro</span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-bold italic mt-2">Gestión de monetización, auditoría y autorizaciones B2B Empresas</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
              <div className="flex space-x-2 bg-white p-2 rounded-[2rem] border-2 border-primary/5 shadow-xl scrollbar-hide overflow-x-auto">
                {(['overview', 'verifications', 'ads', 'diagnostics', 'settings'] as const).map((tab) => (
                  <button
                    key={tab}
                    id={`tab-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 md:px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                      activeTab === tab 
                        ? "bg-primary text-white shadow-lg scale-105" 
                        : "text-muted-foreground hover:bg-slate-50"
                    }`}
                  >
                    {tab === 'overview' ? 'Resumen' : tab === 'verifications' ? 'Verificaciones' : tab === 'ads' ? 'Anuncios' : tab === 'diagnostics' ? 'Diagnósticos' : 'Empresa'}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-2"
              >
                <XCircle size={16} />
                Cerrar Admin Master
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          {activeTab === 'overview' && stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[
                { id: 'stat-companies', label: 'Empresas Totales', val: stats.totalCompanies, icon: Users, color: 'bg-blue-500' },
                { id: 'stat-verifications', label: 'Pendientes RUC', val: stats.pendingVerifications, icon: AlertCircle, color: 'bg-orange-500' },
                { id: 'stat-ads', label: 'Anuncios Activos', val: stats.activeAds, icon: Zap, color: 'bg-accent' },
                { id: 'stat-leads', label: 'Leads Marketplace', val: stats.totalMarketplaceLeads, icon: TrendingUp, color: 'bg-green-500' },
              ].map((s, i) => (
                <div key={i} id={s.id} className="bg-white p-8 rounded-[3rem] border-2 border-primary/5 shadow-xl hover:translate-y-[-5px] transition-all group">
                  <div className={`w-12 h-12 ${s.color} rounded-2xl mb-4 flex items-center justify-center text-white shadow-lg`}>
                    <s.icon size={24} />
                  </div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
                  <p className="text-4xl font-black text-primary group-hover:text-accent transition-colors">{s.val}</p>
                </div>
              ))}
            </div>
          )}

          {/* Main Content Area */}
          <div className="bg-white rounded-[4rem] border-2 border-primary/5 shadow-2xl overflow-hidden min-h-[600px] animate-fade-in-up">
            
            {/* Tab: Verifications */}
            {activeTab === 'verifications' && (
              <div className="p-10">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-primary flex items-center">
                    <ShieldCheck className="mr-3 text-accent" />
                    Validación de Empresas Pendientes
                  </h3>
                  <div className="flex items-center space-x-3 text-xs font-bold text-muted-foreground">
                    <Filter size={14} />
                    <span>Filtrar por Industrial</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {pendingCompanies.length > 0 ? pendingCompanies.map((c: PendingCompany) => (
                    <div key={c.id} className="group p-6 bg-slate-50 hover:bg-white border-2 border-transparent hover:border-accent rounded-[2.5rem] transition-all flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center border border-slate-200">
                          <Building2 className="text-slate-300" size={32} />
                        </div>
                        <div>
                          <p className="font-black text-lg text-primary">{c.name}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">RUC: {c.tax_id || 'N/A'}</span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[9px] font-black uppercase tracking-tighter">{c.industry}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 italic">
                            Propietario: {Array.isArray(c.profiles) ? c.profiles[0]?.full_name : c.profiles?.full_name} ({Array.isArray(c.profiles) ? c.profiles[0]?.email : c.profiles?.email})
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button 
                          id={`verify-approve-${c.id}`}
                          onClick={() => handleVerify(c.id, true)}
                          className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                        >
                          <CheckCircle2 size={24} />
                        </button>
                        <button 
                          id={`verify-reject-${c.id}`}
                          onClick={() => handleVerify(c.id, false)}
                          className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                        >
                          <XCircle size={24} />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground italic">
                      <CheckCircle2 size={48} className="mb-4 text-slate-200" />
                      <p>No hay empresas pendientes de validación</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Ads */}
            {activeTab === 'ads' && (
              <div className="p-10">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-primary flex items-center">
                    <Zap className="mr-3 text-accent" />
                    Monetización: Anuncios Pendientes
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingAds.length > 0 ? pendingAds.map((ad: any) => (
                    <div key={ad.id} className="p-8 bg-slate-50 rounded-[3rem] border-2 border-transparent hover:border-accent hover:bg-white transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                            {Array.isArray(ad.companies) ? ad.companies[0]?.name : ad.companies?.name}
                          </p>
                          <h4 className="text-xl font-black text-primary leading-tight">{ad.name}</h4>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-accent">${ad.price}</p>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <button 
                          onClick={() => handleAdAction(ad.id, 'approved')}
                          className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent transition-colors shadow-xl"
                        >
                          Autorizar Anuncio
                        </button>
                        <button 
                          onClick={() => handleAdAction(ad.id, 'rejected')}
                          className="px-6 border-2 border-red-200 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-colors"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-20 text-muted-foreground italic">
                      <Zap size={48} className="mb-4 text-slate-200" />
                      <p>No hay solicitudes de anuncios pendientes</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Diagnostics */}
            {activeTab === 'diagnostics' && (
              <div className="p-10">
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-2xl font-black text-primary flex items-center">
                    <BarChart3 className="mr-3 text-accent" />
                    Auditoría Técnica B2B Empresas
                  </h3>
                  <button onClick={runAudit} className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                    Re-Escanear Sistema
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {auditResults?.checks.map((check: any, i: number) => (
                    <div key={i} className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{check.name}</span>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                            check.result === 'OK' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {check.result}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-primary">{check.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Settings (Company Identity) */}
            {activeTab === 'settings' && siteSettings && (
              <div className="p-10 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black text-primary flex items-center">
                    <Building2 className="mr-3 text-accent" />
                    Identidad Corporativa de B2B Empresas
                  </h3>
                </div>

                <form onSubmit={handleUpdateSettings} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Nombre de la Plataforma</label>
                      <input 
                        type="text"
                        value={siteSettings.company_name}
                        onChange={(e) => setSiteSettings({...siteSettings, company_name: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-accent rounded-2xl p-4 font-bold outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">WhatsApp Hotline (Ej: +51 924 159 535)</label>
                      <input 
                        type="text"
                        value={siteSettings.support_phone}
                        onChange={(e) => setSiteSettings({...siteSettings, support_phone: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-accent rounded-2xl p-4 font-bold outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Email de Soporte</label>
                      <input 
                        type="email"
                        value={siteSettings.support_email}
                        onChange={(e) => setSiteSettings({...siteSettings, support_email: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-accent rounded-2xl p-4 font-bold outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Dirección Física</label>
                      <input 
                        type="text"
                        value={siteSettings.address}
                        onChange={(e) => setSiteSettings({...siteSettings, address: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-accent rounded-2xl p-4 font-bold outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Sobre Nosotros (Pie de Página)</label>
                    <textarea 
                      value={siteSettings.about_us}
                      onChange={(e) => setSiteSettings({...siteSettings, about_us: e.target.value})}
                      rows={4}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-accent rounded-2xl p-4 font-bold outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Mensaje Predeterminado WhatsApp</label>
                    <input 
                      type="text"
                      value={siteSettings.whatsapp_message}
                      onChange={(e) => setSiteSettings({...siteSettings, whatsapp_message: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-accent rounded-2xl p-4 font-bold outline-none transition-all"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSavingSettings}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent transition-all shadow-xl shadow-primary/10 disabled:opacity-50"
                  >
                    {isSavingSettings ? 'Guardando...' : 'Guardar Configuración Maestra'}
                  </button>
                </form>
              </div>
            )}

            {/* Default Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="p-10 flex flex-col items-center justify-center min-h-[500px]">
                <BarChart3 size={48} className="text-accent mb-8 animate-pulse" />
                <h3 className="text-3xl font-black text-primary mb-4">Ecosistema B2B Empresas Activo</h3>
                <p className="text-muted-foreground font-bold text-center mb-8 max-w-sm">
                  Utilice las pestañas para supervisar el crecimiento de la plataforma y autorizar nuevas operaciones comerciales.
                </p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
