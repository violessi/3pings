import { Stack, Redirect } from "expo-router";

export default function PaymentLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="pay" options={{ headerShown: false }} />
    </Stack>
  );
}
