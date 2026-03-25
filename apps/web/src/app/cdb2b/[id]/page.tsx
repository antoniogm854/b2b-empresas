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
    description: `Consulta el catálogo industrial de ${tenant.company_name}. Productos de alta calidad y fichas técnicas.`,
    openGraph: {
      title: tenant.company_name,
      description: "Catálogo Digital B2B - Vitrina de Productos Industriales",
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
