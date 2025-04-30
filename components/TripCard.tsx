// TripCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Define the type for props so that it can receive data from the parent screen
type TripCardProps = {
  title: string;
  duration: string;
  distance: string;
  difficulty: string;
};

export default function TripCard({
  title,
  duration,
  distance,
  difficulty,
}: TripCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.detail}>Duration: {duration}</Text>
      <Text style={styles.detail}>Distance: {distance}</Text>
      <Text style={styles.detail}>Difficulty: {difficulty}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  detail: {
    fontSize: 16,
    color: '#555',
  },
});