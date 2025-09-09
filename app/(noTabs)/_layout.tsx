import { Stack } from "expo-router";

export default function QRScanLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="themePersonalize"
        options={{ title: "Personalisasi Tampilan", headerShown: true }}
      />
      <Stack.Screen
        name="transaction"
        options={{ title: "", headerShown: true }}
      />
    </Stack>
  );
}
