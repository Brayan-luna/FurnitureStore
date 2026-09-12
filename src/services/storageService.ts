import { initialProducts, initialCategories } from '../config/initialProducts';
import { initialBusinessConfig } from '../config/initialBusiness';
import { Product, Category, BusinessConfig } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'furniture_store_products_v1',
  CATEGORIES: 'furniture_store_categories_v1',
  BUSINESS: 'furniture_store_business_v1',
  AUTH: 'furniture_store_admin_session_v1',
};

export const storageService = {
  // --- PRODUCTOS ---
  getProducts: (): Product[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        return JSON.parse(stored) as Product[];
      }
    } catch (e) {
      console.error('Error reading products from storage', e);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    return initialProducts;
  },

  saveProducts: (products: Product[]): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      return true;
    } catch (e) {
      console.error('Error saving products to storage', e);
      return false;
    }
  },

  // --- CATEGORÍAS ---
  getCategories: (): Category[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        return JSON.parse(stored) as Category[];
      }
    } catch (e) {
      console.error('Error reading categories from storage', e);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
    return initialCategories;
  },

  saveCategories: (categories: Category[]): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      return true;
    } catch (e) {
      console.error('Error saving categories to storage', e);
      return false;
    }
  },

  // --- CONFIGURACIÓN DE EMPRESA (WHITE-LABEL) ---
  getBusinessConfig: (): BusinessConfig => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BUSINESS);
      if (stored) {
        return JSON.parse(stored) as BusinessConfig;
      }
    } catch (e) {
      console.error('Error reading business config', e);
    }
    localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(initialBusinessConfig));
    return initialBusinessConfig;
  },

  saveBusinessConfig: (config: BusinessConfig): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(config));
      return true;
    } catch (e) {
      console.error('Error saving business config', e);
      return false;
    }
  },

  // --- SESIÓN DE ADMINISTRADOR ---
  getAuthSession: (): { username: string } | null => {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.AUTH);
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  },

  setAuthSession: (user: { username: string }): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    } catch (e) {
      console.error('Error storing auth session', e);
    }
  },

  clearAuthSession: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch (e) {
      console.error('Error clearing auth session', e);
    }
  },

  // --- RESTABLECER VALORES DE FÁBRICA ---
  resetToDefaults: (): void => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
    localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(initialBusinessConfig));
  }
};
