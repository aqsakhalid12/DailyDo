import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Task } from "../context/TasksContext";
import { useTheme } from "../hooks/useTheme";

type Props = {
  task: Task;
  onPress: () => void;
  onToggle: () => void;
  onDelete: () => void;
};

export default function TaskCard({ task, onPress, onToggle, onDelete }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.card }]}
    >
      <Pressable onPress={onToggle} hitSlop={10}>
        <Ionicons
          name={task.completed ? "checkmark-circle" : "ellipse-outline"}
          size={28}
          color={(task.completed ? colors.success : colors.subtext) as string}
        />
      </Pressable>

      <View style={styles.info}>
        <Text
          style={[
            styles.title,
            {
              color: task.completed ? colors.subtext : colors.text,
              textDecorationLine: task.completed ? "line-through" : "none",
              textDecorationStyle: "solid",
            },
          ]}
        >
          {task.title}
        </Text>
        <Text style={[styles.category, { color: colors.primary }]}>
          {task.category}
        </Text>
      </View>

      <Pressable onPress={onDelete} hitSlop={10}>
        <Ionicons
          name="trash-outline"
          size={22}
          color={colors.danger as string}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600" },
  category: { fontSize: 12, fontWeight: "600", marginTop: 2 },
});
