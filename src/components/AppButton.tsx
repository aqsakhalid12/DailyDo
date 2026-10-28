import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "danger" | "outline";
};

export default function AppButton({ title, onPress, variant = "primary" }: Props) {
  const { colors } = useTheme();
  const bg =
    variant === "primary" ? colors.primary : variant === "danger" ? colors.danger : "transparent";
  const textColor = variant === "outline" ? colors.primary : "#fff";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, opacity: pressed ? 0.7 : 1 },
        variant === "outline" && { borderWidth: 1.5, borderColor: colors.primary },
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  text: { fontSize: 16, fontWeight: "700" },
});