import React from 'react';
import { Sparkles } from 'lucide-react';
import { useProducts } from '../../../context/ProductContext';
import AddonCard from '../AddonCard';
import './AddonSection.css';

export default function AddonSection() {
  const { addons } = useProducts();

  const activeAddons = addons.filter((a) => a.active !== false);

  if (activeAddons.length === 0) {
    return null;
  }

  return (
    <section id="adicionales" className="addon-section">
      <div className="addon-section-header">
        <div className="addon-section-tag">
          <Sparkles size={16} />
          <span>Complementos & Accesorios</span>
        </div>
        <h2 className="addon-section-title">Adicionales para tu Cama</h2>
        <p className="addon-section-subtitle">
          Agrega camas auxiliares, cajones o piezas complementarias para hacer tu espacio aún más práctico.
        </p>
      </div>

      <div className="addon-grid">
        {activeAddons.map((addon) => (
          <AddonCard key={addon.id} addon={addon} />
        ))}
      </div>
    </section>
  );
}
