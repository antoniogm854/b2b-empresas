import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET() {
  try {
    // Intentar obtener un registro para inspeccionar las columnas y sus tipos
    const { data, error } = await supabase
      .from('tenant_catalog')
      .select('*')
      .limit(1);

    if (error) throw error;

    const columnInfo = data && data.length > 0 
      ? Object.keys(data[0]).map(key => ({ 
          name: key, 
          type: typeof data[0][key],
          sample: data[0][key] 
        }))
      : [];

    return NextResponse.json({ 
      table: 'tenant_catalog',
      columns: columnInfo
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
