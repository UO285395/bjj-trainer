export const colors = {
  bg: '#F6F4EF',
  surface: '#FFFFFF',
  mat: '#EFEBE2',
  text: '#1B1D22',
  muted: '#6B6F78',
  border: '#E2DDD2',
  primary: '#2F6FDE',
  primarySoft: '#E3ECFB',
  accent: '#E4572E',
  danger: '#C62828',
};

export const BELTS = [
  { id: 'blanco', label: 'Blanco', color: '#F4F4F4', tip: '#1B1D22' },
  { id: 'azul', label: 'Azul', color: '#1E4FB8', tip: '#1B1D22' },
  { id: 'morado', label: 'Morado', color: '#6A2C91', tip: '#1B1D22' },
  { id: 'marron', label: 'Marrón', color: '#6B3E1F', tip: '#1B1D22' },
  { id: 'negro', label: 'Negro', color: '#1B1D22', tip: '#C62828' },
] as const;
export type BeltId = (typeof BELTS)[number]['id'];
