import { TouchableOpacity, Text } from "react-native";

type ButtonProps = {
  label: string;
  onPress: () => void;
  className?: string;
  disabled?: boolean;
};

export default function Button({
  label,
  onPress,
  className,
  disabled,
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={`rounded-lg p-4 ${
        disabled ? "bg-primary-light" : "bg-primary"
      }  ${className}`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className="text-white text-center text-lg font-semibold">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
