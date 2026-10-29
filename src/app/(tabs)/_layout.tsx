import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';

import { colors } from '../../theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.text, fontSize: 20, fontWeight: '700' },
        sceneStyle: { backgroundColor: colors.bg },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Entrenos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="techniques"
        options={{
          title: 'Técnicas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="body-outline" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ribbon-outline" color={color as string} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
