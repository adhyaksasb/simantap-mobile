import { createContext, useContext } from "react";

type ThemeContextType = {
  colorMode: "light" | "dark" | "system"; // user preference
  setColorMode: (mode: "light" | "dark" | "system") => void;
  resolvedMode: "light" | "dark"; // actual applied theme
};

export const ThemeContext = createContext<ThemeContextType>({
  colorMode: "light",
  setColorMode: () => {},
  resolvedMode: "light",
});

export const useThemeContext = () => useContext(ThemeContext);
