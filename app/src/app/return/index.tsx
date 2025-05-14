import { SafeAreaView, View } from "react-native";
import { useRouter } from "expo-router";
import Header from "@/src/components/Header";

export default function Return() {
  const router = useRouter();
  const handleBack = () => {
    router.replace("/(tabs)/action");
  };
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-background">
        <Header
          title="Return a bike"
          subtitle="Select a bike to Return"
          hasBack={true}
          prevCallback={handleBack}
        />
        <View className="flex-1 justify-start gap-1 p-5">
          {/* Add your bike selection options here */}
        </View>
      </View>
    </SafeAreaView>
  );
}
