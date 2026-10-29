import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { CATEGORIES, CATEGORY_LABELS, type Category } from '../data/catalog';
import { type TechniqueView, normalizeText } from '../data/techniques';
import { colors } from '../theme';
import { Chip } from './ui';

/** Estado y controles de búsqueda + filtro por categoría compartidos por las listas. */
export function useTechniqueFilter(list: TechniqueView[]) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const filtered = useMemo(() => {
    const q = normalizeText(query.trim());
    return list.filter(
      (t) =>
        (!category || t.category === category) &&
        (!q || normalizeText(t.name).includes(q) || normalizeText(t.description).includes(q)),
    );
  }, [list, query, category]);

  const controls = (
    <View style={{ gap: 10 }}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar técnica"
        placeholderTextColor={colors.muted}
        style={styles.search}
        clearButtonMode="while-editing"
        autoCorrect={false}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        <Chip label="Todas" selected={!category} onPress={() => setCategory(null)} />
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={CATEGORY_LABELS[c]}
            selected={category === c}
            onPress={() => setCategory(category === c ? null : c)}
          />
        ))}
      </ScrollView>
    </View>
  );
  return { filtered, controls };
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  chips: { gap: 8, paddingRight: 16 },
});
