import { type StepSpec, at } from '../steps';

// Controles y transiciones. Luchador 0 = quien ejecuta, 1 = compañero.

const seatbelt = { handL: at('neck', 1, 18, 4), handR: at('shoulderR', 1, 14, 14) };

export const TRANSITION_STEPS: Record<string, StepSpec[]> = {
  'side-to-knee-on-belly': [
    {
      from: 'sideControl',
      text: 'Agarra su solapa cercana y su pantalón por la cadera.',
      fighters: [{ reach: { handL: at('neck', 1, 10, -2), handR: at('hipR', 1, -2, -8) } }],
      grips: [
        [0, 'handL', 'Solapa'],
        [0, 'handR', 'Pantalón'],
      ],
    },
    {
      from: 'sideControl',
      text: 'Levántate sobre los pies de un salto, sin perder el contacto.',
      fighters: [
        {
          base: 'standing:1',
          move: [20, 20],
          angles: { spine: -130, neck: -140 },
          reach: { handL: at('neck', 1, 10, -2), handR: at('hipR', 1, -2, -8) },
        },
      ],
      grips: [
        [0, 'handL', 'Solapa'],
        [0, 'handR', 'Pantalón'],
      ],
    },
    {
      from: 'kneeOnBelly',
      text: 'Clava la rodilla en su abdomen con el pie de atrás apoyado y abierto.',
      fighters: [{ reach: { handL: at('neck', 1, 10, -2), handR: at('hipR', 1, -2, -8) } }],
      grips: [
        [0, 'handL', 'Solapa'],
        [0, 'handR', 'Pantalón'],
      ],
    },
  ],

  'side-to-north-south': [
    {
      from: 'sideControl',
      text: 'Mantén el pecho contra su pecho y apoya una mano junto a su cabeza.',
      fighters: [{ reach: { handL: at('head', 1, -14, 10), handR: at('hipR', 1, -2, -8) } }],
      grips: [[0, 'handR', 'Cadera']],
    },
    {
      from: 'sideControl',
      text: 'Camina con las piernas alrededor de su cabeza, sin levantar el pecho.',
      fighters: [
        {
          rotate: -40,
          move: [-50, 10],
          reach: { handL: at('shoulderL', 1, 0, -6), handR: at('shoulderL', 1, 14, -6) },
        },
      ],
      grips: [[0, 'handL', 'Brazo']],
      arrows: [{ from: [230, 190], to: [110, 160], fighter: 0, bend: 0.5 }],
    },
    { from: 'northSouth', text: 'Termina en norte-sur, pecho con pecho.' },
  ],

  'mount-to-back': [
    {
      from: 'mount',
      text: 'Cuando gire para escapar, acompáñalo y sube tu rodilla junto a su espalda.',
      fighters: [{ move: [0, -4] }, { base: 'turtle:1', move: [20, 0], angles: { spine: 192 } }],
    },
    {
      from: 'mount',
      text: 'Mete el primer gancho por dentro de su muslo y cierra el cinturón de seguridad.',
      fighters: [
        {
          base: 'turtle:0',
          move: [-10, 0],
          reach: {
            handL: at('neck', 1, 4, 12),
            handR: at('shoulderR', 1, 10, 18),
            footR: at('hipR', 1, -4, 22),
          },
          bend: { footR: 1 },
          layers: { legR: 4 },
        },
        { base: 'turtle:1', move: [20, 0] },
      ],
      grips: [
        [0, 'handL', 'Cinturón de seguridad'],
        [0, 'footR', 'Gancho'],
      ],
    },
    { from: 'backControl', text: 'Rueda hacia un lado y mete el segundo gancho.' },
  ],

  'half-guard-back-take': [
    {
      from: 'halfGuard',
      text: 'Ponte de lado y gana el underhook por debajo de su axila.',
      fighters: [{ rotate: -14, reach: { handR: at('shoulderL', 1, 6, 14) } }],
      grips: [[0, 'handR', 'Underhook']],
    },
    {
      from: 'halfGuard',
      text: 'Sal por debajo hacia su espalda, con la cabeza pegada a su costado.',
      fighters: [
        { base: 'turtle:1', mirror: true, move: [10, 6], reach: { handR: at('pelvis', 1, 0, -10) } },
        { base: 'turtle:1', move: [10, -6] },
      ],
      grips: [[0, 'handR', 'Cintura']],
    },
    {
      from: 'halfGuard',
      text: 'Sube a su espalda con el cinturón de seguridad y el primer gancho.',
      fighters: [
        {
          base: 'turtle:0',
          move: [-20, -6],
          reach: {
            handL: at('neck', 1, 4, 12),
            handR: at('shoulderR', 1, 10, 18),
            footR: at('hipR', 1, -4, 22),
          },
          bend: { footR: 1 },
          layers: { legR: 4 },
        },
        { base: 'turtle:1', move: [10, -6] },
      ],
      grips: [[0, 'handL', 'Cinturón de seguridad']],
    },
    { from: 'backControl', text: 'Mete el segundo gancho: espalda.' },
  ],

  'arm-drag-guard': [
    {
      from: 'closedGuard',
      text: 'Agarra su muñeca con una mano y su tríceps con la otra.',
      fighters: [{ reach: { handR: at('handR', 1, 0, 2), handL: at('elbowR', 1, 0, -4) } }],
      grips: [
        [0, 'handR', 'Muñeca'],
        [0, 'handL', 'Tríceps'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Tira de su brazo cruzándolo por delante de ti mientras te sientas.',
      fighters: [
        { base: 'butterflyGuard:0', move: [10, 0], reach: { handL: at('elbowR', 1, 0, -4) } },
        { reach: { handR: [120, 150] } },
      ],
      grips: [[0, 'handL', 'Tríceps']],
      arrows: [{ from: at('elbowR', 1, 10, 0), to: at('elbowR', 1, -26, 10), fighter: 0, bend: 0.3 }],
    },
    {
      from: 'closedGuard',
      text: 'Sube por detrás de él rodeando su espalda.',
      fighters: [
        {
          base: 'turtle:0',
          move: [10, 0],
          reach: { handL: at('neck', 1, 4, 12), handR: at('pelvis', 1, 0, -10) },
        },
        { base: 'turtle:1', move: [10, 0] },
      ],
      grips: [[0, 'handL', 'Cinturón de seguridad']],
    },
    { from: 'backControl', text: 'Mete los ganchos: espalda.' },
  ],

  'break-posture': [
    {
      from: 'closedGuard',
      text: 'Agarra su cuello o nuca con las dos manos.',
      fighters: [{ reach: { handL: at('head', 1, 4, -4), handR: at('neck', 1, 4, -2) } }],
      grips: [
        [0, 'handL', 'Nuca'],
        [0, 'handR', 'Cuello'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Tira de la cabeza hacia ti y cierra las rodillas hacia tu pecho.',
      fighters: [
        {
          angles: { thighL: -70, shinL: 0, thighR: -62, shinR: 10 },
          reach: { handL: at('head', 1, 4, -4), handR: at('neck', 1, 4, -2) },
        },
        { rotate: -40, move: [-14, 14] },
      ],
      grips: [
        [0, 'handL', 'Nuca'],
        [0, 'handR', 'Cuello'],
      ],
      arrows: [{ from: at('head', 1, 6, -14), to: at('head', 1, -16, 6), fighter: 0, bend: 0.3 }],
    },
  ],

  'guard-retention': [
    {
      from: 'butterflyGuard',
      text: 'Cuando intente rodear tus piernas, apoya la espalda y gira hacia él.',
      fighters: [
        { base: 'closedGuard:0', move: [-10, 0], angles: { thighL: -70, shinL: 10, thighR: -60, shinR: 20 } },
        { base: 'standing:1', move: [30, 0] },
      ],
    },
    {
      from: 'butterflyGuard',
      text: 'Mete las rodillas entre tu pecho y él, con los pies en sus caderas.',
      fighters: [
        {
          base: 'closedGuard:0',
          move: [-10, 0],
          reach: { footL: at('hipL', 1, -4, 0), footR: at('pelvis', 1, -4, 6) },
        },
        { base: 'standing:1', move: [30, 0], angles: { spine: -110 } },
      ],
      grips: [
        [0, 'footL', 'Cadera'],
        [0, 'footR', 'Cadera'],
      ],
    },
    { from: 'butterflyGuard', text: 'Recupera los ganchos: guardia de nuevo.' },
  ],

  'technical-standup': [
    {
      from: 'butterflyGuard',
      text: 'Apoya una mano detrás y el pie contrario delante; la otra mano protege la cara.',
      fighters: [
        {
          angles: { spine: -110, neck: -100, upperArmL: 120, forearmL: 110 },
          reach: { handL: [100, 198], footR: [176, 198] },
        },
        { base: 'standing:1', move: [30, 0] },
      ],
    },
    {
      from: 'butterflyGuard',
      text: 'Levanta la cadera apoyándote en la mano y el pie, y pasa la otra pierna por detrás.',
      fighters: [
        {
          move: [-6, -30],
          angles: { spine: -120, neck: -100, thighL: 140, shinL: 100 },
          reach: { handL: [100, 198], footR: [168, 198] },
        },
        { base: 'standing:1', move: [30, 0] },
      ],
      arrows: [{ from: at('kneeL', 0, 10, 10), to: [96, 190], fighter: 0, bend: 0.4 }],
    },
    { from: 'standing', text: 'De pie, en guardia y a distancia.' },
  ],

  'mount-control': [
    {
      from: 'mount',
      text: 'Rodillas altas, pegadas a sus axilas, y el peso en tu cadera.',
      fighters: [{ move: [-8, 0] }],
    },
    {
      from: 'mount',
      text: 'Cuando puentee, abre los brazos como base y adelanta el peso.',
      fighters: [
        {
          move: [-8, -10],
          angles: { spine: -140, neck: -150 },
          reach: { handL: [96, 198], handR: [110, 198] },
        },
        { move: [0, -10] },
      ],
      arrows: [{ from: at('pelvis', 1, 0, 14), to: at('pelvis', 1, 0, -6), fighter: 0 }],
    },
    {
      from: 'mount',
      text: 'Al bajar, vuelve a sentarte y sube las rodillas otra vez.',
      fighters: [{ move: [-12, 0] }],
    },
  ],

  grapevine: [
    {
      from: 'mount',
      text: 'Baja el pecho sobre el suyo, con un brazo bajo su cabeza.',
      fighters: [
        {
          move: [-4, 10],
          angles: { spine: -160, neck: -170 },
          reach: { handL: at('head', 1, 0, 6), handR: [110, 198] },
        },
      ],
      grips: [[0, 'handL', 'Cabeza']],
    },
    {
      from: 'mount',
      text: 'Mete los pies por dentro de sus piernas y engánchalas por los tobillos.',
      fighters: [
        {
          move: [-4, 10],
          angles: { spine: -160, neck: -170 },
          reach: {
            handL: at('head', 1, 0, 6),
            handR: [110, 198],
            footL: at('footL', 1, -4, -4),
            footR: at('footR', 1, -4, -4),
          },
        },
        { angles: { thighL: -10, shinL: 0, thighR: -6, shinR: 6 } },
      ],
      grips: [
        [0, 'footL', 'Gancho'],
        [0, 'footR', 'Gancho'],
      ],
    },
    {
      from: 'mount',
      text: 'Estira sus piernas abriendo las tuyas: ya no puede puentear.',
      fighters: [
        {
          move: [-4, 10],
          angles: { spine: -160, neck: -170 },
          reach: {
            handL: at('head', 1, 0, 6),
            handR: [110, 198],
            footL: at('footL', 1, -4, -4),
            footR: at('footR', 1, -4, -4),
          },
        },
        { angles: { thighL: 0, shinL: 0, thighR: 4, shinR: 4 } },
      ],
      grips: [[0, 'footL', 'Gancho']],
      arrows: [{ from: at('kneeL', 1, 0, -10), to: at('kneeL', 1, 20, -4), fighter: 0, bend: 0.2 }],
    },
  ],

  seatbelt: [
    {
      from: 'backControl',
      text: 'Pasa un brazo por encima de su hombro, cruzando el pecho.',
      fighters: [{ reach: { handL: at('neck', 1, 18, 4) } }],
      grips: [[0, 'handL', 'Por encima del hombro']],
    },
    {
      from: 'backControl',
      text: 'El otro brazo entra por debajo de su axila.',
      fighters: [{ reach: seatbelt }],
      grips: [
        [0, 'handL', 'Por encima del hombro'],
        [0, 'handR', 'Por debajo de la axila'],
      ],
    },
    {
      from: 'backControl',
      text: 'Cierra las manos sobre su pecho, con la mano de abajo cubriendo la de arriba.',
      fighters: [{ reach: { handL: at('neck', 1, 16, 14), handR: at('neck', 1, 18, 16) } }],
      grips: [[0, 'handL', 'Manos cerradas']],
    },
  ],

  'body-triangle': [
    {
      from: 'backControl',
      text: 'Con el cinturón de seguridad, saca un gancho y rodea su cintura con esa pierna.',
      fighters: [{ reach: { ...seatbelt, footL: at('pelvis', 1, 24, 0) }, layers: { legL: 4 } }],
      grips: [[0, 'handL', 'Cinturón de seguridad']],
    },
    {
      from: 'backControl',
      text: 'Cierra el triángulo con la corva sobre tu otro pie.',
      fighters: [
        {
          reach: { ...seatbelt, footL: at('pelvis', 1, 24, 0), footR: at('pelvis', 1, 26, 4) },
          layers: { legL: 4 },
        },
      ],
      grips: [
        [0, 'handL', 'Cinturón de seguridad'],
        [0, 'footR', 'Triángulo'],
      ],
    },
    {
      from: 'backControl',
      text: 'Aprieta las rodillas y estira la cadera para comprimir su cintura.',
      fighters: [
        {
          move: [-4, 0],
          rotate: -8,
          reach: { ...seatbelt, footL: at('pelvis', 1, 24, 0), footR: at('pelvis', 1, 26, 4) },
          layers: { legL: 4 },
        },
        { rotate: -6 },
      ],
      grips: [[0, 'footR', 'Triángulo']],
      arrows: [{ from: at('pelvis', 1, 30, -16), to: at('pelvis', 1, 14, -16), fighter: 0 }],
    },
  ],

  'scarf-hold': [
    {
      from: 'sideControl',
      text: 'Rodea su cabeza con un brazo y atrapa su brazo cercano bajo tu axila.',
      fighters: [{ reach: { handL: at('head', 1, 0, 8), handR: at('elbowL', 1, 0, 0) } }],
      grips: [
        [0, 'handL', 'Cabeza'],
        [0, 'handR', 'Brazo'],
      ],
    },
    {
      from: 'sideControl',
      text: 'Siéntate a su lado con la cadera pegada a su costado y las piernas abiertas.',
      fighters: [
        {
          base: 'butterflyGuard:0',
          mirror: true,
          rotate: -10,
          move: [10, 0],
          reach: {
            handL: at('head', 1, 0, 8),
            handR: at('elbowL', 1, 0, 0),
            footL: [96, 198],
            footR: [236, 198],
          },
        },
      ],
      grips: [
        [0, 'handL', 'Cabeza'],
        [0, 'handR', 'Brazo'],
      ],
    },
  ],

  crossface: [
    {
      from: 'halfGuard*',
      text: 'Pasa el antebrazo por debajo de su cara, con la mano en su hombro lejano.',
      fighters: [{ reach: { handL: at('head', 1, -12, 8) } }],
      grips: [[0, 'handL', 'Hombro lejano']],
    },
    {
      from: 'halfGuard*',
      text: 'Gira su cara hacia el otro lado con el hombro y aplánalo de espaldas.',
      fighters: [
        { move: [-4, 4], angles: { spine: -160, neck: -170 }, reach: { handL: at('head', 1, -12, 8) } },
        { angles: { neck: 170 } },
      ],
      grips: [[0, 'handL', 'Hombro lejano']],
      arrows: [{ from: at('shoulderL', 0, 0, -12), to: at('head', 1, 0, -6), fighter: 0 }],
    },
  ],

  'double-under-hooks-butterfly': [
    {
      from: 'butterflyGuard',
      text: 'Mete los dos brazos por debajo de sus axilas.',
      fighters: [{ reach: { handL: at('shoulderL', 1, 10, 12), handR: at('shoulderL', 1, 14, 16) } }],
      grips: [[0, 'handL', 'Underhooks']],
    },
    {
      from: 'butterflyGuard',
      text: 'Pega tu pecho al suyo con la cabeza bajo su barbilla y los ganchos dentro de sus muslos.',
      fighters: [
        {
          move: [10, 0],
          angles: { spine: -60, neck: -50 },
          reach: {
            handL: at('shoulderL', 1, 10, 12),
            handR: at('shoulderL', 1, 14, 16),
            footL: at('kneeL', 1, 0, -10),
            footR: at('kneeR', 1, 0, -10),
          },
        },
      ],
      grips: [
        [0, 'handL', 'Underhooks'],
        [0, 'footL', 'Gancho'],
      ],
    },
  ],

  's-mount': [
    {
      from: 'mount',
      text: 'Sube la rodilla de un lado junto a su cabeza.',
      fighters: [{ move: [-14, -2], angles: { thighL: 200, shinL: 110 } }],
    },
    {
      from: 'mount',
      text: 'Dobla la otra pierna con el pie bajo su costado: forma una S.',
      fighters: [{ move: [-14, -2], angles: { thighL: 200, shinL: 110, thighR: 120, shinR: 0 } }],
    },
    {
      from: 'mount',
      text: 'Controla su brazo contra tu pecho para preparar el armbar.',
      fighters: [
        {
          move: [-14, -2],
          angles: { thighL: 200, shinL: 110, thighR: 120, shinR: 0 },
          reach: { handL: at('handL', 1, 0, 2), handR: at('elbowL', 1) },
        },
        { reach: { handL: [150, 120] } },
      ],
      grips: [
        [0, 'handL', 'Muñeca'],
        [0, 'handR', 'Codo'],
      ],
    },
  ],
};
