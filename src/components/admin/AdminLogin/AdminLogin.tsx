import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useBusiness } from '../../../context/BusinessContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const { login } = useAuth();
  const { business } = useBusiness();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const res = login(username, password);
    if (!res.success) {
      setError(res.error || 'Credenciales inválidas');
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-badge">
            <Shield size={28} />
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
                placeholder="admin"
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
                placeholder="••••••••"
                required
              />
              <Lock size={18} className="admin-login-input-icon" />
            </div>
          </div>

          <div className="admin-login-credentials-note">
            <strong>Credenciales por defecto:</strong>
            <br />
            Usuario: <code>admin</code> | Contraseña: <code>admin123</code>
          </div>

          <button
            type="submit"
            className="btn-add-to-cart admin-login-submit"
          >
            Iniciar Sesión
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
