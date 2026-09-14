import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, Pencil, Check } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useProducts } from '../../../context/ProductContext';
import { useBusiness } from '../../../context/BusinessContext';
import { formatPrice } from '../../../utils/formatters';
import { whatsappService } from '../../../services/whatsappService';
import Select from '../../common/Select';
import { CartItem, Product } from '../../../types';
import './CartDrawer.css';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    updateCartItem,
    totalPrice,
    totalItems
  } = useCart();

  const { products } = useProducts();
  const { business } = useBusiness();

  const [customerName, setCustomerName] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Estado para la edición inline de un ítem
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [tempTypeId, setTempTypeId] = useState<string>('');
  const [tempAddId, setTempAddId] = useState<string>('');

  if (!isCartOpen) return null;

  const handleStartEdit = (item: CartItem, product: Product) => {
    setEditingItemId(item.cartItemId);
    setTempTypeId(item.selectedType?.id || product.types?.[0]?.id || '');
    setTempAddId(item.selectedAdditional?.id || product.additionals?.[0]?.id || '');
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setTempTypeId('');
    setTempAddId('');
  };

  const handleSaveEdit = (item: CartItem, product: Product) => {
    const selectedTypeObj = product.types?.find((t) => t.id === tempTypeId) || item.selectedType;
    const selectedAddObj = product.additionals?.find((a) => a.id === tempAddId) || item.selectedAdditional;

    if (!selectedTypeObj || !selectedAddObj) {
      handleCancelEdit();
      return;
    }

    const basePrice = product.basePrice;
    const newUnitPrice =
      basePrice + (selectedTypeObj.priceModifier || 0) + (selectedAddObj.priceModifier || 0);

    updateCartItem(item.cartItemId, selectedTypeObj, selectedAddObj, newUnitPrice);
    handleCancelEdit();
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
                Explora el catálogo y agrega tu cama cuna favorita con los tipos y adicionales que prefieras.
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
                const isEditing = editingItemId === item.cartItemId;

                // Si está en edición, calculamos el precio preliminar
                let previewUnitPrice = item.unitPrice;
                if (isEditing && product) {
                  const selType = product.types?.find((t) => t.id === tempTypeId) || item.selectedType;
                  const selAdd = product.additionals?.find((a) => a.id === tempAddId) || item.selectedAdditional;
                  previewUnitPrice = product.basePrice + (selType?.priceModifier || 0) + (selAdd?.priceModifier || 0);
                }

                if (isEditing && product) {
                  return (
                    <div key={item.cartItemId} className="cart-item-card is-editing">
                      <div className="cart-item-edit-wrapper">
                        <div className="edit-card-header">
                          <div className="edit-card-header-left">
                            <img
                              src={item.imageUrl || '/images/cama-cuna-plus.jpg'}
                              alt={item.name}
                              className="cart-item-edit-thumb"
                            />
                            <div>
                              <span className="edit-badge-tag">Modificando opciones</span>
                              <h4 className="cart-item-title" style={{ margin: 0 }}>{item.name}</h4>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn-cancel-edit-icon"
                            onClick={handleCancelEdit}
                            title="Cancelar edición"
                            aria-label="Cancelar cambios"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <div className="edit-panel-body">
                          <div className="edit-panel-field">
                            <label className="edit-field-label">Tipo de cama / Medida:</label>
                            <Select
                              value={tempTypeId}
                              onChange={setTempTypeId}
                              options={product.types || []}
                              showPriceModifier
                              ariaLabel="Seleccionar tipo de cama"
                            />
                          </div>

                          <div className="edit-panel-field">
                            <label className="edit-field-label">Adicional incluido:</label>
                            <Select
                              value={tempAddId}
                              onChange={setTempAddId}
                              options={product.additionals || []}
                              showPriceModifier
                              ariaLabel="Seleccionar adicional"
                            />
                          </div>

                          <div className="edit-pricing-summary">
                            <div className="edit-price-line">
                              <span className="edit-price-caption">Precio unitario:</span>
                              <span className="edit-price-number">{formatPrice(previewUnitPrice)}</span>
                            </div>
                            <div className="edit-price-subtotal">
                              Subtotal ({item.quantity} {item.quantity > 1 ? 'unidades' : 'unidad'}): <strong>{formatPrice(previewUnitPrice * item.quantity)}</strong>
                            </div>
                          </div>

                          <div className="edit-panel-footer-actions">
                            <button
                              type="button"
                              className="btn-save-cart-edit"
                              onClick={() => handleSaveEdit(item, product)}
                            >
                              <Check size={16} />
                              <span>Guardar cambios</span>
                            </button>
                            <button
                              type="button"
                              className="btn-cancel-cart-edit"
                              onClick={handleCancelEdit}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

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
                              title="Cambiar tipo o adicionales"
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
                          </div>
                        ) : (
                          <>
                            <div className="cart-detail-line">
                              <span className="cart-detail-tag">Tipo:</span> {item.selectedType?.name || 'Estándar'}
                            </div>
                            <div className="cart-detail-line">
                              <span className="cart-detail-tag">Adicional:</span> {item.selectedAdditional?.name || 'Solita'}
                            </div>
                            {product && (
                              <button
                                type="button"
                                className="btn-quick-edit-link"
                                onClick={() => handleStartEdit(item, product)}
                              >
                                <Pencil size={12} />
                                <span>Cambiar tipo o adicional</span>
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
    </>
  );
}
