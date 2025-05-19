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

export default function Credits() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const router = useRouter();
  const {
    showSuccessModal,
    showErrorModal,
    setShowErrorModal,
    setShowSuccessModal,
    showLoadingModal,
    // payForTrip,
  } = useBike();

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.replace("/(tabs)/profile");
  };

  const handleBack = () => {
    router.replace("/(tabs)/profile");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header
        title="Your credits"
        hasBack={true}
        prevCallback={handleBack}
      />
      {/* way to pay for trip, use credits, etc */}
      {/* pass as input tripid? */}
      
    </SafeAreaView>
  );
}
