import { type Bone, type Pose, type Side, mirrorPose } from './model';
import type { Frame } from './shapes';

// Posiciones base del catálogo. Los ángulos son absolutos: 0 = derecha,
// 90 = abajo, -90 = arriba, 180 = izquierda. El luchador 0 (azul) suele ser
// quien ejecuta la técnica.

type Angles = Partial<Record<Bone, number>>;

const NEUTRAL: Record<Bone, number> = {
  spine: -90,
  neck: -90,
  shoulderL: 90,
  shoulderR: 90,
  upperArmL: 90,
  upperArmR: 90,
  forearmL: 90,
  forearmR: 90,
  hipL: 90,
  hipR: 90,
  thighL: 90,
  thighR: 90,
  shinL: 90,
  shinR: 90,
};

export function pose(x: number, y: number, far: Side, angles: Angles, layers?: Pose['layers']): Pose {
  return { x, y, far, angles: { ...NEUTRAL, ...angles }, layers };
}

const CENTER = 160;
const flip = (p: Pose) => mirrorPose(p, CENTER);

// De pie, mirando a la derecha, en guardia.
const standingRight = pose(122, 118, 'L', {
  spine: -78,
  neck: -70,
  upperArmR: 55,
  forearmR: -25,
  upperArmL: 70,
  forearmL: -10,
  thighR: 70,
  shinR: 100,
  thighL: 105,
  shinL: 95,
});

// Tumbado boca arriba con la cabeza a la izquierda.
const supine = (x: number, a: Angles = {}) =>
  pose(x, 186, 'L', {
    spine: 186,
    neck: 192,
    shoulderL: 0,
    shoulderR: 0,
    upperArmL: -60,
    forearmL: -100,
    upperArmR: -40,
    forearmR: -80,
    hipL: 0,
    hipR: 0,
    thighL: -45,
    shinL: 55,
    thighR: -35,
    shinR: 60,
    ...a,
  });

// De rodillas mirando a la izquierda, tronco erguido.
const kneelingLeft = (x: number, y: number, a: Angles = {}, layers?: Pose['layers']) =>
  pose(
    x,
    y,
    'R',
    {
      spine: -100,
      neck: -110,
      upperArmL: 115,
      forearmL: 165,
      upperArmR: 105,
      forearmR: 160,
      thighL: 115,
      shinL: 0,
      thighR: 105,
      shinR: 0,
      ...a,
    },
    layers,
  );

export const POSITIONS = {
  standing: {
    poses: [standingRight, flip(standingRight)],
    caption: 'De pie',
  },
  closedGuard: {
    caption: 'Guardia cerrada',
    poses: [
      supine(160, {
        thighL: -48,
        shinL: 12,
        thighR: -40,
        shinR: 20,
        upperArmL: -20,
        forearmL: -10,
        upperArmR: -10,
        forearmR: 10,
      }),
      kneelingLeft(202, 156, { spine: -95 }),
    ],
  },
  butterflyGuard: {
    caption: 'Guardia mariposa',
    poses: [
      pose(140, 186, 'L', {
        spine: -72,
        neck: -60,
        upperArmL: 20,
        forearmL: 0,
        upperArmR: 30,
        forearmR: 10,
        thighL: -55,
        shinL: 40,
        thighR: -48,
        shinR: 45,
      }),
      kneelingLeft(202, 155, {
        spine: -112,
        neck: -125,
        upperArmL: 150,
        forearmL: 175,
        upperArmR: 140,
        forearmR: 170,
      }),
    ],
  },
  halfGuard: {
    caption: 'Media guardia',
    poses: [
      supine(140, {
        spine: 195,
        neck: 205,
        thighL: -30,
        shinL: 40,
        thighR: 10,
        shinR: 30,
        upperArmL: -20,
        forearmL: 30,
        upperArmR: -30,
        forearmR: 0,
      }),
      kneelingLeft(190, 155, {
        spine: -140,
        neck: -150,
        thighR: 140,
        shinR: -10,
        upperArmL: 130,
        forearmL: 170,
      }),
    ],
  },
  mount: {
    caption: 'Montada',
    poses: [
      kneelingLeft(170, 164, {
        spine: -95,
        neck: -100,
        thighL: 150,
        shinL: 5,
        thighR: 145,
        shinR: 5,
        upperArmL: 105,
        forearmL: 110,
        upperArmR: 100,
        forearmR: 105,
      }),
      supine(196, { upperArmL: -70, forearmL: -110, upperArmR: -55, forearmR: -95 }),
    ],
  },
  sideControl: {
    caption: 'Control lateral',
    poses: [
      kneelingLeft(
        190,
        155,
        {
          spine: -168,
          neck: -175,
          upperArmL: 110,
          forearmL: 170,
          upperArmR: 95,
          forearmR: 180,
          thighL: 95,
          shinL: 0,
          thighR: 80,
          shinR: 10,
        },
        { torso: 3, armR: 3.1, legR: 2, legL: 0 },
      ),
      supine(196, {
        thighL: -50,
        shinL: 50,
        thighR: -55,
        shinR: 45,
        upperArmL: -80,
        forearmL: -30,
        upperArmR: -60,
        forearmR: -20,
      }),
    ],
  },
  kneeOnBelly: {
    caption: 'Rodilla en el vientre',
    poses: [
      pose(
        202,
        119,
        'L',
        {
          spine: -100,
          neck: -110,
          upperArmL: 115,
          forearmL: 150,
          upperArmR: 70,
          forearmR: 20,
          thighR: 100,
          shinR: -10,
          thighL: 50,
          shinL: 95,
        },
        { legR: 3 },
      ),
      supine(214),
    ],
  },
  northSouth: {
    caption: 'Norte-sur',
    poses: [
      pose(
        92,
        168,
        'L',
        {
          spine: -8,
          neck: 0,
          upperArmL: 70,
          forearmL: 20,
          upperArmR: 60,
          forearmR: 10,
          thighL: 140,
          shinL: 15,
          thighR: 120,
          shinR: 5,
        },
        { torso: 3, armR: 3.1, armL: 2.5 },
      ),
      supine(218, { spine: 180, neck: 180, upperArmL: -100, forearmL: -60, upperArmR: -120, forearmR: -60 }),
    ],
  },
  backControl: {
    caption: 'Espalda',
    poses: [
      pose(
        138,
        182,
        'L',
        {
          spine: -100,
          neck: -80,
          upperArmL: 10,
          forearmL: -20,
          upperArmR: 15,
          forearmR: -30,
          thighL: -15,
          shinL: 75,
          thighR: -8,
          shinR: 80,
        },
        { armR: 3.1, legR: 3 },
      ),
      pose(168, 182, 'L', {
        spine: -102,
        neck: -85,
        upperArmL: 70,
        forearmL: 20,
        upperArmR: 80,
        forearmR: 30,
        thighL: -45,
        shinL: 75,
        thighR: -38,
        shinR: 80,
      }),
    ],
  },
  turtle: {
    caption: 'Tortuga',
    poses: [
      kneelingLeft(
        222,
        146,
        {
          spine: -158,
          neck: -170,
          upperArmL: 120,
          forearmL: 175,
          upperArmR: 115,
          forearmR: 180,
          thighL: 100,
          thighR: 90,
        },
        { torso: 3, armR: 3.1 },
      ),
      kneelingLeft(186, 160, {
        spine: 182,
        neck: 150,
        upperArmL: 100,
        forearmL: 180,
        upperArmR: 95,
        forearmR: 180,
        thighL: 95,
        shinL: 0,
        thighR: 85,
        shinR: 0,
      }),
    ],
  },
  doubleLeg: {
    caption: 'Entrada a las piernas',
    poses: [
      pose(108, 140, 'L', {
        spine: -20,
        neck: -5,
        upperArmL: 30,
        forearmL: -40,
        upperArmR: 20,
        forearmR: -50,
        thighR: 90,
        shinR: 175,
        thighL: 160,
        shinL: 115,
      }),
      pose(200, 118, 'R', {
        spine: -105,
        neck: -110,
        upperArmL: 130,
        forearmL: 70,
        upperArmR: 120,
        forearmR: 60,
        thighL: 95,
        shinL: 90,
        thighR: 75,
        shinR: 100,
      }),
    ],
  },
} satisfies Record<string, Frame>;

export type PositionId = keyof typeof POSITIONS;
