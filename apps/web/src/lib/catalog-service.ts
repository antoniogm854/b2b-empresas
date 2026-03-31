import { supabase } from './supabase';
import { normalizeBrand, generateSlug } from './catalog-utils';

export interface Product {
  id: string;
  tenant_id: string;
  master_product_id?: string;
  custom_name: string;
  custom_description?: string;
  unit_price?: number;
  currency?: string;
  stock_available?: boolean;
  stock_quantity?: number;
  is_active: boolean;
  image_url?: string;
  sku_cuie?: string;
  brand?: string;
  model?: string;
  origin?: string;
  is_most_requested?: boolean;
  images?: string[];
  documents?: string[];
  location?: string;
  dispatch_time?: string;
  availability?: string;
  metadata?: any;
  catalog_master?: {
    sku_cuim?: string;
    sku_mpn?: string;
    brand?: string;
    model?: string;
  };
  created_at?: string;
}

export interface CatalogMasterProduct {
  id: string;
  sku_cuim?: string;
  sku_mpn?: string;
  sku_gg?: string;
  sku_ge?: string;
  product_name: string;
  description?: string;
  unit_measure?: string;
  brand?: string;
  model?: string;
  code_serial?: string;
  color?: string;
  size?: string;
  material?: string;
  origin?: string;
  observations?: string;
  presentation?: string;
  is_certified?: boolean;
  certification_detail?: string;
  image_url_1?: string;
  image_url_2?: string;
  image_url_3?: string;
  datasheet_url_1?: string;
  datasheet_url_2?: string;
  datasheet_url_3?: string;
  status: 'active' | 'review' | 'inactive';
}

export const catalogService = {
  // Obtener conteo de productos de un tenant
  async getTenantProductCount(tenantId: string) {
    const { count, error } = await supabase
      .from('tenant_catalog')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);
    
    if (error) throw error;
    return count || 0;
  },

  // Verificar si un tenant puede agregar más productos (Límite 20 en Free)
  async canAddProduct(tenantId: string, currentPlan: string = 'free') {
    if (currentPlan !== 'free') return { allowed: true };
    
    const count = await this.getTenantProductCount(tenantId);
    return {
      allowed: count < 20,
      current: count,
      limit: 20
    };
  },

  // Obtener productos de un tenant específico
  async getTenantProducts(tenantId: string) {
    const { data, error } = await supabase
      .from('tenant_catalog')
      .select('*, catalog_master(sku_cuim, sku_mpn, brand, model)')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as any[];
  },

  // Buscar en el Catálogo Maestro (catalog_master)
  // Usa full-text search si hay query, de lo contrario devuelve todos
  async searchMaster(query: string) {
    let q = supabase
      .from('catalog_master')
      .select('id, sku_cuim, sku_gg, product_name, brand, model, image_url_1, description, slug, status')
      .eq('status', 'active');

    if (query && query.trim().length > 0) {
      // Intentar full-text search primero; si falla, usar ilike
      try {
        const { data, error } = await supabase
          .from('catalog_master')
          .select('id, sku_cuim, sku_gg, product_name, brand, model, image_url_1, description, slug, status')
          .textSearch('search_vector', query, { type: 'websearch', config: 'spanish' })
          .eq('status', 'active')
          .limit(30);

        if (!error && data && data.length > 0) return data as any[];
      } catch (_) { /* fall through to ilike */ }

      // Fallback: búsqueda por ilike en nombre y marca
      q = q.or(
        `product_name.ilike.%${query}%,brand.ilike.%${query}%,sku_gg.ilike.%${query}%,sku_cuim.ilike.%${query}%`
      );
    }

    const { data, error } = await q.limit(30);
    if (error) throw error;
    return data as any[];
  },

  // Búsqueda Paramétrica de Alto Rendimiento (v6.0)
  async searchParametric(filters: {
    query?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
  }) {
    let q = supabase
      .from('catalog_master')
      .select(`
        *,
        tenant_catalog!left (
          unit_price,
          currency,
          stock_available
        )
      `);

    if (filters.query) {
      q = q.ilike('product_name', `%${filters.query}%`);
    }
    if (filters.category) {
      q = q.eq('category_id', filters.category);
    }
    if (filters.brand) {
      q = q.eq('brand', filters.brand);
    }
    // Nota: El filtrado por precio se realiza sobre tenant_catalog en una subconsulta o post-filtro
    // Para v6.0 optimizaremos con una vista o consulta RPC si el volumen crece.
    
    const { data, error } = await q.limit(filters.limit || 50);

    if (error) throw error;

    // Post-filtrado de precios si es necesario
    let results = data;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      results = data.filter(item => {
        const prices = item.tenant_catalog?.map((tc: any) => tc.unit_price) || [];
        if (prices.length === 0) return true; // Si no hay precio, lo incluimos (a convenir)
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        if (filters.minPrice && max < filters.minPrice) return false;
        if (filters.maxPrice && min > filters.maxPrice) return false;
        return true;
      });
    }

    return results;
  },

  // Obtener categorías únicas para filtros
  async getUniqueCategories() {
    const { data, error } = await supabase
      .from('catalog_master')
      .select('category_id')
      .not('category_id', 'is', null);
    
    if (error) throw error;
    return Array.from(new Set(data.map(i => i.category_id))) as string[];
  },

  // Obtener marcas únicas para filtros
  async getUniqueBrands() {
    const { data, error } = await supabase
      .from('catalog_master')
      .select('brand')
      .not('brand', 'is', null);
    
    if (error) throw error;
    return Array.from(new Set(data.map(i => i.brand))) as string[];
  },

  // Vincular un producto del Maestro al catálogo del tenant
  async linkMasterProduct(tenantId: string, masterProduct: CatalogMasterProduct, customData?: any) {
    // 1. Verificar plan y límites
    const { data: tenant } = await supabase.from('tenants').select('plan').eq('id', tenantId).single();
    const limitCheck = await this.canAddProduct(tenantId, tenant?.plan || 'free');
    
    if (!limitCheck.allowed) {
      throw new Error(`Límite alcanzado: Tu plan actual permite un máximo de ${limitCheck.limit} productos. Actualiza a Catálogo Digital PRO.`);
    }

    const { data: linkData, error: linkError } = await supabase
      .from('tenant_catalog')
      .insert([
        {
          tenant_id: tenantId,
          master_product_id: masterProduct.id,
          custom_name: customData?.custom_name || masterProduct.product_name,
          custom_description: customData?.custom_description || `Producto vinculado desde Catálogo Maestro. Marca: ${masterProduct.brand || 'N/A'} - Modelo: ${masterProduct.model || 'N/A'}`,
          unit_price: customData?.unit_price || 0,
          stock_available: true,
          is_active: true,
          sku_cuie: customData?.sku_cuie
        }
      ])
      .select()
      .single();

    if (linkError) throw linkError;
    return linkData as Product;
  },

  // Obtener un producto por ID
  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('tenant_catalog')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Product;
  },

  // Actualizar un producto
  async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('tenant_catalog')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  // Crear productos en masa (Onboarding / Importación)
  // Sigue el flujo: 1. Crear en catalog_master -> 2. Crear en tenant_catalog
  async bulkCreateProducts(tenantId: string, products: any[]) {
    // 🛡️ Verificar plan y límites (v6.0)
    const { data: tenant } = await supabase.from('tenants').select('plan').eq('id', tenantId).single();
    const currentCount = await this.getTenantProductCount(tenantId);
    
    if ((tenant?.plan === 'free' || !tenant?.plan) && (currentCount + products.length) > 20) {
      throw new Error(`Límite excedido: No puedes tener más de 20 productos en el plan Free. Estás intentando subir ${products.length} para un total de ${currentCount + products.length}.`);
    }

    // 1. Preparar inserción en catalog_master (con slug y normalización de marca)
    const masterInserts = products.map((p) => {
      const normalizedBrand = normalizeBrand(p.brand) ?? p.brand;
      const slug = generateSlug(p.name, normalizedBrand, p.model);
      
      // Auto-generación de SKU-CUIM si no existe (Digital DNA)
      const autoCUIM = p.skuCUIM || `CMB-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      
      return {
        product_name: p.name,
        description:  p.description,
        brand:        normalizedBrand,
        model:        p.model,
        sku_mpn:      p.skuMPN,
        unit_measure: p.unit,
        sku_cuim:     autoCUIM,
        sku_gg:       p.skuGG,
        sku_ge:       p.skuGE,
        code_serial:  p.serial,
        color:        p.color,
        size:         p.size,
        material:     p.material,
        origin:       p.origin,
        observations: p.observations,
        presentation: p.presentation,
        is_certified: p.isCertified === true || p.isCertified === 'true',
        image_url_1:  p.images?.[0] || p.imageUrl,
        image_url_2:  p.images?.[1],
        image_url_3:  p.images?.[2],
        datasheet_url_1: p.documents?.[0],
        datasheet_url_2: p.documents?.[1],
        datasheet_url_3: p.documents?.[2],
        slug,
        source:           'manual',
        source_tenant_id: tenantId,
        status:           'review'
      };
    });

    const { data: masterData, error: masterError } = await supabase
      .from('catalog_master')
      .upsert(masterInserts, { onConflict: 'sku_cuim' })
      .select('id, sku_cuim');

    if (masterError) throw masterError;

    // 2. Preparar inserción en tenant_catalog vinculando los IDs creados
    const tenantInserts = products.map((p, index) => {
      const masterProduct = masterData?.find(m => m.sku_cuim === masterInserts[index].sku_cuim);
      
      // Auto-generación de CID-CUIE (Company Unique ID)
      const autoCUIE = p.skuCUIE || `CORP-${tenantId.substring(0, 4).toUpperCase()}-${Math.floor(Date.now() / 1000).toString().slice(-4)}`;
      
      return {
        tenant_id: tenantId,
        master_product_id: masterProduct?.id,
        sku_cuie: autoCUIE,
        custom_name: p.name,
        custom_description: p.description,
        unit_price: parseFloat(p.price) || 0,
        stock_available: (parseInt(p.stock) || 0) > 0,
        stock_quantity: parseInt(p.stock) || 0,
        dispatch_time: p.dispatch,
        location: p.location,
        is_active: true
      };
    });

    const { data: tenantData, error: tenantError } = await supabase
      .from('tenant_catalog')
      .upsert(tenantInserts, { onConflict: 'sku_cuie', ignoreDuplicates: false })
      .select();

    if (tenantError) throw tenantError;
    return tenantData;
  },

  // Actualizar un producto del Maestro (Admin Console)
  // Incluye normalización automática de marca y regeneración de slug
  async updateMasterProduct(id: string, updates: any) {
    const dataToUpdate = { ...updates };
    
    // Si se actualizan campos clave, normalizamos
    if (dataToUpdate.brand) {
      dataToUpdate.brand = normalizeBrand(dataToUpdate.brand) ?? dataToUpdate.brand;
    }

    const { data, error } = await supabase
      .from('catalog_master')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Obtener plantillas técnicas inteligentes (v1.04)
  async getSpecsTemplates() {
    const { data, error } = await supabase
      .from('specs_templates')
      .select('category, template')
      .order('category', { ascending: true });
    
    if (error) {
      console.warn("Specs Templates not found or table missing. Skipping dynamic specs.");
      return [];
    }
    return data;
  }
};
