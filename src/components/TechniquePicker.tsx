import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { TechniqueView } from '../data/techniques';
import { colors } from '../theme';
import { useTechniqueFilter } from './TechniqueFilter';
import { TechniqueRow } from './TechniqueRow';

type Props = {
  visible: boolean;
  techniques: TechniqueView[];
  selected: string[];
  onChange: (ids: string[]) => void;
  onClose: () => void;
};

export function TechniquePicker({ visible, techniques, selected, onChange, onClose }: Props) {
  const { filtered, controls } = useTechniqueFilter(techniques);
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.title}>Técnicas practicadas</Text>
          <Pressable onPress={onClose} hitSlop={10}>
            <Text style={styles.done}>Listo ({selected.length})</Text>
          </Pressable>
        </View>
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>{controls}</View>
        <FlatList
          data={filtered}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ padding: 16, paddingTop: 4, gap: 8 }}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={12}
          renderItem={({ item }) => {
            const on = selected.includes(item.id);
            return (
              <TechniqueRow
                technique={item}
                selected={on}
                onPress={() => toggle(item.id)}
                right={
                  <View style={[styles.check, on && styles.checkOn]}>
                    {on && <Text style={styles.tick}>✓</Text>}
                  </View>
                }
              />
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  done: { fontSize: 16, fontWeight: '600', color: colors.primary },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  tick: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
