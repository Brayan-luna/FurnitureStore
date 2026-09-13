import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, MapPin } from 'lucide-react';
import { InstagramIcon } from '../../common/Icons';
import { useBusiness } from '../../../context/BusinessContext';
import { whatsappService } from '../../../services/whatsappService';
import logoImg from '../../../assets/logo.png';
import './Footer.css';

export default function Footer() {
  const { business } = useBusiness();
  const currentLogo = business.logoUrl || logoImg;

  return (
    <footer className="site-footer" id="contacto">
      <div className="app-container">
        <div className="footer-top">
          <div style={{ maxWidth: '360px' }}>
            <div className="brand-section" style={{ marginBottom: '16px' }}>
              <div className="brand-logo-badge" style={{ backgroundColor: '#FFFFFF', padding: '3px', borderRadius: '12px' }}>
                <img
                  src={currentLogo}
                  alt={business.name || 'Joha.vic'}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className="brand-text">
                <span className="brand-name" style={{ color: '#FFF' }}>{business.name}</span>
                <span className="brand-slogan" style={{ color: '#9CA3AF' }}>{business.slogan}</span>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#9CA3AF', lineHeight: '1.5' }}>
              Especialistas en camas cunas convertibles y muebles evolutivos para acompañar el crecimiento de tu bebé con seguridad, confort y diseño de alta gama.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#FFF', fontSize: '1rem', marginBottom: '14px' }}>Contacto & Asesoría</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#CBD5E1' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a
                  href={whatsappService.getDirectWhatsAppUrl(business)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'inherit', textDecoration: 'none' }}
                >
                  <Phone size={16} color="var(--color-whatsapp)" />
                  <span>WhatsApp: {business.displayPhone || '321 402 8890'}</span>
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <InstagramIcon size={16} color="var(--color-accent-pink)" />
                <span>Instagram: {business.instagram || '@zona_kids_home'}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#38BDF8" />
                <span>{business.cityNote || 'Fabricantes directos en Villavicencio'}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#FFF', fontSize: '1rem', marginBottom: '14px' }}>Garantía y Confianza</h4>
            <p style={{ fontSize: '0.85rem', color: '#9CA3AF', maxWidth: '280px', lineHeight: '1.5' }}>
              Maderas seleccionadas, pintura libre de plomo apta para bebés y herrajes de alta durabilidad con garantía de fábrica.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {business.name}. Todos los derechos reservados.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/admin" className="admin-link" title="Panel de control privado">
              <Shield size={14} />
              <span>Acceso Administrador</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
