import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import { View } from 'react-native';

import { Logo } from '../../components/Logo';
import { colors, fonts } from '../../theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.text, fontFamily: fonts.display, fontSize: 28, letterSpacing: 0.5 },
        headerTitleAlign: 'left',
        sceneStyle: { backgroundColor: colors.bg },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fonts.displaySemi, fontSize: 13, lineHeight: 16, letterSpacing: 0.4 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Entrenos',
          headerRight: () => (
            <View style={{ marginRight: 16 }}>
              <Logo size={58} />
            </View>
          ),
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
