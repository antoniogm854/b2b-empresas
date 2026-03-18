import { supabase } from './supabase';

export interface Company {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website?: string;
  phone_whatsapp?: string;
  industry?: string;
  is_verified: boolean;
  tax_id?: string;
  address?: string;
  email_corporate?: string;
  verification_data?: any;
  created_at: string;
}

export const companyService = {
  // Crear una nueva empresa (Registro de proveedor)
  async createCompany(companyData: Partial<Company>) {
    // Nota: owner_id debería venir de la sesión de Auth en una app real
    // Para esta fase, simulamos el owner_id si no se proporciona
    const { data, error } = await supabase
      .from('companies')
      .insert([
        {
          name: companyData.name,
          slug: companyData.slug,
          owner_id: companyData.owner_id || '00000000-0000-0000-0000-000000000000', // Placeholder UUID
          industry: companyData.industry || 'Industrial',
          is_verified: false,
          ...companyData
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Company;
  },

  // Obtener empresa por ID de propietario
  async getCompanyByOwner(ownerId: string) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('owner_id', ownerId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data as Company | null;
  },

  // Obtener empresa por Slug
  async getCompanyBySlug(slug: string) {
    const { data, error } = await supabase
      .from('companies')
      .select('*, company_designs(*)')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar metadatos de la empresa
  async updateCompany(id: string, updates: Partial<Company>) {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Company;
  }
};
