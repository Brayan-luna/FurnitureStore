import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { AddonItem } from '../../../types';
import { formatPrice } from '../../../utils/formatters';
import { useCart } from '../../../context/CartContext';
import './AddonCard.css';

export interface AddonCardProps {
  addon: AddonItem;
}

export default function AddonCard({ addon }: AddonCardProps) {
  const { addAddonToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addAddonToCart(addon, 1);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1800);
  };

  return (
    <div className="addon-card">
      {addon.imageUrl && (
        <div className="addon-image-container">
          <img src={addon.imageUrl} alt={addon.name} className="addon-image" />
        </div>
      )}

      <div className="addon-content">
        <div className="addon-header">
          <h3 className="addon-title">{addon.name}</h3>
          <span className="addon-price">{formatPrice(addon.price)}</span>
        </div>

        {addon.description && (
          <p className="addon-description">{addon.description}</p>
        )}

        <div className="addon-actions">
          <button
            type="button"
            className={`addon-add-button ${justAdded ? 'is-added' : ''}`}
            onClick={handleAdd}
            aria-label={`Agregar ${addon.name} al pedido`}
          >
            {justAdded ? (
              <>
                <Check size={18} className="addon-check-icon" />
                <span>¡Agregado!</span>
              </>
            ) : (
              <>
                <span className="addon-plus-symbol">+</span>
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
