import { useEffect } from "react";
import { router } from "expo-router";

export default function Index() {
  useEffect(() => {
    router.replace("/(tabs)/mutasi");
  }, []);

  return null; // nothing to render since it's redirecting
}
