import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialProducts, initialCategories } from '../config/initialProducts';
import { initialAddons } from '../config/initialAddons';
import { initialCustomizerConfig } from '../config/initialCustomizer';
import { supabaseDbService } from '../services/supabaseDbService';
import { Product, Category, AddonItem, CustomizerConfig } from '../types';

export interface ProductContextValue {
  products: Product[];
  categories: Category[];
  addons: AddonItem[];
  customizerConfig: CustomizerConfig;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  filteredProducts: Product[];
  addProduct: (newProduct: Omit<Product, 'id'> & { id?: string }) => Product;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addAddon: (newAddon: Omit<AddonItem, 'id'> & { id?: string }) => AddonItem;
  updateAddon: (id: string, updatedFields: Partial<AddonItem>) => void;
  deleteAddon: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'> & { id?: string }) => Category;
  deleteCategory: (id: string) => void;
  updateCustomizerConfig: (updates: Partial<CustomizerConfig>) => void;
  resetCustomizerConfig: () => void;
  resetAllProducts: () => void;
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [addons, setAddons] = useState<AddonItem[]>(initialAddons);
  const [customizerConfig, setCustomizerConfig] = useState<CustomizerConfig>(initialCustomizerConfig);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('todas');

  // Carga inicial y sincronización directa desde Supabase
  useEffect(() => {
    let isMounted = true;

    async function syncFromSupabase() {
      try {
        const [cloudProducts, cloudCategories, cloudAddons, cloudCustomizer] = await Promise.all([
          supabaseDbService.getProducts(),
          supabaseDbService.getCategories(),
          supabaseDbService.getAddons(),
          supabaseDbService.getCustomizerConfig()
        ]);

        if (!isMounted) return;

        if (cloudProducts !== null && cloudProducts.length > 0) {
          setProducts(cloudProducts);
        } else if (cloudProducts !== null && cloudProducts.length === 0 && initialProducts.length > 0) {
          // Si la base de datos de Supabase está vacía, sembrar productos iniciales
          initialProducts.forEach((p) => supabaseDbService.upsertProduct(p));
        }

        if (cloudCategories !== null && cloudCategories.length > 0) {
          setCategories(cloudCategories);
        } else if (cloudCategories !== null && cloudCategories.length === 0 && initialCategories.length > 0) {
          initialCategories.forEach((c, idx) => supabaseDbService.upsertCategory(c, idx));
        }

        if (cloudAddons !== null && cloudAddons.length > 0) {
          setAddons(cloudAddons);
        }

        if (cloudCustomizer !== null) {
          setCustomizerConfig(cloudCustomizer);
        } else {
          supabaseDbService.saveCustomizerConfig(initialCustomizerConfig);
        }
      } catch (err) {
        console.warn('Error sincronizando datos con Supabase:', err);
      }
    }

    syncFromSupabase();

    return () => {
      isMounted = false;
    };
  }, []);

  const addProduct = (newProduct: Omit<Product, 'id'> & { id?: string }): Product => {
    const productWithId: Product = {
      ...newProduct,
      id: newProduct.id || `prod-${Date.now()}`
    };
    const updated = [productWithId, ...products];
    setProducts(updated);
    supabaseDbService.upsertProduct(productWithId);
    return productWithId;
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    setProducts(updated);
    const targetProduct = updated.find((p) => p.id === id);
    if (targetProduct) {
      supabaseDbService.upsertProduct(targetProduct);
    }
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    supabaseDbService.deleteProduct(id);
  };

  const addAddon = (newAddon: Omit<AddonItem, 'id'> & { id?: string }): AddonItem => {
    const addonWithId: AddonItem = {
      ...newAddon,
      id: newAddon.id || `addon-${Date.now()}`
    };
    const updated = [addonWithId, ...addons];
    setAddons(updated);
    supabaseDbService.upsertAddon(addonWithId);
    return addonWithId;
  };

  const updateAddon = (id: string, updatedFields: Partial<AddonItem>) => {
    const updated = addons.map((a) => (a.id === id ? { ...a, ...updatedFields } : a));
    setAddons(updated);
    const targetAddon = updated.find((a) => a.id === id);
    if (targetAddon) {
      supabaseDbService.upsertAddon(targetAddon);
    }
  };

  const deleteAddon = (id: string) => {
    const updated = addons.filter((a) => a.id !== id);
    setAddons(updated);
    supabaseDbService.deleteAddon(id);
  };

  const addCategory = (category: Omit<Category, 'id'> & { id?: string }) => {
    const catWithId: Category = {
      ...category,
      id: category.id || `cat-${Date.now()}`
    };
    const updated = [...categories, catWithId];
    setCategories(updated);
    supabaseDbService.upsertCategory(catWithId, updated.length);
    return catWithId;
  };

  const deleteCategory = (id: string) => {
    if (id === 'todas') return;
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    supabaseDbService.deleteCategory(id);
    if (selectedCategoryId === id) {
      setSelectedCategoryId('todas');
    }
  };

  const updateCustomizerConfig = (updates: Partial<CustomizerConfig>) => {
    const updated: CustomizerConfig = {
      ...customizerConfig,
      ...updates,
      quality: {
        ...customizerConfig.quality,
        ...(updates.quality || {})
      }
    };
    setCustomizerConfig(updated);
    supabaseDbService.saveCustomizerConfig(updated);
  };

  const resetCustomizerConfig = () => {
    setCustomizerConfig(initialCustomizerConfig);
    supabaseDbService.saveCustomizerConfig(initialCustomizerConfig);
  };

  const resetAllProducts = () => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setAddons(initialAddons);
    setCustomizerConfig(initialCustomizerConfig);
    setSelectedCategoryId('todas');
  };

  // Filtrado de productos para la tienda
  const filteredProducts = selectedCategoryId === 'todas'
    ? products
    : products.filter((p) => p.categoryId === selectedCategoryId);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        addons,
        customizerConfig,
        selectedCategoryId,
        setSelectedCategoryId,
        filteredProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        addAddon,
        updateAddon,
        deleteAddon,
        addCategory,
        deleteCategory,
        updateCustomizerConfig,
        resetCustomizerConfig,
        resetAllProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts(): ProductContextValue {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}

