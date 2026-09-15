import React, { useState, useEffect, FormEvent } from 'react';
import Modal from '../../common/Modal';
import ImageUploader from '../../common/ImageUploader';
import Select from '../../common/Select';
import { Sparkles, Sliders, Plus, Trash2, Layers, CheckSquare, Package } from 'lucide-react';
import { useProducts } from '../../../context/ProductContext';
import { Product, ProductTypeOption, ProductAdditionalOption, CustomizationType } from '../../../types';
import { formatPrice, getDiscountedPrice } from '../../../utils/formatters';
import './ProductFormModal.css';

const PRESET_IMAGES = [
  { label: 'Cama Cuna Plus', url: '/images/cama-cuna-plus.jpg' },
  { label: 'Cama Cuna Premium', url: '/images/cama-cuna-premium.jpg' },
  { label: 'Cama Cuna Tapizada', url: '/images/cama-cuna-tapizada.jpg' },
  { label: 'Cama Cuna Natural', url: '/images/cama-cuna-natural.jpg' },
];

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product | null;
}

export default function ProductFormModal({ isOpen, onClose, initialProduct = null }: ProductFormModalProps) {
  const { addProduct, updateProduct, categories } = useProducts();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('plus');
  const [basePrice, setBasePrice] = useState(2700000);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState('/images/cama-cuna-plus.jpg');
  const [customizationType, setCustomizationType] = useState<CustomizationType>('bed_customizer');

  // Variantes y Adicionales propios (para Peinadoras, Cómodas, otros muebles)
  const [types, setTypes] = useState<ProductTypeOption[]>([
    { id: 'opcion-1', name: 'Medida Estándar', priceModifier: 0 }
  ]);

  const [additionals, setAdditionals] = useState<ProductAdditionalOption[]>([]);

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || '');
      setDescription(initialProduct.description || '');
      setCategoryId(initialProduct.categoryId || 'plus');
      setBasePrice(initialProduct.basePrice || 0);
      setDiscountAmount(initialProduct.discountAmount || 0);
      setImageUrl(initialProduct.imageUrl || '/images/cama-cuna-plus.jpg');
      setCustomizationType(initialProduct.customizationType || 'bed_customizer');
      setTypes(
        initialProduct.types && initialProduct.types.length > 0
          ? initialProduct.types
          : [{ id: 'opcion-1', name: 'Medida Estándar', priceModifier: 0 }]
      );
      setAdditionals(initialProduct.additionals || []);
    } else {
      // Valores para nuevo producto
      setName('');
      setDescription('');
      setCategoryId(categories.find(c => c.id !== 'todas')?.id || 'plus');
      setBasePrice(2700000);
      setDiscountAmount(0);
      setImageUrl('/images/cama-cuna-plus.jpg');
      setCustomizationType('bed_customizer');
      setTypes([{ id: 'opcion-1', name: 'Medida Estándar', priceModifier: 0 }]);
      setAdditionals([]);
    }
  }, [initialProduct, isOpen, categories]);

  // Manejadores de Tipos/Variantes propias
  const handleAddType = () => {
    const newId = `var-${Date.now()}`;
    setTypes([...types, { id: newId, name: 'Nueva medida / opción', priceModifier: 0 }]);
  };

  const handleUpdateType = (index: number, field: 'name' | 'priceModifier', value: string | number) => {
    const updated = [...types];
    updated[index] = {
      ...updated[index],
      [field]: field === 'priceModifier' ? Number(value) || 0 : String(value)
    };
    setTypes(updated);
  };

  const handleRemoveType = (index: number) => {
    if (types.length <= 1) return;
    setTypes(types.filter((_, i) => i !== index));
  };

  // Manejadores de Adicionales propios
  const handleAddAdditional = () => {
    const newId = `adic-${Date.now()}`;
    setAdditionals([...additionals, { id: newId, name: 'Nuevo adicional / accesorio', priceModifier: 0 }]);
  };

  const handleUpdateAdditional = (index: number, field: 'name' | 'priceModifier', value: string | number) => {
    const updated = [...additionals];
    updated[index] = {
      ...updated[index],
      [field]: field === 'priceModifier' ? Number(value) || 0 : String(value)
    };
    setAdditionals(updated);
  };

  const handleRemoveAdditional = (index: number) => {
    setAdditionals(additionals.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const productPayload = {
      name: name.trim(),
      description: description.trim(),
      categoryId,
      basePrice: Number(basePrice) || 0,
      discountAmount: Number(discountAmount) || 0,
      imageUrl: imageUrl.trim() || '/images/cama-cuna-plus.jpg',
      customizationType,
      types: customizationType === 'custom_variants' ? types : (initialProduct?.types || []),
      additionals: customizationType === 'custom_variants' ? additionals : (initialProduct?.additionals || [])
    };

    if (initialProduct?.id) {
      updateProduct(initialProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }
    onClose();
  };

  const availableCategories = categories.filter((c) => c.id !== 'todas');

  const discountedCalculated = getDiscountedPrice(basePrice, discountAmount);
  const effectiveSavings = Math.min(basePrice, Math.max(0, Number(discountAmount) || 0));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit} className="product-form">
        {/* Selector de Modo de Personalización del Producto */}
        <div className="product-mode-selector-wrapper">
          <label className="product-form-label">
            Tipo de Producto y Personalización
          </label>
          <div className="product-mode-grid">
            <button
              type="button"
              className={`product-mode-card ${customizationType === 'bed_customizer' ? 'active' : ''}`}
              onClick={() => setCustomizationType('bed_customizer')}
            >
              <div className="product-mode-icon">🛏️</div>
              <div className="product-mode-text">
                <strong>Cama Cuna</strong>
                <span>Personalizador global (5 pasos)</span>
              </div>
            </button>

            <button
              type="button"
              className={`product-mode-card ${customizationType === 'custom_variants' ? 'active' : ''}`}
              onClick={() => setCustomizationType('custom_variants')}
            >
              <div className="product-mode-icon">🪞</div>
              <div className="product-mode-text">
                <strong>Mueble Personalizado</strong>
                <span>Peinadoras, cómodas, closets</span>
              </div>
            </button>

            <button
              type="button"
              className={`product-mode-card ${customizationType === 'simple' ? 'active' : ''}`}
              onClick={() => setCustomizationType('simple')}
            >
              <div className="product-mode-icon">📦</div>
              <div className="product-mode-text">
                <strong>Venta Directa</strong>
                <span>Producto estándar sin pasos</span>
              </div>
            </button>
          </div>
        </div>

        {/* Nombre y Categoría */}
        <div className="product-form-grid-2">
          <div>
            <label className="product-form-label">
              Nombre del Producto *
            </label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Peinadora Hollywood con Espejo LED"
              required
            />
          </div>

          <div>
            <label className="product-form-label">
              Categoría
            </label>
            <Select
              value={categoryId}
              onChange={setCategoryId}
              options={availableCategories.map((c) => ({
                id: c.id,
                name: c.name
              }))}
              ariaLabel="Seleccionar categoría"
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="product-form-label">
            Descripción
          </label>
          <textarea
            className="input-field"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Fabricada en MDF y roble de alta durabilidad, incluye espejo con iluminación..."
          />
        </div>

        {/* Precio Base y Descuento Fijo */}
        <div className="product-form-grid-equal">
          <div>
            <label className="product-form-label">
              Precio Base (COP) *
            </label>
            <input
              type="number"
              className="input-field"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              step="10000"
              required
            />
          </div>

          <div>
            <label className="product-form-label">
              Descuento Fijo (COP)
            </label>
            <input
              type="number"
              className="input-field"
              value={discountAmount || ''}
              onChange={(e) => {
                const val = Math.max(0, Number(e.target.value) || 0);
                setDiscountAmount(val);
              }}
              placeholder="0 (Ej: 150000)"
              min="0"
              step="10000"
            />
          </div>
        </div>

        {/* Acceso rápido a montos fijos y desglose en vivo */}
        <div className="discount-preview-box">
          <div className="discount-presets">
            <span className="discount-presets-label">Montos sugeridos:</span>
            {[0, 50000, 100000, 150000, 200000, 300000, 500000].map((amt) => (
              <button
                key={amt}
                type="button"
                className={`discount-preset-btn ${discountAmount === amt ? 'active' : ''}`}
                onClick={() => setDiscountAmount(amt)}
              >
                {amt === 0 ? 'Sin desc. ($0)' : `-$${amt / 1000}k`}
              </button>
            ))}
          </div>

          {discountAmount > 0 && (
            <div className="discount-calc-summary">
              <div className="discount-calc-row">
                <span>Precio final con descuento:</span>
                <strong>{formatPrice(discountedCalculated)}</strong>
              </div>
              <div className="discount-calc-savings">
                Descuento de {formatPrice(effectiveSavings)}
              </div>
            </div>
          )}
        </div>

        {/* Carga de Imagen (Selector de Archivos Móvil/PC o URL) */}
        <div style={{ marginBottom: '4px' }}>
          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            label="Foto del Producto"
            placeholder="/images/cama-cuna-plus.jpg o https://..."
          />
        </div>

        {/* Galería rápida de imágenes prediseñadas */}
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            O elige una imagen de estudio disponible:
          </label>
          <div className="preset-images-list">
            {PRESET_IMAGES.map((preset) => (
              <button
                key={preset.url}
                type="button"
                onClick={() => setImageUrl(preset.url)}
                className={`preset-image-btn ${imageUrl === preset.url ? 'active' : ''}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* SECCIÓN CONDICIONAL SEGÚN EL MODO DE PRODUCTO */}

        {customizationType === 'bed_customizer' && (
          <div className="product-customizer-notice">
            <div className="product-customizer-notice-icon">
              <Sliders size={18} />
            </div>
            <div className="product-customizer-notice-content">
              <strong>Personalizador Global Activo</strong>
              <p>
                Las medidas, colchones compatibles, colores y adicionales de cama cuna se administran de forma unificada desde la pestaña <strong>Personalizador</strong>.
              </p>
            </div>
          </div>
        )}

        {customizationType === 'custom_variants' && (
          <div className="product-custom-variants-section">
            {/* Gestión de Variaciones / Medidas Propias */}
            <div className="variant-manager-box">
              <div className="variant-manager-header">
                <div>
                  <span className="variant-manager-title">
                    1. Medidas o Variaciones de este Mueble
                  </span>
                  <p className="variant-manager-subtitle">
                    Opciones principales seleccionables (ej. 90 cm, 120 cm, Con luces)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddType}
                  className="variant-add-btn"
                >
                  <Plus size={15} /> Agregar medida/opción
                </button>
              </div>

              <div className="variant-rows-list">
                {types.map((type, idx) => (
                  <div key={idx} className="variant-row">
                    <input
                      type="text"
                      className="input-field"
                      value={type.name}
                      onChange={(e) => handleUpdateType(idx, 'name', e.target.value)}
                      placeholder="Ej: 100 cm con espejo redondo"
                      style={{ flex: 2 }}
                    />
                    <div style={{ flex: 1.4, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>+$</span>
                      <input
                        type="number"
                        className="input-field"
                        value={type.priceModifier}
                        onChange={(e) => handleUpdateType(idx, 'priceModifier', e.target.value)}
                        placeholder="0"
                        step="10000"
                      />
                    </div>
                    {types.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveType(idx)}
                        className="variant-delete-btn"
                        title="Eliminar opción"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Gestión de Adicionales Propios */}
            <div className="variant-manager-box">
              <div className="variant-manager-header">
                <div>
                  <span className="variant-manager-title">
                    2. Adicionales o Accesorios Opcionales
                  </span>
                  <p className="variant-manager-subtitle">
                    Complementos que el cliente puede sumar (ej. Banqueta, Luces LED, Organizador)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddAdditional}
                  className="variant-add-btn"
                >
                  <Plus size={15} /> Agregar adicional
                </button>
              </div>

              {additionals.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: '4px 0' }}>
                  Sin adicionales específicos aún. Presiona "+ Agregar adicional" para sumar complementos.
                </p>
              ) : (
                <div className="variant-rows-list">
                  {additionals.map((add, idx) => (
                    <div key={idx} className="variant-row">
                      <input
                        type="text"
                        className="input-field"
                        value={add.name}
                        onChange={(e) => handleUpdateAdditional(idx, 'name', e.target.value)}
                        placeholder="Ej: Banqueta tapizada capitonada"
                        style={{ flex: 2 }}
                      />
                      <div style={{ flex: 1.4, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>+$</span>
                        <input
                          type="number"
                          className="input-field"
                          value={add.priceModifier}
                          onChange={(e) => handleUpdateAdditional(idx, 'priceModifier', e.target.value)}
                          placeholder="0"
                          step="10000"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAdditional(idx)}
                        className="variant-delete-btn"
                        title="Eliminar adicional"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {customizationType === 'simple' && (
          <div className="product-customizer-notice simple">
            <div className="product-customizer-notice-icon">
              <Package size={18} />
            </div>
            <div className="product-customizer-notice-content">
              <strong>Producto de Venta Directa</strong>
              <p>
                Este producto se agregará directamente con su precio base y descuento al carrito o pedido de WhatsApp sin requerir pasos de configuración.
              </p>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="product-form-actions">
          <button
            type="button"
            onClick={onClose}
            className="btn-cancel"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-add-to-cart"
            style={{ width: 'auto', padding: '10px 24px' }}
          >
            {initialProduct ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
