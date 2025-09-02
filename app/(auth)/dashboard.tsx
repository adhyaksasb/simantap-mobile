// Dashboard.tsx
import React from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  Dashboard: { user: any };
};

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

export default function Dashboard({ route, navigation }: Props) {
  const { user } = route.params;

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome, {user?.name || "User"}!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
