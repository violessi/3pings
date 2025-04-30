import { Text, View, StyleSheet } from 'react-native';
import globalStyles from '../../assets/styles'; // Relative path to the styles.ts file

export default function RewardsScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text}>Rewards screen</Text>
    </View>
  );
}
