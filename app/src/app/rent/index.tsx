import { useState } from "react";
import { SafeAreaView, View, Text, Alert } from "react-native";
import { useRouter } from "expo-router";

import Header from "@/components/Header";
import Button from "@/components/Button";
import RackInput from "@/components/RackInput";
import { useBike } from "@/context/BikeContext";
import LoadingModal from "@/components/LoadingModal";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";

export default function Rent() {
  const router = useRouter();
  const {
    rackId,
    showSuccessModal,
    showErrorModal,
    showRentModal,
    setShowErrorModal,
    setShowSuccessModal,
    setShowRentModal,
    showLoadingModal,
    updateRackId,
    rentABike,
    errorMessage,
  } = useBike();

  const [slot, setSlot] = useState<number | null>(null);

  const handleButtonPress = async () => {
    try {
      const rackSlot = await rentABike();
      setSlot(rackSlot);
    } catch (err: any) {
      Alert.alert("Error!", err.message); // temporary; replace with modal
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.dismissTo("/(tabs)/action");
  };

  const handleBack = () => {
    updateRackId("");
    router.canGoBack() ? router.replace("/action") : router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Rent a bike" subtitle="Select a bike to rent" hasBack />
      <View className="flex-1 justify-start gap-4 p-5">
        <Text className="text-secondary text-3xl font-semibold">
          Easily rent a bike by entering the bike rack code.
        </Text>
        <RackInput rackCode={rackId} updateRackCode={updateRackId} />
        <Button
          label="Check Availability"
          onPress={() => handleButtonPress()}
          disabled={!rackId}
        />
      </View>
      <LoadingModal showLoadingModal={showLoadingModal} />
      <SuccessModal
        title="We have received your rental request!"
        description1={`We’re opening a slot for your bike—please monitor the rack for the release.`}
        description2="Please do not close the app."
        showSuccessModal={showSuccessModal}
      />
      <SuccessModal
        title="Bike rented successfully!"
        description1={`Thank you for using our service!`}
        showSuccessModal={showRentModal}
        onClose={() => {
          setShowRentModal(false);
        }}
      />
      <ErrorModal
        title="Error"
        description={errorMessage}
        showErrorModal={showErrorModal}
        onClose={() => setShowErrorModal(false)}
      />
    </SafeAreaView>
  );
}
