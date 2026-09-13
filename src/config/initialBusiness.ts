import { BusinessConfig } from '../types';

export const initialBusinessConfig: BusinessConfig = {
  name: 'Joha.vic',
  slogan: 'Muebles y accesorios infantiles',
  logoUrl: '/logo.png',
  whatsappNumber: '573117596281',
  whatsappLink: 'https://wa.me/message/MGA7KPPOQIPVK1',
  displayPhone: '311 759 6281',
  instagram: '@zona_kids_home',
  website: 'zonakidshome.com',
  city: 'Villavicencio',
  cityNote: 'Fabricantes directos en Villavicencio',
  logoText: 'Joha.vic',
  currency: 'COP',
  hero: {
    tag: '✦ Catálogo Cama Cunas 2026',
    title: 'Diseño, calidad y funcionalidad para el cuarto de tu bebé',
    description: 'Camas cuna y camas corral que evolucionan con tu bebé — hoy corral de barandas, mañana un juego de alcoba. Fabricantes directos en Villavicencio.',
    bgImage: '/images/hero-crib.jpg',
    whatsappButtonText: 'Consultar por WhatsApp',
    catalogButtonText: 'Ver catálogo ↓'
  },
  navLinks: [
    { label: 'Catálogo', href: '#catalogo' },
    { label: 'Adicionales', href: '#adicionales' },
    { label: 'Contacto', href: '#contacto' }
  ]
};
