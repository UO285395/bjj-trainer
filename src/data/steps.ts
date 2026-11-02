import {
  type Bone,
  type Joint,
  type Point,
  type Pose,
  currentBend,
  lerpPose,
  mirrorPose,
  normalize,
  rotateBone,
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
  /** Toma la figura de otra posición base, p. ej. 'standing:1'. */
  base?: `${PositionId}:${0 | 1}`;
  /** Refleja la figura (mira hacia el otro lado) respecto a su pelvis. */
  mirror?: boolean;
  move?: [number, number];
  rotate?: number;
  angles?: Partial<Record<Bone, number>>;
  reach?: Partial<Record<End, Target>>;
  /** Fuerza el sentido de flexión del codo o la rodilla al alcanzar. */
  bend?: Partial<Record<End, 1 | -1>>;
  far?: Pose['far'];
  layers?: Pose['layers'];
  /** No inclinar ni desplazar la figura para llegar a sus agarres. */
  fixed?: boolean;
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
  if (mod.base) {
    const [id, i] = mod.base.split(':') as [PositionId, string];
    p = POSITIONS[id].poses[Number(i)] ?? p;
  }
  if (mod.mirror) p = mirrorPose(p, p.x);
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

type Reach = { i: number; end: End; target: Target; bend: 1 | -1 };

function applyReaches(poses: Pose[], reaches: Reach[], only?: number) {
  for (const r of reaches) {
    if (only !== undefined && r.i !== only) continue;
    const [upper, lower] = CHAINS[r.end];
    poses[r.i] = solveTwoBone(poses[r.i]!, upper, lower, resolve(r.target, poses), r.bend);
  }
}

/** Distancia total (px) entre cada mano o pie del luchador y el punto al que quiere llegar. */
function miss(poses: Pose[], reaches: Reach[], i: number): number {
  let total = 0;
  const j = solve(poses[i]!);
  for (const r of reaches) {
    if (r.i !== i) continue;
    const t = resolve(r.target, poses);
    total += Math.hypot(j[r.end].x - t.x, j[r.end].y - t.y);
  }
  return total;
}

const LEAN = [-56, -48, -40, -32, -24, -16, -10, -6, -3, 0, 3, 6, 10, 16, 24, 32, 40, 48, 56];
const SHIFT = [-24, -16, -10, -5, 0, 5, 10, 16, 24];
const LIFT = [-10, -5, 0, 5, 10];

/** Coste de mover la figura: más caro cuanto más se aleja de la pose escrita. */
const effort = (lean: number, dx: number, dy: number) =>
  Math.abs(lean) * 0.45 + Math.abs(dx) * 0.5 + Math.abs(dy) * 0.8;

/**
 * Si una mano o un pie no llega a su agarre, la figura se inclina (gira la
 * columna) y se desplaza lo justo para llegar, como haría una persona. Primero
 * prueba una rejilla gruesa y luego afina alrededor de la mejor opción. Se
 * penaliza moverse mucho para no deformar la posición de partida.
 */
function settle(poses: Pose[], reaches: Reach[], mods: StepSpec['fighters']) {
  for (let pass = 0; pass < 2; pass++) {
    for (const i of [0, 1]) {
      if (!poses[i] || mods?.[i]?.fixed || !reaches.some((r) => r.i === i)) continue;
      if (miss(poses, reaches, i) < 3) continue;
      const start = poses[i]!;
      let best = { cost: Infinity, pose: start, lean: 0, dx: 0, dy: 0 };
      const tryPose = (lean: number, dx: number, dy: number) => {
        poses[i] = translate(rotateBone(start, 'spine', lean), dx, dy);
        applyReaches(poses, reaches, i);
        const cost = miss(poses, reaches, i) + effort(lean, dx, dy);
        if (cost < best.cost) best = { cost, pose: poses[i]!, lean, dx, dy };
      };
      for (const lean of LEAN) for (const dx of SHIFT) for (const dy of LIFT) tryPose(lean, dx, dy);
      for (const step of [3, 1]) {
        const c = best;
        for (const dl of [-step, 0, step])
          for (const ddx of [-step, 0, step])
            for (const ddy of [-step, 0, step]) tryPose(c.lean + dl, c.dx + ddx, c.dy + ddy);
      }
      poses[i] = best.pose;
    }
  }
  applyReaches(poses, reaches);
}

/** Contenido de un paso sin su posición de partida (la de un paso intermedio sale de sus vecinos). */
type StepBody = Omit<StepSpec, 'from'>;

/** Termina un paso: manos y pies a sus agarres, ajuste de cuerpo, agarres y flechas. */
function finish(poses: Frame['poses'], spec: StepBody): Frame {
  // Los alcances se resuelven después, para poder apuntar a la pose ya movida del
  // otro: primero los que van a un punto fijo y luego los que siguen a una articulación.
  const reaches: Reach[] = (spec.fighters ?? []).flatMap((mod, i) =>
    Object.entries(mod?.reach ?? {}).map(([end, target]) => {
      const [upper, lower] = CHAINS[end as End];
      return {
        i,
        end: end as End,
        target: target as Target,
        bend: mod?.bend?.[end as End] ?? currentBend(poses[i]!, upper, lower),
      };
    }),
  );
  reaches.sort((a, b) => Number(!Array.isArray(a.target)) - Number(!Array.isArray(b.target)));
  applyReaches(poses, reaches);
  settle(poses, reaches, spec.fighters);
  const grips: Grip[] = (spec.grips ?? []).map(([fighter, joint, label]) => ({ fighter, joint, label }));
  const arrows: Arrow[] = (spec.arrows ?? []).map((a) => ({
    from: resolve(a.from, poses),
    to: resolve(a.to, poses),
    fighter: a.fighter,
    bend: a.bend,
  }));
  return { poses, grips, arrows, caption: spec.text };
}

export function buildStep(spec: StepSpec): Frame {
  const base = baseFrame(spec.from);
  const poses = base.poses.map((p, i) => applyBasic(p, spec.fighters?.[i])) as Frame['poses'];
  return finish(poses, spec);
}

/**
 * Paso intermedio entre dos pasos escritos: parte de la mezcla de ambas poses
 * (`t` = 0 es el anterior, 1 el siguiente) y admite los mismos ajustes que un paso.
 * Si no indica agarres, mantiene los que siguen presentes en el paso siguiente.
 */
export type Tween = StepBody & { t?: number };

const GROUND_LIMIT = 205;

/** Sube la figura si alguna articulación queda por debajo del suelo. */
function onGround(pose: Pose): Pose {
  const low = Math.max(...Object.values(solve(pose)).map((p) => p.y));
  return low > GROUND_LIMIT ? translate(pose, 0, GROUND_LIMIT - low) : pose;
}

function keptContacts(prev: StepSpec, next: StepSpec): Pick<StepBody, 'fighters' | 'grips'> {
  const fighters = ([0, 1] as const).map((i) => {
    const a = prev.fighters?.[i]?.reach ?? {};
    const b = next.fighters?.[i]?.reach ?? {};
    const reach = Object.fromEntries(Object.entries(a).filter(([end]) => end in b));
    return Object.keys(reach).length ? { reach, bend: prev.fighters?.[i]?.bend } : undefined;
  }) as StepSpec['fighters'];
  const grips = (prev.grips ?? []).filter(([f, j]) => next.grips?.some(([g, k]) => g === f && k === j));
  return { fighters, grips };
}

function buildTween(prev: StepSpec, next: StepSpec, a: Frame, b: Frame, tw: Tween): Frame {
  const t = tw.t ?? 0.5;
  const kept = keptContacts(prev, next);
  const spec: StepBody = { ...tw, fighters: tw.fighters ?? kept.fighters, grips: tw.grips ?? kept.grips };
  const poses = a.poses.map((p, i) => {
    const q = b.poses[i] ? lerpPose(p, b.poses[i]!, t) : p;
    return onGround(applyBasic(q, spec.fighters?.[i]));
  }) as Frame['poses'];
  return finish(poses, spec);
}

/** Lo que se puede intercalar: un paso completo, una mezcla de los vecinos o solo su texto. */
type Inserted = StepSpec | Tween | string;
export type Tweens = Record<number, Inserted | Inserted[]>;

/**
 * Todos los fotogramas de una técnica. `tweens[n]` añade uno o varios pasos
 * intermedios tras el paso n (contando desde 1), repartidos a partes iguales.
 */
export function buildSteps(steps: StepSpec[], tweens: Tweens = {}): Frame[] {
  const frames = steps.map(buildStep);
  return smooth(
    frames.flatMap((frame, n) => {
      const next = frames[n + 1];
      const raw = tweens[n + 1];
      if (!raw || !next) return [frame];
      const list = (Array.isArray(raw) ? raw : [raw]).map((tw) =>
        typeof tw === 'string' ? { text: tw } : tw,
      );
      const extra = list.map((tw, k) =>
        'from' in tw
          ? buildStep(tw)
          : buildTween(steps[n]!, steps[n + 1]!, frame, next, {
              ...tw,
              t: tw.t ?? (k + 1) / (list.length + 1),
            }),
      );
      return [frame, ...extra];
    }),
  );
}

/** Desplazamiento medio (px) de las articulaciones entre dos fotogramas. */
function jump(a: Frame, b: Frame): number {
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

/**
 * Mezcla dos poses haciendo girar el tronco `spin` grados (puede ser más de media
 * vuelta): se mezcla la forma del cuerpo con el tronco alineado y luego se gira.
 */
function spinLerp(a: Pose, b: Pose, t: number, spin: number): Pose {
  const aligned = rotatePose(b, -normalize(b.angles.spine - a.angles.spine));
  return rotatePose(lerpPose(a, aligned, t), spin * t);
}

/**
 * Cuánto gira el tronco de `a` a `b`. Si gira casi media vuelta no está claro si
 * pasa por arriba o por abajo: entonces sigue el sentido en que ya venía girando
 * (de `before` a `a`), y si no venía girando no hay respuesta (null).
 */
function spinOf(before: Pose | undefined, a: Pose, b: Pose): number | null {
  const d = normalize(b.angles.spine - a.angles.spine);
  if (Math.abs(d) <= 120) return d;
  const prev = before ? normalize(a.angles.spine - before.angles.spine) : 0;
  if (Math.abs(prev) < 15) return null;
  return Math.sign(prev) === Math.sign(d) ? d : d - Math.sign(d) * 360;
}

/** Altura (y) del punto más alto de la figura. */
const top = (pose: Pose) => Math.min(...Object.values(solve(pose)).map((p) => p.y));

/**
 * Una mezcla puede dejar a alguien más alto que en los dos dibujos que une (al
 * girar alrededor de la cadera, la cabeza sube). Se baja hasta su altura; si
 * los pies quedan bajo el suelo, se apoyan en él doblando las rodillas; si aun
 * así algo se hundiría (p. ej. de la tortuga a sentado pasaría por estar de pie),
 * no es un paso real y no se dibuja (null).
 */
const RISE_LIMIT = 12;
/** Más de esto ya no es agacharse un poco: la mezcla no se parece a ningún paso real. */
const MAX_LOWER = 24;

function noHigher(pose: Pose, a: Pose, b: Pose): Pose | null {
  const excess = Math.min(top(a), top(b)) - RISE_LIMIT - top(pose);
  if (excess <= 0) return pose;
  if (excess > MAX_LOWER) return null;
  let lowered = translate(pose, 0, excess);
  // Los pies que quedarían bajo el suelo se apoyan en él doblando las rodillas.
  for (const end of ['footL', 'footR'] as const) {
    const foot = solve(lowered)[end];
    if (foot.y <= GROUND_LIMIT) continue;
    const [upper, lower] = CHAINS[end];
    const target = { x: foot.x, y: GROUND_LIMIT };
    lowered = solveTwoBone(lowered, upper, lower, target, currentBend(lowered, upper, lower));
  }
  const low = Math.max(...Object.values(solve(lowered)).map((p) => p.y));
  return low > GROUND_LIMIT + 2 ? null : lowered;
}

/** Por encima de este salto medio (px) entre dos dibujos se intercala uno de paso. */
const JUMP_LIMIT = 40;

/**
 * Si entre dos dibujos seguidos los cuerpos cambian demasiado, intercala uno a
 * medio camino que lleva ya el texto del siguiente: así cada cambio grande de
 * posición tiene un dibujo de transición. Mantiene los agarres comunes a ambos.
 */
function smooth(frames: Frame[]): Frame[] {
  return frames.flatMap((frame, n) => {
    const next = frames[n + 1];
    if (!next || next.poses.length !== frame.poses.length || jump(frame, next) <= JUMP_LIMIT) return [frame];
    const spins = frame.poses.map((p, i) => spinOf(frames[n - 1]?.poses[i], p, next.poses[i]!));
    if (spins.some((d) => d === null)) return [frame];
    const poses = frame.poses.map((p, i) =>
      noHigher(onGround(spinLerp(p, next.poses[i]!, 0.5, spins[i]!)), p, next.poses[i]!),
    );
    if (poses.some((p) => p === null)) return [frame];
    const grips = (frame.grips ?? []).filter((g) =>
      next.grips?.some((h) => h.fighter === g.fighter && h.joint === g.joint),
    );
    return [frame, { poses: poses as Frame['poses'], grips, arrows: [], caption: next.caption }];
  });
}

/** Atajo para apuntar a una articulación: at('neck', 1, -3, 6). */
export const at = (joint: Joint, of: 0 | 1, dx = 0, dy = 0): Target => ({ joint, of, dx, dy });
