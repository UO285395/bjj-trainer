import { router } from 'expo-router';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Empty, Intensity } from '../../components/ui';
import { useAllTechniques } from '../../data/techniques';
import { listSessions, type Session } from '../../db/repo';
import { useFocusData } from '../../hooks/useFocusData';
import { colors, fonts } from '../../theme';
import { formatDuration, formatRelative, monthLabel, today } from '../../utils/dates';

function groupByMonth(sessions: Session[]) {
  const groups = new Map<string, Session[]>();
  for (const s of sessions) {
    const key = s.date.slice(0, 7);
    groups.set(key, [...(groups.get(key) ?? []), s]);
  }
  return [...groups.entries()].map(([key, data]) => ({
    key,
    title: monthLabel(`${key}-01`),
    minutes: data.reduce((a, s) => a + s.durationMin, 0),
    data,
  }));
}

export default function SessionsScreen() {
  const { data: sessions, loaded } = useFocusData(listSessions, []);
  const { all } = useAllTechniques();
  const names = new Map(all.map((t) => [t.id, t.name]));
  const sections = groupByMonth(sessions);
  const thisMonth = sessions.filter((s) => s.date.startsWith(today().slice(0, 7)));

  return (
    <SectionList
      sections={sections}
      keyExtractor={(s) => String(s.id)}
      contentContainerStyle={styles.content}
      stickySectionHeadersEnabled={false}
      ListHeaderComponent={
        <View style={{ gap: 12 }}>
          <View style={styles.stats}>
            <Stat value={thisMonth.length} label="este mes" />
            <Stat
              value={formatDuration(thisMonth.reduce((a, s) => a + s.durationMin, 0))}
              label="en el tapiz"
            />
            <Stat value={sessions.length} label="en total" />
          </View>
          <Button title="Registrar entreno" onPress={() => router.push('/session/edit')} />
        </View>
      }
      ListEmptyComponent={
        loaded ? (
          <Empty
            title="Aún no hay entrenos"
            text="Registra tu primera clase para empezar a ver tu progreso."
          />
        ) : undefined
      }
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionMeta}>
            {section.data.length} · {formatDuration(section.minutes)}
          </Text>
        </View>
      )}
      renderItem={({ item }) => <SessionRow session={item} names={names} />}
    />
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <Card style={styles.stat}>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function SessionRow({ session, names: nameMap }: { session: Session; names: Map<string, string> }) {
  const names = session.techniqueIds
    .map((id) => nameMap.get(id))
    .filter(Boolean)
    .slice(0, 3)
    .join(', ');
  return (
    <Pressable onPress={() => router.push(`/session/${session.id}`)}>
      <Card style={styles.row}>
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={styles.rowTitle}>
            {formatRelative(session.date)} · {session.kind}
          </Text>
          <Text style={styles.rowMeta}>
            {formatDuration(session.durationMin)}
            {session.rounds ? ` · ${session.rounds} rounds` : ''}
            {session.techniqueIds.length ? ` · ${session.techniqueIds.length} técnicas` : ''}
          </Text>
          {!!names && (
            <Text style={styles.rowTechniques} numberOfLines={1}>
              {names}
            </Text>
          )}
        </View>
        <Intensity value={session.intensity} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 10, paddingBottom: 40 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  statValue: { fontSize: 24, fontFamily: fonts.display, color: colors.primary },
  statLabel: { fontSize: 13, color: colors.muted, marginTop: 2 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 14,
    marginBottom: 2,
  },
  sectionTitle: { fontSize: 20, fontFamily: fonts.display, color: colors.text, textTransform: 'uppercase' },
  sectionMeta: { fontSize: 13, color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  rowMeta: { fontSize: 14, color: colors.muted },
  rowTechniques: { fontSize: 14, color: colors.secondary },
});
