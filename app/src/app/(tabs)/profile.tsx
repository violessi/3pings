import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import Header from "@/src/components/Header";

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Profile" subtitle="Check your profile!" />
      <Text className="text-secondary">Profile screen</Text>
    </SafeAreaView>
  );
}
