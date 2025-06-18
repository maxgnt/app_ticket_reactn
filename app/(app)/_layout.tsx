import { auth } from '@/firebase';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Button } from 'react-native';

export default function TabLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  return (
    <Tabs
      screenOptions={{
        title: '', 
        headerRight: () => (
          <Button title="Déconnexion" onPress={handleLogout} />
        ),
      }}
    >
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Tickets',
          tabBarLabel: 'Tickets',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets/create"
        options={{
          title: 'Créer un ticket',
          tabBarLabel: 'Créer',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
