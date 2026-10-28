import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTasks } from "../hooks/useTasks";
import { useTheme } from "../hooks/useTheme";
import TaskInput from "../components/TaskInput";

export default function EditTaskModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { tasks, updateTask } = useTasks();

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.text }}>Task not found.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TaskInput
        initialTitle={task.title}
        initialCategory={task.category}
        buttonLabel="Save Changes"
        onSubmit={(title, category) => {
          updateTask(task.id, title, category);
          router.back();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});