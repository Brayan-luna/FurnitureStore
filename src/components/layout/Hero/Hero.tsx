import React from 'react';
import { MessageCircle, Phone, Globe, Sparkles, MapPin } from 'lucide-react';
import { InstagramIcon } from '../../common/Icons';
import { useBusiness } from '../../../context/BusinessContext';
import { whatsappService } from '../../../services/whatsappService';
import './Hero.css';

export default function Hero() {
  const { business } = useBusiness();
  const heroData = business.hero || {};

  const heroWhatsappUrl = whatsappService.generateHeroContactUrl(business);
  const mapsUrl = business.mapsUrl || 'https://maps.app.goo.gl/38aWUaJMsGmr19t36?g_st=iwb';

  return (
    <section className="hero-wrapper" id="inicio">
      <div className="app-container">
        <div
          className="hero-card"
          style={{
            backgroundImage: `url(${heroData.bgImage || '/images/hero-crib.jpg'})`
          }}
        >
          {/* Contenido superior y central */}
          <div>
            <div className="hero-tag">
              <Sparkles size={14} />
              <span>{heroData.tag || '✦ Catálogo Cama Cunas 2026'}</span>
            </div>

            <h1 className="hero-title">
              {heroData.title || 'Diseño, calidad y funcionalidad para el cuarto de tu bebé'}
            </h1>

            <p className="hero-description">
              {heroData.description ||
                'Camas cuna y camas corral que evolucionan con tu bebé — hoy corral de barandas, mañana un juego de alcoba. Fabricantes directos en Villavicencio.'}
            </p>

            <div className="hero-actions">
              <a
                href={heroWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-hero"
              >
                <MessageCircle size={20} />
                <span>{heroData.whatsappButtonText || 'Consultar por WhatsApp'}</span>
              </a>

              <a href="#catalogo" className="btn-outline-hero">
                <span>{heroData.catalogButtonText || 'Ver catálogo ↓'}</span>
              </a>
            </div>
          </div>

          {/* Barra inferior de datos de contacto incrustada en el Hero */}
          <div className="hero-contact-footer">
            <a
              href={whatsappService.getDirectWhatsAppUrl(business)}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-meta-item"
            >
              <Phone size={16} />
              <span>{business.displayPhone || '311 759 6281'}</span>
            </a>

            <a
              href={`https://instagram.com/${(business.instagram || 'joha.vic').replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-meta-item"
            >
              <InstagramIcon size={16} />
              <span>{business.instagram || '@joha.vic'}</span>
            </a>

            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-meta-item"
                title="Ver ubicación en Google Maps"
              >
                <MapPin size={16} />
                <span>{business.cityNote || business.city || 'Ubicación Google Maps'}</span>
              </a>
            )}

            {business.website && (
              <a
                href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-meta-item"
              >
                <Globe size={16} />
                <span>{business.website}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
