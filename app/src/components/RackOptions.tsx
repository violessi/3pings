import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";

// require images from "@/src/assets/images";
const dcs = require("@/src/assets/images/dcs.jpg");
const cal = require("@/src/assets/images/cal.jpg");
const im = require("@/src/assets/images/im.png");
const vh = require("@/src/assets/images/vinzons.jpg");
type ImageKey = "dcs" | "cal" | "im" | "vh";

const images: Record<ImageKey, any> = {
  dcs,
  cal,
  im,
  vh,
};

type RackOptionProps = {
  rackId: string;
  department: string;
  onSelect: (rackId: string) => void;
  image: ImageKey;
};

export function RackOption({
  rackId,
  department,
  onSelect,
  image,
}: RackOptionProps) {
  return (
    <TouchableOpacity onPress={() => onSelect(rackId.toLowerCase())}>
      <View className="flex-row items-center gap-4 p-5 bg-white rounded-xl shadow-sm">
        <Image source={images[image]} style={styles.image} />
        <View className="flex-1">
          <Text className="text-xl text-secondary font-semibold">{rackId}</Text>
          <Text className="text-base text-secondary">{department}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderColor: "#7E7E7E",
    borderWidth: 2,
    opacity: 0.8,
    resizeMode: "cover",
  },
});
