import React, { createContext, useContext, useState, ReactNode } from 'react';
import { storageService } from '../services/storageService';
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
  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => storageService.getCategories());
  const [addons, setAddons] = useState<AddonItem[]>(() => storageService.getAddons());
  const [customizerConfig, setCustomizerConfig] = useState<CustomizerConfig>(() => storageService.getCustomizerConfig());
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('todas');

  const addProduct = (newProduct: Omit<Product, 'id'> & { id?: string }): Product => {
    const productWithId: Product = {
      ...newProduct,
      id: newProduct.id || `prod-${Date.now()}`
    };
    const updated = [productWithId, ...products];
    setProducts(updated);
    storageService.saveProducts(updated);
    return productWithId;
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    setProducts(updated);
    storageService.saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    storageService.saveProducts(updated);
  };

  const addAddon = (newAddon: Omit<AddonItem, 'id'> & { id?: string }): AddonItem => {
    const addonWithId: AddonItem = {
      ...newAddon,
      id: newAddon.id || `addon-${Date.now()}`
    };
    const updated = [addonWithId, ...addons];
    setAddons(updated);
    storageService.saveAddons(updated);
    return addonWithId;
  };

  const updateAddon = (id: string, updatedFields: Partial<AddonItem>) => {
    const updated = addons.map((a) => (a.id === id ? { ...a, ...updatedFields } : a));
    setAddons(updated);
    storageService.saveAddons(updated);
  };

  const deleteAddon = (id: string) => {
    const updated = addons.filter((a) => a.id !== id);
    setAddons(updated);
    storageService.saveAddons(updated);
  };

  const addCategory = (category: Omit<Category, 'id'> & { id?: string }) => {
    const catWithId: Category = {
      ...category,
      id: category.id || `cat-${Date.now()}`
    };
    const updated = [...categories, catWithId];
    setCategories(updated);
    storageService.saveCategories(updated);
    return catWithId;
  };

  const deleteCategory = (id: string) => {
    if (id === 'todas') return;
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    storageService.saveCategories(updated);
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
    storageService.saveCustomizerConfig(updated);
  };

  const resetCustomizerConfig = () => {
    storageService.resetToDefaults();
    setCustomizerConfig(storageService.getCustomizerConfig());
  };

  const resetAllProducts = () => {
    storageService.resetToDefaults();
    setProducts(storageService.getProducts());
    setCategories(storageService.getCategories());
    setAddons(storageService.getAddons());
    setCustomizerConfig(storageService.getCustomizerConfig());
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

