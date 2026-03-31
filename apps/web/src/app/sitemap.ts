import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.b2bempresas.com'
  
  // Páginas dinámicas: productos del catálogo maestro
  const { data: products } = await supabase
    .from('tenant_catalog')
    .select('id')
    .eq('is_active', true)
    .limit(200)

  const productUrls = (products || []).map((p) => ({
    url: `${baseUrl}/marketplace/product/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Páginas dinámicas: perfiles de empresa (Showcases SEO)
  const { data: tenants } = await supabase
    .from('tenants')
    .select('slug, updated_at')
    .limit(200)

  const tenantUrls = (tenants || []).map((t) => ({
    url: `${baseUrl}/${t.slug}`,
    lastModified: t.updated_at ? new Date(t.updated_at) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }))

  return [
    // Páginas principales
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/marketplace`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/socios`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    // Páginas institucionales
    { url: `${baseUrl}/quality`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/security`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/confianza`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/sostenibilidad`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    // Catálogos dinámicos
    ...tenantUrls
  ]
}
