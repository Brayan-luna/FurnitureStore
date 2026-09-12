import React, { useState, useEffect, FormEvent } from 'react';
import Modal from '../../common/Modal';
import { Plus, Trash2 } from 'lucide-react';
import { useProducts } from '../../../context/ProductContext';
import { Product, ProductTypeOption, ProductAdditionalOption } from '../../../types';
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
  const [imageUrl, setImageUrl] = useState('/images/cama-cuna-plus.jpg');

  // Variantes
  const [types, setTypes] = useState<ProductTypeOption[]>([
    { id: 'sencilla', name: 'Sencilla', priceModifier: 0 },
    { id: 'semidoble', name: 'Semidoble', priceModifier: 350000 }
  ]);

  const [additionals, setAdditionals] = useState<ProductAdditionalOption[]>([
    { id: 'solita', name: 'Solita', priceModifier: 0 },
    { id: 'colchon', name: 'Con colchón', priceModifier: 380000 },
    { id: 'combo-lenceria', name: 'Combo + lencería', priceModifier: 620000 }
  ]);

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || '');
      setDescription(initialProduct.description || '');
      setCategoryId(initialProduct.categoryId || 'plus');
      setBasePrice(initialProduct.basePrice || 0);
      setImageUrl(initialProduct.imageUrl || '/images/cama-cuna-plus.jpg');
      setTypes(initialProduct.types?.length ? initialProduct.types : [{ id: 'sencilla', name: 'Sencilla', priceModifier: 0 }]);
      setAdditionals(initialProduct.additionals?.length ? initialProduct.additionals : [{ id: 'solita', name: 'Solita', priceModifier: 0 }]);
    } else {
      // Valores para nuevo producto
      setName('');
      setDescription('');
      setCategoryId(categories.find(c => c.id !== 'todas')?.id || 'plus');
      setBasePrice(2700000);
      setImageUrl('/images/cama-cuna-plus.jpg');
      setTypes([
        { id: 'sencilla', name: 'Sencilla', priceModifier: 0 },
        { id: 'semidoble', name: 'Semidoble', priceModifier: 350000 }
      ]);
      setAdditionals([
        { id: 'solita', name: 'Solita', priceModifier: 0 },
        { id: 'colchon', name: 'Con colchón', priceModifier: 380000 },
        { id: 'combo-lenceria', name: 'Combo + lencería', priceModifier: 620000 }
      ]);
    }
  }, [initialProduct, isOpen, categories]);

  // Manejadores de Tipos
  const handleAddType = () => {
    const newId = `tipo-${Date.now()}`;
    setTypes([...types, { id: newId, name: 'Nueva medida', priceModifier: 0 }]);
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

  // Manejadores de Adicionales
  const handleAddAdditional = () => {
    const newId = `add-${Date.now()}`;
    setAdditionals([...additionals, { id: newId, name: 'Nuevo adicional', priceModifier: 0 }]);
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
    if (additionals.length <= 1) return;
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
      imageUrl: imageUrl.trim() || '/images/cama-cuna-plus.jpg',
      types,
      additionals
    };

    if (initialProduct?.id) {
      updateProduct(initialProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }
    onClose();
  };

  const availableCategories = categories.filter((c) => c.id !== 'todas');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit} className="product-form">
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
              placeholder="Ej: Cama Cuna Plus"
              required
            />
          </div>

          <div>
            <label className="product-form-label">
              Categoría
            </label>
            <select
              className="input-field"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {availableCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
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
            placeholder="Estructura en madera pino canadiense, corral con barandas abatibles..."
          />
        </div>

        {/* Precio Base e Imagen */}
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
              URL de Imagen
            </label>
            <input
              type="text"
              className="input-field"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/images/cama-cuna-plus.jpg"
            />
          </div>
        </div>

        {/* Galería rápida de imágenes prediseñadas */}
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            O selecciona una imagen de estudio disponible:
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

        {/* Gestión de Tipos (Sencilla, Semidoble, etc.) */}
        <div className="variant-manager-box">
          <div className="variant-manager-header">
            <span className="variant-manager-title">
              Opciones de "Tipo" (Medidas o Variaciones)
            </span>
            <button
              type="button"
              onClick={handleAddType}
              className="variant-add-btn"
            >
              <Plus size={16} /> Agregar tipo
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
                  placeholder="Ej: Sencilla"
                  style={{ flex: 2 }}
                />
                <div style={{ flex: 1.5, display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Gestión de Adicionales (Solita, con colchón, etc.) */}
        <div className="variant-manager-box">
          <div className="variant-manager-header">
            <span className="variant-manager-title">
              Opciones de "Adicionales" (Accesorios, Colchón, Lencería)
            </span>
            <button
              type="button"
              onClick={handleAddAdditional}
              className="variant-add-btn"
            >
              <Plus size={16} /> Agregar adicional
            </button>
          </div>

          <div className="variant-rows-list">
            {additionals.map((add, idx) => (
              <div key={idx} className="variant-row">
                <input
                  type="text"
                  className="input-field"
                  value={add.name}
                  onChange={(e) => handleUpdateAdditional(idx, 'name', e.target.value)}
                  placeholder="Ej: Con colchón"
                  style={{ flex: 2 }}
                />
                <div style={{ flex: 1.5, display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                {additionals.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAdditional(idx)}
                    className="variant-delete-btn"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

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
