import { Stack, Redirect } from "expo-router";

export default function ReturnLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
