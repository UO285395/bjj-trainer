import { type PoseMod, type StepSpec, at } from '../steps';

// Luxaciones. Luchador 0 = quien ataca, 1 = compañero.

/** Final de armbar sobre un rival tumbado: espalda en el suelo junto a su hombro, piernas cruzando su pecho. */
const armbarFinish = (text: string): StepSpec => ({
  from: 'mount',
  text,
  fighters: [
    {
      base: 'closedGuard:0',
      move: [-10, 0],
      reach: { footL: [116, 176], footR: [176, 172], handL: at('handL', 1, -3), handR: at('handL', 1, 3) },
      bend: { footL: -1, footR: -1 },
      layers: { legL: 4, legR: 4 },
    },
    { reach: { handL: [124, 140], handR: [172, 170] } },
  ],
  grips: [
    [0, 'handL', 'Muñeca'],
    [0, 'handR', 'Muñeca'],
  ],
  arrows: [{ from: at('pelvis', 0, 0, -4), to: at('pelvis', 0, 0, -26), fighter: 0, bend: 0.2 }],
});

/** Rival sentado mirando a la izquierda, frente a quien ataca las piernas. */
const seatedLeft = (dx: number, extra: PoseMod = {}): PoseMod => ({
  base: 'butterflyGuard:0',
  mirror: true,
  move: [dx, 0],
  ...extra,
  angles: { spine: -82, neck: -86, ...extra.angles },
});

/** Quien ataca la pierna, tumbado de espaldas con la cabeza a la izquierda. */
const lyingBack = (dx: number, extra: PoseMod = {}): PoseMod => ({
  base: 'closedGuard:0',
  move: [dx, 0],
  ...extra,
});

export const LOCK_STEPS: Record<string, StepSpec[]> = {
  'armbar-mount': [
    {
      from: 'mount',
      text: 'Sube la montada hacia sus axilas y aísla un brazo contra tu pecho.',
      fighters: [
        { move: [-12, -2], reach: { handL: at('elbowL', 1, 0, -4), handR: at('handL', 1, 3) } },
        { reach: { handL: [150, 124] } },
      ],
      grips: [
        [0, 'handL', 'Codo'],
        [0, 'handR', 'Muñeca'],
      ],
    },
    {
      from: 'mount',
      text: 'Apoya la mano en su pecho, gira sobre la rodilla y lleva el pie junto a su cabeza.',
      fighters: [
        {
          move: [-16, -4],
          angles: { spine: -80, neck: -80, thighR: 120, shinR: 90 },
          reach: { handL: at('handL', 1, 0, 2), handR: at('shoulderR', 1, 10, -4) },
        },
        { reach: { handL: [150, 124] } },
      ],
      grips: [[0, 'handL', 'Muñeca']],
      arrows: [{ from: at('kneeR', 0), to: [118, 172], fighter: 0, bend: 0.3 }],
    },
    {
      from: 'mount',
      text: 'Pasa la otra pierna por encima de su cabeza y siéntate pegado a su hombro.',
      fighters: [
        {
          move: [-22, 8],
          angles: { spine: -70, neck: -70 },
          reach: {
            handL: at('handL', 1, -3),
            handR: at('handL', 1, 3),
            footL: [110, 178],
            footR: [182, 176],
          },
          bend: { footL: -1, footR: -1 },
          layers: { legL: 4, legR: 4 },
        },
        { reach: { handL: [138, 128] } },
      ],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Muñeca'],
      ],
      arrows: [{ from: at('neck', 0), to: at('neck', 0, -30, 40), fighter: 0, bend: 0.3 }],
    },
    armbarFinish('Cae atrás con las rodillas juntas, pulgar hacia arriba, y eleva la cadera.'),
  ],

  'armbar-side': [
    {
      from: 'sideControl',
      text: 'Empuja su brazo lejano hacia arriba y atrápalo con tu brazo, pegado a tu pecho.',
      fighters: [
        { reach: { handL: at('elbowL', 1, -2, -2), handR: at('hipR', 1, -2, -8) } },
        { reach: { handL: [150, 132] } },
      ],
      grips: [
        [0, 'handL', 'Codo'],
        [0, 'handR', 'Cadera'],
      ],
    },
    {
      from: 'sideControl',
      text: 'Sube a rodilla en el vientre o a la montada técnica, sin soltar el brazo.',
      fighters: [
        {
          base: 'kneeOnBelly:0',
          move: [-18, 0],
          reach: { handL: at('handL', 1, 2), handR: at('elbowL', 1) },
        },
        { reach: { handL: [150, 126] } },
      ],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Codo'],
      ],
    },
    {
      from: 'sideControl',
      text: 'Pasa la pierna por encima de su cabeza y siéntate cerca del hombro.',
      fighters: [
        {
          base: 'mount:0',
          move: [-24, 10],
          angles: { spine: -70, neck: -70 },
          reach: {
            handL: at('handL', 1, -3),
            handR: at('handL', 1, 3),
            footL: [110, 178],
            footR: [182, 176],
          },
          bend: { footL: -1, footR: -1 },
          layers: { legL: 4, legR: 4 },
        },
        { reach: { handL: [138, 128] } },
      ],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Muñeca'],
      ],
    },
    armbarFinish('Cae atrás apretando las rodillas y extiende el brazo con la cadera.'),
  ],

  'armbar-back': [
    {
      from: 'backControl',
      text: 'Defiende el mataleón con las manos: atrapa su brazo con los tuyos.',
      fighters: [
        { reach: { handL: at('elbowL', 1, 2, -4), handR: at('handL', 1, -2) } },
        { reach: { handL: at('neck', 1, 10, 4) }, bend: { handL: -1 } },
      ],
      grips: [
        [0, 'handL', 'Codo'],
        [0, 'handR', 'Muñeca'],
      ],
    },
    {
      from: 'backControl',
      text: 'Saca el gancho de ese lado, apoya el pie en su cadera y desliza tu cadera hacia fuera.',
      fighters: [
        {
          move: [-10, 4],
          rotate: -20,
          reach: { handL: at('elbowL', 1, 2, -4), handR: at('handL', 1, -2), footR: at('hipR', 1, 6, 0) },
        },
        { rotate: -14, reach: { handL: at('neck', 1, 10, 4) }, bend: { handL: -1 } },
      ],
      grips: [
        [0, 'handL', 'Codo'],
        [0, 'handR', 'Muñeca'],
      ],
      arrows: [{ from: at('pelvis', 0), to: at('pelvis', 0, -26, 4), fighter: 0, bend: 0.2 }],
    },
    {
      from: 'backControl',
      text: 'Pasa la pierna por encima de su cabeza y cae de espaldas.',
      fighters: [
        {
          base: 'closedGuard:0',
          move: [-30, 0],
          reach: {
            footL: [168, 140],
            footR: [196, 174],
            handL: at('handL', 1, -3),
            handR: at('handL', 1, 3),
          },
          layers: { legL: 4 },
        },
        { rotate: -60, move: [-6, 10], reach: { handL: [150, 150] } },
      ],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Muñeca'],
      ],
    },
    armbarFinish('Junta las rodillas y extiende el brazo con la cadera.'),
  ],

  'armbar-knee-on-belly': [
    {
      from: 'kneeOnBelly',
      text: 'Cuando empuje tu rodilla, atrapa su brazo por el codo.',
      fighters: [{ reach: { handL: at('elbowL', 1, 0, -2) } }, { reach: { handL: at('kneeL', 0, -4, 2) } }],
      grips: [[0, 'handL', 'Codo']],
    },
    {
      from: 'kneeOnBelly',
      text: 'Pasa la pierna de atrás por encima de su cabeza, girando sobre la rodilla.',
      fighters: [
        {
          move: [-28, 14],
          angles: { spine: -80, neck: -80, thighR: 200, shinR: 110 },
          reach: { handL: at('handL', 1, -3), handR: at('handL', 1, 3) },
        },
        { reach: { handL: [150, 130] } },
      ],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Muñeca'],
      ],
      arrows: [{ from: [240, 150], to: [140, 160], fighter: 0, bend: 0.4 }],
    },
    armbarFinish('Siéntate pegado a su hombro, cae atrás y eleva la cadera.'),
  ],

  'armbar-turtle': [
    {
      from: 'turtle',
      text: 'Desde arriba, mete el brazo por debajo de su axila y atrapa su brazo.',
      fighters: [{ reach: { handL: at('elbowL', 1, 0, 2), handR: at('pelvis', 1, 0, -8) } }],
      grips: [
        [0, 'handL', 'Brazo'],
        [0, 'handR', 'Cinturón'],
      ],
    },
    {
      from: 'turtle',
      text: 'Pon una pierna por encima de su espalda y la otra junto a su cabeza.',
      fighters: [
        {
          move: [-30, -10],
          angles: { spine: -110, neck: -120, thighL: 160, shinL: 100, thighR: 60, shinR: 100 },
          reach: { handL: at('elbowL', 1, 0, 2) },
        },
      ],
      grips: [[0, 'handL', 'Brazo']],
    },
    {
      from: 'turtle',
      text: 'Rueda por encima de su hombro sin soltar el brazo: lo pones de espaldas.',
      fighters: [
        {
          base: 'closedGuard:0',
          move: [-36, 0],
          reach: {
            handL: at('handL', 1, -3),
            handR: at('handL', 1, 3),
            footL: at('neck', 1, 4, -16),
            footR: at('pelvis', 1, -16, -14),
          },
          bend: { footL: -1, footR: -1 },
          layers: { legL: 4, legR: 4 },
        },
        { rotate: 50, move: [-4, -14] },
      ],
      grips: [[0, 'handL', 'Muñeca']],
      arrows: [{ from: [200, 110], to: [110, 180], fighter: 0, bend: 0.4 }],
    },
    armbarFinish('Termina con sus piernas cruzadas sobre el pecho y extiende el brazo.'),
  ],

  'kimura-side': [
    {
      from: 'sideControl',
      text: 'Agarra la muñeca de su brazo lejano y llévala al suelo.',
      fighters: [{ reach: { handL: at('handL', 1, 2) } }, { reach: { handL: [128, 172] } }],
      grips: [[0, 'handL', 'Muñeca']],
    },
    {
      from: 'sideControl',
      text: 'Pasa el otro brazo por debajo de su brazo y agarra tu propia muñeca.',
      fighters: [
        { reach: { handL: at('handL', 1, 2), handR: at('handL', 1, -2, -4) } },
        { reach: { handL: [128, 172] } },
      ],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Tu muñeca'],
      ],
    },
    {
      from: 'sideControl',
      text: 'Sube su codo y lleva su mano hacia su espalda como si giraras un volante.',
      fighters: [
        { move: [0, -6], reach: { handL: at('handL', 1, 2), handR: at('handL', 1, -2, -4) } },
        { reach: { handL: [160, 150] }, bend: { handL: -1 } },
      ],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Tu muñeca'],
      ],
      arrows: [{ from: [126, 168], to: [166, 140], fighter: 0, bend: -0.4 }],
    },
  ],

  'kimura-north-south': [
    {
      from: 'northSouth',
      text: 'Agarra la muñeca de su brazo cercano y pégala a su cuerpo.',
      fighters: [{ reach: { handL: at('handL', 1, 0, 2) } }, { reach: { handL: [180, 160] } }],
      grips: [[0, 'handL', 'Muñeca']],
    },
    {
      from: 'northSouth',
      text: 'Pasa el otro brazo por debajo de su codo y agarra tu muñeca.',
      fighters: [
        { reach: { handL: at('handL', 1, 0, 2), handR: at('elbowL', 1, 0, 4) } },
        { reach: { handL: [180, 160] } },
      ],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Tu muñeca'],
      ],
    },
    {
      from: 'northSouth',
      text: 'Levanta su codo hacia su cabeza mientras su mano se queda pegada a la espalda.',
      fighters: [
        {
          move: [6, -10],
          angles: { spine: -30, neck: -20 },
          reach: { handL: at('handL', 1), handR: at('elbowL', 1, 0, 4) },
        },
        { rotate: -10, reach: { handL: [196, 160] } },
      ],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Tu muñeca'],
      ],
      arrows: [{ from: at('elbowL', 1, 0, -8), to: at('elbowL', 1, -24, -24), fighter: 0, bend: 0.3 }],
    },
  ],

  'kimura-turtle': [
    {
      from: 'turtle',
      text: 'Agarra la muñeca del brazo que apoya en el suelo.',
      fighters: [{ reach: { handL: at('handL', 1, 2, -2), handR: at('pelvis', 1, 0, -8) } }],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Cinturón'],
      ],
    },
    {
      from: 'turtle',
      text: 'Pasa el otro brazo por debajo de su axila y agarra tu muñeca.',
      fighters: [{ move: [-10, 4], reach: { handL: at('handL', 1, 2, -2), handR: at('handL', 1, -2, -4) } }],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Tu muñeca'],
      ],
    },
    {
      from: 'turtle',
      text: 'Lleva su mano hacia su espalda y gira el hombro: puedes rodar para terminar.',
      fighters: [
        {
          move: [-6, -8],
          angles: { spine: -130, neck: -140 },
          reach: { handL: at('handL', 1, 2), handR: at('handL', 1, -2, -4) },
        },
        { reach: { handL: [170, 140] }, bend: { handL: -1 } },
      ],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Tu muñeca'],
      ],
      arrows: [{ from: [120, 186], to: [170, 136], fighter: 0, bend: -0.3 }],
    },
  ],

  'americana-side': [
    {
      from: 'sideControl',
      text: 'Lleva su brazo lejano al suelo doblado en L, con la palma hacia arriba.',
      fighters: [
        { reach: { handL: at('handL', 1, 2) } },
        { reach: { handL: [116, 150] }, bend: { handL: 1 } },
      ],
      grips: [[0, 'handL', 'Muñeca']],
    },
    {
      from: 'sideControl',
      text: 'Pasa la otra mano por debajo de su brazo y agarra tu muñeca (figura de cuatro).',
      fighters: [
        { reach: { handL: at('handL', 1, 2), handR: at('elbowL', 1, -2, -4) } },
        { reach: { handL: [116, 150] }, bend: { handL: 1 } },
      ],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Tu muñeca'],
      ],
    },
    {
      from: 'sideControl',
      text: 'Arrastra su mano hacia su cadera y levanta el codo como si pintaras.',
      fighters: [
        { reach: { handL: at('handL', 1, 2), handR: at('elbowL', 1, -2, -4) } },
        { reach: { handL: [128, 166] }, bend: { handL: 1 } },
      ],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Tu muñeca'],
      ],
      arrows: [{ from: [112, 160], to: [140, 176], fighter: 0, bend: 0.3 }],
    },
  ],

  omoplata: [
    {
      from: 'closedGuard',
      text: 'Controla su manga, gira la cadera y pasa la pierna por encima de su hombro.',
      fighters: [
        {
          rotate: 14,
          reach: { handR: at('handR', 1, 3), footL: at('shoulderR', 1, 20, -8) },
          bend: { footL: -1 },
          layers: { legL: 4 },
        },
      ],
      grips: [[0, 'handR', 'Manga']],
    },
    {
      from: 'closedGuard',
      text: 'Gira hacia sus pies: su brazo queda atrapado entre tus piernas y lo obligas a caer de cara.',
      fighters: [
        {
          rotate: 30,
          move: [10, 0],
          reach: {
            handR: at('pelvis', 1, -4, -6),
            footL: at('shoulderR', 1, 20, 4),
            footR: at('shoulderR', 1, 24, 10),
          },
          bend: { footL: -1, footR: -1 },
          layers: { legL: 4 },
        },
        { rotate: -60, move: [-26, 22] },
      ],
      grips: [[0, 'handR', 'Cinturón']],
    },
    {
      from: 'closedGuard',
      text: 'Siéntate, controla su cintura para que no ruede y empuja su mano hacia su cabeza.',
      fighters: [
        { base: 'butterflyGuard:0', mirror: true, move: [50, 0], reach: { handL: at('pelvis', 1, 0, -6) } },
        { rotate: -60, move: [-26, 22] },
      ],
      grips: [[0, 'handL', 'Cintura']],
      arrows: [{ from: at('pelvis', 0, -6, -40), to: at('pelvis', 0, -30, -40), fighter: 0, bend: 0.2 }],
    },
  ],

  baratoplata: [
    {
      from: 'closedGuard',
      text: 'Pasa la pierna por encima de su hombro como en la omoplata.',
      fighters: [
        {
          rotate: 14,
          reach: { handR: at('handR', 1, 3), footL: at('shoulderR', 1, 20, -8) },
          bend: { footL: -1 },
          layers: { legL: 4 },
        },
      ],
      grips: [[0, 'handR', 'Manga']],
    },
    {
      from: 'closedGuard',
      text: 'En vez de girar, atrapa su mano contra tu cuerpo con la pierna sobre su espalda.',
      fighters: [
        {
          rotate: 24,
          reach: { handR: at('handR', 1, 3), handL: at('handR', 1, -3), footL: at('shoulderR', 1, 26, 2) },
          bend: { footL: -1 },
          layers: { legL: 4 },
        },
        { rotate: -30, move: [-12, 14] },
      ],
      grips: [
        [0, 'handR', 'Mano'],
        [0, 'handL', 'Mano'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Empuja su mano hacia su espalda y gira el tronco para rotar el hombro.',
      fighters: [
        {
          rotate: 34,
          reach: { handR: at('handR', 1, 3), handL: at('handR', 1, -3), footL: at('shoulderR', 1, 26, 2) },
          bend: { footL: -1 },
          layers: { legL: 4 },
        },
        { rotate: -30, move: [-12, 14], reach: { handR: [200, 150] } },
      ],
      grips: [[0, 'handR', 'Mano']],
      arrows: [{ from: at('handR', 1, 0, 8), to: at('handR', 1, 24, -6), fighter: 0, bend: -0.3 }],
    },
  ],

  'knee-armbar': [
    {
      from: 'sideControl',
      text: 'Cuando empuje con el brazo estirado, atrapa su muñeca contra tu cuerpo.',
      fighters: [{ reach: { handL: at('handL', 1, 0, 2) } }, { reach: { handL: [150, 140] } }],
      grips: [[0, 'handL', 'Muñeca']],
    },
    {
      from: 'sideControl',
      text: 'Pasa la rodilla por encima y pon la pierna detrás de su codo.',
      fighters: [
        {
          base: 'kneeOnBelly:0',
          move: [-34, 4],
          reach: { handL: at('handL', 1), footL: at('elbowL', 1, -4, 4) },
          layers: { legL: 4 },
        },
        { reach: { handL: [150, 140] } },
      ],
      grips: [[0, 'handL', 'Muñeca']],
    },
    {
      from: 'sideControl',
      text: 'Tira de la muñeca hacia ti contra tu rodilla, que hace de palanca en el codo.',
      fighters: [
        {
          base: 'kneeOnBelly:0',
          move: [-34, 4],
          angles: { spine: -80 },
          reach: { handL: at('handL', 1), handR: at('handL', 1, 3), footL: at('elbowL', 1, -4, 4) },
          layers: { legL: 4 },
        },
        { reach: { handL: [164, 130] } },
      ],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Muñeca'],
      ],
      arrows: [{ from: at('handL', 1, -10, 0), to: at('handL', 1, 14, -10), fighter: 0, bend: -0.2 }],
    },
  ],

  wristlock: [
    {
      from: 'sideControl',
      text: 'Cuando apoye la mano en tu cuerpo, atrápala contra ti con una mano.',
      fighters: [{ reach: { handR: at('handR', 1, 0, -2) } }],
      grips: [[0, 'handR', 'Mano']],
    },
    {
      from: 'sideControl',
      text: 'Con la otra mano empuja su antebrazo para doblar la muñeca hacia dentro.',
      fighters: [{ reach: { handR: at('handR', 1, 0, -2), handL: at('elbowR', 1, 4, -6) } }],
      grips: [
        [0, 'handR', 'Mano'],
        [0, 'handL', 'Antebrazo'],
      ],
      arrows: [{ from: at('elbowR', 1, 0, -10), to: at('handR', 1, 0, -14), fighter: 0, bend: 0.3 }],
    },
  ],

  'bicep-slicer': [
    {
      from: 'sideControl',
      text: 'Atrapa su brazo lejano cuando lo saque por encima de tu espalda.',
      fighters: [{ reach: { handL: at('elbowL', 1, 2) } }, { reach: { handL: [150, 126] } }],
      grips: [[0, 'handL', 'Codo']],
    },
    {
      from: 'sideControl',
      text: 'Mete tu antebrazo en el pliegue de su codo y agarra su muñeca con la otra mano.',
      fighters: [
        { move: [-6, -4], reach: { handL: at('elbowL', 1, 2, -4), handR: at('handL', 1, 2) } },
        { reach: { handL: [158, 140] }, bend: { handL: -1 } },
      ],
      grips: [
        [0, 'handL', 'Pliegue del codo'],
        [0, 'handR', 'Muñeca'],
      ],
    },
    {
      from: 'sideControl',
      text: 'Cierra su brazo sobre tu antebrazo llevando su mano hacia su hombro.',
      fighters: [
        { move: [-6, -4], reach: { handL: at('elbowL', 1, 2, -4), handR: at('handL', 1, 2) } },
        { reach: { handL: [146, 156] }, bend: { handL: -1 } },
      ],
      grips: [
        [0, 'handL', 'Pliegue del codo'],
        [0, 'handR', 'Muñeca'],
      ],
      arrows: [{ from: at('handL', 1, 14, -14), to: at('handL', 1, 0, 6), fighter: 0, bend: 0.3 }],
    },
  ],

  'straight-ankle-lock': [
    {
      from: 'butterflyGuard',
      text: 'Abraza su tobillo bajo la axila, con su pie junto a tu costado.',
      fighters: [
        {
          angles: { spine: -104, neck: -100 },
          reach: { handL: at('footR', 1, 4, -6), handR: at('footR', 1, 6, -2) },
        },
        seatedLeft(105, { reach: { footR: at('shoulderL', 0, 12, 22) } }),
      ],
      grips: [[0, 'handL', 'Tobillo']],
    },
    {
      from: 'butterflyGuard',
      text: 'Pon el filo del antebrazo en su tendón de Aquiles y agarra tu solapa o tu otra mano.',
      fighters: [
        {
          angles: { spine: -104, neck: -100 },
          reach: { handL: at('footR', 1, 10, -2), handR: at('footR', 1, 12, 2), footL: at('hipL', 1, -6, 0) },
        },
        seatedLeft(105, { reach: { footR: at('shoulderL', 0, 12, 22) } }),
      ],
      grips: [
        [0, 'handL', 'Aquiles'],
        [0, 'footL', 'Cadera'],
      ],
    },
    {
      from: 'butterflyGuard',
      text: 'Cae de espaldas con el pie en su cadera y arquea la espalda.',
      fighters: [
        lyingBack(20, {
          reach: {
            handL: at('footR', 1, 8, -4),
            handR: at('footR', 1, 10, 0),
            footL: at('hipL', 1, -6, 0),
            footR: at('kneeR', 1, 0, 6),
          },
        }),
        seatedLeft(110, { reach: { footR: [132, 168] } }),
      ],
      grips: [
        [0, 'handL', 'Aquiles'],
        [0, 'footL', 'Cadera'],
      ],
      arrows: [{ from: at('neck', 0), to: at('neck', 0, -20, -4), fighter: 0, bend: 0.2 }],
    },
  ],

  'heel-hook': [
    {
      from: 'butterflyGuard',
      text: 'Entra en el enredo de piernas: sus rodillas atrapadas entre las tuyas.',
      fighters: [
        {
          angles: { spine: -104, neck: -100 },
          reach: { handL: at('footR', 1, 4, -4), footL: at('hipL', 1, -4), footR: at('pelvis', 1, -2, 6) },
          layers: { legL: 4 },
        },
        seatedLeft(105, { reach: { footR: at('shoulderL', 0, 12, 24) } }),
      ],
      grips: [[0, 'handL', 'Pie']],
    },
    {
      from: 'butterflyGuard',
      text: 'Atrapa su talón en el pliegue del codo y junta las manos.',
      fighters: [
        {
          angles: { spine: -104, neck: -100 },
          reach: {
            handL: at('footR', 1, 0, -4),
            handR: at('footR', 1, 2, 2),
            footL: at('hipL', 1, -4),
            footR: at('pelvis', 1, -2, 6),
          },
          layers: { legL: 4 },
        },
        seatedLeft(105, { reach: { footR: at('shoulderL', 0, 12, 24) } }),
      ],
      grips: [
        [0, 'handL', 'Talón'],
        [0, 'handR', 'Manos juntas'],
      ],
    },
    {
      from: 'butterflyGuard',
      text: 'Gira el tronco hacia fuera, despacio: la rotación llega a la rodilla.',
      fighters: [
        lyingBack(20, {
          rotate: -10,
          reach: {
            handL: at('footR', 1, 0, -4),
            handR: at('footR', 1, 2, 2),
            footL: at('hipL', 1, -4),
            footR: at('pelvis', 1, -2, 6),
          },
          layers: { legL: 4 },
        }),
        seatedLeft(110, { reach: { footR: [134, 166] } }),
      ],
      grips: [[0, 'handL', 'Talón']],
      arrows: [{ from: at('shoulderL', 0, 0, -16), to: at('shoulderL', 0, -10, 10), fighter: 0, bend: 0.6 }],
    },
  ],

  'inside-heel-hook': [
    {
      from: 'butterflyGuard',
      text: 'Enredo interior: tu pierna por dentro de la suya y el pie sobre su cadera.',
      fighters: [
        {
          angles: { spine: -104, neck: -100 },
          reach: { handL: at('footL', 1, 4, -4), footR: at('hipL', 1, -4, -4) },
          layers: { legR: 4 },
        },
        seatedLeft(105, { reach: { footL: at('shoulderL', 0, 12, 24) } }),
      ],
      grips: [[0, 'handL', 'Pie']],
    },
    {
      from: 'butterflyGuard',
      text: 'Atrapa su talón con el antebrazo y junta las manos sobre tu pecho.',
      fighters: [
        {
          angles: { spine: -104, neck: -100 },
          reach: { handL: at('footL', 1, 0, -4), handR: at('footL', 1, 2, 2), footR: at('hipL', 1, -4, -4) },
          layers: { legR: 4 },
        },
        seatedLeft(105, { reach: { footL: at('shoulderL', 0, 12, 24) } }),
      ],
      grips: [
        [0, 'handL', 'Talón'],
        [0, 'handR', 'Manos juntas'],
      ],
    },
    {
      from: 'butterflyGuard',
      text: 'Gira hacia dentro, hacia su lado, rotando el talón.',
      fighters: [
        lyingBack(20, {
          rotate: 10,
          reach: { handL: at('footL', 1, 0, -4), handR: at('footL', 1, 2, 2), footR: at('hipL', 1, -4, -4) },
          layers: { legR: 4 },
        }),
        seatedLeft(110, { reach: { footL: [134, 166] } }),
      ],
      grips: [[0, 'handL', 'Talón']],
      arrows: [{ from: at('shoulderL', 0, -10, 10), to: at('shoulderL', 0, 0, -16), fighter: 0, bend: 0.6 }],
    },
  ],

  kneebar: [
    {
      from: 'halfGuard*',
      text: 'Desde arriba, abraza su pierna de fuera mirando hacia sus pies.',
      fighters: [
        { rotate: 40, move: [20, -4], reach: { handL: at('kneeL', 1, 2), handR: at('footL', 1, -2, -4) } },
      ],
      grips: [
        [0, 'handL', 'Rodilla'],
        [0, 'handR', 'Tobillo'],
      ],
    },
    {
      from: 'halfGuard*',
      text: 'Rueda de lado con su pierna entre las tuyas, la rótula apuntando hacia tu cadera.',
      fighters: [
        lyingBack(70, {
          mirror: true,
          reach: { handL: at('footL', 1, 0, -4), handR: at('footL', 1, 4), footL: at('pelvis', 1, 6, -4) },
        }),
        { reach: { footL: [216, 140] } },
      ],
      grips: [[0, 'handL', 'Tobillo']],
    },
    {
      from: 'halfGuard*',
      text: 'Abraza su tobillo contra tu pecho y extiende la cadera hacia delante.',
      fighters: [
        lyingBack(70, {
          mirror: true,
          rotate: 8,
          reach: { handL: at('footL', 1, 0, -4), handR: at('footL', 1, 4), footL: at('pelvis', 1, 6, -4) },
        }),
        { reach: { footL: [222, 146] } },
      ],
      grips: [
        [0, 'handL', 'Tobillo'],
        [0, 'handR', 'Tobillo'],
      ],
      arrows: [{ from: at('pelvis', 0, 0, 4), to: at('pelvis', 0, -14, -10), fighter: 0, bend: -0.3 }],
    },
  ],

  'toe-hold': [
    {
      from: 'butterflyGuard',
      text: 'Agarra su pie por los dedos con la mano del lado contrario.',
      fighters: [
        { angles: { spine: -104, neck: -100 }, reach: { handL: at('footR', 1, -2, -6) } },
        seatedLeft(100, { reach: { footR: [178, 170] } }),
      ],
      grips: [[0, 'handL', 'Dedos del pie']],
    },
    {
      from: 'butterflyGuard',
      text: 'Pasa la otra mano por detrás de su tobillo y agarra tu muñeca (figura de cuatro).',
      fighters: [
        {
          angles: { spine: -104, neck: -100 },
          reach: { handL: at('footR', 1, -2, -6), handR: at('footR', 1, 4, 2) },
        },
        seatedLeft(100, { reach: { footR: [178, 170] } }),
      ],
      grips: [
        [0, 'handL', 'Dedos del pie'],
        [0, 'handR', 'Tu muñeca'],
      ],
    },
    {
      from: 'butterflyGuard',
      text: 'Gira su pie hacia dentro empujando los dedos hacia su glúteo.',
      fighters: [
        {
          angles: { spine: -104, neck: -100 },
          rotate: -8,
          reach: { handL: at('footR', 1, -2, -6), handR: at('footR', 1, 4, 2) },
        },
        seatedLeft(100, { reach: { footR: [178, 170] } }),
      ],
      grips: [
        [0, 'handL', 'Dedos del pie'],
        [0, 'handR', 'Tu muñeca'],
      ],
      arrows: [{ from: at('footR', 1, -8, -14), to: at('footR', 1, 10, -16), fighter: 0, bend: 0.5 }],
    },
  ],

  'calf-slicer': [
    {
      from: 'turtle',
      text: 'Desde su espalda, mete un gancho por dentro de su pierna.',
      fighters: [
        {
          reach: { handL: at('neck', 1, 4, 12), footR: at('kneeR', 1, 6, -4) },
          bend: { footR: 1 },
          layers: { legR: 4 },
        },
      ],
      grips: [[0, 'footR', 'Gancho']],
    },
    {
      from: 'turtle',
      text: 'Pon tu espinilla detrás de su rodilla y agarra su pie.',
      fighters: [
        {
          move: [10, 6],
          angles: { spine: -150 },
          reach: { handR: at('footR', 1, -2, -6), footR: at('kneeR', 1, 4, -2) },
          bend: { footR: 1 },
          layers: { legR: 4 },
        },
        { angles: { thighR: 100, shinR: -40 } },
      ],
      grips: [
        [0, 'handR', 'Pie'],
        [0, 'footR', 'Detrás de la rodilla'],
      ],
    },
    {
      from: 'turtle',
      text: 'Tira de su pie hacia su glúteo, cerrando su pierna sobre tu espinilla.',
      fighters: [
        {
          move: [10, 6],
          angles: { spine: -150 },
          reach: {
            handR: at('footR', 1, -2, -6),
            handL: at('footR', 1, 2, -6),
            footR: at('kneeR', 1, 4, -2),
          },
          bend: { footR: 1 },
          layers: { legR: 4 },
        },
        { angles: { thighR: 100, shinR: -80 } },
      ],
      grips: [
        [0, 'handR', 'Pie'],
        [0, 'handL', 'Pie'],
      ],
      arrows: [{ from: at('footR', 1, 8, -6), to: at('footR', 1, -12, 10), fighter: 0, bend: 0.3 }],
    },
  ],
};
