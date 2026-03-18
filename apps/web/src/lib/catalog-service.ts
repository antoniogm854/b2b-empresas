import { supabase } from './supabase';

export interface Product {
  id: string;
  company_id: string;
  gcm_id?: string;
  name: string;
  description?: string;
  price?: number;
  stock_status: string;
  image_url?: string;
  category?: string;
  is_active: boolean;
  ad_status: 'none' | 'pending' | 'approved' | 'rejected';
  country_code?: string;
}

export interface GCMProduct {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  category?: string;
  base_image_url?: string;
  technical_specs?: any;
}

export const catalogService = {
  // Obtener productos de una empresa específica
  async getCompanyProducts(companyId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Product[];
  },

  // Buscar en el Catálogo Maestro Global (GCM)
  async searchGCM(query: string) {
    let q = supabase
      .from('global_catalog_master')
      .select('*');
    
    if (query) {
      q = q.ilike('name', `%${query}%`);
    }

    const { data, error } = await q.limit(20);

    if (error) throw error;
    return data as GCMProduct[];
  },

  // Vincular un producto del GCM al catálogo de la empresa
  async linkGCMProduct(companyId: string, gcmProduct: GCMProduct) {
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          company_id: companyId,
          gcm_id: gcmProduct.id,
          name: gcmProduct.name,
          description: `Producto vinculado desde GCM. Marca: ${gcmProduct.brand || 'N/A'}`,
          category: gcmProduct.category,
          image_url: gcmProduct.base_image_url,
          stock_status: 'available',
          is_active: true,
          ad_status: 'none'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  }
};
