import { type Joint, type Point, type Pose, lerpPose } from './model';

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

export function lerpFrame(a: Frame, b: Frame, t: number): Frame {
  if (a.poses.length !== b.poses.length) return t < 0.5 ? a : b;
  const poses = a.poses.map((p, i) => lerpPose(p, b.poses[i]!, t)) as Frame['poses'];
  const near = t < 0.5 ? a : b;
  return { poses, arrows: near.arrows, grips: near.grips, caption: near.caption };
}

export const VIEW = { width: 320, height: 220 };

/** Todas las piezas de un fotograma ordenadas de atrás hacia delante. */
export function frameParts(frame: Frame): Part[] {
  // A igualdad de capa, el luchador 0 va detrás del 1.
  return sortParts(frame.poses.flatMap((p, i) => poseParts(p, FIGHTER_COLORS[i]!, i)));
}
