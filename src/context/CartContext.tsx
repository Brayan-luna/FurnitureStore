import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductTypeOption, ProductAdditionalOption, CartItem, LastAddedItem, CartContextValue } from '../types';

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = 'furniture_store_cart_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<LastAddedItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }, [items]);

  const addToCart = (
    product: Product,
    selectedType?: ProductTypeOption,
    selectedAdditional?: ProductAdditionalOption,
    unitPrice?: number,
    quantity = 1
  ) => {
    const typeId = selectedType?.id || 'standard';
    const addId = selectedAdditional?.id || 'none';
    const cartItemId = `${product.id}-${typeId}-${addId}`;
    const price = unitPrice ?? product.basePrice;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            cartItemId,
            productId: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            selectedType,
            selectedAdditional,
            unitPrice: price,
            quantity
          }
        ];
      }
    });

    setLastAddedItem({
      name: product.name,
      typeName: selectedType?.name,
      addName: selectedAdditional?.name,
      price
    });

    // Auto-ocultar notificación
    setTimeout(() => {
      setLastAddedItem(null);
    }, 3500);
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        lastAddedItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
