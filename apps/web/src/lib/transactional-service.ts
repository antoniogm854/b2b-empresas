import { supabase } from './supabase';
import { offlineService } from './offline-service';

export type LeadStatus = 'pending' | 'contacted' | 'completed' | 'cancelled';

export interface Lead {
  id: string;
  company_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  message: string;
  quote_items: any[];
  status: LeadStatus;
  created_at: string;
}

export const transactionalService = {
  /**
   * Obtiene todos los leads para una empresa específica.
   * Intenta sincronizar con caché local para soporte offline.
   */
  async getLeads(companyId: string): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', companyId)
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
      return cachedLeads.filter((l: any) => l.company_id === companyId);
    }
  },

  /**
   * Actualiza el estado de una cotización/lead.
   */
  async updateLeadStatus(leadId: string, status: LeadStatus) {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', leadId);

    if (error) throw error;
  },

  /**
   * Obtiene especificaciones técnicas de múltiples productos para comparación.
   */
  async compareProducts(productIds: string[]) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        global_catalog_master (
          technical_specs,
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
      .from('leads')
      .insert([{
        ...leadData,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Obtiene todos los proveedores que ofrecen un producto específico del Catálogo Maestro.
   */
  async getSuppliersByProduct(gcmId: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        company_id,
        price,
        companies (
          id,
          name,
          logo_url,
          rating
        )
      `)
      .eq('gcm_id', gcmId);

    if (error) throw error;
    return data;
  },

  /**
   * Crea solicitudes de cotización masivas a múltiples proveedores para un producto GCM.
   */
  async createMultiSupplierRFQ(leadBaseData: any, gcmId: string) {
    const suppliers = await this.getSuppliersByProduct(gcmId);
    
    if (!suppliers || suppliers.length === 0) {
      throw new Error("No hay proveedores disponibles para este producto.");
    }

    const leadsToCreate = suppliers.map((s: any) => ({
      ...leadBaseData,
      company_id: s.company_id,
      status: 'pending',
      quote_items: [{ gcm_id: gcmId, suggested_price: s.price }]
    }));

    const { data, error } = await supabase
      .from('leads')
      .insert(leadsToCreate)
      .select();

    if (error) throw error;
    return data;
  }
};
