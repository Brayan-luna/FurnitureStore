import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useProducts } from '../../../context/ProductContext';
import { AddonItem } from '../../../types';
import { formatPrice } from '../../../utils/formatters';
import AddonFormModal from '../AddonFormModal';
import './AddonManager.css';

export default function AddonManager() {
  const { addons, deleteAddon, updateAddon } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<AddonItem | null>(null);

  const handleOpenCreate = () => {
    setEditingAddon(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addon: AddonItem) => {
    setEditingAddon(addon);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el adicional "${name}"?`)) {
      deleteAddon(id);
    }
  };

  const handleToggleActive = (addon: AddonItem) => {
    const isCurrentlyActive = addon.active !== false;
    updateAddon(addon.id, { active: !isCurrentlyActive });
  };

  return (
    <div className="addon-manager-root">
      {/* Barra de cabecera */}
      <div className="addon-manager-top">
        <div className="addon-manager-heading">
          <h3 className="addon-manager-title">Accesorios & Adicionales</h3>
          <p className="addon-manager-subtitle">
            Complementos independientes que los clientes pueden agregar al pedido (Total: {addons.length})
          </p>
        </div>

        <button
          type="button"
          className="addon-manager-btn-new"
          onClick={handleOpenCreate}
        >
          <Plus size={16} />
          <span>Nuevo Adicional</span>
        </button>
      </div>

      {/* Lista de adicionales */}
      {addons.length === 0 ? (
        <div className="addon-manager-empty">
          <Sparkles size={36} className="addon-manager-empty-icon" />
          <h4>No hay adicionales creados</h4>
          <p>Crea camas auxiliares, cajones o piezas extras para que tus clientes puedan seleccionarlas.</p>
          <button
            type="button"
            className="addon-manager-btn-new"
            onClick={handleOpenCreate}
            style={{ marginTop: '14px' }}
          >
            <Plus size={16} />
            <span>Crear Primer Adicional</span>
          </button>
        </div>
      ) : (
        <div className="addon-manager-list">
          {addons.map((addon) => {
            const isActive = addon.active !== false;

            return (
              <div
                key={addon.id}
                className={`addon-manager-item ${!isActive ? 'is-inactive' : ''}`}
              >
                {/* Miniatura / Icono */}
                <div className="addon-manager-thumb-container">
                  {addon.imageUrl ? (
                    <img
                      src={addon.imageUrl}
                      alt={addon.name}
                      className="addon-manager-thumb"
                    />
                  ) : (
                    <div className="addon-manager-thumb-placeholder">
                      <Sparkles size={22} />
                    </div>
                  )}
                </div>

                {/* Información básica */}
                <div className="addon-manager-info">
                  <div className="addon-manager-name-row">
                    <h4 className="addon-manager-name">{addon.name}</h4>
                    <span
                      className={`addon-manager-status-badge ${isActive ? 'badge-active' : 'badge-inactive'}`}
                    >
                      {isActive ? 'Visible' : 'Oculto'}
                    </span>
                  </div>
                  {addon.description && (
                    <p className="addon-manager-desc">{addon.description}</p>
                  )}
                </div>

                {/* Columna de Precio */}
                <div className="addon-manager-price-col">
                  <span className="addon-manager-price-label">PRECIO</span>
                  <strong className="addon-manager-price-val">
                    {formatPrice(addon.price)}
                  </strong>
                </div>

                {/* Acciones */}
                <div className="addon-manager-actions">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(addon)}
                    className="btn-toggle-addon"
                    title={isActive ? 'Ocultar en tienda' : 'Mostrar en tienda'}
                  >
                    {isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(addon)}
                    className="btn-edit-addon"
                  >
                    <Edit2 size={14} />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(addon.id, addon.name)}
                    className="btn-delete-addon"
                    title="Eliminar adicional"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de formulario */}
      <AddonFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialAddon={editingAddon}
      />
    </div>
  );
}
