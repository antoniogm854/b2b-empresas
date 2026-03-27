import { supabase } from './supabase';

export interface Product {
  id: string;
  tenant_id: string;
  master_product_id?: string;
  custom_name: string;
  custom_description?: string;
  unit_price?: number;
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
  metadata?: any;
  created_at?: string;
}

export interface CatalogMasterProduct {
  id: string;
  sku_cuim?: string;
  sku_mpn?: string;
  sku_gg?: string;
  sku_ge?: string;
  product_name: string;
  brand?: string;
  model?: string;
  image_url_1?: string;
  category_id?: string;
  description?: string;
  color?: string;
  size?: string;
  material?: string;
  origin?: string;
  presentation?: string;
  is_certified?: boolean;
}

export const catalogService = {
  // Generadores de códigos industriales
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

  // Obtener productos de un tenant específico
  async getTenantProducts(tenantId: string) {
    const { data, error } = await supabase
      .from('tenant_catalog')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Product[];
  },

  // Buscar en el Catálogo Maestro (catalog_master)
  async searchMaster(query: string) {
    let q = supabase
      .from('catalog_master')
      .select('*');
    
    if (query) {
      q = q.ilike('product_name', `%${query}%`);
    }

    const { data, error } = await q.limit(20);

    if (error) throw error;
    return data as any[];
  },

  // Vincular un producto del Maestro al catálogo del tenant
  async linkMasterProduct(tenantId: string, masterProduct: CatalogMasterProduct, customData?: any) {
    const { data, error } = await supabase
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

    if (error) throw error;
    return data as Product;
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
    // Limpiar objetos de relación antes de actualizar
    const cleanUpdates = { ...updates };
    if (typeof cleanUpdates.master_product_id === 'object') {
      delete cleanUpdates.master_product_id;
    }

    const { data, error } = await supabase
      .from('tenant_catalog')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  // Buscar si un producto ya existe (por SKU o por Categoría + Nombre)
  async findExistingProduct(tenantId: string, params: { sku?: string, name?: string, category?: string }) {
    // 1. Buscar por SKU si se proporciona
    if (params.sku) {
      const { data: bySKU } = await supabase
        .from('tenant_catalog')
        .select('*, master_product_id(*)')
        .eq('tenant_id', tenantId)
        .eq('sku_cuie', params.sku)
        .maybeSingle();
      
      if (bySKU) return bySKU;
    }

    // 2. Buscar por Categoría + Nombre (Semántico) en el Tenant
    if (params.name) {
      const { data: byName } = await supabase
        .from('tenant_catalog')
        .select('*, master_product_id(*)')
        .eq('tenant_id', tenantId)
        .ilike('custom_name', params.name)
        .maybeSingle();

      if (byName) {
        // Verificar si la categoría coincide (en metadata o sku_gg del master)
        const currentCategory = byName.metadata?.category || byName.master_product_id?.sku_gg;
        if (!params.category || currentCategory === params.category) {
          return byName;
        }
      }
    }

    // 3. Buscar en el Catálogo Maestro (Global)
    if (params.name) {
      const { data: byMaster } = await supabase
        .from('catalog_master')
        .select('*')
        .ilike('product_name', params.name)
        .eq('sku_gg', params.category) // Usamos sku_gg como Categoría Principal
        .maybeSingle();

      if (byMaster) return { isMaster: true, ...byMaster };
    }

    return null;
  },

  // Fusionar información de dos fuentes (prioridad a datos no vacíos)
  mergeProductData(existing: any, newData: any) {
    const merged = { ...existing };

    // Campos comerciales (tenant_catalog)
    if (!merged.custom_description && (newData.observations || newData.description)) {
      merged.custom_description = newData.observations || newData.description;
    }
    if (!merged.unit_price && newData.price) merged.unit_price = parseFloat(newData.price);
    if (newData.stock) merged.stock_quantity = (merged.stock_quantity || 0) + parseInt(newData.stock);
    if (newData.dispatch) merged.dispatch_time = newData.dispatch;
    if (newData.location) merged.location = newData.location;

    // Imágenes y documentos (unión sin duplicados)
    if (newData.images) {
      merged.images = Array.from(new Set([...(merged.images || []), ...newData.images]));
    }
    if (newData.files) {
      merged.documents = Array.from(new Set([...(merged.documents || []), ...newData.files]));
    }

    return merged;
  },

  // Crear o actualizar un producto (Sincronización Dual + Deduplicación)
  async createProduct(tenantId: string, p: any) {
    // 1. Verificar si ya existe en el tenant o maestro
    const existing = await this.findExistingProduct(tenantId, { 
      sku: p.skuCUIE || p.skuMPN, 
      name: p.name, 
      category: p.category 
    });

    if (existing && !existing.isMaster) {
      const mergedData = this.mergeProductData(existing, p);
      return await this.updateProduct(existing.id, mergedData);
    }

    // 2. Si existe en el maestro pero no en el tenant, vincularlo
    let masterId = existing?.isMaster ? existing.id : null;

    if (!masterId) {
      // Generar SKU-CUIM si no viene (Mantenemos coherencia con el pedido del usuario)
      const generatedCUIM = this.generateCUIM(p.category?.substring(0, 3).toUpperCase());

      // Crear en catalog_master (datos técnicos completos)
      const { data: masterData, error: masterError } = await supabase
        .from('catalog_master')
        .insert([
          {
            sku_cuim: p.skuCUIM || generatedCUIM,
            code_serial: p.skuMPN || p.mpn,
            sku_gg: p.skuGG || p.category,
            sku_ge: p.skuGE || p.subCategory,
            product_name: p.name,
            description: p.observations || p.description,
            brand: p.brand,
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
            image_url_1: p.imageUrl || (p.images && p.images[0]),
            image_url_2: p.images && p.images[1],
            image_url_3: p.images && p.images[2],
            datasheet_url_1: p.files && p.files[0],
            datasheet_url_2: p.files && p.files[1],
            datasheet_url_3: p.files && p.files[2]
          }
        ])
        .select('id')
        .single();

      if (masterError) throw masterError;
      masterId = masterData?.id;
    }

    // Generar CUIE-CUIM si no existe (Código único de empresa)
    // El usuario especificó CUIE-CUIM como el código único para reconocer usuario-proveedor
    const rucMatch = tenantId.match(/\d{11}/); // Intentar extraer RUC de ID si es posible o usar tenantId
    const generatedCUIE = this.generateCUIE(rucMatch ? rucMatch[0] : '20602060650');

    // 3. Insertar en tenant_catalog (datos comerciales + CUIE)
    const { data: tenantData, error: tenantError } = await supabase
      .from('tenant_catalog')
      .insert([
        {
          tenant_id: tenantId,
          master_product_id: masterId,
          sku_cuie: p.skuCUIE || generatedCUIE,
          custom_name: p.name,
          custom_description: p.observations || p.description,
          unit_price: parseFloat(p.price) || 0,
          currency: p.currency || 'USD',
          stock_available: (parseInt(p.stock) > 0) || p.stock_available === true,
          dispatch_time: p.dispatch,
          location: p.location,
          imported_from_web: p.imported_from_web || false,
          import_source_url: p.import_source_url || null,
          is_active: true
        }
      ])
      .select()
      .single();

    if (tenantError) throw tenantError;
    return tenantData as Product;
  },

  // Crear productos en masa con deduplicación
  async bulkCreateProducts(tenantId: string, products: any[]) {
    const results = [];
    for (const p of products) {
      const res = await this.createProduct(tenantId, p);
      results.push(res);
    }
    return results;
  }
};
