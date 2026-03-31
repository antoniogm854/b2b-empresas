"use client"; 

import { useState, useEffect } from "react";
import { Zap, Lock, XCircle } from "lucide-react";
import Link from 'next/link';
import { useTranslations } from "next-intl";

import { adminService, AdminStats } from "@/lib/admin-service";
import { settingsService, SiteSettings } from "@/lib/settings-service";

import { AdminLoginGate } from "./_components/AdminLoginGate";
import { AdminRecoveryModal } from "./_components/AdminRecoveryModal";
import { AdminSidebar } from "./_components/AdminSidebar";
import { TabOverview } from "./_components/tabs/TabOverview";
import { TabVerifications } from "./_components/tabs/TabVerifications";
import { TabCompanies } from "./_components/tabs/TabCompanies";
import { TabShowcase } from "./_components/tabs/TabShowcase";
import { TabCatalogMaster } from "./_components/tabs/TabCatalogMaster";
import { TabDiagnostics } from "./_components/tabs/TabDiagnostics";
import { TabSettings } from "./_components/tabs/TabSettings";

const ADMIN_MASTER = {
  role: "Administrador General",
  user: "AGM - AG",
  email: "antoniogranda.m@gmail.com",
  key: "B2BMaster2024",
};

type TabKey = "overview" | "verifications" | "companies" | "showcase" | "catalog" | "diagnostics" | "settings";

export default function AdminConsole() {
  const t = useTranslations('AdminConsole');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingCompanies, setPendingCompanies] = useState<any[]>([]);
  const [pendingShowcase, setPendingShowcase] = useState<any[]>([]);
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [auditResults, setAuditResults] = useState<any>(null);
  const [allCompanies, setAllCompanies] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showAdminRecovery, setShowAdminRecovery] = useState(false);
  const [loginForm, setLoginForm] = useState({ password: "" });
  const [loginError, setLoginError] = useState("");
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem("admin_master_auth") === "true") setIsAuthorized(true);
    loadAdminData();
  }, []);

  // 3-minute inactivity logout
  useEffect(() => {
    if (!isAuthorized) return;
    const reset = () => setLastActivity(Date.now());
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((ev) => document.addEventListener(ev, reset));
    const check = setInterval(() => {
      if (Date.now() - lastActivity > 3 * 60 * 1000) handleLogout();
    }, 10000);
    return () => { 
      events.forEach((ev) => document.removeEventListener(ev, reset)); 
      clearInterval(check); 
    };
  }, [isAuthorized, lastActivity]);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [s, companies, all, audit, settings, products] = await Promise.all([
        adminService.getGlobalStats(),
        adminService.getPendingCompanies(),
        adminService.getAllCompanies(),
        adminService.runSystemAudit(),
        settingsService.getSettings(),
        adminService.getPendingMasterProducts()
      ]);
      setStats(s);
      setPendingCompanies(companies as any[]);
      setAllCompanies(all);
      setAuditResults(audit);
      setSiteSettings(settings);
      setPendingProducts(products as any[]);
      
      // Feature: Get showcase products for TabShowcase if needed
      // adminService.getPendingMarketplaceProducts() is usually what populates showcase
      const showcase = await adminService.getPendingMarketplaceProducts();
      setPendingShowcase(showcase);

    } catch (e) {
      console.error("Error loading admin data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.password === ADMIN_MASTER.key) {
      sessionStorage.setItem("admin_master_auth", "true");
      setIsAuthorized(true);
      setLastActivity(Date.now());
    } else {
      setLoginError(t('login_error'));
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_master_auth");
    setIsAuthorized(false);
    window.location.href = "/";
  };

  const handleVerify = async (id: string, status: boolean) => {
    try { 
      await adminService.setTenantStatus(id, status ? "active" : "suspended"); 
      await loadAdminData(); 
    } catch {}
  };

  const handleShowcaseAction = async (id: string, action: "approved" | "rejected") => {
    try { 
      await adminService.updateShowcaseStatus(id, action, action === "approved" ? 10 : 0); 
      await loadAdminData(); 
    } catch {}
  };

  const handleMasterProductAction = async (id: string, status: 'active' | 'inactive') => {
    try {
      await adminService.setMasterProductStatus(id, status);
      await loadAdminData();
    } catch (error) {}
  };

  const runAudit = async () => {
    setIsLoading(true);
    try { 
      const audit = await adminService.runSystemAudit(); 
      setAuditResults(audit); 
    } catch {}
    finally { setIsLoading(false); }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;
    setIsSavingSettings(true);
    try {
      await settingsService.updateSettings(siteSettings);
      alert(t('settings_success'));
    } catch {
      alert(t('settings_error'));
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (!isAuthorized) {
    return (
      <>
        <AdminLoginGate
          mounted={mounted}
          loginForm={loginForm}
          loginError={loginError}
          onFormChange={(field, value) => setLoginForm((prev) => ({ ...prev, [field]: value }))}
          onSubmit={handleLogin}
          onRecovery={() => setShowAdminRecovery(true)}
        />
        {showAdminRecovery && <AdminRecoveryModal onClose={() => setShowAdminRecovery(false)} />}
      </>
    );
  }

  if (isLoading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <Zap className="animate-bounce text-accent mb-4" size={48} />
          <p className="font-black text-primary uppercase tracking-widest text-xs">{t('loading_console')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6 transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />

          <div className="lg:col-span-9 space-y-8">
            <div className="bg-white rounded-[4rem] border-2 border-primary/5 shadow-2xl overflow-hidden min-h-[600px] animate-reveal">

              {activeTab === "overview" && <TabOverview stats={stats!} />}

              {activeTab === "verifications" && (
                <TabVerifications pendingCompanies={pendingCompanies} onVerify={handleVerify} />
              )}

              {activeTab === "companies" && <TabCompanies allCompanies={allCompanies} />}

              {activeTab === "showcase" && (
                <TabShowcase pendingShowcase={pendingShowcase} onAction={handleShowcaseAction} />
              )}

              {activeTab === "catalog" && (
                <TabCatalogMaster 
                  pendingProducts={pendingProducts} 
                  onAction={handleMasterProductAction} 
                />
              )}

              {activeTab === "diagnostics" && (
                <TabDiagnostics auditResults={auditResults} isLoading={isLoading} onRunAudit={runAudit} />
              )}

              {activeTab === "settings" && siteSettings && (
                <TabSettings
                  siteSettings={siteSettings}
                  isSaving={isSavingSettings}
                  onChange={setSiteSettings}
                  onSubmit={handleUpdateSettings}
                />
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
