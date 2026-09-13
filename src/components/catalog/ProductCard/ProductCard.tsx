import React, { useState } from 'react';
import { Plus, MessageCircle } from 'lucide-react';
import Badge from '../../common/Badge';
import Select from '../../common/Select';
import { formatPrice } from '../../../utils/formatters';
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
  const { addToCart } = useCart();
  const { business } = useBusiness();
  const { categories } = useProducts();

  // Opciones de tipo y adicional por defecto
  const defaultTypeId = product.types?.[0]?.id || '';
  const defaultAddId = product.additionals?.[0]?.id || '';

  const [selectedTypeId, setSelectedTypeId] = useState<string>(defaultTypeId);
  const [selectedAddId, setSelectedAddId] = useState<string>(defaultAddId);

  // Encontrar objetos de variantes seleccionadas
  const selectedType = product.types?.find((t) => t.id === selectedTypeId) || product.types?.[0];
  const selectedAdditional = product.additionals?.find((a) => a.id === selectedAddId) || product.additionals?.[0];

  // Cálculo del precio dinámico en tiempo real
  const basePrice = Number(product.basePrice) || 0;
  const typeModifier = Number(selectedType?.priceModifier) || 0;
  const addModifier = Number(selectedAdditional?.priceModifier) || 0;
  const currentPrice = basePrice + typeModifier + addModifier;

  // Encontrar información de la categoría
  const category = categories.find((c) => c.id === product.categoryId) || {
    name: 'Plus',
    icon: 'cloud',
    color: '#3B82F6',
    bg: 'rgba(224, 242, 254, 0.9)'
  };

  const handleAddToCart = () => {
    if (selectedType && selectedAdditional) {
      addToCart(product, selectedType, selectedAdditional, currentPrice, 1);
    }
  };

  const quickWhatsappUrl = whatsappService.generateQuickProductUrl(
    product,
    selectedType,
    selectedAdditional,
    currentPrice,
    business
  );

  // Modificadores de precio activos
  const hasModifiers = typeModifier > 0 || addModifier > 0;

  return (
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
      </div>

      {/* Contenido */}
      <div className="product-card-body">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-description">{product.description}</p>

        {/* Selectores de opciones con los estilos acordados */}
        <div className="product-selectors-row">
          <Select
            value={selectedTypeId}
            onChange={setSelectedTypeId}
            options={product.types || []}
            name={`type-${product.id}`}
            ariaLabel="Seleccionar tipo de cama"
          />

          <Select
            value={selectedAddId}
            onChange={setSelectedAddId}
            options={product.additionals || []}
            name={`additional-${product.id}`}
            ariaLabel="Seleccionar adicionales"
          />
        </div>

        {/* Fila de precio con desglose si se elige una opción con costo adicional */}
        <div className="product-price-container">
          {hasModifiers ? (
            <div className="product-price-breakdown">
              <div className="price-breakdown-row">
                <span className="price-breakdown-label">Base:</span>
                <span className="price-breakdown-val">{formatPrice(basePrice)}</span>
              </div>
              {typeModifier > 0 && (
                <div className="price-breakdown-row modifier">
                  <span className="price-breakdown-label">+{selectedType?.name}:</span>
                  <span className="price-breakdown-val">+{formatPrice(typeModifier)}</span>
                </div>
              )}
              {addModifier > 0 && (
                <div className="price-breakdown-row modifier">
                  <span className="price-breakdown-label">+{selectedAdditional?.name}:</span>
                  <span className="price-breakdown-val">+{formatPrice(addModifier)}</span>
                </div>
              )}
              <div className="price-breakdown-divider" />
              <div className="product-price-row total">
                <span className="price-label">TOTAL</span>
                <span className="price-amount">{formatPrice(currentPrice)}</span>
              </div>
            </div>
          ) : (
            <div className="product-price-row">
              <span className="price-label">PRECIO</span>
              <span className="price-amount">{formatPrice(currentPrice)}</span>
            </div>
          )}
        </div>

        {/* Fila de botones de acción */}
        <div className="product-card-actions">
          <button
            type="button"
            className="btn-add-to-cart"
            onClick={handleAddToCart}
            aria-label={`Agregar ${product.name} al pedido`}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Agregar al pedido</span>
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
  );
}
