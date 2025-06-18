import { db } from '@/firebase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TicketDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const fetchTicket = async () => {
    if (!id || typeof id !== 'string') return;

    const docRef = doc(db, 'tickets', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setTicket(data);
      setTitle(data.title || '');
      setDescription(data.description || '');
      setPriority(data.priority || '');
      setCategory(data.category || '');
      setStatus(data.status || '');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleSave = async () => {
    if (!id || typeof id !== 'string') return;

    try {
      await updateDoc(doc(db, 'tickets', id), {
        title,
        description,
        priority,
        category,
        status,
      });

      Alert.alert('Succès', 'Modifications enregistrées');
      router.replace('/(app)/tickets');
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(app)/tickets')}>
        <Text style={styles.backButtonText}> Retour aux tickets</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Titre</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Priorité</Text>
      <TextInput style={styles.input} value={priority} onChangeText={setPriority} />

      <Text style={styles.label}>Catégorie</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} />

      <Text style={styles.label}>Statut</Text>
      <View style={styles.statusContainer}>
        {[
          { label: 'Ouvert', value: 'open' },
          { label: 'En cours', value: 'in_progress' },
          { label: 'Résolu', value: 'resolved' },
          { label: 'Demande infos', value: 'info_required' },
        ].map((s) => (
          <TouchableOpacity
            key={s.value}
            style={[styles.statusButton, status === s.value && styles.statusButtonActive]}
            onPress={() => setStatus(s.value)}
          >
            <Text style={{ color: status === s.value ? 'white' : 'black' }}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
    paddingBottom: 60,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
  },
  backButton: {
    marginBottom: 10,
    marginTop: 60,
  },
  backButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  statusButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    marginTop: 20,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
