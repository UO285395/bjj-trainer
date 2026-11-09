import { type Joint, type Point, type Pose, solve } from './model';
import { blendPose, holdGrips, orbitPair } from './motion';

import { type Part, FIGHTER_COLORS, poseParts, sortParts } from './avatar';

// Fotogramas (una o dos poses, flechas y agarres) y cómo se convierten en
// piezas SVG. El dibujo de cada luchador está en avatar.ts.

export { FIGHTER_COLORS, type Palette, type Part } from './avatar';

const f = (n: number) => Math.round(n * 10) / 10;

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

/**
 * Fotograma entre `a` (t = 0) y `b` (t = 1). `prev` y `next` son los pasos de
 * antes y después, para que la trayectoria pase suave por cada paso.
 */
export function lerpFrame(a: Frame, b: Frame, t: number, prev?: Frame, next?: Frame): Frame {
  if (a.poses.length !== b.poses.length) return t < 0.5 ? a : b;
  const same = (f: Frame | undefined) => (f && f.poses.length === a.poses.length ? f : undefined);
  const blended = a.poses.map((p, i) =>
    blendPose(same(prev)?.poses[i], p, b.poses[i]!, same(next)?.poses[i], t),
  );
  const orbited = orbitPair(blended, a.poses, b.poses, t);
  const poses = holdGrips(orbited, a.poses, b.poses, a.grips, b.grips, t) as Frame['poses'];
  const near = t < 0.5 ? a : b;
  return { poses, arrows: near.arrows, grips: near.grips, caption: near.caption };
}

/** Fotograma en la posición `u` de la secuencia (1.5 = a medio camino entre el paso 2 y el 3). */
export function sampleFrames(frames: Frame[], u: number): Frame {
  const i = Math.max(0, Math.min(frames.length - 2, Math.floor(u)));
  return lerpFrame(frames[i]!, frames[i + 1]!, u - i, frames[i - 1], frames[i + 2]);
}

/** Desplazamiento medio (px) de las articulaciones entre dos fotogramas. */
export function frameDistance(a: Frame, b: Frame): number {
  let total = 0;
  let count = 0;
  a.poses.forEach((p, i) => {
    const q = b.poses[i];
    if (!q) return;
    const ja = solve(p);
    const jb = solve(q);
    for (const k of Object.keys(ja) as Joint[]) {
      total += Math.hypot(ja[k].x - jb[k].x, ja[k].y - jb[k].y);
      count++;
    }
  });
  return count ? total / count : 0;
}

export const VIEW = { width: 320, height: 220 };

/** Todas las piezas de un fotograma ordenadas de atrás hacia delante. */
export function frameParts(frame: Frame): Part[] {
  // A igualdad de capa, el luchador 0 va detrás del 1.
  return sortParts(frame.poses.flatMap((p, i) => poseParts(p, FIGHTER_COLORS[i]!, i)));
}
