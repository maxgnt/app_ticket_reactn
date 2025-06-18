// app/(app)/tickets/create.tsx

import { auth, db } from '@/firebase';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function CreateTicket() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('hardware');
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Utilisateur non connecté');

      await addDoc(collection(db, 'tickets'), {
        title,
        description,
        priority,
        category,
        status: 'new',
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      router.replace('/(app)/tickets');
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Titre</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />

      <Text style={styles.label}>Description</Text>
      <TextInput value={description} onChangeText={setDescription} style={styles.input} multiline />

      <Text style={styles.label}>Priorité</Text>
      <Picker selectedValue={priority} onValueChange={setPriority} style={styles.input}>
        <Picker.Item label="Basse" value="low" />
        <Picker.Item label="Moyenne" value="medium" />
        <Picker.Item label="Haute" value="high" />
        <Picker.Item label="Critique" value="critical" />
      </Picker>

      <Text style={styles.label}>Catégorie</Text>
      <Picker selectedValue={category} onValueChange={setCategory} style={styles.input}>
        <Picker.Item label="Matériel" value="hardware" />
        <Picker.Item label="Logiciel" value="software" />
        <Picker.Item label="Réseau" value="network" />
        <Picker.Item label="Accès" value="access" />
        <Picker.Item label="Autre" value="other" />
      </Picker>

      <Button title="Créer le ticket" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: 'bold', marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, marginBottom: 10 },
});
