import { Modal, View, Text } from "react-native";
import Button from "@/components/Button";

type ErrorModalProps = {
  title: string;
  description?: string;
  showErrorModal: boolean;
  onClose: () => void;
};

export default function ErrorModal({
  title,
  description,
  showErrorModal,
  onClose,
}: ErrorModalProps) {
  return (
    <Modal animationType="fade" transparent={true} visible={showErrorModal}>
      <View className="absolute inset-0 bg-white opacity-50" />
      <View className="flex-1 justify-center items-center gap-7 px-5">
        <View className="bg-white rounded-lg shadow-lg p-5 m-5 gap-3 w-full">
          <Text className="text-secondary text-2xl font-semibold">{title}</Text>
          {description && (
            <Text className="text-secondary text-base">{description}</Text>
          )}
          <Button label="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
