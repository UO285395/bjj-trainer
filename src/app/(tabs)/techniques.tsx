import { router, useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTechniqueFilter } from '../../components/TechniqueFilter';
import { TechniqueRow } from '../../components/TechniqueRow';
import { Chip, Empty } from '../../components/ui';
import { useAllTechniques } from '../../data/techniques';
import { listFavorites, techniqueUsage } from '../../db/repo';
import { useFocusData } from '../../hooks/useFocusData';
import { colors } from '../../theme';

type Scope = 'todas' | 'propias' | 'favoritas';

export default function TechniquesScreen() {
  const navigation = useNavigation();
  const { all, custom } = useAllTechniques();
  const { data } = useFocusData(
    async (db) => ({ favorites: await listFavorites(db), usage: await techniqueUsage(db) }),
    { favorites: new Set<string>(), usage: new Map<string, { count: number; last: string }>() },
  );
  const [scope, setScope] = useState<Scope>('todas');
  const source =
    scope === 'propias' ? custom : scope === 'favoritas' ? all.filter((t) => data.favorites.has(t.id)) : all;
  const { filtered, controls } = useTechniqueFilter(source);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => router.push('/technique/edit')} hitSlop={10} style={{ marginRight: 16 }}>
          <Text style={styles.create}>+ Crear</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <FlatList
      data={filtered}
      keyExtractor={(t) => t.id}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      initialNumToRender={12}
      ListHeaderComponent={
        <View style={{ gap: 10, marginBottom: 4 }}>
          <View style={styles.scopes}>
            <Chip
              label={`Todas (${all.length})`}
              selected={scope === 'todas'}
              onPress={() => setScope('todas')}
            />
            <Chip
              label={`Mías (${custom.length})`}
              selected={scope === 'propias'}
              onPress={() => setScope('propias')}
            />
            <Chip label="Favoritas" selected={scope === 'favoritas'} onPress={() => setScope('favoritas')} />
          </View>
          {controls}
        </View>
      }
      ListEmptyComponent={
        scope === 'propias' ? (
          <Empty
            title="Sin técnicas propias"
            text="Pulsa «+ Crear» para añadir un movimiento con sus siluetas."
          />
        ) : (
          <Empty title="Nada por aquí" text="Prueba con otra búsqueda o categoría." />
        )
      }
      renderItem={({ item }) => {
        const usage = data.usage.get(item.id);
        return (
          <TechniqueRow
            technique={item}
            meta={usage ? `Practicada ${usage.count} ${usage.count === 1 ? 'vez' : 'veces'}` : undefined}
            onPress={() => router.push(`/technique/${item.id}`)}
            right={data.favorites.has(item.id) ? <Text style={styles.star}>★</Text> : undefined}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 8, paddingBottom: 40 },
  scopes: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  create: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  star: { color: '#E8A317', fontSize: 18 },
});
