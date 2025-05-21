import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import globalStyles from "@/src/assets/styles";

// fields and style of rack status card 
// displayed in rack details page

type RackStatProps = {
  location: string;
  available: number;
  reserved: number;
  empty: number;
};

export default function RackStatus({
    location,
    available,
    reserved,
    empty,
}: RackStatProps) {
  return (
    <View style={styles.card}>
      <View style={globalStyles.row}>
        <View style={globalStyles.column}>
          <View style={styles.valueContainerGreen}>
            <Text style={styles.valueText}>{available}</Text>
          </View>
          <Text style={styles.detail}>Available</Text>
        </View>

        <View style={globalStyles.column}>
          <View style={styles.valueContainerGray}>
            <Text style={styles.valueText}>{empty}</Text>
          </View>
          <Text style={styles.detail}>Empty Slots</Text>
        </View>

        <View style={globalStyles.column}>
          <View style={styles.valueContainerOrange}>
            <Text style={styles.valueText}>{reserved}</Text>
          </View>
          <Text style={styles.detail}>Reserved</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 15,
    marginBottom: 15,
    width: '100%',
    elevation: 5, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  detail: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },

  valueContainerGreen: {
    backgroundColor: '#2C452B',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },

  valueContainerOrange: {
    backgroundColor: '#CC883A',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },

  valueContainerGray: {
    backgroundColor: '#CDCDCD',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },

  valueText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});