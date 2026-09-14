import { initialProducts, initialCategories } from '../config/initialProducts';
import { initialBusinessConfig } from '../config/initialBusiness';
import { initialAddons } from '../config/initialAddons';
import { initialCustomizerConfig } from '../config/initialCustomizer';
import { Product, Category, BusinessConfig, AddonItem, CustomizerConfig } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'furniture_store_products_v1',
  CATEGORIES: 'furniture_store_categories_v1',
  ADDONS: 'furniture_store_addons_v1',
  BUSINESS: 'furniture_store_business_v1',
  AUTH: 'furniture_store_admin_session_v1',
  CUSTOMIZER: 'furniture_store_customizer_v1',
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
        const parsed = JSON.parse(stored) as BusinessConfig;
        if (parsed.whatsappNumber === '573214028890' || parsed.whatsappNumber === 'https://wa.me/message/MGA7KPPOQIPVK1') {
          parsed.whatsappNumber = initialBusinessConfig.whatsappNumber;
        }
        if (parsed.displayPhone === '321 402 8890') {
          parsed.displayPhone = initialBusinessConfig.displayPhone;
        }
        if (!parsed.whatsappLink) {
          parsed.whatsappLink = initialBusinessConfig.whatsappLink;
        }
        return {
          ...initialBusinessConfig,
          ...parsed,
          logoUrl: parsed.logoUrl || initialBusinessConfig.logoUrl || '/logo.png',
        };
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

  // --- ADICIONALES ---
  getAddons: (): AddonItem[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADDONS);
      if (stored) {
        return JSON.parse(stored) as AddonItem[];
      }
    } catch (e) {
      console.error('Error reading addons from storage', e);
    }
    localStorage.setItem(STORAGE_KEYS.ADDONS, JSON.stringify(initialAddons));
    return initialAddons;
  },

  saveAddons: (addons: AddonItem[]): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADDONS, JSON.stringify(addons));
      return true;
    } catch (e) {
      console.error('Error saving addons to storage', e);
      return false;
    }
  },

  // --- PERSONALIZADOR ÁRMALA COMO QUIERAS ---
  getCustomizerConfig: (): CustomizerConfig => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMIZER);
      if (stored) {
        const parsed = JSON.parse(stored) as CustomizerConfig;
        return {
          ...initialCustomizerConfig,
          ...parsed,
          quality: {
            ...initialCustomizerConfig.quality,
            ...(parsed.quality || {})
          }
        };
      }
    } catch (e) {
      console.error('Error reading customizer config from storage', e);
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOMIZER, JSON.stringify(initialCustomizerConfig));
    return initialCustomizerConfig;
  },

  saveCustomizerConfig: (config: CustomizerConfig): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMIZER, JSON.stringify(config));
      return true;
    } catch (e) {
      console.error('Error saving customizer config to storage', e);
      return false;
    }
  },

  // --- AUTENTICACIÓN ADMIN ---
  getAuthSession: (): { username: string } | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading auth session', e);
    }
    return null;
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
    localStorage.setItem(STORAGE_KEYS.ADDONS, JSON.stringify(initialAddons));
    localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(initialBusinessConfig));
    localStorage.setItem(STORAGE_KEYS.CUSTOMIZER, JSON.stringify(initialCustomizerConfig));
  }
};

