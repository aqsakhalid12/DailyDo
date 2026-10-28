import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CATEGORIES } from "../../constants/colors";
import { useTasks } from "../../hooks/useTasks";
import { useTheme } from "../../hooks/useTheme";
import { useQuote } from "../../hooks/useQuote";
import TaskCard from "../../components/TaskCard";
import QuoteCard from "../../components/QuoteCard";

export default function TasksScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { tasks, loading, toggleTask, deleteTask } = useTasks();
  const { quote, loading: quoteLoading, error, reload } = useQuote();

  const [filter, setFilter] = useState<string>("All");
  const [refreshing, setRefreshing] = useState(false);

  const filtered = filter === "All" ? tasks : tasks.filter((t) => t.category === filter);

  const onRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  const confirmDelete = (id: string) =>
    Alert.alert("Delete task", "Do you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTask(id) },
    ]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <Text style={[styles.greeting, { color: colors.text }]}>Hello, Aqsa 👋</Text>
      <Text style={[styles.sub, { color: colors.subtext }]}>
        {tasks.filter((t) => !t.completed).length} tasks pending
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={
          <View>
            <QuoteCard quote={quote} loading={quoteLoading} error={error} />
            <View style={styles.chips}>
              {["All", ...CATEGORIES].map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setFilter(c)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: filter === c ? colors.primary : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={{ color: filter === c ? "#fff" : colors.text, fontWeight: "600" }}>
                    {c}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.subtext }]}>
            No tasks yet. Add one from the "Add Task" tab! ✨
          </Text>
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => router.push({ pathname: "/task/[id]", params: { id: item.id } })}
            onToggle={() => toggleTask(item.id)}
            onDelete={() => confirmDelete(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  greeting: { fontSize: 26, fontWeight: "800", marginTop: 8 },
  sub: { fontSize: 14, marginBottom: 12 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1 },
  empty: { textAlign: "center", marginTop: 40, fontSize: 15 },
});