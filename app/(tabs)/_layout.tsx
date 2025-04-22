import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          position: 'absolute',
          marginHorizontal: 20,
          marginBottom: Platform.OS === 'android' ? 15 : 35,
          borderRadius: 20,
          backgroundColor: '#fff',
          elevation: 5, // Android shadow
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 5 },
          shadowRadius: 10,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Kartlar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: 'Tekrar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="refresh" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
