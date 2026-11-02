import type { SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_NAME = 'bjj-trainer.db';

// Cada entrada lleva la base de datos de la versión i a la i + 1.
const MIGRATIONS: string[] = [
  `
  CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    duration_min INTEGER NOT NULL,
    kind TEXT NOT NULL,
    intensity INTEGER NOT NULL DEFAULT 3,
    rounds INTEGER NOT NULL DEFAULT 0,
    notes TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE session_techniques (
    session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    technique_id TEXT NOT NULL,
    PRIMARY KEY (session_id, technique_id)
  );
  CREATE TABLE custom_techniques (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    frames TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE technique_notes (
    technique_id TEXT PRIMARY KEY NOT NULL,
    favorite INTEGER NOT NULL DEFAULT 0,
    notes TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
  `,
];

export async function migrate(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;
  while (version < MIGRATIONS.length) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(MIGRATIONS[version]);
    });
    version += 1;
    await db.execAsync(`PRAGMA user_version = ${version}`);
  }
}
