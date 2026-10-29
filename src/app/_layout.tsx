import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';

import { DATABASE_NAME, migrate } from '../db/database';
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrate}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerShadowVisible: false,
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text },
          contentStyle: { backgroundColor: colors.bg },
          headerBackTitle: 'Atrás',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="session/edit" options={{ title: 'Entreno', presentation: 'modal' }} />
        <Stack.Screen name="session/[id]" options={{ title: 'Entreno' }} />
        <Stack.Screen name="technique/[id]" options={{ title: '' }} />
        <Stack.Screen name="technique/edit" options={{ title: 'Técnica propia' }} />
      </Stack>
    </SQLiteProvider>
  );
}
