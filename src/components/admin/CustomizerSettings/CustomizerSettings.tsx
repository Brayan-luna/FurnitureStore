import React, { useState } from 'react';
import { Sparkles, Save, RotateCcw, Plus, Trash2, Check, Eye, EyeOff, Layers, ShieldCheck, Ruler, Bed, Palette } from 'lucide-react';
import { useProducts } from '../../../context/ProductContext';
import { CustomizerConfig, CustomizerAddonOption, CustomizerMattressOption, CustomizerSizeOption, CustomizerColorOption } from '../../../types';
import { formatPrice } from '../../../utils/formatters';
import './CustomizerSettings.css';

export default function CustomizerSettings() {
  const { customizerConfig, updateCustomizerConfig, resetCustomizerConfig } = useProducts();

  // Estado local editable para guardar cuando el usuario haga clic en Guardar
  const [config, setConfig] = useState<CustomizerConfig>(() => JSON.parse(JSON.stringify(customizerConfig)));
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Estados para nuevo adicional rápido
  const [newAddonName, setNewAddonName] = useState('');
  const [newAddonPrice, setNewAddonPrice] = useState('');
  const [newAddonDesc, setNewAddonDesc] = useState('');
  const [showAddAddonForm, setShowAddAddonForm] = useState(false);

  // Estados para nuevo colchón
  const [newMattressName, setNewMattressName] = useState('');
  const [newMattressPrice, setNewMattressPrice] = useState('');
  const [newMattressSize, setNewMattressSize] = useState('all');
  const [showAddMattressForm, setShowAddMattressForm] = useState(false);

  // Estados para nuevo color
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#FFFFFF');
  const [showAddColorForm, setShowAddColorForm] = useState(false);

  // Guardar configuración global
  const handleSaveAll = () => {
    updateCustomizerConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Restaurar valores por defecto
  const handleReset = () => {
    if (window.confirm('¿Restablecer todas las opciones del personalizador a sus valores predeterminados?')) {
      resetCustomizerConfig();
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  // Handlers para Adicionales
  const handleAddonChangePrice = (addonId: string, newPrice: number) => {
    setConfig((prev) => ({
      ...prev,
      addons: prev.addons.map((a) => (a.id === addonId ? { ...a, price: newPrice } : a))
    }));
  };

  const handleAddonChangeName = (addonId: string, newName: string) => {
    setConfig((prev) => ({
      ...prev,
      addons: prev.addons.map((a) => (a.id === addonId ? { ...a, name: newName } : a))
    }));
  };

  const handleAddonToggleActive = (addonId: string) => {
    setConfig((prev) => ({
      ...prev,
      addons: prev.addons.map((a) => (a.id === addonId ? { ...a, active: a.active === false ? true : false } : a))
    }));
  };

  const handleAddonDelete = (addonId: string) => {
    if (window.confirm('¿Eliminar este adicional?')) {
      setConfig((prev) => ({
        ...prev,
        addons: prev.addons.filter((a) => a.id !== addonId)
      }));
    }
  };

  const handleAddNewAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddonName.trim()) return;

    const newAddon: CustomizerAddonOption = {
      id: `addon-${Date.now()}`,
      name: newAddonName.trim(),
      price: Number(newAddonPrice) || 0,
      description: newAddonDesc.trim(),
      active: true
    };

    setConfig((prev) => ({
      ...prev,
      addons: [...prev.addons, newAddon]
    }));

    setNewAddonName('');
    setNewAddonPrice('');
    setNewAddonDesc('');
    setShowAddAddonForm(false);
  };

  // Handlers para Colchones
  const handleMattressChangePrice = (mId: string, newPrice: number) => {
    setConfig((prev) => ({
      ...prev,
      mattresses: prev.mattresses.map((m) => (m.id === mId ? { ...m, price: newPrice } : m))
    }));
  };

  const handleMattressToggleActive = (mId: string) => {
    setConfig((prev) => ({
      ...prev,
      mattresses: prev.mattresses.map((m) => (m.id === mId ? { ...m, active: m.active === false ? true : false } : m))
    }));
  };

  const handleAddNewMattress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMattressName.trim()) return;

    const newM: CustomizerMattressOption = {
      id: `mattress-${Date.now()}`,
      name: newMattressName.trim(),
      price: Number(newMattressPrice) || 0,
      compatibleSizes: newMattressSize === 'all' ? ['all'] : [newMattressSize],
      active: true
    };

    setConfig((prev) => ({
      ...prev,
      mattresses: [...prev.mattresses, newM]
    }));

    setNewMattressName('');
    setNewMattressPrice('');
    setShowAddMattressForm(false);
  };

  // Handlers para Medidas
  const handleSizeChangePrice = (sizeId: string, newPrice: number) => {
    setConfig((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s) => (s.id === sizeId ? { ...s, priceModifier: newPrice } : s))
    }));
  };

  // Handlers para Colores
  const handleAddNewColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColorName.trim()) return;

    const newC: CustomizerColorOption = {
      id: `color-${Date.now()}`,
      name: newColorName.trim(),
      hex: newColorHex,
      active: true
    };

    setConfig((prev) => ({
      ...prev,
      colors: [...prev.colors, newC]
    }));

    setNewColorName('');
    setNewColorHex('#FFFFFF');
    setShowAddColorForm(false);
  };

  const handleColorDelete = (colorId: string) => {
    setConfig((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c.id !== colorId)
    }));
  };

  return (
    <div className="customizer-settings-root">
      {/* Barra de cabecera con acciones principales */}
      <div className="customizer-settings-top">
        <div>
          <h3 className="customizer-settings-title">
            <Sparkles size={20} color="var(--color-accent-pink)" />
            <span>Configuración del Personalizador ("Ármala como quieras")</span>
          </h3>
          <p className="customizer-settings-desc">
            Edita los incrementos de las líneas PLUS/PREMIUM, precios de medidas, colchones, colores y los adicionales de mueble.
          </p>
        </div>

        <div className="customizer-settings-top-btns">
          <button type="button" className="btn-save-settings" onClick={handleSaveAll}>
            <Save size={16} />
            <span>Guardar Cambios</span>
          </button>
          <button type="button" className="btn-reset-settings" onClick={handleReset} title="Restablecer valores predeterminados">
            <RotateCcw size={16} />
            <span>Restablecer</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="settings-alert-success">
          <Check size={18} />
          <span>¡Cambios guardados con éxito! Se aplicaron al personalizador de la tienda.</span>
        </div>
      )}

      {/* 1. SECCIÓN: GAMA PLUS / PREMIUM */}
      <div className="settings-panel-box">
        <div className="panel-box-header">
          <ShieldCheck size={18} color="var(--color-primary)" />
          <h4>1. Líneas de Fabricación (PLUS y PREMIUM)</h4>
        </div>
        <div className="panel-box-grid-2">
          {/* PLUS */}
          <div className="panel-subcard">
            <div className="subcard-title-row">
              <span className="badge-plus">BASE</span>
              <strong>Línea PLUS</strong>
            </div>
            <div className="subcard-field">
              <label>Madera:</label>
              <input
                type="text"
                value={config.quality.plus.wood}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    quality: { ...prev.quality, plus: { ...prev.quality.plus, wood: e.target.value } }
                  }))
                }
              />
            </div>
            <div className="subcard-field">
              <label>Pintura / Acabado:</label>
              <input
                type="text"
                value={config.quality.plus.finish}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    quality: { ...prev.quality, plus: { ...prev.quality.plus, finish: e.target.value } }
                  }))
                }
              />
            </div>
            <div className="subcard-field">
              <label>Incremento de precio:</label>
              <input type="text" value="$0 (Incluido en precio base)" disabled />
            </div>
          </div>

          {/* PREMIUM */}
          <div className="panel-subcard highlight-premium">
            <div className="subcard-title-row">
              <span className="badge-premium">ALTA GAMA</span>
              <strong>Línea PREMIUM</strong>
            </div>
            <div className="subcard-field">
              <label>Madera:</label>
              <input
                type="text"
                value={config.quality.premium.wood}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    quality: { ...prev.quality, premium: { ...prev.quality.premium, wood: e.target.value } }
                  }))
                }
              />
            </div>
            <div className="subcard-field">
              <label>Pintura / Acabado:</label>
              <input
                type="text"
                value={config.quality.premium.finish}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    quality: { ...prev.quality, premium: { ...prev.quality.premium, finish: e.target.value } }
                  }))
                }
              />
            </div>
            <div className="subcard-field">
              <label>Incremento de precio sobre PLUS ($):</label>
              <input
                type="number"
                step="10000"
                value={config.quality.premium.priceModifier}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    quality: {
                      ...prev.quality,
                      premium: { ...prev.quality.premium, priceModifier: Number(e.target.value) || 0 }
                    }
                  }))
                }
              />
              <span className="field-hint">Actual: +{formatPrice(config.quality.premium.priceModifier)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECCIÓN: MEDIDAS */}
      <div className="settings-panel-box">
        <div className="panel-box-header">
          <Ruler size={18} color="var(--color-primary)" />
          <h4>2. Precios por Medidas de Cama</h4>
        </div>
        <div className="sizes-table-list">
          {config.sizes.map((size) => (
            <div key={size.id} className="size-row-item">
              <div className="size-row-name">
                <strong>{size.name}</strong>
                <span>({size.label})</span>
              </div>
              <div className="size-row-price-input">
                <label>Incremento ($):</label>
                <input
                  type="number"
                  step="10000"
                  value={size.priceModifier}
                  onChange={(e) => handleSizeChangePrice(size.id, Number(e.target.value) || 0)}
                />
                <span className="price-tag-preview">
                  {size.priceModifier === 0 ? 'Incluida ($0)' : `+${formatPrice(size.priceModifier)}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SECCIÓN: COLCHONES */}
      <div className="settings-panel-box">
        <div className="panel-box-header space-between">
          <div className="header-icon-title">
            <Bed size={18} color="var(--color-primary)" />
            <h4>3. Opciones de Colchones y Reglas de Medidas</h4>
          </div>
          <button
            type="button"
            className="btn-add-item-small"
            onClick={() => setShowAddMattressForm(!showAddMattressForm)}
          >
            <Plus size={14} />
            <span>Agregar Colchón</span>
          </button>
        </div>

        {showAddMattressForm && (
          <form className="mini-create-form" onSubmit={handleAddNewMattress}>
            <div className="form-grid-3">
              <input
                type="text"
                placeholder="Nombre del colchón (ej: Semi ortopédico 22 cm)"
                value={newMattressName}
                onChange={(e) => setNewMattressName(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Precio ($)"
                value={newMattressPrice}
                onChange={(e) => setNewMattressPrice(e.target.value)}
                required
              />
              <select value={newMattressSize} onChange={(e) => setNewMattressSize(e.target.value)}>
                <option value="all">Aplica para TODAS las medidas (como Croydon)</option>
                {config.sizes.map((s) => (
                  <option key={s.id} value={s.id}>
                    Solo para medida {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions-row">
              <button type="submit" className="btn-save-mini">
                Guardar Colchón
              </button>
              <button type="button" className="btn-cancel-mini" onClick={() => setShowAddMattressForm(false)}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="items-table-list">
          {config.mattresses.map((m) => {
            const isActive = m.active !== false;
            return (
              <div key={m.id} className={`item-row-card ${!isActive ? 'is-disabled-card' : ''}`}>
                <div className="item-card-info">
                  <strong>{m.name}</strong>
                  <span className="item-card-sub">
                    {m.compatibleSizes.includes('all')
                      ? '✨ Disponible para todas las medidas'
                      : `🔒 Medida específica: ${config.sizes.find((s) => m.compatibleSizes.includes(s.id))?.name || m.compatibleSizes.join(', ')}`}
                  </span>
                </div>
                <div className="item-card-price">
                  <label>Precio:</label>
                  <input
                    type="number"
                    step="10000"
                    value={m.price}
                    onChange={(e) => handleMattressChangePrice(m.id, Number(e.target.value) || 0)}
                  />
                  <strong>{formatPrice(m.price)}</strong>
                </div>
                <div className="item-card-actions">
                  <button
                    type="button"
                    className="btn-toggle-eye"
                    onClick={() => handleMattressToggleActive(m.id)}
                    title={isActive ? 'Ocultar en personalizador' : 'Mostrar en personalizador'}
                  >
                    {isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. SECCIÓN: ADICIONALES DEL MUEBLE (CARRO CAJÓN, ARNILLA, TAPIZADOS...) */}
      <div className="settings-panel-box">
        <div className="panel-box-header space-between">
          <div className="header-icon-title">
            <Layers size={18} color="var(--color-primary)" />
            <div>
              <h4>4. Adicionales & Mejoras del Mueble (Chips Multiselección)</h4>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Carro cajón, arnillas, camas auxiliares PLUS/PREMIUM, tapizados, luces LED, etc.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-add-item-small"
            onClick={() => setShowAddAddonForm(!showAddAddonForm)}
          >
            <Plus size={14} />
            <span>Nuevo Adicional</span>
          </button>
        </div>

        {showAddAddonForm && (
          <form className="mini-create-form" onSubmit={handleAddNewAddon}>
            <div className="form-grid-3">
              <input
                type="text"
                placeholder="Nombre del adicional (ej: Baranda adicional)"
                value={newAddonName}
                onChange={(e) => setNewAddonName(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Precio ($)"
                value={newAddonPrice}
                onChange={(e) => setNewAddonPrice(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Descripción corta (opcional)"
                value={newAddonDesc}
                onChange={(e) => setNewAddonDesc(e.target.value)}
              />
            </div>
            <div className="form-actions-row">
              <button type="submit" className="btn-save-mini">
                Guardar Adicional
              </button>
              <button type="button" className="btn-cancel-mini" onClick={() => setShowAddAddonForm(false)}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="addons-edit-grid">
          {config.addons.map((addon) => {
            const isActive = addon.active !== false;
            return (
              <div key={addon.id} className={`addon-edit-card ${!isActive ? 'is-disabled-card' : ''}`}>
                <div className="addon-card-top">
                  <input
                    type="text"
                    className="addon-name-input"
                    value={addon.name}
                    onChange={(e) => handleAddonChangeName(addon.id, e.target.value)}
                  />
                  <div className="addon-actions-mini">
                    <button
                      type="button"
                      onClick={() => handleAddonToggleActive(addon.id)}
                      title={isActive ? 'Ocultar en modal' : 'Mostrar en modal'}
                    >
                      {isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddonDelete(addon.id)}
                      title="Eliminar"
                      className="btn-trash"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="addon-card-bottom">
                  <label>Precio ($):</label>
                  <input
                    type="number"
                    step="10000"
                    value={addon.price}
                    onChange={(e) => handleAddonChangePrice(addon.id, Number(e.target.value) || 0)}
                  />
                  <span className="addon-price-formatted">{formatPrice(addon.price)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. SECCIÓN: COLORES */}
      <div className="settings-panel-box">
        <div className="panel-box-header space-between">
          <div className="header-icon-title">
            <Palette size={18} color="var(--color-primary)" />
            <h4>5. Paleta de Colores</h4>
          </div>
          <button
            type="button"
            className="btn-add-item-small"
            onClick={() => setShowAddColorForm(!showAddColorForm)}
          >
            <Plus size={14} />
            <span>Agregar Color</span>
          </button>
        </div>

        {showAddColorForm && (
          <form className="mini-create-form" onSubmit={handleAddNewColor}>
            <div className="form-grid-3">
              <input
                type="text"
                placeholder="Nombre del color (ej: Verde Menta)"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                required
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  style={{ width: '45px', height: '38px', padding: 0, cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  placeholder="#HEX"
                />
              </div>
            </div>
            <div className="form-actions-row">
              <button type="submit" className="btn-save-mini">
                Guardar Color
              </button>
              <button type="button" className="btn-cancel-mini" onClick={() => setShowAddColorForm(false)}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="colors-edit-list">
          {config.colors.map((color) => (
            <div key={color.id} className="color-chip-row">
              <span className="swatch-sample" style={{ background: color.hex }} />
              <strong className="color-chip-name">{color.name}</strong>
              <button
                type="button"
                className="btn-trash"
                onClick={() => handleColorDelete(color.id)}
                title="Eliminar color"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
