import type { ReactNode } from 'react';
import {
  Pressable,
  type PressableProps,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewProps,
} from 'react-native';

import { colors } from '../theme';

export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.section}>{children}</Text>;
}

type ButtonProps = PressableProps & {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  small?: boolean;
};

export function Button({ title, variant = 'primary', small, style, disabled, ...props }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={(state) => [
        styles.button,
        small && styles.buttonSmall,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'danger' && styles.buttonDanger,
        (state.pressed || disabled) && { opacity: 0.6 },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    >
      <Text
        style={[
          styles.buttonText,
          small && { fontSize: 14 },
          variant === 'secondary' && { color: colors.primary },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function Field({ label, style, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        style={[styles.input, props.multiline && { minHeight: 90, textAlignVertical: 'top' }, style]}
        {...props}
      />
    </View>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function Empty({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

export function Intensity({ value }: { value: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3 }} accessibilityLabel={`Intensidad ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          style={{
            width: 6,
            height: 6 + i * 3,
            alignSelf: 'flex-end',
            borderRadius: 2,
            backgroundColor: i <= value ? colors.accent : colors.border,
          }}
        />
      ))}
    </View>
  );
}

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  section: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 8,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  buttonSmall: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  buttonSecondary: { backgroundColor: colors.primarySoft },
  buttonDanger: { backgroundColor: colors.danger },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontSize: 14 },
  chipTextSelected: { color: '#fff', fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '600', color: colors.text },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  empty: { alignItems: 'center', padding: 32, gap: 6 },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
  emptyText: { fontSize: 15, color: colors.muted, textAlign: 'center' },
});
