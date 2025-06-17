import { auth } from '@/firebase';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Button } from 'react-native';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/Login');
    } catch (error: any) {
      console.error('Erreur de déconnexion :', error);
    }
  };

  return <Button title="Déconnexion" onPress={handleLogout} />;
}
