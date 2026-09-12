import React, { createContext, useContext, useState, ReactNode } from 'react';
import { storageService } from '../services/storageService';
import { Product, Category } from '../types';

export interface ProductContextValue {
  products: Product[];
  categories: Category[];
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  filteredProducts: Product[];
  addProduct: (newProduct: Omit<Product, 'id'> & { id?: string }) => Product;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'> & { id?: string }) => Category;
  deleteCategory: (id: string) => void;
  resetAllProducts: () => void;
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => storageService.getCategories());
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

  const addCategory = (category: Omit<Category, 'id'> & { id?: string }): Category => {
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

  const resetAllProducts = () => {
    storageService.resetToDefaults();
    setProducts(storageService.getProducts());
    setCategories(storageService.getCategories());
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
        selectedCategoryId,
        setSelectedCategoryId,
        filteredProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
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
