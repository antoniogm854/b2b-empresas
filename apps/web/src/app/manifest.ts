import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CATALOGO DIGITAL - B2B EMPRESAS',
    short_name: 'CATALOGO B2B',
    description: 'Sistema de Gestión de Catálogo Digital e Identidad B2B',
    start_url: '/login?mode=welcome',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4B6319',
    icons: [
      {
        src: '/logo/logo-icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo/logo-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo/logo-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
