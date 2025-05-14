import { useState } from "react";
import { SafeAreaView, View, Text, Alert } from "react-native";
import { useRouter } from "expo-router";

import Header from "@/components/Header";
import Button from "@/components/Button";
import RackInput from "@/components/RackInput";
import { useBike } from "@/context/BikeContext";

export default function Rent() {
  const router = useRouter();
  const { rackId, updateRackId, rentABike } = useBike();

  const handleButtonPress = async () => {
    try {
      // move to context
      const res = await rentABike();
    } catch (err: any) {
      Alert.alert("Error: ", err.message);
    }
  };

  const handleBack = () => {
    router.replace("/(tabs)/action");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header
        title="Rent a bike"
        subtitle="Select a bike to rent"
        hasBack={true}
        prevCallback={handleBack}
      />
      <View className="flex-1 justify-start gap-4 p-5">
        <Text className="text-secondary text-3xl font-semibold">
          Easily rent a bike by entering the bike rack code.
        </Text>
        <RackInput rackCode={rackId} updateRackCode={updateRackId} />
        <Button
          label="Check Availability"
          onPress={() => {
            handleButtonPress();
          }}
          disabled={rackId ? false : true}
        />
      </View>
    </SafeAreaView>
  );
}
