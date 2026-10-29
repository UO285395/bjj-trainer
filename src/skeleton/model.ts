// Esqueleto 2D de 15 articulaciones. Las poses se guardan como la posición de la
// pelvis más un ángulo absoluto (grados, 0 = derecha, sentido horario en
// pantalla) por hueso; la longitud de los huesos es fija.

export const JOINTS = [
  'pelvis',
  'neck',
  'head',
  'shoulderL',
  'shoulderR',
  'elbowL',
  'elbowR',
  'handL',
  'handR',
  'hipL',
  'hipR',
  'kneeL',
  'kneeR',
  'footL',
  'footR',
] as const;
export type Joint = (typeof JOINTS)[number];

export type Bone =
  | 'spine'
  | 'neck'
  | 'shoulderL'
  | 'shoulderR'
  | 'upperArmL'
  | 'upperArmR'
  | 'forearmL'
  | 'forearmR'
  | 'hipL'
  | 'hipR'
  | 'thighL'
  | 'thighR'
  | 'shinL'
  | 'shinR';

type BoneDef = { from: Joint; to: Joint; length: number };

// Orden topológico: cada hueso aparece después del que mueve su articulación de origen.
export const BONES: Record<Bone, BoneDef> = {
  spine: { from: 'pelvis', to: 'neck', length: 58 },
  neck: { from: 'neck', to: 'head', length: 17 },
  shoulderL: { from: 'neck', to: 'shoulderL', length: 9 },
  shoulderR: { from: 'neck', to: 'shoulderR', length: 9 },
  upperArmL: { from: 'shoulderL', to: 'elbowL', length: 31 },
  upperArmR: { from: 'shoulderR', to: 'elbowR', length: 31 },
  forearmL: { from: 'elbowL', to: 'handL', length: 29 },
  forearmR: { from: 'elbowR', to: 'handR', length: 29 },
  hipL: { from: 'pelvis', to: 'hipL', length: 7 },
  hipR: { from: 'pelvis', to: 'hipR', length: 7 },
  thighL: { from: 'hipL', to: 'kneeL', length: 41 },
  thighR: { from: 'hipR', to: 'kneeR', length: 41 },
  shinL: { from: 'kneeL', to: 'footL', length: 40 },
  shinR: { from: 'kneeR', to: 'footR', length: 40 },
};
export const BONE_ORDER = Object.keys(BONES) as Bone[];

/** Hueso que termina en cada articulación (la pelvis es la raíz). */
export const BONE_ENDING_AT: Partial<Record<Joint, Bone>> = Object.fromEntries(
  BONE_ORDER.map((b) => [BONES[b].to, b]),
);

export type Side = 'L' | 'R';

export type Pose = {
  x: number;
  y: number;
  angles: Record<Bone, number>;
  /** Lado que queda más lejos del espectador: se dibuja detrás y en tono claro. */
  far: Side;
  /** Ajustes de capa por extremidad (mayor = más delante). */
  layers?: Partial<Record<Limb, number>>;
};

export type Limb = 'armL' | 'armR' | 'legL' | 'legR' | 'torso';

export type Point = { x: number; y: number };
export type JointPositions = Record<Joint, Point>;

const rad = (deg: number) => (deg * Math.PI) / 180;

export function solve(pose: Pose): JointPositions {
  const out = { pelvis: { x: pose.x, y: pose.y } } as JointPositions;
  for (const b of BONE_ORDER) {
    const { from, to, length } = BONES[b];
    const a = rad(pose.angles[b]);
    out[to] = { x: out[from].x + Math.cos(a) * length, y: out[from].y + Math.sin(a) * length };
  }
  return out;
}

/** Huesos que cuelgan (directa o indirectamente) de un hueso, incluido él. */
export function descendants(bone: Bone): Bone[] {
  const result: Bone[] = [bone];
  for (const b of BONE_ORDER) {
    if (result.some((r) => BONES[r].to === BONES[b].from) && !result.includes(b)) result.push(b);
  }
  return result;
}

/** Rota un hueso y arrastra a sus descendientes (cinemática directa). */
export function rotateBone(pose: Pose, bone: Bone, delta: number): Pose {
  const angles = { ...pose.angles };
  for (const b of descendants(bone)) angles[b] = normalize(angles[b] + delta);
  return { ...pose, angles };
}

export function translate(pose: Pose, dx: number, dy: number): Pose {
  return { ...pose, x: pose.x + dx, y: pose.y + dy };
}

/** Rota la figura entera alrededor de la pelvis. */
export function rotatePose(pose: Pose, delta: number): Pose {
  const angles = { ...pose.angles };
  for (const b of BONE_ORDER) angles[b] = normalize(angles[b] + delta);
  return { ...pose, angles };
}

/** Espejo horizontal respecto a la línea vertical x = axis. */
export function mirrorPose(pose: Pose, axis: number): Pose {
  const angles = { ...pose.angles };
  for (const b of BONE_ORDER) angles[b] = normalize(180 - angles[b]);
  return { ...pose, x: 2 * axis - pose.x, angles };
}

export function normalize(deg: number): number {
  const d = ((deg % 360) + 360) % 360;
  return d > 180 ? d - 360 : d;
}

export const angleBetween = (a: Point, b: Point) => (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;

/**
 * Coloca la punta de una cadena de dos huesos en `target` (IK analítica).
 * `bend` elige hacia qué lado se dobla la articulación intermedia.
 */
export function solveTwoBone(pose: Pose, upper: Bone, lower: Bone, target: Point, bend: 1 | -1): Pose {
  const joints = solve(pose);
  const root = joints[BONES[upper].from];
  const l1 = BONES[upper].length;
  const l2 = BONES[lower].length;
  const dx = target.x - root.x;
  const dy = target.y - root.y;
  const d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(l1 - l2) + 0.01), l1 + l2 - 0.01);
  const base = Math.atan2(dy, dx);
  const cosA = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
  const a1 = base - bend * Math.acos(Math.min(1, Math.max(-1, cosA)));
  const mid = { x: root.x + Math.cos(a1) * l1, y: root.y + Math.sin(a1) * l1 };
  const a2 = Math.atan2(target.y - mid.y, target.x - mid.x);
  const angles = { ...pose.angles };
  angles[upper] = normalize((a1 * 180) / Math.PI);
  angles[lower] = normalize((a2 * 180) / Math.PI);
  return { ...pose, angles };
}

/** Sentido actual de flexión de una cadena (para conservarlo al arrastrar). */
export function currentBend(pose: Pose, upper: Bone, lower: Bone): 1 | -1 {
  const diff = normalize(pose.angles[lower] - pose.angles[upper]);
  return diff >= 0 ? 1 : -1;
}

export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  const angles = { ...a.angles };
  for (const bone of BONE_ORDER) {
    angles[bone] = normalize(a.angles[bone] + normalize(b.angles[bone] - a.angles[bone]) * t);
  }
  return { ...a, x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, angles };
}
