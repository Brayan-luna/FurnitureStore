import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductTypeOption, ProductAdditionalOption, CartItem, LastAddedItem, CartContextValue, AddonItem, SelectedCustomization } from '../types';
import { getDiscountedPrice } from '../utils/formatters';

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
    quantity = 1,
    customization?: SelectedCustomization,
    selectedAdditionals?: ProductAdditionalOption[]
  ) => {
    const typeId = selectedType?.id || 'standard';
    const addId = selectedAdditional?.id || 'none';
    const addArrayIds = selectedAdditionals && selectedAdditionals.length > 0
      ? selectedAdditionals.map((a) => a.id).sort().join(',')
      : '';
    const addonIds = customization?.addons ? customization.addons.map((a) => a.id).sort().join(',') : '';
    const cartItemId = customization
      ? `${product.id}-${customization.quality}-${customization.size.id}-${customization.mattress?.id || 'sin-colchon'}-${customization.color?.id || 'sin-color'}-${addonIds}`
      : `${product.id}-${typeId}-${addId}-${addArrayIds}`;
    const price = unitPrice ?? getDiscountedPrice(product.basePrice, product.discountAmount);

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
            selectedAdditionals,
            customization,
            unitPrice: price,
            quantity
          }
        ];
      }
    });

    const additionalsSummary = selectedAdditionals && selectedAdditionals.length > 0
      ? selectedAdditionals.map((a) => a.name).join(', ')
      : selectedAdditional?.name;

    setLastAddedItem({
      name: product.name,
      typeName: customization ? `${customization.quality} • ${customization.size.name}` : selectedType?.name,
      addName: customization?.mattress ? customization.mattress.name : additionalsSummary,
      price
    });

    // Auto-ocultar notificación
    setTimeout(() => {
      setLastAddedItem(null);
    }, 3500);
  };

  const addAddonToCart = (addon: AddonItem, quantity = 1) => {
    const cartItemId = `addon-${addon.id}`;
    const price = addon.price;

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
            productId: addon.id,
            name: addon.name,
            imageUrl: addon.imageUrl || '/logo.png',
            unitPrice: price,
            quantity,
            isAddon: true,
            selectedAdditional: { id: 'addon', name: 'Accesorio Adicional', priceModifier: 0 }
          }
        ];
      }
    });

    setLastAddedItem({
      name: addon.name,
      typeName: 'Accesorio Adicional',
      price
    });

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

  const updateCartItem = (
    oldCartItemId: string,
    newType: ProductTypeOption,
    newAdditional: ProductAdditionalOption,
    newUnitPrice: number
  ) => {
    setItems((prevItems) => {
      const targetItem = prevItems.find((it) => it.cartItemId === oldCartItemId);
      if (!targetItem) return prevItems;

      const newCartItemId = `${targetItem.productId}-${newType.id}-${newAdditional.id}`;

      // Si el id no cambió, solo actualizamos los datos del ítem
      if (newCartItemId === oldCartItemId) {
        return prevItems.map((it) =>
          it.cartItemId === oldCartItemId
            ? {
                ...it,
                selectedType: newType,
                selectedAdditional: newAdditional,
                unitPrice: newUnitPrice
              }
            : it
        );
      }

      // Si ya existía otro ítem con la misma combinación, sumamos la cantidad y removemos el anterior
      const existingSameItemIndex = prevItems.findIndex((it) => it.cartItemId === newCartItemId);
      if (existingSameItemIndex > -1) {
        return prevItems
          .filter((it) => it.cartItemId !== oldCartItemId)
          .map((it) =>
            it.cartItemId === newCartItemId
              ? { ...it, quantity: it.quantity + targetItem.quantity }
              : it
          );
      }

      // Si es una combinación diferente que no existía, actualizamos el ítem
      return prevItems.map((it) =>
        it.cartItemId === oldCartItemId
          ? {
              ...it,
              cartItemId: newCartItemId,
              selectedType: newType,
              selectedAdditional: newAdditional,
              unitPrice: newUnitPrice
            }
          : it
      );
    });
  };

  const updateFurnitureCartItem = (
    oldCartItemId: string,
    newType: ProductTypeOption,
    newAdditionals: ProductAdditionalOption[],
    newUnitPrice: number
  ) => {
    setItems((prevItems) => {
      const targetItem = prevItems.find((it) => it.cartItemId === oldCartItemId);
      if (!targetItem) return prevItems;

      const addArrayIds = newAdditionals.map((a) => a.id).sort().join(',');
      const newCartItemId = `${targetItem.productId}-${newType.id}-none-${addArrayIds}`;

      if (newCartItemId === oldCartItemId) {
        return prevItems.map((it) =>
          it.cartItemId === oldCartItemId
            ? {
                ...it,
                selectedType: newType,
                selectedAdditionals: newAdditionals,
                unitPrice: newUnitPrice
              }
            : it
        );
      }

      const existingSameItemIndex = prevItems.findIndex((it) => it.cartItemId === newCartItemId);
      if (existingSameItemIndex > -1) {
        return prevItems
          .filter((it) => it.cartItemId !== oldCartItemId)
          .map((it) =>
            it.cartItemId === newCartItemId
              ? { ...it, quantity: it.quantity + targetItem.quantity }
              : it
          );
      }

      return prevItems.map((it) =>
        it.cartItemId === oldCartItemId
          ? {
              ...it,
              cartItemId: newCartItemId,
              selectedType: newType,
              selectedAdditionals: newAdditionals,
              unitPrice: newUnitPrice
            }
          : it
      );
    });
  };

  const updateCustomizedCartItem = (
    oldCartItemId: string,
    newCustomization: SelectedCustomization,
    newUnitPrice: number
  ) => {
    setItems((prevItems) => {
      const targetItem = prevItems.find((it) => it.cartItemId === oldCartItemId);
      if (!targetItem) return prevItems;

      const addonIds = newCustomization.addons
        ? newCustomization.addons.map((a) => a.id).sort().join(',')
        : '';
      const newCartItemId = `${targetItem.productId}-${newCustomization.quality}-${newCustomization.size.id}-${newCustomization.mattress?.id || 'sin-colchon'}-${newCustomization.color?.id || 'sin-color'}-${addonIds}`;

      if (newCartItemId === oldCartItemId) {
        return prevItems.map((it) =>
          it.cartItemId === oldCartItemId
            ? {
                ...it,
                customization: newCustomization,
                unitPrice: newUnitPrice
              }
            : it
        );
      }

      const existingIndex = prevItems.findIndex((it) => it.cartItemId === newCartItemId);
      if (existingIndex > -1) {
        return prevItems
          .filter((it) => it.cartItemId !== oldCartItemId)
          .map((it) =>
            it.cartItemId === newCartItemId
              ? {
                  ...it,
                  customization: newCustomization,
                  unitPrice: newUnitPrice,
                  quantity: it.quantity + targetItem.quantity
                }
              : it
          );
      }

      return prevItems.map((it) =>
        it.cartItemId === oldCartItemId
          ? {
              ...it,
              cartItemId: newCartItemId,
              customization: newCustomization,
              unitPrice: newUnitPrice
            }
          : it
      );
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        addAddonToCart,
        removeFromCart,
        updateQuantity,
        updateCartItem,
        updateCustomizedCartItem,
        updateFurnitureCartItem,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
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
