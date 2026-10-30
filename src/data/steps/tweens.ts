import { type StepSpec, type Tweens, at } from '../steps';

// Pasos intermedios entre dos pasos escritos, para que cada cambio de posición
// tenga su dibujo. La clave es el paso tras el que se intercala (desde 1).
// Un texto solo mezcla los dos pasos vecinos; un paso completo se dibuja tal cual.

const sleeve = at('elbowL', 1, 0, 2);

/** Tras una proyección: el compañero ya en el suelo y tú de pie, aún con la manga. */
const landed = (text: string): StepSpec => ({
  from: 'sideControl',
  text,
  fighters: [
    { base: 'standing:0', move: [-20, 6], angles: { spine: -130, neck: -140 }, reach: { handR: sleeve } },
    { angles: { thighL: -60, shinL: 20, thighR: -50, shinR: 30 } },
  ],
  grips: [[0, 'handR', 'Manga']],
});

/** Cayendo hacia atrás entre tus piernas: lo acompañas al suelo sin soltar solapa y manga. */
const fallingBack = (text: string): StepSpec => ({
  from: 'standing',
  text,
  fighters: [
    {
      move: [40, 26],
      angles: { spine: -125, neck: -135, thighL: 120, shinL: 100 },
      reach: { handL: at('neck', 1, 4, 14), handR: sleeve },
    },
    { rotate: 62, move: [26, 52] },
  ],
  grips: [
    [0, 'handL', 'Solapa'],
    [0, 'handR', 'Manga'],
  ],
});

/** Bajando al control lateral: de rodillas a su lado, el pecho aún sin apoyar. */
const toSide = (text: string, grips: StepSpec['grips'] = [[0, 'handR', 'Cadera']]): StepSpec => ({
  from: 'sideControl',
  text,
  fighters: [
    {
      move: [6, -14],
      angles: { spine: -128, neck: -138 },
      reach: { handL: at('neck', 1, 6, -2), handR: at('hipR', 1, -2, -8) },
    },
    { angles: { thighL: -40, shinL: 50, thighR: -30, shinR: 55 } },
  ],
  grips,
});

/** Subiendo a la montada: la rodilla ya pasa por encima y el cuerpo aún va inclinado. */
const toMount = (text: string): StepSpec => ({
  from: 'mount',
  text,
  fighters: [
    {
      move: [10, 6],
      angles: { spine: -140, neck: -150, thighR: 100, shinR: 20 },
      reach: { handL: [110, 198], handR: at('shoulderL', 1, 4, -4) },
    },
    {},
  ],
  grips: [[0, 'handR', 'Hombro']],
});

/** Cerrando la guardia: las piernas rodean su cintura, aún sin cruzar los pies. */
const toGuard = (text: string): StepSpec => ({
  from: 'closedGuard',
  text,
  fighters: [
    {
      angles: { thighL: -60, shinL: 20, thighR: -50, shinR: 30 },
      reach: { footL: at('pelvis', 1, 14, -10), footR: at('pelvis', 1, 18, -4) },
    },
  ],
  grips: [
    [0, 'footL', 'Cadera'],
    [0, 'footR', 'Cadera'],
  ],
});

/** Tomando la espalda: detrás de él con el primer gancho y el cinturón de seguridad. */
const toBack = (text: string): StepSpec => ({
  from: 'backControl',
  text,
  fighters: [
    {
      angles: { thighL: 90, shinL: 90 },
      reach: { handL: at('neck', 1, 18, 4), handR: at('shoulderR', 1, 14, 14), footR: at('kneeR', 1, 4, 16) },
      layers: { legR: 3 },
    },
    { rotate: -8 },
  ],
  grips: [
    [0, 'handL', 'Cinturón de seguridad'],
    [0, 'footR', 'Gancho'],
  ],
});

export const TECHNIQUE_TWEENS: Record<string, Tweens> = {
  // Barridas
  'scissor-sweep': {
    3: toMount('Cae de espaldas: sube con la rodilla por encima de su cadera sin soltar la manga.'),
  },
  'hip-bump': { 2: toMount('Cae de espaldas: lleva la rodilla por encima de él mientras se gira.') },
  'flower-sweep': { 3: toMount('Cae de lado: aprovecha el giro para subir la rodilla por encima.') },
  'kimura-sweep': {
    1: 'Siéntate más alto mientras él se levanta, apretando la figura de cuatro.',
    2: toMount('Cae de espaldas con el brazo aún atrapado: pasa la rodilla por encima.'),
  },
  'balloon-sweep': {
    1: 'Tira de las mangas y empieza a elevarlo con los pies en su cadera.',
    2: 'Cae al otro lado de tu cabeza: rueda hacia atrás para seguirlo.',
  },
  'butterfly-sweep': { 3: toMount('Cae de espaldas: sigue el giro y apoya la rodilla por encima.') },
  'sickle-sweep': {
    2: 'Pierde el equilibrio hacia atrás: sigue empujando hasta que caiga.',
    3: toSide('Ya en el suelo: ponte de rodillas a su lado antes de que se levante.'),
  },
  'tripod-sweep': {
    2: 'Pierde el equilibrio hacia atrás: sigue tirando de los talones.',
    3: toSide('Ya en el suelo: levántate y pasa al lado de sus piernas.'),
  },
  'technical-standup-sweep': { 3: landed('Cae de espaldas: quédate de pie controlando su pierna.') },
  'x-guard-sweep': { 2: toSide('Cae de espaldas: levántate en técnica y baja a su lado.') },
  'de-la-riva-sweep': { 2: toSide('Cae de espaldas: sube a su lado antes de que se recupere.') },
  'spider-sweep': { 2: toMount('Cae de lado: sigue el giro y sube la rodilla por encima.') },
  'old-school-sweep': {
    1: 'Ponte de rodillas con su tobillo bien atrapado.',
    2: toSide('Cae de lado: pasa por encima de su pierna sin soltar el tobillo.'),
  },
  'dogfight-sweep': { 2: toSide('Cae de lado: sube el pecho encima antes de que gire.') },
  'waiter-sweep': { 2: toSide('Cae hacia atrás: ve detrás de él y sube encima.') },
  berimbolo: {
    1: 'Sigue tirando del pantalón: se sienta y empiezas a invertirte por debajo.',
    2: 'Saca la cadera por detrás de él y engancha la primera pierna.',
  },

  // Pases
  toreando: { 3: toSide('Llega a su costado con el pecho bajo y controla la cadera.') },
  'double-under': { 3: toSide('Baja sus piernas a un lado y apoya el pecho.') },
  'stack-pass': { 3: toSide('Al salir al lado, baja el pecho sin soltar la cadera.') },
  'over-under': {
    2: 'Mantén el cierre y empieza a caminar hacia el lado del brazo de abajo.',
    3: toSide('Ya al costado: suelta las piernas y baja el pecho.'),
  },
  'leg-drag': {
    2: 'Con sus piernas a un lado, cae con la cadera contra la suya.',
    3: toSide('Saca tus piernas y baja el pecho a su costado.'),
  },
  'x-pass': { 2: toSide('Termina el paso y baja de rodillas a su costado.') },
  'long-step': { 3: toSide('Gira la cadera hacia abajo y apoya las rodillas a su lado.') },
  'smash-pass': {
    1: 'Baja la cadera sobre sus rodillas mientras sigues empujándolas.',
    3: toSide('Con la pierna fuera, gira hacia su cabeza y asienta el pecho.'),
  },
  'half-guard-crossface': { 3: toMount('Saca el pie y pásalo por encima: llegas a la montada.') },
  'body-lock-pass': {
    1: 'Empújalo hacia atrás sin soltar el cierre.',
    3: toSide('Saca la última pierna y baja el pecho a su costado.'),
  },
  'leg-weave': { 2: 'Salta por encima de sus piernas hacia el lado contrario.' },
  'backstep-pass': { 2: toSide('Termina el giro y apoya las rodillas en el lado contrario.') },
  'hip-switch-pass': { 3: toSide('Vuelve a mirar hacia su cabeza y baja la cadera.') },

  // Luxaciones
  'armbar-back': { 3: 'Cae de espaldas con su brazo entre tus piernas, sin soltarlo.' },
  'armbar-knee-on-belly': { 2: 'Siéntate junto a su hombro con su brazo pegado a tu pecho.' },
  'armbar-turtle': {
    2: 'Mete la cabeza y empieza a rodar por encima de su hombro.',
    3: {
      from: 'mount',
      text: 'Termina de rodar: él cae de espaldas y tus piernas quedan sobre su pecho.',
      fighters: [
        {
          base: 'closedGuard:0',
          move: [-20, 0],
          reach: {
            footL: at('neck', 1, 6, -14),
            footR: at('pelvis', 1, -10, -16),
            handL: at('handL', 1, -3),
          },
          bend: { footL: -1, footR: -1 },
          layers: { legL: 4, legR: 4 },
        },
        { rotate: -28, move: [-14, -20], reach: { handL: [128, 132] } },
      ],
      grips: [[0, 'handL', 'Muñeca']],
    },
  },
  'kimura-turtle': { 2: 'Levanta el codo y empieza a girar su brazo hacia la espalda.' },
  omoplata: { 1: 'Gira la cadera hacia sus pies con la pierna sobre su hombro.' },
  'knee-armbar': { 1: 'Levántate y empieza a pasar la rodilla por encima de su brazo.' },
  kneebar: { 1: 'Pasa la pierna por encima de él y déjate caer de lado.' },

  // Estrangulaciones
  darce: {
    2: {
      text: 'Mete el brazo hasta el fondo y siéntate sobre la cadera, girando hacia su brazo atrapado.',
      t: 0.5,
      fighters: [
        {
          base: 'butterflyGuard:0',
          move: [-78, 0],
          angles: { spine: -112, neck: -118, thighL: -30, shinL: 60, thighR: -20, shinR: 70 },
          reach: { handR: at('shoulderL', 1, 16, 10), handL: at('shoulderL', 1, 6, -8) },
        },
        { rotate: 10 },
      ],
      grips: [[0, 'handR', 'Bíceps']],
    },
  },
  anaconda: {
    2: {
      text: 'Siéntate de lado y empieza a rodar hacia el hombro del brazo atrapado, llevándolo contigo.',
      t: 0.5,
      fighters: [
        {
          base: 'butterflyGuard:0',
          move: [-70, 0],
          angles: { spine: -140, neck: -146, thighL: -40, shinL: 40, thighR: -25, shinR: 60 },
          reach: { handR: at('shoulderR', 1, 18, 12), handL: at('shoulderL', 1, 8, -10) },
        },
        { rotate: 26, move: [-10, 0] },
      ],
      grips: [[0, 'handR', 'Bíceps']],
    },
  },
  'bow-and-arrow': { 2: 'Empieza a girar de lado tirando del cuello.' },
  'triangle-mount': { 2: 'Cae de lado llevando su cabeza contigo.' },
  'baseball-bat-choke': { 2: 'Camina alrededor de su cabeza sin soltar los agarres.' },
  'loop-choke': { 2: 'Empieza a rodar hacia el lado del agarre.' },

  // Escapes
  'elbow-knee-escape': { 2: 'Atrapa su pierna entre las tuyas mientras recuperas la cadera.' },
  'side-control-shrimp': { 3: toGuard('Mete la segunda rodilla y rodea su cintura.') },
  'side-control-to-knees': {
    2: 'Gira hacia él sobre el hombro sin soltar el underhook.',
    3: 'Ya de rodillas, pega la cabeza a su costado.',
  },
  'back-escape': {
    1: 'Baja la espalda hacia el lado del brazo de abajo.',
    2: 'Saca la cadera hacia el lado y empieza a girar hacia él.',
  },
  'knee-on-belly-escape': { 3: toGuard('Rodea su cintura con las piernas.') },
  'north-south-escape': {
    2: 'Sigue girando de lado con las rodillas hacia dentro.',
    3: toGuard('Ponlo delante de tus piernas y rodea su cintura.'),
  },
  'turtle-sit-out': {
    2: 'Siéntate sobre la cadera, todavía de lado.',
    3: toGuard('Encáralo y rodea su cintura con las piernas.'),
  },
  'granby-roll': { 1: 'Apoya el hombro en el suelo y empieza a rodar.' },
  'armbar-defense': { 2: 'Ya de pie, empieza a cargar el peso hacia delante.' },
  sprawl: {
    1: {
      text: 'Lanza las piernas atrás mientras bajas el pecho sobre su espalda.',
      t: 0.5,
      fighters: [
        {
          base: 'turtle:0',
          move: [26, -16],
          angles: { spine: -150, neck: -158, thighL: 30, shinL: 50, thighR: 22, shinR: 45 },
          reach: { handL: at('shoulderL', 1, 4, -4) },
        },
        { base: 'turtle:1', move: [-24, -14], rotate: -14 },
      ],
      grips: [[0, 'handL', 'Hombro']],
    },
    2: 'Rodea hacia su costado sin levantar la cadera.',
  },

  // Derribos
  'double-leg': { 3: landed('Cae de espaldas: quédate encima de sus piernas.') },
  'single-leg': {
    1: 'Sube con la cabeza pegada a su costado y su pierna entre las tuyas.',
    3: landed('Cae de espaldas: baja encima antes de que se levante.'),
  },
  'ankle-pick': { 3: landed('Cae sentado: pasa sus piernas.') },
  'o-soto-gari': {
    2: 'Sube tu pierna por detrás de la suya mientras lo empujas hacia el talón.',
    3: landed('Cae de espaldas: quédate de pie con la manga.'),
  },
  'ko-soto-gari': {
    2: 'Lleva tu pie hacia su talón.',
    3: landed('Cae de espaldas: quédate de pie con la manga.'),
  },
  'o-uchi-gari': {
    2: 'Mete la pierna entre las suyas.',
    3: fallingBack('Cae de espaldas: acompáñalo hacia el suelo entre sus piernas.'),
  },
  'ko-uchi-gari': {
    2: 'Lleva tu pie hacia su tobillo por dentro.',
    3: fallingBack('Cae de espaldas: acompáñalo hacia el suelo dentro de su guardia.'),
  },
  'de-ashi-barai': {
    2: 'Barre su pie mientras se le va el peso.',
    3: landed('Cae de lado: quédate de pie con la manga.'),
  },
  'o-goshi': {
    2: 'Estira las piernas: sus pies se separan del suelo.',
    3: landed('Cae de espaldas delante de ti: no sueltes la manga.'),
  },
  'harai-goshi': {
    2: 'Sube la pierna barriendo su muslo.',
    3: landed('Cae de espaldas delante de ti: no sueltes la manga.'),
  },
  'uchi-mata': {
    2: 'Sube la pierna entre las suyas mientras giras.',
    3: landed('Cae de espaldas delante de ti: no sueltes la manga.'),
  },
  'seoi-nage': {
    2: 'Cárgalo sobre la espalda y empieza a estirar las piernas.',
    3: landed('Cae de espaldas delante de ti: no sueltes la manga.'),
  },
  'drop-seoi-nage': {
    1: 'Empieza a girar de espaldas sin soltar los agarres.',
    2: 'Tira de la manga: su peso pasa a tu espalda.',
    3: landed('Cae de espaldas delante de ti: levántate sin soltar la manga.'),
  },
  'tai-otoshi': {
    2: 'Tira de la manga: tropieza con tu pierna.',
    3: landed('Cae delante de ti: no sueltes la manga.'),
  },
  'kata-guruma': {
    2: 'Levántate con él sobre los hombros.',
    3: landed('Cae a tu lado: quédate de pie con la manga.'),
  },
  'tani-otoshi': {
    2: 'Empieza a dejarte caer hacia atrás con él.',
    3: toSide('Ya en el suelo: gira hacia él y sube encima.'),
  },
  'body-lock-takedown': {
    2: 'Bloquea su pierna con la tuya.',
    3: landed('Cae de espaldas: baja encima sin soltar el cierre.'),
  },
  'tomoe-nage': {
    1: 'Tira de él y empieza a sentarte.',
    2: 'Estira la pierna: sus pies se levantan del suelo.',
    3: 'Cae al otro lado de tu cabeza: rueda hacia atrás para seguirlo.',
  },
  'sumi-gaeshi': {
    2: 'Déjate caer con el gancho bajo su muslo.',
    3: 'Cae al otro lado: rueda con él hacia arriba.',
  },
  'arm-drag-standing': {
    2: 'Pasa a su costado sin soltar el tríceps.',
    3: toBack('Siéntate detrás de él y mete el primer gancho.'),
  },
  'snap-down': {
    1: 'Tira de la cabeza hacia abajo: se dobla hacia delante.',
    2: 'Rodea hacia su costado mientras cae a cuatro apoyos.',
  },
  'guard-pull': {
    1: 'Pon el pie en su cadera y empieza a sentarte.',
    2: toGuard('Tira de él hacia ti y rodea su cintura con las piernas.'),
  },

  // Controles y transiciones
  upa: {
    2: {
      from: 'mount*',
      text: 'Gira sobre el hombro: cae de lado hacia el brazo atrapado.',
      fighters: [
        {
          move: [0, -6],
          angles: { spine: 200, thighL: -40, shinL: 60, thighR: -30, shinR: 50 },
          reach: { handL: at('elbowR', 1), handR: at('handR', 1) },
        },
        { rotate: -60, move: [-30, 6] },
      ],
      grips: [
        [0, 'handL', 'Brazo'],
        [0, 'handR', 'Muñeca'],
      ],
    },
  },
  'side-to-north-south': {
    2: {
      from: 'sideControl',
      text: 'Sigue girando alrededor de su cabeza hasta quedar en línea con él.',
      fighters: [
        {
          base: 'northSouth:0',
          rotate: -12,
          move: [26, 0],
          reach: { handL: at('shoulderL', 1, 0, -6), handR: at('shoulderR', 1, 4, -6) },
        },
      ],
      grips: [[0, 'handL', 'Brazo']],
    },
  },
  'turtle-back-take': { 2: toBack('Rueda hacia un lado llevándolo contigo con el primer gancho.') },
  'mount-to-back': { 2: toBack('Rueda de lado sin soltar el cinturón de seguridad.') },
  'half-guard-back-take': {
    1: {
      text: 'Ponte de rodillas por debajo de él, con la cabeza pegada a su costado.',
      t: 0.5,
      fighters: [
        {
          base: 'turtle:1',
          mirror: true,
          move: [-4, 10],
          rotate: 18,
          reach: { handR: at('shoulderL', 1, 6, 14) },
        },
        {},
      ],
      grips: [[0, 'handR', 'Underhook']],
    },
    2: {
      text: 'Sube por encima de su espalda sin soltar la cintura.',
      t: 0.5,
      fighters: [
        {
          base: 'turtle:0',
          move: [-14, 4],
          angles: { spine: -122, neck: -132 },
          reach: { handR: at('pelvis', 1, 0, -10), handL: at('shoulderR', 1, 0, 10) },
        },
        {},
      ],
      grips: [[0, 'handR', 'Cintura']],
    },
    3: toBack('Siéntate detrás de él con el cinturón de seguridad.'),
  },
  'arm-drag-guard': {
    1: 'Tira del brazo cruzándolo mientras empiezas a sentarte.',
    2: 'Sube por su costado hacia su espalda.',
    3: toBack('Siéntate detrás de él y mete el primer gancho.'),
  },
  'break-posture': { 1: 'Tira de la cabeza: empieza a doblarse hacia ti.' },
  'guard-retention': { 2: 'Siéntate otra vez con las rodillas entre los dos.' },
  'technical-standup': { 2: 'Ponte de pie hacia atrás, con la mano delante para protegerte.' },
};
