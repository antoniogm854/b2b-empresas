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
  category_id?: string;
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
  slug?: string;
  status: 'active' | 'review' | 'inactive';
}

export const catalogService = {
  // ─── GENERADORES INDUSTRIALES (Digital DNA) ───────────────────────────────
  
  generateCUIM(categoryPrefix: string = 'SUM'): string {
    const years = new Date().getFullYear().toString().substring(2);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `SKU-CUIM-${categoryPrefix}-${years}${random}`;
  },

  generateCUIE(ruc: string | undefined): string {
    const cleanRuc = ruc || '00000000000';
    const random = Math.floor(100 + Math.random() * 899);
    const seq = Math.floor(1000 + Math.random() * 8999);
    return `CUIE-CUIM-${cleanRuc}-${random}${seq}`;
  },

  // ─── GESTIÓN DE TENANTS ──────────────────────────────────────────────────

  async getTenantProductCount(tenantId: string) {
    const { count, error } = await supabase
      .from('tenant_catalog')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);
    
    if (error) throw error;
    return count || 0;
  },

  async canAddProduct(tenantId: string, currentPlan: string = 'free') {
    if (currentPlan !== 'free') return { allowed: true };
    const count = await this.getTenantProductCount(tenantId);
    return {
      allowed: count < 20,
      current: count,
      limit: 20
    };
  },

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

  // ─── BÚSQUEDA Y FILTRADO ─────────────────────────────────────────────────

  async searchMaster(query: string) {
    let q = supabase
      .from('catalog_master')
      .select('id, sku_cuim, sku_gg, product_name, brand, model, image_url_1, description, slug, status')
      .eq('status', 'active');

    if (query && query.trim().length > 0) {
      try {
        const { data, error } = await supabase
          .from('catalog_master')
          .select('id, sku_cuim, sku_gg, product_name, brand, model, image_url_1, description, slug, status')
          .textSearch('search_vector', query, { type: 'websearch', config: 'spanish' })
          .eq('status', 'active')
          .limit(30);

        if (!error && data && data.length > 0) return data as any[];
      } catch (_) {}

      q = q.or(
        `product_name.ilike.%${query}%,brand.ilike.%${query}%,sku_gg.ilike.%${query}%,sku_cuim.ilike.%${query}%`
      );
    }

    const { data, error } = await q.limit(30);
    if (error) throw error;
    return data as any[];
  },

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

    if (filters.query) q = q.ilike('product_name', `%${filters.query}%`);
    if (filters.category) q = q.eq('category_id', filters.category);
    if (filters.brand) q = q.eq('brand', filters.brand);
    
    const { data, error } = await q.limit(filters.limit || 50);
    if (error) throw error;

    let results = data;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      results = data.filter(item => {
        const prices = item.tenant_catalog?.map((tc: any) => tc.unit_price) || [];
        if (prices.length === 0) return true;
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        if (filters.minPrice && max < filters.minPrice) return false;
        if (filters.maxPrice && min > filters.maxPrice) return false;
        return true;
      });
    }
    return results;
  },

  async getUniqueCategories() {
    const { data, error } = await supabase
      .from('catalog_master')
      .select('category_id')
      .not('category_id', 'is', null);
    if (error) throw error;
    return Array.from(new Set(data.map(i => i.category_id))) as string[];
  },

  async getUniqueBrands() {
    const { data, error } = await supabase
      .from('catalog_master')
      .select('brand')
      .not('brand', 'is', null);
    if (error) throw error;
    return Array.from(new Set(data.map(i => i.brand))) as string[];
  },

  // ─── DEDUPLICACIÓN Y FUSIÓN (v6.1.8) ───────────────────────────────────────

  async findExistingProduct(tenantId: string, params: { sku?: string, name?: string, category?: string }) {
    if (params.sku) {
      const { data: bySKU } = await supabase
        .from('tenant_catalog')
        .select('*, master_product_id(*)')
        .eq('tenant_id', tenantId)
        .eq('sku_cuie', params.sku)
        .maybeSingle();
      if (bySKU) return bySKU;
    }

    if (params.name) {
      const { data: byName } = await supabase
        .from('tenant_catalog')
        .select('*, master_product_id(*)')
        .eq('tenant_id', tenantId)
        .ilike('custom_name', params.name)
        .maybeSingle();

      if (byName) {
        const currentCategory = byName.metadata?.category || byName.master_product_id?.sku_gg;
        if (!params.category || currentCategory === params.category) {
          return byName;
        }
      }
    }

    if (params.name) {
      const { data: byMaster } = await supabase
        .from('catalog_master')
        .select('*')
        .ilike('product_name', params.name)
        .eq('sku_gg', params.category)
        .maybeSingle();
      if (byMaster) return { isMaster: true, ...byMaster };
    }
    return null;
  },

  mergeProductData(existing: any, newData: any) {
    const merged = { ...existing };
    if (!merged.custom_description && (newData.observations || newData.description)) {
      merged.custom_description = newData.observations || newData.description;
    }
    if (!merged.unit_price && newData.price) merged.unit_price = parseFloat(newData.price);
    if (newData.stock) merged.stock_quantity = (merged.stock_quantity || 0) + parseInt(newData.stock);
    if (newData.dispatch) merged.dispatch_time = newData.dispatch;
    if (newData.location) merged.location = newData.location;

    if (newData.images) {
      merged.images = Array.from(new Set([...(merged.images || []), ...newData.images]));
    }
    if (newData.files) {
      merged.documents = Array.from(new Set([...(merged.documents || []), ...newData.files]));
    }
    return merged;
  },

  // ─── ESCRITURA Y VINCULACIÓN ─────────────────────────────────────────────

  async linkMasterProduct(tenantId: string, masterProduct: CatalogMasterProduct, customData?: any) {
    const { data: tenant } = await supabase.from('tenants').select('plan').eq('id', tenantId).single();
    const limitCheck = await this.canAddProduct(tenantId, tenant?.plan || 'free');
    if (!limitCheck.allowed) {
      throw new Error(`Límite alcanzado: Tu plan actual permite un máximo de ${limitCheck.limit} productos.`);
    }

    const { data: linkData, error: linkError } = await supabase
      .from('tenant_catalog')
      .insert([{
        tenant_id: tenantId,
        master_product_id: masterProduct.id,
        custom_name: customData?.custom_name || masterProduct.product_name,
        custom_description: customData?.custom_description || `Vinculado desde Maestro. Marca: ${masterProduct.brand || 'N/A'}`,
        unit_price: customData?.unit_price || 0,
        stock_available: true,
        is_active: true,
        sku_cuie: customData?.sku_cuie
      }])
      .select().single();

    if (linkError) throw linkError;
    return linkData as Product;
  },

  async createProduct(tenantId: string, p: any) {
    // 1. Deduplicación
    const existing = await this.findExistingProduct(tenantId, { 
      sku: p.skuCUIE || p.skuMPN, 
      name: p.name, 
      category: p.category 
    });

    if (existing && !existing.isMaster) {
      const mergedData = this.mergeProductData(existing, p);
      return await this.updateProduct(existing.id, mergedData);
    }

    // 2. Maestro Check / Create
    let masterId = existing?.isMaster ? existing.id : null;

    if (!masterId) {
      const normalizedBrand = normalizeBrand(p.brand) ?? p.brand;
      const generatedCUIM = this.generateCUIM(p.category?.substring(0, 3).toUpperCase());
      const slug = generateSlug(p.name, normalizedBrand, p.model);

      const { data: masterData, error: masterError } = await supabase
        .from('catalog_master')
        .insert([{
          sku_cuim: p.skuCUIM || generatedCUIM,
          code_serial: p.skuMPN || p.mpn,
          sku_gg: p.skuGG || p.category,
          sku_ge: p.skuGE || p.subCategory,
          product_name: p.name,
          description: p.observations || p.description,
          brand: normalizedBrand,
          model: p.model,
          unit_measure: p.unit,
          color: p.color,
          size: p.size,
          material: p.material,
          origin: p.origin,
          observations: p.observations,
          presentation: p.presentation,
          is_certified: p.isCertified === 'SI' || p.isCertified === true,
          source: 'suggested',
          source_tenant_id: tenantId,
          status: 'review',
          slug,
          image_url_1: p.imageUrl || (p.images && p.images[0]),
          image_url_2: p.images && p.images[1],
          image_url_3: p.images && p.images[2],
          datasheet_url_1: p.files && p.files[0],
          datasheet_url_2: p.files && p.files[1],
          datasheet_url_3: p.files && p.files[2]
        }])
        .select('id').single();

      if (masterError) throw masterError;
      masterId = masterData?.id;
    }

    // 3. Tenant Catalog Create
    const rucMatch = tenantId.match(/\d{11}/);
    const generatedCUIE = this.generateCUIE(rucMatch ? rucMatch[0] : '20602060650');

    const { data: tenantData, error: tenantError } = await supabase
      .from('tenant_catalog')
      .insert([{
        tenant_id: tenantId,
        master_product_id: masterId,
        sku_cuie: p.skuCUIE || generatedCUIE,
        custom_name: p.name,
        custom_description: p.observations || p.description,
        unit_price: parseFloat(p.price) || 0,
        currency: p.currency || 'USD',
        stock_available: (parseInt(p.stock) > 0) || p.stock_available === true,
        stock_quantity: parseInt(p.stock) || 0,
        dispatch_time: p.dispatch,
        location: p.location,
        imported_from_web: p.imported_from_web || false,
        import_source_url: p.import_source_url || null,
        is_active: true
      }])
      .select().single();

    if (tenantError) throw tenantError;
    return tenantData as Product;
  },

  async bulkCreateProducts(tenantId: string, products: any[]) {
    // 🛡️ Plan limits
    const { data: tenant } = await supabase.from('tenants').select('plan').eq('id', tenantId).single();
    const currentCount = await this.getTenantProductCount(tenantId);
    if ((tenant?.plan === 'free' || !tenant?.plan) && (currentCount + products.length) > 20) {
      throw new Error(`Límite excedido: Plan Free solo permite 20 productos.`);
    }

    const results = [];
    for (const p of products) {
      try {
        const res = await this.createProduct(tenantId, p);
        results.push(res);
      } catch (e) {
        console.error(`Error en bulk product:`, e);
      }
    }
    return results;
  },

  async getProductById(id: string) {
    const { data, error } = await supabase.from('tenant_catalog').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Product;
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    const cleanUpdates = { ...updates };
    if (typeof cleanUpdates.master_product_id === 'object') delete cleanUpdates.master_product_id;
    const { data, error } = await supabase.from('tenant_catalog').update(cleanUpdates).eq('id', id).select().single();
    if (error) throw error;
    return data as Product;
  },

  async updateMasterProduct(id: string, updates: any) {
    const dataToUpdate = { ...updates };
    if (dataToUpdate.brand) dataToUpdate.brand = normalizeBrand(dataToUpdate.brand) ?? dataToUpdate.brand;
    const { data, error } = await supabase.from('catalog_master').update(dataToUpdate).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async getSpecsTemplates() {
    const { data, error } = await supabase.from('specs_templates').select('category, template').order('category', { ascending: true });
    if (error) return [];
    return data;
  }
};
