import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useBusiness } from '../../../context/BusinessContext';
import { formatPrice } from '../../../utils/formatters';
import { whatsappService } from '../../../services/whatsappService';
import './CartDrawer.css';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems
  } = useCart();

  const { business } = useBusiness();

  const [customerName, setCustomerName] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  if (!isCartOpen) return null;

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
              {items.map((item) => (
                <div key={item.cartItemId} className="cart-item-card">
                  <img
                    src={item.imageUrl || '/images/cama-cuna-plus.jpg'}
                    alt={item.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h4 className="cart-item-title">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
                        title="Eliminar del pedido"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="cart-item-details">
                      <div><strong>Tipo:</strong> {item.selectedType?.name || 'Estándar'}</div>
                      <div><strong>Adicional:</strong> {item.selectedAdditional?.name || 'Solita'}</div>
                    </div>

                    <div className="cart-item-price-row">
                      <span className="cart-item-price">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>

                      <div className="cart-qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          aria-label="Disminuir cantidad"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button
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
              ))}
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
