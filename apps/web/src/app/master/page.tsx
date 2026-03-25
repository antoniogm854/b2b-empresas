import MasterClient from "./MasterClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Master");
  return {
    title: t('seo_title'),
    description: t('seo_desc'),
  };
}

export default function MasterPage() {
  return <MasterClient />;
}
