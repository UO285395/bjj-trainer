import { useFocusEffect } from 'expo-router';
import { type SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Carga datos de SQLite cada vez que la pantalla gana el foco.
 * `key` identifica lo que se carga (p. ej. el id de la ruta): al cambiar, se recarga.
 */
export function useFocusData<T>(load: (db: SQLiteDatabase) => Promise<T>, initial: T, key?: string | number) {
  const db = useSQLiteContext();
  const [data, setData] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  });
  const reload = useCallback(async () => {
    setData(await loadRef.current(db));
    setLoaded(true);
  }, [db, key]); // eslint-disable-line react-hooks/exhaustive-deps
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );
  return { data, loaded, reload, db };
}
