import type { SQLiteDatabase } from 'expo-sqlite';

import type { Category } from '../data/catalog';
import type { Frame } from '../skeleton/shapes';

export const SESSION_KINDS = ['Gi', 'No-Gi', 'Open mat', 'Competición', 'Privada'] as const;
export type SessionKind = (typeof SESSION_KINDS)[number];

export type Session = {
  id: number;
  date: string; // AAAA-MM-DD
  durationMin: number;
  kind: SessionKind;
  intensity: number; // 1-5
  rounds: number;
  notes: string;
  techniqueIds: string[];
};

type SessionRow = {
  id: number;
  date: string;
  duration_min: number;
  kind: SessionKind;
  intensity: number;
  rounds: number;
  notes: string;
  technique_ids: string | null;
};

const fromRow = (r: SessionRow): Session => ({
  id: r.id,
  date: r.date,
  durationMin: r.duration_min,
  kind: r.kind,
  intensity: r.intensity,
  rounds: r.rounds,
  notes: r.notes,
  techniqueIds: r.technique_ids ? r.technique_ids.split(',') : [],
});

const SESSION_SELECT = `
  SELECT s.*, GROUP_CONCAT(st.technique_id) AS technique_ids
  FROM sessions s LEFT JOIN session_techniques st ON st.session_id = s.id`;

export async function listSessions(db: SQLiteDatabase): Promise<Session[]> {
  const rows = await db.getAllAsync<SessionRow>(
    `${SESSION_SELECT} GROUP BY s.id ORDER BY s.date DESC, s.id DESC`,
  );
  return rows.map(fromRow);
}

export async function getSession(db: SQLiteDatabase, id: number): Promise<Session | null> {
  const row = await db.getFirstAsync<SessionRow>(`${SESSION_SELECT} WHERE s.id = ? GROUP BY s.id`, id);
  return row ? fromRow(row) : null;
}

export async function saveSession(db: SQLiteDatabase, s: Omit<Session, 'id'> & { id?: number }) {
  let id = s.id;
  await db.withTransactionAsync(async () => {
    const params = [s.date, s.durationMin, s.kind, s.intensity, s.rounds, s.notes];
    if (id) {
      await db.runAsync(
        'UPDATE sessions SET date = ?, duration_min = ?, kind = ?, intensity = ?, rounds = ?, notes = ? WHERE id = ?',
        ...params,
        id,
      );
      await db.runAsync('DELETE FROM session_techniques WHERE session_id = ?', id);
    } else {
      const res = await db.runAsync(
        'INSERT INTO sessions (date, duration_min, kind, intensity, rounds, notes) VALUES (?, ?, ?, ?, ?, ?)',
        ...params,
      );
      id = res.lastInsertRowId;
    }
    for (const t of s.techniqueIds) {
      await db.runAsync('INSERT INTO session_techniques (session_id, technique_id) VALUES (?, ?)', id!, t);
    }
  });
  return id!;
}

export async function deleteSession(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM sessions WHERE id = ?', id);
}

/** Veces que se ha practicado cada técnica y fecha de la última vez. */
export async function techniqueUsage(db: SQLiteDatabase) {
  const rows = await db.getAllAsync<{ technique_id: string; n: number; last: string }>(
    `SELECT st.technique_id, COUNT(*) AS n, MAX(s.date) AS last
     FROM session_techniques st JOIN sessions s ON s.id = st.session_id
     GROUP BY st.technique_id`,
  );
  return new Map(rows.map((r) => [r.technique_id, { count: r.n, last: r.last }]));
}

// Técnicas propias

export type CustomTechnique = {
  id: string;
  name: string;
  category: Category;
  description: string;
  frames: Frame[];
  createdAt: string;
};

type CustomRow = {
  id: string;
  name: string;
  category: Category;
  description: string;
  frames: string;
  created_at: string;
};

const customFromRow = (r: CustomRow): CustomTechnique => ({
  id: r.id,
  name: r.name,
  category: r.category,
  description: r.description,
  frames: JSON.parse(r.frames),
  createdAt: r.created_at,
});

export async function listCustomTechniques(db: SQLiteDatabase) {
  const rows = await db.getAllAsync<CustomRow>('SELECT * FROM custom_techniques ORDER BY created_at DESC');
  return rows.map(customFromRow);
}

export async function getCustomTechnique(db: SQLiteDatabase, id: string) {
  const row = await db.getFirstAsync<CustomRow>('SELECT * FROM custom_techniques WHERE id = ?', id);
  return row ? customFromRow(row) : null;
}

export async function saveCustomTechnique(db: SQLiteDatabase, t: CustomTechnique) {
  await db.runAsync(
    `INSERT INTO custom_techniques (id, name, category, description, frames, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET name = excluded.name, category = excluded.category,
       description = excluded.description, frames = excluded.frames`,
    t.id,
    t.name,
    t.category,
    t.description,
    JSON.stringify(t.frames),
    t.createdAt,
  );
}

export async function deleteCustomTechnique(db: SQLiteDatabase, id: string) {
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM custom_techniques WHERE id = ?', id);
    await db.runAsync('DELETE FROM session_techniques WHERE technique_id = ?', id);
    await db.runAsync('DELETE FROM technique_notes WHERE technique_id = ?', id);
  });
}

// Notas y favoritos por técnica

export type TechniqueNote = { favorite: boolean; notes: string };

export async function getTechniqueNote(db: SQLiteDatabase, id: string): Promise<TechniqueNote> {
  const row = await db.getFirstAsync<{ favorite: number; notes: string }>(
    'SELECT favorite, notes FROM technique_notes WHERE technique_id = ?',
    id,
  );
  return { favorite: !!row?.favorite, notes: row?.notes ?? '' };
}

export async function saveTechniqueNote(db: SQLiteDatabase, id: string, note: TechniqueNote) {
  await db.runAsync(
    `INSERT INTO technique_notes (technique_id, favorite, notes) VALUES (?, ?, ?)
     ON CONFLICT(technique_id) DO UPDATE SET favorite = excluded.favorite, notes = excluded.notes`,
    id,
    note.favorite ? 1 : 0,
    note.notes,
  );
}

export async function listFavorites(db: SQLiteDatabase) {
  const rows = await db.getAllAsync<{ technique_id: string }>(
    'SELECT technique_id FROM technique_notes WHERE favorite = 1',
  );
  return new Set(rows.map((r) => r.technique_id));
}

// Ajustes (cinturón, grados...)

export async function getSetting(db: SQLiteDatabase, key: string) {
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?', key);
  return row?.value ?? null;
}

export async function setSetting(db: SQLiteDatabase, key: string, value: string) {
  await db.runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    key,
    value,
  );
}
