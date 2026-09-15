import React, { useState } from 'react';
import { Plus, MessageCircle, Sparkles, Sliders, Tag, ShoppingBag } from 'lucide-react';
import Badge from '../../common/Badge';
import CustomizerModal from '../CustomizerModal';
import FurnitureCustomizerModal from '../FurnitureCustomizerModal';
import { formatPrice, getDiscountedPrice } from '../../../utils/formatters';
import { useCart } from '../../../context/CartContext';
import { useBusiness } from '../../../context/BusinessContext';
import { useProducts } from '../../../context/ProductContext';
import { whatsappService } from '../../../services/whatsappService';
import { Product } from '../../../types';
import './ProductCard.css';

export interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, openCart } = useCart();
  const { business } = useBusiness();
  const { categories } = useProducts();

  const [isBedCustomizerOpen, setIsBedCustomizerOpen] = useState(false);
  const [isFurnitureCustomizerOpen, setIsFurnitureCustomizerOpen] = useState(false);

  // Modo de producto
  const mode = product.customizationType || 'bed_customizer';

  // Precio base y descuento
  const basePrice = Number(product.basePrice) || 0;
  const discountAmount = Number(product.discountAmount) || 0;
  const hasDiscount = discountAmount > 0;
  const finalBasePrice = getDiscountedPrice(basePrice, discountAmount);

  // Encontrar información de la categoría
  const category = categories.find((c) => c.id === product.categoryId) || {
    name: 'General',
    icon: 'cloud',
    color: '#3B82F6',
    bg: 'rgba(224, 242, 254, 0.9)'
  };

  const handleActionClick = () => {
    if (mode === 'bed_customizer') {
      setIsBedCustomizerOpen(true);
    } else if (mode === 'custom_variants') {
      setIsFurnitureCustomizerOpen(true);
    } else {
      // Simple / Venta directa
      addToCart(product, undefined, undefined, finalBasePrice, 1);
      openCart();
    }
  };

  const quickWhatsappUrl = whatsappService.generateQuickProductUrl(
    product,
    product.types?.[0] || { id: 'standard', name: 'Estándar', priceModifier: 0 },
    product.additionals?.[0] || { id: 'none', name: 'Sin adicionales', priceModifier: 0 },
    finalBasePrice,
    business
  );

  return (
    <>
      <article className="product-card" id={`product-${product.id}`}>
        {/* Media & Badge */}
        <div className="product-card-media">
          <img
            src={product.imageUrl || '/images/cama-cuna-plus.jpg'}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/cama-cuna-plus.jpg';
            }}
          />
          <Badge
            label={category.name}
            iconName={category.icon || 'cloud'}
            color={category.color || '#3B82F6'}
            bg={category.bg || 'rgba(224, 242, 254, 0.9)'}
          />
          {hasDiscount && (
            <div className="product-card-discount-badge">
              <Tag size={12} strokeWidth={2.5} />
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="product-card-body">
          <h3 className="product-card-title">{product.name}</h3>
          <p className="product-card-description">{product.description}</p>

          {/* Botón Destacado según el Tipo de Producto */}
          {mode === 'bed_customizer' && (
            <button
              type="button"
              className="btn-open-customizer"
              onClick={() => setIsBedCustomizerOpen(true)}
              aria-label={`Personalizar ${product.name}`}
            >
              <div className="btn-open-customizer-left">
                <span className="btn-open-customizer-icon">
                  <Sparkles size={16} />
                </span>
                <div className="btn-open-customizer-text">
                  <span className="btn-open-customizer-title">Ármala como quieras</span>
                  <span className="btn-open-customizer-sub">Gama PLUS/PREMIUM, medidas, colchones y mejoras</span>
                </div>
              </div>
              <span className="btn-open-customizer-arrow">→</span>
            </button>
          )}

          {mode === 'custom_variants' && (
            <button
              type="button"
              className="btn-open-customizer furniture"
              onClick={() => setIsFurnitureCustomizerOpen(true)}
              aria-label={`Personalizar ${product.name}`}
            >
              <div className="btn-open-customizer-left">
                <span className="btn-open-customizer-icon furniture">
                  <Sliders size={16} />
                </span>
                <div className="btn-open-customizer-text">
                  <span className="btn-open-customizer-title">Personalizar Mueble</span>
                  <span className="btn-open-customizer-sub">Elige medidas y accesorios a tu gusto</span>
                </div>
              </div>
              <span className="btn-open-customizer-arrow">→</span>
            </button>
          )}

          {/* Fila de precio base */}
          <div className="product-price-container">
            <div className="product-price-row">
              <div className="product-price-label-wrap">
                <span className="price-label">PRECIO BASE</span>
                {hasDiscount && (
                  <span className="price-discount-pill">-{formatPrice(discountAmount)}</span>
                )}
              </div>
              <div className="product-price-amount-wrap">
                {hasDiscount && (
                  <span className="price-original-amount">{formatPrice(basePrice)}</span>
                )}
                <span className="price-amount">{formatPrice(finalBasePrice)}</span>
              </div>
            </div>
          </div>

          {/* Fila de botones de acción */}
          <div className="product-card-actions">
            <button
              type="button"
              className="btn-add-to-cart"
              onClick={handleActionClick}
              aria-label={`Agregar ${product.name} al pedido`}
            >
              {mode === 'simple' ? (
                <>
                  <ShoppingBag size={18} strokeWidth={2.5} />
                  <span>Agregar al Pedido</span>
                </>
              ) : (
                <>
                  <Plus size={18} strokeWidth={2.5} />
                  <span>Personalizar y Pedir</span>
                </>
              )}
            </button>

            <a
              href={quickWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-quick-whatsapp"
              aria-label={`Consultar por WhatsApp sobre ${product.name}`}
              title="Consultar disponibilidad por WhatsApp"
            >
              <MessageCircle size={22} />
            </a>
          </div>
        </div>
      </article>

      {/* Modal de personalización de Camas (5 pasos) */}
      {mode === 'bed_customizer' && (
        <CustomizerModal
          product={product}
          isOpen={isBedCustomizerOpen}
          onClose={() => setIsBedCustomizerOpen(false)}
        />
      )}

      {/* Modal de personalización de Muebles específicos (Peinadoras, Cómodas, etc.) */}
      {mode === 'custom_variants' && (
        <FurnitureCustomizerModal
          product={product}
          isOpen={isFurnitureCustomizerOpen}
          onClose={() => setIsFurnitureCustomizerOpen(false)}
        />
      )}
    </>
  );
}

