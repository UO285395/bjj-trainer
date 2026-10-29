import { type StepSpec, at } from '../steps';

// Escapes y defensas. Luchador 0 = quien escapa o defiende, 1 = compañero.

const frames = { handL: at('neck', 1, 6, 8), handR: at('hipR', 1, -4, 2) };

export const ESCAPE_STEPS: Record<string, StepSpec[]> = {
  'side-control-to-knees': [
    {
      from: 'sideControl*',
      text: 'Encuadra con los antebrazos en su cuello y su cadera.',
      fighters: [{ reach: frames }],
      grips: [
        [0, 'handL', 'Cuello'],
        [0, 'handR', 'Cadera'],
      ],
    },
    {
      from: 'sideControl*',
      text: 'Puentea y mete el brazo de dentro por debajo de su axila (underhook).',
      fighters: [
        {
          move: [0, -10],
          reach: { handL: at('neck', 1, 6, 8), handR: at('shoulderL', 1, 4, -10) },
          bend: { handR: -1 },
        },
        { move: [0, -8] },
      ],
      grips: [[0, 'handR', 'Underhook']],
      arrows: [{ from: at('pelvis', 0, 0, 14), to: at('pelvis', 0, 0, -10), fighter: 0 }],
    },
    {
      from: 'sideControl*',
      text: 'Gira hacia él sobre el hombro y ponte de rodillas, pegado a su costado.',
      fighters: [
        { base: 'turtle:1', move: [10, 2], reach: { handR: at('pelvis', 1, -6, -6) } },
        { base: 'turtle:0', move: [-10, -14], angles: { spine: -130, neck: -140 } },
      ],
      grips: [[0, 'handR', 'Underhook']],
    },
    { from: 'turtle*', text: 'Sigue luchando desde las rodillas por el derribo o la espalda.' },
  ],

  'back-escape': [
    {
      from: 'backControl*',
      text: 'Defiende el cuello con las dos manos y pega la barbilla.',
      fighters: [
        {
          reach: { handL: at('neck', 0, 6, 4), handR: at('neck', 0, 8, 10) },
          bend: { handL: -1, handR: -1 },
        },
      ],
      grips: [
        [0, 'handL', 'Su muñeca'],
        [0, 'handR', 'Su muñeca'],
      ],
    },
    {
      from: 'backControl*',
      text: 'Desliza la espalda hacia el lado del brazo de abajo hasta apoyarla en el suelo.',
      fighters: [
        {
          base: 'closedGuard:0',
          move: [-20, 0],
          reach: { handL: at('neck', 0, 6, -6), handR: at('neck', 0, 10, -4) },
        },
        { rotate: -60, move: [-20, 4] },
      ],
      grips: [[0, 'handL', 'Su muñeca']],
      arrows: [{ from: at('pelvis', 0, 20, -20), to: at('pelvis', 0, -10, 0), fighter: 0, bend: 0.3 }],
    },
    {
      from: 'backControl*',
      text: 'Saca el gancho de encima, pasa la pierna por encima de la suya y gira hacia él.',
      fighters: [
        { base: 'sideControl:0', move: [-10, 4] },
        { base: 'halfGuard:0', move: [-6, 0] },
      ],
    },
    { from: 'halfGuard*', text: 'Termina arriba, en su media guardia.' },
  ],

  'knee-on-belly-escape': [
    {
      from: 'kneeOnBelly*',
      text: 'Empuja su rodilla con las dos manos hacia su espalda.',
      fighters: [{ reach: { handL: at('kneeL', 1, -4, -2), handR: at('kneeL', 1, 2, 2) } }],
      grips: [
        [0, 'handL', 'Rodilla'],
        [0, 'handR', 'Rodilla'],
      ],
    },
    {
      from: 'kneeOnBelly*',
      text: 'Gamba hacia el lado contrario mientras sigues empujando.',
      fighters: [
        {
          move: [24, 0],
          angles: { thighL: -40, shinL: 70, thighR: -30, shinR: 80 },
          reach: { handL: at('kneeL', 1, -4, -2), handR: at('kneeL', 1, 2, 2) },
        },
        { move: [-6, 6], angles: { thighL: 120, shinL: 10 } },
      ],
      grips: [[0, 'handL', 'Rodilla']],
      arrows: [{ from: at('pelvis', 0, -10, 8), to: at('pelvis', 0, 20, 8), fighter: 0, bend: 0.2 }],
    },
    {
      from: 'kneeOnBelly*',
      text: 'Mete la rodilla en el hueco y rodea su cintura con las piernas.',
      fighters: [
        {
          move: [24, 0],
          angles: { thighL: -90, shinL: 20, thighR: -50, shinR: 30 },
          reach: { handL: at('kneeL', 1, -4, -2) },
          layers: { legL: 4 },
        },
        { move: [-6, 6], angles: { thighL: 120, shinL: 10 } },
      ],
    },
    { from: 'closedGuard', text: 'Guardia cerrada.' },
  ],

  'north-south-escape': [
    {
      from: 'northSouth*',
      text: 'Encuadra: los antebrazos contra sus caderas o sus hombros.',
      fighters: [{ reach: { handL: at('shoulderL', 1, 6, 6), handR: at('shoulderL', 1, 14, 2) } }],
      grips: [[0, 'handL', 'Hombro']],
    },
    {
      from: 'northSouth*',
      text: 'Empuja y gamba hacia sus pies para crear espacio.',
      fighters: [
        {
          move: [20, 0],
          angles: { thighL: -40, shinL: 70 },
          reach: { handL: at('shoulderL', 1, 6, 6), handR: at('shoulderL', 1, 14, 2) },
        },
      ],
      grips: [[0, 'handL', 'Hombro']],
      arrows: [{ from: at('pelvis', 0, -10, 8), to: at('pelvis', 0, 16, 8), fighter: 0 }],
    },
    {
      from: 'northSouth*',
      text: 'Gira de lado y mete las rodillas entre los dos para ponerlo delante de tus piernas.',
      fighters: [
        {
          rotate: 30,
          move: [20, -10],
          angles: { thighL: -120, shinL: 0, thighR: -110, shinR: 10 },
          layers: { legL: 4 },
        },
        { move: [14, 0] },
      ],
    },
    { from: 'closedGuard', text: 'Guardia recuperada.' },
  ],

  'turtle-sit-out': [
    {
      from: 'turtle*',
      text: 'Agarra el brazo que te rodea y apoya la mano contraria en el suelo.',
      fighters: [{ reach: { handR: at('elbowL', 1, 0, 2) } }],
      grips: [[0, 'handR', 'Su brazo']],
    },
    {
      from: 'turtle*',
      text: 'Saca una pierna por debajo del cuerpo, hacia el otro lado.',
      fighters: [{ rotate: 20, angles: { thighR: 30, shinR: 20 }, reach: { handR: at('elbowL', 1, 0, 2) } }],
      grips: [[0, 'handR', 'Su brazo']],
      arrows: [{ from: at('kneeR', 0), to: at('kneeR', 0, 34, 0), fighter: 0, bend: 0.3 }],
    },
    {
      from: 'turtle*',
      text: 'Siéntate de lado y gira para encararlo.',
      fighters: [
        { base: 'butterflyGuard:0', move: [-10, 0] },
        { base: 'butterflyGuard:1', move: [10, 0] },
      ],
    },
    { from: 'closedGuard', text: 'Recupera la guardia.' },
  ],

  'granby-roll': [
    {
      from: 'turtle*',
      text: 'Mete el hombro y la cabeza hacia dentro, mirando a tus rodillas.',
      fighters: [{ move: [10, 6], angles: { spine: 200, neck: 120 } }],
    },
    {
      from: 'turtle*',
      text: 'Rueda sobre los hombros, no sobre la cabeza, hacia el lado contrario.',
      fighters: [
        {
          base: 'closedGuard:0',
          rotate: 40,
          move: [-30, -20],
          angles: { thighL: -100, shinL: -40, thighR: -95, shinR: -30 },
        },
      ],
      arrows: [{ from: [180, 120], to: [120, 160], fighter: 0, bend: 0.5 }],
    },
    {
      from: 'turtle*',
      text: 'Termina de espaldas con las piernas delante de él.',
      fighters: [
        { base: 'closedGuard:0', move: [-20, 0], angles: { thighL: -70, shinL: -10, thighR: -60, shinR: 0 } },
      ],
    },
    { from: 'closedGuard', text: 'Guardia recuperada.' },
  ],

  'armbar-defense': [
    {
      from: 'closedGuard*',
      text: 'Junta las manos en cuanto notes el armbar.',
      fighters: [
        { reach: { handL: at('pelvis', 0, -30, -40), handR: at('pelvis', 0, -28, -36) } },
        { rotate: 18, reach: { footL: at('head', 0, -10, 8), handL: at('handL', 0, 0, 2) } },
      ],
      grips: [[0, 'handL', 'Manos juntas']],
    },
    {
      from: 'closedGuard*',
      text: 'Gira el pulgar hacia fuera y levántate sobre los pies.',
      fighters: [
        {
          base: 'standing:1',
          move: [10, 0],
          angles: { spine: -115, neck: -120 },
          reach: { handL: [190, 120], handR: [192, 124] },
        },
        { rotate: 18, reach: { handL: at('handL', 0, 0, 2) } },
      ],
      grips: [[0, 'handL', 'Manos juntas']],
    },
    {
      from: 'closedGuard*',
      text: 'Apila su cadera hacia sus hombros con tu peso para aliviar la presión.',
      fighters: [
        {
          base: 'standing:1',
          move: [-10, 10],
          angles: { spine: -140, neck: -150 },
          reach: { handL: [168, 130], handR: [170, 134] },
        },
        { rotate: -30, move: [-10, -14], reach: { handL: at('handL', 0, 0, 2) } },
      ],
      grips: [[0, 'handL', 'Manos juntas']],
      arrows: [{ from: at('pelvis', 1, 10, -20), to: at('pelvis', 1, -16, -40), fighter: 0, bend: 0.3 }],
    },
  ],

  'triangle-defense': [
    {
      from: 'closedGuard*',
      text: 'Postura recta: espalda erguida y cadera adelantada.',
      fighters: [
        {
          angles: { spine: -92, neck: -95 },
          reach: { handL: at('pelvis', 1, -10, -8), handR: at('pelvis', 1, -4, -6) },
        },
      ],
      grips: [[0, 'handL', 'Cintura']],
    },
    {
      from: 'closedGuard*',
      text: 'Mete el brazo atrapado de vuelta dentro de sus piernas.',
      fighters: [
        {
          angles: { spine: -92, neck: -95 },
          reach: { handL: at('pelvis', 1, -10, -8), handR: at('pelvis', 1, -4, -10) },
        },
        { reach: { footL: at('neck', 0, 4, 2) }, bend: { footL: -1 } },
      ],
      arrows: [{ from: at('handR', 0, 6, -24), to: at('handR', 0, -6, 4), fighter: 0, bend: 0.2 }],
    },
    {
      from: 'closedGuard*',
      text: 'Saca el codo por encima de su pierna y vuelve a postura.',
      fighters: [
        {
          angles: { spine: -92, neck: -95 },
          reach: { handL: at('kneeL', 1, 4, -6), handR: at('pelvis', 1, -4, -6) },
        },
      ],
      grips: [[0, 'handL', 'Rodilla']],
    },
  ],

  'rnc-defense': [
    {
      from: 'backControl*',
      text: 'Pega la barbilla y sube las dos manos al cuello antes de que entre el brazo.',
      fighters: [
        {
          angles: { neck: -60 },
          reach: { handL: at('neck', 0, 8, 2), handR: at('neck', 0, 10, 8) },
          bend: { handL: -1, handR: -1 },
        },
      ],
    },
    {
      from: 'backControl*',
      text: 'Agarra la muñeca del brazo que estrangula con las dos manos.',
      fighters: [
        {
          angles: { neck: -60 },
          reach: { handL: at('handL', 1, 2), handR: at('handL', 1, 4, 4) },
          bend: { handL: -1, handR: -1 },
        },
        { reach: { handL: at('neck', 0, 14, 4) } },
      ],
      grips: [
        [0, 'handL', 'Su muñeca'],
        [0, 'handR', 'Su muñeca'],
      ],
    },
    {
      from: 'backControl*',
      text: 'Tira de su mano hacia abajo, lejos del cuello, y prepara el escape.',
      fighters: [
        {
          angles: { neck: -60 },
          reach: { handL: at('handL', 1, 2), handR: at('handL', 1, 4, 4) },
          bend: { handL: -1, handR: -1 },
        },
        { reach: { handL: at('pelvis', 0, 20, -20) } },
      ],
      grips: [[0, 'handL', 'Su muñeca']],
      arrows: [{ from: at('neck', 0, 18, 0), to: at('neck', 0, 18, 34), fighter: 0 }],
    },
  ],

  'guillotine-defense': [
    {
      from: 'standing',
      text: 'Te atrapa el cuello: agarra su antebrazo y tira hacia abajo para respirar.',
      fighters: [
        {
          move: [14, 10],
          angles: { spine: -30, neck: -20 },
          reach: { handL: at('handL', 1, 0, 2), handR: at('handL', 1, 4, 4) },
        },
        { reach: { handL: at('neck', 0, 4, 8), handR: at('neck', 0, 0, 10) } },
      ],
      grips: [[0, 'handL', 'Su antebrazo']],
    },
    {
      from: 'standing',
      text: 'Gira la cabeza hacia su pecho y pasa tu cuerpo al lado del brazo que estrangula.',
      fighters: [
        {
          move: [30, 10],
          angles: { spine: -40, neck: -10 },
          reach: { handL: at('handL', 1, 0, 2), handR: at('shoulderR', 1, 6, 2) },
        },
        { reach: { handL: at('neck', 0, 4, 8), handR: at('neck', 0, 0, 10) } },
      ],
      grips: [[0, 'handR', 'Hombro']],
      arrows: [{ from: at('head', 0, -6, -10), to: at('head', 0, 20, -20), fighter: 0, bend: -0.3 }],
    },
    {
      from: 'standing',
      text: 'Ya al lado, el cuello sale: endereza la postura y controla su espalda.',
      fighters: [
        { move: [44, 0], reach: { handL: at('shoulderL', 1, 6, 6), handR: at('pelvis', 1, 6, -6) } },
        { move: [6, 0] },
      ],
      grips: [[0, 'handR', 'Cintura']],
    },
  ],

  sprawl: [
    {
      from: 'doubleLeg*',
      text: 'Cuando entre a tus piernas, pon las manos en sus hombros o su cabeza.',
      fighters: [{ reach: { handL: at('neck', 1, 6, -6), handR: at('shoulderL', 1, 4, -4) } }],
      grips: [[0, 'handL', 'Cabeza']],
    },
    {
      from: 'doubleLeg*',
      text: 'Lanza las piernas hacia atrás y deja caer la cadera sobre su espalda.',
      fighters: [
        {
          base: 'turtle:0',
          move: [20, 0],
          angles: { thighL: 20, shinL: 10, thighR: 15, shinR: 5 },
          reach: { handL: at('shoulderL', 1, 4, -4) },
        },
        { base: 'turtle:1', move: [-40, 0] },
      ],
      grips: [[0, 'handL', 'Hombro']],
      arrows: [{ from: at('footL', 0, -40, -20), to: at('footL', 0, 0, -6), fighter: 0, bend: 0.3 }],
    },
    { from: 'turtle', text: 'Gira hacia su espalda o su lado: estás arriba.' },
  ],

  'frame-and-hip-escape': [
    {
      from: 'sideControl*',
      text: 'Antebrazo en su cuello, la otra mano en su cadera: no empujes aún, solo bloquea.',
      fighters: [{ reach: frames }],
      grips: [
        [0, 'handL', 'Cuello'],
        [0, 'handR', 'Cadera'],
      ],
    },
    {
      from: 'sideControl*',
      text: 'Apoya los pies y puentea un poco para que se mueva.',
      fighters: [
        { move: [0, -8], angles: { thighL: -60, shinL: 60, thighR: -55, shinR: 65 }, reach: frames },
        { move: [0, -6] },
      ],
      grips: [[0, 'handL', 'Cuello']],
    },
    {
      from: 'sideControl*',
      text: 'Gamba: empuja con los pies y saca la cadera, manteniendo los brazos fijos.',
      fighters: [
        { move: [24, 0], angles: { thighL: -40, shinL: 70, thighR: -30, shinR: 80 }, reach: frames },
      ],
      grips: [
        [0, 'handL', 'Cuello'],
        [0, 'handR', 'Cadera'],
      ],
      arrows: [{ from: at('pelvis', 0, -10, 8), to: at('pelvis', 0, 20, 8), fighter: 0, bend: 0.2 }],
    },
  ],
};
