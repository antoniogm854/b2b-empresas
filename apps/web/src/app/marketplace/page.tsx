import MarketplaceClient from "./MarketplaceClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Marketplace");
  return {
    title: t('seo_title'),
    description: t('seo_desc'),
  };
}

export default function MarketplacePage() {
  return <MarketplaceClient />;
}
