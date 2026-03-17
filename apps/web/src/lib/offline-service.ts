import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'b2b_industrial_offline';
const VERSION = 1;

export const offlineService = {
  db: null as IDBPDatabase | null,

  async init() {
    if (this.db) return this.db;
    
    this.db = await openDB(DB_NAME, VERSION, {
      upgrade(db) {
        // Almacén para leads
        if (!db.objectStoreNames.contains('leads')) {
          db.createObjectStore('leads', { keyPath: 'id' });
        }
        // Almacén para mensajes
        if (!db.objectStoreNames.contains('messages')) {
          db.createObjectStore('messages', { keyPath: 'id' });
        }
        // Almacén para configuración local
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
    return this.db;
  },

  /**
   * Guarda una lista de leads en la base de datos local.
   */
  async saveLeads(leads: any[]) {
    const db = await this.init();
    const tx = db.transaction('leads', 'readwrite');
    for (const lead of leads) {
      await tx.store.put(lead);
    }
    await tx.done;
  },

  /**
   * Recupera todos los leads guardados localmente.
   */
  async getLeads() {
    const db = await this.init();
    return db.getAll('leads');
  },

  /**
   * Guarda mensajes de chat localmente.
   */
  async saveMessages(messages: any[]) {
    const db = await this.init();
    const tx = db.transaction('messages', 'readwrite');
    for (const msg of messages) {
      await tx.store.put(msg);
    }
    await tx.done;
  },

  /**
   * Recupera mensajes de chat guardados localmente.
   */
  async getMessages() {
    const db = await this.init();
    return db.getAll('messages');
  }
};
