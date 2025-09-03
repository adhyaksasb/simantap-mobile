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
export default () => {
  const { user, loading } = useAuth();

  const { colorScheme } = useColorScheme();

  const iconColor = colorScheme === "dark" ? "#fff" : "#000"; // resolves to theme text color

  const iconTheme = colorScheme === "dark" ? "moon-outline" : "sunny-outline";

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 p-4">
      <VStack className="mt-4 rounded-lg gap-2">
        <Heading className="font-bold text-3xl">{user.name}</Heading>
        <Text className="font-semibold text-2xl">{user.role}</Text>
        <Text className="text-xl">{user.division}</Text>
      </VStack>
      <Divider className="mb-6 mt-2 w-full" />
      <VStack className="gap-4">
        <Pressable>
          <HStack className="gap-4">
            <Ionicons name={iconTheme} color={iconColor} size={24} />
            <Text className="font-semibold text-lg">
              Personalisasi Tampilan
            </Text>
          </HStack>
        </Pressable>
        <Divider className="w-full" />
        <HStack className="gap-4">
          <Ionicons name="log-out-outline" color={iconColor} size={24} />
          <Text className="font-semibold text-lg">Keluar Akun</Text>
        </HStack>
        <Divider className="w-full" />
      </VStack>
    </SafeAreaView>
  );
};
