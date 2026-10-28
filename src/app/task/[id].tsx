import { View, Text, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTasks } from "../../hooks/useTasks";
import { useTheme } from "../../hooks/useTheme";
import AppButton from "../../components/AppButton";

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { tasks, toggleTask, deleteTask } = useTasks();

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.text }}>Task not found.</Text>
      </View>
    );
  }

  const confirmDelete = () =>
    Alert.alert("Delete task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteTask(task.id);
          router.back();
        },
      },
    ]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>
        <Text style={{ color: colors.primary, fontWeight: "700", marginBottom: 8 }}>
          {task.category}
        </Text>
        <Text style={{ color: task.completed ? colors.success : colors.subtext }}>
          Status: {task.completed ? "Completed ✅" : "Pending ⏳"}
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        <AppButton
          title={task.completed ? "Mark as pending" : "Mark as completed"}
          onPress={() => toggleTask(task.id)}
        />
        <AppButton
          title="Edit"
          variant="outline"
          onPress={() => router.push({ pathname: "/edit-task", params: { id: task.id } })}
        />
        <AppButton title="Delete" variant="danger" onPress={confirmDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { padding: 20, borderRadius: 16, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 8 },
});