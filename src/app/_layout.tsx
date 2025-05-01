import { Stack } from "expo-router";

import "@/src/utils/global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} /> */}
    </Stack>
  );
}

// Pages; Root layout
