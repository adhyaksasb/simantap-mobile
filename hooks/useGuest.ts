import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function useGuest() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkGuest = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          const res = await fetch("https://simantap-be.laravel.cloud/api/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            router.replace("/(tabs)/mutasi");
            return;
          }
        }
      } catch (err) {
        console.error("Guest check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkGuest();
  }, [router]);

  return { loading };
}
