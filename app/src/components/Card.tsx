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
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    elevation: 3,
    width: "100%",
  },
});
