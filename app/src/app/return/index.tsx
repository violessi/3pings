import { SafeAreaView, View, Text } from "react-native";
import { useRouter } from "expo-router";

import Button from "@/src/components/Button";
import Header from "@/src/components/Header";
import RackInput from "@/src/components/RackInput";
import LoadingModal from "@/src/components/LoadingModal";
import SuccessModal from "@/src/components/SuccessModal";
import ErrorModal from "@/src/components/ErrorModal";

import { useBike } from "@/src/context/BikeContext";

export default function Return() {
  const userId = "user123"; // Replace with actual user ID
  const router = useRouter();
  const {
    rackId,
    isLate,
    updateRackId,
    returnABike,
    setShowErrorModal,
    setShowSuccessModal,
    showErrorModal,
    showLoadingModal,
    showReturnModal,
    showSuccessModal,
    errorMessage,
  } = useBike();

  const handleBack = () => {
    updateRackId("");
    router.canGoBack() ? router.replace("/action") : router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-background">
        <Header title="Return a bike" hasBack prevCallback={handleBack} />
        <View className="flex-1 justify-start gap-4 p-5">
          <Text className="text-secondary text-3xl font-semibold">
            Enter your preferred bike rack's code.
          </Text>
          <RackInput rackCode={rackId} updateRackCode={updateRackId} />
          <Button
            label="Check Availability"
            onPress={() => returnABike(userId)}
            disabled={rackId ? false : true}
          />
        </View>
      </View>
      <LoadingModal showLoadingModal={showLoadingModal} />
      <SuccessModal
        title="Waiting for bike return..."
        description1={`We will open a bike slot for you. Please return your bike once the slot has opened.`}
        description2="This modal will close automatically once you have returned your bike."
        showSuccessModal={showReturnModal}
      />
      <SuccessModal
        title="Bike returned successfully!"
        description1={`Your bike has been returned. Thank you for using our service!`}
        description2={
          isLate
            ? "Please note that you have incurred a late fee due to returning the bike after 10 PM."
            : "We appreciate your timely return!"
        }
        showSuccessModal={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
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
