import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, MessageCircle, ShoppingBag, ShieldCheck, Info } from 'lucide-react';
import { Product, SelectedCustomization } from '../../../types';
import { useProducts } from '../../../context/ProductContext';
import { useCart } from '../../../context/CartContext';
import { useBusiness } from '../../../context/BusinessContext';
import { formatPrice } from '../../../utils/formatters';
import { whatsappService } from '../../../services/whatsappService';
import './CustomizerModal.css';

export interface CustomizerModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomizerModal({ product, isOpen, onClose }: CustomizerModalProps) {
  const { customizerConfig } = useProducts();
  const { addToCart, openCart } = useCart();
  const { business } = useBusiness();

  // Estados de configuración
  const [quality, setQuality] = useState<'PLUS' | 'PREMIUM'>('PLUS');
  const [selectedSizeId, setSelectedSizeId] = useState<string>('1x190');
  const [selectedMattressId, setSelectedMattressId] = useState<string>('sin-colchon');
  const [selectedColorId, setSelectedColorId] = useState<string>('blanco-nieve');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  // Inicializar / resetear al abrir
  useEffect(() => {
    if (isOpen) {
      setQuality('PLUS');
      const firstActiveSize = customizerConfig.sizes.find((s) => s.active !== false)?.id || '1x190';
      setSelectedSizeId(firstActiveSize);
      setSelectedMattressId('sin-colchon');
      const firstActiveColor = customizerConfig.colors.find((c) => c.active !== false)?.id || 'blanco-nieve';
      setSelectedColorId(firstActiveColor);
      setSelectedAddonIds([]);
    }
  }, [isOpen, customizerConfig]);

  if (!isOpen) return null;

  // Resoluciones de datos activos
  const activeSizes = customizerConfig.sizes.filter((s) => s.active !== false);
  const activeMattresses = customizerConfig.mattresses.filter((m) => m.active !== false);
  const activeColors = customizerConfig.colors.filter((c) => c.active !== false);
  const activeAddons = customizerConfig.addons.filter((a) => a.active !== false);

  const currentSize = activeSizes.find((s) => s.id === selectedSizeId) || activeSizes[0];
  const currentMattress =
    selectedMattressId === 'sin-colchon'
      ? null
      : activeMattresses.find((m) => m.id === selectedMattressId) || null;
  const currentColor = activeColors.find((c) => c.id === selectedColorId) || activeColors[0];
  const currentAddons = activeAddons.filter((a) => selectedAddonIds.includes(a.id));

  // Cálculos de precio
  const basePrice = Number(product.basePrice) || 0;
  const qualityModifier =
    quality === 'PREMIUM' ? Number(customizerConfig.quality?.premium?.priceModifier) || 300000 : 0;
  const sizeModifier = Number(currentSize?.priceModifier) || 0;
  const mattressPrice = Number(currentMattress?.price) || 0;
  const addonsPrice = currentAddons.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  const totalPrice = basePrice + qualityModifier + sizeModifier + mattressPrice + addonsPrice;

  // Manejo de cambio de medida con compatibilidad inteligente de colchón
  const handleSelectSize = (sizeId: string) => {
    setSelectedSizeId(sizeId);

    if (selectedMattressId !== 'sin-colchon') {
      const selectedM = activeMattresses.find((m) => m.id === selectedMattressId);
      const isStillCompatible =
        selectedM?.compatibleSizes.includes('all') || selectedM?.compatibleSizes.includes(sizeId);

      if (!isStillCompatible) {
        // Si no es compatible, intentamos auto-seleccionar el semi-ortopédico para esa nueva medida
        const autoMatch = activeMattresses.find((m) => m.compatibleSizes.includes(sizeId));
        setSelectedMattressId(autoMatch ? autoMatch.id : 'sin-colchon');
      }
    }
  };

  // Toggle para adicionales del mueble (selección múltiple)
  const handleToggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const currentCustomization: SelectedCustomization = {
    quality,
    qualityModifier,
    size: currentSize,
    mattress: currentMattress,
    color: currentColor,
    addons: currentAddons,
    totalPrice
  };

  const handleAddToCart = () => {
    addToCart(product, undefined, undefined, totalPrice, 1, currentCustomization);
    onClose();
    openCart();
  };

  const whatsappUrl = whatsappService.generateCustomizedProductUrl(
    product,
    currentCustomization,
    business
  );

  return (
    <div className="customizer-modal-backdrop" onClick={onClose}>
      <div
        className="customizer-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="customizer-title"
      >
        {/* Cabecera del Modal */}
        <div className="customizer-modal-header">
          <div className="customizer-header-left">
            <img
              src={product.imageUrl || '/images/cama-cuna-plus.jpg'}
              alt={product.name}
              className="customizer-header-thumb"
            />
            <div>
              <div className="customizer-header-badge">
                <Sparkles size={13} />
                <span>Personalizador Exclusivo</span>
              </div>
              <h2 id="customizer-title" className="customizer-header-title">
                {product.name}
              </h2>
              <div className="customizer-header-baseprice">
                Base PLUS: <strong>{formatPrice(basePrice)}</strong>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="customizer-close-btn"
            onClick={onClose}
            aria-label="Cerrar personalizador"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo con Scroll de Secciones */}
        <div className="customizer-modal-body">
          {/* SECCIÓN 1: GAMA / CALIDAD */}
          <section className="customizer-section">
            <div className="customizer-section-title-row">
              <span className="customizer-step-num">1</span>
              <div>
                <h3 className="customizer-section-title">Línea de Fabricación y Acabado</h3>
                <p className="customizer-section-sub">
                  La base de todas es PLUS. Si eliges PREMIUM, se activa en verde con laca en poliuretano.
                </p>
              </div>
            </div>

            <div className="customizer-chips-grid grid-quality">
              {/* Chip PLUS */}
              <button
                type="button"
                className={`chip-button chip-quality-plus ${quality === 'PLUS' ? 'is-active' : ''}`}
                onClick={() => setQuality('PLUS')}
              >
                <div className="chip-content-top">
                  <span className="chip-label-badge">BASE INCLUIDA</span>
                  <span className="chip-title">PLUS</span>
                  <span className="chip-price">+$0</span>
                </div>
                <div className="chip-features">
                  <div>• {customizerConfig.quality?.plus?.wood || 'Fabricada en madera de roble'}</div>
                  <div>• {customizerConfig.quality?.plus?.finish || 'Pintura catalizada'}</div>
                  <div>• Medida estándar: 1 × 190 cm</div>
                </div>
                {quality === 'PLUS' && <div className="chip-check-indicator"><Check size={14} strokeWidth={3} /></div>}
              </button>

              {/* Chip PREMIUM */}
              <button
                type="button"
                className={`chip-button chip-quality-premium ${quality === 'PREMIUM' ? 'is-active is-green' : ''}`}
                onClick={() => setQuality('PREMIUM')}
              >
                <div className="chip-content-top">
                  <span className="chip-label-badge green-badge">ALTA GAMA</span>
                  <span className="chip-title">PREMIUM</span>
                  <span className="chip-price green-text">
                    +{formatPrice(Number(customizerConfig.quality?.premium?.priceModifier) || 300000)}
                  </span>
                </div>
                <div className="chip-features">
                  <div>• {customizerConfig.quality?.premium?.wood || 'Fabricada en madera de roble'}</div>
                  <div>• {customizerConfig.quality?.premium?.finish || 'Pintura en poliuretano (alta resistencia)'}</div>
                  <div>• Acabado sedoso y mayor durabilidad anti-rayones</div>
                </div>
                {quality === 'PREMIUM' && (
                  <div className="chip-check-indicator green-indicator">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </button>
            </div>
          </section>

          {/* SECCIÓN 2: MEDIDAS */}
          <section className="customizer-section">
            <div className="customizer-section-title-row">
              <span className="customizer-step-num">2</span>
              <div>
                <h3 className="customizer-section-title">Medida de la Cama</h3>
                <p className="customizer-section-sub">
                  Elige la dimensión deseada. La medida sencilla está incluida en el precio base.
                </p>
              </div>
            </div>

            <div className="customizer-chips-row">
              {activeSizes.map((size) => {
                const isSelected = selectedSizeId === size.id;
                return (
                  <button
                    key={size.id}
                    type="button"
                    className={`chip-size-btn ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelectSize(size.id)}
                  >
                    <div className="chip-size-header">
                      <strong className="chip-size-dim">{size.name}</strong>
                      <span className="chip-size-type">{size.label}</span>
                    </div>
                    <div className="chip-size-price-tag">
                      {size.priceModifier === 0 ? (
                        <span className="price-included">Incluida en PLUS</span>
                      ) : (
                        <span className="price-extra">+{formatPrice(size.priceModifier)}</span>
                      )}
                    </div>
                    {isSelected && (
                      <span className="chip-size-checked">
                        <Check size={14} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECCIÓN 3: 🛏️ COLCHONES */}
          <section className="customizer-section">
            <div className="customizer-section-title-row">
              <span className="customizer-step-num">3</span>
              <div>
                <h3 className="customizer-section-title">🛏️ Colchones</h3>
                <p className="customizer-section-sub alert-inline">
                  <Info size={14} /> Los productos se ofrecen sin colchón. Las opciones se filtran automáticamente según tu medida ({currentSize.name}).
                </p>
              </div>
            </div>

            <div className="customizer-mattress-grid">
              {/* Opción Sin Colchón */}
              <button
                type="button"
                className={`chip-mattress-card ${selectedMattressId === 'sin-colchon' ? 'is-active' : ''}`}
                onClick={() => setSelectedMattressId('sin-colchon')}
              >
                <div className="mattress-card-left">
                  <div className="mattress-name">Sin colchón</div>
                  <div className="mattress-desc">Estructura y tendido de tablas sin colchón incluido</div>
                </div>
                <div className="mattress-card-right">
                  <span className="mattress-price included">$0</span>
                  {selectedMattressId === 'sin-colchon' && <Check size={16} strokeWidth={2.5} />}
                </div>
              </button>

              {/* Opciones configuradas */}
              {activeMattresses.map((m) => {
                const isCompatible =
                  m.compatibleSizes.includes('all') || m.compatibleSizes.includes(selectedSizeId);
                const isSelected = selectedMattressId === m.id;

                return (
                  <button
                    key={m.id}
                    type="button"
                    disabled={!isCompatible}
                    className={`chip-mattress-card ${isSelected ? 'is-active' : ''} ${!isCompatible ? 'is-disabled' : ''}`}
                    onClick={() => {
                      if (isCompatible) setSelectedMattressId(m.id);
                    }}
                    title={!isCompatible ? `Solo disponible para medidas específicas` : m.name}
                  >
                    <div className="mattress-card-left">
                      <div className="mattress-name">{m.name}</div>
                      <div className="mattress-desc">
                        {isCompatible ? m.description || 'Garantía y confort anatómico' : '⚠️ No aplica a la medida seleccionada'}
                      </div>
                    </div>
                    <div className="mattress-card-right">
                      <span className={`mattress-price ${!isCompatible ? 'disabled-text' : ''}`}>
                        +{formatPrice(m.price)}
                      </span>
                      {isSelected && isCompatible && <Check size={16} strokeWidth={2.5} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECCIÓN 4: 🎨 COLORES */}
          <section className="customizer-section">
            <div className="customizer-section-title-row">
              <span className="customizer-step-num">4</span>
              <div>
                <h3 className="customizer-section-title">🎨 Color de Acabado</h3>
                <p className="customizer-section-sub">
                  Elige la tonalidad en madera o laca. Todos los colores están incluidos sin costo adicional.
                </p>
              </div>
            </div>

            <div className="customizer-colors-grid">
              {activeColors.map((color) => {
                const isSelected = selectedColorId === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    className={`chip-color-btn ${isSelected ? 'is-active' : ''}`}
                    onClick={() => setSelectedColorId(color.id)}
                  >
                    <span
                      className="color-swatch-circle"
                      style={{
                        background: color.hex,
                        border: color.id.includes('blanco') ? '1px solid #D1D5DB' : '1px solid rgba(0,0,0,0.1)'
                      }}
                    />
                    <span className="color-name">{color.name}</span>
                    {isSelected && <Check size={14} className="color-check-icon" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECCIÓN 5: ✨ ADICIONALES DEL MUEBLE */}
          <section className="customizer-section">
            <div className="customizer-section-title-row">
              <span className="customizer-step-num">5</span>
              <div>
                <h3 className="customizer-section-title">✨ Adicionales & Mejoras del Mueble</h3>
                <p className="customizer-section-sub">
                  Selecciona los accesorios opcionales que deseas incorporar (puedes marcar varios).
                </p>
              </div>
            </div>

            <div className="customizer-addons-grid">
              {activeAddons.map((addon) => {
                const isSelected = selectedAddonIds.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    className={`chip-addon-btn ${isSelected ? 'is-active' : ''}`}
                    onClick={() => handleToggleAddon(addon.id)}
                  >
                    <div className="addon-btn-checkbox">
                      {isSelected ? <Check size={13} strokeWidth={3} /> : null}
                    </div>
                    <div className="addon-btn-info">
                      <span className="addon-btn-name">{addon.name}</span>
                      {addon.description && <span className="addon-btn-desc">{addon.description}</span>}
                    </div>
                    <div className="addon-btn-price">
                      +{formatPrice(addon.price)}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Barra Flotante / Footer de Resumen y Acciones */}
        <div className="customizer-modal-footer">
          <div className="customizer-footer-summary">
            <div className="footer-summary-chips">
              <span className="summary-pill">
                <strong>Gama:</strong> {quality}
              </span>
              <span className="summary-pill">
                <strong>Medida:</strong> {currentSize.name}
              </span>
              {currentMattress && (
                <span className="summary-pill highlight">
                  <strong>Colchón:</strong> {currentMattress.name}
                </span>
              )}
              {currentAddons.length > 0 && (
                <span className="summary-pill addon-count">
                  +{currentAddons.length} adicional{currentAddons.length > 1 ? 'es' : ''}
                </span>
              )}
            </div>

            <div className="footer-total-price-box">
              <span className="total-price-caption">TOTAL PERSONALIZADO</span>
              <span className="total-price-number">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <div className="customizer-footer-actions">
            <button
              type="button"
              className="btn-customizer-add-cart"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} />
              <span>Agregar al pedido</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-customizer-whatsapp"
              title="Cotizar por WhatsApp con estas especificaciones"
            >
              <MessageCircle size={20} />
              <span>Consultar WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
