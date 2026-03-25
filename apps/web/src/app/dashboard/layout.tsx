"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Home,
  Package,
  User,
  FileText,
  BarChart3,
  Users,
  MessageSquare,
  Palette,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Download,
  Smartphone
} from "lucide-react";
import { authService, UserProfile } from "@/lib/auth-service";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tenant, setTenant] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
    
    // Immediate check for PWA Welcome Mode
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'welcome') {
      router.replace('/login?mode=welcome');
      return;
    }

    const loadData = async () => {
      const user = await authService.getCurrentUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      
      // Cargar datos del Tenant para el Header dinámico
      try {
        // 1. Verificación de Rol Maestro (Superadmin)
        const internalRole = await authService.getInternalRole(user.email!);
        const isMaster = internalRole === 'superadmin';
        
        const { data: tenantData } = await supabase
          .from('tenant_users')
          .select('*, tenants(*)')
          .eq('email', user.email)
          .maybeSingle();
        
        if (tenantData?.tenants) {
          setTenant({
            ...tenantData.tenants,
            _is_master: isMaster
          });
        } else if (isMaster) {
          // Si es superadmin pero no tiene tenant vinculado, cargar el Tenant Patrón (ID: 000...0)
          const { data: masterTenant } = await supabase
            .from('tenants')
            .select('*')
            .eq('id', '00000000-0000-0000-0000-000000000000')
            .maybeSingle();
          
          if (masterTenant) {
            setTenant({ ...masterTenant, _is_master: true });
          }
        }
      } catch (err) {
        console.error("Error cargando tenant en layout:", err);
      }
      
      setCheckingAuth(false);
    };

    loadData();

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  if (!mounted || checkingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-[#A2C367] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#A2C367] font-black uppercase text-[10px] tracking-[0.4em] animate-pulse">Iniciando Centro de Control...</p>
        </div>
      </div>
    );
  }

  const handleInstallClick = async () => {
    // ... (rest of the component)
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
    router.push("/");
  };

  const menuItems = [
    { icon: Home, label: "Vista General", href: "/dashboard" },
    { icon: User, label: "Perfil DE EMPRESA", href: "/dashboard/profile" },
    { icon: Palette, label: "Diseño de Pagina", href: "/dashboard/design" },
    { icon: Package, label: "CATALOGO DIGITAL", href: "/dashboard/catalog" },
    { icon: FileText, label: "Documentos Adjuntos", href: "/dashboard/documents" },
    { icon: BarChart3, label: "Estadísticas", href: "/dashboard/analytics" },
    { icon: Users, label: "Leads de Contactos - Ventas", href: "/dashboard/leads" },
    { icon: MessageSquare, label: "Mensajes Clientes", href: "/dashboard/messages" },
    { icon: Settings, label: "Configuración", href: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)]/30 font-sans industrial-bg transition-colors duration-300">
      {/* Capa de Reflejos Industriales */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4B6319]/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#A2C367]/10 blur-[120px] rounded-full" />
      </div>

      {/* Fondo Industrial B2B para Perfil - Cobertura Total */}
      {pathname === '/dashboard/profile' && (
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.15] z-[1]"
          style={{ 
            backgroundImage: 'url("/b2b_profile_bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-screen transition-all duration-500 border-r border-[var(--border)] overflow-hidden ${
          isSidebarOpen ? "w-72" : "w-24"
        } glass shadow-2xl shadow-black/10`}
      >
        <div className="flex flex-col h-full px-5 py-8">
          <div className="flex items-center justify-between mb-12 px-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 transition-transform group-hover:scale-110 flex-shrink-0">
                <Image 
                  src="/logo/logo-icon.png" 
                  alt="Logo Icon" 
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
              {isSidebarOpen && (
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 ml-1 animate-fade-in">
                  <span className="text-xl font-black uppercase tracking-tighter italic text-[var(--strong-text)] leading-none">
                    B2B
                  </span>
                  <span className="text-xl font-black uppercase tracking-tighter italic text-[var(--primary)] leading-none">
                    EMPRESAS
                  </span>
                </div>
              )}
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-[var(--muted)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm"
            >
              {mounted && (isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />)}
            </button>
          </div>

          <nav className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar relative z-10">
            {tenant?._is_master && (
              <div className="mb-6 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 text-center animate-pulse">
                  Modo Maestro: Gestión de Patrón
                </p>
              </div>
            )}
            
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const isCatalogDigital = item.label === "CATALOGO DIGITAL";
              
              if (isCatalogDigital && isSidebarOpen) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all group border-2 ${
                      isActive 
                        ? "bg-[#A2C367]/10 border-[#A2C367] shadow-[0_0_20px_rgba(162,195,103,0.15)]" 
                        : "border-[#1A1A1A] bg-black/40 hover:bg-[#1A1A1A] hover:border-[#333333]"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-all ${
                      isActive ? "bg-[#A2C367] text-black" : "bg-[#1A1A1A] text-[#A2C367] group-hover:bg-[#A2C367] group-hover:text-black"
                    }`}>
                      {mounted && <item.icon size={22} />}
                    </div>
                    <div className="text-left">
                      <p className={`font-black uppercase text-[9px] tracking-widest leading-none mb-1 ${isActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}>Catálogo Digital</p>
                      <p className={`font-black uppercase text-xs tracking-tighter italic ${isActive ? "text-[var(--strong-text)]" : "text-[var(--primary)]"}`}>Gestión Maestro</p>
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all group relative ${
                    isActive 
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-black shadow-[0_0_20px_rgba(75,99,25,0.3)]" 
                      : "text-[var(--muted-foreground)] hover:text-[var(--strong-text)] hover:bg-[var(--muted)]"
                  }`}
                >
                  {mounted && <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-black" : "group-hover:text-[#A2C367] group-hover:scale-110 transition-all"}`} />}
                  {isSidebarOpen && (
                    <span className="font-black text-[11px] uppercase tracking-widest truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {deferredPrompt && (
            <button 
              onClick={handleInstallClick}
              className="flex items-center p-4 mb-2 rounded-2xl bg-[#A2C367] text-black hover:bg-[#A2C367]/80 transition-all font-black uppercase text-[10px] tracking-widest border border-transparent shadow-lg shadow-[#A2C367]/20" 
            >
              {mounted && <Smartphone className="w-5 h-5 shrink-0" />}
              {isSidebarOpen && <span className="ml-4">Instalar Aplicativo</span>}
            </button>
          )}

          <button 
            onClick={handleLogout}
            className="flex items-center p-4 rounded-2xl text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-600 transition-all font-black uppercase text-[10px] tracking-widest mt-auto border border-transparent hover:border-red-100" 
          >
            {mounted && <LogOut className="w-5 h-5 shrink-0" />}
            {isSidebarOpen && <span className="ml-4">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-500 pt-20 relative z-10 ${isSidebarOpen ? "pl-72" : "pl-24"}`}>
        {/* Top Header */}
        <header className={`fixed top-0 right-0 z-40 flex items-center justify-between px-8 glass border-b border-[var(--border)] transition-all duration-500 h-20 ${isSidebarOpen ? "left-72" : "left-24"}`}>
          <div className="flex-1" />

          <div className="flex items-center space-x-6">
            <ThemeToggle />
            
            <button className="relative p-2.5 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)] hover:border-[#A2C367]/50 transition-all group overflow-hidden">
              <div className="absolute inset-0 bg-[#A2C367]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              {mounted && <Bell size={18} className="text-[#A2C367] relative z-10" />}
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#A2C367] rounded-full border border-[var(--background)] z-20 shadow-[0_0_8px_#A2C367]"></span>
            </button>
            
            <div className="h-6 w-px bg-[#1A1A1A] mx-2"></div>

            <div className="flex items-center space-x-4 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-[var(--strong-text)] leading-none uppercase tracking-tighter italic group-hover:text-[var(--primary)] transition-colors">
                  {tenant?._is_master ? "PANEL MAESTRO - PATRON" : (tenant?.company_name || user?.user_metadata?.full_name || "PROVEEDOR B2B")}
                </p>
                <p className="text-[9px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mt-1">
                  {tenant?._is_master ? "RUC: 00000000000" : `RUC: ${tenant?.ruc_rut_nit || "Pendiente"}`}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[var(--muted)] border-2 border-[var(--border)] group-hover:border-[#A2C367] transition-all flex items-center justify-center font-black text-[#A2C367] shadow-xl uppercase text-base italic overflow-hidden relative">
                 {tenant?.logo_url ? (
                   <Image 
                     src={tenant.logo_url} 
                     alt="Empresa" 
                     fill 
                     className="object-cover"
                   />
                 ) : (
                   <>
                     <div className="absolute inset-0 bg-gradient-to-tr from-[#A2C367]/10 to-transparent" />
                     <span className="relative z-10">
                       {(tenant?.company_name || "RP").substring(0, 2).toUpperCase()}
                     </span>
                   </>
                 )}
               </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 lg:p-12 animate-fade-in max-w-7xl mx-auto relative z-10">
          {children}
        </div>
        
        {/* Watermark Logo */}
        <div className="watermark-logo" />
      </main>

    </div>
  );
}
