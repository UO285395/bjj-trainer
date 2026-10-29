import {
  type Bone,
  type Joint,
  type Point,
  type Pose,
  currentBend,
  rotatePose,
  solve,
  solveTwoBone,
  translate,
} from '../skeleton/model';
import { POSITIONS, type PositionId } from '../skeleton/poses';
import { type Arrow, type Frame, type Grip, swapFighters } from '../skeleton/shapes';

// Herramientas para describir los pasos de una técnica como variaciones de una
// posición base: mover o girar una figura, cambiar ángulos y llevar manos y pies
// a un punto o a una articulación del otro luchador.

type End = 'handL' | 'handR' | 'footL' | 'footR';
const CHAINS: Record<End, [Bone, Bone]> = {
  handL: ['upperArmL', 'forearmL'],
  handR: ['upperArmR', 'forearmR'],
  footL: ['thighL', 'shinL'],
  footR: ['thighR', 'shinR'],
};

/** Un punto fijo o una articulación (del luchador `of`) con un desplazamiento. */
export type Target = [number, number] | { joint: Joint; of: 0 | 1; dx?: number; dy?: number };

export type PoseMod = {
  move?: [number, number];
  rotate?: number;
  angles?: Partial<Record<Bone, number>>;
  reach?: Partial<Record<End, Target>>;
  /** Fuerza el sentido de flexión del codo o la rodilla al alcanzar. */
  bend?: Partial<Record<End, 1 | -1>>;
  far?: Pose['far'];
  layers?: Pose['layers'];
};

export type StepSpec = {
  /** Posición base; con `*` el ejecutor hace el papel del luchador 1 de esa posición. */
  from: PositionId | `${PositionId}*`;
  text: string;
  fighters?: [PoseMod?, PoseMod?];
  grips?: [0 | 1, End | Joint, string][];
  arrows?: { from: Target; to: Target; fighter: 0 | 1; bend?: number }[];
};

function baseFrame(from: StepSpec['from']): Frame {
  return from.endsWith('*')
    ? swapFighters(POSITIONS[from.slice(0, -1) as PositionId])
    : POSITIONS[from as PositionId];
}

function applyBasic(pose: Pose, mod: PoseMod | undefined): Pose {
  if (!mod) return pose;
  let p = pose;
  if (mod.rotate) p = rotatePose(p, mod.rotate);
  if (mod.move) p = translate(p, mod.move[0], mod.move[1]);
  if (mod.angles) p = { ...p, angles: { ...p.angles, ...mod.angles } };
  if (mod.far) p = { ...p, far: mod.far };
  if (mod.layers) p = { ...p, layers: mod.layers };
  return p;
}

function resolve(t: Target, poses: Pose[]): Point {
  if (Array.isArray(t)) return { x: t[0], y: t[1] };
  const j = solve(poses[t.of])[t.joint];
  return { x: j.x + (t.dx ?? 0), y: j.y + (t.dy ?? 0) };
}

export function buildStep(spec: StepSpec): Frame {
  const base = baseFrame(spec.from);
  const poses = base.poses.map((p, i) => applyBasic(p, spec.fighters?.[i])) as Frame['poses'];
  // Los alcances se resuelven después, para poder apuntar a la pose ya movida del otro.
  spec.fighters?.forEach((mod, i) => {
    if (!mod?.reach) return;
    for (const [end, target] of Object.entries(mod.reach) as [End, Target][]) {
      const [upper, lower] = CHAINS[end];
      const bend = mod.bend?.[end] ?? currentBend(poses[i]!, upper, lower);
      poses[i] = solveTwoBone(poses[i]!, upper, lower, resolve(target, poses), bend);
    }
  });
  const grips: Grip[] = (spec.grips ?? []).map(([fighter, joint, label]) => ({ fighter, joint, label }));
  const arrows: Arrow[] = (spec.arrows ?? []).map((a) => ({
    from: resolve(a.from, poses),
    to: resolve(a.to, poses),
    fighter: a.fighter,
    bend: a.bend,
  }));
  return { poses, grips, arrows, caption: spec.text };
}
