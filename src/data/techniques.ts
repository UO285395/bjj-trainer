import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { type CustomTechnique, listCustomTechniques } from '../db/repo';
import { POSITIONS } from '../skeleton/poses';
import { type Frame, swapFighters } from '../skeleton/shapes';
import {
  CATALOG,
  CATALOG_BY_ID,
  type Category,
  type Level,
  type PositionRef,
  type Technique,
} from './catalog';

/** Técnica lista para mostrar, venga del catálogo o la haya creado el usuario. */
export type TechniqueView = {
  id: string;
  name: string;
  category: Category;
  description: string;
  level?: Level;
  custom: boolean;
  frames: Frame[];
};

export const CUSTOM_PREFIX = 'propia-';

/** Fotograma de una posición base con el ejecutor siempre como luchador 0. */
export function positionFrame(ref: PositionRef): Frame {
  const base = POSITIONS[ref.id];
  return ref.swap ? swapFighters(base) : base;
}

export function catalogView(t: Technique): TechniqueView {
  const frames = [{ ...positionFrame(t.from), caption: `Desde: ${POSITIONS[t.from.id].caption}` }];
  if (t.to) frames.push({ ...positionFrame(t.to), caption: `Hasta: ${POSITIONS[t.to.id].caption}` });
  return {
    id: t.id,
    name: t.name,
    category: t.category,
    description: t.description,
    level: t.level,
    custom: false,
    frames,
  };
}

export function customView(c: CustomTechnique): TechniqueView {
  return {
    id: c.id,
    name: c.name,
    category: c.category,
    description: c.description,
    custom: true,
    frames: c.frames,
  };
}

const CATALOG_VIEWS = CATALOG.map(catalogView);

/** Catálogo + técnicas propias, recargado cada vez que la pantalla gana el foco. */
export function useAllTechniques() {
  const db = useSQLiteContext();
  const [custom, setCustom] = useState<TechniqueView[]>([]);
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      listCustomTechniques(db).then((rows) => alive && setCustom(rows.map(customView)));
      return () => {
        alive = false;
      };
    }, [db]),
  );
  return { catalog: CATALOG_VIEWS, custom, all: [...custom, ...CATALOG_VIEWS] };
}

export function catalogTechnique(id: string) {
  const t = CATALOG_BY_ID.get(id);
  return t ? catalogView(t) : null;
}

/** Normaliza para buscar sin tildes ni mayúsculas. */
export const normalizeText = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
