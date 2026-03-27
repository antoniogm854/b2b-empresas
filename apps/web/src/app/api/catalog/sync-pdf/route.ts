import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';
import { catalogService } from '@/lib/catalog-service';
import { supabase } from '@/lib/supabase';

export const maxDuration = 300; // 5 minutos para archivos grandes
export const dynamic = 'force-dynamic';

// Nota: En Next.js 15 App Router, el bodyParser se maneja automáticamente al usar request.formData()
// Para archivos muy grandes (>100MB), la configuración del servidor (Node.js/Vercel) debe permitirlo.

export async function POST(req: NextRequest) {
  try {
    console.log("[PDF Sync] Nueva solicitud recibida.");
    
    let formData;
    try {
      formData = await req.formData();
    } catch (e: any) {
      console.error("[PDF Sync] Error al recibir FormData (posible límite excedido):", e);
      return NextResponse.json({ 
        error: "El archivo es demasiado grande o la conexión se interrumpió.", 
        details: e.message 
      }, { status: 413 });
    }

    const file = formData.get('file') as File;
    const tenantId = formData.get('tenantId') as string;

    if (!file || !tenantId) {
      return NextResponse.json({ error: 'Archivo o Tenant ID faltante' }, { status: 400 });
    }

    console.log(`[PDF Sync] Procesando: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

    // 0. Registrar inicio de importación
    const { data: importLog } = await supabase
      .from('catalog_imports')
      .insert([{
        tenant_id: tenantId,
        source_url: file.name,
        source_type: 'custom',
        status: 'running',
        started_at: new Date().toISOString()
      }])
      .select()
      .single();

    // 1. Extraer texto del PDF
    console.log(`[PDF Sync] Iniciando conversión a Buffer...`);
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(`[PDF Sync] Buffer de ${(buffer.length / 1024 / 1024).toFixed(2)} MB generado. Llamando a pdf-parse...`);
    
    // Logic inlined to bypass module loading issues (TypeError: Object.defineProperty)
    const pdfModule = eval('require')('pdf-parse');
    let rawText = "";

    try {
      if (typeof pdfModule === 'function') {
        const pdfData = await pdfModule(buffer);
        rawText = pdfData.text;
      } else if (pdfModule.PDFParse) {
        // Modern version (v2.4+) uses a class-based approach
        console.log(`[PDF Sync] Usando clase PDFParse (v2.4+)...`);
        const parser = new pdfModule.PDFParse({ data: buffer });
        const result = await parser.getText();
        rawText = result.text;
        await parser.destroy();
      } else if (typeof pdfModule.default === 'function') {
        const pdfData = await pdfModule.default(buffer);
        rawText = pdfData.text;
      } else {
        throw new Error("No se pudo encontrar una función o clase de procesamiento válida en pdf-parse.");
      }
    } catch (parseError: any) {
      console.error(`[PDF Sync] Error durante el parseo:`, parseError);
      throw parseError;
    }

    rawText = rawText
        .replace(/\n\s*\n/g, '\n') 
        .replace(/[ ]{2,}/g, ' ')  
        .trim();

    console.log(`[PDF Sync] Extracción completada: ${rawText.length} caracteres extraídos.`);

    // 2. Procesar con IA en chunks
    // Limitamos a 5 chunks para no exceder los límites de tiempo de una API estándar (demostración industrial)
    const chunks = [];
    const chunkSize = 5000;
    for (let i = 0; i < rawText.length; i += chunkSize) {
      chunks.push(rawText.substring(i, i + chunkSize));
    }
    const allExtractedProducts = [];

    for (const chunk of chunks.slice(0, 5)) {
      const products = await aiService.extractProductsFromText(chunk);
      allExtractedProducts.push(...products);
    }

    // 3. Registrar en el catálogo con normalización de campos requeridos
    const productsToCreate = allExtractedProducts.map(p => ({
      ...p,
      imported_from_web: false,
      import_source_url: `PDF: ${file.name}`
    }));

    const results = await catalogService.bulkCreateProducts(tenantId, productsToCreate);

    // 4. Finalizar log
    if (importLog) {
      await supabase
        .from('catalog_imports')
        .update({
          status: 'completed',
          total_products_found: allExtractedProducts.length,
          total_products_imported: results.length,
          completed_at: new Date().toISOString()
        })
        .eq('id', importLog.id);
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      message: `Se han procesado ${results.length} productos del catálogo PDF.`
    });

  } catch (error: any) {
    console.error("PDF Sync Error:", error);
    return NextResponse.json({ 
      error: "Error interno durante el procesamiento del PDF.", 
      details: error.message 
    }, { status: 500 });
  }
}
