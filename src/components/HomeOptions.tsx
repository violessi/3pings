import { TouchableOpacity, Text, View } from "react-native";
import { Icon } from "react-native-paper";

interface OptionProps {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
}

export default function Option({
  title,
  description,
  icon,
  onPress,
}: OptionProps) {
  return (
    <TouchableOpacity
      className="bg-primary rounded-lg"
      onPress={() => onPress()}
    >
      <View className="flex-row p-4 gap-4 items-center">
        <Icon source={icon} size={24} color="white" />
        <View>
          <Text className="text-white text-lg font-semibold">{title}</Text>
          <Text className="text-sm text-white">{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
