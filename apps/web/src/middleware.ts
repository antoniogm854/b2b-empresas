import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let response = NextResponse.next();
  
  // 🌍 Locale and Public Routes
  const isPublicRoute = /^\/($|login|register|sobre-nosotros|catalogo-digital|catalogo-maestro|planes|blog|contacto|privacidad|terminos|cookies|calidad|seguridad|confianza|sostenibilidad|inversores|marketing|socios)/.test(pathname);
  
  if (isPublicRoute) {
    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'es';
    response.cookies.set('NEXT_LOCALE', locale);
    response.headers.set('X-NEXT-INTL-LOCALE', locale);
  }

  // 🔒 Protected Routes Guard (Dashboard / PWA Entry)
  if (request.nextUrl.searchParams.get('mode') === 'welcome' && pathname !== '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Preserve search params for LoginClient to handle logout
    return NextResponse.redirect(url);
  }

  /*
  if (pathname.startsWith('/dashboard')) {
    const hasSession = request.cookies.get('sb-access-token') || request.cookies.get('supabase-auth-token');
    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  */

  // 🛡️ Security Headers
  const securityHeaders = {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://ipapi.co;",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
