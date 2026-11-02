import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { TechniquePicker } from '../../components/TechniquePicker';
import { Button, Chip, Field, Label } from '../../components/ui';
import { useAllTechniques } from '../../data/techniques';
import { SESSION_KINDS, type SessionKind, getSession, saveSession } from '../../db/repo';
import { colors, fonts } from '../../theme';
import { addDays, formatRelative, today } from '../../utils/dates';

const DURATIONS = [60, 75, 90, 120];

export default function EditSessionScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const { all } = useAllTechniques();
  const [date, setDate] = useState(today());
  const [kind, setKind] = useState<SessionKind>('Gi');
  const [duration, setDuration] = useState(90);
  const [intensity, setIntensity] = useState(3);
  const [rounds, setRounds] = useState(0);
  const [notes, setNotes] = useState('');
  const [techniqueIds, setTechniqueIds] = useState<string[]>([]);
  const [picking, setPicking] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: id ? 'Editar entreno' : 'Nuevo entreno' });
  }, [navigation, id]);

  useEffect(() => {
    if (!id) return;
    getSession(db, Number(id)).then((s) => {
      if (!s) return;
      setDate(s.date);
      setKind(s.kind);
      setDuration(s.durationMin);
      setIntensity(s.intensity);
      setRounds(s.rounds);
      setNotes(s.notes);
      setTechniqueIds(s.techniqueIds);
    });
  }, [db, id]);

  const save = async () => {
    if (!duration || duration < 0) {
      Alert.alert('Duración no válida', 'Indica cuántos minutos duró el entreno.');
      return;
    }
    await saveSession(db, {
      id: id ? Number(id) : undefined,
      date,
      kind,
      durationMin: duration,
      intensity,
      rounds,
      notes: notes.trim(),
      techniqueIds,
    });
    router.back();
  };

  const names = new Map(all.map((t) => [t.id, t.name]));

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Label>Fecha</Label>
      <View style={styles.dateRow}>
        <Pressable
          style={styles.arrow}
          onPress={() => setDate(addDays(date, -1))}
          accessibilityLabel="Día anterior"
        >
          <Text style={styles.arrowText}>‹</Text>
        </Pressable>
        <Text style={styles.date}>{formatRelative(date)}</Text>
        <Pressable
          style={[styles.arrow, date >= today() && { opacity: 0.3 }]}
          disabled={date >= today()}
          onPress={() => setDate(addDays(date, 1))}
          accessibilityLabel="Día siguiente"
        >
          <Text style={styles.arrowText}>›</Text>
        </Pressable>
      </View>

      <Label>Tipo</Label>
      <View style={styles.wrap}>
        {SESSION_KINDS.map((k) => (
          <Chip key={k} label={k} selected={kind === k} onPress={() => setKind(k)} />
        ))}
      </View>

      <Label>Duración (min)</Label>
      <View style={styles.wrap}>
        {DURATIONS.map((d) => (
          <Chip key={d} label={String(d)} selected={duration === d} onPress={() => setDuration(d)} />
        ))}
        <TextInput
          value={DURATIONS.includes(duration) ? '' : String(duration || '')}
          onChangeText={(v) => setDuration(Number(v.replace(/\D/g, '')) || 0)}
          placeholder="Otra"
          placeholderTextColor={colors.muted}
          keyboardType="number-pad"
          style={styles.smallInput}
        />
      </View>

      <Label>Intensidad</Label>
      <View style={styles.wrap}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Chip key={i} label={String(i)} selected={intensity === i} onPress={() => setIntensity(i)} />
        ))}
      </View>

      <Label>Rounds de sparring</Label>
      <View style={styles.dateRow}>
        <Pressable
          style={styles.arrow}
          onPress={() => setRounds(Math.max(0, rounds - 1))}
          accessibilityLabel="Menos rounds"
        >
          <Text style={styles.arrowText}>−</Text>
        </Pressable>
        <Text style={styles.date}>{rounds}</Text>
        <Pressable style={styles.arrow} onPress={() => setRounds(rounds + 1)} accessibilityLabel="Más rounds">
          <Text style={styles.arrowText}>+</Text>
        </Pressable>
      </View>

      <Label>Técnicas</Label>
      {techniqueIds.length > 0 && (
        <View style={styles.wrap}>
          {techniqueIds.map((t) => (
            <Chip
              key={t}
              label={`${names.get(t) ?? t}  ✕`}
              onPress={() => setTechniqueIds(techniqueIds.filter((x) => x !== t))}
            />
          ))}
        </View>
      )}
      <Button title="Añadir técnicas" variant="secondary" onPress={() => setPicking(true)} />

      <Field
        label="Notas"
        value={notes}
        onChangeText={setNotes}
        placeholder="Qué funcionó, qué repasar, con quién rodaste…"
        multiline
      />

      <Button title="Guardar" onPress={save} />

      <TechniquePicker
        visible={picking}
        techniques={all}
        selected={techniqueIds}
        onChange={setTechniqueIds}
        onClose={() => setPicking(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12, paddingBottom: 48 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  arrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: { fontSize: 22, color: colors.primary, lineHeight: 26 },
  date: { fontSize: 22, fontFamily: fonts.display, color: colors.text, minWidth: 110, textAlign: 'center' },
  smallInput: {
    width: 70,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    color: colors.text,
  },
});
