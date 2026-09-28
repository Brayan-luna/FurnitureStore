import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Product, Category, AddonItem, CustomizerConfig, BusinessConfig } from '../types';

export const supabaseDbService = {
  // --- TEST DE CONEXIÓN ---
  async testConnection(): Promise<{ connected: boolean; message: string }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { connected: false, message: 'Faltan credenciales VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el build' };
    }
    try {
      const { error } = await supabase.from('store_categories').select('id').limit(1);
      if (error) {
        return { connected: false, message: `Error Supabase: ${error.message}` };
      }
      return { connected: true, message: 'Conexión a Supabase exitosa' };
    } catch (e: any) {
      return { connected: false, message: `Excepción de red: ${e?.message || 'Desconocida'}` };
    }
  },

  // --- PRODUCTOS ---
  async getProducts(): Promise<Product[] | null> {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('store_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error fetching products from Supabase:', error.message);
        return null;
      }

      if (!data || data.length === 0) return [];

      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        categoryId: row.category_id,
        basePrice: Number(row.base_price) || 0,
        discountAmount: Number(row.discount_amount) || 0,
        imageUrl: row.image_url || '/images/cama-cuna-plus.jpg',
        imageUrls: Array.isArray(row.image_urls) && row.image_urls.length > 0
          ? row.image_urls
          : (row.image_url ? [row.image_url] : ['/images/cama-cuna-plus.jpg']),
        customizationType: row.customization_type || 'bed_customizer',
        bedRules: row.bed_rules || undefined,
        types: row.types || [],
        additionals: row.additionals || []
      }));
    } catch (e) {
      console.error('Supabase getProducts exception:', e);
      return null;
    }
  },

  async upsertProduct(product: Product): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    try {
      const { error } = await supabase.from('store_products').upsert({
        id: product.id,
        name: product.name,
        description: product.description,
        category_id: product.categoryId,
        base_price: product.basePrice,
        discount_amount: product.discountAmount || 0,
        image_url: product.imageUrl,
        image_urls: product.imageUrls?.length ? product.imageUrls : [product.imageUrl],
        customization_type: product.customizationType,
        bed_rules: product.bedRules || null,
        types: product.types || [],
        additionals: product.additionals || [],
        updated_at: new Date().toISOString()
      });

      if (error) {
        console.error('Error saving product to Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase upsertProduct exception:', e);
      return false;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    try {
      const { error } = await supabase.from('store_products').delete().eq('id', id);
      if (error) {
        console.error('Error deleting product from Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase deleteProduct exception:', e);
      return false;
    }
  },

  // --- CATEGORÍAS ---
  async getCategories(): Promise<Category[] | null> {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('store_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.warn('Error fetching categories from Supabase:', error.message);
        return null;
      }

      if (!data || data.length === 0) return [];

      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        icon: row.icon || undefined
      }));
    } catch (e) {
      console.error('Supabase getCategories exception:', e);
      return null;
    }
  },

  async upsertCategory(category: Category, index = 0): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    try {
      const { error } = await supabase.from('store_categories').upsert({
        id: category.id,
        name: category.name,
        icon: category.icon || null,
        sort_order: index
      });

      if (error) {
        console.error('Error saving category to Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase upsertCategory exception:', e);
      return false;
    }
  },

  async deleteCategory(id: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    try {
      const { error } = await supabase.from('store_categories').delete().eq('id', id);
      if (error) {
        console.error('Error deleting category from Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase deleteCategory exception:', e);
      return false;
    }
  },

  // --- ADICIONALES SUELTOS ---
  async getAddons(): Promise<AddonItem[] | null> {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase.from('store_addons').select('*');
      if (error) {
        console.warn('Error fetching addons from Supabase:', error.message);
        return null;
      }
      if (!data || data.length === 0) return [];
      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        price: Number(row.price) || 0,
        imageUrl: row.image_url || undefined,
        active: row.is_active !== false
      }));
    } catch (e) {
      console.error('Supabase getAddons exception:', e);
      return null;
    }
  },

  async upsertAddon(addon: AddonItem): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    try {
      const { error } = await supabase.from('store_addons').upsert({
        id: addon.id,
        name: addon.name,
        description: addon.description,
        price: addon.price,
        image_url: addon.imageUrl || null,
        is_active: addon.active !== false
      });
      return !error;
    } catch (e) {
      console.error('Supabase upsertAddon exception:', e);
      return false;
    }
  },

  async deleteAddon(id: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    try {
      const { error } = await supabase.from('store_addons').delete().eq('id', id);
      return !error;
    } catch (e) {
      console.error('Supabase deleteAddon exception:', e);
      return false;
    }
  },

  // --- CONFIGURACIÓN GENERAL (SETTINGS JSON) ---
  async getSetting<T>(key: string): Promise<T | null> {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('value')
        .eq('key', key)
        .maybeSingle();

      if (error) {
        console.warn(`Error reading setting "${key}" from Supabase:`, error.message);
        return null;
      }
      return data?.value ? (data.value as T) : null;
    } catch (e) {
      console.error(`Supabase getSetting(${key}) exception:`, e);
      return null;
    }
  },

  async saveSetting<T>(key: string, value: T): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    try {
      const { error } = await supabase.from('store_settings').upsert({
        key,
        value,
        updated_at: new Date().toISOString()
      });
      return !error;
    } catch (e) {
      console.error(`Supabase saveSetting(${key}) exception:`, e);
      return false;
    }
  },

  // Helpers específicos para Customizer y Business
  async getCustomizerConfig(): Promise<CustomizerConfig | null> {
    return this.getSetting<CustomizerConfig>('customizer_config');
  },

  async saveCustomizerConfig(config: CustomizerConfig): Promise<boolean> {
    return this.saveSetting<CustomizerConfig>('customizer_config', config);
  },

  async getBusinessConfig(): Promise<BusinessConfig | null> {
    return this.getSetting<BusinessConfig>('business_config');
  },

  async saveBusinessConfig(config: BusinessConfig): Promise<boolean> {
    return this.saveSetting<BusinessConfig>('business_config', config);
  },

  // Helpers específicos para credenciales Admin
  async getAdminAuth(): Promise<{ username: string; password: string } | null> {
    return this.getSetting<{ username: string; password: string }>('admin_auth_config');
  },

  async saveAdminAuth(auth: { username: string; password: string }): Promise<boolean> {
    return this.saveSetting<{ username: string; password: string }>('admin_auth_config', auth);
  }
};
