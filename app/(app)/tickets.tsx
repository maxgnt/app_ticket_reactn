import { db } from '@/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Ticket {
  id: string;
  title: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export default function TicketsScreen() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tickets'), (snapshot) => {
      const data: Ticket[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Ticket[];
      setTickets(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getPriorityLabel = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low':
        return 'Basse';
      case 'medium':
        return 'Moyenne';
      case 'high':
        return 'Haute';
      default:
        return priority;
    }
  };

  const getCardStyle = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low':
        return { backgroundColor: '#3DC145' }; // vert
      case 'medium':
        return { backgroundColor: '#FFAC05' }; // orange
      case 'high':
        return { backgroundColor: '#FC2D00' }; // rouge
      default:
        return { backgroundColor: '#f2f2f2' };
    }
  };

  const getTextColor = (priority: Ticket['priority']) => {
    return priority === 'high' ? { color: 'white' } : { color: 'black' };
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Ouvert';
      case 'in_progress':
        return 'En cours';
      case 'done':
        return 'Terminé';
      case 'info_required':
        return 'Demande infos';
      default:
        return status;
    }
  };

  const renderItem = ({ item }: { item: Ticket }) => (
    <TouchableOpacity onPress={() => router.push(`/tickets/${item.id}`)}>
      <View style={[styles.card, getCardStyle(item.priority)]}>
        <View style={styles.cardContent}>
          <Text style={[styles.title, getTextColor(item.priority)]}>{item.title}</Text>
          <Text style={getTextColor(item.priority)}>Catégorie : {item.category}</Text>
          <Text style={getTextColor(item.priority)}>
            Priorité : <Text style={styles.bold}>{getPriorityLabel(item.priority)}</Text>
          </Text>
          <Text style={getTextColor(item.priority)}>
            Statut : <Text style={styles.bold}>{getStatusLabel(item.status)}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Liste des tickets</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/(app)/tickets/create')}
      >
        <Ionicons name="add" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
