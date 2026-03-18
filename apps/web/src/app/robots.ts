import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin-console/', '/dashboard/'],
    },
    sitemap: 'https://www.b2bempresas.com/sitemap.xml',
  }
}
