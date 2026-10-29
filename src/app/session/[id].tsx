import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { TechniqueRow } from '../../components/TechniqueRow';
import { Button, Card, Intensity, SectionTitle } from '../../components/ui';
import { useAllTechniques } from '../../data/techniques';
import { deleteSession, getSession } from '../../db/repo';
import { useFocusData } from '../../hooks/useFocusData';
import { colors, fonts } from '../../theme';
import { confirmDestructive } from '../../utils/confirm';
import { formatDuration, formatShort } from '../../utils/dates';

export default function SessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { data: session, loaded, db } = useFocusData((db) => getSession(db, Number(id)), null, id);
  const { all } = useAllTechniques();

  useLayoutEffect(() => {
    if (session) navigation.setOptions({ title: formatShort(session.date) });
  }, [navigation, session]);

  if (!session) return loaded ? <Text style={styles.missing}>Este entreno ya no existe.</Text> : null;

  const techniques = session.techniqueIds
    .map((tid) => all.find((t) => t.id === tid))
    .filter((t) => t !== undefined);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card style={styles.summary}>
        <View style={{ gap: 4, flex: 1 }}>
          <Text style={styles.kind}>{session.kind}</Text>
          <Text style={styles.meta}>
            {formatDuration(session.durationMin)}
            {session.rounds ? ` · ${session.rounds} rounds` : ''}
          </Text>
        </View>
        <Intensity value={session.intensity} />
      </Card>
      {!!session.notes && (
        <>
          <SectionTitle>Notas</SectionTitle>
          <Card>
            <Text style={styles.notes}>{session.notes}</Text>
          </Card>
        </>
      )}
      <SectionTitle>Técnicas ({techniques.length})</SectionTitle>
      {techniques.length === 0 && <Text style={styles.meta}>No registraste técnicas en este entreno.</Text>}
      {techniques.map((t) => (
        <TechniqueRow key={t.id} technique={t} onPress={() => router.push(`/technique/${t.id}`)} />
      ))}
      <View style={{ gap: 10, marginTop: 12 }}>
        <Button
          title="Editar"
          variant="secondary"
          onPress={() => router.push({ pathname: '/session/edit', params: { id } })}
        />
        <Button
          title="Eliminar entreno"
          variant="danger"
          onPress={() =>
            confirmDestructive(
              'Eliminar entreno',
              'Se borrará este entreno y sus técnicas registradas.',
              async () => {
                await deleteSession(db, session.id);
                router.back();
              },
            )
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 10, paddingBottom: 48 },
  summary: { flexDirection: 'row', alignItems: 'center' },
  kind: { fontSize: 26, fontFamily: fonts.display, color: colors.text, textTransform: 'uppercase' },
  meta: { fontSize: 15, color: colors.muted },
  notes: { fontSize: 15, color: colors.text, lineHeight: 21 },
  missing: { padding: 24, color: colors.muted, textAlign: 'center' },
});
