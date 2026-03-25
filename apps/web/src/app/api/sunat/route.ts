import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ruc = searchParams.get('ruc');

  if (!ruc || ruc.length !== 11) {
    return NextResponse.json({ error: 'RUC inválido' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.apis.net.pe/v1/ruc?numero=${ruc}`);
    if (!res.ok) {
      return NextResponse.json({ error: 'RUC no encontrado o error en la API externa' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error de conexión' }, { status: 500 });
  }
}
