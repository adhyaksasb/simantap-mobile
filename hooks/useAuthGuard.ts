import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          router.replace("/login");
          return;
        }

        const res = await fetch("https://simantap-be.laravel.cloud/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const data = await res.json();
        setUser(data.data);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { user, loading };
}
