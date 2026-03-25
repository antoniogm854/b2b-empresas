import { supabase } from './supabase';
import { offlineService } from './offline-service';

export type LeadStatus = 'pending' | 'contacted' | 'completed' | 'cancelled';

export interface Lead {
  id: string;
  tenant_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
  buyer_company?: string;
  message: string;
  products_interested: string[];
  status: 'new' | 'read' | 'responded';
  created_at: string;
}

export const transactionalService = {
  /**
   * Obtiene todos los leads para un tenant específico.
   * Intenta sincronizar con caché local para soporte offline.
   */
  async getLeads(tenantId: string): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('buyer_contacts')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Guardar en persistencia local para uso offline
        await offlineService.saveLeads(data);
      }

      return data || [];
    } catch (error) {
      console.error("Network error fetching leads, trying offline cache:", error);
      // Fallback a caché local si falla la red
      const cachedLeads = await offlineService.getLeads();
      return cachedLeads.filter((l: any) => l.tenant_id === tenantId);
    }
  },

  /**
   * Actualiza el estado de una cotización/lead.
   */
  async updateLeadStatus(leadId: string, status: 'read' | 'responded') {
    const { error } = await supabase
      .from('buyer_contacts')
      .update({ status })
      .eq('id', leadId);

    if (error) throw error;
  },

  /**
   * Obtiene especificaciones técnicas de múltiples productos para comparación.
   */
  async compareProducts(productIds: string[]) {
    const { data, error } = await supabase
      .from('tenant_catalog')
      .select(`
        id,
        custom_name,
        unit_price,
        catalog_master (
          observations,
          brand,
          model
        )
      `)
      .in('id', productIds);

    if (error) throw error;
    return data;
  },

  /**
   * Registra un nuevo lead (RFQ).
   */
  async createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'status'>) {
    const { data, error } = await supabase
      .from('buyer_contacts')
      .insert([{
        ...leadData,
        status: 'new'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Obtiene todos los proveedores que ofrecen un producto específico del Catálogo Maestro.
   */
  async getSuppliersByProduct(masterId: string) {
    const { data, error } = await supabase
      .from('tenant_catalog')
      .select(`
        tenant_id,
        unit_price,
        tenants (
          id,
          company_name
        )
      `)
      .eq('master_product_id', masterId);

    if (error) throw error;
    return data;
  },

  /**
   * Crea solicitudes de cotización masivas a múltiples proveedores para un producto del Catálogo Maestro.
   */
  async createMultiSupplierRFQ(leadBaseData: any, masterId: string) {
    const suppliers = await this.getSuppliersByProduct(masterId);
    
    if (!suppliers || suppliers.length === 0) {
      throw new Error("No hay proveedores disponibles para este producto.");
    }

    const leadsToCreate = suppliers.map((s: any) => ({
      ...leadBaseData,
      tenant_id: s.tenant_id,
      status: 'pending',
      quote_items: [{ master_id: masterId, suggested_price: s.price }]
    }));

    const { data, error } = await supabase
      .from('leads')
      .insert(leadsToCreate)
      .select();

    if (error) throw error;
    return data;
  }
};
