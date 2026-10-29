import { KeyboardAvoidingView, Platform, ScrollView, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTasks } from "../../hooks/useTasks";
import { useTheme } from "../../hooks/useTheme";
import TaskInput from "../../components/TaskInput";
import ScreenHeader from "../../components/ScreenHeader";

export default function AddTaskScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { addTask } = useTasks();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader
            eyebrow="Plan ahead"
            title="New task"
            subtitle="Write it down so your mind can let it go."
          />
          <TaskInput
            buttonLabel="Save task"
            onSubmit={(draft) => {
              addTask(draft);
              Alert.alert("Task added", "Your task is now on your list.");
              router.navigate("/(tabs)");
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 40 },
});