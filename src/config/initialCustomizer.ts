import { CustomizerConfig } from '../types';

export const initialCustomizerConfig: CustomizerConfig = {
  quality: {
    sectionTitle: 'Línea de Fabricación y Acabado',
    sectionSubtitle: 'La base de todas es PLUS. Si eliges PREMIUM, se activa en verde con laca en poliuretano.',
    plus: {
      badge: 'BASE INCLUIDA',
      name: 'PLUS',
      wood: 'Madera de roble seleccionada',
      finish: 'Pintura catalizada de alta adherencia',
      standardMeasure: 'Medida estándar: 1 × 190 cm',
      priceModifier: 0
    },
    premium: {
      badge: 'ALTA GAMA',
      name: 'PREMIUM',
      wood: 'Madera de roble seleccionada',
      finish: 'Pintura en poliuretano (alta resistencia y acabado sedoso)',
      standardMeasure: 'Acabado sedoso y mayor durabilidad anti-rayones',
      priceModifier: 300000
    }
  },
  sizes: [
    {
      id: '1x190',
      name: '1 × 190 cm',
      label: 'Sencilla',
      dimension: '1 × 190 cm',
      priceModifier: 0,
      active: true
    },
    {
      id: '120x190',
      name: '1,20 × 190 cm',
      label: 'Semi doble',
      dimension: '1,20 × 190 cm',
      priceModifier: 220000,
      active: true
    },
    {
      id: '140x190',
      name: '1,40 × 190 cm',
      label: 'Doble',
      dimension: '1,40 × 190 cm',
      priceModifier: 320000,
      active: true
    }
  ],
  mattresses: [
    {
      id: 'croydon-15',
      name: 'Espuma Croydon importada, 15 cm',
      price: 260000,
      description: 'Espuma de alta densidad y durabilidad Croydon, apta para todas las medidas.',
      compatibleSizes: ['all'],
      active: true
    },
    {
      id: 'semi-ortopedico-1x190',
      name: 'Semi ortopédico 1 × 190 cm, 22 cm',
      price: 360000,
      description: 'Estructura resortada ortopédica con 22 cm de altura para medida sencilla.',
      compatibleSizes: ['1x190'],
      active: true
    },
    {
      id: 'semi-ortopedico-120x190',
      name: 'Semi ortopédico 1,20 × 190 cm, 22 cm',
      price: 380000,
      description: 'Estructura resortada ortopédica con 22 cm de altura para medida semi doble.',
      compatibleSizes: ['120x190'],
      active: true
    },
    {
      id: 'semi-ortopedico-140x190',
      name: 'Semi ortopédico 1,40 × 190 cm, 22 cm',
      price: 460000,
      description: 'Estructura resortada ortopédica con 22 cm de altura para medida doble.',
      compatibleSizes: ['140x190'],
      active: true
    }
  ],
  colors: [
    { id: 'blanco-nieve', name: 'Blanco Nieve', hex: '#FFFFFF', active: true },
    { id: 'roble-miel', name: 'Roble Miel Natural', hex: '#C68B59', active: true },
    { id: 'blanco-miel', name: 'Blanco + Miel Combinado', hex: 'linear-gradient(135deg, #FFFFFF 50%, #C68B59 50%)', active: true },
    { id: 'gris-ceniza', name: 'Gris Ceniza', hex: '#9E9E9E', active: true },
    { id: 'caramelo', name: 'Caramelo / Nogal', hex: '#7C4A27', active: true },
    { id: 'personalizado', name: 'Color Personalizado', hex: '#E2E8F0', active: true }
  ],
  addons: [
    {
      id: 'carro-cajon',
      name: 'Carro cajón',
      price: 300000,
      description: 'Cajón rodante inferior de gran capacidad con rodachinas reforzadas.',
      active: true
    },
    {
      id: 'arnilla-cajonera',
      name: 'Arnilla cajonera de 2 a 3 cajones',
      price: 350000,
      description: 'Módulo de almacenamiento con guías metálicas suaves.',
      active: true
    },
    {
      id: 'cama-aux-plus',
      name: 'Cama auxiliar sin colchón PLUS',
      price: 450000,
      description: 'Cama nido extraíble acabado PLUS con rodachines.',
      active: true
    },
    {
      id: 'cama-aux-premium',
      name: 'Cama auxiliar sin colchón PREMIUM',
      price: 550000,
      description: 'Cama nido extraíble acabado laca poliuretano PREMIUM.',
      active: true
    },
    {
      id: 'tapizado-cabecero',
      name: 'Tapizado de cabecero',
      price: 250000,
      description: 'Acolchado premium en tela antifluidos suave al tacto.',
      active: true
    },
    {
      id: 'tapizado-piecero',
      name: 'Tapizado de piecero',
      price: 200000,
      description: 'Detalle capitoné o liso acolchado para el piecero.',
      active: true
    },
    {
      id: 'tapizado-190',
      name: 'Tapizado de 190 cm',
      price: 600000,
      description: 'Tapizado protector lateral completo de 190 cm.',
      active: true
    },
    {
      id: 'tapizado-l',
      name: 'Tapizado en L',
      price: 950000,
      description: 'Tapizado envolvente en forma de L para máxima protección y elegancia.',
      active: true
    },
    {
      id: 'luz-led',
      name: 'Luz LED inteligente',
      price: 200000,
      description: 'Iluminación tenue cálida integrada ideal para la noche.',
      active: true
    }
  ]
};
