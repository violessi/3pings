import { Modal, View, Text } from "react-native";
import Button from "@/components/Button";

type SuccessModalProps = {
  title: string;
  description?: string;
  showSuccessModal: boolean;
  onClose: () => void;
};

export default function SuccessModal({
  title,
  description,
  showSuccessModal,
  onClose,
}: SuccessModalProps) {
  return (
    <Modal animationType="fade" transparent={true} visible={showSuccessModal}>
      <View className="absolute inset-0 bg-white opacity-50" />
      <View className="flex-1 justify-center items-center gap-7">
        <View className="bg-white rounded-lg shadow-lg p-5 m-5 gap-3">
          <Text className="text-primary text-2xl font-semibold">{title}</Text>
          {description && (
            <Text className="text-secondary text-base">{description}</Text>
          )}
          <Button label="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
