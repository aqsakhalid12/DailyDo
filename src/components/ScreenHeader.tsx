import { View, Text, StyleSheet } from "react-native";
import { SERIF } from "../constants/colors";
import { useTheme } from "../hooks/useTheme";

type Props = { title: string; eyebrow?: string; subtitle?: string };

export default function ScreenHeader({ title, eyebrow, subtitle }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      {eyebrow ? (
        <Text style={[styles.eyebrow, { color: colors.accent }]}>{eyebrow.toUpperCase()}</Text>
      ) : null}
      <Text style={[styles.title, { color: colors.text, fontFamily: SERIF }]}>{title}</Text>
      {subtitle ? <Text style={[styles.sub, { color: colors.subtext }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 12, paddingBottom: 20 },
  eyebrow: { fontSize: 12, fontWeight: "700", letterSpacing: 1.4, marginBottom: 6 },
  title: { fontSize: 32, fontWeight: "700", lineHeight: 38 },
  sub: { fontSize: 15, marginTop: 6, lineHeight: 21 },
});