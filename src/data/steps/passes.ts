import { type StepSpec, at } from '../steps';

// Pases de guardia. Luchador 0 = quien pasa (arriba), 1 = quien guarda.

export const PASS_STEPS: Record<string, StepSpec[]> = {
  toreando: [
    {
      from: 'butterflyGuard*',
      text: 'Levántate y agarra el pantalón por encima de sus dos rodillas, con los codos hacia dentro.',
      fighters: [
        {
          base: 'standing:1',
          move: [40, 8],
          angles: { spine: -112, neck: -118 },
          reach: { handL: at('kneeL', 1, 2, -4), handR: at('kneeR', 1, 4, -2) },
        },
        { base: 'closedGuard:0', move: [-20, 0] },
      ],
      grips: [
        [0, 'handL', 'Pantalón (rodilla)'],
        [0, 'handR', 'Pantalón (rodilla)'],
      ],
    },
    {
      from: 'butterflyGuard*',
      text: 'Empuja sus rodillas hacia el suelo, a un lado, y pega tus codos para que no pueda recuperarlas.',
      fighters: [
        {
          base: 'standing:1',
          move: [34, 10],
          angles: { spine: -115, neck: -120 },
          reach: { handL: at('kneeL', 1, 2, -4), handR: at('kneeR', 1, 4, -2) },
        },
        { base: 'closedGuard:0', move: [-20, 0], angles: { thighL: -15, shinL: 40, thighR: -8, shinR: 45 } },
      ],
      grips: [
        [0, 'handL', 'Pantalón (rodilla)'],
        [0, 'handR', 'Pantalón (rodilla)'],
      ],
      arrows: [{ from: at('kneeL', 1, 0, -14), to: at('kneeL', 1, 18, 8), fighter: 0, bend: 0.3 }],
    },
    {
      from: 'butterflyGuard*',
      text: 'Corre alrededor de sus piernas hacia su costado sin soltar el control.',
      fighters: [
        {
          base: 'standing:1',
          move: [-6, 10],
          angles: { spine: -125, neck: -130 },
          reach: { handL: at('kneeL', 1, 0, -2), handR: at('pelvis', 1, 0, -6) },
        },
        { base: 'closedGuard:0', move: [-20, 0], angles: { thighL: -15, shinL: 40, thighR: -8, shinR: 45 } },
      ],
      grips: [
        [0, 'handL', 'Pantalón'],
        [0, 'handR', 'Cadera'],
      ],
      arrows: [{ from: [230, 120], to: [168, 120], fighter: 0, bend: -0.3 }],
    },
    { from: 'kneeOnBelly', text: 'Clava la rodilla en su vientre: pase completado.' },
  ],

  'double-under': [
    {
      from: 'closedGuard*',
      text: 'Abre la guardia y pasa los dos brazos por debajo de sus muslos.',
      fighters: [
        { reach: { handL: at('kneeL', 1, -4, 10), handR: at('kneeR', 1, -2, 12) } },
        { angles: { thighL: -60, shinL: 20, thighR: -55, shinR: 25 } },
      ],
      grips: [
        [0, 'handL', 'Debajo del muslo'],
        [0, 'handR', 'Debajo del muslo'],
      ],
    },
    {
      from: 'closedGuard*',
      text: 'Junta las manos en su pantalón o cinturón y levántate hacia delante para apilarlo.',
      fighters: [
        {
          move: [-14, -6],
          angles: { spine: -125, neck: -135 },
          reach: { handL: at('pelvis', 1, 4), handR: at('pelvis', 1, 6, 2) },
        },
        { rotate: -28, move: [-10, -10], angles: { thighL: -85, shinL: -40, thighR: -80, shinR: -35 } },
      ],
      grips: [[0, 'handL', 'Cinturón']],
      arrows: [{ from: at('pelvis', 1, 10), to: at('pelvis', 1, -10, -30), fighter: 0, bend: 0.3 }],
    },
    {
      from: 'closedGuard*',
      text: 'Con sus piernas sobre un hombro, camina hacia un lado y bájalas.',
      fighters: [
        {
          move: [-28, -4],
          angles: { spine: -140, neck: -150 },
          reach: { handL: at('pelvis', 1, 4), handR: at('neck', 1, 4, 6) },
        },
        { rotate: -18, move: [-10, -6], angles: { thighL: -80, shinL: -50, thighR: -75, shinR: -45 } },
      ],
      grips: [
        [0, 'handL', 'Cadera'],
        [0, 'handR', 'Cuello'],
      ],
    },
    { from: 'sideControl', text: 'Pega el pecho al suyo: control lateral.' },
  ],

  'stack-pass': [
    {
      from: 'closedGuard*',
      text: 'Un brazo por debajo de una pierna y la otra mano en su cuello o solapa.',
      fighters: [
        { reach: { handL: at('kneeL', 1, -4, 10), handR: at('neck', 1, 6, 4) } },
        { angles: { thighL: -65, shinL: 15 } },
      ],
      grips: [
        [0, 'handL', 'Debajo del muslo'],
        [0, 'handR', 'Solapa'],
      ],
    },
    {
      from: 'closedGuard*',
      text: 'Ponte de puntillas y carga tu peso hacia su cabeza: sus rodillas van hacia su cara.',
      fighters: [
        {
          move: [-22, -12],
          angles: { spine: -150, neck: -160 },
          reach: { handL: at('pelvis', 1, 4, -6), handR: at('neck', 1, 6, 4) },
        },
        { rotate: -32, move: [-12, -10], angles: { thighL: -100, shinL: -50, thighR: -90, shinR: -40 } },
      ],
      grips: [
        [0, 'handL', 'Cadera'],
        [0, 'handR', 'Solapa'],
      ],
      arrows: [{ from: [200, 120], to: [150, 140], fighter: 0, bend: -0.3 }],
    },
    {
      from: 'closedGuard*',
      text: 'Cuando ya no pueda empujar, rodea sus piernas hacia el lado contrario.',
      fighters: [
        {
          move: [-34, -8],
          angles: { spine: -160, neck: -170 },
          reach: { handL: at('pelvis', 1, 0, -4), handR: at('neck', 1, 6, 4) },
        },
        { rotate: -20, move: [-10, -6], angles: { thighL: -60, shinL: 0, thighR: -50, shinR: 10 } },
      ],
      grips: [[0, 'handR', 'Solapa']],
    },
    { from: 'sideControl', text: 'Asienta el control lateral.' },
  ],

  'over-under': [
    {
      from: 'butterflyGuard*',
      text: 'Un brazo por encima de su muslo y el otro por debajo del contrario.',
      fighters: [{ reach: { handL: at('kneeL', 1, -6, 8), handR: at('hipR', 1, -4, 6) } }],
      grips: [
        [0, 'handL', 'Por encima del muslo'],
        [0, 'handR', 'Por debajo del muslo'],
      ],
    },
    {
      from: 'butterflyGuard*',
      text: 'Junta las manos y aplasta su cadera con el hombro sobre su muslo.',
      fighters: [
        {
          move: [-8, 10],
          angles: { spine: -150, neck: -160 },
          reach: { handL: at('pelvis', 1, 0, -6), handR: at('pelvis', 1, 4) },
        },
        { rotate: 10, move: [0, 6] },
      ],
      grips: [[0, 'handL', 'Manos juntas']],
      arrows: [{ from: at('shoulderL', 0, 0, -10), to: at('pelvis', 1, 0, -10), fighter: 0, bend: 0.2 }],
    },
    {
      from: 'butterflyGuard*',
      text: 'Camina hacia el lado del brazo de abajo hasta salir al costado.',
      fighters: [
        {
          move: [-20, 10],
          angles: { spine: -165, neck: -175 },
          reach: { handL: at('pelvis', 1, 0, -6), handR: at('pelvis', 1, 4) },
        },
        { base: 'closedGuard:0', move: [-20, 0], angles: { thighL: -20, shinL: 50, thighR: -15, shinR: 55 } },
      ],
      grips: [[0, 'handL', 'Manos juntas']],
    },
    { from: 'sideControl', text: 'Control lateral.' },
  ],

  'leg-drag': [
    {
      from: 'butterflyGuard*',
      text: 'De pie, agarra su tobillo y el pantalón por la rodilla.',
      fighters: [
        {
          base: 'standing:1',
          move: [40, 8],
          angles: { spine: -112, neck: -118 },
          reach: { handL: at('footL', 1, 4, -6), handR: at('kneeL', 1, 4, -2) },
        },
        { base: 'closedGuard:0', move: [-20, 0] },
      ],
      grips: [
        [0, 'handL', 'Tobillo'],
        [0, 'handR', 'Rodilla'],
      ],
    },
    {
      from: 'butterflyGuard*',
      text: 'Arrastra su pierna cruzándola delante de tu cadera, hacia el lado contrario.',
      fighters: [
        {
          base: 'standing:1',
          move: [36, 8],
          angles: { spine: -105, neck: -110 },
          reach: { handL: at('footL', 1, 4, -6), handR: at('kneeL', 1, 4, -2) },
        },
        {
          base: 'closedGuard:0',
          move: [-20, 0],
          rotate: -10,
          angles: { thighL: 0, shinL: 10, thighR: -10, shinR: 30 },
        },
      ],
      grips: [
        [0, 'handL', 'Tobillo'],
        [0, 'handR', 'Rodilla'],
      ],
      arrows: [{ from: at('kneeL', 1, 0, -12), to: at('kneeL', 1, 24, 6), fighter: 0, bend: 0.3 }],
    },
    {
      from: 'butterflyGuard*',
      text: 'Clava la cadera contra la suya, agarra cuello o espalda y baja la rodilla.',
      fighters: [
        { base: 'sideControl:0', move: [-8, 0], reach: { handR: at('hipR', 1, -2, -6) } },
        { base: 'closedGuard:0', move: [-24, 0], angles: { thighL: 0, shinL: 10, thighR: -10, shinR: 30 } },
      ],
      grips: [[0, 'handR', 'Cadera']],
    },
    { from: 'sideControl', text: 'Saca las piernas y asienta el control lateral.' },
  ],

  'x-pass': [
    {
      from: 'butterflyGuard*',
      text: 'De pie, agarra el pantalón por las rodillas con las manos cruzadas en X.',
      fighters: [
        {
          base: 'standing:1',
          move: [40, 8],
          angles: { spine: -112, neck: -118 },
          reach: { handL: at('kneeR', 1, 2, -2), handR: at('kneeL', 1, 4, -4) },
        },
        { base: 'closedGuard:0', move: [-20, 0] },
      ],
      grips: [
        [0, 'handL', 'Rodilla'],
        [0, 'handR', 'Rodilla'],
      ],
    },
    {
      from: 'butterflyGuard*',
      text: 'Empuja sus rodillas hacia un lado mientras das un paso largo en diagonal hacia el otro.',
      fighters: [
        {
          base: 'standing:1',
          move: [18, 8],
          angles: { spine: -115, neck: -120, thighR: 150, shinR: 100 },
          reach: { handL: at('kneeR', 1, 2, -2), handR: at('kneeL', 1, 4, -4) },
        },
        { base: 'closedGuard:0', move: [-20, 0], angles: { thighL: -15, shinL: 40, thighR: -8, shinR: 45 } },
      ],
      grips: [
        [0, 'handL', 'Rodilla'],
        [0, 'handR', 'Rodilla'],
      ],
      arrows: [{ from: at('footR', 0, 0, -6), to: at('footR', 0, -40, -6), fighter: 0, bend: -0.3 }],
    },
    { from: 'sideControl', text: 'Baja el pecho al costado: control lateral.' },
  ],

  'long-step': [
    {
      from: 'halfGuard*',
      text: 'Con crossface y presión de cabeza, apoya la mano en el suelo junto a su cabeza.',
      fighters: [{ reach: { handL: at('head', 1, -14, 12), handR: at('shoulderR', 1, -4, 14) } }],
      grips: [[0, 'handR', 'Underhook']],
    },
    {
      from: 'halfGuard*',
      text: 'Gira la cadera hacia el techo y da un paso largo hacia atrás con la pierna libre.',
      fighters: [
        {
          rotate: 8,
          angles: { thighL: 30, shinL: 90 },
          reach: { handL: at('head', 1, -14, 12), handR: at('shoulderR', 1, -4, 14), footL: [250, 196] },
        },
      ],
      grips: [[0, 'handR', 'Underhook']],
      arrows: [{ from: at('kneeL', 0, 0, -8), to: [252, 180], fighter: 0, bend: -0.3 }],
    },
    {
      from: 'halfGuard*',
      text: 'La pierna atrapada sale con el giro: baja la cadera junto a la suya.',
      fighters: [{ base: 'sideControl:0', move: [-14, 0], reach: { handL: at('head', 1, -14, 12) } }],
      grips: [[0, 'handL', 'Crossface']],
    },
    { from: 'sideControl', text: 'Control lateral.' },
  ],

  'smash-pass': [
    {
      from: 'butterflyGuard*',
      text: 'Empuja sus dos rodillas juntas hacia un lado y apóyate encima.',
      fighters: [
        {
          base: 'standing:1',
          move: [30, 16],
          angles: { spine: -125, neck: -130 },
          reach: { handL: at('kneeL', 1), handR: at('kneeR', 1, 4) },
        },
        {
          base: 'closedGuard:0',
          move: [-20, 0],
          rotate: -8,
          angles: { thighL: 0, shinL: 30, thighR: 5, shinR: 35 },
        },
      ],
      grips: [
        [0, 'handL', 'Rodillas'],
        [0, 'handR', 'Rodillas'],
      ],
      arrows: [{ from: at('kneeL', 1, 0, -12), to: at('kneeL', 1, 16, 10), fighter: 0, bend: 0.3 }],
    },
    {
      from: 'halfGuard*',
      text: 'Baja la cadera sobre sus piernas con el pecho pesado, aunque te atrape una pierna.',
      fighters: [{ reach: { handL: at('head', 1, -14, 12), handR: at('hipR', 1, -4, -6) } }],
      grips: [[0, 'handR', 'Cadera']],
    },
    {
      from: 'halfGuard*',
      text: 'Con la otra rodilla empuja sus rodillas y saca la pierna atrapada.',
      fighters: [
        {
          move: [-6, 0],
          angles: { thighR: 170, shinR: 30 },
          reach: { handL: at('head', 1, -14, 12), handR: at('hipR', 1, -4, -6) },
        },
      ],
      grips: [[0, 'handR', 'Cadera']],
      arrows: [{ from: at('footR', 0), to: at('footR', 0, 30, 6), fighter: 0, bend: 0.3 }],
    },
    { from: 'sideControl', text: 'Control lateral.' },
  ],

  'half-guard-crossface': [
    {
      from: 'halfGuard*',
      text: 'Crossface: tu hombro bajo su barbilla girándole la cara al lado contrario.',
      fighters: [{ reach: { handL: at('head', 1, -12, 8) } }],
      grips: [[0, 'handL', 'Crossface']],
    },
    {
      from: 'halfGuard*',
      text: 'Gana el underhook del lado contrario y aplánalo de espaldas.',
      fighters: [{ reach: { handL: at('head', 1, -12, 8), handR: at('shoulderR', 1, -4, 14) } }],
      grips: [
        [0, 'handL', 'Crossface'],
        [0, 'handR', 'Underhook'],
      ],
    },
    {
      from: 'halfGuard*',
      text: 'Abre la rodilla libre hacia su cabeza y desliza la atrapada hacia fuera con el pie.',
      fighters: [
        {
          angles: { thighL: 130, shinL: 20 },
          reach: { handL: at('head', 1, -12, 8), handR: at('shoulderR', 1, -4, 14) },
          layers: { legL: 4 },
        },
      ],
      grips: [
        [0, 'handL', 'Crossface'],
        [0, 'handR', 'Underhook'],
      ],
      arrows: [{ from: at('kneeR', 0), to: at('kneeR', 0, -26, 4), fighter: 0, bend: 0.2 }],
    },
    { from: 'mount', text: 'Libera el pie y asienta la montada.' },
  ],

  'body-lock-pass': [
    {
      from: 'butterflyGuard*',
      text: 'Cierra las manos alrededor de su cintura con la cabeza pegada a su pecho.',
      fighters: [
        {
          move: [-8, 6],
          angles: { spine: -140, neck: -150 },
          reach: { handL: at('pelvis', 1, -4, -14), handR: at('pelvis', 1, 0, -12) },
        },
      ],
      grips: [[0, 'handL', 'Cierre de cuerpo']],
    },
    {
      from: 'butterflyGuard*',
      text: 'Empújalo de espaldas y aprieta una de sus piernas entre tus rodillas.',
      fighters: [
        {
          move: [-12, 14],
          angles: { spine: -160, neck: -170 },
          reach: { handL: at('pelvis', 1, -4, -10), handR: at('pelvis', 1, 0, -8) },
        },
        { base: 'closedGuard:0', move: [-24, 0], angles: { thighL: -30, shinL: 40, thighR: 0, shinR: 10 } },
      ],
      grips: [[0, 'handL', 'Cierre de cuerpo']],
    },
    {
      from: 'butterflyGuard*',
      text: 'Camina hacia el lado de la pierna atrapada y libera tus piernas.',
      fighters: [
        {
          base: 'sideControl:0',
          move: [-6, 0],
          reach: { handL: at('pelvis', 1, -12, -6), handR: at('pelvis', 1, -6, -4) },
        },
        { base: 'closedGuard:0', move: [-24, 0], angles: { thighL: -30, shinL: 40, thighR: 0, shinR: 10 } },
      ],
      grips: [[0, 'handL', 'Cierre de cuerpo']],
    },
    { from: 'sideControl', text: 'Control lateral.' },
  ],

  'leg-weave': [
    {
      from: 'butterflyGuard*',
      text: 'Pasa un brazo por debajo de su pierna de arriba y entrelázala, con su pie sobre tu hombro.',
      fighters: [
        {
          move: [-6, 8],
          angles: { spine: -125, neck: -135 },
          reach: { handL: at('kneeL', 1, 0, 8), handR: at('kneeR', 1, 4) },
        },
        {
          base: 'closedGuard:0',
          move: [-20, 0],
          angles: { thighL: -60, shinL: -20, thighR: -10, shinR: 30 },
        },
      ],
      grips: [
        [0, 'handL', 'Pierna entrelazada'],
        [0, 'handR', 'Rodilla'],
      ],
    },
    {
      from: 'butterflyGuard*',
      text: 'Aplasta la otra rodilla con tu peso y bloquea su cadera.',
      fighters: [
        {
          move: [-12, 14],
          angles: { spine: -145, neck: -155 },
          reach: { handL: at('kneeL', 1, 0, 8), handR: at('kneeR', 1, 4) },
        },
        {
          base: 'closedGuard:0',
          move: [-20, 0],
          rotate: -8,
          angles: { thighL: -60, shinL: -20, thighR: 10, shinR: 30 },
        },
      ],
      grips: [
        [0, 'handL', 'Pierna entrelazada'],
        [0, 'handR', 'Rodilla'],
      ],
      arrows: [{ from: at('kneeR', 1, 0, -12), to: at('kneeR', 1, 10, 8), fighter: 0, bend: 0.3 }],
    },
    { from: 'sideControl', text: 'Salta al lado contrario y asienta el control lateral.' },
  ],

  'backstep-pass': [
    {
      from: 'halfGuard*',
      text: 'Controla su cadera y mira hacia sus pies, girando el pecho.',
      fighters: [
        { rotate: 30, move: [10, 0], reach: { handL: at('hipR', 1, 0, -6), handR: at('kneeL', 1, 0, -4) } },
      ],
      grips: [
        [0, 'handL', 'Cadera'],
        [0, 'handR', 'Rodilla'],
      ],
    },
    {
      from: 'halfGuard*',
      text: 'Paso atrás: pasa la pierna libre por detrás, dándole la espalda, para soltar la atrapada.',
      fighters: [
        {
          mirror: true,
          move: [10, 0],
          rotate: -10,
          reach: { handL: at('hipR', 1, 0, -6), handR: at('kneeL', 1, 0, -4) },
        },
      ],
      grips: [[0, 'handL', 'Cadera']],
      arrows: [{ from: [200, 150], to: [150, 150], fighter: 0, bend: 0.4 }],
    },
    { from: 'sideControl', text: 'Cae al lado contrario con el pecho sobre él: control lateral.' },
  ],

  'hip-switch-pass': [
    {
      from: 'halfGuard*',
      text: 'Underhook y crossface, con el pecho pesado sobre el suyo.',
      fighters: [{ reach: { handL: at('head', 1, -12, 8), handR: at('shoulderR', 1, -4, 14) } }],
      grips: [
        [0, 'handL', 'Crossface'],
        [0, 'handR', 'Underhook'],
      ],
    },
    {
      from: 'halfGuard*',
      text: 'Cambia la cadera hacia sus pies, con la pierna libre estirada hacia su cabeza.',
      fighters: [
        {
          rotate: -10,
          angles: { thighL: 190, shinL: 185, thighR: 120, shinR: 20 },
          reach: { handL: at('head', 1, -12, 8), handR: at('shoulderR', 1, -4, 14) },
        },
      ],
      grips: [
        [0, 'handL', 'Crossface'],
        [0, 'handR', 'Underhook'],
      ],
      arrows: [{ from: at('pelvis', 0, 0, -10), to: at('pelvis', 0, -10, -26), fighter: 0, bend: 0.4 }],
    },
    {
      from: 'halfGuard*',
      text: 'Saca la rodilla atrapada y vuelve a cambiar la cadera.',
      fighters: [{ base: 'sideControl:0', move: [-10, 0], reach: { handL: at('head', 1, -12, 8) } }],
      grips: [[0, 'handL', 'Crossface']],
    },
    { from: 'sideControl', text: 'Control lateral.' },
  ],
};
