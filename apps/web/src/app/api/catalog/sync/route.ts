import { NextResponse } from 'next/server';
import { scraperService } from '@/lib/scraper-service';
import { catalogService } from '@/lib/catalog-service';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { url, tenantId } = await req.json();

    if (!url || !tenantId) {
      return NextResponse.json({ error: 'Faltan parámetros: url o tenantId' }, { status: 400 });
    }

    // 1. Registrar inicio en catalog_imports (opcional pero recomendado por el manual)
    const { data: importLog, error: logError } = await supabase
      .from('catalog_imports')
      .insert([{
        tenant_id: tenantId,
        source_url: url,
        status: 'running',
        started_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (logError) console.error("Error logging import start:", logError);

    // 2. Realizar el scraping
    const scrapedProducts = await scraperService.scrapeProducts(url, tenantId);
    
    if (scrapedProducts.length === 0) {
      return NextResponse.json({ 
        success: true, 
        count: 0, 
        message: 'No se encontraron productos significativos en la URL proporcionada. Intente con una página de catálogo más directa.' 
      });
    }

    // 3. Registrar productos en el catálogo (usando la lógica de bulkCreateProducts del catálogo)
    const productsToCreate = scrapedProducts.map(p => ({
      name: p.name,
      description: p.description,
      price: p.price || 0,
      currency: p.currency || 'USD',
      imageUrl: p.imageUrl,
      category: p.category,
      imported_from_web: true,
      import_source_url: url
    }));

    const results = await catalogService.bulkCreateProducts(tenantId, productsToCreate);

    // 4. Actualizar log de importación
    if (importLog) {
      await supabase
        .from('catalog_imports')
        .update({
          status: 'completed',
          total_products_found: scrapedProducts.length,
          total_products_imported: results.filter(r => r.id).length,
          completed_at: new Date().toISOString()
        })
        .eq('id', importLog.id);
    }

    return NextResponse.json({ 
      success: true, 
      count: results.length,
      products: results 
    });

  } catch (error: any) {
    console.error("API Sync Error:", error);
    return NextResponse.json({ 
      error: 'Error interno durante el escaneo.', 
      details: error.message 
    }, { status: 500 });
  }
}
