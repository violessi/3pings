import React from "react";
import { View, Text } from "react-native";
import { IconButton } from "react-native-paper";

interface HeaderProps {
  title: string;
  subtitle?: string;
  hasBack?: boolean;
  isHomepage?: boolean;
  prevCallback?: () => void;
}

export default function Header({
  title,
  subtitle,
  hasBack = false,
  isHomepage = false,
  prevCallback,
}: HeaderProps) {
  return (
    <View
      className={`h-24 px-5 py-5 flex-col justify-end ${
        isHomepage ? "bg-background" : "bg-primary"
      }`}
    >
      {hasBack ? (
        <View className="flex-row items-center justify-between">
          <IconButton icon="arrow-left" size={24} onPress={prevCallback} />
          <Text className="text-xl font-semibold text-white absolute left-1/2 -translate-x-1/2">
            {title}
          </Text>
          <View style={{ width: 48 }} />{" "}
        </View>
      ) : (
        <View className="items-start">
          <Text
            className={`font-semibold text-xl ${
              isHomepage ? "text-primary" : "text-white"
            } `}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              className={`text-sm ${
                isHomepage ? "text-primary" : "text-white"
              } `}
            >
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
