// Paleta "tatami de noche": fondo tinta verdosa, superficie de tatami oliva y
// dos colores de luchador (azafrán para quien ejecuta, jade para el compañero).
export const colors = {
  bg: '#12140F',
  surface: '#1B1E17',
  mat: '#262A21',
  matLine: '#3B4133',
  text: '#EFE9DA',
  muted: '#9A9B88',
  border: '#30352A',
  primary: '#F2A93B',
  primarySoft: '#3A3020',
  onPrimary: '#1A1508',
  secondary: '#3FB59A',
  danger: '#E5573F',
};

export const fonts = {
  display: 'BarlowCondensed_700Bold',
  displaySemi: 'BarlowCondensed_600SemiBold',
};

export const BELTS = [
  { id: 'blanco', label: 'Blanco', color: '#F1EEE6', tip: '#111111' },
  { id: 'azul', label: 'Azul', color: '#1E4FB8', tip: '#111111' },
  { id: 'morado', label: 'Morado', color: '#6A2C91', tip: '#111111' },
  { id: 'marron', label: 'Marrón', color: '#6B3E1F', tip: '#111111' },
  { id: 'negro', label: 'Negro', color: '#111111', tip: '#C62828' },
] as const;
export type BeltId = (typeof BELTS)[number]['id'];
