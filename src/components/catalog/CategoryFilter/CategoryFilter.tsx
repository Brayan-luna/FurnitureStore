import React from 'react';
import { useProducts } from '../../../context/ProductContext';
import { Sparkles, Cloud, Crown, Leaf, Gem, Tag, LucideIcon } from 'lucide-react';
import './CategoryFilter.css';

const iconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  cloud: Cloud,
  crown: Crown,
  leaf: Leaf,
  gem: Gem,
  tag: Tag
};

export default function CategoryFilter() {
  const { categories, selectedCategoryId, setSelectedCategoryId, products } = useProducts();

  return (
    <section className="category-filter-section" id="catalogo">
      <div className="category-tabs">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || Tag;
          const isActive = selectedCategoryId === cat.id;
          const count = cat.id === 'todas'
            ? products.length
            : products.filter((p) => p.categoryId === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              className={`category-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedCategoryId(cat.id)}
            >
              <Icon size={16} color={isActive ? '#FFF' : cat.color} />
              <span>{cat.name}</span>
              <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>({count})</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
