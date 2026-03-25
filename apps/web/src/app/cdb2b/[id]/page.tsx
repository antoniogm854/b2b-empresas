import { catalogService } from "@/lib/catalog-service";
import { companyService } from "@/lib/company-service";
import CatalogView from "@/components/cdb2b/view/CatalogView";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tenant = await companyService.getTenantById(id);
  if (!tenant) return { title: "Catálogo no encontrado" };
  
  return {
    title: `${tenant.company_name} | Catálogo Digital B2B`,
    description: `Catálogo Oficial de ${tenant.trade_name || tenant.company_name}. Sector: ${tenant.sector || 'Industrial'}. Consulte productos técnicos, fichas y disponibilidad en nuestra vitrina digital certificada.`,
    openGraph: {
      title: `Catálogo Industrial: ${tenant.company_name}`,
      description: `Especialistas en ${tenant.sector || 'Suministros B2B'}. Ver catálogo oficial.`,
      images: [
        {
          url: tenant.logo_url || "/logo/logo-icon.png",
          width: 800,
          height: 600,
          alt: `Logo ${tenant.company_name}`,
        },
      ],
      type: 'website',
      siteName: 'B2B Empresas',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tenant.company_name} | Catálogo B2B`,
      description: `Vitrina digital de suministros industriales.`,
      images: [tenant.logo_url || "/logo/logo-icon.png"],
    },
  };
}

export default async function PublicCatalogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [tenant, products] = await Promise.all([
    companyService.getTenantById(id),
    catalogService.getTenantProducts(id)
  ]);

  if (!tenant) notFound();

  return <CatalogView tenant={tenant} products={products} />;
}
