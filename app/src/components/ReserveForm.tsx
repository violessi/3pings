import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import globalStyles from "@/src/assets/styles";

type ReserveFormProps = {
  onReserve: () => void;
};

export default function ReserveForm({ onReserve }: ReserveFormProps) {
  const now = new Date();

  const formattedDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
  <View style={styles.card}>
    <Text style={globalStyles.subtitle}> Reserve a Bike </Text>

    <View style={globalStyles.row}>
      <View style={globalStyles.column}> 
        <Text style={globalStyles.detail}> Date </Text>
        <Text style={[styles.placeholderPicker, styles.buttonText]}> Date Today </Text>
      </View>

      <View style={globalStyles.column}> 
        <Text style={globalStyles.detail}> Start Time </Text>
        <Text style={[styles.placeholderPicker, styles.buttonText]}> Time Right Now </Text>
      </View>
    </View>

    <TouchableOpacity style={styles.reserveButton} onPress={onReserve}>
      <Text style={styles.buttonText}>Reserve</Text>
    </TouchableOpacity>

    <Text style={globalStyles.note}>
      Note: Your reservation will only hold for 15 mins!
      Bike will automatically be reverted to Available if not claimed.
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
