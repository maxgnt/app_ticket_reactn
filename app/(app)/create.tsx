// app/(app)/tickets/create.tsx

import { db } from '@/firebase';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function CreateTicketScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    if (!title || !description) {
      Alert.alert('Erreur', 'Merci de remplir tous les champs.');
      return;
    }

    try {
      await addDoc(collection(db, 'tickets'), {
        title,
        description,
        status: 'ouvert',
        createdAt: serverTimestamp(),
      });

      Alert.alert('Succès', 'Ticket créé avec succès.');
      router.replace('/tickets'); 
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Une erreur est survenue.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un ticket</Text>

      <TextInput
        placeholder="Titre"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
      />

      <Button title="Créer" onPress={handleCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  textArea: {
    height: 50,
    textAlignVertical: 'top',
  },
});
