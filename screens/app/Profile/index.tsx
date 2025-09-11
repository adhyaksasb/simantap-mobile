import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import useAuth from "@/hooks/useAuthGuard";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { Pressable } from "@/components/ui/pressable";
import { router } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";

export default () => {
  const { user, loading } = useAuth();

  const { colorScheme } = useColorScheme();

  const iconColor = colorScheme === "dark" ? "#fff" : "#000"; // resolves to theme text color

  const iconTheme = colorScheme === "dark" ? "moon-outline" : "sunny-outline";

  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    const token = await AsyncStorage.getItem("token");

    try {
      const res = await fetch("https://simantap-be.laravel.cloud/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const apiResult = await res.json();

      if (!res.ok || !apiResult.status) {
        Alert.alert("Error", "Terjadi kesalahan server");
        return;
      }

      await AsyncStorage.removeItem("token");

      router.replace("/(auth)/login");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Terjadi masalah koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <Center className="flex-1">
        <Spinner size="large" color="grey" />
      </Center>
    );
  }

  return (
    <SafeAreaView className="flex-1 px-4">
      <VStack className="mt-4 rounded-lg gap-0.5">
        <Heading className="font-bold text-3xl">{user.name}</Heading>
        <Text className="font-semibold text-2xl">{user.role}</Text>
        <Text className="text-xl">{user.division}</Text>
      </VStack>
      <Divider className="mb-6 mt-2 w-full" />
      <VStack className="gap-4">
        <Pressable
          onPress={() => {
            router.push("/themePersonalize");
          }}
        >
          <HStack className="gap-4">
            <Ionicons name={iconTheme} color={iconColor} size={24} />
            <Text className="font-semibold text-lg">
              Personalisasi Tampilan
            </Text>
          </HStack>
        </Pressable>
        <Divider className="w-full" />
        <Pressable onPress={handleLogout}>
          <HStack className="gap-4">
            <Ionicons name="log-out-outline" color={iconColor} size={24} />
            <Text className="font-semibold text-lg">Keluar Akun</Text>
          </HStack>
        </Pressable>
        <Divider className="w-full" />
      </VStack>
    </SafeAreaView>
  );
};
