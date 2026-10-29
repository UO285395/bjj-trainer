import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { type Frame, lerpFrame } from '../skeleton/shapes';
import { colors } from '../theme';
import { FrameView } from './FrameView';

const STEP_MS = 1100;
const HOLD_MS = 600;

/** Muestra los fotogramas de una técnica, con paso a paso y animación. */
export function TechniqueViewer({ frames, width }: { frames: Frame[]; width: number }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [tween, setTween] = useState<Frame | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!playing || frames.length < 2) return;
    let start: number | null = null;
    let from = index;
    const tick = (now: number) => {
      start ??= now;
      const elapsed = now - start;
      if (elapsed < HOLD_MS) {
        setTween(null);
      } else {
        const t = Math.min(1, (elapsed - HOLD_MS) / STEP_MS);
        const to = (from + 1) % frames.length;
        const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        setTween(lerpFrame(frames[from], frames[to], eased));
        if (t >= 1) {
          from = to;
          setIndex(to);
          start = now;
        }
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
      setTween(null);
    };
    // Solo se reinicia al cambiar de modo o de técnica, no en cada paso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, frames]);

  const current = tween ?? frames[index];
  return (
    <View style={styles.wrap}>
      <View style={styles.canvas}>
        <FrameView frame={current} width={width} />
      </View>
      <View style={styles.bar}>
        <Text style={styles.caption} numberOfLines={1}>
          {frames[index]?.caption || `Paso ${index + 1}`}
        </Text>
        {frames.length > 1 && (
          <View style={styles.controls}>
            {frames.map((_, i) => (
              <Pressable
                key={i}
                accessibilityLabel={`Paso ${i + 1}`}
                onPress={() => {
                  setPlaying(false);
                  setIndex(i);
                }}
                hitSlop={8}
                style={[styles.dot, i === index && styles.dotActive]}
              />
            ))}
            <Pressable accessibilityRole="button" onPress={() => setPlaying((p) => !p)} style={styles.play}>
              <Text style={styles.playText}>{playing ? 'Pausa' : 'Animar'}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 10, overflow: 'hidden', backgroundColor: colors.mat },
  canvas: { alignItems: 'center' },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    gap: 8,
  },
  caption: { flex: 1, color: colors.text, fontSize: 14 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary },
  play: {
    marginLeft: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
  },
  playText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
});
