import { Category, Product } from '../types';

export const initialCategories: Category[] = [
  { id: 'todas', name: 'Todas', icon: 'sparkles', color: '#6366F1' },
  { id: 'plus', name: 'Plus', icon: 'cloud', color: '#3B82F6', bg: 'rgba(224, 242, 254, 0.9)' },
  { id: 'premium', name: 'Premium', icon: 'crown', color: '#F59E0B', bg: 'rgba(254, 243, 199, 0.9)' },
  { id: 'natural', name: 'Natural', icon: 'leaf', color: '#10B981', bg: 'rgba(209, 250, 229, 0.9)' },
  { id: 'tapizada', name: 'Tapizada', icon: 'gem', color: '#EC4899', bg: 'rgba(252, 231, 243, 0.9)' }
];

export const initialProducts: Product[] = [
  {
    id: 'cama-cuna-plus',
    name: 'Cama Cuna Plus',
    description: 'Estructura en madera pino canadiense, pintura catalizada y acabado básico. Corral de 4 barandas con sistema abatible, cajones laterales y baúl.',
    categoryId: 'plus',
    basePrice: 2700000,
    discountAmount: 150000,
    imageUrl: '/images/cama-cuna-plus.jpg',
    types: [
      { id: 'sencilla', name: 'Sencilla', priceModifier: 0 },
      { id: 'semidoble', name: 'Semidoble', priceModifier: 350000 },
      { id: 'doble', name: 'Doble', priceModifier: 600000 }
    ],
    additionals: [
      { id: 'solita', name: 'Solita', priceModifier: 0 },
      { id: 'colchon', name: 'Con colchón', priceModifier: 380000 },
      { id: 'combo-lenceria', name: 'Combo + lencería', priceModifier: 620000 }
    ]
  },
  {
    id: 'cama-cuna-premium',
    name: 'Cama Cuna Premium Royal',
    description: 'Acabado en roble miel y laca poliuretano anti-rayones. Cajoneras con guías telescópicas de cierre suave, módulo cambiador desmontable y baranda deslizante.',
    categoryId: 'premium',
    basePrice: 3200000,
    imageUrl: '/images/cama-cuna-premium.jpg',
    types: [
      { id: 'sencilla', name: 'Sencilla (1.00m)', priceModifier: 0 },
      { id: 'semidoble', name: 'Semidoble (1.20m)', priceModifier: 400000 }
    ],
    additionals: [
      { id: 'solita', name: 'Solita', priceModifier: 0 },
      { id: 'colchon-ortopedico', name: 'Con colchón ortopédico', priceModifier: 450000 },
      { id: 'combo-completo', name: 'Combo + lencería de lujo', priceModifier: 750000 }
    ]
  },
  {
    id: 'cama-cuna-tapizada',
    name: 'Cama Cuna Tapizada Velvet',
    description: 'Cabecero tapizado en tela antifluidos con textura velvet y capitoné artesanal. Esquinas acolchadas de máxima seguridad, 3 gavetas inferiores y baranda convertible.',
    categoryId: 'tapizada',
    basePrice: 3450000,
    imageUrl: '/images/cama-cuna-tapizada.jpg',
    types: [
      { id: 'sencilla', name: 'Sencilla', priceModifier: 0 },
      { id: 'semidoble', name: 'Semidoble', priceModifier: 380000 }
    ],
    additionals: [
      { id: 'solita', name: 'Solita', priceModifier: 0 },
      { id: 'colchon-memory', name: 'Con colchón memory foam', priceModifier: 490000 },
      { id: 'lenceria-bordada', name: 'Combo + lencería bordada', priceModifier: 680000 }
    ]
  },
  {
    id: 'cama-cuna-natural',
    name: 'Cama Cuna Nórdica Natural',
    description: 'Diseño minimalista escandinavo en pino macizo certificado con ceras naturales no tóxicas. Cajón rodante inferior de gran capacidad y sistema de conversión a cama Montessori.',
    categoryId: 'natural',
    basePrice: 2450000,
    imageUrl: '/images/cama-cuna-natural.jpg',
    types: [
      { id: 'sencilla', name: 'Sencilla', priceModifier: 0 },
      { id: 'semidoble', name: 'Semidoble', priceModifier: 300000 }
    ],
    additionals: [
      { id: 'solita', name: 'Solita', priceModifier: 0 },
      { id: 'colchon-ergonomico', name: 'Con colchón ergonómico', priceModifier: 350000 },
      { id: 'combo-organico', name: 'Combo + lencería 100% algodón', priceModifier: 580000 }
    ]
  }
];
