import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1500); // keep splash for at least 1.5s
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [colorMode, setColorMode] = useState<"light" | "dark" | "system">(
    "light"
  );
  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("theme");
      if (stored === "light" || stored === "dark" || stored === "system") {
        setColorMode(stored);
      }
      setIsReady(true);
    })();
  }, []);

  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem("theme", colorMode);
    }
  }, [colorMode, isReady]);

  useEffect(() => {
    function updateResolved(scheme?: Appearance.AppearancePreferences) {
      if (colorMode === "system") {
        const systemScheme = scheme?.colorScheme ?? Appearance.getColorScheme();
        setResolvedMode(systemScheme === "dark" ? "dark" : "light");
      } else {
        setResolvedMode(colorMode);
      }
    }

    updateResolved(); // initial
    const sub = Appearance.addChangeListener(({ colorScheme }) =>
      updateResolved({ colorScheme })
    ); // listen to system theme changes

    return () => sub.remove();
  }, [colorMode]);

  if (!isReady) return null; // prevent flicker before loading

  return (
    <ThemeContext.Provider
      value={{
        colorMode,
        setColorMode: (mode) => {
          setColorMode(mode);

          // 👇 Force update immediately when switching to "system"
          if (mode === "system") {
            const systemScheme = Appearance.getColorScheme();
            setResolvedMode(systemScheme === "dark" ? "dark" : "light");
          } else {
            setResolvedMode(mode);
          }
        },
        resolvedMode,
      }}
    >
      <GluestackUIProvider mode={resolvedMode}>
        <ThemeProvider
          value={resolvedMode === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(noTabs)" options={{ headerShown: false }} />
          </Stack>
          {/* 
          {pathname === "/" && (
            <Fab
              onPress={() =>
                setColorMode(
                  colorMode === "light"
                    ? "dark"
                    : colorMode === "dark"
                    ? "system"
                    : "light"
                )
              }
              className="m-6"
              size="lg"
            >
              <FabIcon as={resolvedMode === "dark" ? MoonIcon : SunIcon} />
            </Fab>
          )} */}
        </ThemeProvider>
      </GluestackUIProvider>
    </ThemeContext.Provider>
  );
}
