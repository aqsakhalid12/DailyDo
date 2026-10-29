import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type IconName = keyof typeof Ionicons.glyphMap;

export const Colors = {
  light: {
    background: "#F6F1E9",
    surface: "#FFFDF9",
    text: "#1F2A24",
    subtext: "#7A7F76",
    primary: "#2F5D50",
    onPrimary: "#FFFFFF",
    accent: "#E07A5F",
    border: "#E8E0D2",
    danger: "#C8503C",
    success: "#3E8E63",
  },
  dark: {
    background: "#141815",
    surface: "#1D231F",
    text: "#F2EEE6",
    subtext: "#9AA396",
    primary: "#7FB69E",
    onPrimary: "#0F1A14",
    accent: "#F2A38A",
    border: "#2A322D",
    danger: "#EE7C68",
    success: "#6CC38E",
  },
};

export type ThemeColors = typeof Colors.light;

export const CATEGORIES = ["Personal", "Work", "Study", "Health"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<Category, string> = {
  Personal: "#9B7EDE",
  Work: "#3D8BC4",
  Study: "#D99A2B",
  Health: "#4FA36B",
};

export const CATEGORY_ICONS: Record<Category, IconName> = {
  Personal: "person-outline",
  Work: "briefcase-outline",
  Study: "book-outline",
  Health: "heart-outline",
};

export const PRIORITIES = ["Low", "Medium", "High"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const PRIORITY_COLORS: Record<Priority, string> = {
  Low: "#4FA36B",
  Medium: "#D99A2B",
  High: "#D6523E",
};

// Serif font for headings (gives the app a warm, editorial feel)
export const SERIF = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});