import { db } from '@/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

interface Ticket {
  id: string;
  title: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export default function TicketsScreen() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

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

  const renderItem = ({ item }: { item: Ticket }) => (
    <View style={styles.card}>
      <View style={[styles.priorityIndicator, getPriorityStyle(item.priority)]} />
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.status}>Statut : {item.status}</Text>
        <Text style={styles.priority}>Priorité : {item.priority}</Text>
      </View>
    </View>
  );

  const getPriorityStyle = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low':
        return { backgroundColor: 'green' };
      case 'medium':
        return { backgroundColor: 'orange' };
      case 'high':
        return { backgroundColor: 'red' };
      case 'critical':
        return { backgroundColor: 'purple' };
      default:
        return { backgroundColor: 'grey' };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mes tickets</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ gap: 10 }}
        />
      )}
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
    gap: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  status: { fontSize: 14 },
  priority: { fontSize: 14 },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
});
