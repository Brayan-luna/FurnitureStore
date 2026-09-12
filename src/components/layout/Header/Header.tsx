import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useBusiness } from '../../../context/BusinessContext';
import './Header.css';

export default function Header() {
  const { totalItems, openCart } = useCart();
  const { business } = useBusiness();

  return (
    <header className="site-header">
      <div className="app-container">
        <div className="nav-wrapper">
          {/* Logo y Branding */}
          <a href="/" className="brand-section">
            <div className="brand-logo-badge">
              {business.logoText ? (
                <span>{business.logoText}</span>
              ) : (
                <span>Kids</span>
              )}
            </div>
            <div className="brand-text">
              <span className="brand-name">{business.name}</span>
              <span className="brand-slogan">{business.slogan}</span>
            </div>
          </a>

          {/* Menú de navegación central según Imagen 2 */}
          <nav className="nav-menu">
            <a href="#como-empezar" className="nav-link">¿Cómo empezar?</a>
            <a href="#catalogo" className="nav-link">Catálogo</a>
            <a href="#adicionales" className="nav-link">Adicionales</a>
            <a href="#contacto" className="nav-link">Contacto</a>
          </nav>

          {/* Acciones: Botón Mi Pedido */}
          <div className="nav-actions">
            <button
              type="button"
              className="btn-cart-pill"
              onClick={openCart}
              aria-label={`Ver pedido con ${totalItems} productos`}
            >
              <ShoppingBag size={18} />
              <span>Mi Pedido</span>
              <span className="cart-count-badge">{totalItems}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
