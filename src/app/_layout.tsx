import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

import "@/src/utils/global.css";

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} /> */}
      </Stack>
    </PaperProvider>
  );
}

// Pages; Root layout
