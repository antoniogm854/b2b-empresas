import { supabase } from './supabase';

const VAPID_PUBLIC_KEY = "BPA5o5R...PLACEHOLDER_VAPID_PUBLIC_KEY...3Jg"; // Debería venir de una variable de entorno

export const notificationsService = {
  /**
   * Verifica si el navegador soporta notificaciones push.
   */
  isSupported() {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
  },

  /**
   * Solicita permiso para mostrar notificaciones.
   */
  async requestPermission() {
    if (!this.isSupported()) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  /**
   * Suscribe al usuario actual a las notificaciones push.
   */
  async subscribeUser(profileId: string) {
    if (!this.isSupported()) throw new Error("Push no soportado");

    const registration = await navigator.serviceWorker.ready;
    
    // Verificar si ya existe una suscripción
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }

    const { endpoint, keys } = subscription.toJSON();
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      throw new Error("Datos de suscripción incompletos");
    }

    // Guardar en Supabase
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert([
        {
          profile_id: profileId,
          endpoint: endpoint,
          p256dh: keys.p256dh,
          auth: keys.auth
        }
      ], { onConflict: 'endpoint' });

    if (error) throw error;
    return true;
  },

  /**
   * Cancela la suscripción del usuario.
   */
  async unsubscribeUser(profileId: string) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      
      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('profile_id', profileId)
        .eq('endpoint', subscription.endpoint);

      if (error) throw error;
    }
  },

  /**
   * Utilidad para convertir la clave VAPID pública.
   */
  urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
};
