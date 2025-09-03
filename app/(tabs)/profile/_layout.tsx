import { Stack } from "expo-router";

export default function QRScanLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="pengaturan" options={{ title: "Scanner" }} />
    </Stack>
  );
}
