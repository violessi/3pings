import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function App() {
  const [bikeId, setBikeId] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [message, setMessage] = useState('');

  const updateBikeStatus = async () => {
    try {
      const bikeRef = doc(db, 'bikes', bikeId);
      const bikeSnap = await getDoc(bikeRef);

      if (bikeSnap.exists()) {
        await updateDoc(bikeRef, { status: newStatus });
        setMessage(`Bike "${bikeId}" status updated to "${newStatus}"`);
      } else {
        setMessage(`Bike "${bikeId}" not found`);
      }
    } catch (error) {
      console.error('Error updating bike status:', error);
      setMessage('Failed to update bike');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Bike ID"
        value={bikeId}
        onChangeText={setBikeId}
        style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
      />
      <TextInput
        placeholder="New Status (e.g., reserved)"
        value={newStatus}
        onChangeText={setNewStatus}
        style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
      />
      <Button title="Update Bike Status" onPress={updateBikeStatus} />
      {message ? <Text style={{ marginTop: 20 }}>{message}</Text> : null}
    </View>
  );
}
