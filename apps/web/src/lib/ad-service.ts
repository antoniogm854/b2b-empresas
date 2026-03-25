import { supabase } from './supabase';

export interface FeaturedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  tenant_id: string;
  tenant_name: string;
}

export const adService = {
  /**
   * Obtiene los productos destacados.
   * Se adapta al esquema v1.01 (tenant_catalog + catalog_master).
   */
  async getFeaturedProducts(limit: number = 6): Promise<FeaturedProduct[]> {
    // Nota: El esquema v1.01 simplificado no tiene is_featured o ad_status en tenant_catalog.
    // Usaremos is_active por ahora y limitaremos los resultados.
    const { data, error } = await supabase
      .from('tenant_catalog')
      .select(`
        id, 
        custom_name, 
        custom_description, 
        unit_price, 
        tenant_id,
        catalog_master (image_url_1),
        tenants!tenant_id (company_name)
      `)
      .eq('is_active', true)
      .limit(limit);

    if (error) {
      console.error("Supabase error in getFeaturedProducts:", error);
      throw error;
    }
    
    // Mapear los datos de la base de datos a la interfaz que espera el componente
    return (data as any[] || []).map(item => ({
      id: item.id,
      name: item.custom_name || 'Producto sin nombre',
      description: item.custom_description || '',
      price: item.unit_price || 0,
      image_url: item.catalog_master?.image_url_1 || '/hero.webp',
      tenant_id: item.tenant_id,
      tenant_name: item.tenants?.company_name || 'Proveedor'
    }));
  },

  /**
   * Obtiene proveedores cercanos basados en la ubicación.
   * En producción esto usaría PostGIS o un servicio de búsqueda geográfica.
   */
  async getNearbySuppliers(productId: string, location: string = "Lima, Peru") {
    // Simulado para la versión 2.0
    // En una implementación real, filtraríamos por zona geográfica.
    return [
      { id: 'near-1', name: 'Distribuidora Industrial Norte', distance: '2.4 km' },
      { id: 'near-2', name: 'Suministros Metalúrgicos S.A.', distance: '5.1 km' },
    ];
  },
};
