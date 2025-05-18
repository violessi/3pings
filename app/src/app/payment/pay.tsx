import { useState } from "react";
import { SafeAreaView, View, Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
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
      // payForTrip in BikeContext.tsx
      // calls handler for server calls in TripService.tsx
      // ADD: pass as payload tripId, minusBalance, minusCredit
      const res = await payForTrip(tripId);
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
      {/* show trip details */}


      {/* way to pay for trip, use credits, etc */}
      {/* set amount of credits to use, max allowable = total credits OR finalFee*/}
      {/* i think need to set minusCredits and minusBalance on button press... but also go to payForTrip() with payload*/}
      {/* set minusCredits = amount set by user; set minusBalance = diff of finalFee and minusCredits*/}


      <TouchableOpacity
        onPress={() => handleButtonPress()}
        style={styles.payButton}
        >
        <Text style={styles.payText}>Pay</Text>
      </TouchableOpacity>

      {/* loading, success, and error modal */}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  payButton: {
    backgroundColor: "#EFC89B",
    borderColor: "#A35700" ,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  payText: {
    color: "#A35700",
    fontWeight: "600",
  },
});
