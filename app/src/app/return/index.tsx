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
    updateRackId,
    returnABike,
    setShowErrorModal,
    showErrorModal,
    showLoadingModal,
    showReturnModal,
    showSuccessModal,
    errorMessage,
  } = useBike();
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
            onPress={() => returnABike(userId)}
            disabled={rackId ? false : true}
          />
        </View>
      </View>
      <LoadingModal showLoadingModal={showLoadingModal} />
      <SuccessModal
        title="Waiting for bike return..."
        description1={`We have opened a bike slot for you. Please return your bike.`}
        description2="This modal will close automatically once you have returned your bike."
        showSuccessModal={showReturnModal}
      />
      <SuccessModal
        title="Bike returned successfully!"
        description1={`Your bike has been returned. Please take your bike from slot ${rackId}.`}
        description2="This modal will close automatically once you have returned your bike."
        showSuccessModal={showSuccessModal}
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
