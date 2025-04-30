import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type TripCardProps = {
  title: string;
  bikeID: string;
  tripStart: string;
  tripEnd: string;
  remarks: string;
};

export default function TripCard({
  title,
  bikeID,
  tripStart,
  tripEnd,
  remarks,
}: TripCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.detail}>
        <Text style={styles.label}>Bike ID: </Text>
        {bikeID}
      </Text>
      <Text style={styles.detail}>
        <Text style={styles.label}>Trip Start: </Text>
        {tripStart}
      </Text>
      <Text style={styles.detail}>
        <Text style={styles.label}>Trip End: </Text>
        {tripEnd}
      </Text>
      <Text style={styles.detail}>
        <Text style={styles.label}>Remarks: </Text>
        {remarks}
      </Text>
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
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
});