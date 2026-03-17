import { supabase } from './supabase';

export interface FeaturedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  company_id: string;
  ad_status: 'none' | 'pending' | 'approved' | 'rejected';
  companies: {
    name: string;
    is_verified: boolean;
  };
}

export const adService = {
  /**
   * Obtiene los productos destacados aprobados y activos.
   */
  async getFeaturedProducts(limit: number = 6): Promise<FeaturedProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, name, description, price, image_url, category, company_id, ad_status,
        companies (name, is_verified)
      `)
      .eq('is_featured', true)
      .eq('ad_status', 'approved')
      .gt('ad_expires_at', new Date().toISOString())
      .order('priority_score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data as any) || [];
  },

  /**
   * Solicita la promoción de un producto (Queda pendiente de aprobación).
   */
  async requestPromotion(productId: string, days: number = 7) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);

    const { data, error } = await supabase
      .from('products')
      .update({
        is_featured: true,
        ad_expires_at: expirationDate.toISOString(),
        ad_status: 'pending',
        priority_score: 1.0
      })
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Aprueba o rechaza una promoción (Solo para Administradores).
   */
  async updateAdStatus(productId: string, status: 'approved' | 'rejected') {
    const { data, error } = await supabase
      .from('products')
      .update({ ad_status: status })
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
