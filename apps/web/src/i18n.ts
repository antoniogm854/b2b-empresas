import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

const locales = ['es', 'pt', 'en'];

export default getRequestConfig(async ({ locale }) => {
  // Intentar leer desde URL param, luego desde cookie NEXT_LOCALE
  let finalLocale = locale as string;
  if (!finalLocale || !locales.includes(finalLocale)) {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
    finalLocale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : 'es';
  }

  return {
    locale: finalLocale,
    messages: (await import(`../messages/${finalLocale}.json`)).default
  };
});
