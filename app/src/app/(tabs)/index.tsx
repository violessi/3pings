import { SafeAreaView, Text, View } from "react-native";

import globalStyles from "@/src/assets/styles";
import Header from "@/src/components/Header";

export default function Index() {
  return (
    <SafeAreaView className="flex-1">
      <Header title="Map" subtitle="Check the bike racks near you!" />
    </SafeAreaView>
  );
}
