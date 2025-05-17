import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewProps,
  GestureResponderEvent,
} from "react-native";

type CardProps = ViewProps & {
  onPress?: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
  activeOpacity?: number; // allow control of touch feedback
};

export const Card = ({
  onPress,
  children,
  style,
  activeOpacity = 0.8, // default fallback
  ...props
}: CardProps) => {
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.card, style]}
        activeOpacity={activeOpacity}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
  },
});
