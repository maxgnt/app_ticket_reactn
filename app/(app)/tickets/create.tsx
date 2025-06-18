import { auth, db } from '@/firebase';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CreateTicket() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('Matériel');
  const [status, setStatus] = useState('open');
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Utilisateur non connecté');

      const deadlineTimestamp = deadlineDate ? Timestamp.fromDate(deadlineDate) : null;

      await addDoc(collection(db, 'tickets'), {
        title,
        description,
        priority,
        category,
        status,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        deadline: deadlineTimestamp,
      });

      router.replace('/(app)/tickets');
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  const getPriorityColor = (value: string) => {
    switch (value) {
      case 'low':
        return { backgroundColor: '#3DC145', borderColor: '#3DC145' };
      case 'medium':
        return { backgroundColor: '#FFAC05', borderColor: '#FFAC05' };
      case 'high':
        return { backgroundColor: '#FC2D00', borderColor: '#FC2D00' };
      default:
        return {};
    }
  };

  const renderOptions = (
    label: string,
    value: string,
    setter: (val: string) => void,
    options: { label: string; value: string }[],
    isPriority = false
  ) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.buttonGroup}>
        {options.map((opt) => {
          const selected = value === opt.value;
          const customStyle = isPriority && selected ? getPriorityColor(opt.value) : {};
          return (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.buttonOption,
                selected && styles.selectedButton,
                selected && customStyle,
              ]}
              onPress={() => setter(opt.value)}
            >
              <Text style={selected ? styles.selectedText : styles.optionText}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer un ticket</Text>

      <Text style={styles.label}>Titre</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholder="Ex : Problème imprimante"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 100 }]}
        placeholder="Décrivez le problème ou la demande"
        multiline
      />

      {renderOptions(
        'Priorité',
        priority,
        setPriority,
        [
          { label: 'Basse', value: 'low' },
          { label: 'Moyenne', value: 'medium' },
          { label: 'Haute', value: 'high' },
        ],
        true
      )}

      {renderOptions('Catégorie', category, setCategory, [
        { label: 'Matériel', value: 'Matériel' },
        { label: 'Logiciel', value: 'Logiciel' },
        { label: 'Réseau', value: 'Réseau' },
        { label: 'Accès', value: 'Accès' },
        { label: 'Autre', value: 'Autre' },
      ])}

      {renderOptions('Statut', status, setStatus, [
        { label: 'Ouvert', value: 'open' },
        { label: 'En cours', value: 'in_progress' },
        { label: 'Terminé', value: 'done' },
      ])}

      <Text style={styles.label}>Deadline</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={[styles.input, styles.deadlineInput]}
      >
        <Text style={{ color: deadlineDate ? '#000' : '#888' }}>
          {deadlineDate ? deadlineDate.toISOString().split('T')[0] : 'Choisir une date'}
        </Text>
        <Ionicons name="calendar" size={20} color="#555" />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={deadlineDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDeadlineDate(selectedDate);
            }
          }}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Créer le ticket" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: Platform.OS === 'ios' ? 12 : 8,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  deadlineInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
    marginTop: 4,
  },
  buttonOption: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
  },
  selectedButton: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  optionText: {
    color: '#333',
  },
  selectedText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
