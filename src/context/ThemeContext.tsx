import React, { createContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../constants/colors";

type ThemeContextType = {
  isDark: boolean;
  colors: typeof Colors.light;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [isDark, setIsDark] = useState(system === "dark");

  // Start par saved theme load karo
  useEffect(() => {
    AsyncStorage.getItem("theme").then((value) => {
      if (value) setIsDark(value === "dark");
    });
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    AsyncStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider
      value={{ isDark, colors: isDark ? Colors.dark : Colors.light, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}