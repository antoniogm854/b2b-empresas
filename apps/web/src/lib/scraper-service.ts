import * as cheerio from 'cheerio';
import { aiService } from './ai-service';
import { catalogService } from './catalog-service';
import { supabase } from './supabase';

export interface ScrapedProduct {
  name: string;
  description: string;
  price?: number;
  currency?: string;
  imageUrl?: string;
  sku?: string;
  category?: string;
}

export const scraperService = {
  /**
   * Extrae productos de una URL externa usando heurísticas y procesamiento de etiquetas.
   */
  async scrapeProducts(url: string, tenantId: string): Promise<ScrapedProduct[]> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Error al acceder a la URL: ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const products: ScrapedProduct[] = [];

      // Heurística 1: Buscar en tarjetas de productos comunes
      // Buscamos contenedores que parezcan productos
      const selectors = [
        '.product', '.product-item', '.item', '.card', 
        '[class*="product"]', '[class*="item"]', 'article'
      ];

      $(selectors.join(',')).each((_, el) => {
        const name = $(el).find('h1, h2, h3, h4, .title, .name').first().text().trim();
        const description = $(el).find('.description, .summary, p').first().text().trim();
        const priceText = $(el).find('.price, .amount, [class*="price"]').first().text().trim();
        const img = $(el).find('img').first().attr('src');

        if (name && name.length > 5) {
          products.push({
            name,
            description: description || 'Extraído automáticamente desde la web.',
            price: this.parsePrice(priceText),
            imageUrl: this.resolveUrl(url, img),
            currency: 'USD'
          });
        }
      });

      // Si no encontró nada con selectores específicos, intentamos con títulos directos
      if (products.length === 0) {
        $('h1, h2, h3').each((_, el) => {
          const name = $(el).text().trim();
          if (name.length > 10 && name.length < 100) {
            products.push({
              name,
              description: 'Producto detectado automáticamente.',
              currency: 'USD'
            });
          }
        });
      }

      // Limitar a máximo 20 productos para evitar sobrecarga en esta fase
      const limitedProducts = products.slice(0, 20);

      // Refinar con IA (simulado por ahora, pero integrando la lógica existente)
      const refinedProducts = await Promise.all(
        limitedProducts.map(async (p) => {
          const aiResult = await aiService.analyzeProduct(p.name, p.description);
          return {
            ...p,
            name: aiResult.optimizedName,
            category: aiResult.suggestedCategory
          };
        })
      );

      return refinedProducts;
    } catch (error) {
      console.error("Scraper Error:", error);
      throw error;
    }
  },

  /**
   * Limpia un string de precio para convertirlo a número.
   */
  parsePrice(text: string): number | undefined {
    if (!text) return undefined;
    const match = text.match(/[\d,.]+/);
    if (match) {
      return parseFloat(match[0].replace(/,/g, ''));
    }
    return undefined;
  },

  /**
   * Resuelve una URL relativa a absoluta.
   */
  resolveUrl(base: string, relative?: string): string | undefined {
    if (!relative) return undefined;
    try {
      return new URL(relative, base).href;
    } catch {
      return undefined;
    }
  }
};
