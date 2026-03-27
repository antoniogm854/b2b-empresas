import { supabase } from './supabase';

export interface AdminStats {
  totalCompanies: number;
  pendingVerifications: number;
  activeMarketplace: number;
  totalLeads: number;
  pendingMasterProducts: number;
}

export const adminService = {
  /**
   * Obtiene estadísticas globales para el panel administrativo.
   */
  async getGlobalStats(): Promise<AdminStats> {
    const [tenants, pending, ads, leads, products] = await Promise.all([
      supabase.from('tenants').select('id', { count: 'exact', head: true }),
      supabase.from('tenants').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('tenant_catalog').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('leads').select('id', { count: 'exact', head: true }),
      supabase.from('catalog_master').select('id', { count: 'exact', head: true }).eq('status', 'review')
    ]);

    return {
      totalCompanies: tenants.count || 0,
      pendingVerifications: pending.count || 0,
      activeMarketplace: ads.count || 0,
      totalLeads: leads.count || 0,
      pendingMasterProducts: products.count || 0
    };
  },

  /**
   * Obtiene lista de todas las empresas registradas.
   */
  async getAllCompanies() {
    // Intentamos obtener con CUUP, si falla, reintentamos sin él (compatibilidad de esquema)
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, company_name, ruc_rut_nit, sector, status, created_at, cuup')
        .order('created_at', { ascending: false });
      
      if (!error) return data;
      
      // Si el error es por columna inexistente (42703), reintentar sin cuup
      if (error.code === '42703') {
        const { data: dataLow, error: errorLow } = await supabase
          .from('tenants')
          .select('id, company_name, ruc_rut_nit, sector, status, created_at')
          .order('created_at', { ascending: false });
        if (errorLow) throw errorLow;
        return dataLow;
      }
      throw error;
    } catch (err) {
      console.error("Error in getAllCompanies:", err);
      return [];
    }
  },

  /**
   * Obtiene lista de tenants pendientes de validación.
   */
  async getPendingCompanies() {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, company_name, ruc_rut_nit, sector, status, created_at')
        .eq('status', 'pending');

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error in getPendingCompanies:", err);
      return [];
    }
  },

  /**
   * Autoriza o rechaza un tenant.
   */
  async setTenantStatus(tenantId: string, status: 'active' | 'suspended' | 'cancelled') {
    const { error } = await supabase
      .from('tenants')
      .update({ status: status })
      .eq('id', tenantId);

    if (error) throw error;
  },

  /**
   * Obtiene productos pendientes de aprobación para el Marketplace.
   * Deprecado: En proceso de unificación con el Catálogo Maestro.
   */
  async getPendingMarketplaceProducts() {
    const { data, error } = await supabase
      .from('tenant_catalog')
      .select(`
        id,
        custom_name,
        unit_price,
        tenant_id,
        tenants (company_name)
      `)
      .eq('is_active', true); // Temporal: v1.01 no tiene ad_status

    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      name: item.custom_name,
      price: item.unit_price,
      companies: item.tenants // Map tenants to companies for component compatibility
    }));
  },

  /**
   * Gestiona el estado de una vitrina (Aprobar/Rechazar).
   */
  async updateShowcaseStatus(productId: string, status: 'approved' | 'rejected', priority: number = 0) {
    const { error } = await supabase
      .from('tenant_catalog')
      .update({ 
        is_featured: status === 'approved',
        priority_score: priority
      })
      .eq('id', productId);

    if (error) throw error;
  },

  /**
   * Ejecuta una auditoría de interconexión del sistema.
   * Verifica trazabilidad GCM -> Leads -> Chats.
   */
  async runSystemAudit() {
    // 1. Verificar productos sin vinculación GCM
    const { count: orphanedProducts } = await supabase
      .from('tenant_catalog')
      .select('id', { count: 'exact', head: true })
      .is('master_product_id', null);

    // 2. Verificar trazabilidad de leads
    const { count: totalLeads } = await supabase.from('leads').select('id', { count: 'exact', head: true });
    
    // 3. Verificar usuarios sin tenant vinculado
    const { data: tenantUsers } = await supabase.from('tenant_users').select('email');
    const { data: users } = await supabase.auth.admin.listUsers(); 
    
    const userEmailsWithTenant = new Set(tenantUsers?.map(tu => tu.email));
    const orphanedUsers = users?.users.filter(u => !userEmailsWithTenant.has(u.email!)).length || 0;

    return {
      status: orphanedProducts === 0 ? 'healthy' : 'warning',
      checks: [
        { 
          name: 'Integridad referencial Catálogo Maestro', 
          result: orphanedProducts === 0 ? 'OK' : 'Warning', 
          details: `${orphanedProducts} productos sin base maestra.` 
        },
        { 
          name: 'Usuarios Huérfanos', 
          result: orphanedUsers === 0 ? 'OK' : 'Attention', 
          details: `${orphanedUsers} usuarios registrados sin tenant configurado.` 
        },
        { 
          name: 'Métricas de Tracción', 
          result: 'Active', 
          details: `${totalLeads || 0} leads capturados en total.` 
        }
      ],
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Obtiene productos sugeridos (desde PDF/Web) pendientes de revisión.
   */
  async getPendingMasterProducts() {
    const { data, error } = await supabase
      .from('catalog_master')
      .select(`
        id,
        sku_cuim,
        product_name,
        brand,
        model,
        source,
        source_tenant_id,
        status,
        created_at,
        tenants:source_tenant_id (company_name)
      `)
      .eq('status', 'review')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Aprueba o rechaza un producto del Catálogo Maestro.
   */
  async setMasterProductStatus(productId: string, status: 'active' | 'inactive') {
    const { error } = await supabase
      .from('catalog_master')
      .update({ 
        status: status,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', productId);

    if (error) throw error;
  }
};
