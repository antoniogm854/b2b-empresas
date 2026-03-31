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
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, company_name, ruc_rut_nit, sector, status, created_at, cuup')
        .order('created_at', { ascending: false });
      
      if (!error) return data;
      
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
      .eq('is_active', true);

    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      name: item.custom_name,
      price: item.unit_price,
      companies: item.tenants 
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
   */
  async runSystemAudit() {
    const { count: orphanedProducts } = await supabase
      .from('tenant_catalog')
      .select('id', { count: 'exact', head: true })
      .is('master_product_id', null);

    const { count: totalLeads } = await supabase.from('leads').select('id', { count: 'exact', head: true });
    
    // Check for orphaned users (auth but no tenant_user)
    // Note: listUsers is an admin method, might require service role if used in client (but this is lib)
    let orphanedUsers = 0;
    try {
      const { data: tenantUsers } = await supabase.from('tenant_users').select('email');
      const userEmailsWithTenant = new Set(tenantUsers?.map(tu => tu.email));
      // In server-side admin service:
      // const { data: users } = await supabase.auth.admin.listUsers(); 
      // orphanedUsers = users?.users.filter(u => !userEmailsWithTenant.has(u.email!)).length || 0;
    } catch (e) {}

    return {
      status: orphanedProducts === 0 ? 'healthy' : 'warning',
      checks: [
        { 
          name: 'Integridad referencial Catálogo Maestro', 
          result: orphanedProducts === 0 ? 'OK' : 'Warning', 
          details: `${orphanedProducts} productos sin base maestra.` 
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
   * AUTO-APROBACIÓN VITRINA B2B (Option B)
   */
  async submitToShowcase(productId: string): Promise<{
    result: 'approved' | 'rejected' | 'pending_review';
    reason: string;
    failedCriteria?: string[];
  }> {
    const { data: product, error: productError } = await supabase
      .from('tenant_catalog')
      .select(`
        id,
        custom_description,
        tenant_id,
        catalog_master (
          image_url_1,
          brand,
          model,
          sku_gg,
          description
        ),
        tenants (
          plan,
          status
        )
      `)
      .eq('id', productId)
      .single();

    if (productError || !product) {
      throw new Error('Producto no encontrado');
    }

    const tenant = product.tenants as any;
    const master = product.catalog_master as any;

    if (!tenant || tenant.plan === 'free') {
      await supabase
        .from('tenant_catalog')
        .update({ ad_status: 'rejected', is_featured: false })
        .eq('id', productId);

      return {
        result: 'rejected',
        reason: 'PLAN_FREE: Las empresas en Plan Freemium no pueden tener Productos Destacados. Actualice al Plan PRO.',
      };
    }

    const description = product.custom_description || master?.description || '';
    const failedCriteria: string[] = [];

    if (tenant.status !== 'active') failedCriteria.push('RUC no verificado');
    if (!master?.image_url_1) failedCriteria.push('Sin imagen real');
    if (!description || description.trim().length < 20) failedCriteria.push('Descripción insuficiente (<20 caracteres)');
    if (!master?.brand) failedCriteria.push('Sin marca');
    if (!master?.model) failedCriteria.push('Sin modelo/serie');
    if (!master?.sku_gg) failedCriteria.push('Sin categoría');

    if (failedCriteria.length === 0) {
      await supabase
        .from('tenant_catalog')
        .update({
          ad_status: 'approved',
          is_featured: true,
          priority_score: 10,
        })
        .eq('id', productId);

      return {
        result: 'approved',
        reason: 'AUTO-APROBADO: El producto cumple todos los criterios.',
      };
    } else {
      await supabase
        .from('tenant_catalog')
        .update({ ad_status: 'pending', is_featured: false })
        .eq('id', productId);

      return {
        result: 'pending_review',
        reason: 'REVISIÓN MANUAL: No cumple todos los criterios.',
        failedCriteria,
      };
    }
  },

  /**
   * Obtiene productos sugeridos del Catálogo Maestro.
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
