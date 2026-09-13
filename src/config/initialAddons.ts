import { AddonItem } from '../types';

export const initialAddons: AddonItem[] = [
  {
    id: 'cama-auxiliar-plus',
    name: 'Cama auxiliar Plus (sin colchón)',
    description: 'Adiciónala a cualquier diseño Plus. No incluye colchón.',
    price: 500000,
    category: 'Plus'
  },
  {
    id: 'cama-auxiliar-con-colchon',
    name: 'Cama auxiliar Plus + Colchón',
    description: 'Estructura en madera con rodachines y colchón anatómico a la medida.',
    price: 880000,
    category: 'Plus'
  },
  {
    id: 'modulo-cajones-bajo-cama',
    name: 'Módulo de 3 Cajones Bajo Cama',
    description: 'Cajoneras con rieles metálicos para almacenamiento bajo el corral o cama.',
    price: 450000,
    category: 'General'
  },
  {
    id: 'protector-impermeable',
    name: 'Protector Acolchado Impermeable',
    description: 'Tela transpirable anti-ácaros para colchón de cuna y cama.',
    price: 180000,
    category: 'General'
  }
];
