import { Stack } from "expo-router";

export default function QRScanLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="scanner" options={{ title: "Scanner" }} />
      <Stack.Screen name="transaction" options={{ title: "Transaction" }} />
    </Stack>
  );
}
