import React from 'react';
import ProductCard from '../ProductCard';
import { useProducts } from '../../../context/ProductContext';
import { PackageOpen } from 'lucide-react';
import './ProductGrid.css';

export default function ProductGrid() {
  const { filteredProducts } = useProducts();

  if (filteredProducts.length === 0) {
    return (
      <div className="empty-products-state">
        <PackageOpen size={48} className="empty-products-icon" />
        <h3>No se encontraron productos en esta categoría</h3>
        <p>Pronto agregaremos nuevas opciones o prueba seleccionando otra categoría.</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
