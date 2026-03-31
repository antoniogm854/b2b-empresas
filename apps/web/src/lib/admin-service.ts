import { supabase } from './supabase';

export interface AdminStats {
  totalCompanies: number;
  pendingVerifications: number;
  activeShowcase: number;
  totalMarketplaceLeads: number;
}

export const adminService = {
  /**
   * Obtiene estadísticas globales para el panel administrativo.
   */
  async getGlobalStats(): Promise<AdminStats> {
    const [tenants, pending, ads, leads] = await Promise.all([
      supabase.from('tenants').select('id', { count: 'exact', head: true }),
      supabase.from('tenants').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('tenant_catalog').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('leads').select('id', { count: 'exact', head: true })
    ]);

    return {
      totalCompanies: tenants.count || 0,
      pendingVerifications: pending.count || 0,
      activeShowcase: ads.count || 0,
      totalMarketplaceLeads: leads.count || 0
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
   * Obtiene productos con vitrina pendiente de aprobación.
   */
  async getPendingShowcase() {
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
        ad_status: status,
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
      .is('master_id', null);

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
   * ══════════════════════════════════════════════════════
   * AUTO-APROBACIÓN VITRINA B2B — Opción B
   * ══════════════════════════════════════════════════════
   * Reglas de negocio:
   *  1. Solo Plan PRO o Enterprise pueden tener productos destacados.
   *  2. Si el plan es FREE → rechazado automáticamente.
   *  3. Si es PRO/Enterprise, se validan 6 criterios mínimos:
   *     - RUC verificado (tenant.status = 'active')
   *     - Imagen del producto (image_url_1 != null)
   *     - Descripción >= 20 caracteres
   *     - Marca del producto (brand != null)
   *     - Modelo/Serie (model != null)
   *     - Categoría asignada (sku_gg != null)
   *  4. Si cumple todos → aprobado automáticamente.
   *  5. Si falla alguno → va a cola de revisión manual.
   */
  async submitToShowcase(productId: string): Promise<{
    result: 'approved' | 'rejected' | 'pending_review';
    reason: string;
    failedCriteria?: string[];
  }> {
    // 1. Obtener datos completos del producto + tenant
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

    // 2. Verificar Plan — FREEMIUM rechazado inmediatamente
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

    // 3. Evaluar los 6 criterios mínimos (Plan PRO/Enterprise)
    const description = product.custom_description || master?.description || '';
    const failedCriteria: string[] = [];

    // Criterio 1: RUC verificado
    if (tenant.status !== 'active') {
      failedCriteria.push('RUC no verificado: el estado de la empresa debe ser "active"');
    }

    // Criterio 2: Imagen del producto
    if (!master?.image_url_1) {
      failedCriteria.push('Sin imagen: el producto debe tener al menos una fotografía real');
    }

    // Criterio 3: Descripción mínima (20 caracteres)
    if (!description || description.trim().length < 20) {
      failedCriteria.push(`Descripción insuficiente: se requieren mínimo 20 caracteres (actual: ${description.trim().length})`);
    }

    // Criterio 4: Marca del producto
    if (!master?.brand) {
      failedCriteria.push('Sin marca: el producto debe tener una marca registrada en el Catálogo Maestro');
    }

    // Criterio 5: Modelo/Serie
    if (!master?.model) {
      failedCriteria.push('Sin modelo/serie: el producto debe tener un modelo o número de serie');
    }

    // Criterio 6: Categoría asignada
    if (!master?.sku_gg) {
      failedCriteria.push('Sin categoría: el producto debe tener una categoría asignada en el Catálogo Maestro');
    }

    // 4. Resultado
    if (failedCriteria.length === 0) {
      // ✅ TODOS LOS CRITERIOS CUMPLIDOS → AUTO-APROBADO
      await supabase
        .from('tenant_catalog')
        .update({
          ad_status: 'approved',
          is_featured: true,
          priority_score: 10,
        })
        .eq('id', productId);

      // Registrar en audit_log
      await supabase.from('audit_logs').insert({
        action: 'showcase_auto_approved',
        entity: 'tenant_catalog',
        entity_id: productId,
        details: { plan: tenant.plan, criteria: 'all_passed' },
      });

      return {
        result: 'approved',
        reason: 'AUTO-APROBADO: El producto cumple todos los criterios mínimos de la Vitrina B2B.',
      };
    } else {
      // ⚠️ CRITERIOS INCOMPLETOS → COLA DE REVISIÓN MANUAL
      await supabase
        .from('tenant_catalog')
        .update({
          ad_status: 'pending',
          is_featured: false,
        })
        .eq('id', productId);

      return {
        result: 'pending_review',
        reason: 'REVISIÓN MANUAL: El producto no cumple todos los criterios mínimos.',
        failedCriteria,
      };
    }
  },
};
