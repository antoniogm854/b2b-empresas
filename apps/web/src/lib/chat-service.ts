import { supabase } from './supabase';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  company_id: string;
  buyer_id: string;
  last_message: string;
  updated_at: string;
  company?: { name: string; logo_url: string };
  buyer?: { full_name: string };
}

export const chatService = {
  // Obtener todas las conversaciones del usuario actual
  async getConversations() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        company:companies(name, logo_url),
        buyer:profiles(full_name)
      `)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data as Conversation[];
  },

  /**
   * Obtiene mensajes de una conversación.
   * Con soporte offline vía IndexedDB.
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        await offlineService.saveMessages(data);
      }

      return data || [];
    } catch (error) {
      console.error("Network error fetching messages, using offline cache:", error);
      const cachedMessages = await offlineService.getMessages();
      return cachedMessages.filter((m: any) => m.conversation_id === conversationId);
    }
  },

  // Enviar un mensaje
  async sendMessage(conversationId: string, text: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        text
      })
      .select()
      .single();

    if (error) throw error;

    // Actualizar el last_message de la conversación
    await supabase
      .from('conversations')
      .update({ last_message: text, updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return data as ChatMessage;
  },

  // Suscribirse a mensajes en tiempo real
  subscribeToMessages(conversationId: string, onNewMessage: (payload: any) => void) {
    return supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        onNewMessage
      )
      .subscribe();
  }
};
