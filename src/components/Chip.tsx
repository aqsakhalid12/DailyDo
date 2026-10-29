import { Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IconName } from "../constants/colors";
import { useTheme } from "../hooks/useTheme";

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: IconName;
  tint?: string;
};

export default function Chip({ label, selected, onPress, icon, tint }: Props) {
  const { colors } = useTheme();
  const active = tint ?? colors.primary;
  const activeText = tint ? "#FFFFFF" : colors.onPrimary;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? active : colors.surface,
          borderColor: selected ? active : colors.border,
        },
      ]}
    >
      {icon ? (
        <Ionicons name={icon} size={15} color={selected ? activeText : active} />
      ) : null}
      <Text style={{ color: selected ? activeText : colors.text, fontWeight: "600", fontSize: 14 }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 22,
    borderWidth: 1,
  },
});