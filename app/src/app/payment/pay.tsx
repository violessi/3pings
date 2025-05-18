import { useState } from "react";
import { SafeAreaView, View, Text, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import Header from "@/components/Header";
import Button from "@/components/Button";
import RackInput from "@/components/RackInput";
import { useBike } from "@/context/BikeContext";
import LoadingModal from "@/components/LoadingModal";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";

export default function Rent() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const router = useRouter();
  const {
    showSuccessModal,
    showErrorModal,
    setShowErrorModal,
    setShowSuccessModal,
    showLoadingModal,
    payForTrip,
  } = useBike();

  const handleButtonPress = async () => {
    try {
      const res = await payForTrip(tripId); // payForTrip in BikeContext.tsx; calls handler for server calls in TripService.tsx
    } catch (err: any) {
      Alert.alert("Error!", err.message); // temporary; replace with modal
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.replace("/(tabs)/profile");
  };

  // .push() used to /pay
  // go back to page based on callstack
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header
        title="Pay for a Trip"
        hasBack={true}
        prevCallback={handleBack}
      />
      {/* way to pay for trip, use credits, etc */}
      {/* pass as input tripid? */}
      
    </SafeAreaView>
  );
}
