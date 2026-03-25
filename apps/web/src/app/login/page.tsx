import LoginClient from "./LoginClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Login");
  return {
    title: t('seo_title'),
    description: t('seo_desc'),
  };
}

export default function LoginPage() {
  return <LoginClient />;
}
