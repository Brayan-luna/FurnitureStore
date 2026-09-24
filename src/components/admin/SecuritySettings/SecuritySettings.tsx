import React, { useState, FormEvent } from 'react';
import { Shield, KeyRound, User, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import './SecuritySettings.css';

export default function SecuritySettings() {
  const { currentUser, updateCredentials } = useAuth();

  const [username, setUsername] = useState(currentUser?.username || 'admin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (newPassword && newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'Las contraseñas no coinciden.' });
      return;
    }

    if (newPassword && newPassword.length < 4) {
      setStatus({ type: 'error', message: 'La nueva contraseña debe tener al menos 4 caracteres.' });
      return;
    }

    setSaving(true);
    try {
      const res = await updateCredentials(username, newPassword || 'admin123');
      if (res.success) {
        setStatus({ type: 'success', message: '¡Credenciales actualizadas y sincronizadas en Supabase correctamente!' });
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatus({ type: 'error', message: res.error || 'Error al guardar las credenciales.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Ocurrió un error al intentar actualizar las credenciales.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="security-settings-container">
      <div className="security-settings-header">
        <div className="security-settings-icon-wrap">
          <Shield size={24} />
        </div>
        <div>
          <h2 className="security-settings-title">Seguridad y Acceso al Dashboard</h2>
          <p className="security-settings-subtitle">
            Modifica tu nombre de usuario y contraseña para acceder al panel de administración.
          </p>
        </div>
      </div>

      {status && (
        <div className={`security-alert ${status.type}`}>
          {status.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="security-form">
        <div className="security-field-group">
          <label className="security-label">
            Nombre de Usuario
          </label>
          <div className="security-input-wrap">
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej. admin o tu nombre"
              required
              minLength={3}
            />
            <User size={18} className="security-input-icon" />
          </div>
          <span className="security-help-text">El usuario que utilizarás para iniciar sesión.</span>
        </div>

        <div className="security-field-group">
          <label className="security-label">
            Nueva Contraseña
          </label>
          <div className="security-input-wrap">
            <input
              type="password"
              className="input-field"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ingresa la nueva contraseña"
              required
              minLength={4}
            />
            <KeyRound size={18} className="security-input-icon" />
          </div>
        </div>

        <div className="security-field-group">
          <label className="security-label">
            Confirmar Nueva Contraseña
          </label>
          <div className="security-input-wrap">
            <input
              type="password"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la nueva contraseña"
              required
              minLength={4}
            />
            <KeyRound size={18} className="security-input-icon" />
          </div>
        </div>

        <div className="security-actions">
          <button
            type="submit"
            disabled={saving}
            className="btn-add-to-cart"
            style={{ width: 'auto', padding: '12px 28px', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Guardando en Supabase...' : 'Guardar Nuevas Credenciales'}
          </button>
        </div>
      </form>
    </div>
  );
}
