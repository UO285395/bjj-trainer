import { BONE_ORDER, type Bone, type Pose, currentBend, normalize, solve, solveTwoBone, translate } from './model';

// Interpolación para animar. Cada hueso gira por el camino más corto, como
// antes, pero el cuerpo se coloca por su centro (mitad de la columna) y no por
// la cadera, así al girar el tronco el giro es alrededor del centro del cuerpo.
// Entre varios pasos se usa una curva Catmull-Rom para que el movimiento no
// cambie de dirección de golpe en cada paso.

/** Catmull-Rom uniforme entre p1 y p2. */
function cr(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

/**
 * Valor de las claves vecinas como si estuvieran «desenrolladas» alrededor del
 * tramo b-c: el salto b→c es el más corto, y a y d quedan junto a b y c.
 */
function unwrap(a: number, b: number, c: number, d: number): [number, number, number, number] {
  const c2 = b + normalize(c - b);
  return [b + normalize(a - b), b, c2, c2 + normalize(d - c)];
}

const GROUND_LIMIT = 205;

const lowest = (p: Pose) => Math.max(...Object.values(solve(p)).map((q) => q.y));

const LEGS = [
  ['thighL', 'shinL', 'footL'],
  ['thighR', 'shinR', 'footR'],
] as const;

/**
 * Si al mezclar algo atraviesa el suelo (o baja más de lo que bajaban los dos
 * pasos que une), primero se apoyan los pies doblando las rodillas y, si aún
 * hace falta, se sube la figura.
 */
function aboveGround(p: Pose, limit = GROUND_LIMIT): Pose {
  let out = p;
  for (const [upper, lower, end] of LEGS) {
    const foot = solve(out)[end];
    if (foot.y > limit) out = solveTwoBone(out, upper, lower, { x: foot.x, y: limit }, currentBend(out, upper, lower));
  }
  const low = lowest(out);
  return low > limit ? translate(out, 0, limit - low) : out;
}

const limitFor = (b: Pose, c: Pose, t: number) =>
  Math.max(GROUND_LIMIT, lowest(b) + (lowest(c) - lowest(b)) * t);

/**
 * Pose entre `b` (t = 0) y `c` (t = 1), con `a` y `d` como claves vecinas para
 * suavizar la curva (si no hay, se repiten los extremos).
 */
export function blendPose(a: Pose | undefined, b: Pose, c: Pose, d: Pose | undefined, t: number): Pose {
  const keys = [a ?? b, b, c, d ?? c] as const;
  const angles = {} as Record<Bone, number>;
  for (const bone of BONE_ORDER) {
    const v = unwrap(...(keys.map((k) => k.angles[bone]) as [number, number, number, number]));
    angles[bone] = normalize(cr(...v, t));
  }
  const cs = keys.map(bodyCenter);
  const want = { x: cr(cs[0]!.x, cs[1]!.x, cs[2]!.x, cs[3]!.x, t), y: cr(cs[0]!.y, cs[1]!.y, cs[2]!.y, cs[3]!.y, t) };
  const pose: Pose = { ...(t < 0.5 ? b : c), angles };
  const now = bodyCenter(pose);
  return aboveGround(translate(pose, want.x - now.x, want.y - now.y), limitFor(b, c, t));
}

/** Centro del cuerpo (mitad de la columna). */
export function bodyCenter(p: Pose): { x: number; y: number } {
  const j = solve(p);
  return { x: (j.pelvis.x + j.neck.x) / 2, y: (j.pelvis.y + j.neck.y) / 2 };
}

/**
 * En las barridas y proyecciones los dos cuerpos giran uno alrededor del otro.
 * Si cada centro fuera en línea recta, a mitad de camino se atravesarían; aquí
 * la línea que une los dos centros gira (en el mismo sentido que los cuerpos) y
 * cambia de largo poco a poco.
 */
export function orbitPair(blended: Pose[], b: Pose[], c: Pose[], t: number): Pose[] {
  if (blended.length !== 2 || b.length !== 2 || c.length !== 2) return blended;
  const [b0, b1] = b.map(bodyCenter) as [Pt, Pt];
  const [c0, c1] = c.map(bodyCenter) as [Pt, Pt];
  const vb = { x: b1.x - b0.x, y: b1.y - b0.y };
  const vc = { x: c1.x - c0.x, y: c1.y - c0.y };
  const ab = Math.atan2(vb.y, vb.x);
  let turn = normalize(((Math.atan2(vc.y, vc.x) - ab) * 180) / Math.PI);
  if (Math.abs(turn) < 25) return blended;
  // Sentido del giro de los cuerpos, para que la pareja gire con ellos.
  const spin = [0, 1].reduce((acc, i) => acc + normalize(c[i]!.angles.spine - b[i]!.angles.spine), 0);
  if (Math.abs(turn) > 120 && spin !== 0 && Math.sign(spin) !== Math.sign(turn)) turn -= Math.sign(turn) * 360;
  const now = blended.map(bodyCenter) as [Pt, Pt];
  const mid = { x: (now[0].x + now[1].x) / 2, y: (now[0].y + now[1].y) / 2 };
  const ang = ab + (turn * t * Math.PI) / 180;
  const len = Math.hypot(vb.x, vb.y) * (1 - t) + Math.hypot(vc.x, vc.y) * t;
  const half = { x: (Math.cos(ang) * len) / 2, y: (Math.sin(ang) * len) / 2 };
  const want = [
    { x: mid.x - half.x, y: mid.y - half.y },
    { x: mid.x + half.x, y: mid.y + half.y },
  ];
  return blended.map((p, i) =>
    aboveGround(translate(p, want[i]!.x - now[i]!.x, want[i]!.y - now[i]!.y), limitFor(b[i]!, c[i]!, t)),
  );
}

type Pt = { x: number; y: number };

type GripRef = { fighter: 0 | 1; joint: string };

const CHAIN: Record<string, [Bone, Bone]> = {
  handL: ['upperArmL', 'forearmL'],
  handR: ['upperArmR', 'forearmR'],
  footL: ['thighL', 'shinL'],
  footR: ['thighR', 'shinR'],
};

/** Más lejos que esto del otro cuerpo no es un agarre de verdad: no se fuerza. */
const GRIP_REACH = 24;

/** Articulación del otro luchador más cercana a `p`, y dónde queda `p` respecto a ella. */
function anchorOf(other: Pose, p: Pt): { joint: string; dx: number; dy: number; d: number } {
  let best = { joint: 'pelvis', dx: 0, dy: 0, d: Infinity };
  for (const [joint, q] of Object.entries(solve(other))) {
    const d = Math.hypot(p.x - q.x, p.y - q.y);
    if (d < best.d) best = { joint, dx: p.x - q.x, dy: p.y - q.y, d };
  }
  return best;
}

/**
 * Los agarres que siguen en los dos pasos no se sueltan a mitad del movimiento:
 * la mano (o el pie) se lleva, doblando el codo o la rodilla, al mismo punto del
 * otro cuerpo en que estaba, pasando poco a poco de su sitio en `b` al de `c`.
 */
export function holdGrips(
  blended: Pose[],
  b: Pose[],
  c: Pose[],
  gripsB: GripRef[] = [],
  gripsC: GripRef[] = [],
  t: number,
): Pose[] {
  if (blended.length !== 2 || b.length !== 2 || c.length !== 2) return blended;
  const out = [...blended];
  for (const g of gripsB) {
    const chain = CHAIN[g.joint];
    if (!chain || !gripsC.some((h) => h.fighter === g.fighter && h.joint === g.joint)) continue;
    const o = 1 - g.fighter;
    const end = g.joint as keyof ReturnType<typeof solve>;
    const atB = anchorOf(b[o]!, solve(b[g.fighter]!)[end]);
    const atC = anchorOf(c[o]!, solve(c[g.fighter]!)[end]);
    if (atB.d > GRIP_REACH || atC.d > GRIP_REACH) continue;
    const now = solve(out[o]!) as Record<string, Pt>;
    const pb = { x: now[atB.joint]!.x + atB.dx, y: now[atB.joint]!.y + atB.dy };
    const pc = { x: now[atC.joint]!.x + atC.dx, y: now[atC.joint]!.y + atC.dy };
    const target = { x: pb.x + (pc.x - pb.x) * t, y: pb.y + (pc.y - pb.y) * t };
    const pose = out[g.fighter]!;
    out[g.fighter] = solveTwoBone(pose, chain[0], chain[1], target, currentBend(pose, chain[0], chain[1]));
  }
  return out;
}
