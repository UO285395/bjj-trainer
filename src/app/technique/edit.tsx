import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { FrameView } from '../../components/FrameView';
import { PoseEditor } from '../../components/PoseEditor';
import { Button, Chip, Field, Label } from '../../components/ui';
import { CATEGORIES, CATEGORY_LABELS, type Category } from '../../data/catalog';
import { CUSTOM_PREFIX, catalogTechnique } from '../../data/techniques';
import { getCustomTechnique, saveCustomTechnique } from '../../db/repo';
import { POSITIONS, type PositionId } from '../../skeleton/poses';
import type { Frame } from '../../skeleton/shapes';
import { colors } from '../../theme';

const MAX_FRAMES = 6;
const POSITION_IDS = Object.keys(POSITIONS) as PositionId[];

export default function EditTechniqueScreen() {
  const { id, from } = useLocalSearchParams<{ id?: string; from?: string }>();
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  // «Crear mi versión» parte de una técnica del catálogo.
  const [base] = useState(() => (from ? catalogTechnique(from) : null));
  const [name, setName] = useState(base ? `${base.name} (mi versión)` : '');
  const [category, setCategory] = useState<Category>(base?.category ?? 'transicion');
  const [description, setDescription] = useState(base?.description ?? '');
  const [frames, setFrames] = useState<Frame[]>(base?.frames ?? [{ ...POSITIONS.standing, caption: '' }]);
  const [current, setCurrent] = useState(0);
  const [createdAt, setCreatedAt] = useState(() => new Date().toISOString());
  const [dragging, setDragging] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: id ? 'Editar técnica' : 'Nueva técnica' });
  }, [navigation, id]);

  useEffect(() => {
    if (!id) return;
    getCustomTechnique(db, id).then((t) => {
      if (!t) return;
      setName(t.name);
      setCategory(t.category);
      setDescription(t.description);
      setFrames(t.frames);
      setCreatedAt(t.createdAt);
    });
  }, [db, id]);

  const frame = frames[current] ?? frames[0];
  const setFrame = (f: Frame) => setFrames((all) => all.map((x, i) => (i === current ? f : x)));

  const save = async () => {
    if (!name.trim()) {
      Alert.alert('Falta el nombre', 'Ponle un nombre a la técnica.');
      return;
    }
    const techniqueId = id ?? `${CUSTOM_PREFIX}${Date.now().toString(36)}`;
    await saveCustomTechnique(db, {
      id: techniqueId,
      name: name.trim(),
      category,
      description: description.trim(),
      frames,
      createdAt,
    });
    if (id) router.back();
    else router.replace(`/technique/${techniqueId}`);
  };

  const canvasWidth = Math.min(width, 640) - 32;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      scrollEnabled={!dragging}
      keyboardShouldPersistTaps="handled"
    >
      <Field label="Nombre" value={name} onChangeText={setName} placeholder="p. ej. Mi barrida favorita" />

      <Label>Categoría</Label>
      <View style={styles.wrap}>
        {CATEGORIES.map((c) => (
          <Chip key={c} label={CATEGORY_LABELS[c]} selected={category === c} onPress={() => setCategory(c)} />
        ))}
      </View>

      <Label>Pasos ({frames.length})</Label>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.frames}>
        {frames.map((f, i) => (
          <Pressable
            key={i}
            onPress={() => setCurrent(i)}
            style={[styles.frameThumb, i === current && styles.frameThumbOn]}
            accessibilityLabel={`Paso ${i + 1}`}
          >
            <FrameView frame={f} width={84} compact />
            <Text style={styles.frameNumber}>{i + 1}</Text>
          </Pressable>
        ))}
        {frames.length < MAX_FRAMES && (
          <Pressable
            style={[styles.frameThumb, styles.addFrame]}
            onPress={() => {
              setFrames([
                ...frames.slice(0, current + 1),
                { ...frame, caption: '' },
                ...frames.slice(current + 1),
              ]);
              setCurrent(current + 1);
            }}
            accessibilityLabel="Añadir paso"
          >
            <Text style={styles.addText}>+</Text>
          </Pressable>
        )}
      </ScrollView>

      <Label>Partir de una posición</Label>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.frames}>
        {POSITION_IDS.map((p) => (
          <Chip
            key={p}
            label={POSITIONS[p].caption}
            onPress={() => setFrame({ ...POSITIONS[p], caption: frame.caption })}
          />
        ))}
      </ScrollView>

      <PoseEditor frame={frame} onChange={setFrame} width={canvasWidth} onDragChange={setDragging} />

      <Field
        label={`Descripción del paso ${current + 1}`}
        value={frame.caption ?? ''}
        onChangeText={(caption) => setFrame({ ...frame, caption })}
        placeholder="p. ej. Controla la manga y pon el pie en la cadera"
      />
      {frames.length > 1 && (
        <Button
          small
          variant="secondary"
          title={`Quitar paso ${current + 1}`}
          onPress={() => {
            setFrames(frames.filter((_, i) => i !== current));
            setCurrent(Math.max(0, current - 1));
          }}
        />
      )}

      <Field
        label="Explicación"
        value={description}
        onChangeText={setDescription}
        placeholder="Cómo se hace, detalles clave…"
        multiline
      />

      <Button title="Guardar técnica" onPress={save} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12, paddingBottom: 48, width: '100%', maxWidth: 672, alignSelf: 'center' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  frames: { gap: 8, paddingRight: 16, alignItems: 'center' },
  frameThumb: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.mat,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  frameThumbOn: { borderColor: colors.primary },
  frameNumber: {
    position: 'absolute',
    top: 3,
    left: 6,
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
  },
  addFrame: {
    width: 88,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.border,
  },
  addText: { fontSize: 24, color: colors.primary },
});
