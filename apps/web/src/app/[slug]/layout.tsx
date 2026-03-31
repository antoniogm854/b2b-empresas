import { Metadata } from 'next';
import { companyService } from '@/lib/company-service';

interface Props {
  children: React.ReactNode;
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tenant = await companyService.getTenantBySlug(params.slug);

  if (!tenant) {
    return {
      title: 'Empresa No Encontrada | B2B Empresas',
      description: 'El catálogo solicitado no existe en nuestra red maestra.',
    };
  }

  const companyName = tenant.trade_name || tenant.company_name;

  return {
    title: `${companyName} | Catálogo Digital B2B Premium`,
    description: tenant.description || `Explora el catálogo digital de ${companyName}. Suministros industriales con validación SUNAT y contacto directo vía WhatsApp.`,
    openGraph: {
      title: `${companyName} - Vitrina Digital B2B`,
      description: tenant.description || `Catálogo de suministros industriales de ${companyName}.`,
      images: tenant.logo_url ? [tenant.logo_url] : [],
    },
    keywords: [companyName, 'B2B', 'Suministros Industriales', 'Catálogo Digital', tenant.sector || ''],
  };
}

export default function ShowcaseLayout({ children }: Props) {
  return (
    <div className="showcase-container">
      {children}
    </div>
  );
}
