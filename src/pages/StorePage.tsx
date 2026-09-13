import React from 'react';
import Header from '../components/layout/Header';
import Hero from '../components/layout/Hero';
import CategoryFilter from '../components/catalog/CategoryFilter';
import ProductGrid from '../components/catalog/ProductGrid';
import AddonSection from '../components/catalog/AddonSection';
import CartDrawer from '../components/cart/CartDrawer';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';
import { CheckCircle2, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export default function StorePage() {
  const { lastAddedItem, openCart } = useCart();

  return (
    <div className="store-page-root">
      <Header />
      <Hero />

      <main className="app-container">
        {/* Sección explicativa "¿Cómo empezar?" referenciada en el menú */}
        <section id="como-empezar" style={{ margin: '10px 0 36px 0' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              padding: '24px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-whatsapp-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-whatsapp)',
                  flexShrink: 0
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>1. Configura a tu gusto</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-body)' }}>
                  Selecciona el tamaño (sencilla, semidoble) y los adicionales como colchón o lencería.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-accent-pink-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent-pink)',
                  flexShrink: 0
                }}
              >
                <Truck size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>2. Envíos y Fabricación</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-body)' }}>
                  Somos fabricantes directos. Envíos protegidos a nivel nacional con tiempos de entrega claros.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563EB',
                  flexShrink: 0
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>3. Asesoría Directa</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-body)' }}>
                  Atención personalizada vía WhatsApp para resolver dudas sobre maderas, telas y medidas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Barra de Filtros por Categoría */}
        <CategoryFilter />

        {/* Grilla de Productos */}
        <ProductGrid />

        {/* Sección de Adicionales */}
        <AddonSection />
      </main>

      <Footer />

      {/* Drawer del carrito */}
      <CartDrawer />

      {/* Notificación Toast reactiva cuando se añade un producto */}
      {lastAddedItem && (
        <div className="toast-notification">
          <CheckCircle2 size={22} color="#22C55E" />
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>¡Agregado a tu pedido!</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>
              {lastAddedItem.name} ({lastAddedItem.typeName || 'Sencilla'}) • {formatPrice(lastAddedItem.price)}
            </div>
          </div>
          <button
            onClick={openCart}
            style={{
              marginLeft: '8px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#FFF',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Ver
          </button>
        </div>
      )}
    </div>
  );
}
