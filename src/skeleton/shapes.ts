import { type Limb, type Point, type Pose, type Side, lerpPose, solve } from './model';

// Convierte una pose en formas SVG: cada extremidad es una única forma continua
// que se estrecha, con un contorno fino semitransparente.

export type Part = {
  key: string;
  d: string;
  fill: string;
  stroke: string;
  z: number;
};

export type Palette = { main: string; far: string; outline: string };

export const FIGHTER_COLORS: Palette[] = [
  { main: '#F2A93B', far: '#9A6E2E', outline: 'rgba(0,0,0,0.45)' },
  { main: '#3FB59A', far: '#2C7466', outline: 'rgba(0,0,0,0.45)' },
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

export function poseParts(pose: Pose, palette: Palette, id: string): Part[] {
  const j = solve(pose);
  const near: Side = pose.far === 'L' ? 'R' : 'L';
  const layer = (limb: Limb, fallback: number) => pose.layers?.[limb] ?? fallback;
  const sideLayer = (s: Side) => (s === pose.far ? DEFAULT_LAYER.far : DEFAULT_LAYER.near);
  const color = (s: Side) => (s === pose.far ? palette.far : palette.main);

  const parts: Part[] = [];
  for (const s of [pose.far, near] as Side[]) {
    parts.push({
      key: `${id}-leg${s}`,
      d: taperedPath([j[`hip${s}`], j[`knee${s}`], j[`foot${s}`]], [17, 12, 8]),
      fill: color(s),
      stroke: palette.outline,
      z: layer(`leg${s}`, sideLayer(s)),
    });
    parts.push({
      key: `${id}-arm${s}`,
      d: taperedPath([j[`shoulder${s}`], j[`elbow${s}`], j[`hand${s}`]], [12, 9, 7]),
      fill: color(s),
      stroke: palette.outline,
      z: layer(`arm${s}`, sideLayer(s)) + 0.1,
    });
  }

  // Tronco: de la pelvis al cuello, más ancho en el pecho.
  const chest = mid(j.pelvis, j.neck, 0.72);
  parts.push({
    key: `${id}-torso`,
    d: taperedPath(
      [j.pelvis, mid(j.pelvis, j.neck, 0.35), chest, j.neck, mid(j.neck, j.head, 0.6)],
      [24, 21, 25, 14, 9],
    ),
    fill: palette.main,
    stroke: palette.outline,
    z: layer('torso', DEFAULT_LAYER.torso),
  });
  parts.push({
    key: `${id}-head`,
    d: circle(j.head, 10.5),
    fill: palette.main,
    stroke: palette.outline,
    z: layer('torso', DEFAULT_LAYER.torso) + 0.05,
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

export type Frame = { poses: [Pose, Pose] | [Pose]; arrows?: Arrow[]; caption?: string };

/** Intercambia los papeles de los luchadores: el compañero pasa a ser el ejecutor. */
export function swapFighters(frame: Frame): Frame {
  if (frame.poses.length < 2) return frame;
  return {
    ...frame,
    poses: [frame.poses[1]!, frame.poses[0]],
    arrows: frame.arrows?.map((a) => ({ ...a, fighter: a.fighter === 0 ? 1 : 0 })),
  };
}

export function lerpFrame(a: Frame, b: Frame, t: number): Frame {
  if (a.poses.length !== b.poses.length) return t < 0.5 ? a : b;
  const poses = a.poses.map((p, i) => lerpPose(p, b.poses[i]!, t)) as Frame['poses'];
  return { poses, arrows: t < 0.5 ? a.arrows : b.arrows, caption: t < 0.5 ? a.caption : b.caption };
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
