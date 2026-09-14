import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Tag, Layers, Building2, Download, LogOut, ExternalLink, LucideIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../context/BusinessContext';
import logoImg from '../assets/logo.png';
import AdminLogin from '../components/admin/AdminLogin';
import ProductManager from '../components/admin/ProductManager';
import CategoryManager from '../components/admin/CategoryManager';
import AddonManager from '../components/admin/AddonManager';
import CustomizerSettings from '../components/admin/CustomizerSettings';
import BusinessSettings from '../components/admin/BusinessSettings';
import BackupRestore from '../components/admin/BackupRestore';

interface NavTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

export default function AdminPage() {
  const { isAuthenticated, logout } = useAuth();
  const { business } = useBusiness();
  const [activeTab, setActiveTab] = useState<string>('products');

  const currentLogo = business.logoUrl || logoImg;

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const navTabs: NavTab[] = [
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'customizer', label: 'Personalizador', icon: Sparkles },
    { id: 'categories', label: 'Categorías', icon: Tag },
    { id: 'addons', label: 'Adicionales Sueltos', icon: Layers },
    { id: 'business', label: 'Identidad & WhatsApp', icon: Building2 },
    { id: 'backup', label: 'Respaldo JSON', icon: Download },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
      {/* Barra superior de administración */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '14px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px',
                overflow: 'hidden'
              }}
            >
              <img src={currentLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.05rem' }}>Administración - {business.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Panel de Control y Catálogo</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '9999px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#FAF8F5',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--text-dark)',
                textDecoration: 'none'
              }}
            >
              <ExternalLink size={15} />
              <span>Ver Tienda Pública</span>
            </Link>

            <button
              type="button"
              onClick={logout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '9999px',
                border: '1px solid #FCA5A5',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <LogOut size={15} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido con pestañas */}
      <main className="app-container" style={{ padding: '32px 20px', flex: 1 }}>
        {/* Pestañas de navegación */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '28px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '12px',
            overflowX: 'auto'
          }}
        >
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--color-primary)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--text-body)',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 12px rgba(49, 46, 74, 0.2)' : 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Vista según pestaña activa */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {activeTab === 'products' && <ProductManager />}
          {activeTab === 'customizer' && <CustomizerSettings />}
          {activeTab === 'categories' && <CategoryManager />}
          {activeTab === 'addons' && <AddonManager />}
          {activeTab === 'business' && <BusinessSettings />}
          {activeTab === 'backup' && <BackupRestore />}
        </div>
      </main>
    </div>
  );
}
