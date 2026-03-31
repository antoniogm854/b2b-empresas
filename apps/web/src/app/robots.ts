import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin-console/', '/dashboard/', '/master/', '/login/', '/register/'],
    },
    sitemap: 'https://www.b2bempresas.com/sitemap.xml',
  }
}
