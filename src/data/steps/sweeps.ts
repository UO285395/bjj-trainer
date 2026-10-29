import { type StepSpec, at } from '../steps';

// Barridas. Luchador 0 = quien barre (abajo), 1 = compañero.

const supineUnder = 'closedGuard:0' as const;
const standingPartner = 'standing:1' as const;
const seated = 'butterflyGuard:0' as const;

export const SWEEP_STEPS: Record<string, StepSpec[]> = {
  'flower-sweep': [
    {
      from: 'closedGuard',
      text: 'Controla la manga y pasa la otra mano por debajo de su rodilla para agarrar el pantalón.',
      fighters: [
        { move: [14, 0], rotate: 6, reach: { handR: at('handR', 1, 3), handL: at('kneeR', 1, -4, -8) } },
      ],
      grips: [
        [0, 'handR', 'Manga'],
        [0, 'handL', 'Pantalón'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Abre la guardia, gamba hacia fuera y sube alta la pierna libre por encima de su espalda.',
      fighters: [
        {
          move: [14, 0],
          rotate: 6,
          reach: { handR: at('handR', 1, 3), handL: at('kneeR', 1, -4, -8), footL: [236, 92] },
          bend: { footL: 1 },
          layers: { legL: 4 },
        },
      ],
      grips: [
        [0, 'handR', 'Manga'],
        [0, 'handL', 'Pantalón'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Baja esa pierna como un péndulo mientras tiras de manga y pantalón: cae hacia tu lado.',
      fighters: [
        {
          move: [14, 0],
          rotate: 6,
          reach: { handR: at('handR', 1, 3), handL: at('kneeR', 1, -4, -8), footL: [250, 168] },
          layers: { legL: 4 },
        },
        { rotate: -32, move: [-12, 12] },
      ],
      grips: [
        [0, 'handR', 'Manga'],
        [0, 'handL', 'Pantalón'],
      ],
      arrows: [{ from: [246, 96], to: [252, 160], fighter: 0, bend: -0.3 }],
    },
    { from: 'mount', text: 'Sigue la rotación con él y sube directamente a la montada.' },
  ],

  'kimura-sweep': [
    {
      from: 'closedGuard',
      text: 'Tienes la kimura sentado y el rival se levanta para defenderse.',
      fighters: [
        { rotate: 34, move: [6, 0], reach: { handR: at('handR', 1, 3, -3), handL: at('handR', 1, -2, -6) } },
        { angles: { spine: -95, neck: -100 }, reach: { handR: [168, 150] } },
      ],
      grips: [
        [0, 'handR', 'Muñeca'],
        [0, 'handL', 'Tu muñeca'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Rueda hacia el lado del brazo atrapado empujando con la cadera, sin soltar la kimura.',
      fighters: [
        {
          base: seated,
          move: [26, 0],
          rotate: 16,
          reach: { handR: at('handR', 1, 3, -3), handL: at('handR', 1, -2, -6) },
        },
        { rotate: 48, move: [18, 14], reach: { handR: [176, 150] } },
      ],
      grips: [
        [0, 'handR', 'Muñeca'],
        [0, 'handL', 'Tu muñeca'],
      ],
      arrows: [{ from: at('pelvis', 0, 0, 6), to: at('pelvis', 1, 20, -30), fighter: 0, bend: -0.3 }],
    },
    { from: 'mount', text: 'Termina encima, en la montada, y sigue con la kimura si la tienes.' },
  ],

  'balloon-sweep': [
    {
      from: 'closedGuard',
      text: 'Pon los dos pies en su cadera y agarra sus mangas.',
      fighters: [
        {
          reach: {
            footL: at('hipL', 1, -10, -2),
            footR: at('hipR', 1, -6, 6),
            handL: at('handL', 1, 3),
            handR: at('handR', 1, 3),
          },
        },
        { angles: { spine: -112, neck: -120 } },
      ],
      grips: [
        [0, 'handL', 'Manga'],
        [0, 'handR', 'Manga'],
        [0, 'footL', 'Cadera'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Tira de él hacia ti y extiende las piernas: pasa por encima de tu cabeza como un globo.',
      fighters: [
        {
          reach: { footL: [148, 104], footR: [156, 110], handL: [118, 134], handR: [124, 138] },
          bend: { footL: -1, footR: -1 },
        },
        { rotate: -100, move: [-50, -40] },
      ],
      grips: [
        [0, 'handL', 'Manga'],
        [0, 'handR', 'Manga'],
      ],
      arrows: [{ from: [220, 100], to: [70, 150], fighter: 0, bend: -0.4 }],
    },
    { from: 'mount', text: 'Rueda detrás de él y termina en la montada.' },
  ],

  'butterfly-sweep': [
    {
      from: 'butterflyGuard',
      text: 'Underhook con un brazo, controla la manga contraria y mete los ganchos dentro de sus muslos.',
      fighters: [{ reach: { handR: [196, 118], handL: at('handL', 1, 3) } }],
      grips: [
        [0, 'handR', 'Underhook'],
        [0, 'handL', 'Manga'],
        [0, 'footR', 'Gancho'],
      ],
    },
    {
      from: 'butterflyGuard',
      text: 'Déjate caer de lado hacia la manga, llevándolo encima de ti.',
      fighters: [
        {
          rotate: -34,
          move: [-6, 4],
          reach: { handR: at('shoulderL', 1, 14, 6), footR: at('kneeR', 1, -2, -16) },
        },
        { rotate: -22, move: [-18, -6] },
      ],
      grips: [
        [0, 'handR', 'Underhook'],
        [0, 'footR', 'Gancho'],
      ],
    },
    {
      from: 'butterflyGuard',
      text: 'Eleva con el gancho mientras tiras del brazo: cae por encima hacia el otro lado.',
      fighters: [
        {
          rotate: -50,
          move: [-10, 6],
          reach: { handR: at('shoulderL', 1, 14, 6), footR: at('kneeR', 1, -2, -16) },
        },
        { rotate: -60, move: [-44, -14] },
      ],
      grips: [[0, 'footR', 'Gancho']],
      arrows: [{ from: [230, 150], to: [100, 160], fighter: 0, bend: -0.4 }],
    },
    { from: 'mount', text: 'Sigue la rotación y termina en la montada.' },
  ],

  'sickle-sweep': [
    {
      from: 'butterflyGuard',
      text: 'Sentado frente a él de pie, controla su tobillo adelantado con una mano.',
      fighters: [{ reach: { handR: at('footR', 1, 0, -8) } }, { base: standingPartner, move: [20, 0] }],
      grips: [[0, 'handR', 'Tobillo']],
    },
    {
      from: 'butterflyGuard',
      text: 'Empuja su cadera con un pie y siega su talón con la otra pierna.',
      fighters: [
        {
          reach: { handR: at('footR', 1, 0, -8), footL: at('hipR', 1, -2, 8), footR: at('footL', 1, 6, -4) },
        },
        { base: standingPartner, move: [20, 0] },
      ],
      grips: [
        [0, 'handR', 'Tobillo'],
        [0, 'footL', 'Cadera'],
      ],
      arrows: [{ from: at('footL', 1, 20, 0), to: at('footL', 1, -14, -4), fighter: 0, bend: 0.3 }],
    },
    {
      from: 'butterflyGuard',
      text: 'Cae de espaldas: levántate siguiéndolo.',
      fighters: [{ rotate: 20 }, { base: standingPartner, move: [40, 30], rotate: 50 }],
    },
    { from: 'sideControl', text: 'Asienta el control lateral.' },
  ],

  'tripod-sweep': [
    {
      from: 'butterflyGuard',
      text: 'Tumbado frente a él de pie, agarra sus dos tobillos.',
      fighters: [
        {
          base: supineUnder,
          move: [-20, 0],
          reach: { handL: at('footL', 1, -4, -6), handR: at('footR', 1, -4, -6) },
        },
        { base: standingPartner, move: [-6, 0] },
      ],
      grips: [
        [0, 'handL', 'Tobillo'],
        [0, 'handR', 'Tobillo'],
      ],
    },
    {
      from: 'butterflyGuard',
      text: 'Un pie en su cadera y el otro detrás de su tobillo: tira de los talones y empuja la cadera.',
      fighters: [
        {
          base: supineUnder,
          move: [-20, 0],
          reach: {
            handL: at('footL', 1, -4, -6),
            handR: at('footR', 1, -4, -6),
            footL: at('hipL', 1, -2, 6),
            footR: at('footR', 1, 8, -6),
          },
        },
        { base: standingPartner, move: [-6, 0] },
      ],
      grips: [
        [0, 'handR', 'Tobillo'],
        [0, 'footL', 'Cadera'],
        [0, 'footR', 'Detrás del tobillo'],
      ],
      arrows: [{ from: at('neck', 1, 6), to: [262, 150], fighter: 0, bend: 0.3 }],
    },
    {
      from: 'butterflyGuard',
      text: 'Cae de espaldas: levántate y pasa por sus piernas.',
      fighters: [
        { base: supineUnder, move: [-20, 0] },
        { base: standingPartner, move: [30, 34], rotate: 55 },
      ],
    },
    { from: 'sideControl', text: 'Termina en control lateral.' },
  ],

  'technical-standup-sweep': [
    {
      from: 'butterflyGuard',
      text: 'Sentado, atrapa su pierna adelantada con un brazo y apoya la otra mano detrás.',
      fighters: [
        { reach: { handR: at('kneeR', 1, 0, 4), handL: [112, 198] }, bend: { handL: 1 } },
        { base: standingPartner },
      ],
      grips: [
        [0, 'handR', 'Pierna'],
        [0, 'handL', 'Base'],
      ],
    },
    {
      from: 'butterflyGuard',
      text: 'Levanta la cadera y pasa la pierna por detrás sin soltar su pierna.',
      fighters: [
        {
          move: [10, -14],
          rotate: 10,
          reach: { handR: at('kneeR', 1, 0, 4), handL: [112, 198], footL: [96, 198] },
          bend: { footL: -1 },
        },
        { base: standingPartner },
      ],
      grips: [[0, 'handR', 'Pierna']],
    },
    {
      from: 'standing',
      text: 'Ya de pie, empuja con el hombro hacia la pierna atrapada para derribarlo.',
      fighters: [
        { angles: { spine: -50 }, reach: { handR: at('kneeR', 1, -2, 0) } },
        { rotate: 30, move: [10, 10] },
      ],
      grips: [[0, 'handR', 'Pierna']],
      arrows: [{ from: at('head', 1, 4), to: [272, 160], fighter: 0, bend: 0.3 }],
    },
    { from: 'sideControl', text: 'Acompáñalo y asienta el control lateral.' },
  ],

  'x-guard-sweep': [
    {
      from: 'butterflyGuard',
      text: 'Métete debajo de él y cruza las piernas en X sobre su pierna adelantada.',
      fighters: [
        {
          base: supineUnder,
          move: [12, 0],
          reach: { footL: at('hipR', 1, 4, 6), footR: at('kneeR', 1, 6, -4), handR: at('footL', 1, -4, -10) },
        },
        { base: standingPartner, move: [10, 0] },
      ],
      grips: [
        [0, 'footL', 'Cadera'],
        [0, 'footR', 'Detrás de la rodilla'],
        [0, 'handR', 'Tobillo'],
      ],
    },
    {
      from: 'butterflyGuard',
      text: 'Extiende las piernas para abrirle la base mientras sujetas la otra pierna.',
      fighters: [
        {
          base: supineUnder,
          move: [12, 0],
          reach: { footL: at('hipR', 1, 4, 6), footR: at('kneeR', 1, 6, -4), handR: at('footL', 1, -4, -10) },
        },
        { base: standingPartner, move: [30, 20], rotate: 32 },
      ],
      grips: [[0, 'handR', 'Tobillo']],
      arrows: [{ from: at('neck', 1), to: [280, 150], fighter: 0, bend: 0.3 }],
    },
    { from: 'sideControl', text: 'Levántate en técnica y pasa al control lateral.' },
  ],

  'de-la-riva-sweep': [
    {
      from: 'butterflyGuard',
      text: 'Gancho De la Riva por fuera de su pierna adelantada; controla el talón y la manga.',
      fighters: [
        {
          base: supineUnder,
          move: [-4, 0],
          reach: { footL: at('kneeR', 1, -8, -2), handL: at('footR', 1, -2, -6), handR: at('handR', 1, 2) },
        },
        { base: standingPartner, move: [-4, 0], reach: { handR: [150, 150] } },
      ],
      grips: [
        [0, 'footL', 'Gancho DLR'],
        [0, 'handL', 'Talón'],
        [0, 'handR', 'Manga'],
      ],
    },
    {
      from: 'butterflyGuard',
      text: 'Pon el otro pie en su cadera y empuja mientras tiras de la manga: pierde el equilibrio hacia atrás.',
      fighters: [
        {
          base: supineUnder,
          move: [-4, 0],
          reach: {
            footL: at('kneeR', 1, -8, -2),
            footR: at('hipL', 1, -4, 4),
            handL: at('footR', 1, -2, -6),
            handR: at('handR', 1, 2),
          },
        },
        { base: standingPartner, move: [14, 12], rotate: 26, reach: { handR: [150, 150] } },
      ],
      grips: [
        [0, 'handL', 'Talón'],
        [0, 'footR', 'Cadera'],
      ],
      arrows: [{ from: at('neck', 1), to: [270, 140], fighter: 0, bend: 0.3 }],
    },
    { from: 'sideControl', text: 'Sube y asienta el control lateral.' },
  ],

  'spider-sweep': [
    {
      from: 'closedGuard',
      text: 'Controla las dos mangas y pon los pies en sus bíceps.',
      fighters: [
        {
          reach: {
            handL: at('handL', 1, 3),
            handR: at('handR', 1, 3),
            footL: at('elbowL', 1, -2, -6),
            footR: at('elbowR', 1, 2, -2),
          },
          bend: { footL: -1, footR: -1 },
        },
      ],
      grips: [
        [0, 'handL', 'Manga'],
        [0, 'handR', 'Manga'],
        [0, 'footL', 'Bíceps'],
      ],
    },
    {
      from: 'closedGuard',
      text: 'Empuja con un pie, siega su rodilla con la otra pierna y tira de la manga hacia ti.',
      fighters: [
        {
          reach: {
            handL: at('handL', 1, 3),
            handR: at('handR', 1, 3),
            footL: at('elbowL', 1, -2, -6),
            footR: at('kneeR', 1, 8, -6),
          },
        },
        { rotate: -26, move: [-8, 10] },
      ],
      grips: [
        [0, 'handL', 'Manga'],
        [0, 'footL', 'Bíceps'],
      ],
      arrows: [{ from: at('kneeR', 1, 12), to: at('kneeR', 1, 30, -10), fighter: 0, bend: 0.3 }],
    },
    { from: 'mount', text: 'Sigue la rotación hasta la montada.' },
  ],

  'old-school-sweep': [
    {
      from: 'halfGuard',
      text: 'De lado en media guardia: underhook a su pierna de fuera y atrapa su tobillo.',
      fighters: [{ reach: { handR: at('footR', 1, -4, -2), handL: at('kneeR', 1, 0, -6) } }],
      grips: [
        [0, 'handR', 'Tobillo'],
        [0, 'handL', 'Underhook'],
      ],
    },
    {
      from: 'halfGuard',
      text: 'Sube a la rodilla y empuja con la cabeza hacia el lado contrario.',
      fighters: [
        { base: seated, move: [14, 0], reach: { handR: at('footR', 1, -4, -2) } },
        { rotate: 28, move: [10, 8] },
      ],
      grips: [[0, 'handR', 'Tobillo']],
      arrows: [{ from: at('head', 1), to: [262, 150], fighter: 0, bend: 0.3 }],
    },
    { from: 'sideControl', text: 'Cae encima y asienta el control lateral.' },
  ],

  'dogfight-sweep': [
    {
      from: 'halfGuard',
      text: 'Con el underhook, sube a tu rodilla con la cabeza pegada a su pecho (dogfight).',
      fighters: [
        {
          base: 'closedGuard:1',
          mirror: true,
          move: [-48, 4],
          angles: { spine: -50, neck: -40 },
          reach: { handR: [214, 130] },
        },
      ],
      grips: [[0, 'handR', 'Underhook']],
    },
    {
      from: 'halfGuard',
      text: 'Empuja de lado con el hombro y la cabeza hasta tumbarlo.',
      fighters: [
        {
          base: 'closedGuard:1',
          mirror: true,
          move: [-38, 4],
          angles: { spine: -35, neck: -30 },
          reach: { handR: [220, 132] },
        },
        { rotate: 40, move: [18, 6] },
      ],
      grips: [[0, 'handR', 'Underhook']],
      arrows: [{ from: at('head', 1), to: [282, 160], fighter: 0, bend: 0.3 }],
    },
    { from: 'sideControl', text: 'Asienta el control lateral.' },
  ],

  'waiter-sweep': [
    {
      from: 'halfGuard',
      text: 'Media guardia profunda: métete debajo y abraza su pierna.',
      fighters: [{ move: [30, 6], reach: { handL: at('kneeR', 1, 2, -2), handR: at('hipR', 1, -2, 10) } }],
      grips: [[0, 'handL', 'Pierna']],
    },
    {
      from: 'halfGuard',
      text: 'Levanta su pierna libre con el pie, como un camarero con una bandeja, y vuelca hacia atrás.',
      fighters: [
        { move: [30, 6], reach: { handL: at('kneeR', 1, 2, -2), footL: at('kneeL', 1, 6, 4) } },
        { rotate: 36, move: [18, 0] },
      ],
      grips: [
        [0, 'handL', 'Pierna'],
        [0, 'footL', 'Bajo la rodilla'],
      ],
      arrows: [{ from: at('neck', 1), to: [262, 120], fighter: 0, bend: 0.3 }],
    },
    { from: 'sideControl', text: 'Sube encima y asienta el control lateral.' },
  ],

  berimbolo: [
    {
      from: 'butterflyGuard',
      text: 'Desde De la Riva, agarra su pantalón y desequilíbralo para que se siente.',
      fighters: [
        {
          base: supineUnder,
          move: [-4, 0],
          reach: { footL: at('kneeR', 1, -8, -2), handL: at('hipR', 1, 0, 10) },
        },
        { base: standingPartner, move: [-4, 0] },
      ],
      grips: [
        [0, 'footL', 'Gancho DLR'],
        [0, 'handL', 'Pantalón'],
      ],
    },
    {
      from: 'butterflyGuard',
      text: 'Invierte: rueda sobre los hombros llevando la cadera por debajo de él sin soltar el pantalón.',
      fighters: [
        {
          base: supineUnder,
          move: [34, -48],
          rotate: -66,
          reach: {
            handL: at('hipR', 1, 0, 10),
            footL: at('pelvis', 1, 16, -30),
            footR: at('kneeL', 1, 0, -8),
          },
          layers: { legL: 4 },
        },
        { base: 'backControl:1', move: [50, 6] },
      ],
      grips: [[0, 'handL', 'Pantalón']],
      arrows: [{ from: [140, 180], to: [200, 120], fighter: 0, bend: 0.4 }],
    },
    { from: 'backControl', text: 'Sal por detrás de él y mete los ganchos: tienes la espalda.' },
  ],
};
