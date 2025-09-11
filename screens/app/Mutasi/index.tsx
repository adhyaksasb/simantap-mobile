import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import useAuth from "@/hooks/useAuthGuard";
import months from "./months";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Box } from "@/components/ui/box";

import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Transaction } from "./transactions";
import { ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { Spinner } from "@/components/ui/spinner";
import { Center } from "@/components/ui/center";

export default () => {
  const { user, loading } = useAuth();

  const now = new Date();
  const monthYear = now.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const [selectedMonth, setSelectedMonth] = useState(monthYear);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const filterMonth = async (month: string) => {
    setIsLoading(true);
    setSelectedMonth(month);

    const encodedMonth = encodeURIComponent(month);
    const token = await AsyncStorage.getItem("token");

    try {
      const res = await fetch(
        `https://simantap-be.laravel.cloud/api/get/transactions/user?month=${encodedMonth}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const apiResult = await res.json();
      if (!res.ok) return;

      setTransactions(apiResult.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      filterMonth(selectedMonth);
    }, [selectedMonth])
  );

  if (isLoading || loading)
    return (
      <Center className="flex-1">
        <Spinner size="large" color="grey" />
      </Center>
    );
  if (!user) return null;

  return (
    <ScrollView className="flex-1 mt-4 p-4">
      <VStack className="mt-4 gap-0.5">
        <Heading className="font-bold text-3xl">{user.name}</Heading>
        <Text className="font-semibold text-2xl">{user.role}</Text>
        <Text className="text-xl">{user.division}</Text>
      </VStack>
      <Divider className="mb-6 mt-2 w-full" />
      <HStack className="justify-end w-full">
        <Select
          selectedValue={selectedMonth}
          onValueChange={(val) => {
            filterMonth(val);
          }}
        >
          <SelectTrigger variant="outline" size="md">
            <SelectInput placeholder="Pilih Bulan" />
            <SelectIcon className="mr-3" as={ChevronDownIcon} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {months.map((month) => (
                <SelectItem
                  key={month.value}
                  label={month.label}
                  value={month.value}
                />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      </HStack>
      <VStack className="gap-4 mt-2">
        {transactions.map((tx) => (
          <VStack key={tx.id} className="gap-4">
            <HStack className="gap-4 justify-between">
              <Text
                className="font-semibold text-lg flex-1 flex-wrap"
                numberOfLines={2}
              >
                {tx.item_name}
              </Text>
              <Text>{tx.amount}</Text>
            </HStack>
            <HStack className="gap-4 justify-between">
              <Text>Mutasi {tx.transaction_type}</Text>
              <Text>{tx.created_at}</Text>
            </HStack>
            <Divider className="w-full" />
          </VStack>
        ))}
      </VStack>
    </ScrollView>
  );
};
