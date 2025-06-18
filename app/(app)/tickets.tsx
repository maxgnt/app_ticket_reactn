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
  priority: 'low' | 'medium' | 'high' | 'critical';
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

  const getPriorityStyle = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low':
        
      case 'medium':
        
      case 'high':
        
      case 'critical':
        
      default:
        
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'open':
        
      case 'in_progress':
        
      case 'done':
        
      case 'info_required':
        
      default:
        
    }
  };

  const renderItem = ({ item }: { item: Ticket }) => (
    <TouchableOpacity onPress={() => router.push(`/tickets/${item.id}`)}>
      <View style={styles.card}>
        <View style={[styles.priorityIndicator]} />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>
          <Text>Catégorie : {item.category}</Text>
          <Text>Priorité : <Text style={[styles.badge]}>{item.priority}</Text></Text>
          <Text>Statut : <Text style={[styles.badge]}>{item.status}</Text></Text>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 10,
    gap: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  badge: {
    
   
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 4,
    fontSize: 12,
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
