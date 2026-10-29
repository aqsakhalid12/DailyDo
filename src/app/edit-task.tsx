import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import TaskInput from "../components/TaskInput";
import { useTasks } from "../hooks/useTasks";
import { useTheme } from "../hooks/useTheme";

export default function EditTaskModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { tasks, updateTask } = useTasks();

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.text, fontSize: 16 }}>
          Task not found.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: colors.background }}
    >
      <TaskInput
        initial={{
          title: task.title,
          note: task.note,
          category: task.category,
          priority: task.priority,
          dueDate: task.dueDate,
        }}
        buttonLabel="Save changes"
        resetOnSubmit={false}
        onSubmit={(draft) => {
          updateTask(task.id, draft);
          router.back();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
