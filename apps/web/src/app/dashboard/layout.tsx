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
  GitCompare,
  Users,
  MessageSquare,
  Palette,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { icon: Home, label: "Vista General", href: "/dashboard", active: true },
    { icon: Package, label: "Mi Catálogo", href: "/dashboard/catalog" },
    { icon: User, label: "Perfil de Empresa", href: "/dashboard/profile" },
    { icon: FileText, label: "Documentos", href: "/dashboard/documents" },
    { icon: BarChart3, label: "Estadísticas", href: "/dashboard/analytics" },
    { icon: GitCompare, label: "Comparador B2B", href: "/dashboard/compare" },
    { icon: Users, label: "Leads de Venta", href: "/dashboard/leads" },
    { icon: MessageSquare, label: "Mensajes", href: "/dashboard/messages" },
    { icon: Palette, label: "Diseño PWA", href: "/dashboard/design" },
    { icon: Settings, label: "Configuración", href: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-primary border-r border-primary-foreground/10`}
      >
        <div className="flex flex-col h-full px-4 py-6">
          <div className="flex items-center justify-between mb-10 px-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 transition-transform group-hover:scale-110 flex-shrink-0">
                <Image 
                  src="/logo/logo-icon.png" 
                  alt="Logo Icon" 
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                  suppressHydrationWarning
                />
              </div>
              {isSidebarOpen && (
                <div className="relative w-32 h-6 transition-all animate-in fade-in slide-in-from-left-2 duration-500">
                  <Image 
                    src="/logo/logo-text.png" 
                    alt="B2B Empresas" 
                    width={128}
                    height={24}
                    className="object-contain logo-emerald"
                    priority
                    suppressHydrationWarning
                  />
                </div>
              )}
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              suppressHydrationWarning
            >
              {mounted && (isSidebarOpen ? <X size={20} /> : <Menu size={20} />)}
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center space-x-4 p-4 rounded-2xl transition-all group ${
                  item.active 
                    ? "bg-accent text-primary shadow-lg shadow-accent/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                suppressHydrationWarning
              >
                {mounted && <item.icon className="w-6 h-6 shrink-0" />}
                {isSidebarOpen && (
                  <span className="font-bold truncate">{item.label}</span>
                )}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 p-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            ))}
          </nav>

          <button className="flex items-center p-3 rounded-2xl text-accent hover:bg-accent/10 transition-all font-bold mt-auto" suppressHydrationWarning>
            {mounted && <LogOut className="w-6 h-6 shrink-0" />}
            {isSidebarOpen && <span className="ml-4">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? "pl-64" : "pl-20"}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-md border-b">
          <div className="flex items-center bg-muted px-4 py-2 rounded-2xl w-full max-w-md" suppressHydrationWarning>
            {mounted && <Search className="text-muted-foreground mr-3" size={18} />}
            <input 
              type="text" 
              placeholder="Buscar productos, leads..." 
              className="bg-transparent border-none outline-none font-bold text-sm w-full"
            />
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 rounded-xl hover:bg-muted transition-colors" suppressHydrationWarning>
              {mounted && <Bell size={20} className="text-muted-foreground" />}
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
            </button>
            
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-black text-primary leading-none">Admin Demo</p>
                <p className="text-xs font-bold text-muted-foreground">Plan Premium</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center font-black text-primary-foreground shadow-lg shadow-accent/20">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
