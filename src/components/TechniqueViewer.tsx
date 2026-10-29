import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FIGHTER_COLORS, type Frame, lerpFrame } from '../skeleton/shapes';
import { colors, fonts } from '../theme';
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
  const step = frames[index];
  const go = (i: number) => {
    setPlaying(false);
    setIndex(Math.max(0, Math.min(frames.length - 1, i)));
  };
  return (
    <View style={styles.wrap}>
      <View style={styles.canvas}>
        <FrameView frame={current} width={width} />
      </View>
      <View style={styles.panel}>
        {frames.length > 1 && (
          <View style={styles.controls}>
            <Text style={styles.stepLabel}>
              Paso {index + 1}/{frames.length}
            </Text>
            <View style={styles.dots}>
              {frames.map((_, i) => (
                <Pressable
                  key={i}
                  accessibilityLabel={`Paso ${i + 1}`}
                  onPress={() => go(i)}
                  hitSlop={8}
                  style={[styles.dot, i === index && styles.dotActive]}
                />
              ))}
            </View>
            <Pressable accessibilityLabel="Paso anterior" onPress={() => go(index - 1)} style={styles.nav}>
              <Text style={styles.navText}>‹</Text>
            </Pressable>
            <Pressable accessibilityLabel="Paso siguiente" onPress={() => go(index + 1)} style={styles.nav}>
              <Text style={styles.navText}>›</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => setPlaying((p) => !p)} style={styles.play}>
              <Text style={styles.playText}>{playing ? 'Pausa' : 'Animar'}</Text>
            </Pressable>
          </View>
        )}
        <Text style={styles.caption}>{step?.caption || `Paso ${index + 1}`}</Text>
        {!!step?.grips?.length && (
          <View style={styles.grips}>
            {step.grips.map((g, i) => (
              <View key={i} style={styles.grip}>
                <View style={[styles.gripDot, { borderColor: FIGHTER_COLORS[g.fighter].main }]} />
                <Text style={styles.gripText}>{g.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 10, overflow: 'hidden', backgroundColor: colors.mat },
  canvas: { alignItems: 'center' },
  panel: { backgroundColor: colors.surface, padding: 12, gap: 8 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepLabel: { fontFamily: fonts.display, fontSize: 18, color: colors.primary, letterSpacing: 0.4 },
  dots: { flex: 1, flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary },
  nav: {
    width: 32,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: { color: colors.text, fontSize: 20, lineHeight: 22 },
  caption: { color: colors.text, fontSize: 15, lineHeight: 21 },
  grips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  grip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.mat,
  },
  gripDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 2 },
  gripText: { color: colors.text, fontSize: 13 },
  play: {
    marginLeft: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
  },
  playText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
});
