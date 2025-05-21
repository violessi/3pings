import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import globalStyles from "@/src/assets/styles";

type ReserveFormProps = {
  onReserve: () => void;
};

export default function ReserveForm({ onReserve }: ReserveFormProps) {

  return (
  <View style={styles.card}>
    <Text style={globalStyles.subtitle}>Reserve a Bike </Text>

    <Text style={globalStyles.detail}>
      Bikes are held for 15 minutes upon reservation.
      To claim your reserved bike, arrive at the rack and proceed to renting the bike within this period. 
    </Text>

    <TouchableOpacity style={styles.reserveButton} onPress={onReserve}>
      <Text style={styles.buttonText}>Reserve</Text>
    </TouchableOpacity>

    <Text style={globalStyles.note}>
      Note: Unclaimed bikes will be made available after the reservation period.
    </Text>
  </View>
  
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    elevation: 5,
  },
  reserveButton: {
    backgroundColor: '#362C5F',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  placeholderPicker: {
    backgroundColor: '#A9A9A9',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
});
