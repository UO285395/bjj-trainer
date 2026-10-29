import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { TechniqueViewer } from '../../components/TechniqueViewer';
import { Button, Card, Field, SectionTitle } from '../../components/ui';
import { CATEGORY_LABELS, LEVEL_LABELS } from '../../data/catalog';
import { CUSTOM_PREFIX, catalogTechnique, customView } from '../../data/techniques';
import {
  deleteCustomTechnique,
  getCustomTechnique,
  getTechniqueNote,
  saveTechniqueNote,
  techniqueUsage,
} from '../../db/repo';
import { useFocusData } from '../../hooks/useFocusData';
import { colors } from '../../theme';
import { confirmDestructive } from '../../utils/confirm';
import { formatRelative } from '../../utils/dates';

export default function TechniqueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isCustom = id.startsWith(CUSTOM_PREFIX);
  const { data, loaded, db, reload } = useFocusData(
    async (db) => {
      const technique = isCustom
        ? await getCustomTechnique(db, id).then((c) => c && customView(c))
        : catalogTechnique(id);
      return { technique, note: await getTechniqueNote(db, id), usage: (await techniqueUsage(db)).get(id) };
    },
    null,
    id,
  );
  const [notes, setNotes] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: data?.technique?.name ?? '' });
  }, [navigation, data?.technique?.name]);

  if (!data?.technique) return loaded ? <Text style={styles.missing}>Esta técnica ya no existe.</Text> : null;
  const { technique, note, usage } = data;
  const canvasWidth = Math.min(width, 640) - 32;

  const toggleFavorite = async () => {
    await saveTechniqueNote(db, id, { ...note, favorite: !note.favorite });
    reload();
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <TechniqueViewer frames={technique.frames} width={canvasWidth} />
      <View style={styles.titleRow}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.name}>{technique.name}</Text>
          <Text style={styles.tags}>
            {CATEGORY_LABELS[technique.category]}
            {technique.level ? ` · ${LEVEL_LABELS[technique.level]}` : ''}
            {technique.custom ? ' · Propia' : ''}
          </Text>
        </View>
        <Pressable onPress={toggleFavorite} hitSlop={10} accessibilityLabel="Marcar como favorita">
          <Text style={[styles.star, note.favorite && { color: '#E8A317' }]}>
            {note.favorite ? '★' : '☆'}
          </Text>
        </Pressable>
      </View>
      {!!technique.description && <Text style={styles.description}>{technique.description}</Text>}

      <Card style={styles.usage}>
        <Text style={styles.usageText}>
          {usage
            ? `Practicada ${usage.count} ${usage.count === 1 ? 'vez' : 'veces'} · última: ${formatRelative(usage.last).toLowerCase()}`
            : 'Aún no la has registrado en ningún entreno.'}
        </Text>
      </Card>

      <SectionTitle>Mis notas</SectionTitle>
      <Field
        label="Detalles, ajustes, errores a evitar"
        value={notes ?? note.notes}
        onChangeText={setNotes}
        onBlur={async () => {
          if (notes === null || notes === note.notes) return;
          await saveTechniqueNote(db, id, { ...note, notes });
          setNotes(null);
          reload();
        }}
        placeholder="Escribe aquí tus apuntes de esta técnica"
        multiline
      />

      <View style={{ gap: 10, marginTop: 8 }}>
        {technique.custom ? (
          <>
            <Button
              title="Editar técnica"
              variant="secondary"
              onPress={() => router.push({ pathname: '/technique/edit', params: { id } })}
            />
            <Button
              title="Eliminar técnica"
              variant="danger"
              onPress={() =>
                confirmDestructive(
                  'Eliminar técnica',
                  'También se quitará de los entrenos donde la registraste.',
                  async () => {
                    await deleteCustomTechnique(db, id);
                    router.back();
                  },
                )
              }
            />
          </>
        ) : (
          <Button
            title="Crear mi versión"
            variant="secondary"
            onPress={() => router.push({ pathname: '/technique/edit', params: { from: id } })}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12, paddingBottom: 48, width: '100%', maxWidth: 672, alignSelf: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  name: { fontSize: 24, fontWeight: '700', color: colors.text },
  tags: { fontSize: 14, color: colors.muted },
  star: { fontSize: 28, color: colors.muted },
  description: { fontSize: 16, lineHeight: 23, color: colors.text },
  usage: { paddingVertical: 10 },
  usageText: { color: colors.text, fontSize: 14 },
  missing: { padding: 24, color: colors.muted, textAlign: 'center' },
});
