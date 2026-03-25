import { NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';

dns.setServers(['8.8.8.8', '8.8.4.4']);
const resolveMx = promisify(dns.resolveMx);

const COMMON_DOMAINS = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'protonmail.com', 'me.com', 'live.com'];

export async function POST(request: Request) {
  try {
    const { domain } = await request.json();
    const cleanDomain = domain?.toLowerCase().trim();

    if (!cleanDomain) {
      return NextResponse.json({ error: 'Dominio es requerido' }, { status: 400 });
    }

    // Fallback: Si es un dominio sumamente común, lo damos por válido inmediatamente
    if (COMMON_DOMAINS.includes(cleanDomain)) {
      return NextResponse.json({ valid: true, source: 'whitelist' });
    }

    // Intentar resolver registros MX
    try {
      const addresses = await resolveMx(cleanDomain);
      
      if (addresses && addresses.length > 0) {
        return NextResponse.json({ valid: true, message: 'MX records found' });
      }
    } catch (dnsError: any) {
      // Si el error es "not found", entonces el dominio realmente no existe
      if (dnsError.code === 'ENOTFOUND' || dnsError.code === 'ENODATA') {
        return NextResponse.json({ valid: false, message: 'Domain not found or no MX' });
      }
      
      // Para otros errores (timeout, network), permitimos por defecto para no bloquear al usuario
      console.error(`DNS Query Error for ${cleanDomain}:`, dnsError.code);
      return NextResponse.json({ valid: true, message: 'DNS lookup failed, allowing by default', error: dnsError.code });
    }

    return NextResponse.json({ valid: false, message: 'No MX records detected' });

  } catch (error) {
    console.error('General Error in validate-domain API:', error);
    return NextResponse.json({ valid: true, message: 'Error in validation, allowing by default' });
  }
}
