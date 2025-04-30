import { Text, View , StyleSheet } from "react-native";
import { Link } from 'expo-router';

import globalStyles from '@/assets/styles';

export default function Index() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text}>Map and racks</Text>
    </View>
  );
}