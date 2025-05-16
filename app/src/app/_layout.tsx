import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

import "@/utils/global.css";
import { BikeProvider } from "@/context/BikeContext";

export default function RootLayout() {
  return (
    <BikeProvider>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="rent" options={{ headerShown: false }} />
          <Stack.Screen name="return" options={{ headerShown: false }} />
          <Stack.Screen name="reserve" options={{ headerShown: false }} />
        </Stack>
      </PaperProvider>
    </BikeProvider>
  );
}

// Pages; Root layout
