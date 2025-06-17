import { auth } from '@/firebase';
import { Tabs, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Button } from 'react-native';

export default function TabLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/Login');
  };

  return (
    <Tabs
      screenOptions={{
        headerRight: () => (
          <Button title="Déconnexion" onPress={handleLogout} />
        ),
      }}
    />
  );
}
