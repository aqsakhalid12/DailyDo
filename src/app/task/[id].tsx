import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import AppButton from "../../components/AppButton";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  PRIORITY_COLORS,
  SERIF,
} from "../../constants/colors";
import { useTasks } from "../../hooks/useTasks";
import { useTheme } from "../../hooks/useTheme";
import { formatDue, isOverdue } from "../../utils/date";

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { tasks, toggleTask, deleteTask } = useTasks();

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

  const tint = CATEGORY_COLORS[task.category];
  const priorityTint = PRIORITY_COLORS[task.priority];
  const overdue = isOverdue(task.dueDate, task.completed);
  const created = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.pillRow}>
          <View style={[styles.pill, { backgroundColor: tint + "22" }]}>
            <Ionicons
              name={CATEGORY_ICONS[task.category]}
              size={14}
              color={tint}
            />
            <Text style={{ color: tint, fontWeight: "700", fontSize: 13 }}>
              {task.category}
            </Text>
          </View>
          <View style={[styles.pill, { backgroundColor: priorityTint + "22" }]}>
            <Ionicons name="flag" size={14} color={priorityTint} />
            <Text
              style={{ color: priorityTint, fontWeight: "700", fontSize: 13 }}
            >
              {task.priority} priority
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontFamily: SERIF,
              textDecorationLine: task.completed ? "line-through" : "none",
            },
          ]}
        >
          {task.title}
        </Text>

        <Text
          style={[
            styles.note,
            { color: task.note ? colors.text : colors.subtext },
          ]}
        >
          {task.note || "No note added."}
        </Text>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.metaRow}>
          <Ionicons
            name={task.completed ? "checkmark-circle" : "time-outline"}
            size={18}
            color={task.completed ? colors.success : colors.subtext}
          />
          <Text
            style={{
              color: task.completed ? colors.success : colors.subtext,
              fontWeight: "600",
            }}
          >
            {task.completed ? "Completed" : "Pending"}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons
            name={overdue ? "alert-circle-outline" : "calendar-outline"}
            size={18}
            color={overdue ? colors.danger : colors.subtext}
          />
          <Text
            style={{
              color: overdue ? colors.danger : colors.subtext,
              fontWeight: overdue ? "700" : "400",
            }}
          >
            {task.dueDate
              ? `${overdue ? "Overdue: " : "Due: "}${formatDue(task.dueDate)}`
              : "No due date"}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="create-outline" size={18} color={colors.subtext} />
          <Text style={{ color: colors.subtext }}>Added on {created}</Text>
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <AppButton
          title={task.completed ? "Mark as pending" : "Mark as completed"}
          icon={task.completed ? "refresh" : "checkmark-done"}
          onPress={() => toggleTask(task.id)}
        />
        <AppButton
          title="Edit task"
          variant="soft"
          icon="create-outline"
          onPress={() =>
            router.push({ pathname: "/edit-task", params: { id: task.id } })
          }
        />
        <AppButton
          title="Delete task"
          variant="danger"
          icon="trash-outline"
          onPress={confirmDelete}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { borderRadius: 22, borderWidth: 1, padding: 22, marginBottom: 20 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  title: { fontSize: 28, fontWeight: "700", lineHeight: 34, marginBottom: 12 },
  note: { fontSize: 16, lineHeight: 24 },
  divider: { height: 1, marginVertical: 18 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
});
