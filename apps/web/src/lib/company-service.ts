import { supabase } from './supabase';

export interface Tenant {
  id: string;
  owner_id?: string; // v1.01 no usa owner_id directamente en tenants sino en tenant_users? 
  // Nota: v1_01_schema.sql no tiene owner_id en tenants. Tiene tenant_users vinculado.
  company_name: string;
  trade_name?: string;
  ruc_rut_nit?: string;
  sector?: string;
  country: string;
  city?: string;
  address?: string;
  fiscal_address?: string;
  activity_main?: string;
  activity_sec1?: string;
  activity_sec2?: string;
  fecha_inicio?: string;
  representantes?: any[];
  website?: string;
  email: string;
  phone: string;
  phone_commercial?: string;
  contact_name: string;
  status: 'pending' | 'active' | 'suspended' | 'cancelled';
  plan: 'free' | 'pro' | 'enterprise';
  compliance_score?: number;
  compliance_stars?: number;
  cuup?: string;
  description?: string;
  logo_url?: string;
  slug?: string;
  // Campos Industrial Premium v1.30
  estado_sunat?: string;
  condicion_sunat?: string;
  linkedin_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  allow_scraping?: boolean;
  catalog_settings?: any;
  sku_cuie?: string;
  created_at: string;
}

export const companyService = {
  // Crear un nuevo tenant (Registro de proveedor)
  async createTenant(tenantData: Partial<Tenant>) {
    const { data, error } = await supabase
      .from('tenants')
      .insert([
        {
          company_name: tenantData.company_name,
          ruc_rut_nit: tenantData.ruc_rut_nit,
          sector: tenantData.sector || 'Industrial',
          country: tenantData.country || 'Peru',
          email: tenantData.email,
          phone: tenantData.phone,
          contact_name: tenantData.contact_name,
          status: 'pending',
          ...tenantData
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Tenant;
  },

  // Obtener tenant por ID
  async getTenantById(id: string) {
    const { data, error } = await supabase
      .from('tenants')
      .select('*, tenant_themes(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Obtener tenant por Email del usuario (vía tenant_users)
  async getTenantByUserEmail(email: string) {
    const { data, error } = await supabase
      .from('tenant_users')
      .select('*, tenants(*, tenant_themes(*))')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    return data?.tenants as any || null;
  },

  // Obtener tenant por Slug
  async getTenantBySlug(slug: string) {
    // 1. Intentar búsqueda exacta por columna 'slug'
    const { data: exactData, error: exactError } = await supabase
      .from('tenants')
      .select('*, tenant_themes(*)')
      .eq('slug', slug)
      .maybeSingle();

    if (!exactError && exactData) return exactData;

    // 2. Fallback: Búsqueda aproximada en nombres (para compatibilidad v1.01)
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('tenants')
      .select('*, tenant_themes(*)') 
      .or(`company_name.ilike.%${slug}%,trade_name.ilike.%${slug}%`)
      .maybeSingle();

    if (fallbackError) throw fallbackError;
    return fallbackData;
  },

  // Actualizar metadatos del tenant
  // SEGURIDAD: Solo se permiten campos que existen físicamente en la tabla 'tenants' (v1.01)
  // NOTA: Si falla por falta de columnas, realizamos un segundo intento con solo campos básicos.
  async updateTenant(id: string, updates: Partial<Tenant>) {
    // 🛡️ Lista Blanca de campos reales en la DB (v1.01 estándar + v1.30 Industrial Premium)
    const dbFieldsV101 = [
      'company_name', 'trade_name', 'ruc_rut_nit', 'sector', 
      'country', 'city', 'address', 'website', 'email', 
      'phone', 'phone_commercial', 'contact_name', 'plan', 'status',
      'catalog_settings', 'slug', 'description', 'logo_url', 'sku_cuie'
    ];

    try {
      // Intento 1: Todo el objeto (Asumiendo que el usuario ya corrió la migración v1.30)
      const { data, error } = await supabase
        .from('tenants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        // Si el error es por columnas faltantes, vamos al catch para el Intento 2
        if (error.message.includes('column') || error.code === '42703') {
          throw error; 
        }
        throw error;
      }
      return data as Tenant;

    } catch (err: any) {
      console.warn('[DB_SYNC] Error en actualización completa. Reintentando con campos básicos v1.01...', err.message);
      
      const basicUpdates: any = {};
      Object.keys(updates).forEach(key => {
        if (dbFieldsV101.includes(key)) {
          basicUpdates[key] = (updates as any)[key];
        }
      });

      const { data, error } = await supabase
        .from('tenants')
        .update(basicUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Lanzamos una advertencia controlada para que la UI sepa que fue parcial
      (data as any)._partial_sync = true;
      return data as Tenant;
    }
  },

  // Obtener lista de todos los tenants (v6.0)
  async getTenants() {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('company_name', { ascending: true });

    if (error) throw error;
    return data as Tenant[];
  }
};
