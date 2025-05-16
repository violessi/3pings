import { Stack, Redirect } from "expo-router";

export default function ReserveLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
