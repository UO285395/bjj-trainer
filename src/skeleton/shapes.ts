import { type Joint, type Limb, type Point, type Pose, type Side, lerpPose, solve } from './model';

// Convierte una pose en formas SVG: cada luchador lleva un kimono de su color
// (chaqueta, mangas y pantalón como formas continuas que se estrechan) y la
// piel en tono claro en cara, cuello, manos y pies. Contorno fino semitransparente.

export type Part = {
  key: string;
  d: string;
  fill: string;
  stroke: string;
  /** Grosor del trazo; por defecto 1. */
  width?: number;
  z: number;
};

/** `main` y `far` son el kimono (lado cercano y lejano); `skin`/`skinFar`, la piel. */
export type Palette = {
  main: string;
  far: string;
  skin: string;
  skinFar: string;
  /** Solapas de la chaqueta. */
  lapel: string;
  belt: string;
  hair: string;
  outline: string;
};

export const FIGHTER_COLORS: Palette[] = [
  {
    main: '#F2A93B',
    far: '#B37A22',
    skin: '#F6D7A6',
    skinFar: '#BFA07A',
    lapel: '#8C5A12',
    belt: '#1B1B17',
    hair: '#2A2620',
    outline: 'rgba(0,0,0,0.5)',
  },
  {
    main: '#3FB59A',
    far: '#2A7F6B',
    skin: '#BFE8DA',
    skinFar: '#86AFA2',
    lapel: '#1D6655',
    belt: '#1B1B17',
    hair: '#2A2620',
    outline: 'rgba(0,0,0,0.5)',
  },
];

const f = (n: number) => Math.round(n * 10) / 10;

/** Contorno de una cadena de puntos con grosor variable y extremos redondeados. */
export function taperedPath(points: Point[], widths: number[]): string {
  const n = points.length;
  const left: Point[] = [];
  const right: Point[] = [];
  for (let i = 0; i < n; i++) {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(n - 1, i + 1)];
    let tx = next.x - prev.x;
    let ty = next.y - prev.y;
    const len = Math.hypot(tx, ty) || 1;
    tx /= len;
    ty /= len;
    const r = widths[i] / 2;
    left.push({ x: points[i].x - ty * r, y: points[i].y + tx * r });
    right.push({ x: points[i].x + ty * r, y: points[i].y - tx * r });
  }
  const r0 = widths[0] / 2;
  const rn = widths[n - 1] / 2;
  let d = `M${f(left[0].x)},${f(left[0].y)}`;
  for (let i = 1; i < n; i++) {
    // Curva suave por los puntos medios para que la extremidad no tenga esquinas.
    const p = left[i];
    if (i < n - 1) {
      const m = { x: (p.x + left[i + 1].x) / 2, y: (p.y + left[i + 1].y) / 2 };
      d += ` Q${f(p.x)},${f(p.y)} ${f(m.x)},${f(m.y)}`;
    } else {
      d += ` L${f(p.x)},${f(p.y)}`;
    }
  }
  d += ` A${f(rn)},${f(rn)} 0 0 0 ${f(right[n - 1].x)},${f(right[n - 1].y)}`;
  for (let i = n - 2; i >= 0; i--) {
    const p = right[i];
    if (i > 0) {
      const m = { x: (p.x + right[i - 1].x) / 2, y: (p.y + right[i - 1].y) / 2 };
      d += ` Q${f(p.x)},${f(p.y)} ${f(m.x)},${f(m.y)}`;
    } else {
      d += ` L${f(p.x)},${f(p.y)}`;
    }
  }
  d += ` A${f(r0)},${f(r0)} 0 0 0 ${f(left[0].x)},${f(left[0].y)} Z`;
  return d;
}

const circle = (c: Point, r: number) =>
  `M${f(c.x - r)},${f(c.y)} a${r},${r} 0 1 0 ${2 * r},0 a${r},${r} 0 1 0 ${-2 * r},0 Z`;

const mid = (a: Point, b: Point, t = 0.5): Point => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

const DEFAULT_LAYER = { far: 0, torso: 1, near: 2 };

const unit = (a: Point, b: Point): Point => {
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return { x: (b.x - a.x) / len, y: (b.y - a.y) / len };
};
const add = (p: Point, d: Point, k: number): Point => ({ x: p.x + d.x * k, y: p.y + d.y * k });

/**
 * Hacia dónde mira el pecho. Sale de la columna y del lado lejano: si el lado
 * lejano es el izquierdo, el derecho mira al espectador, así que el pecho mira
 * a la derecha de la columna (girada 90° en sentido horario).
 */
export function facing(pose: Pose): Point {
  const j = solve(pose);
  const up = unit(j.pelvis, j.neck);
  const s = pose.far === 'L' ? 1 : -1;
  return { x: -up.y * s, y: up.x * s };
}

/** Pie: una cuña corta perpendicular a la espinilla, con la punta hacia delante. */
function footPath(knee: Point, foot: Point, forward: Point): string {
  const shin = unit(knee, foot);
  let perp = { x: -shin.y, y: shin.x };
  if (perp.x * forward.x + perp.y * forward.y < 0) perp = { x: -perp.x, y: -perp.y };
  const heel = add(add(foot, perp, -2.5), shin, 1);
  const toe = add(add(foot, perp, 9), shin, 2.5);
  return taperedPath([heel, mid(heel, toe), toe], [8.5, 7.5, 5.5]);
}

/** Pelo: media luna en la parte de atrás de la cabeza. */
function hairPath(head: Point, r: number, forward: Point): string {
  const back = Math.atan2(-forward.y, -forward.x);
  const a1 = back - 1.75;
  const a2 = back + 1.75;
  const p1 = { x: head.x + Math.cos(a1) * r, y: head.y + Math.sin(a1) * r };
  const p2 = { x: head.x + Math.cos(a2) * r, y: head.y + Math.sin(a2) * r };
  const inner = r * 1.7;
  return (
    `M${f(p1.x)},${f(p1.y)} A${f(r)},${f(r)} 0 1 1 ${f(p2.x)},${f(p2.y)}` +
    ` A${f(inner)},${f(inner)} 0 0 0 ${f(p1.x)},${f(p1.y)} Z`
  );
}

const line = (a: Point, b: Point) => `M${f(a.x)},${f(a.y)} L${f(b.x)},${f(b.y)}`;

export function poseParts(pose: Pose, palette: Palette, id: string): Part[] {
  const j = solve(pose);
  const near: Side = pose.far === 'L' ? 'R' : 'L';
  const layer = (limb: Limb, fallback: number) => pose.layers?.[limb] ?? fallback;
  const sideLayer = (s: Side) => (s === pose.far ? DEFAULT_LAYER.far : DEFAULT_LAYER.near);
  const gi = (s: Side) => (s === pose.far ? palette.far : palette.main);
  const skin = (s: Side) => (s === pose.far ? palette.skinFar : palette.skin);
  const stroke = palette.outline;

  const forward = facing(pose);

  const parts: Part[] = [];
  for (const s of [pose.far, near] as Side[]) {
    // Pantalón hasta casi el tobillo y pie descalzo.
    const legZ = layer(`leg${s}`, sideLayer(s));
    const hip = j[`hip${s}`];
    const knee = j[`knee${s}`];
    const foot = j[`foot${s}`];
    const ankle = mid(knee, foot, 0.86);
    parts.push({
      key: `${id}-leg${s}`,
      d: taperedPath([hip, mid(hip, knee, 0.45), knee, ankle], [20, 18, 15, 13]),
      fill: gi(s),
      stroke,
      z: legZ,
    });
    parts.push({
      key: `${id}-ankle${s}`,
      d: taperedPath([ankle, foot], [7, 7]),
      fill: skin(s),
      stroke,
      z: legZ - 0.02,
    });
    parts.push({
      key: `${id}-foot${s}`,
      d: footPath(knee, foot, forward),
      fill: skin(s),
      stroke,
      z: legZ - 0.02,
    });

    // Manga ancha hasta la muñeca y mano.
    const armZ = layer(`arm${s}`, sideLayer(s)) + 0.1;
    const shoulder = j[`shoulder${s}`];
    const elbow = j[`elbow${s}`];
    const hand = j[`hand${s}`];
    const wrist = mid(elbow, hand, 0.8);
    parts.push({
      key: `${id}-arm${s}`,
      d: taperedPath([shoulder, mid(shoulder, elbow, 0.5), elbow, wrist], [14, 13, 12, 11.5]),
      fill: gi(s),
      stroke,
      z: armZ,
    });
    parts.push({
      key: `${id}-wrist${s}`,
      d: taperedPath([wrist, hand], [6, 6]),
      fill: skin(s),
      stroke,
      z: armZ - 0.02,
    });
    parts.push({
      key: `${id}-hand${s}`,
      d: circle(add(hand, unit(elbow, hand), 1.5), 4.6),
      fill: skin(s),
      stroke,
      z: armZ - 0.01,
    });
  }

  // Chaqueta: de la pelvis al cuello, con solapas cruzadas y cinturón.
  const torsoZ = layer('torso', DEFAULT_LAYER.torso);
  const up = unit(j.pelvis, j.neck);
  const across = { x: -up.y, y: up.x };
  parts.push({
    key: `${id}-torso`,
    d: taperedPath(
      [j.pelvis, mid(j.pelvis, j.neck, 0.4), mid(j.pelvis, j.neck, 0.75), j.neck],
      [27, 25, 28, 18],
    ),
    fill: palette.main,
    stroke,
    z: torsoZ,
  });
  const chest = add(mid(j.pelvis, j.neck, 0.45), forward, 6);
  parts.push({
    key: `${id}-lapels`,
    d: `${line(add(j.neck, forward, 5), chest)} ${line(add(j.neck, forward, -2), add(chest, forward, 2))}`,
    fill: 'none',
    stroke: palette.lapel,
    width: 2.4,
    z: torsoZ + 0.01,
  });
  const waist = mid(j.pelvis, j.neck, 0.12);
  parts.push({
    key: `${id}-belt`,
    d: taperedPath([add(waist, across, 13), add(waist, across, -13)], [6, 6]),
    fill: palette.belt,
    stroke: 'none',
    z: torsoZ + 0.02,
  });
  const knot = add(mid(j.pelvis, j.neck, 0.1), forward, 12);
  parts.push({
    key: `${id}-knot`,
    d: taperedPath([knot, add(add(knot, up, -9), forward, 3)], [4, 3]),
    fill: palette.belt,
    stroke: 'none',
    z: torsoZ + 0.03,
  });

  parts.push({
    key: `${id}-neck`,
    d: taperedPath([j.neck, mid(j.neck, j.head, 0.6)], [9, 8]),
    fill: palette.skin,
    stroke,
    z: torsoZ - 0.01,
  });
  parts.push({
    key: `${id}-head`,
    d: circle(j.head, 10),
    fill: palette.skin,
    stroke,
    z: torsoZ + 0.05,
  });
  parts.push({
    key: `${id}-hair`,
    d: hairPath(j.head, 10, forward),
    fill: palette.hair,
    stroke: 'none',
    z: torsoZ + 0.06,
  });
  return parts;
}

export type Arrow = { from: Point; to: Point; fighter: 0 | 1; bend?: number };

/** Flecha discontinua curva: indica el siguiente movimiento. */
export function arrowPaths(a: Arrow): { line: string; head: string } {
  const bend = a.bend ?? 0.25;
  const dx = a.to.x - a.from.x;
  const dy = a.to.y - a.from.y;
  const c = { x: a.from.x + dx / 2 - dy * bend, y: a.from.y + dy / 2 + dx * bend };
  const ang = Math.atan2(a.to.y - c.y, a.to.x - c.x);
  const h = 8;
  const p1 = { x: a.to.x - Math.cos(ang - 0.45) * h, y: a.to.y - Math.sin(ang - 0.45) * h };
  const p2 = { x: a.to.x - Math.cos(ang + 0.45) * h, y: a.to.y - Math.sin(ang + 0.45) * h };
  return {
    line: `M${f(a.from.x)},${f(a.from.y)} Q${f(c.x)},${f(c.y)} ${f(a.to.x)},${f(a.to.y)}`,
    head: `M${f(p1.x)},${f(p1.y)} L${f(a.to.x)},${f(a.to.y)} L${f(p2.x)},${f(p2.y)}`,
  };
}

/** Agarre: una mano o pie de un luchador sujetando algo (manga, cuello...). */
export type Grip = { fighter: 0 | 1; joint: Joint; label: string };

export type Frame = {
  poses: [Pose, Pose] | [Pose];
  arrows?: Arrow[];
  grips?: Grip[];
  caption?: string;
};

/** Intercambia los papeles de los luchadores: el compañero pasa a ser el ejecutor. */
export function swapFighters(frame: Frame): Frame {
  if (frame.poses.length < 2) return frame;
  return {
    ...frame,
    poses: [frame.poses[1]!, frame.poses[0]],
    arrows: frame.arrows?.map((a) => ({ ...a, fighter: a.fighter === 0 ? 1 : 0 })),
    grips: frame.grips?.map((g) => ({ ...g, fighter: g.fighter === 0 ? 1 : 0 })),
  };
}

export function lerpFrame(a: Frame, b: Frame, t: number): Frame {
  if (a.poses.length !== b.poses.length) return t < 0.5 ? a : b;
  const poses = a.poses.map((p, i) => lerpPose(p, b.poses[i]!, t)) as Frame['poses'];
  const near = t < 0.5 ? a : b;
  return { poses, arrows: near.arrows, grips: near.grips, caption: near.caption };
}

export const VIEW = { width: 320, height: 220 };

/** Todas las piezas de un fotograma ordenadas de atrás hacia delante. */
export function frameParts(frame: Frame): Part[] {
  const parts = frame.poses.flatMap((p, i) => poseParts(p, FIGHTER_COLORS[i], `f${i}`));
  // A igualdad de capa, el luchador 0 va detrás del 1.
  return parts
    .map((p, i) => ({ p, i }))
    .sort((a, b) => a.p.z - b.p.z || a.i - b.i)
    .map(({ p }) => p);
}
