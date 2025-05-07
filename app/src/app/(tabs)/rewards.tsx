import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import Header from "@/src/components/Header";

export default function RewardsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Rewards" subtitle="Check your rewards!" />
      <Text className="text-secondary">Rewards screen</Text>
    </SafeAreaView>
  );
}
