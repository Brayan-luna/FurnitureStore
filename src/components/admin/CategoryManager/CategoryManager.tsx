import React, { useState, FormEvent } from 'react';
import { useProducts } from '../../../context/ProductContext';
import { Plus, Trash2, Cloud, Crown, Leaf, Gem, Sparkles, Tag, LucideIcon } from 'lucide-react';
import './CategoryManager.css';

interface AvailableIcon {
  id: string;
  label: string;
  icon: LucideIcon;
}

const AVAILABLE_ICONS: AvailableIcon[] = [
  { id: 'cloud', label: 'Nube', icon: Cloud },
  { id: 'crown', label: 'Corona', icon: Crown },
  { id: 'leaf', label: 'Hoja / Natural', icon: Leaf },
  { id: 'gem', label: 'Gema / Tapizada', icon: Gem },
  { id: 'sparkles', label: 'Estrellas', icon: Sparkles },
  { id: 'tag', label: 'Etiqueta', icon: Tag }
];

interface PresetColor {
  hex: string;
  label: string;
  bg: string;
}

const PRESET_COLORS: PresetColor[] = [
  { hex: '#3B82F6', label: 'Azul', bg: 'rgba(224, 242, 254, 0.9)' },
  { hex: '#F59E0B', label: 'Ámbar', bg: 'rgba(254, 243, 199, 0.9)' },
  { hex: '#10B981', label: 'Verde', bg: 'rgba(209, 250, 229, 0.9)' },
  { hex: '#EC4899', label: 'Rosa', bg: 'rgba(252, 231, 243, 0.9)' },
  { hex: '#8B5CF6', label: 'Púrpura', bg: 'rgba(243, 232, 255, 0.9)' },
  { hex: '#64748B', label: 'Gris', bg: 'rgba(241, 245, 249, 0.9)' }
];

export default function CategoryManager() {
  const { categories, addCategory, deleteCategory } = useProducts();

  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('cloud');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].hex);
  const [selectedBg, setSelectedBg] = useState(PRESET_COLORS[0].bg);

  const handleColorPick = (preset: PresetColor) => {
    setSelectedColor(preset.hex);
    setSelectedBg(preset.bg);
  };

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = name.trim().toLowerCase().replace(/\s+/g, '-');
    addCategory({
      id,
      name: name.trim(),
      icon: selectedIcon,
      color: selectedColor,
      bg: selectedBg
    });

    setName('');
  };

  return (
    <div className="category-manager-container">
      {/* Formulario de nueva categoría */}
      <div className="category-manager-form-box">
        <h3 className="category-manager-form-title">Crear Nueva Categoría</h3>
        <form onSubmit={handleAdd} className="category-manager-form">
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px' }}>
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Montessori, Rústica, Edición Limitada..."
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '8px' }}>
              Seleccionar Icono
            </label>
            <div className="category-icons-grid">
              {AVAILABLE_ICONS.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedIcon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIcon(item.id)}
                    className={`category-icon-btn ${isSelected ? 'active' : ''}`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '8px' }}>
              Seleccionar Color de Distintivo
            </label>
            <div className="category-colors-grid">
              {PRESET_COLORS.map((preset) => {
                const isSelected = selectedColor === preset.hex;
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => handleColorPick(preset)}
                    className={`category-color-btn ${isSelected ? 'active' : ''}`}
                    style={{
                      background: preset.bg,
                      color: preset.hex
                    }}
                  >
                    <span
                      className="category-color-dot"
                      style={{ background: preset.hex }}
                    />
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="btn-add-to-cart"
              style={{ width: 'auto', padding: '10px 24px' }}
            >
              <Plus size={16} />
              <span>Guardar Categoría</span>
            </button>
          </div>
        </form>
      </div>

      {/* Lista de categorías actuales */}
      <div>
        <h4 style={{ fontSize: '1.05rem', marginBottom: '14px' }}>Categorías Existentes</h4>
        <div className="category-list-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-item-card"
            >
              <div className="category-item-info">
                <span
                  className="category-item-dot"
                  style={{
                    backgroundColor: cat.color || '#3B82F6'
                  }}
                />
                <span className="category-item-name">{cat.name}</span>
              </div>

              {cat.id !== 'todas' && (
                <button
                  type="button"
                  onClick={() => deleteCategory(cat.id)}
                  className="category-delete-btn"
                  title="Eliminar categoría"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
