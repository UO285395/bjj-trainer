import { type Point, type Pose, type Side, solve } from './model';

// Avatar estilo «juguete»: figura de vinilo con cabeza grande, miembros de
// grosor uniforme, sombra suave en la espalda de cada pieza y contorno fino del
// mismo tono. El frente se reconoce por la cara, la solapa clara y el nudo del
// cinturón; la espalda, por la sombra y el pelo.

export type Part = {
  key: string;
  d: string;
  fill: string;
  stroke: string;
  /** Grosor del trazo; por defecto 1. */
  width?: number;
  z: number;
  opacity?: number;
  /** Silueta a la que se recorta la pieza (el faldón solo tapa los muslos propios). */
  clip?: string;
  fighter: number;
};

export type Palette = {
  /** Color del kimono; también marca los agarres de ese luchador. */
  main: string;
  skin: string;
  hair: string;
  belt: string;
};

export const FIGHTER_COLORS: Palette[] = [
  { main: '#F2A93B', skin: '#F2C9A0', hair: '#2A2118', belt: '#1A1814' },
  { main: '#3FB59A', skin: '#C68A62', hair: '#17130F', belt: '#1A1814' },
];

const HEAD_R = 17;
const HAND_R = 6.8;
const FOOT_SCALE = 1.2;
const THICK = 1.3;
const SAMPLES = 16;

// ---------- color ----------
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export function mix(a: string, b: string, t: number): string {
  const A = hex(a);
  const B = hex(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i]! - v) * t).toString(16).padStart(2, '0')).join('');
}
const far = (c: string) => mix(c, '#101208', 0.38);
const shadeOf = (c: string) => mix(c, '#0B0C08', 0.3);
const lineOf = (c: string) => mix(c, '#000000', 0.38);
const lightOf = (c: string) => mix(c, '#FFFFFF', 0.45);

// ---------- geometría ----------
type V = Point;
const f = (n: number) => Math.round(n * 10) / 10;
const add = (a: V, b: V, k = 1): V => ({ x: a.x + b.x * k, y: a.y + b.y * k });
const sub = (a: V, b: V): V => ({ x: a.x - b.x, y: a.y - b.y });
const unit = (a: V): V => {
  const l = Math.hypot(a.x, a.y) || 1;
  return { x: a.x / l, y: a.y / l };
};
const lerp = (a: V, b: V, t: number): V => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
const path = (pts: V[]) => 'M' + pts.map((p) => `${f(p.x)},${f(p.y)}`).join(' L') + ' Z';
const circle = (c: V, r: number) =>
  path(Array.from({ length: 18 }, (_, k) => add(c, { x: Math.cos((k * Math.PI) / 9), y: Math.sin((k * Math.PI) / 9) }, r)));

type Width = (u: number) => number;
/** Interpolación lineal por tramos: [[u, valor], ...]. */
const pw =
  (...k: [number, number][]): Width =>
  (u) => {
    if (u <= k[0]![0]) return k[0]![1];
    for (let i = 1; i < k.length; i++) {
      const [u1, v1] = k[i]!;
      const [u0, v0] = k[i - 1]!;
      if (u <= u1) return v0 + ((v1 - v0) * (u - u0)) / (u1 - u0 || 1);
    }
    return k[k.length - 1]![1];
  };
const thick =
  (w: Width): Width =>
  (u) =>
    w(u) * THICK;

type Sample = { p: V; t: V; u: number };

function catmull(p0: V, p1: V, p2: V, p3: V, t: number): V {
  const t2 = t * t;
  const t3 = t2 * t;
  const c = (a: number, b: number, c2: number, d: number) =>
    0.5 * (2 * b + (-a + c2) * t + (2 * a - 5 * b + 4 * c2 - d) * t2 + (-a + 3 * b - 3 * c2 + d) * t3);
  return { x: c(p0.x, p1.x, p2.x, p3.x), y: c(p0.y, p1.y, p2.y, p3.y) };
}

/** Puntos a lo largo de una curva suave que pasa por `pts` (u de 0 a 1). */
function sampleChain(pts: V[], n: number, straight = false): Sample[] {
  const m = pts.length - 1;
  const at = (u: number): V => {
    const seg = Math.min(Math.floor(u * m), m - 1);
    const t = u * m - seg;
    const p1 = pts[seg]!;
    const p2 = pts[seg + 1]!;
    if (straight) return lerp(p1, p2, t);
    const p0 = pts[seg - 1] ?? add(p1, sub(p1, p2));
    const p3 = pts[seg + 2] ?? add(p2, sub(p2, p1));
    return catmull(p0, p1, p2, p3, t);
  };
  return Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    return { p: at(u), t: unit(sub(at(Math.min(1, u + 0.01)), at(Math.max(0, u - 0.01)))), u };
  });
}

/** Quita los bucles que forma el borde interior al doblar mucho una articulación. */
function untangle(pts: V[]): V[] {
  const cross = (o: V, a: V, b: V) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const out = [...pts];
  for (let i = 0; i < out.length - 3; i++) {
    for (let j = out.length - 2; j > i + 1; j--) {
      const p1 = out[i]!;
      const p2 = out[i + 1]!;
      const q1 = out[j]!;
      const q2 = out[j + 1]!;
      const d1 = cross(q1, q2, p1);
      const d2 = cross(q1, q2, p2);
      const d3 = cross(p1, p2, q1);
      const d4 = cross(p1, p2, q2);
      if (d1 * d2 < 0 && d3 * d4 < 0) {
        const t = d1 / (d1 - d2);
        out.splice(i + 1, j - i, lerp(p1, p2, t));
        break;
      }
    }
  }
  return out;
}

type Caps = 'both' | 'end' | 'none';

/**
 * Silueta de un cuerpo que sigue una cadena de puntos. `a(u)` y `b(u)` son
 * distancias con signo a lo largo de `front` (la normal anatómica): positivo
 * hacia delante (pecho, rodilla, punta del pie), negativo hacia la espalda.
 */
function band(
  S: Sample[],
  front: (t: V) => V,
  a: Width,
  b: Width,
  u0 = 0,
  u1 = 1,
  caps: Caps = 'none',
): string {
  const ss = S.filter((x) => x.u >= u0 - 1e-6 && x.u <= u1 + 1e-6);
  const A = untangle(ss.map((x) => add(x.p, front(x.t), a(x.u))));
  const B = untangle(ss.map((x) => add(x.p, front(x.t), b(x.u))));
  const cap = (x: Sample, dir: number, from: number, to: number) => {
    const F = front(x.t);
    const c = add(x.p, F, (from + to) / 2);
    const r = (from - to) / 2;
    return Array.from({ length: 7 }, (_, k) => {
      const th = (Math.PI * (k + 1)) / 8;
      return add(add(c, F, r * Math.cos(th)), x.t, dir * Math.abs(r) * Math.sin(th));
    });
  };
  const first = ss[0]!;
  const last = ss[ss.length - 1]!;
  const out = [...A];
  if (caps !== 'none') out.push(...cap(last, 1, a(last.u), b(last.u)));
  out.push(...B.reverse());
  if (caps === 'both') out.push(...cap(first, -1, b(first.u), a(first.u)));
  return path(out);
}

// ---------- figura ----------

const DEFAULT_LAYER = { far: 0, torso: 1, near: 2 };

export function poseParts(pose: Pose, palette: Palette, fighter: number): Part[] {
  const id = `f${fighter}`;
  const j = solve(pose);
  const s = pose.far === 'L' ? 1 : -1;
  // Normal anatómica de un hueso que apunta hacia abajo (pierna, brazo): hacia
  // delante al estar de pie. Para los que apuntan hacia arriba se invierte.
  const down = (t: V): V => ({ x: t.y * s, y: -t.x * s });
  const upward = (t: V): V => ({ x: -t.y * s, y: t.x * s });
  const near: Side = pose.far === 'L' ? 'R' : 'L';
  const layer = (limb: 'armL' | 'armR' | 'legL' | 'legR' | 'torso', fallback: number) =>
    pose.layers?.[limb] ?? fallback;
  const sideLayer = (side: Side) => (side === pose.far ? DEFAULT_LAYER.far : DEFAULT_LAYER.near);

  const parts: Part[] = [];
  const put = (key: string, d: string, fill: string, z: number, extra: Partial<Part> = {}) =>
    parts.push({ key: `${id}-${key}`, d, fill, stroke: lineOf(fill), width: 0.8, z, fighter, ...extra });
  const flat = { stroke: 'none', width: 0 };

  /** Pieza con su sombra suave en la espalda, recortada a la propia pieza. */
  const shaded = (key: string, S: Sample[], front: (t: V) => V, fr: Width, bk: Width, color: string, z: number, caps: Caps) => {
    const d = band(S, front, fr, (u) => -bk(u), 0, 1, caps);
    put(key, d, color, z);
    put(`${key}S`, band(S, front, (u) => -bk(u) * 0.1, (u) => -bk(u) - 2), shadeOf(color), z + 0.001, {
      ...flat,
      opacity: 0.35,
      clip: d,
    });
    return d;
  };

  const legs: [string, number][] = [];
  for (const side of [pose.far, near] as Side[]) {
    const gi = side === pose.far ? far(palette.main) : palette.main;
    const skin = side === pose.far ? far(palette.skin) : palette.skin;

    // Pierna: pantalón ancho, tobillo y pie con talón y dedos.
    const lz = layer(`leg${side}`, sideLayer(side));
    const hip = lerp(j.pelvis, j[`hip${side}`], 0.4);
    const knee = j[`knee${side}`];
    const foot = j[`foot${side}`];
    const ankle = lerp(knee, foot, 0.84);
    const shin = unit(sub(foot, knee));
    const toe = down(shin);
    const F = (a: number, b: number) => add(add(foot, toe, a * FOOT_SCALE), shin, b * FOOT_SCALE);
    put(
      `foot${side}`,
      path([F(-2.5, -6), F(-4.2, -1), F(-4.6, 1.8), F(-3, 3.6), F(4, 3.8), F(10, 3.6), F(12.6, 2.6), F(12.8, 0.8), F(10, -0.8), F(4.5, -2.2), F(3, -6)]),
      skin,
      lz - 0.03,
    );
    put(`shin${side}`, band(sampleChain([lerp(knee, foot, 0.6), foot], 4, true), down, () => 3.4, () => -3.6), skin, lz - 0.031);
    const SL = sampleChain([hip, lerp(hip, knee, 0.5), knee, lerp(knee, ankle, 0.45), ankle], SAMPLES);
    const legFront = thick(pw([0, 9], [0.3, 7.5], [1, 7]));
    const legBack = thick(pw([0, 10], [0.3, 7.5], [1, 7]));
    // Sin contorno: la pierna sale de debajo de la chaqueta.
    const legD = band(SL, down, legFront, (u) => -legBack(u), 0, 1, 'end');
    put(`leg${side}`, legD, gi, lz, flat);
    put(`leg${side}S`, band(SL, down, (u) => -legBack(u) * 0.1, (u) => -legBack(u) - 2, 0.1, 1), shadeOf(gi), lz + 0.001, {
      ...flat,
      opacity: 0.35,
      clip: legD,
    });
    // Rodillera del pantalón, delante: marca hacia dónde dobla la pierna.
    put(`knee${side}`, band(SL, down, (u) => legFront(u) - 0.3, (u) => legFront(u) - 4.2, 0.41, 0.6), mix(gi, '#0B0C08', 0.16), lz + 0.003, {
      ...flat,
      clip: legD,
    });
    legs.push([legD, lz]);

    // Brazo: manga, muñeca y puño.
    const az = layer(`arm${side}`, sideLayer(side)) + 0.1;
    const shoulder = j[`shoulder${side}`];
    const elbow = j[`elbow${side}`];
    const hand = j[`hand${side}`];
    const wrist = lerp(elbow, hand, 0.8);
    const fore = unit(sub(hand, elbow));
    put(
      `hand${side}`,
      band(sampleChain([add(hand, fore, -HAND_R * 0.3), add(hand, fore, HAND_R * 0.75)], 3, true), down, () => HAND_R * 0.95, () => -HAND_R * 0.8, 0, 1, 'both'),
      skin,
      az - 0.01,
    );
    put(`wrist${side}`, band(sampleChain([wrist, hand], 2, true), down, () => 3, () => -3), skin, az - 0.02);
    const SA = sampleChain([shoulder, lerp(shoulder, elbow, 0.5), elbow, lerp(elbow, wrist, 0.5), wrist], SAMPLES);
    shaded(`arm${side}`, SA, down, thick(() => 6), thick(() => 6), gi, az, 'both');
  }

  // Tronco: chaqueta con faldón, solapa y cinturón anudado delante.
  const tz = layer('torso', DEFAULT_LAYER.torso);
  const up = unit(sub(j.neck, j.pelvis));
  const chest = upward(up);
  const ST = sampleChain([add(j.pelvis, up, -11), j.pelvis, lerp(j.pelvis, j.neck, 0.45), lerp(j.pelvis, j.neck, 0.8), add(j.neck, up, 2)], SAMPLES);
  const tf = thick(pw([0, 12], [0.5, 12.5], [0.9, 11], [1, 7]));
  const tb = thick(pw([0, 12], [0.5, 12], [0.9, 11], [1, 7]));
  const headUp = unit(sub(j.head, j.neck));
  const headFront = upward(headUp);
  put('neck', band(sampleChain([j.neck, j.head], 2, true), upward, () => 4.6, () => -4.8), palette.skin, tz - 0.01);
  shaded('torso', ST, upward, tf, tb, palette.main, tz, 'end');
  // El faldón tapa el arranque de los muslos propios que van delante, recortado
  // a la silueta de cada pierna para no tapar nunca al otro luchador.
  legs.forEach(([legD, lz], i) => {
    if (lz <= tz) return;
    put(`skirt${i}`, band(ST, upward, tf, (u) => -tb(u), 0, 0.36), palette.main, lz + 0.004, { clip: legD });
    put(`skirt${i}S`, band(ST, upward, (u) => -tb(u) * 0.1, (u) => -tb(u) - 2, 0.04, 0.36), shadeOf(palette.main), lz + 0.005, {
      ...flat,
      opacity: 0.35,
      clip: legD,
    });
  });
  const lapel = lightOf(palette.main);
  put('lapel', band(ST, upward, (u) => tf(u) - 0.3, (u) => tf(u) - 4.5, 0.32, 0.95), lapel, tz + 0.004, flat);
  put('collar', band(ST, upward, (u) => tf(u) - 0.3, (u) => -tb(u) + 0.3, 0.93, 1), lapel, tz + 0.004, flat);
  put('belt', band(ST, upward, (u) => tf(u) + 0.3, (u) => -tb(u) - 0.3, 0.3, 0.39), palette.belt, tz + 0.005, { width: 0.5 });
  const beltAt = ST.find((x) => x.u >= 0.345)!;
  const knot = add(beltAt.p, chest, tf(0.345) + 1.5);
  const hang = unit(add({ x: 0, y: 1 }, up, -0.6));
  [-0.35, 0.35].forEach((dx, i) => {
    const tail = add(add(knot, hang, 10), chest, dx * 6 + 1.5);
    put(`tail${i}`, band(sampleChain([knot, tail], 2, true), down, () => 1.7, () => -1.7, 0, 1, 'both'), palette.belt, tz + 0.007, { width: 0.5 });
  });
  put('knot', circle(knot, 3), palette.belt, tz + 0.008, { width: 0.5 });

  // Cabeza: grande, con ojo y ceja mirando hacia delante y pelo en punta detrás.
  const c = add(j.head, headUp, HEAD_R - 9);
  const H = (a: number, b: number) => add(add(c, headFront, a * HEAD_R), headUp, b * HEAD_R);
  // La cabeza va por encima de ambos troncos (nunca queda escondida tras el
  // compañero) y por debajo de los miembros cercanos, que sí pueden taparla.
  const hz = tz + 0.5;
  const skull: V[] = [];
  for (let k = 0; k < 36; k++) {
    const th = (k / 36) * Math.PI * 2;
    let a = Math.cos(th);
    let b = Math.sin(th);
    if (b < 0 && a > -0.3) {
      // barbilla un poco adelantada
      a *= 1 - 0.12 * b;
      b *= 1 - 0.12 * b;
    }
    skull.push(H(a, b));
  }
  put('head', path(skull), palette.skin, hz);
  const hair: V[] = [];
  for (let k = 0; k <= 20; k++) {
    const th = ((40 + (k / 20) * 185) * Math.PI) / 180;
    const r = k % 4 === 2 ? 1.22 : 1.08;
    hair.push(H(Math.cos(th) * r, Math.sin(th) * r));
  }
  hair.push(H(-0.55, -0.2), H(-0.25, 0.35), H(0.35, 0.55));
  put('hair', path(hair), palette.hair, hz + 0.005);
  put('eyeW', circle(H(0.5, 0.12), HEAD_R * 0.26), '#FFFFFF', hz + 0.01);
  put('eyeP', circle(H(0.61, 0.1), HEAD_R * 0.13), '#15120E', hz + 0.012, flat);
  put('brow', path([H(0.25, 0.42), H(0.78, 0.36), H(0.78, 0.46), H(0.25, 0.5)]), palette.hair, hz + 0.014, flat);
  return parts;
}

/**
 * Orden de dibujo: primero la capa (redondeada a décimas: brazo encima de
 * pierna, lado cercano encima del tronco), luego el luchador y por último el
 * ajuste fino de cada pieza dentro de su capa. Así los detalles de un luchador
 * (sombras, faldón) nunca se cuelan por encima del otro.
 */
export function sortParts(parts: Part[]): Part[] {
  return parts
    .map((p, i) => ({ p, i }))
    .sort(
      (a, b) =>
        Math.round(a.p.z * 10) - Math.round(b.p.z * 10) ||
        a.p.fighter - b.p.fighter ||
        a.p.z - b.p.z ||
        a.i - b.i,
    )
    .map(({ p }) => p);
}
