import { supabase } from './supabase';

export type AnalyticsEventType = 'view' | 'click_quote' | 'chat_start';

export const analyticsService = {
  /**
   * Registra una visita al catálogo.
   */
  async trackCatalogView(tenantId: string, metadata: any = {}) {
    try {
      // Intentar obtener data básica del cliente
      const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'Server';
      
      const { error } = await supabase
        .from('catalog_views')
        .insert([{
          tenant_id: tenantId,
          viewer_device: userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
          viewer_browser: userAgent,
          metadata: metadata // Usamos el campo jsonb para datos extra si es necesario
        }]);

      if (error) {
        // Log as warning to avoid blocking developer overlays in Next.js
        console.warn('Analytics (Catalog View) non-critical failure:', error.message || error);
      }
    } catch (error: any) {
      console.warn('Analytics tracking caught non-critical error:', error?.message || error);
    }
  },

  async getCompanyMetrics(companyId: string) {
    let viewsCount = 0;
    let leadCount = 0;

    try {
      // 1. Obtener vistas totales desde catalog_views
      const { count, error: viewsError } = await supabase
        .from('catalog_views')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', companyId);

      if (viewsError) console.warn("Analytics Views Table missing or error:", viewsError.message);
      else viewsCount = count || 0;

      // 2. Obtener leads reales desde buyer_contacts
      const { count: lCount, error: leadError } = await supabase
        .from('buyer_contacts')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', companyId);

      if (leadError) console.warn("Leads Table missing or error:", leadError.message);
      else leadCount = lCount || 0;
    } catch (err) {
      console.warn("Métricas no disponibles temporalmente:", err);
    }

    // 3. Obtener productos más vistos (simulado por ahora hasta tener tracking por producto)
    // En el futuro leeríamos de una tabla intermedia o meteríamos el ID en metadata de catalog_views
    const topProducts = [
      { id: '1', name: 'Válvula de Control NX', views: Math.floor((viewsCount || 0) * 0.45) },
      { id: '2', name: 'Motor Trifásico 5HP', views: Math.floor((viewsCount || 0) * 0.3) },
      { id: '3', name: 'Empaquetadura Kevlar', views: Math.floor((viewsCount || 0) * 0.15) },
    ];

    return {
      views: viewsCount || 0,
      realLeads: leadCount || 0,
      chats: Math.floor((viewsCount || 0) * 0.12), // Estimado basado en ratio industrial
      topProducts,
      conversionRate: viewsCount ? ((leadCount || 0) / viewsCount) * 100 : 0
    };
  }
};
