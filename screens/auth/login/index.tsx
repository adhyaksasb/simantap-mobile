import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch("https://simantap-be.laravel.cloud/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const apiResult = await res.json();

      if (!res.ok || !apiResult.status) {
        Alert.alert("Error", "Username atau Password salah.");
        return;
      }

      await AsyncStorage.setItem("token", apiResult.token);

      router.replace("/tab1");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Terjadi masalah koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Masukkan Username"
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Masukkan Password"
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
      />

      <Button
        title={loading ? "Loading..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
};
