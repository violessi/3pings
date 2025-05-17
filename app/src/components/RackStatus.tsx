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
        <Text style={styles.detail}>
            <Text style={styles.availValue}> {available} </Text>
            Available
          </Text>
        </View>

        <View style={globalStyles.column}>
          <Text style={styles.detail}>
            <Text style={styles.emptyValue}> {empty} </Text>
            Empty Slots
          </Text>
        </View>

        <View style={globalStyles.column}>
          <Text style={styles.detail}>
            <Text style={styles.reservedValue}> {reserved} </Text>
            Reserved
          </Text>
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
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    elevation: 5,
  },
  detail: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#555',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#29243F',
  },
  availValue: {
    backgroundColor: '#2C452B',
    borderRadius: 4,
    padding: 2,
    marginBottom: 20,
    marginRight: 6,
    fontSize: 12,
    color: '#fff',
    textAlignVertical: 'center'
  },
  reservedValue: {
    backgroundColor: '#CC883A',
    borderRadius: 4,
    padding: 2,
    marginBottom: 20,
    marginRight: 6,
    fontSize: 12,
    color: '#fff',
    textAlignVertical: 'center'
  },
  emptyValue: {
    backgroundColor: '#CDCDCD',
    borderRadius: 4,
    padding: 2,
    marginBottom: 20,
    marginRight: 6,
    fontSize: 12,
    color: '#fff',
    textAlignVertical: 'center'
  },
});