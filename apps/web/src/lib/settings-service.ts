import { supabase } from './supabase';

export interface SiteSettings {
  id?: string;
  company_name: string;
  support_phone: string;
  support_email: string;
  address: string;
  about_us: string;
  whatsapp_message: string;
  social_linkedin?: string;
  social_facebook?: string;
  social_instagram?: string;
  updated_at?: string;
}

export const settingsService = {
  /**
   * Obtiene la configuración global del sitio.
   * Si no existe, devuelve valores por defecto.
   */
  async getSettings(): Promise<SiteSettings> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
      console.error('Error fetching settings:', error);
    }

    const defaultSettings: SiteSettings = {
      company_name: 'B2B Empresas',
      support_phone: '+51 924 159 535',
      support_email: 'contacto@b2bempresas.com',
      address: 'Lima, Perú - Sector Industrial',
      about_us: 'Somos la plataforma líder en infraestructura digital B2B para el sector industrial en Latinoamérica.',
      whatsapp_message: 'Hola, solicito asistencia corporativa en b2bempresas.com',
    };

    return data || defaultSettings;
  },

  /**
   * Actualiza la configuración global del sitio.
   */
  async updateSettings(settings: Partial<SiteSettings>): Promise<void> {
    const current = await this.getSettings();
    
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        ...current,
        ...settings,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  /**
   * Utilidad para limpiar el número de teléfono para enlaces de WhatsApp.
   */
  sanitizePhone(phone: string): string {
    return phone.replace(/\D/g, ''); // Elimina todo lo que no sea dígito
  }
};
