import { type PoseMod, type StepSpec, type Target, at } from '../steps';

// Derribos y proyecciones. Luchador 0 = quien proyecta, 1 = compañero.

/** Agarre clásico de judo: solapa y manga. */
const lapelSleeve = { handL: at('neck', 1, 4, 14), handR: at('elbowL', 1, 2, 4) };
const lapelSleeveGrips: [0, 'handL' | 'handR', string][] = [
  [0, 'handL', 'Solapa'],
  [0, 'handR', 'Manga'],
];

/** Compañero en el aire, girado `deg` grados alrededor de su cadera. */
const airborne = (deg: number, dx: number, dy: number, extra: PoseMod = {}): PoseMod => ({
  rotate: deg,
  move: [dx, dy],
  ...extra,
});

/** Tres pasos típicos de una proyección: agarre, entrada y lanzamiento. */
function throwSteps(o: {
  grip?: string;
  entry: {
    text: string;
    me: PoseMod;
    partner?: PoseMod;
    grips?: [0, 'handL' | 'handR' | 'footL' | 'footR', string][];
  };
  throw: { text: string; me: PoseMod; partner: PoseMod; arrow: [Target, Target, number?] };
  finish?: string;
}): StepSpec[] {
  return [
    {
      from: 'standing',
      text: o.grip ?? 'Agarra solapa y manga y desequilibra tirando de la manga hacia ti.',
      fighters: [{ move: [10, 0], reach: lapelSleeve }],
      grips: lapelSleeveGrips,
    },
    {
      from: 'standing',
      text: o.entry.text,
      fighters: [o.entry.me, o.entry.partner],
      grips: o.entry.grips ?? lapelSleeveGrips,
    },
    {
      from: 'standing',
      text: o.throw.text,
      fighters: [o.throw.me, o.throw.partner],
      grips: lapelSleeveGrips,
      arrows: [{ from: o.throw.arrow[0], to: o.throw.arrow[1], fighter: 0, bend: o.throw.arrow[2] ?? 0.4 }],
    },
    {
      from: 'sideControl',
      text: o.finish ?? 'Sin soltar la manga, acompáñalo al suelo y asienta el control lateral.',
    },
  ];
}

export const TAKEDOWN_STEPS: Record<string, StepSpec[]> = {
  'single-leg': [
    {
      from: 'doubleLeg',
      text: 'Entra a una pierna: rodilla al suelo, cabeza pegada a su costado y manos detrás de su rodilla.',
      fighters: [{ reach: { handL: at('kneeL', 1, 6, -6), handR: at('kneeL', 1, 6, 0) } }],
      grips: [[0, 'handL', 'Detrás de la rodilla']],
    },
    {
      from: 'doubleLeg',
      text: 'Levántate con su pierna atrapada entre las tuyas, la cabeza alta.',
      fighters: [
        {
          base: 'standing:0',
          move: [40, 6],
          angles: { spine: -60, neck: -50 },
          reach: { handL: at('footR', 1, 0, -20), handR: at('footR', 1, 4, -14) },
        },
        { reach: { footR: [176, 140] } },
      ],
      grips: [[0, 'handL', 'Pierna']],
    },
    {
      from: 'doubleLeg',
      text: 'Gira en diagonal o barre su pierna de apoyo para hacerlo caer.',
      fighters: [
        {
          base: 'standing:0',
          move: [40, 6],
          angles: { spine: -60, neck: -50 },
          reach: { handL: at('footR', 1, 0, -20), footR: at('footL', 1, -4) },
        },
        { rotate: 30, move: [10, 10], reach: { footR: [176, 140] } },
      ],
      grips: [
        [0, 'handL', 'Pierna'],
        [0, 'footR', 'Barrido'],
      ],
      arrows: [{ from: at('head', 1), to: [270, 170], fighter: 0, bend: 0.3 }],
    },
    { from: 'sideControl', text: 'Cae encima y asienta el control lateral.' },
  ],

  'ankle-pick': [
    {
      from: 'standing',
      text: 'Agarra su nuca y tira hacia abajo para que adelante el peso.',
      fighters: [
        { move: [10, 0], reach: { handL: at('neck', 1, -2, -4) } },
        { angles: { spine: -110, neck: -125 } },
      ],
      grips: [[0, 'handL', 'Nuca']],
    },
    {
      from: 'standing',
      text: 'Da un paso al lado y baja a recoger su tobillo adelantado.',
      fighters: [
        {
          base: 'doubleLeg:0',
          move: [40, 0],
          reach: { handL: at('neck', 1, -2, -4), handR: at('footR', 1, -2, -4) },
        },
        { angles: { spine: -115, neck: -130 } },
      ],
      grips: [
        [0, 'handL', 'Nuca'],
        [0, 'handR', 'Tobillo'],
      ],
    },
    {
      from: 'standing',
      text: 'Tira del tobillo hacia ti y empuja con la mano de la nuca: cae sentado.',
      fighters: [
        {
          base: 'doubleLeg:0',
          move: [50, 0],
          reach: { handL: at('neck', 1, -2, -4), handR: at('footR', 1, -2, -4) },
        },
        { rotate: 30, move: [10, 26], reach: { footR: [176, 170] } },
      ],
      grips: [[0, 'handR', 'Tobillo']],
      arrows: [{ from: at('footR', 1, 10), to: at('footR', 1, -20, -10), fighter: 0, bend: 0.3 }],
    },
    { from: 'sideControl', text: 'Pasa sus piernas y asienta el control lateral.' },
  ],

  'o-soto-gari': throwSteps({
    entry: {
      text: 'Da un paso al lado de su pierna con el pie de apoyo, pecho contra pecho, y empújalo hacia su talón.',
      me: { move: [34, 0], angles: { spine: -80, neck: -80 }, reach: lapelSleeve },
      partner: { angles: { spine: -80, neck: -70 } },
    },
    throw: {
      text: 'Barre su pierna por fuera con la tuya, de atrás hacia delante, mientras lo empujas.',
      me: { move: [34, 0], angles: { spine: -150, neck: -160, thighR: 20, shinR: -10 }, reach: lapelSleeve },
      partner: airborne(50, 4, 30),
      arrow: [at('footR', 0, -20, -20), at('footR', 0, 6, -6), 0.4],
    },
  }),

  'ko-soto-gari': throwSteps({
    entry: {
      text: 'Haz que apoye el peso en el talón adelantado empujando en diagonal.',
      me: { move: [24, 0], reach: lapelSleeve },
      partner: { angles: { spine: -80, neck: -75 } },
    },
    throw: {
      text: 'Siega su talón con la planta del pie, por fuera, en la dirección de sus dedos.',
      me: { move: [24, 0], reach: { ...lapelSleeve, footR: at('footR', 1, 4, -2) } },
      partner: airborne(40, 4, 34, { reach: { footR: [230, 160] } }),
      arrow: [at('footR', 1, 10, 6), at('footR', 1, -10, -10), 0.4],
    },
  }),

  'o-uchi-gari': [
    ...throwSteps({
      entry: {
        text: 'Acércate y lleva su peso hacia atrás, entre sus talones.',
        me: { move: [30, 0], angles: { spine: -84 }, reach: lapelSleeve },
        partner: { angles: { spine: -80, neck: -75 } },
      },
      throw: {
        text: 'Engancha por dentro su pierna con la tuya, en semicírculo, y empuja hacia atrás.',
        me: {
          move: [30, 8],
          angles: { spine: -120 },
          reach: { ...lapelSleeve, footR: at('kneeR', 1, 2, 20) },
          bend: { footR: 1 },
          layers: { legR: 4 },
        },
        partner: airborne(45, 10, 34),
        arrow: [at('kneeR', 0, -10), at('kneeR', 0, 14, -6), 0.4],
      },
    }).slice(0, 3),
    { from: 'closedGuard*', text: 'Cae entre sus piernas y empieza a pasar la guardia.' },
  ],

  'ko-uchi-gari': [
    ...throwSteps({
      entry: {
        text: 'Empújalo en diagonal hacia atrás para cargar el peso en su talón.',
        me: { move: [24, 0], reach: lapelSleeve },
        partner: { angles: { spine: -80, neck: -75 } },
      },
      throw: {
        text: 'Siega su tobillo por dentro con la planta del pie y empuja hacia abajo.',
        me: {
          move: [26, 6],
          angles: { spine: -110 },
          reach: { ...lapelSleeve, footR: at('footL', 1, -2, -2) },
        },
        partner: airborne(40, 10, 34, { reach: { footL: [226, 170] } }),
        arrow: [at('footL', 1, -14, 4), at('footL', 1, 10, -6), 0.4],
      },
    }).slice(0, 3),
    { from: 'closedGuard*', text: 'Cae dentro de su guardia y empieza a pasarla.' },
  ],

  'de-ashi-barai': throwSteps({
    grip: 'Agarra solapa y manga y muévete con él para que dé pasos.',
    entry: {
      text: 'Justo cuando va a apoyar el pie adelantado, lleva el tuyo a su tobillo.',
      me: { move: [20, 0], reach: { ...lapelSleeve, footR: at('footR', 1, -6, -4) } },
      partner: { angles: { thighR: 80, shinR: 120 } },
    },
    throw: {
      text: 'Barre ese pie en la dirección en la que se movía y tira de la manga hacia abajo.',
      me: { move: [20, 0], reach: { ...lapelSleeve, footR: [232, 196] } },
      partner: airborne(-60, -6, 40),
      arrow: [at('footR', 0, -20, 0), at('footR', 0, 10, -6), 0.2],
    },
  }),

  'o-goshi': throwSteps({
    grip: 'Rodea su cintura con un brazo por debajo de su axila y controla la manga.',
    entry: {
      text: 'Gira de espaldas metiendo tu cadera por debajo de la suya, rodillas flexionadas.',
      me: {
        mirror: true,
        move: [56, 14],
        angles: { thighL: 100, shinL: 80, thighR: 80, shinR: 100 },
        reach: { handL: at('pelvis', 1, 0, -20) },
      },
      partner: { move: [-6, 0], angles: { spine: -100 } },
      grips: [[0, 'handL', 'Cintura']],
    },
    throw: {
      text: 'Estira las piernas y gira el tronco: pasa por encima de tu cadera.',
      me: {
        mirror: true,
        move: [56, 6],
        angles: { spine: -40, neck: -30 },
        reach: { handL: at('pelvis', 1, 0, -10) },
      },
      partner: airborne(-120, -16, -10),
      arrow: [at('head', 1, 0, -10), at('head', 1, -40, 60), 0.5],
    },
  }),

  'harai-goshi': throwSteps({
    entry: {
      text: 'Gira de espaldas pegando tu cadera a la suya, sobre una pierna.',
      me: { mirror: true, move: [56, 10], angles: { spine: -70 }, reach: lapelSleeve },
      partner: { move: [-6, 0], angles: { spine: -100 } },
    },
    throw: {
      text: 'Barre su muslo con tu pierna extendida hacia atrás mientras tiras de la manga.',
      me: {
        mirror: true,
        move: [56, 10],
        angles: { spine: -40, neck: -30, thighL: -10, shinL: -10 },
        reach: lapelSleeve,
      },
      partner: airborne(-110, -10, 0),
      arrow: [at('kneeL', 0, 10, 20), at('kneeL', 0, 20, -20), 0.4],
    },
  }),

  'uchi-mata': throwSteps({
    entry: {
      text: 'Gira de espaldas a él y mete tu pierna entre las suyas.',
      me: { mirror: true, move: [56, 10], angles: { spine: -70 }, reach: lapelSleeve },
      partner: { move: [-6, 0], angles: { spine: -100 } },
    },
    throw: {
      text: 'Levanta el interior de su muslo con tu pierna mientras bajas la cabeza y tiras de la manga.',
      me: {
        mirror: true,
        move: [56, 10],
        angles: { spine: -10, neck: 10, thighL: -60, shinL: -60 },
        reach: lapelSleeve,
      },
      partner: airborne(-110, -10, -6),
      arrow: [at('kneeL', 0, 0, 20), at('kneeL', 0, 10, -30), 0.4],
    },
  }),

  'seoi-nage': throwSteps({
    entry: {
      text: 'Gira de espaldas metiendo el brazo bajo su axila, con las rodillas flexionadas.',
      me: {
        mirror: true,
        move: [56, 18],
        angles: { thighL: 110, shinL: 70, thighR: 70, shinR: 110 },
        reach: { handL: at('shoulderL', 1, 0, 10) },
      },
      partner: { move: [-6, 0], angles: { spine: -105 } },
    },
    throw: {
      text: 'Tira de la manga hacia abajo, estira las piernas y cárgalo sobre tu hombro.',
      me: {
        mirror: true,
        move: [56, 10],
        angles: { spine: -30, neck: -10 },
        reach: { handL: at('shoulderL', 1, 0, 10) },
      },
      partner: airborne(-140, -20, -14),
      arrow: [at('head', 1, 0, -10), at('head', 1, -60, 80), 0.5],
    },
  }),

  'drop-seoi-nage': throwSteps({
    entry: {
      text: 'Gira de espaldas y déjate caer de rodillas entre sus pies.',
      me: {
        base: 'doubleLeg:0',
        mirror: true,
        move: [70, 30],
        angles: { spine: -80, neck: -80 },
        reach: lapelSleeve,
      },
      partner: { move: [-6, 0], angles: { spine: -110 } },
    },
    throw: {
      text: 'Tira de la manga hacia abajo y gira el tronco: pasa por encima de tus hombros.',
      me: {
        base: 'doubleLeg:0',
        mirror: true,
        move: [70, 34],
        angles: { spine: -20, neck: 0 },
        reach: lapelSleeve,
      },
      partner: airborne(-140, -20, 0),
      arrow: [at('head', 1, 0, -10), at('head', 1, -50, 70), 0.5],
    },
  }),

  'tai-otoshi': throwSteps({
    entry: {
      text: 'Gira de espaldas y estira tu pierna por delante de su tobillo.',
      me: {
        mirror: true,
        move: [56, 16],
        angles: { thighL: 60, shinL: 80, thighR: 120, shinR: 90 },
        reach: lapelSleeve,
      },
      partner: { move: [-6, 0], angles: { spine: -100 } },
    },
    throw: {
      text: 'Gira los brazos como un volante: tropieza con tu pierna y cae delante.',
      me: {
        mirror: true,
        move: [56, 16],
        angles: { spine: -60, neck: -50, thighL: 60, shinL: 80, thighR: 120, shinR: 90 },
        reach: lapelSleeve,
      },
      partner: airborne(-80, -20, 20),
      arrow: [at('head', 1, 0, -10), at('head', 1, -40, 40), 0.4],
    },
  }),

  'kata-guruma': throwSteps({
    entry: {
      text: 'Baja el nivel, mete la cabeza bajo su axila y el brazo entre sus piernas.',
      me: {
        base: 'doubleLeg:0',
        move: [40, 0],
        reach: { handL: at('kneeL', 1, 0, -4), handR: at('elbowL', 1, 2, 4) },
      },
      partner: { angles: { spine: -110 } },
      grips: [
        [0, 'handL', 'Pierna'],
        [0, 'handR', 'Manga'],
      ],
    },
    throw: {
      text: 'Levántate con él cruzado sobre tus hombros y déjalo caer por el lado.',
      me: {
        move: [40, 0],
        angles: { spine: -95 },
        reach: { handL: at('kneeL', 1, 0, -4), handR: at('elbowL', 1, 2, 4) },
      },
      partner: airborne(-90, -20, -40),
      arrow: [at('head', 1), at('head', 1, 60, 80), -0.4],
    },
  }),

  'tani-otoshi': throwSteps({
    grip: 'Colócate a su lado, con el brazo rodeando su espalda.',
    entry: {
      text: 'Pon tu pierna por detrás de sus dos talones.',
      me: { move: [56, 0], reach: { handL: at('pelvis', 1, 4, -10), footR: at('footL', 1, 10, 0) } },
      grips: [[0, 'handL', 'Espalda']],
    },
    throw: {
      text: 'Déjate caer de lado hacia atrás arrastrándolo contigo.',
      me: { base: 'closedGuard:0', move: [40, 0], reach: { handL: at('pelvis', 1, 4, -10) } },
      partner: airborne(60, 10, 30),
      arrow: [at('head', 1), at('head', 1, 60, 70), -0.4],
    },
  }),

  'body-lock-takedown': throwSteps({
    grip: 'Cierra las manos alrededor de su cintura, con la cabeza pegada a su pecho.',
    entry: {
      text: 'Pega tu cadera a la suya y da un paso por fuera de su pierna.',
      me: {
        move: [44, 6],
        angles: { spine: -70, neck: -60 },
        reach: { handL: at('pelvis', 1, 4, -10), handR: at('pelvis', 1, 8, -6), footR: at('footR', 1, 8, 0) },
      },
      grips: [[0, 'handL', 'Cierre de cuerpo']],
    },
    throw: {
      text: 'Bloquea su pierna con la tuya y empújalo hacia atrás en diagonal.',
      me: {
        move: [50, 10],
        angles: { spine: -50, neck: -40 },
        reach: { handL: at('pelvis', 1, 4, -10), handR: at('pelvis', 1, 8, -6) },
      },
      partner: airborne(50, 10, 30),
      arrow: [at('head', 1), at('head', 1, 60, 80), -0.4],
    },
  }),

  'tomoe-nage': [
    ...throwSteps({
      entry: {
        text: 'Tira de él hacia ti, déjate caer de espaldas y pon un pie en su cadera.',
        me: {
          base: 'closedGuard:0',
          move: [-20, 0],
          reach: { ...lapelSleeve, footR: at('pelvis', 1, -2, 0) },
        },
        partner: { move: [-20, 20], angles: { spine: -130, neck: -140 } },
      },
      throw: {
        text: 'Estira la pierna y tira de los brazos: pasa por encima de ti.',
        me: {
          base: 'closedGuard:0',
          move: [-20, 0],
          reach: { ...lapelSleeve, footR: at('pelvis', 1, -2, 0) },
        },
        partner: airborne(-150, -40, 0),
        arrow: [at('head', 1), at('head', 1, -60, 70), 0.5],
      },
    }).slice(0, 3),
    { from: 'mount', text: 'Rueda hacia atrás detrás de él y termina en la montada.' },
  ],

  'sumi-gaeshi': [
    ...throwSteps({
      entry: {
        text: 'Rodea su espalda con un brazo y mete el empeine por debajo de su muslo.',
        me: {
          move: [30, 0],
          reach: { handL: at('pelvis', 1, 4, -30), footR: at('kneeL', 1, -4, 4) },
          bend: { footR: 1 },
        },
        grips: [[0, 'handL', 'Espalda']],
      },
      throw: {
        text: 'Déjate caer de espaldas en diagonal y levanta su muslo con el gancho.',
        me: {
          base: 'closedGuard:0',
          move: [-20, 0],
          reach: { handL: at('pelvis', 1, 4, -30), footR: at('kneeL', 1, -4, 4) },
        },
        partner: airborne(-140, -40, 0),
        arrow: [at('head', 1), at('head', 1, -60, 70), 0.5],
      },
    }).slice(0, 3),
    { from: 'mount', text: 'Rueda con él hasta quedar encima en la montada.' },
  ],

  'arm-drag-standing': [
    {
      from: 'standing',
      text: 'Agarra su muñeca con una mano y su tríceps con la otra.',
      fighters: [{ move: [16, 0], reach: { handR: at('handL', 1, 0, 2), handL: at('elbowL', 1, 0, -4) } }],
      grips: [
        [0, 'handR', 'Muñeca'],
        [0, 'handL', 'Tríceps'],
      ],
    },
    {
      from: 'standing',
      text: 'Tira de su brazo cruzándolo por delante de su cuerpo y da un paso al lado.',
      fighters: [
        { move: [40, 0], reach: { handR: at('handL', 1, 0, 2), handL: at('elbowL', 1, 0, -4) } },
        { reach: { handL: [150, 100] }, rotate: -10 },
      ],
      grips: [[0, 'handL', 'Tríceps']],
      arrows: [{ from: at('elbowL', 1, 10, 0), to: at('elbowL', 1, -24, 10), fighter: 0, bend: 0.3 }],
    },
    {
      from: 'standing',
      text: 'Rodea por detrás y cierra las manos alrededor de su cintura.',
      fighters: [
        {
          base: 'standing:1',
          mirror: true,
          move: [24, 0],
          reach: { handL: at('pelvis', 1, 4, -14), handR: at('pelvis', 1, 8, -10) },
        },
        {},
      ],
      grips: [[0, 'handL', 'Cintura']],
    },
    { from: 'backControl', text: 'Llévalo al suelo y mete los ganchos.' },
  ],

  'snap-down': [
    {
      from: 'standing',
      text: 'Agarra su nuca y su muñeca.',
      fighters: [{ move: [16, 0], reach: { handL: at('neck', 1, -2, -4), handR: at('handL', 1, 0, 2) } }],
      grips: [
        [0, 'handL', 'Nuca'],
        [0, 'handR', 'Muñeca'],
      ],
    },
    {
      from: 'standing',
      text: 'Tira de su cabeza hacia abajo con un golpe seco, retrocediendo.',
      fighters: [
        { move: [-4, 10], angles: { spine: -110, neck: -120 }, reach: { handL: at('neck', 1, -2, -4) } },
        { base: 'turtle:1', move: [44, 0] },
      ],
      grips: [[0, 'handL', 'Nuca']],
      arrows: [{ from: at('head', 1, 0, -40), to: at('head', 1, -4, 0), fighter: 0, bend: 0.3 }],
    },
    { from: 'turtle', text: 'Rodea hacia su espalda y quédate encima de la tortuga.' },
  ],

  'guard-pull': [
    {
      from: 'standing',
      text: 'Agarra su cuello y su manga.',
      fighters: [{ move: [16, 0], reach: lapelSleeve }],
      grips: lapelSleeveGrips,
    },
    {
      from: 'standing',
      text: 'Pon un pie en su cadera y siéntate cerca de él, sin soltar los agarres.',
      fighters: [
        { base: 'butterflyGuard:0', move: [10, 0], reach: { ...lapelSleeve, footR: at('pelvis', 1, -4, 2) } },
        { angles: { spine: -110, neck: -120 } },
      ],
      grips: lapelSleeveGrips,
    },
    { from: 'closedGuard', text: 'Tira de él hacia ti y cierra la guardia.' },
  ],
};
