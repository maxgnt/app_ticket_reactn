import { auth, db } from '@/firebase';
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
  View
} from 'react-native';

export default function CreateTicket() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('hardware');
  const [status, setStatus] = useState('open');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Utilisateur non connecté');

      const deadlineDate = deadline ? Timestamp.fromDate(new Date(deadline)) : null;

      await addDoc(collection(db, 'tickets'), {
        title,
        description,
        priority,
        category,
        status,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        deadline: deadlineDate,
        updatedAt: serverTimestamp(),
      });

      router.replace('/(app)/tickets');
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  const renderOptions = (
    label: string,
    value: string,
    setter: (val: string) => void,
    options: { label: string; value: string }[],
    type: 'priority' | 'status' | 'default' = 'default'
  ) => {
    const getColor = (val: string) => {
      if (type === 'priority') {
        switch (val) {
          case 'low': return '#28a745';
          case 'medium': return '#ff9800';
          case 'high': return '#dc3545';
          case 'critical': return '#000';
        }
      } else if (type === 'status') {
        switch (val) {
          case 'open': return '#007AFF';
          case 'in_progress': return '#8e44ad';
          case 'done': return '#6c757d';
        }
      }
      return '#ccc';
    };

    return (
      <>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.buttonGroup}>
          {options.map((opt) => {
            const selected = value === opt.value;
            const bgColor = selected ? getColor(opt.value) : '#eee';
            const borderColor = selected ? getColor(opt.value) : '#ccc';
            const textColor = selected ? '#fff' : '#000';

            return (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.buttonOption,
                  {
                    backgroundColor: bgColor,
                    borderColor: borderColor,
                  },
                ]}
                onPress={() => setter(opt.value)}
              >
                <Text style={{ color: textColor, fontWeight: selected ? 'bold' : 'normal' }}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </>
    );
  };

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
        placeholder="Décrivez le problème/besoin"
        multiline
      />

      {renderOptions('Priorité', priority, setPriority, [
        { label: 'Basse', value: 'low' },
        { label: 'Moyenne', value: 'medium' },
        { label: 'Haute', value: 'high' },
        { label: 'Critique', value: 'critical' }
      ], 'priority')}

      {renderOptions('Catégorie', category, setCategory, [
        { label: 'Matériel', value: 'hardware' },
        { label: 'Logiciel', value: 'software' },
        { label: 'Réseau', value: 'network' },
        { label: 'Accès', value: 'access' },
        { label: 'Autre', value: 'other' }
      ])}

      {renderOptions('Statut', status, setStatus, [
        { label: 'Ouvert', value: 'open' },
        { label: 'En cours', value: 'in_progress' },
        { label: 'Terminé', value: 'done' }
      ], 'status')}

      <Text style={styles.label}>Deadline (AAAA-MM-JJ)</Text>
      <TextInput
        value={deadline}
        onChangeText={setDeadline}
        placeholder="2025-06-25"
        style={styles.input}
        keyboardType="numbers-and-punctuation"
      />

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
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
    marginTop: 4,
  },
  buttonOption: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
});
