import { type StepSpec, at } from '../steps';

// Estrangulaciones. Luchador 0 = quien estrangula, 1 = compañero.

const seatbelt = { handL: at('neck', 1, 18, 4), handR: at('shoulderR', 1, 14, 14) };

export const CHOKE_STEPS: Record<string, StepSpec[]> = {
  'bow-and-arrow': [
    {
      from: 'backControl',
      text: 'Abre su solapa con una mano y mete la otra profunda en el cuello, con los dedos dentro.',
      fighters: [{ reach: { handL: at('neck', 1, 16, 2), handR: at('pelvis', 1, 18, -30) } }],
      grips: [
        [0, 'handL', 'Solapa profunda'],
        [0, 'handR', 'Solapa'],
      ],
    },
    {
      from: 'backControl',
      text: 'Suelta el gancho de ese lado y agarra el pantalón por la rodilla.',
      fighters: [
        {
          move: [-6, 4],
          rotate: -16,
          reach: { handL: at('neck', 1, 16, 2), handR: at('kneeL', 1, 0, 2), footR: [210, 200] },
        },
        { rotate: -10 },
      ],
      grips: [
        [0, 'handL', 'Solapa profunda'],
        [0, 'handR', 'Pantalón'],
      ],
    },
    {
      from: 'backControl',
      text: 'Gira de lado y estírate como un arco: tira del cuello hacia ti y de la pierna hacia fuera.',
      fighters: [
        {
          base: 'closedGuard:0',
          move: [-26, 0],
          rotate: -20,
          reach: { handL: at('neck', 1, -4, 2), handR: at('kneeL', 1, 0, 2), footL: at('pelvis', 1, 4, 0) },
        },
        { rotate: -70, move: [-14, 10] },
      ],
      grips: [
        [0, 'handL', 'Solapa profunda'],
        [0, 'handR', 'Pantalón'],
      ],
      arrows: [
        { from: at('neck', 1, -6), to: at('neck', 1, -30, 4), fighter: 0, bend: 0.2 },
        { from: at('kneeL', 1), to: at('kneeL', 1, 24, -4), fighter: 0, bend: -0.2 },
      ],
    },
  ],

  'sliding-collar': [
    {
      from: 'backControl',
      text: 'Mete la mano de arriba profunda en su solapa cruzada.',
      fighters: [{ reach: { handL: at('neck', 1, 16, 2), handR: at('shoulderR', 1, 14, 14) } }],
      grips: [[0, 'handL', 'Solapa profunda']],
    },
    {
      from: 'backControl',
      text: 'Con la otra mano agarra la solapa contraria, más abajo, y ábrela.',
      fighters: [{ reach: { handL: at('neck', 1, 16, 2), handR: at('pelvis', 1, 14, -24) } }],
      grips: [
        [0, 'handL', 'Solapa profunda'],
        [0, 'handR', 'Solapa contraria'],
      ],
    },
    {
      from: 'backControl',
      text: 'Tira de la solapa alta hacia atrás mientras bajas la de abajo: la tela cierra el cuello.',
      fighters: [
        { rotate: -8, reach: { handL: at('neck', 1, -6, -2), handR: at('pelvis', 1, 14, -10) } },
        { rotate: -8 },
      ],
      grips: [
        [0, 'handL', 'Solapa profunda'],
        [0, 'handR', 'Solapa contraria'],
      ],
      arrows: [{ from: at('neck', 1, 18, 0), to: at('neck', 1, -14, -10), fighter: 0, bend: 0.3 }],
    },
  ],

  'back-triangle': [
    {
      from: 'backControl',
      text: 'Controla un brazo y pasa la pierna por encima de su hombro, por delante del cuello.',
      fighters: [
        {
          reach: { ...seatbelt, footL: at('neck', 1, 20, 10) },
          bend: { footL: -1 },
          layers: { legL: 4 },
        },
      ],
      grips: [[0, 'handL', 'Cinturón de seguridad']],
    },
    {
      from: 'backControl',
      text: 'Cierra el triángulo: el pie bajo tu otra rodilla, atrapando cuello y brazo.',
      fighters: [
        {
          move: [-6, 4],
          rotate: -14,
          reach: { ...seatbelt, footL: at('neck', 1, 20, 14), footR: at('neck', 1, 26, 20) },
          bend: { footL: -1, footR: -1 },
          layers: { legL: 4 },
        },
      ],
      grips: [[0, 'handL', 'Cinturón de seguridad']],
    },
    {
      from: 'backControl',
      text: 'Aprieta las rodillas y tira de su cabeza hacia abajo.',
      fighters: [
        {
          move: [-10, 4],
          rotate: -20,
          reach: {
            handL: at('head', 1, 2, -8),
            handR: at('shoulderR', 1, 14, 14),
            footL: at('neck', 1, 20, 14),
            footR: at('neck', 1, 26, 20),
          },
          bend: { footL: -1, footR: -1 },
          layers: { legL: 4 },
        },
        { rotate: 8 },
      ],
      grips: [[0, 'handL', 'Cabeza']],
      arrows: [{ from: at('head', 1, 0, -16), to: at('head', 1, 10, 4), fighter: 0, bend: 0.3 }],
    },
  ],

  'cross-collar-mount': [
    {
      from: 'mount',
      text: 'Mete la primera mano profunda en su cuello, con los dedos dentro.',
      fighters: [{ reach: { handL: at('neck', 1, 4, -4) } }],
      grips: [[0, 'handL', 'Cuello (dedos dentro)']],
    },
    {
      from: 'mount',
      text: 'Baja el peso con el antebrazo y la cabeza al lado de la suya.',
      fighters: [
        {
          move: [-4, 8],
          angles: { spine: -150, neck: -160 },
          reach: { handL: at('neck', 1, 4, -4), handR: [104, 192] },
        },
      ],
      grips: [[0, 'handL', 'Cuello (dedos dentro)']],
    },
    {
      from: 'mount',
      text: 'Mete la segunda mano en el otro lado del cuello y abre los codos hacia fuera.',
      fighters: [
        {
          move: [-4, 8],
          angles: { spine: -150, neck: -160 },
          reach: { handL: at('neck', 1, 4, -4), handR: at('neck', 1, -4, -2) },
        },
      ],
      grips: [
        [0, 'handL', 'Cuello'],
        [0, 'handR', 'Cuello'],
      ],
      arrows: [{ from: at('elbowL', 0, 0, -6), to: at('elbowL', 0, 14, -26), fighter: 0, bend: 0.3 }],
    },
  ],

  'triangle-mount': [
    {
      from: 'mount',
      text: 'Sube la montada y atrapa un brazo entre tus rodillas.',
      fighters: [
        { move: [-16, -2], angles: { thighL: 160 }, reach: { handL: at('head', 1, 0, -6) } },
        { reach: { handL: [150, 130] } },
      ],
      grips: [[0, 'handL', 'Cabeza']],
    },
    {
      from: 'mount',
      text: 'Pasa la pierna por detrás de su cabeza y siéntate.',
      fighters: [
        {
          move: [-20, 6],
          angles: { spine: -80, neck: -85 },
          reach: { handL: at('head', 1, 0, -6), footL: at('head', 1, -14, 4) },
          bend: { footL: -1 },
          layers: { legL: 4 },
        },
        { reach: { handL: [150, 130] } },
      ],
      grips: [[0, 'handL', 'Cabeza']],
    },
    {
      from: 'mount',
      text: 'Cae de lado, cierra el triángulo y tira de su cabeza hacia ti.',
      fighters: [
        {
          base: 'closedGuard:0',
          move: [-40, 0],
          reach: { handL: at('head', 1, 4, -6), footL: at('neck', 1, 18, -10), footR: at('neck', 1, 24, -2) },
          bend: { footL: -1, footR: -1 },
          layers: { legL: 4 },
        },
        { rotate: -24, move: [10, -2] },
      ],
      grips: [[0, 'handL', 'Cabeza']],
      arrows: [{ from: at('head', 1, 6, -18), to: at('head', 1, -18, -6), fighter: 0, bend: 0.3 }],
    },
  ],

  'arm-triangle': [
    {
      from: 'sideControl',
      text: 'Empuja su brazo lejano contra su cara con la cabeza y rodea su cuello con el brazo.',
      fighters: [
        { reach: { handL: at('neck', 1, -4, 4), handR: at('head', 1, 6, -4) } },
        { reach: { handL: at('head', 1, 6, -10) } },
      ],
      grips: [[0, 'handL', 'Cuello']],
    },
    {
      from: 'sideControl',
      text: 'Junta las manos (palma con palma) atrapando cabeza y brazo.',
      fighters: [
        { reach: { handL: at('neck', 1, -4, 4), handR: at('neck', 1, -2, -6) } },
        { reach: { handL: at('head', 1, 6, -10) } },
      ],
      grips: [[0, 'handL', 'Manos juntas']],
    },
    {
      from: 'sideControl',
      text: 'Sal hacia el lado de su cabeza y baja la cadera mientras aprietas con el hombro.',
      fighters: [
        {
          move: [-24, 6],
          rotate: -10,
          angles: { thighL: 0, shinL: 0 },
          reach: { handL: at('neck', 1, -4, 4), handR: at('neck', 1, -2, -6) },
        },
        { reach: { handL: at('head', 1, 6, -10) } },
      ],
      grips: [[0, 'handL', 'Manos juntas']],
      arrows: [{ from: at('pelvis', 0, 0, -10), to: at('pelvis', 0, -10, 14), fighter: 0, bend: 0.3 }],
    },
  ],

  'guillotine-standing': [
    {
      from: 'standing',
      text: 'Cuando baje la cabeza para entrar, rodea su cuello con el brazo.',
      fighters: [
        { reach: { handL: at('neck', 1, 4, 10), handR: at('shoulderL', 1, 0, -2) } },
        { move: [-14, 10], angles: { spine: -150, neck: -160 } },
      ],
      grips: [[0, 'handL', 'Bajo la barbilla']],
    },
    {
      from: 'standing',
      text: 'El antebrazo bajo la barbilla, la otra mano agarra tu muñeca.',
      fighters: [
        { reach: { handL: at('neck', 1, 4, 10), handR: at('neck', 1, 2, 14) } },
        { move: [-14, 10], angles: { spine: -150, neck: -160 } },
      ],
      grips: [
        [0, 'handL', 'Bajo la barbilla'],
        [0, 'handR', 'Muñeca'],
      ],
    },
    {
      from: 'standing',
      text: 'Adelanta la cadera y tira del antebrazo hacia arriba, hacia tu pecho.',
      fighters: [
        {
          move: [4, 0],
          angles: { spine: -100, neck: -110 },
          reach: { handL: at('neck', 1, 4, 10), handR: at('neck', 1, 2, 14) },
        },
        { move: [-14, 4], angles: { spine: -140, neck: -150 } },
      ],
      grips: [
        [0, 'handL', 'Bajo la barbilla'],
        [0, 'handR', 'Muñeca'],
      ],
      arrows: [{ from: at('neck', 1, 4, 16), to: at('neck', 1, -10, -16), fighter: 0, bend: 0.3 }],
    },
  ],

  darce: [
    {
      from: 'turtle',
      text: 'Desde delante de la tortuga, pasa el brazo por debajo de su axila y su cuello.',
      fighters: [
        { base: 'turtle:0', mirror: true, move: [-165, 0], reach: { handR: at('shoulderL', 1, 16, 10) } },
        {},
      ],
      grips: [[0, 'handR', 'Bajo la axila']],
    },
    {
      from: 'turtle',
      text: 'Agarra tu bíceps contrario y pon esa mano detrás de su espalda.',
      fighters: [
        {
          base: 'turtle:0',
          mirror: true,
          move: [-165, 0],
          reach: { handR: at('shoulderL', 1, 16, 10), handL: at('shoulderL', 1, 6, -10) },
        },
        {},
      ],
      grips: [
        [0, 'handR', 'Bíceps'],
        [0, 'handL', 'Espalda'],
      ],
    },
    {
      from: 'turtle',
      text: 'Gira de lado hacia su brazo atrapado y aprieta juntando los codos.',
      fighters: [
        {
          base: 'closedGuard:0',
          move: [-46, 0],
          reach: { handR: at('neck', 1, 6, 10), handL: at('shoulderL', 1, 6, -6) },
        },
        { rotate: 24, move: [0, 6] },
      ],
      grips: [[0, 'handR', 'Bíceps']],
      arrows: [{ from: at('elbowL', 0, 0, -8), to: at('elbowR', 0, 0, -8), fighter: 0, bend: 0.3 }],
    },
  ],

  anaconda: [
    {
      from: 'turtle',
      text: 'Desde delante, pasa el brazo bajo su cuello y saca la mano por debajo de su axila.',
      fighters: [
        { base: 'turtle:0', mirror: true, move: [-165, 0], reach: { handR: at('shoulderR', 1, 18, 12) } },
        {},
      ],
      grips: [[0, 'handR', 'Bajo cuello y axila']],
    },
    {
      from: 'turtle',
      text: 'Cierra con tu bíceps contrario (agarre tipo gable o bíceps).',
      fighters: [
        {
          base: 'turtle:0',
          mirror: true,
          move: [-165, 0],
          reach: { handR: at('shoulderR', 1, 18, 12), handL: at('shoulderL', 1, 8, -10) },
        },
        {},
      ],
      grips: [[0, 'handR', 'Bíceps']],
    },
    {
      from: 'turtle',
      text: 'Rueda hacia el hombro del brazo atrapado y aprieta con el pecho.',
      fighters: [
        {
          base: 'closedGuard:0',
          move: [-46, 0],
          reach: { handR: at('neck', 1, 6, 10), handL: at('shoulderL', 1, 6, -6) },
        },
        { rotate: 50, move: [-10, 0] },
      ],
      grips: [[0, 'handR', 'Bíceps']],
      arrows: [{ from: [80, 150], to: [140, 120], fighter: 0, bend: 0.5 }],
    },
  ],

  'peruvian-necktie': [
    {
      from: 'turtle',
      text: 'Desde delante, atrapa cuello y brazo como en el D’Arce.',
      fighters: [
        {
          base: 'turtle:0',
          mirror: true,
          move: [-165, 0],
          reach: { handR: at('shoulderL', 1, 16, 10), handL: at('shoulderL', 1, 6, -10) },
        },
        {},
      ],
      grips: [[0, 'handR', 'Cuello y brazo']],
    },
    {
      from: 'turtle',
      text: 'Siéntate a su lado y pon las piernas sobre su espalda.',
      fighters: [
        {
          base: 'butterflyGuard:0',
          move: [-62, -4],
          reach: { handR: at('neck', 1, 4, 8), footL: at('neck', 1, 30, -10), footR: at('neck', 1, 44, -8) },
        },
        {},
      ],
      grips: [[0, 'handR', 'Cuello']],
    },
    {
      from: 'turtle',
      text: 'Empuja su espalda hacia el suelo con las piernas mientras tiras del cuello.',
      fighters: [
        {
          base: 'butterflyGuard:0',
          move: [-62, -4],
          rotate: -10,
          reach: { handR: at('neck', 1, 4, 8), footL: at('neck', 1, 30, -10), footR: at('neck', 1, 44, -8) },
        },
        { move: [0, 6] },
      ],
      grips: [[0, 'handR', 'Cuello']],
      arrows: [{ from: at('pelvis', 1, -14, -20), to: at('pelvis', 1, -14, 0), fighter: 0 }],
    },
  ],

  'clock-choke': [
    {
      from: 'turtle',
      text: 'Desde su lado, mete una mano profunda en su cuello por debajo.',
      fighters: [{ reach: { handL: at('neck', 1, 4, 8), handR: at('pelvis', 1, 0, -6) } }],
      grips: [[0, 'handL', 'Solapa profunda']],
    },
    {
      from: 'turtle',
      text: 'Con la otra mano agarra su pantalón o solapa y estira las piernas hacia atrás.',
      fighters: [
        {
          move: [10, 22],
          angles: { spine: -170, neck: -175, thighL: 30, shinL: 20, thighR: 20, shinR: 10 },
          reach: { handL: at('neck', 1, 4, 8), handR: at('pelvis', 1, 0, -6) },
        },
      ],
      grips: [
        [0, 'handL', 'Solapa profunda'],
        [0, 'handR', 'Pantalón'],
      ],
    },
    {
      from: 'turtle',
      text: 'Camina alrededor de su cabeza como las agujas del reloj, cargando el pecho.',
      fighters: [
        {
          move: [-4, 22],
          angles: { spine: -170, neck: -175, thighL: 30, shinL: 20, thighR: 20, shinR: 10 },
          reach: { handL: at('neck', 1, 4, 8), handR: at('pelvis', 1, 0, -6) },
        },
      ],
      grips: [
        [0, 'handL', 'Solapa profunda'],
        [0, 'handR', 'Pantalón'],
      ],
      arrows: [{ from: at('footL', 0, 0, -8), to: at('footL', 0, -30, -14), fighter: 0, bend: 0.3 }],
    },
  ],

  'ezekiel-mount': [
    {
      from: 'mount',
      text: 'Pasa un brazo por detrás de su cabeza y mete esa mano dentro de tu otra manga.',
      fighters: [
        {
          move: [-4, 8],
          angles: { spine: -150, neck: -160 },
          reach: { handL: at('head', 1, 0, 6), handR: at('elbowL', 0, 0, 0) },
        },
      ],
      grips: [[0, 'handL', 'Dentro de tu manga']],
    },
    {
      from: 'mount',
      text: 'Cruza el filo del otro antebrazo sobre su garganta.',
      fighters: [
        {
          move: [-4, 8],
          angles: { spine: -150, neck: -160 },
          reach: { handL: at('head', 1, 0, 6), handR: at('neck', 1, 0, -4) },
        },
      ],
      grips: [
        [0, 'handL', 'Dentro de tu manga'],
        [0, 'handR', 'Garganta'],
      ],
    },
    {
      from: 'mount',
      text: 'Junta las manos y empuja el antebrazo hacia el suelo.',
      fighters: [
        {
          move: [-6, 10],
          angles: { spine: -155, neck: -165 },
          reach: { handL: at('head', 1, 0, 6), handR: at('neck', 1, 0, -2) },
        },
      ],
      grips: [[0, 'handR', 'Garganta']],
      arrows: [{ from: at('neck', 1, 0, -20), to: at('neck', 1, 0, -4), fighter: 0 }],
    },
  ],

  'baseball-bat-choke': [
    {
      from: 'kneeOnBelly',
      text: 'Agarra su cuello con las dos manos como un bate: una con el pulgar dentro y otra fuera.',
      fighters: [{ reach: { handL: at('neck', 1, 4, -4), handR: at('neck', 1, 10, -6) } }],
      grips: [
        [0, 'handL', 'Cuello (pulgar dentro)'],
        [0, 'handR', 'Cuello (pulgar fuera)'],
      ],
    },
    {
      from: 'kneeOnBelly',
      text: 'Baja la cabeza al suelo junto a su cabeza.',
      fighters: [
        {
          base: 'sideControl:0',
          move: [10, 0],
          reach: { handL: at('neck', 1, 4, -4), handR: at('neck', 1, 10, -6) },
        },
      ],
      grips: [
        [0, 'handL', 'Cuello'],
        [0, 'handR', 'Cuello'],
      ],
    },
    {
      from: 'kneeOnBelly',
      text: 'Gira alrededor de su cabeza hacia norte-sur: los antebrazos cierran el cuello.',
      fighters: [
        {
          base: 'northSouth:0',
          move: [-10, 0],
          reach: { handL: at('neck', 1, 4, -4), handR: at('neck', 1, 10, -6) },
        },
        { move: [-24, 0] },
      ],
      grips: [[0, 'handL', 'Cuello']],
      arrows: [{ from: [190, 130], to: [110, 150], fighter: 0, bend: 0.4 }],
    },
  ],

  'paper-cutter': [
    {
      from: 'sideControl',
      text: 'Mete la mano de la cabeza profunda en su cuello, con los dedos dentro.',
      fighters: [{ reach: { handL: at('neck', 1, 2, -4) } }],
      grips: [[0, 'handL', 'Cuello profundo']],
    },
    {
      from: 'sideControl',
      text: 'Pasa el otro antebrazo por encima de su cuello, junto a tu mano.',
      fighters: [{ reach: { handL: at('neck', 1, 2, -4), handR: at('neck', 1, -6, -6) } }],
      grips: [
        [0, 'handL', 'Cuello profundo'],
        [0, 'handR', 'Antebrazo'],
      ],
    },
    {
      from: 'sideControl',
      text: 'Baja el codo hacia el suelo como un cortapapeles.',
      fighters: [{ move: [0, 4], reach: { handL: at('neck', 1, 2, -4), handR: at('neck', 1, -6, -2) } }],
      grips: [[0, 'handL', 'Cuello profundo']],
      arrows: [{ from: at('elbowR', 0, 0, -10), to: at('elbowR', 0, -6, 12), fighter: 0, bend: 0.3 }],
    },
  ],

  'north-south-choke': [
    {
      from: 'northSouth',
      text: 'Mete el brazo por debajo de su cuello, con el bíceps junto a su garganta.',
      fighters: [{ reach: { handL: at('neck', 1, 10, 0), handR: at('shoulderL', 1, 10, -4) } }],
      grips: [[0, 'handL', 'Bajo el cuello']],
    },
    {
      from: 'northSouth',
      text: 'Agarra tu propia mano o su brazo y gira la cadera hacia el lado del brazo que estrangula.',
      fighters: [
        {
          move: [4, 4],
          rotate: 6,
          angles: { thighL: 120, thighR: 180, shinR: 160 },
          reach: { handL: at('neck', 1, 10, 0), handR: at('neck', 1, 10, 4) },
        },
      ],
      grips: [[0, 'handL', 'Bajo el cuello']],
    },
    {
      from: 'northSouth',
      text: 'Baja la cadera al suelo y aprieta con el dorsal y el pecho.',
      fighters: [
        {
          move: [6, 12],
          rotate: 8,
          angles: { thighL: 120, thighR: 180, shinR: 160 },
          reach: { handL: at('neck', 1, 10, 0), handR: at('neck', 1, 10, 4) },
        },
      ],
      grips: [[0, 'handL', 'Bajo el cuello']],
      arrows: [{ from: at('pelvis', 0, 0, -16), to: at('pelvis', 0, 0, 8), fighter: 0 }],
    },
  ],

  'von-flue': [
    {
      from: 'sideControl',
      text: 'Pasas al lado con su guillotina puesta: no luches con la mano, mantén el brazo atrapado.',
      fighters: [{ move: [-6, 0] }, { reach: { handL: at('neck', 0, 6, 8), handR: at('neck', 0, 8, 4) } }],
      grips: [[1, 'handL', 'Guillotina']],
    },
    {
      from: 'sideControl',
      text: 'Lleva tu hombro contra su cuello y baja todo el peso sobre él.',
      fighters: [
        { move: [-14, 6], angles: { spine: -175, neck: -180 } },
        { reach: { handL: at('neck', 0, 6, 8), handR: at('neck', 0, 8, 4) } },
      ],
      grips: [[1, 'handL', 'Guillotina']],
      arrows: [{ from: at('shoulderL', 0, 0, -14), to: at('neck', 1, 0, -4), fighter: 0 }],
    },
  ],

  gogoplata: [
    {
      from: 'closedGuard',
      text: 'Guardia alta: rompe su postura y sube las piernas hacia sus axilas.',
      fighters: [
        {
          reach: { handL: at('head', 1, 0, -6), footL: at('shoulderR', 1, 16, -4) },
          bend: { footL: -1 },
          layers: { legL: 4 },
        },
        { rotate: -24, move: [-10, 10] },
      ],
      grips: [[0, 'handL', 'Cabeza']],
    },
    {
      from: 'closedGuard',
      text: 'Agarra tu pie y pasa la espinilla por debajo de su barbilla.',
      fighters: [
        {
          rotate: 10,
          reach: {
            handL: at('head', 1, 0, -6),
            footL: at('neck', 1, -10, 10),
            handR: at('neck', 1, -10, 12),
          },
          bend: { footL: -1 },
          layers: { legL: 4 },
        },
        { rotate: -30, move: [-14, 12] },
      ],
      grips: [
        [0, 'handL', 'Cabeza'],
        [0, 'handR', 'Tu pie'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Tira de su cabeza hacia ti con las dos manos contra tu espinilla.',
      fighters: [
        {
          rotate: 10,
          reach: { handL: at('head', 1, 4, -6), handR: at('head', 1, 6, -2), footL: at('neck', 1, -10, 10) },
          bend: { footL: -1 },
          layers: { legL: 4 },
        },
        { rotate: -30, move: [-14, 12] },
      ],
      grips: [
        [0, 'handL', 'Cabeza'],
        [0, 'handR', 'Cabeza'],
      ],
      arrows: [{ from: at('head', 1, 6, -14), to: at('head', 1, -16, 6), fighter: 0, bend: 0.3 }],
    },
  ],

  'loop-choke': [
    {
      from: 'butterflyGuard',
      text: 'Agarre profundo al cuello cuando baje la cabeza, con el codo por encima.',
      fighters: [{ reach: { handL: at('neck', 1, -4, -4) } }, { rotate: -20, move: [-6, 10] }],
      grips: [[0, 'handL', 'Cuello profundo']],
    },
    {
      from: 'butterflyGuard',
      text: 'Mete su cabeza en el lazo bajándola con el codo, y agarra su manga con la otra mano.',
      fighters: [
        { reach: { handL: at('neck', 1, -4, -4), handR: at('handL', 1, 2) } },
        { rotate: -36, move: [-10, 20] },
      ],
      grips: [
        [0, 'handL', 'Cuello profundo'],
        [0, 'handR', 'Manga'],
      ],
    },
    {
      from: 'butterflyGuard',
      text: 'Rueda por debajo de él hacia el lado del agarre: el lazo se cierra.',
      fighters: [
        {
          base: 'closedGuard:0',
          mirror: true,
          move: [30, 0],
          reach: { handL: at('neck', 1, -4, 4), handR: at('handL', 1, 2) },
        },
        { rotate: -50, move: [-14, 26] },
      ],
      grips: [[0, 'handL', 'Cuello profundo']],
      arrows: [{ from: [90, 170], to: [140, 140], fighter: 0, bend: 0.4 }],
    },
  ],
};
