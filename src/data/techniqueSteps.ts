import type { StepSpec } from './steps';
import { CHOKE_STEPS } from './steps/chokes';
import { ESCAPE_STEPS } from './steps/escapes';
import { LOCK_STEPS } from './steps/locks';
import { PASS_STEPS } from './steps/passes';
import { SWEEP_STEPS } from './steps/sweeps';
import { TAKEDOWN_STEPS } from './steps/takedowns';
import { TRANSITION_STEPS } from './steps/transitions';

// Pasos de las técnicas del catálogo. Luchador 0 = quien ejecuta, 1 = compañero.
// Las técnicas sin entrada aquí se muestran con su posición de inicio y final.

const collar = { joint: 'neck', of: 1, dx: -3, dy: 6 } as const;

const BASIC_STEPS: Record<string, StepSpec[]> = {
  'scissor-sweep': [
    {
      from: 'closedGuard',
      text: 'Abre la guardia. Agarra el cuello con una mano y la manga del mismo lado con la otra.',
      fighters: [
        {
          angles: { thighL: -60, shinL: 30, thighR: -50, shinR: 40 },
          reach: { handL: collar, handR: { joint: 'handR', of: 1, dx: 2 } },
        },
      ],
      grips: [
        [0, 'handL', 'Cuello'],
        [0, 'handR', 'Manga'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Gamba de lado: la espinilla de arriba cruza su abdomen y la pierna de abajo queda en el suelo junto a su rodilla.',
      fighters: [
        {
          rotate: 8,
          angles: { thighR: -63, shinR: 0, thighL: 10, shinL: 15 },
          reach: {
            handL: collar,
            handR: { joint: 'handR', of: 1, dx: 2 },
            footL: { joint: 'kneeL', of: 1, dx: 8, dy: -4 },
          },
          layers: { legR: 4, armR: 3, armL: 0.5 },
        },
      ],
      grips: [
        [0, 'handL', 'Cuello'],
        [0, 'handR', 'Manga'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Tira de cuello y manga hacia ti mientras la pierna de abajo barre sus rodillas y la de arriba lo empuja como una tijera.',
      fighters: [
        {
          rotate: 8,
          angles: { thighR: -63, shinR: 0, thighL: 10, shinL: 15 },
          reach: {
            handL: collar,
            handR: { joint: 'handR', of: 1, dx: 2 },
            footL: { joint: 'kneeL', of: 1, dx: 8, dy: -4 },
          },
          layers: { legR: 4, armR: 3, armL: 0.5 },
        },
        { rotate: -18, move: [-6, 4] },
      ],
      grips: [
        [0, 'handL', 'Cuello'],
        [0, 'handR', 'Manga'],
      ],
      arrows: [
        { from: { joint: 'head', of: 1, dx: -10 }, to: [128, 140], fighter: 0, bend: -0.3 },
        { from: { joint: 'footL', of: 0, dx: 6 }, to: [250, 196], fighter: 0, bend: 0.2 },
      ],
    },
    { from: 'mount', text: 'Rueda con él sin soltar la manga y termina en la montada.' },
  ],

  'hip-bump': [
    {
      from: 'closedGuard',
      text: 'Cuando se incorpore, abre la guardia y siéntate de golpe apoyando una mano detrás.',
      fighters: [
        {
          rotate: 52,
          move: [8, 2],
          reach: {
            handL: [118, 197],
            handR: { joint: 'shoulderR', of: 1, dx: -2, dy: 2 },
            footL: [198, 198],
            footR: [206, 199],
          },
          bend: { handL: 1 },
        },
        { angles: { spine: -92, neck: -95 } },
      ],
      grips: [
        [0, 'handL', 'Base'],
        [0, 'handR', 'Sobre el hombro'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Rodea su brazo por encima del hombro y empuja con la cadera hacia arriba y hacia él.',
      fighters: [
        {
          rotate: 66,
          move: [22, -8],
          reach: {
            handL: [128, 197],
            handR: { joint: 'shoulderR', of: 1, dx: 4, dy: 6 },
            footL: [196, 198],
            footR: [204, 199],
          },
          bend: { handL: 1 },
        },
        { move: [6, 0], angles: { spine: -62, neck: -55 } },
      ],
      grips: [[0, 'handR', 'Sobre el hombro']],
      arrows: [
        {
          from: { joint: 'pelvis', of: 0, dx: 4 },
          to: { joint: 'neck', of: 1, dx: 20, dy: -10 },
          fighter: 0,
          bend: -0.25,
        },
      ],
    },
    { from: 'mount', text: 'Sigue la rotación hasta quedar sentado en la montada.' },
  ],

  'armbar-guard': [
    {
      from: 'closedGuard',
      text: 'Controla un brazo: agarra la manga y el codo y pégalos a tu pecho.',
      fighters: [{ reach: { handL: { joint: 'elbowR', of: 1 }, handR: { joint: 'handR', of: 1, dx: 4 } } }],
      grips: [
        [0, 'handL', 'Codo'],
        [0, 'handR', 'Manga'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Abre la guardia, pon el pie en su cadera y gira el cuerpo para quedar perpendicular a él.',
      fighters: [
        {
          rotate: 12,
          reach: {
            handL: { joint: 'elbowR', of: 1 },
            handR: { joint: 'handR', of: 1, dx: 4 },
            footR: { joint: 'hipR', of: 1, dx: 6, dy: 4 },
            footL: { joint: 'shoulderR', of: 1, dx: 10, dy: 14 },
          },
        },
      ],
      grips: [
        [0, 'handL', 'Codo'],
        [0, 'handR', 'Manga'],
        [0, 'footR', 'Cadera'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Pasa la pierna por encima de su cabeza y aprieta las rodillas.',
      fighters: [
        {
          rotate: 18,
          reach: {
            handL: { joint: 'elbowR', of: 1 },
            handR: { joint: 'handR', of: 1, dx: 4 },
            footR: { joint: 'hipR', of: 1, dx: 6, dy: 4 },
            footL: { joint: 'head', of: 1, dx: -22, dy: 12 },
          },
          bend: { footL: -1 },
          layers: { legL: 4 },
        },
        { rotate: -12, move: [-4, 4] },
      ],
      grips: [
        [0, 'handL', 'Codo'],
        [0, 'handR', 'Manga'],
      ],
      arrows: [{ from: [196, 56], to: [150, 92], fighter: 0, bend: 0.3 }],
    },
    {
      from: 'closedGuard',
      text: 'Pulgar hacia arriba y eleva la cadera para extender el brazo.',
      fighters: [
        {
          rotate: 18,
          move: [0, -6],
          reach: {
            handL: { joint: 'handR', of: 1, dx: -4 },
            handR: { joint: 'handR', of: 1, dx: 4 },
            footR: { joint: 'hipR', of: 1, dx: 6, dy: 4 },
            footL: { joint: 'head', of: 1, dx: -22, dy: 12 },
          },
          bend: { footL: -1 },
          layers: { legL: 4 },
        },
        { rotate: -22, move: [-8, 8], reach: { handR: { joint: 'neck', of: 0, dx: 24, dy: -6 } } },
      ],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Muñeca'],
      ],
      arrows: [
        {
          from: { joint: 'pelvis', of: 0, dy: 8 },
          to: { joint: 'pelvis', of: 0, dx: 10, dy: -26 },
          fighter: 0,
          bend: -0.2,
        },
      ],
    },
  ],

  'rear-naked-choke': [
    {
      from: 'backControl',
      text: 'Desde la espalda con los ganchos puestos, controla con el cinturón de seguridad.',
      fighters: [
        {
          reach: {
            handL: { joint: 'shoulderL', of: 1, dx: 18, dy: 6 },
            handR: { joint: 'shoulderR', of: 1, dx: 14, dy: 14 },
          },
        },
      ],
      grips: [[0, 'handL', 'Cinturón de seguridad']],
    },
    {
      from: 'backControl',
      text: 'Pasa el brazo de arriba bajo su barbilla hasta que el codo quede en el centro del cuello.',
      fighters: [
        {
          reach: {
            handL: { joint: 'neck', of: 1, dx: 22, dy: -2 },
            handR: { joint: 'shoulderR', of: 1, dx: 14, dy: 14 },
          },
        },
      ],
      grips: [[0, 'handL', 'Bajo la barbilla']],
    },
    {
      from: 'backControl',
      text: 'Agarra tu bíceps contrario, pon la otra mano detrás de su cabeza y aprieta juntando los codos.',
      fighters: [
        {
          reach: {
            handL: { joint: 'neck', of: 1, dx: 22, dy: -2 },
            handR: { joint: 'head', of: 1, dx: -6, dy: -4 },
          },
          bend: { handR: -1 },
        },
        { rotate: -6 },
      ],
      grips: [
        [0, 'handL', 'Bíceps'],
        [0, 'handR', 'Nuca'],
      ],
      arrows: [
        {
          from: { joint: 'elbowL', of: 0, dy: -6 },
          to: { joint: 'neck', of: 0, dx: 4, dy: -4 },
          fighter: 0,
          bend: -0.3,
        },
      ],
    },
  ],

  'americana-mount': [
    {
      from: 'mount',
      text: 'Cuando empuje, atrapa su muñeca y llévala al suelo junto a su cabeza.',
      fighters: [
        { reach: { handL: { joint: 'handL', of: 1 } }, angles: { spine: -100 } },
        { reach: { handL: [128, 168] }, angles: { upperArmL: -70 } },
      ],
      grips: [[0, 'handL', 'Muñeca']],
    },
    {
      from: 'mount',
      text: 'Mete la otra mano por debajo de su brazo y agarra tu propia muñeca (figura de cuatro).',
      fighters: [
        {
          angles: { spine: -112, neck: -120 },
          reach: { handL: [136, 176], handR: [140, 176] },
        },
        { reach: { handL: [134, 174], handR: [170, 140] } },
      ],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Tu muñeca'],
      ],
    },
    {
      from: 'mount',
      text: 'Arrastra su mano hacia su cadera pegada al suelo y levanta el codo como si pintaras.',
      fighters: [
        {
          angles: { spine: -112, neck: -120 },
          reach: { handL: [150, 182], handR: [154, 180] },
        },
        { reach: { handL: [150, 182], handR: [170, 140] } },
      ],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Tu muñeca'],
      ],
      arrows: [{ from: [132, 186], to: [166, 190], fighter: 0, bend: 0.2 }],
    },
  ],

  upa: [
    {
      from: 'mount*',
      text: 'Atrapa su brazo con las dos manos y bloquea con tu pie el suyo del mismo lado.',
      fighters: [
        {
          reach: {
            handL: { joint: 'elbowR', of: 1 },
            handR: { joint: 'handR', of: 1 },
            footR: { joint: 'footR', of: 1, dx: 8 },
          },
        },
      ],
      grips: [
        [0, 'handL', 'Brazo'],
        [0, 'handR', 'Muñeca'],
        [0, 'footR', 'Pie'],
      ],
    },
    {
      from: 'mount*',
      text: 'Puentea alto con la cadera, mirando hacia el lado atrapado.',
      fighters: [
        {
          move: [0, -12],
          angles: { spine: 196, thighL: -60, shinL: 80, thighR: -50, shinR: 70 },
          reach: { handL: { joint: 'elbowR', of: 1 }, handR: { joint: 'handR', of: 1 } },
        },
        { move: [0, -14], rotate: -20 },
      ],
      grips: [
        [0, 'handL', 'Brazo'],
        [0, 'handR', 'Muñeca'],
      ],
      arrows: [
        {
          from: { joint: 'pelvis', of: 0, dy: 12 },
          to: { joint: 'pelvis', of: 0, dx: -10, dy: -30 },
          fighter: 0,
          bend: 0.2,
        },
      ],
    },
    { from: 'closedGuard*', text: 'Rueda por encima de tu hombro y quedas dentro de su guardia.' },
  ],
  'kimura-guard': [
    {
      from: 'closedGuard',
      text: 'Cuando apoye una mano en el suelo, agarra su muñeca con la mano del mismo lado.',
      fighters: [
        { reach: { handR: { joint: 'handR', of: 1, dx: 3, dy: -3 } } },
        { angles: { spine: -112, neck: -125 }, reach: { handR: [150, 196] } },
      ],
      grips: [[0, 'handR', 'Muñeca']],
    },
    {
      from: 'closedGuard',
      text: 'Siéntate, pasa el otro brazo por encima de su hombro y agarra tu propia muñeca (figura de cuatro).',
      fighters: [
        {
          rotate: 34,
          move: [6, 0],
          reach: {
            handR: { joint: 'handR', of: 1, dx: 3, dy: -3 },
            handL: { joint: 'handR', of: 1, dx: -2, dy: -6 },
          },
        },
        { angles: { spine: -112, neck: -125 }, reach: { handR: [150, 196] } },
      ],
      grips: [
        [0, 'handR', 'Muñeca'],
        [0, 'handL', 'Tu muñeca'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Vuelve a tumbarte en ángulo y lleva su mano hacia su espalda, girando el hombro.',
      fighters: [
        {
          rotate: 10,
          reach: {
            handR: { joint: 'handR', of: 1, dx: 3 },
            handL: { joint: 'handR', of: 1, dx: -3, dy: -4 },
          },
        },
        { angles: { spine: -110, neck: -120 }, reach: { handR: [200, 132] }, bend: { handR: -1 } },
      ],
      grips: [
        [0, 'handR', 'Muñeca'],
        [0, 'handL', 'Tu muñeca'],
      ],
      arrows: [{ from: [150, 160], to: [196, 124], fighter: 0, bend: -0.3 }],
    },
  ],

  'triangle-guard': [
    {
      from: 'closedGuard',
      text: 'Empuja un brazo hacia su pecho y deja el otro dentro de tu guardia, controlando la manga.',
      fighters: [
        { reach: { handR: { joint: 'handR', of: 1, dx: 3 }, handL: { joint: 'elbowL', of: 1, dx: 2 } } },
      ],
      grips: [
        [0, 'handR', 'Manga'],
        [0, 'handL', 'Codo'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Sube la pierna por encima del hombro del brazo de fuera y bájale la cabeza.',
      fighters: [
        {
          reach: {
            handR: { joint: 'handR', of: 1, dx: 3 },
            handL: { joint: 'head', of: 1, dx: 2, dy: -8 },
            footL: { joint: 'neck', of: 1, dx: 20, dy: -6 },
          },
          bend: { footL: -1 },
          layers: { legL: 4 },
        },
        { rotate: -14, move: [-4, 4] },
      ],
      grips: [
        [0, 'handR', 'Manga'],
        [0, 'handL', 'Nuca'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Cierra el triángulo con la corva sobre tu otro pie, aprieta las rodillas y tira de su cabeza.',
      fighters: [
        {
          move: [4, -4],
          reach: {
            handR: { joint: 'handR', of: 1, dx: 3 },
            handL: { joint: 'head', of: 1, dx: 2, dy: -8 },
            footL: { joint: 'neck', of: 1, dx: 22, dy: 4 },
            footR: { joint: 'neck', of: 1, dx: 26, dy: 8 },
          },
          bend: { footL: -1, footR: -1 },
          layers: { legL: 4, legR: 4 },
        },
        { rotate: -24, move: [-8, 8] },
      ],
      grips: [
        [0, 'handR', 'Manga'],
        [0, 'handL', 'Nuca'],
      ],
      arrows: [
        {
          from: { joint: 'head', of: 1, dy: -14 },
          to: { joint: 'head', of: 1, dx: -24, dy: 10 },
          fighter: 0,
          bend: -0.3,
        },
      ],
    },
  ],

  'cross-collar-guard': [
    {
      from: 'closedGuard',
      text: 'Mete la primera mano profunda en el cuello, con los dedos por dentro de la solapa.',
      fighters: [{ reach: { handL: { joint: 'neck', of: 1, dx: 4, dy: 4 } } }],
      grips: [[0, 'handL', 'Cuello (dedos dentro)']],
    },
    {
      from: 'closedGuard',
      text: 'Con la otra mano agarra el lado contrario del cuello, con el pulgar por dentro.',
      fighters: [
        {
          reach: {
            handL: { joint: 'neck', of: 1, dx: 4, dy: 4 },
            handR: { joint: 'neck', of: 1, dx: -4, dy: 6 },
          },
        },
      ],
      grips: [
        [0, 'handL', 'Cuello (dedos dentro)'],
        [0, 'handR', 'Cuello (pulgar dentro)'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Tira de él hacia ti con la guardia cerrada y abre los codos para estrangular.',
      fighters: [
        {
          reach: {
            handL: { joint: 'neck', of: 1, dx: 4, dy: 4 },
            handR: { joint: 'neck', of: 1, dx: -4, dy: 6 },
          },
        },
        { rotate: -26, move: [-8, 8] },
      ],
      grips: [
        [0, 'handL', 'Cuello'],
        [0, 'handR', 'Cuello'],
      ],
      arrows: [
        {
          from: { joint: 'elbowL', of: 0, dy: -8 },
          to: { joint: 'elbowL', of: 0, dx: -16, dy: -26 },
          fighter: 0,
          bend: 0.3,
        },
      ],
    },
  ],

  'elbow-knee-escape': [
    {
      from: 'mount*',
      text: 'Gira de lado y mete el codo por dentro, pegado a su rodilla.',
      fighters: [
        {
          angles: { spine: 192 },
          reach: {
            handR: { joint: 'hipR', of: 1, dx: -2, dy: 8 },
            handL: { joint: 'kneeL', of: 1, dx: 4, dy: -14 },
          },
        },
      ],
      grips: [[0, 'handR', 'Cadera']],
    },
    {
      from: 'mount*',
      text: 'Gamba alejando la cadera y mete tu rodilla entre sus piernas.',
      fighters: [
        {
          move: [16, 0],
          angles: { spine: 192, thighL: -95, shinL: 60 },
          reach: {
            handR: { joint: 'hipR', of: 1, dx: -2, dy: 8 },
            handL: { joint: 'kneeL', of: 1, dx: 4, dy: -14 },
          },
        },
      ],
      grips: [[0, 'handR', 'Cadera']],
      arrows: [
        {
          from: { joint: 'pelvis', of: 0, dx: 4, dy: 8 },
          to: { joint: 'pelvis', of: 0, dx: 34, dy: 8 },
          fighter: 0,
          bend: 0.2,
        },
      ],
    },
    {
      from: 'halfGuard',
      text: 'Atrapa su pierna con las tuyas: ya estás en media guardia. Repite al otro lado para la guardia.',
    },
  ],

  'side-control-shrimp': [
    {
      from: 'sideControl*',
      text: 'Encuadra: un antebrazo contra su cuello y la otra mano en su cadera.',
      fighters: [
        {
          reach: {
            handL: { joint: 'neck', of: 1, dx: 6, dy: 8 },
            handR: { joint: 'hipR', of: 1, dx: -4, dy: 2 },
          },
        },
      ],
      grips: [
        [0, 'handL', 'Cuello'],
        [0, 'handR', 'Cadera'],
      ],
    },
    {
      from: 'sideControl*',
      text: 'Puentea y gamba alejando la cadera para crear espacio.',
      fighters: [
        {
          move: [22, 0],
          angles: { thighL: -40, shinL: 70, thighR: -30, shinR: 80 },
          reach: {
            handL: { joint: 'neck', of: 1, dx: 6, dy: 8 },
            handR: { joint: 'hipR', of: 1, dx: -4, dy: 2 },
          },
        },
      ],
      grips: [
        [0, 'handL', 'Cuello'],
        [0, 'handR', 'Cadera'],
      ],
      arrows: [
        {
          from: { joint: 'pelvis', of: 0, dy: 8 },
          to: { joint: 'pelvis', of: 0, dx: 30, dy: 8 },
          fighter: 0,
          bend: 0.2,
        },
      ],
    },
    {
      from: 'sideControl*',
      text: 'Mete la rodilla en el hueco entre los dos y recupera la guardia.',
      fighters: [
        {
          move: [24, 0],
          angles: { thighL: -100, shinL: 20 },
          reach: {
            handL: { joint: 'neck', of: 1, dx: 6, dy: 8 },
            handR: { joint: 'hipR', of: 1, dx: -4, dy: 2 },
          },
          layers: { legL: 4 },
        },
      ],
      grips: [[0, 'handL', 'Cuello']],
    },
    { from: 'closedGuard', text: 'Cierra las piernas alrededor de su cintura: guardia recuperada.' },
  ],

  'double-leg': [
    {
      from: 'standing',
      text: 'Cambia de nivel: baja la cadera doblando las rodillas, con la espalda recta y la cabeza alta.',
      fighters: [
        {
          move: [0, 16],
          angles: {
            spine: -62,
            neck: -55,
            thighR: 35,
            shinR: 115,
            thighL: 150,
            shinL: 80,
            upperArmL: 55,
            forearmL: -15,
            upperArmR: 45,
            forearmR: -25,
          },
        },
      ],
    },
    {
      from: 'doubleLeg',
      text: 'Paso de penetración: rodilla al suelo entre sus pies y la cabeza pegada a su costado.',
      fighters: [
        {
          reach: {
            handL: { joint: 'kneeL', of: 1, dx: 6, dy: -4 },
            handR: { joint: 'kneeR', of: 1, dx: 4, dy: -4 },
          },
        },
      ],
      grips: [
        [0, 'handL', 'Detrás de la rodilla'],
        [0, 'handR', 'Detrás de la rodilla'],
      ],
    },
    {
      from: 'doubleLeg',
      text: 'Levántate empujando con el hombro, tira de sus piernas hacia ti y gira en diagonal.',
      fighters: [
        {
          move: [10, -6],
          angles: { spine: -30 },
          reach: {
            handL: { joint: 'kneeL', of: 1, dx: 6, dy: -4 },
            handR: { joint: 'kneeR', of: 1, dx: 4, dy: -4 },
          },
        },
        { rotate: 28, move: [8, 6] },
      ],
      grips: [
        [0, 'handL', 'Detrás de la rodilla'],
        [0, 'handR', 'Detrás de la rodilla'],
      ],
      arrows: [{ from: { joint: 'head', of: 1, dx: 6 }, to: [262, 160], fighter: 0, bend: 0.3 }],
    },
    { from: 'sideControl', text: 'Acompáñalo al suelo y asienta el control lateral.' },
  ],

  'knee-slice': [
    {
      from: 'halfGuard*',
      text: 'Crossface con un brazo, underhook con el otro, y aplasta sus hombros contra el suelo.',
      fighters: [
        {
          reach: {
            handL: { joint: 'head', of: 1, dx: -12, dy: 8 },
            handR: { joint: 'shoulderR', of: 1, dx: -4, dy: 14 },
          },
        },
      ],
      grips: [
        [0, 'handL', 'Crossface'],
        [0, 'handR', 'Underhook'],
      ],
    },
    {
      from: 'halfGuard*',
      text: 'Corta en diagonal con la rodilla por encima de su muslo, manteniendo el peso en su pecho.',
      fighters: [
        {
          move: [-8, 0],
          angles: { thighR: 160, shinR: 20 },
          reach: {
            handL: { joint: 'head', of: 1, dx: -12, dy: 8 },
            handR: { joint: 'shoulderR', of: 1, dx: -4, dy: 14 },
          },
          layers: { legR: 4 },
        },
      ],
      grips: [
        [0, 'handL', 'Crossface'],
        [0, 'handR', 'Underhook'],
      ],
      arrows: [
        {
          from: { joint: 'kneeR', of: 0, dx: 10 },
          to: { joint: 'kneeR', of: 0, dx: -28, dy: 6 },
          fighter: 0,
          bend: 0.2,
        },
      ],
    },
    { from: 'sideControl', text: 'Saca el pie de atrás y asienta el control lateral.' },
  ],

  'side-to-mount': [
    {
      from: 'sideControl',
      text: 'Controla su cadera con la mano cercana y mantén el pecho pesado sobre él.',
      fighters: [{ reach: { handR: { joint: 'hipR', of: 1, dx: -2, dy: -10 } } }],
      grips: [[0, 'handR', 'Cadera']],
    },
    {
      from: 'sideControl',
      text: 'Pasa la rodilla por encima de su abdomen, deslizándola pegada al cuerpo.',
      fighters: [
        {
          move: [0, -6],
          angles: { thighR: 205, shinR: 150 },
          reach: { handR: { joint: 'hipR', of: 1, dx: -2, dy: -10 } },
          layers: { legR: 4 },
        },
      ],
      grips: [[0, 'handR', 'Cadera']],
      arrows: [{ from: [214, 150], to: [168, 152], fighter: 0, bend: -0.3 }],
    },
    { from: 'mount', text: 'Asienta la montada con las rodillas altas y la cadera pesada.' },
  ],

  'turtle-back-take': [
    {
      from: 'turtle',
      text: 'Cinturón de seguridad: un brazo por encima del hombro y el otro por debajo de la axila.',
      fighters: [
        {
          reach: {
            handL: { joint: 'neck', of: 1, dx: 4, dy: 12 },
            handR: { joint: 'shoulderR', of: 1, dx: 10, dy: 18 },
          },
        },
      ],
      grips: [[0, 'handL', 'Cinturón de seguridad']],
    },
    {
      from: 'turtle',
      text: 'Mete el primer gancho por dentro de su muslo.',
      fighters: [
        {
          reach: {
            handL: { joint: 'neck', of: 1, dx: 4, dy: 12 },
            handR: { joint: 'shoulderR', of: 1, dx: 10, dy: 18 },
            footR: { joint: 'hipR', of: 1, dx: -4, dy: 22 },
          },
          bend: { footR: 1 },
          layers: { legR: 4 },
        },
      ],
      grips: [
        [0, 'handL', 'Cinturón de seguridad'],
        [0, 'footR', 'Gancho'],
      ],
    },
    { from: 'backControl', text: 'Rueda hacia el lado del brazo de abajo y mete el segundo gancho.' },
  ],

  'closed-guard-break': [
    {
      from: 'closedGuard*',
      text: 'Postura: espalda recta, manos en su cintura y codos pegados al cuerpo.',
      fighters: [
        {
          angles: { spine: -92, neck: -95 },
          reach: {
            handL: { joint: 'pelvis', of: 1, dx: -10, dy: -8 },
            handR: { joint: 'pelvis', of: 1, dx: -4, dy: -6 },
          },
        },
      ],
      grips: [
        [0, 'handL', 'Cinturón'],
        [0, 'handR', 'Cinturón'],
      ],
    },
    {
      from: 'closedGuard*',
      text: 'Adelanta un pie y coloca la rodilla en el centro, contra su coxis.',
      fighters: [
        {
          angles: { spine: -92, neck: -95, thighL: 175, shinL: 85 },
          reach: {
            handL: { joint: 'pelvis', of: 1, dx: -10, dy: -8 },
            handR: { joint: 'pelvis', of: 1, dx: -4, dy: -6 },
          },
        },
      ],
      grips: [[0, 'handR', 'Cinturón']],
    },
    {
      from: 'closedGuard*',
      text: 'Empuja su rodilla hacia abajo con una mano y retrocede para abrir sus piernas.',
      fighters: [
        {
          move: [6, 0],
          angles: { spine: -98, neck: -100, thighL: 175, shinL: 85 },
          reach: { handR: { joint: 'kneeR', of: 1, dx: -4, dy: 4 } },
        },
        { angles: { thighL: -20, shinL: 30, thighR: -10, shinR: 40 } },
      ],
      grips: [[0, 'handR', 'Rodilla']],
      arrows: [
        {
          from: { joint: 'kneeR', of: 1, dy: -8 },
          to: { joint: 'kneeR', of: 1, dx: 6, dy: 22 },
          fighter: 0,
          bend: 0.3,
        },
      ],
    },
  ],

  'guillotine-guard': [
    {
      from: 'closedGuard',
      text: 'Cuando baje la cabeza, rodea su cuello con el brazo, con el antebrazo bajo la barbilla.',
      fighters: [
        { reach: { handL: { joint: 'neck', of: 1, dx: 4, dy: 10 } } },
        { rotate: -38, move: [-12, 10] },
      ],
      grips: [[0, 'handL', 'Bajo la barbilla']],
    },
    {
      from: 'closedGuard',
      text: 'Junta las manos: la otra agarra la muñeca del brazo que rodea el cuello.',
      fighters: [
        {
          reach: {
            handL: { joint: 'neck', of: 1, dx: 4, dy: 10 },
            handR: { joint: 'neck', of: 1, dx: 2, dy: 12 },
          },
        },
        { rotate: -38, move: [-12, 10] },
      ],
      grips: [
        [0, 'handL', 'Bajo la barbilla'],
        [0, 'handR', 'Muñeca'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Cierra la guardia, estira la cadera y tira del antebrazo hacia arriba.',
      fighters: [
        {
          rotate: -6,
          reach: {
            handL: { joint: 'neck', of: 1, dx: 4, dy: 10 },
            handR: { joint: 'neck', of: 1, dx: 2, dy: 12 },
          },
        },
        { rotate: -38, move: [-12, 10] },
      ],
      grips: [
        [0, 'handL', 'Bajo la barbilla'],
        [0, 'handR', 'Muñeca'],
      ],
      arrows: [
        {
          from: { joint: 'neck', of: 1, dy: 18 },
          to: { joint: 'neck', of: 1, dx: -16, dy: -16 },
          fighter: 0,
          bend: 0.3,
        },
      ],
    },
  ],
};

export const TECHNIQUE_STEPS: Record<string, StepSpec[]> = {
  ...BASIC_STEPS,
  ...SWEEP_STEPS,
  ...PASS_STEPS,
  ...LOCK_STEPS,
  ...CHOKE_STEPS,
  ...ESCAPE_STEPS,
  ...TAKEDOWN_STEPS,
  ...TRANSITION_STEPS,
};
