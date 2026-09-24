import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useBusiness } from '../../../context/BusinessContext';
import logoImg from '../../../assets/logo.png';
import './AdminLogin.css';

export default function AdminLogin() {
  const { login } = useAuth();
  const { business } = useBusiness();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const currentLogo = business.logoUrl || logoImg;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(username, password);
      if (!res.success) {
        setError(res.error || 'Credenciales inválidas');
      }
    } catch {
      setError('Error al procesar el inicio de sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-badge" style={{ backgroundColor: '#FFFFFF', padding: '4px', border: '1px solid var(--border-subtle)' }}>
            <img src={currentLogo} alt={business.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h2 className="admin-login-title">
            Panel Administrativo
          </h2>
          <p className="admin-login-subtitle">
            Gestión de productos e identidad para <strong>{business.name}</strong>
          </p>
        </div>

        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div>
            <label className="admin-login-label">
              Usuario
            </label>
            <div className="admin-login-input-wrap">
              <input
                type="text"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                autoComplete="username"
                required
              />
              <User size={18} className="admin-login-input-icon" />
            </div>
          </div>

          <div>
            <label className="admin-login-label">
              Contraseña
            </label>
            <div className="admin-login-input-wrap">
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                required
              />
              <Lock size={18} className="admin-login-input-icon" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-add-to-cart admin-login-submit"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="admin-login-back">
          <Link
            to="/"
            className="admin-login-back-link"
          >
            <ArrowLeft size={16} />
            <span>Volver a la tienda pública</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
