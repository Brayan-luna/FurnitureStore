import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, Pencil, Check } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useProducts } from '../../../context/ProductContext';
import { useBusiness } from '../../../context/BusinessContext';
import { formatPrice, getDiscountedPrice } from '../../../utils/formatters';
import { whatsappService } from '../../../services/whatsappService';
import CustomizerModal from '../../catalog/CustomizerModal';
import FurnitureCustomizerModal from '../../catalog/FurnitureCustomizerModal';
import { CartItem, Product, ProductTypeOption, ProductAdditionalOption } from '../../../types';
import './CartDrawer.css';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    updateCustomizedCartItem,
    updateFurnitureCartItem,
    totalPrice,
    totalItems
  } = useCart();

  const { products } = useProducts();
  const { business } = useBusiness();

  const [customerName, setCustomerName] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Estado para la edición con Modales
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);
  const [customizerProduct, setCustomizerProduct] = useState<Product | null>(null);
  const [isBedCustomizerOpen, setIsBedCustomizerOpen] = useState(false);
  const [isFurnitureCustomizerOpen, setIsFurnitureCustomizerOpen] = useState(false);

  if (!isCartOpen) return null;

  const handleStartEdit = (item: CartItem, product: Product) => {
    setEditingCartItem(item);
    setCustomizerProduct(product);

    if (product.customizationType === 'custom_variants') {
      setIsFurnitureCustomizerOpen(true);
    } else {
      setIsBedCustomizerOpen(true);
    }
  };

  const handleCloseModals = () => {
    setIsBedCustomizerOpen(false);
    setIsFurnitureCustomizerOpen(false);
    setEditingCartItem(null);
    setCustomizerProduct(null);
  };

  const handleSaveBedCustomization = (newCustomization: any) => {
    if (editingCartItem) {
      updateCustomizedCartItem(
        editingCartItem.cartItemId,
        newCustomization,
        newCustomization.totalPrice
      );
    }
    handleCloseModals();
  };

  const handleSaveFurnitureCustomization = (
    newType: ProductTypeOption,
    newAdditionals: ProductAdditionalOption[],
    newUnitPrice: number
  ) => {
    if (editingCartItem) {
      updateFurnitureCartItem(
        editingCartItem.cartItemId,
        newType,
        newAdditionals,
        newUnitPrice
      );
    }
    handleCloseModals();
  };

  const whatsappCheckoutUrl = whatsappService.generateCartOrderUrl(
    items,
    totalPrice,
    business,
    {
      name: customerName,
      city: customerCity,
      notes: customerNotes
    }
  );

  return (
    <>
      <div className="drawer-backdrop" onClick={closeCart} />
      <aside className="cart-drawer" role="dialog" aria-label="Carrito de compras">
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={22} color="var(--color-accent-pink)" />
            <span>Mi Pedido ({totalItems})</span>
          </div>
          <button className="drawer-close-btn" onClick={closeCart} aria-label="Cerrar carrito">
            <X size={22} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="drawer-body">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 10px', color: 'var(--text-muted)' }}>
              <ShoppingBag size={54} style={{ margin: '0 auto 16px auto', display: 'block', opacity: 0.3 }} />
              <h4 style={{ color: 'var(--text-dark)', marginBottom: '8px' }}>Tu pedido está vacío</h4>
              <p style={{ fontSize: '0.88rem', marginBottom: '20px' }}>
                Explora el catálogo y agrega tus productos favoritos con las opciones que prefieras.
              </p>
              <button
                type="button"
                className="btn-add-to-cart"
                style={{ width: 'auto', margin: '0 auto' }}
                onClick={closeCart}
              >
                Ver productos
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => {
                const product = products.find((p) => p.id === item.productId);

                return (
                  <div key={item.cartItemId} className="cart-item-card">
                    <img
                      src={item.imageUrl || '/images/cama-cuna-plus.jpg'}
                      alt={item.name}
                      className="cart-item-img"
                    />
                    <div className="cart-item-info">
                      <div className="cart-item-header-row">
                        <h4 className="cart-item-title">{item.name}</h4>
                        <div className="cart-item-action-btns">
                          {!item.isAddon && product && (
                            <button
                              type="button"
                              onClick={() => handleStartEdit(item, product)}
                              className="cart-action-btn edit"
                              title="Modificar personalización del producto"
                              aria-label={`Editar ${item.name}`}
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="cart-action-btn delete"
                            title="Eliminar del pedido"
                            aria-label={`Eliminar ${item.name} del pedido`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-details">
                        {item.isAddon ? (
                          <span className="cart-item-addon-badge">Accesorio adicional</span>
                        ) : item.customization ? (
                          <div className="cart-customization-summary">
                            <div className="cart-detail-line">
                              <span className={`cart-detail-tag ${item.customization.quality === 'PREMIUM' ? 'tag-premium' : ''}`}>
                                Línea {item.customization.quality}
                              </span>
                              <span style={{ margin: '0 4px', opacity: 0.5 }}>•</span>
                              <strong>{item.customization.size.name} ({item.customization.size.label})</strong>
                            </div>
                            <div className="cart-detail-line">
                              <span className="cart-detail-tag">Colchón:</span>{' '}
                              <span>{item.customization.mattress ? item.customization.mattress.name : 'Sin colchón'}</span>
                            </div>
                            {item.customization.color && (
                              <div className="cart-detail-line">
                                <span className="cart-detail-tag">Color:</span>{' '}
                                <span>{item.customization.color.name}</span>
                              </div>
                            )}
                            {item.customization.addons && item.customization.addons.length > 0 && (
                              <div className="cart-detail-line">
                                <span className="cart-detail-tag">Mejoras:</span>{' '}
                                <span style={{ color: 'var(--text-dark)', fontWeight: 600 }}>
                                  {item.customization.addons.map((a) => a.name).join(', ')}
                                </span>
                              </div>
                            )}

                            {product && (
                              <button
                                type="button"
                                className="btn-quick-edit-link"
                                onClick={() => handleStartEdit(item, product)}
                              >
                                <Pencil size={12} />
                                <span>Modificar opciones (Gama, medida, colchón...)</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <>
                            <div className="cart-detail-line">
                              <span className="cart-detail-tag">Opción:</span> {item.selectedType?.name || 'Estándar'}
                            </div>
                            {Boolean(item.selectedAdditionals && item.selectedAdditionals.length > 0) && (
                              <div className="cart-detail-line">
                                <span className="cart-detail-tag">Adicionales:</span>{' '}
                                <span style={{ color: 'var(--text-dark)', fontWeight: 600 }}>
                                  {item.selectedAdditionals!.map((a) => a.name).join(', ')}
                                </span>
                              </div>
                            )}
                            {!item.selectedAdditionals && item.selectedAdditional && item.selectedAdditional.id !== 'none' && (
                              <div className="cart-detail-line">
                                <span className="cart-detail-tag">Adicional:</span> {item.selectedAdditional.name}
                              </div>
                            )}
                            {product && (
                              <button
                                type="button"
                                className="btn-quick-edit-link"
                                onClick={() => handleStartEdit(item, product)}
                              >
                                <Pencil size={12} />
                                <span>Personalizar opciones</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>

                      <div className="cart-item-price-row">
                        <span className="cart-item-price">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>

                        <div className="cart-qty-controls">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            aria-label="Disminuir cantidad"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="qty-number">{item.quantity}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            aria-label="Aumentar cantidad"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer con Total y Enviar a WhatsApp */}
        {items.length > 0 && (
          <div className="drawer-footer">
            <div className="cart-summary-row">
              <span className="cart-total-label">Total a pagar</span>
              <span className="cart-total-amount">{formatPrice(totalPrice)}</span>
            </div>

            {/* Datos opcionales para personalizar el mensaje de WhatsApp */}
            <div className="customer-form-mini">
              <input
                type="text"
                className="input-field"
                placeholder="Tu nombre (opcional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <input
                type="text"
                className="input-field"
                placeholder="Ciudad de entrega (ej: Villavicencio, Bogotá...)"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
              />
            </div>

            <a
              href={whatsappCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-order"
            >
              <MessageCircle size={20} />
              <span>Enviar pedido por WhatsApp</span>
            </a>
          </div>
        )}
      </aside>

      {/* Modal interactivo para Camas Cunas (5 pasos) */}
      {isBedCustomizerOpen && customizerProduct && (
        <CustomizerModal
          product={customizerProduct}
          isOpen={isBedCustomizerOpen}
          onClose={handleCloseModals}
          initialCustomization={editingCartItem?.customization}
          isEditing={true}
          onSaveCustomization={handleSaveBedCustomization}
        />
      )}

      {/* Modal interactivo para Muebles (Peinadoras, Cómodas, etc.) */}
      {isFurnitureCustomizerOpen && customizerProduct && (
        <FurnitureCustomizerModal
          product={customizerProduct}
          isOpen={isFurnitureCustomizerOpen}
          onClose={handleCloseModals}
          initialType={editingCartItem?.selectedType}
          initialAdditionals={editingCartItem?.selectedAdditionals}
          isEditing={true}
          onSaveCustomization={handleSaveFurnitureCustomization}
        />
      )}
    </>
  );
}
