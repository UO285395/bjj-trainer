import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CATEGORY_LABELS, LEVEL_LABELS } from '../data/catalog';
import type { TechniqueView } from '../data/techniques';
import { colors, fonts } from '../theme';
import { FrameView } from './FrameView';

type Props = {
  technique: TechniqueView;
  onPress: () => void;
  meta?: string;
  right?: React.ReactNode;
  selected?: boolean;
};

function TechniqueRowBase({ technique, onPress, meta, right, selected }: Props) {
  const tags = [
    CATEGORY_LABELS[technique.category],
    technique.custom ? 'Propia' : technique.level && LEVEL_LABELS[technique.level],
  ]
    .filter(Boolean)
    .join(' · ');
  return (
    <Pressable onPress={onPress} style={[styles.row, selected && styles.selected]}>
      <View style={styles.thumb}>
        <FrameView frame={technique.frames[technique.frames.length - 1]} width={92} compact />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={styles.name} numberOfLines={2}>
          {technique.name}
        </Text>
        <Text style={styles.tags}>{tags}</Text>
        {!!meta && <Text style={styles.meta}>{meta}</Text>}
      </View>
      {right}
    </Pressable>
  );
}

export const TechniqueRow = memo(TechniqueRowBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 8,
    paddingRight: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  selected: { borderColor: colors.primary, borderWidth: 2, padding: 7, paddingRight: 11 },
  thumb: { borderRadius: 10, overflow: 'hidden', backgroundColor: colors.mat },
  name: { fontSize: 19, fontFamily: fonts.displaySemi, color: colors.text },
  tags: { fontSize: 13, color: colors.muted },
  meta: { fontSize: 13, color: colors.secondary },
});
