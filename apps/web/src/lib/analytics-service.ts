import { supabase } from './supabase';

export type AnalyticsEventType = 'view' | 'click_quote' | 'chat_start';

export const analyticsService = {
  /**
   * Registra un evento de analíticas.
   */
  async trackEvent(type: AnalyticsEventType, companyId: string, resourceId?: string, metadata: any = {}) {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert([{
          event_type: type,
          company_id: companyId,
          resource_id: resourceId,
          metadata
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking analytics event:', error);
    }
  },

  /**
   * Obtiene métricas agregadas para una empresa con alta fidelidad.
   */
  async getCompanyMetrics(companyId: string) {
    // 1. Obtener eventos básicos
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('event_type, resource_id')
      .eq('company_id', companyId);

    if (error) throw error;

    // 2. Obtener leads reales (para fidelidad total en reportes)
    const { count: leadCount, error: leadError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    if (leadError) throw leadError;

    // 3. Procesar productos más vistos
    const productViews: Record<string, number> = {};
    events
      .filter(e => e.event_type === 'view' && e.resource_id)
      .forEach(e => {
        const id = e.resource_id as string;
        productViews[id] = (productViews[id] || 0) + 1;
      });

    // Ordenar y tomar top 5
    const topProductsRaw = Object.entries(productViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Mock names for now, but we could fetch them if resource_id is product ID
    const topProducts = topProductsRaw.map(([id, views]) => ({
      id,
      name: `Producto ${id.substring(0, 8)}...`, // En producción haríamos un join o fetch
      views
    }));

    return {
      views: events.filter(e => e.event_type === 'view').length,
      quotes: events.filter(e => e.event_type === 'click_quote').length,
      chats: events.filter(e => e.event_type === 'chat_start').length,
      realLeads: leadCount || 0,
      topProducts,
      recentActivity: events.slice(-10)
    };
  }
};
