import { db } from '@/firebase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
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

  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newComment, setNewComment] = useState('');

  const fetchTicket = async () => {
    if (!id || typeof id !== 'string') return;

    const docRef = doc(db, 'tickets', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...docSnap.data() };
      setTicket(data);
      setSelectedStatus(data.status);
      setSelectedPriority(data.priority);
      setSelectedCategory(data.category);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleSave = async () => {
    if (!ticket || !id || typeof id !== 'string') return;

    try {
      await updateDoc(doc(db, 'tickets', id), {
        status: selectedStatus,
        priority: selectedPriority,
        category: selectedCategory,
      });
      Alert.alert('Succès', 'Ticket mis à jour');
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !id || typeof id !== 'string') return;

    try {
      await updateDoc(doc(db, 'tickets', id), {
        comments: arrayUnion({ text: newComment, createdAt: new Date().toISOString() }),
      });
      setNewComment('');
      fetchTicket();
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  const renderOptionGroup = (
    label: string,
    selectedValue: string,
    setValue: (val: string) => void,
    options: { label: string; value: string; color?: string }[]
  ) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.statusContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.statusButton,
              selectedValue === option.value && {
                ...styles.statusButtonActive,
                backgroundColor: option.color || '#007AFF',
                borderColor: option.color || '#007AFF',
              },
            ]}
            onPress={() => setValue(option.value)}
          >
            <Text
              style={{
                color: selectedValue === option.value ? 'white' : 'black',
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={styles.center}>
        <Text>Ticket introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(app)/tickets')}>
        <Text style={styles.backButtonText}>← Retour aux tickets</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Titre</Text>
      <TextInput style={styles.input} value={ticket.title} editable={false} />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={ticket.description}
        editable={false}
      />

      {renderOptionGroup('Priorité', selectedPriority, setSelectedPriority, [
        { label: 'Basse', value: 'low', color: '#3DC145' },
        { label: 'Moyenne', value: 'medium', color: '#FFAC05' },
        { label: 'Haute', value: 'high', color: '#FC2D00' },
        
      ])}

      {renderOptionGroup('Catégorie', selectedCategory, setSelectedCategory, [
        { label: 'Matériel', value: 'Matériel' },
        { label: 'Logiciel', value: 'Logiciel' },
        { label: 'Réseau', value: 'Réseau' },
        { label: 'Accès', value: 'Accès' },
        { label: 'Autre', value: 'Autre' },
      ])}

      {renderOptionGroup('Statut', selectedStatus, setSelectedStatus, [
        { label: 'Ouvert', value: 'Ouvert' },
        { label: 'En cours', value: 'En cours' },
        { label: 'Résolu', value: 'Résolu' },
        { label: 'Demande infos', value: 'Demande infos' },
      ])}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
      </TouchableOpacity>

      <Text style={[styles.label, { marginTop: 20 }]}>Commentaires</Text>
      {ticket.comments?.map((comment: any, idx: number) => (
        <View key={idx} style={styles.comment}>
          <Text>{comment.text}</Text>
          <Text style={styles.commentDate}>{new Date(comment.createdAt).toLocaleString()}</Text>
        </View>
      ))}
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Ajouter un commentaire"
        value={newComment}
        onChangeText={setNewComment}
        multiline
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleAddComment}>
        <Text style={styles.saveButtonText}>Ajouter le commentaire</Text>
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
  comment: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  commentDate: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
});
