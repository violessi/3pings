import { SafeAreaView, View, Text } from "react-native";
import { useRouter } from "expo-router";

import Button from "@/src/components/Button";
import Header from "@/src/components/Header";
import RackInput from "@/src/components/RackInput";

import { useBike } from "@/src/context/BikeContext";

export default function Return() {
  const router = useRouter();
  const { rackId, updateRackId } = useBike();
  const handleBack = () => {
    router.replace("/(tabs)/action");
  };
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-background">
        <Header
          title="Return a bike"
          hasBack={true}
          prevCallback={handleBack}
        />
        <View className="flex-1 justify-start gap-4 p-5">
          <Text className="text-secondary text-3xl font-semibold">
            Enter your preferred bike rack's code.
          </Text>
          <RackInput rackCode={rackId} updateRackCode={updateRackId} />
          <Button
            label="Check Availability"
            onPress={() => {}}
            disabled={rackId ? false : true}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
