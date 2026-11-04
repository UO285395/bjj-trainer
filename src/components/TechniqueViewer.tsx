import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FIGHTER_COLORS, type Frame, frameDistance, lerpFrame } from '../skeleton/shapes';
import { colors, fonts } from '../theme';
import { FrameView } from './FrameView';

/** Pausa en cada paso para leerlo, y más larga al acabar antes de volver al inicio. */
const HOLD_MS = 450;
const END_HOLD_MS = 1600;
/** El paso dura más cuanto más se mueven los cuerpos, dentro de estos límites. */
const MIN_STEP_MS = 650;
const MAX_STEP_MS = 1500;
const BASE_MS = 450;
const MS_PER_PX = 22;

const stepMs = (a: Frame, b: Frame) =>
  Math.max(MIN_STEP_MS, Math.min(MAX_STEP_MS, BASE_MS + frameDistance(a, b) * MS_PER_PX));

/** Arranca y frena suave (seno), sin el tirón a mitad de una curva cuadrática. */
const ease = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;

/** Muestra los fotogramas de una técnica, con paso a paso y animación. */
export function TechniqueViewer({ frames, width }: { frames: Frame[]; width: number }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [tween, setTween] = useState<Frame | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!playing || frames.length < 2) return;
    const last = frames.length - 1;
    const durations = frames.slice(0, -1).map((f, i) => stepMs(f, frames[i + 1]!));
    let start: number | null = null;
    let from = index;
    const tick = (now: number) => {
      start ??= now;
      const elapsed = now - start;
      const hold = from === last ? END_HOLD_MS : HOLD_MS;
      if (elapsed < hold) {
        setTween(null);
      } else if (from === last) {
        // Al acabar se vuelve al primer paso de golpe, sin rebobinar la técnica.
        from = 0;
        setIndex(0);
        start = now;
      } else {
        const t = Math.min(1, (elapsed - hold) / durations[from]!);
        const to = from + 1;
        setTween(lerpFrame(frames[from]!, frames[to]!, ease(t), frames[from - 1], frames[to + 1]));
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
                <View style={[styles.gripDot, { backgroundColor: FIGHTER_COLORS[g.fighter].main }]}>
                  <Text style={styles.gripNum}>{i + 1}</Text>
                </View>
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
  gripDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gripNum: { color: colors.onPrimary, fontSize: 10, fontWeight: '700' },
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
