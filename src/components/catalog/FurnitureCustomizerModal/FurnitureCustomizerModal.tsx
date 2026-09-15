import React, { useState, useEffect } from 'react';
import { X, Check, MessageCircle, ShoppingBag, Sliders, ShieldCheck, Tag } from 'lucide-react';
import { formatPrice, getDiscountedPrice } from '../../../utils/formatters';
import { useCart } from '../../../context/CartContext';
import { useBusiness } from '../../../context/BusinessContext';
import { whatsappService } from '../../../services/whatsappService';
import { Product, ProductTypeOption, ProductAdditionalOption } from '../../../types';
import './FurnitureCustomizerModal.css';

export interface FurnitureCustomizerModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  initialType?: ProductTypeOption | null;
  initialAdditionals?: ProductAdditionalOption[] | null;
  onSaveCustomization?: (
    selectedType: ProductTypeOption,
    selectedAdditionals: ProductAdditionalOption[],
    totalUnitPrice: number
  ) => void;
  isEditing?: boolean;
}

export default function FurnitureCustomizerModal({
  product,
  isOpen,
  onClose,
  initialType = null,
  initialAdditionals = null,
  onSaveCustomization,
  isEditing = false
}: FurnitureCustomizerModalProps) {
  const { addToCart, openCart } = useCart();
  const { business } = useBusiness();

  const availableTypes: ProductTypeOption[] =
    product.types && product.types.length > 0
      ? product.types
      : [{ id: 'standard', name: 'Medida Estándar', priceModifier: 0 }];

  const availableAdditionals: ProductAdditionalOption[] = product.additionals || [];

  const [selectedTypeId, setSelectedTypeId] = useState<string>(availableTypes[0].id);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (initialType) {
        setSelectedTypeId(initialType.id);
      } else {
        setSelectedTypeId(availableTypes[0]?.id || 'standard');
      }

      if (initialAdditionals && initialAdditionals.length > 0) {
        setSelectedAddonIds(initialAdditionals.map((a) => a.id));
      } else {
        setSelectedAddonIds([]);
      }
    }
  }, [isOpen, initialType, initialAdditionals, product]);

  if (!isOpen) return null;

  const currentType = availableTypes.find((t) => t.id === selectedTypeId) || availableTypes[0];
  const currentAdditionals = availableAdditionals.filter((a) => selectedAddonIds.includes(a.id));

  // Precios y Descuento
  const rawBasePrice = Number(product.basePrice) || 0;
  const discountAmount = Number(product.discountAmount) || 0;
  const hasDiscount = discountAmount > 0;
  const basePrice = getDiscountedPrice(rawBasePrice, discountAmount);

  const typeModifier = Number(currentType?.priceModifier) || 0;
  const additionalsTotal = currentAdditionals.reduce((sum, a) => sum + (Number(a.priceModifier) || 0), 0);

  const finalUnitPrice = basePrice + typeModifier + additionalsTotal;
  const originalUnitPrice = rawBasePrice + typeModifier + additionalsTotal;

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleAddToCart = () => {
    if (isEditing && onSaveCustomization) {
      onSaveCustomization(currentType, currentAdditionals, finalUnitPrice);
    } else {
      addToCart(product, currentType, currentAdditionals[0], finalUnitPrice, 1, undefined);
    }
    onClose();
    if (!isEditing) {
      openCart();
    }
  };

  // Mensaje y link directo de WhatsApp
  const addonsSummary = currentAdditionals.length > 0 ? currentAdditionals.map((a) => a.name).join(', ') : 'Ninguno';
  const whatsappText = `👋 ¡Hola *${business.name || 'Zona Kids Home'}*! Quiero consultar/pedir este mueble personalizado:\n\n` +
    `🪞 *${product.name}*\n` +
    `• *Opción / Medida:* ${currentType.name} (+${formatPrice(typeModifier)})\n` +
    `• *Adicionales:* ${addonsSummary}\n` +
    (hasDiscount ? `• *Descuento aplicado:* -${formatPrice(discountAmount)}\n` : '') +
    `• *Precio Total:* ${formatPrice(finalUnitPrice)}\n\n` +
    `¿Tienen disponibilidad y tiempos de entrega? Gracias!`;

  const whatsappUrl = whatsappService.buildWhatsAppUrlWithText(business, whatsappText);

  return (
    <div className="furniture-customizer-backdrop" onClick={onClose}>
      <div
        className="furniture-customizer-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="furniture-customizer-title"
      >
        {/* Header */}
        <div className="furniture-customizer-header">
          <div className="furniture-customizer-header-info">
            <span className="furniture-customizer-badge">
              <Sliders size={13} />
              <span>Personalización de Mueble</span>
            </span>
            <h2 id="furniture-customizer-title" className="furniture-customizer-title">
              {product.name}
            </h2>
          </div>
          <button
            type="button"
            className="furniture-customizer-close-btn"
            onClick={onClose}
            aria-label="Cerrar modal de personalización"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="furniture-customizer-body">
          {/* Banner de producto */}
          <div className="furniture-customizer-hero-card">
            <img
              src={product.imageUrl || '/images/cama-cuna-plus.jpg'}
              alt={product.name}
              className="furniture-customizer-thumb"
            />
            <div className="furniture-customizer-hero-text">
              <p className="furniture-customizer-desc">{product.description}</p>
              <div className="furniture-customizer-hero-features">
                <span className="furniture-feature-tag">
                  <ShieldCheck size={13} /> Acabados premium
                </span>
                {hasDiscount && (
                  <span className="furniture-discount-tag">
                    <Tag size={12} /> Ahorras {formatPrice(discountAmount)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Paso 1: Selección de Medida / Variación */}
          <div className="furniture-customizer-section">
            <div className="furniture-section-title-wrap">
              <span className="furniture-step-num">1</span>
              <div>
                <h3 className="furniture-section-title">Elige la Medida u Opción Principal</h3>
                <p className="furniture-section-sub">Selecciona la variante base para tu espacio</p>
              </div>
            </div>

            <div className="furniture-options-grid">
              {availableTypes.map((type) => {
                const isSelected = selectedTypeId === type.id;
                const mod = Number(type.priceModifier) || 0;

                return (
                  <button
                    key={type.id}
                    type="button"
                    className={`furniture-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedTypeId(type.id)}
                  >
                    <div className="furniture-option-header">
                      <strong className="furniture-option-name">{type.name}</strong>
                      <span className="furniture-option-price">
                        {mod === 0 ? 'Incluida ($0)' : `+${formatPrice(mod)}`}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="furniture-option-check">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Paso 2: Adicionales y Accesorios Opcionales */}
          {availableAdditionals.length > 0 && (
            <div className="furniture-customizer-section">
              <div className="furniture-section-title-wrap">
                <span className="furniture-step-num">2</span>
                <div>
                  <h3 className="furniture-section-title">Adicionales y Complementos Opcionales</h3>
                  <p className="furniture-section-sub">Puedes seleccionar uno o varios accesorios</p>
                </div>
              </div>

              <div className="furniture-addons-grid">
                {availableAdditionals.map((addon) => {
                  const isSelected = selectedAddonIds.includes(addon.id);
                  const mod = Number(addon.priceModifier) || 0;

                  return (
                    <button
                      key={addon.id}
                      type="button"
                      className={`furniture-addon-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleToggleAddon(addon.id)}
                    >
                      <div className="furniture-addon-left">
                        <div className={`furniture-checkbox ${isSelected ? 'checked' : ''}`}>
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span className="furniture-addon-name">{addon.name}</span>
                      </div>
                      <span className="furniture-addon-price">
                        {mod === 0 ? 'Gratis ($0)' : `+${formatPrice(mod)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer con cálculo de total y botones */}
        <div className="furniture-customizer-footer">
          <div className="furniture-price-summary-col">
            <span className="furniture-total-label">PRECIO TOTAL PERSONALIZADO</span>
            <div className="furniture-price-numbers">
              {hasDiscount && (
                <span className="furniture-original-price">{formatPrice(originalUnitPrice)}</span>
              )}
              <strong className="furniture-final-price">{formatPrice(finalUnitPrice)}</strong>
            </div>
          </div>

          <div className="furniture-footer-actions">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="furniture-btn-whatsapp"
              title="Pedir o consultar por WhatsApp"
            >
              <MessageCircle size={18} />
              <span>Pedir por WhatsApp</span>
            </a>

            <button
              type="button"
              className="furniture-btn-submit"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} />
              <span>{isEditing ? 'Guardar Cambios' : 'Agregar al Pedido'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
