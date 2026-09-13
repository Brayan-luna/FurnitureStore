import React, { useState } from 'react';
import { useProducts } from '../../../context/ProductContext';
import { Plus, Edit2, Trash2, Layers, CheckSquare } from 'lucide-react';
import ProductFormModal from '../ProductFormModal';
import { formatPrice } from '../../../utils/formatters';
import { Product } from '../../../types';
import './ProductManager.css';

export default function ProductManager() {
  const { products, deleteProduct, categories } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${name}"?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div>
      {/* Barra de acción superior */}
      <div className="product-manager-top">
        <div className="product-manager-heading">
          <h3 className="product-manager-title">Catálogo de Productos</h3>
          <p className="product-manager-subtitle">
            Total de productos activos: {products.length}
          </p>
        </div>

        <button
          type="button"
          className="product-manager-btn-new"
          onClick={handleOpenCreate}
        >
          <Plus size={15} />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Lista de productos */}
      <div className="product-manager-list">
        {products.map((product) => {
          const cat = categories.find((c) => c.id === product.categoryId) || { name: 'General', color: '#666' };

          return (
            <div
              key={product.id}
              className="product-manager-item"
            >
              {/* Imagen miniatura */}
              <img
                src={product.imageUrl || '/images/cama-cuna-plus.jpg'}
                alt={product.name}
                className="product-manager-thumb"
              />

              {/* Información básica */}
              <div className="product-manager-info">
                <div className="product-manager-name-row">
                  <h4 className="product-manager-name">{product.name}</h4>
                  <span
                    className="product-manager-cat-badge"
                    style={{
                      backgroundColor: `${cat.color}22`,
                      color: cat.color
                    }}
                  >
                    {cat.name}
                  </span>
                </div>
                <p className="product-manager-desc">
                  {product.description}
                </p>
              </div>

              {/* Variantes configuradas */}
              <div className="product-manager-variants">
                <div className="product-manager-variant-stat">
                  <Layers size={14} />
                  <span>{product.types?.length || 0} tipos</span>
                </div>
                <div className="product-manager-variant-stat">
                  <CheckSquare size={14} />
                  <span>{product.additionals?.length || 0} adicionales</span>
                </div>
              </div>

              {/* Precio base */}
              <div className="product-manager-price-col">
                <span className="product-manager-price-label">PRECIO BASE</span>
                <strong className="product-manager-price-val">
                  {formatPrice(product.basePrice)}
                </strong>
              </div>

              {/* Botones de acción */}
              <div className="product-manager-actions">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(product)}
                  className="btn-edit-product"
                >
                  <Edit2 size={14} />
                  <span>Editar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(product.id, product.name)}
                  className="btn-delete-product"
                  title="Eliminar producto"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de formulario */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialProduct={editingProduct}
      />
    </div>
  );
}
