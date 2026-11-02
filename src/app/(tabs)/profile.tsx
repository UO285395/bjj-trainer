import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, Chip, SectionTitle } from '../../components/ui';
import { CATEGORIES, CATEGORY_LABELS } from '../../data/catalog';
import { useAllTechniques } from '../../data/techniques';
import { getSetting, listSessions, setSetting, techniqueUsage } from '../../db/repo';
import { useFocusData } from '../../hooks/useFocusData';
import { BELTS, type BeltId, colors, fonts } from '../../theme';
import { addDays, formatDuration, parseISODate, toISODate, today } from '../../utils/dates';

const WEEKS = 8;

/** Lunes de la semana de una fecha. */
const weekStart = (iso: string) => {
  const d = parseISODate(iso);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return toISODate(d);
};

export default function ProgressScreen() {
  const { all } = useAllTechniques();
  const { data, reload, db } = useFocusData(
    async (db) => ({
      belt: ((await getSetting(db, 'belt')) ?? 'blanco') as BeltId,
      stripes: Number((await getSetting(db, 'stripes')) ?? 0),
      sessions: await listSessions(db),
      usage: await techniqueUsage(db),
    }),
    null,
  );
  if (!data) return null;
  const { belt, stripes, sessions, usage } = data;
  const beltInfo = BELTS.find((b) => b.id === belt) ?? BELTS[0];

  const update = async (key: string, value: string) => {
    await setSetting(db, key, value);
    reload();
  };

  // Entrenos por semana en las últimas WEEKS semanas.
  const thisWeek = weekStart(today());
  const weeks = Array.from({ length: WEEKS }, (_, i) => addDays(thisWeek, -7 * (WEEKS - 1 - i)));
  const perWeek = weeks.map((w) => sessions.filter((s) => weekStart(s.date) === w).length);
  const maxWeek = Math.max(1, ...perWeek);

  const names = new Map(all.map((t) => [t.id, t]));
  const top = [...usage.entries()]
    .filter(([id]) => names.has(id))
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);
  const byCategory = CATEGORIES.map((c) => ({
    c,
    practiced: all.filter((t) => t.category === c && usage.has(t.id)).length,
    total: all.filter((t) => t.category === c).length,
  }));
  const minutes = sessions.reduce((a, s) => a + s.durationMin, 0);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card style={{ gap: 12 }}>
        <View style={styles.belt}>
          <View style={[styles.beltBody, { backgroundColor: beltInfo.color }]} />
          <View style={[styles.beltTip, { backgroundColor: beltInfo.tip }]}>
            {Array.from({ length: stripes }, (_, i) => (
              <View key={i} style={styles.stripe} />
            ))}
          </View>
        </View>
        <Text style={styles.beltLabel}>
          Cinturón {beltInfo.label.toLowerCase()}
          {stripes ? ` · ${stripes} ${stripes === 1 ? 'grado' : 'grados'}` : ''}
        </Text>
        <View style={styles.wrap}>
          {BELTS.map((b) => (
            <Chip key={b.id} label={b.label} selected={belt === b.id} onPress={() => update('belt', b.id)} />
          ))}
        </View>
        <View style={styles.wrap}>
          {[0, 1, 2, 3, 4].map((n) => (
            <Chip
              key={n}
              label={`${n} gr.`}
              selected={stripes === n}
              onPress={() => update('stripes', String(n))}
            />
          ))}
        </View>
      </Card>

      <View style={styles.stats}>
        <Card style={styles.stat}>
          <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
            {sessions.length}
          </Text>
          <Text style={styles.statLabel}>entrenos</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
            {formatDuration(minutes)}
          </Text>
          <Text style={styles.statLabel}>en el tapiz</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
            {usage.size}
          </Text>
          <Text style={styles.statLabel}>técnicas</Text>
        </Card>
      </View>

      <SectionTitle>Últimas {WEEKS} semanas</SectionTitle>
      <Card style={styles.chart}>
        {perWeek.map((n, i) => (
          <View key={weeks[i]} style={styles.barCol}>
            <Text style={styles.barValue}>{n || ''}</Text>
            <View
              style={[styles.bar, { height: 4 + (n / maxWeek) * 80, opacity: i === WEEKS - 1 ? 1 : 0.7 }]}
            />
          </View>
        ))}
      </Card>

      <SectionTitle>Más practicadas</SectionTitle>
      <Card style={{ gap: 8 }}>
        {top.length === 0 && (
          <Text style={styles.muted}>Registra técnicas en tus entrenos para verlas aquí.</Text>
        )}
        {top.map(([id, u]) => (
          <View key={id} style={styles.topRow}>
            <Text style={styles.topName} numberOfLines={1}>
              {names.get(id)?.name}
            </Text>
            <Text style={styles.muted}>{u.count}×</Text>
          </View>
        ))}
      </Card>

      <SectionTitle>Repertorio por categoría</SectionTitle>
      <Card style={{ gap: 10 }}>
        {byCategory.map(({ c, practiced, total }) => (
          <View key={c} style={{ gap: 4 }}>
            <View style={styles.topRow}>
              <Text style={styles.topName}>{CATEGORY_LABELS[c]}</Text>
              <Text style={styles.muted}>
                {practiced}/{total}
              </Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${total ? (practiced / total) * 100 : 0}%` }]} />
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 10, paddingBottom: 40 },
  belt: {
    flexDirection: 'row',
    height: 26,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  beltBody: { flex: 1 },
  beltTip: { width: 70, flexDirection: 'row', justifyContent: 'flex-end', gap: 5, paddingRight: 8 },
  stripe: { width: 5, backgroundColor: '#F1EEE6' },
  beltLabel: { fontSize: 24, fontFamily: fonts.display, color: colors.text, textTransform: 'uppercase' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  statValue: { fontSize: 24, fontFamily: fonts.display, color: colors.primary },
  statLabel: { fontSize: 13, color: colors.muted, marginTop: 2 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 130 },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  bar: { width: '100%', borderRadius: 4, backgroundColor: colors.primary },
  barValue: { fontSize: 12, color: colors.muted },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  topName: { flex: 1, fontSize: 15, color: colors.text },
  muted: { fontSize: 14, color: colors.muted },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.mat, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: colors.secondary },
});
