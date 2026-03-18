import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.b2bempresas.com'),
  alternates: {
    canonical: '/',
  },
  title: "B2B EMPRESAS | Plataforma Industrial Corporativa",
  description: "Infraestructura Digital B2B de alta precisión para el Sector Industrial de Latinoamericana. Somos La Plataforma y Entorno 360º de Gestión y Desarrollo Empresarial en Latam.",
  keywords: ["b2b", "industrial", "catálogo", "proveedores", "leads", "pwa", "B2B Empresas"],
  manifest: "/manifest.json",
  openGraph: {
    title: "B2B EMPRESAS | La Red Maestra Industrial",
    description: "Conectamos proveedores líderes con compradores corporativos en un ecosistema inteligente.",
    url: "https://www.b2bempresas.com",
    siteName: "B2B Empresas",
    images: [
      {
        url: "/logo/logo-full.png",
        width: 1200,
        height: 630,
        alt: "B2B Empresas Logo",
      },
      {
        url: "/hero.webp",
        width: 1200,
        height: 630,
        alt: "B2B Empresas Industrial Portal",
      },
    ],
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "B2B EMPRESAS | La Red Maestra Industrial",
    description: "Infraestructura Digital B2B para el sector Industrial.",
    images: ["/hero.webp"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "B2B Empresas",
  },
};

export const viewport = {
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

import { PWAProvider } from "@/components/pwa/PWAProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <PWAProvider>
          {children}
        </PWAProvider>
      </body>
    </html>
  );
}
