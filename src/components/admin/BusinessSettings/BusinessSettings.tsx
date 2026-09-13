import React, { useState, FormEvent } from 'react';
import { useBusiness } from '../../../context/BusinessContext';
import { Check, RotateCcw } from 'lucide-react';
import { BusinessConfig } from '../../../types';
import ImageUploader from '../../common/ImageUploader';
import './BusinessSettings.css';

export default function BusinessSettings() {
  const { business, updateBusiness, resetBusiness } = useBusiness();
  const [formData, setFormData] = useState<BusinessConfig>({ ...business });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof BusinessConfig, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleHeroChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      hero: {
        ...(prev.hero || {
          tag: '',
          title: '',
          description: '',
          bgImage: '',
          whatsappButtonText: '',
          catalogButtonText: ''
        }),
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateBusiness(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('¿Deseas restablecer todos los datos de la empresa a los valores iniciales?')) {
      resetBusiness();
      setFormData(business);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="business-settings-form">
      {savedSuccess && (
        <div className="business-settings-success">
          <Check size={20} />
          <span>¡Información de la empresa actualizada con éxito! Se refleja en toda la tienda.</span>
        </div>
      )}

      {/* Identidad de la Marca */}
      <div className="business-section-box">
        <h3 className="business-section-title">Identidad de la Marca (White-Label)</h3>
        <div className="business-grid-2">
          <div className="business-form-group">
            <label className="business-form-label">
              Nombre de la Empresa *
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Zona Kids Home"
              required
            />
          </div>

          <div className="business-form-group">
            <label className="business-form-label">
              Eslogan o Subtítulo
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.slogan}
              onChange={(e) => handleChange('slogan', e.target.value)}
              placeholder="Muebles y accesorios infantiles"
            />
          </div>

          <div className="business-form-group">
            <label className="business-form-label">
              Texto de Insignia / Logo
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.logoText}
              onChange={(e) => handleChange('logoText', e.target.value)}
              placeholder="Kids"
            />
          </div>

          <div className="business-form-group">
            <label className="business-form-label">
              Ciudad / Origen
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Villavicencio"
            />
          </div>

          <div className="business-form-group full-width" style={{ marginTop: '8px' }}>
            <ImageUploader
              value={formData.logoUrl || ''}
              onChange={(newLogo) => handleChange('logoUrl', newLogo)}
              label="Logo de la Empresa (PNG, JPG o WebP)"
              placeholder="/logo.png o selecciona un archivo..."
              previewHeight={140}
            />
          </div>
        </div>
      </div>

      {/* Datos de Contacto y WhatsApp */}
      <div className="business-section-box">
        <h3 className="business-section-title">Canales de Venta & WhatsApp</h3>
        <div className="business-grid-2">
          <div className="business-form-group">
            <label className="business-form-label">
              Enlace o Número de WhatsApp para Recibir Pedidos *
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.whatsappNumber}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              placeholder="https://wa.me/message/MGA7KPPOQIPVK1"
              required
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
              Enlace directo (wa.me) o número con código de país para pedidos y consultas.
            </small>
          </div>

          <div className="business-form-group">
            <label className="business-form-label">
              Teléfono Visible al Público
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.displayPhone}
              onChange={(e) => handleChange('displayPhone', e.target.value)}
              placeholder="311 759 6281"
            />
          </div>

          <div className="business-form-group">
            <label className="business-form-label">
              Instagram de la Empresa
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
              placeholder="@zona_kids_home"
            />
          </div>

          <div className="business-form-group">
            <label className="business-form-label">
              Sitio Web / Dominio
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="zonakidshome.com"
            />
          </div>

          <div className="business-form-group full-width">
            <label className="business-form-label">
              Ubicación o Ciudad de Fabricación
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.cityNote}
              onChange={(e) => handleChange('cityNote', e.target.value)}
              placeholder="Fabricantes directos en Villavicencio"
            />
          </div>
        </div>
      </div>

      {/* Banner Principal (Hero) */}
      <div className="business-section-box">
        <h3 className="business-section-title">Banner Principal (Hero)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="business-grid-2">
            <div className="business-form-group">
              <label className="business-form-label">
                Etiqueta Superior
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.hero?.tag || ''}
                onChange={(e) => handleHeroChange('tag', e.target.value)}
                placeholder="✦ Catálogo Cama Cunas 2026"
              />
            </div>

            <div className="business-form-group">
              <label className="business-form-label">
                Título Principal
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.hero?.title || ''}
                onChange={(e) => handleHeroChange('title', e.target.value)}
                placeholder="Diseño, calidad y funcionalidad para el cuarto de tu bebé"
              />
            </div>
          </div>

          <div className="business-form-group">
            <label className="business-form-label">
              Párrafo Descriptivo
            </label>
            <textarea
              className="input-field"
              rows={3}
              value={formData.hero?.description || ''}
              onChange={(e) => handleHeroChange('description', e.target.value)}
              placeholder="Camas cuna y camas corral que evolucionan con tu bebé..."
            />
          </div>

          <div className="business-form-group" style={{ marginTop: '4px' }}>
            <ImageUploader
              value={formData.hero?.bgImage || ''}
              onChange={(newBg) => handleHeroChange('bgImage', newBg)}
              label="Imagen de Fondo del Banner (Hero)"
              placeholder="/images/hero-crib.jpg o selecciona un archivo..."
              previewHeight={200}
            />
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="business-footer-actions">
        <button
          type="button"
          onClick={handleReset}
          className="btn-reset-business"
        >
          <RotateCcw size={16} />
          <span>Restablecer Valores Iniciales</span>
        </button>

        <button
          type="submit"
          className="btn-add-to-cart"
          style={{ width: 'auto', padding: '12px 28px' }}
        >
          Guardar Configuración de Empresa
        </button>
      </div>
    </form>
  );
}
