import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { useState } from "react";
import { router } from "expo-router";
import { Alert, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useGuest from "@/hooks/useGuest";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("https://simantap-be.laravel.cloud/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const apiResult = await res.json();
      if (!res.ok || !apiResult.status) {
        Alert.alert("Error", "Username atau Password salah.");
        return;
      }
      await AsyncStorage.setItem("token", apiResult.token);
      router.replace("/(tabs)/mutasi");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Terjadi masalah koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  const { loading } = useGuest();

  if (loading) {
    return <Text>Loading...</Text>;
  }
  return (
    <View className="justify-center flex-1 px-2">
      <Text className="text-3xl text-center font-bold">SIMANTAP</Text>
      <FormControl className="p-4 border border-outline-200 rounded-lg w-full mt-2">
        <VStack className="gap-4">
          <Heading className="text-typography-900">Login</Heading>
          <VStack space="xs">
            <Text className="text-typography-500">Email</Text>
            <Input>
              <InputField
                type="text"
                placeholder="email@example.com"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </Input>
          </VStack>
          <VStack space="xs">
            <Text className="text-typography-500">Password</Text>
            <Input className="w-full">
              <InputField
                type={showPassword ? "text" : "password"}
                placeholder="********"
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
              <InputSlot onPress={handleState}>
                <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
              </InputSlot>
            </Input>
          </VStack>
          <Button className="ml-auto" onPress={handleLogin}>
            <ButtonText>{isLoading ? "Loading..." : "Login"}</ButtonText>
          </Button>
        </VStack>
      </FormControl>
    </View>
  );
};
