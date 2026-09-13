import React, { useState, useEffect, FormEvent } from 'react';
import Modal from '../../common/Modal';
import ImageUploader from '../../common/ImageUploader';
import { useProducts } from '../../../context/ProductContext';
import { AddonItem } from '../../../types';
import './AddonFormModal.css';

export interface AddonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAddon?: AddonItem | null;
}

export default function AddonFormModal({
  isOpen,
  onClose,
  initialAddon = null
}: AddonFormModalProps) {
  const { addAddon, updateAddon } = useProducts();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(500000);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (initialAddon) {
      setName(initialAddon.name || '');
      setPrice(initialAddon.price || 0);
      setDescription(initialAddon.description || '');
      setImageUrl(initialAddon.imageUrl || '');
      setActive(initialAddon.active !== false);
    } else {
      setName('');
      setPrice(500000);
      setDescription('');
      setImageUrl('');
      setActive(true);
    }
  }, [initialAddon, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Por favor ingresa un nombre para el adicional.');
      return;
    }

    if (price < 0) {
      alert('El precio no puede ser negativo.');
      return;
    }

    if (initialAddon) {
      updateAddon(initialAddon.id, {
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
        active
      });
    } else {
      addAddon({
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
        active
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialAddon ? 'Editar Adicional' : 'Nuevo Adicional'}
      maxWidth="560px"
    >
      <form onSubmit={handleSubmit} className="addon-form-modal">
        {/* Nombre del Adicional */}
        <div className="addon-form-group">
          <label className="addon-form-label">
            Nombre del Adicional *
          </label>
          <input
            type="text"
            required
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Cama auxiliar Plus (sin colchón)"
          />
        </div>

        {/* Precio */}
        <div className="addon-form-group">
          <label className="addon-form-label">
            Precio ($ COP) *
          </label>
          <input
            type="number"
            required
            min={0}
            step={10000}
            className="input-field"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="500000"
          />
        </div>

        {/* Descripción */}
        <div className="addon-form-group">
          <label className="addon-form-label">
            Descripción o Detalles
          </label>
          <textarea
            rows={3}
            className="input-field"
            style={{ resize: 'vertical' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Adiciónala a cualquier diseño Plus. No incluye colchón."
          />
        </div>

        {/* Imagen opcional */}
        <div className="addon-form-group">
          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            label="Imagen o Foto del Accesorio (Opcional)"
            placeholder="Sube una foto o pega una URL si deseas ilustrarlo..."
            previewHeight={140}
          />
        </div>

        {/* Estado activo */}
        <div className="addon-form-checkbox-group">
          <label className="addon-form-checkbox-label">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="addon-form-checkbox"
            />
            <span>Mostrar en la tienda pública</span>
          </label>
          <span className="addon-form-hint">
            Si se desactiva, el adicional no será visible para los clientes.
          </span>
        </div>

        {/* Botones de acción */}
        <div className="addon-form-footer">
          <button
            type="button"
            onClick={onClose}
            className="addon-form-btn-cancel"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="addon-form-btn-save"
          >
            {initialAddon ? 'Guardar Cambios' : 'Crear Adicional'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
