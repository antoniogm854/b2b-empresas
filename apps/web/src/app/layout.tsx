import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
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

// Metadata dinámica por idioma — se actualiza con el locale del cookie NEXT_LOCALE
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const titles: Record<string, string> = {
    es: 'B2B EMPRESAS | Industrial Premium - Conectividad Global',
    pt: 'B2B EMPRESAS | Industrial Premium - Conectividade Global',
    en: 'B2B EMPRESAS | Industrial Premium - Global Connectivity',
  };
  const descs: Record<string, string> = {
    es: 'Infraestructura Digital B2B de alta precisión para el Sector Industrial de Latinoamérica.',
    pt: 'Infraestrutura Digital B2B de alta precisão para o Setor Industrial da América Latina.',
    en: 'High-precision B2B Digital Infrastructure for the Industrial Sector of Latin America.',
  };
  const ogTitles: Record<string, string> = {
    es: 'B2B EMPRESAS | La Red Maestra Industrial',
    pt: 'B2B EMPRESAS | A Rede Mestra Industrial',
    en: 'B2B EMPRESAS | The Industrial Master Network',
  };
  const ogDescs: Record<string, string> = {
    es: 'Conectamos proveedores líderes con compradores corporativos en un ecosistema inteligente.',
    pt: 'Conectamos fornecedores líderes com compradores corporativos em um ecossistema inteligente.',
    en: 'We connect leading suppliers with corporate buyers in an intelligent ecosystem.',
  };

  const t = titles[locale] || titles.es;
  const d = descs[locale] || descs.es;
  const og = ogTitles[locale] || ogTitles.es;
  const ogd = ogDescs[locale] || ogDescs.es;

  return {
    metadataBase: new URL('https://www.b2bempresas.com'),
    alternates: { canonical: '/' },
    title: t,
    description: d,
    keywords: [
      'b2b', 'industrial', 'catálogo digital', 'proveedores perú', 'proveedores latinoamérica', 
      'comercio industrial', 'b2b empresas', 'transformación digital b2b', 'leads industriales',
      'compliance industrial', 'cuup', 'servicios para empresas', 'suministros industriales',
      'maquinaria pesada', 'minería perú', 'logística b2b', 'marketplace industrial'
    ],
    manifest: '/manifest.json',
    openGraph: {
      title: og,
      description: ogd,
      url: 'https://www.b2bempresas.com',
      siteName: 'B2B Empresas',
      images: [
        { url: '/logo/logo-full.png', width: 1200, height: 630, alt: 'B2B Empresas Logo' },
        { url: '/hero.webp', width: 1200, height: 630, alt: 'B2B Empresas Industrial Portal' },
      ],
      locale: locale === 'pt' ? 'pt_BR' : locale === 'en' ? 'en_US' : 'es_PE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: og,
      description: d,
      images: ['/hero.webp'],
    },
    verification: { google: 'FAYhqOoL1Nl-i4G10Ws9yYkB8rVXY_BnvtOTZMQ3854' },
    appleWebApp: { capable: true, statusBarStyle: 'default', title: 'B2B Empresas' },
  };
}

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import { PWAProvider } from "@/components/pwa/PWAProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) theme = 'light';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <PWAProvider>
            {children}
          </PWAProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
