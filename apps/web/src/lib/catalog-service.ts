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
  product_name: string;
  brand?: string;
  model?: string;
  image_url_1?: string;
  sku_cuim?: string;
  category_id?: string;
  description?: string;
}

export const catalogService = {
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
    // 1. Preparar inserción en catalog_master
    const masterInserts = products.map((p) => ({
      product_name: p.name,
      description: p.description,
      brand: p.brand,
      model: p.model,
      unit_measure: p.unit,
      sku_cuim: p.skuCUIM,
      sku_gg: p.skuGG,
      sku_ge: p.skuGE,
      color: p.color,
      size: p.size,
      material: p.material,
      origin: p.origin,
      observations: p.observations,
      presentation: p.presentation,
      is_certified: p.isCertified,
      source: 'suggested',
      source_tenant_id: tenantId,
      status: 'review'
    }));

    const { data: masterData, error: masterError } = await supabase
      .from('catalog_master')
      .insert(masterInserts)
      .select('id, sku_cuim');

    if (masterError) throw masterError;

    // 2. Preparar inserción en tenant_catalog vinculando los IDs creados
    const tenantInserts = products.map((p) => {
      const masterProduct = masterData?.find(m => m.sku_cuim === p.skuCUIM);
      return {
        tenant_id: tenantId,
        master_product_id: masterProduct?.id,
        sku_cuie: p.skuCUIE,
        custom_name: p.name,
        custom_description: p.description,
        unit_price: parseFloat(p.price) || 0,
        stock_available: parseInt(p.stock) > 0,
        stock_quantity: parseInt(p.stock) || 0,
        brand: p.brand,
        model: p.model,
        origin: p.origin,
        is_most_requested: !!p.isMostRequested,
        images: p.images || [],
        documents: p.files || [],
        dispatch_time: p.dispatch,
        location: p.location,
        is_active: true,
        metadata: {
          color: p.color,
          size: p.size,
          material: p.material,
          presentation: p.presentation,
          observations: p.observations,
          is_certified: p.isCertified,
          sku_mpn: p.skuMPN,
          sku_gg: p.skuGG,
          sku_ge: p.skuGE,
          category: p.category,
          unit: p.unit
        }
      };
    });

    const { data: tenantData, error: tenantError } = await supabase
      .from('tenant_catalog')
      .insert(tenantInserts)
      .select();

    if (tenantError) throw tenantError;
    return tenantData;
  }
};
