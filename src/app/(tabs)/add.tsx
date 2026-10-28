import { KeyboardAvoidingView, Platform, ScrollView, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTasks } from "../../hooks/useTasks";
import { useTheme } from "../../hooks/useTheme";
import TaskInput from "../../components/TaskInput";

export default function AddTaskScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { addTask } = useTasks();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TaskInput
          buttonLabel="Add Task"
          onSubmit={(title, category) => {
            addTask(title, category);
            Alert.alert("Task added ✅", "Your task has been added successfully.");
            router.navigate("/(tabs)");
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
});