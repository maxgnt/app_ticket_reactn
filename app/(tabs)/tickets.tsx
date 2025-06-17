import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  const [ticketCount, setTicketCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicketCount = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'tickets'));
        setTicketCount(snapshot.size);
      } catch (error) {
        console.error('Erreur lors de la récupération des tickets :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketCount();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tableau de bord</Text>
        <Text style={styles.stat}>
          Nombre total de tickets : {ticketCount}
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  stat: { fontSize: 18 },
});
