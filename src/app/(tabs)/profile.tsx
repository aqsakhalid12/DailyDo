import { View, Text, Switch, Alert, StyleSheet } from "react-native";
import { useTasks } from "../../hooks/useTasks";
import { useTheme } from "../../hooks/useTheme";
import AppButton from "../../components/AppButton";

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { tasks, clearAll } = useTasks();

  const done = tasks.filter((t) => t.completed).length;

  const confirmClear = () =>
    Alert.alert("Clear all tasks", "All tasks will be deleted. Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear all", style: "destructive", onPress: clearAll },
    ]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={styles.avatar}>👩‍💻</Text>
        <Text style={[styles.name, { color: colors.text }]}>Aqsa Khalid</Text>
        <Text style={{ color: colors.subtext }}>
          {tasks.length} total · {done} completed
        </Text>
      </View>

      <View style={[styles.row, { backgroundColor: colors.card }]}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>Dark mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <AppButton title="Clear all tasks" variant="danger" onPress={confirmClear} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  card: { alignItems: "center", padding: 24, borderRadius: 16 },
  avatar: { fontSize: 56, marginBottom: 8 },
  name: { fontSize: 22, fontWeight: "800" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
  },
});