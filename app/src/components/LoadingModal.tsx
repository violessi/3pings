import { Modal, View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";

type LoadingModalProps = {
  showLoadingModal: boolean;
};

export default function LoadingModal({ showLoadingModal }: LoadingModalProps) {
  return (
    <Modal animationType="fade" transparent={true} visible={showLoadingModal}>
      <View className="absolute inset-0 bg-white opacity-50" />
      <View className="flex-1 justify-center items-center gap-7">
        <ActivityIndicator size={30} color="#362C5F" />
        <Text className="text-primary text-xl font-semibold mb-4">
          Processing your request...
        </Text>
      </View>
    </Modal>
  );
}
