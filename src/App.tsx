import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BusinessProvider } from './context/BusinessContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import StorePage from './pages/StorePage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <AuthProvider>
      <BusinessProvider>
        <ProductProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                {/* Ruta Pública para los Clientes (Sin login) */}
                <Route path="/" element={<StorePage />} />

                {/* Ruta Privada para Administrador (Protegida con login) */}
                <Route path="/admin" element={<AdminPage />} />

                {/* Redirección por defecto */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </ProductProvider>
      </BusinessProvider>
    </AuthProvider>
  );
}
