import { Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IconName } from "../constants/colors";
import { useTheme } from "../hooks/useTheme";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "soft" | "danger";
  icon?: IconName;
};

export default function AppButton({ title, onPress, variant = "primary", icon }: Props) {
  const { colors } = useTheme();

  const bg =
    variant === "primary" ? colors.primary : variant === "danger" ? "transparent" : colors.surface;
  const fg =
    variant === "primary" ? colors.onPrimary : variant === "danger" ? colors.danger : colors.text;
  const border = variant === "danger" ? colors.danger : colors.border;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bg,
          borderColor: variant === "primary" ? colors.primary : border,
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      {icon ? <Ionicons name={icon} size={19} color={fg} /> : null}
      <Text style={[styles.text, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  text: { fontSize: 16, fontWeight: "700" },
});