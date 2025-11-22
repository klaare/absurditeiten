import type { Tongbreker } from '../types';

const STORAGE_KEYS = {
  TONGBREKERS: 'tering_tongbrekers_history',
  API_KEY: 'gemini_api_key',
  MAX_ITEMS: 50,
} as const;

export const storage = {
  // Tongbrekers
  getTongbrekers: (): Tongbreker[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TONGBREKERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading tongbrekers:', error);
      return [];
    }
  },

  saveTongbreker: (tongbreker: Tongbreker): boolean => {
    try {
      const history = storage.getTongbrekers();
      history.unshift(tongbreker);
      const trimmed = history.slice(0, STORAGE_KEYS.MAX_ITEMS);
      localStorage.setItem(STORAGE_KEYS.TONGBREKERS, JSON.stringify(trimmed));
      return true;
    } catch (error) {
      console.error('Error saving tongbreker:', error);
      return false;
    }
  },

  deleteTongbreker: (id: string): boolean => {
    try {
      const history = storage.getTongbrekers();
      const filtered = history.filter((t) => t.id !== id);
      localStorage.setItem(STORAGE_KEYS.TONGBREKERS, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting tongbreker:', error);
      return false;
    }
  },

  // API Key
  getApiKey: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.API_KEY);
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  },

  saveApiKey: (apiKey: string): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
      return true;
    } catch (error) {
      console.error('Error saving API key:', error);
      return false;
    }
  },

  hasApiKey: (): boolean => {
    const key = storage.getApiKey();
    return key !== null && key.trim().length > 0;
  },
};

export const generateId = (): string => {
  return crypto.randomUUID();
};
