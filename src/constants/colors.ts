export const Colors = {
  light: {
    background: "#F5F7FB",
    card: "#FFFFFF",
    text: "#1F2937",
    subtext: "#6B7280",
    primary: "#6C5CE7",
    border: "#E5E7EB",
    danger: "#EF4444",
    success: "#22C55E",
  },
  dark: {
    background: "#0F172A",
    card: "#1E293B",
    text: "#F1F5F9",
    subtext: "#94A3B8",
    primary: "#8B7CF6",
    border: "#334155",
    danger: "#F87171",
    success: "#4ADE80",
  },
};

export const CATEGORIES = ["Personal", "Work", "Study", "Health"] as const;
export type Category = (typeof CATEGORIES)[number];