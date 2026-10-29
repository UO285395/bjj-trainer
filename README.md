# BJJ Trainer

App móvil para registrar entrenamientos de Brazilian Jiu-Jitsu, con un catálogo de técnicas
ilustradas con siluetas y la posibilidad de crear movimientos propios dibujando las posiciones.

## Qué incluye

- **Entrenos**: registro de clases (fecha, tipo, duración, intensidad, rounds, notas y técnicas
  practicadas), agrupadas por mes.
- **Catálogo**: 131 técnicas precargadas en 7 categorías (derribos, pases, barridas, luxaciones,
  estrangulaciones, escapes y transiciones), con búsqueda sin tildes, filtros, favoritas y notas
  personales.
- **Siluetas paso a paso**: dos figuras (azafrán = quien ejecuta, jade = compañero). Las técnicas
  con secuencia (`src/data/techniqueSteps.ts`) muestran cada paso con su explicación y los agarres
  marcados; el resto, su posición de partida y de llegada. Se puede animar la transición.
- **Técnicas propias**: hasta 6 pasos por técnica; cada paso parte de una posición base, se ajusta
  arrastrando las articulaciones y se pueden marcar los agarres de manos y pies.
- **Progreso**: cinturón y grados, entrenos por semana, técnicas más practicadas y repertorio por
  categoría.

Todo se guarda en el dispositivo (SQLite); no hace falta cuenta ni conexión.

## Desarrollo

```bash
npm install
npx expo start        # abre en Expo Go, emulador o navegador (tecla w)
npm run typecheck     # TypeScript
npx expo lint         # ESLint
```

Instala dependencias nuevas con `npx expo install <paquete>` para usar versiones compatibles con el SDK.

## Estilo y marca

- Paleta «tatami de noche» (`src/theme.ts`): fondo tinta, tatami oliva, azafrán para acciones y
  para quien ejecuta, jade para el compañero. Títulos en Barlow Condensed.
- Logo: cinturón anudado con barra y dos grados (`assets/brand/logo.svg`). Los iconos de la app se
  regeneran con `node scripts/build-brand-icons.js`.

## Estructura

```
src/
  app/            Pantallas (Expo Router): pestañas, entreno, técnica y editor
  components/     Visor de técnicas, editor de poses, filas y controles comunes
  data/           Catálogo de técnicas y acceso unificado catálogo + propias
  db/             Esquema SQLite con migraciones y consultas
  skeleton/       Esqueleto 2D, posiciones base y generación de las siluetas SVG
```

### Esqueleto y siluetas

- 15 articulaciones por figura. Una pose es la posición de la pelvis más un ángulo absoluto por
  hueso (0° = derecha, 90° = abajo); la longitud de los huesos es fija (`src/skeleton/model.ts`).
- Cada extremidad se dibuja como una forma continua que se estrecha, con contorno fino
  semitransparente. Las extremidades del lado lejano van detrás y en un tono apagado; el orden de
  capas se puede ajustar por extremidad (`src/skeleton/shapes.ts`).
- Las posiciones base están en `src/skeleton/poses.ts`. Cada técnica del catálogo indica de qué
  posición parte y a cuál llega; si quien ejecuta ocupa el papel del compañero en esa posición,
  los colores se intercambian para que el ejecutor tenga siempre el mismo color.
- En el editor, manos y pies se colocan con cinemática inversa de dos huesos; codos, rodillas,
  hombros, cadera, cuello y cabeza giran su hueso y arrastran lo que cuelga de él; la pelvis
  mueve la figura entera.
