import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import useAuth from "@/hooks/useAuthGuard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
  const { item } = useLocalSearchParams();
  const { user, loading } = useAuth();
  const parsedItem = item ? JSON.parse(item as string) : null;
  const [name, setName] = useState("");
  const [stock, setStock] = useState(0);
  const [unit, setUnit] = useState("");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [hasTyped, setHasTyped] = useState(false);

  const numericValue = parseInt(value || "0", 10);

  const isInvalid = hasTyped && numericValue < 1;

  const buttonDisabled = !hasTyped || isInvalid;

  const [isLoading, setIsLoading] = useState(false);

  const getItemById = async () => {
    setIsLoading(true);

    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(
        `https://simantap-be.laravel.cloud/api/get/items/${parsedItem?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const apiResult = await res.json();

      if (!res.ok || !apiResult.status) {
        Alert.alert("Error", "Terjadi masalah.");
        return;
      }

      setName(apiResult.data.name);
      setStock(apiResult.data.stock);
      setUnit(apiResult.data.unit);
    } catch (error) {
      console.error(error);
      router.replace("/(tabs)/qr-scan/scanner");
    } finally {
      setIsLoading(false);
    }
  };

  const submitMutasi = async () => {
    setIsLoading(true);

    const token = await AsyncStorage.getItem("token");
    try {
      const item_id: number = parsedItem?.id;
      const type = "keluar";
      const amount = numericValue;

      const res = await fetch(
        "https://simantap-be.laravel.cloud/api/post/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ item_id, type, amount, notes }),
        }
      );

      const apiResult = await res.json();

      if (!res.ok || !apiResult.status) {
        Alert.alert("Error", "Terjadi masalah.");
        return;
      }

      setStock(apiResult.data.after_stock);
      Alert.alert("Success", "Barang Berhasil dikeluarkan dari stok");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Terjadi masalah koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      getItemById();
    }
  }, [loading]);

  if (loading || isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView className="flex-1 px-4">
      <Heading className="font-bold text-4xl">Mutasi Keluar</Heading>
      <Divider className="mb-6 mt-2 w-full" />
      <VStack className="gap-8">
        <View>
          {parsedItem ? (
            <VStack className="gap-1">
              <Text className="text-lg">Nama: {parsedItem.name}</Text>
              <Text className="text-lg">Stok: {stock}</Text>
              <Text className="text-lg">Unit: {parsedItem.unit}</Text>
            </VStack>
          ) : (
            <VStack>
              <Text className="text-lg">No Data</Text>
            </VStack>
          )}
        </View>
        <Divider className="w-full" />
        <FormControl isInvalid={isInvalid} className="gap-2">
          <Text>Jumlah Barang Keluar</Text>
          <Input variant="outline" size="md">
            <InputField
              placeholder="Masukkan stok (minimal 1)"
              keyboardType="numeric"
              value={value}
              onChangeText={(text) => {
                if (!hasTyped) setHasTyped(true); // first time typing
                const onlyNums = text.replace(/[^0-9]/g, "");
                setValue(onlyNums);
              }}
            />
          </Input>
          {isInvalid && (
            <FormControlError>
              <FormControlErrorText>Minimal stok adalah 1</FormControlErrorText>
            </FormControlError>
          )}
          <Text>Keterangan</Text>
          <Input variant="outline" size="md">
            <InputField
              placeholder="Masukkan keterangan (opsional)"
              value={notes}
              onChangeText={(text) => {
                setNotes(text);
              }}
            />
          </Input>
          <Button isDisabled={buttonDisabled} onPress={submitMutasi}>
            <ButtonText>{isLoading ? "Loading..." : "Submit"}</ButtonText>
          </Button>
        </FormControl>
      </VStack>
    </SafeAreaView>
  );
};
