import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Chip from "../../components/Chip";
import QuoteCard from "../../components/QuoteCard";
import TaskCard from "../../components/TaskCard";
import {
  CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  SERIF,
} from "../../constants/colors";
import { useQuote } from "../../hooks/useQuote";
import { useTasks } from "../../hooks/useTasks";
import { useTheme } from "../../hooks/useTheme";
import { isOverdue } from "../../utils/date";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function TasksScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { tasks, loading, toggleTask, deleteTask } = useTasks();
  const { quote, loading: quoteLoading, error, reload } = useQuote();

  const [filter, setFilter] = useState<string>("All");
  const [refreshing, setRefreshing] = useState(false);

  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const overdueCount = tasks.filter((t) =>
    isOverdue(t.dueDate, t.completed),
  ).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const filtered =
    filter === "All" ? tasks : tasks.filter((t) => t.category === filter);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const header = (
    <View>
      <View style={styles.top}>
        <Text style={[styles.date, { color: colors.accent }]}>
          {today.toUpperCase()}
        </Text>
        <Text
          style={[styles.greeting, { color: colors.text, fontFamily: SERIF }]}
        >
          {getGreeting()}, AQSA
        </Text>
      </View>

      {/* Progress card */}
      <View style={[styles.progress, { backgroundColor: colors.primary }]}>
        <View style={styles.progressRow}>
          <Text style={[styles.progressTitle, { color: colors.onPrimary }]}>
            {total === 0
              ? "Nothing planned yet"
              : `${done} of ${total} tasks done`}
          </Text>
          <Text style={[styles.progressPercent, { color: colors.onPrimary }]}>
            {percent}%
          </Text>
        </View>
        <View
          style={[styles.track, { backgroundColor: colors.onPrimary + "33" }]}
        >
          <View
            style={[
              styles.fill,
              { width: `${percent}%`, backgroundColor: colors.onPrimary },
            ]}
          />
        </View>
        {overdueCount > 0 ? (
          <View style={styles.overdueRow}>
            <Ionicons name="alert-circle" size={16} color={colors.onPrimary} />
            <Text
              style={{
                color: colors.onPrimary,
                fontWeight: "600",
                fontSize: 13,
              }}
            >
              {overdueCount} overdue {overdueCount === 1 ? "task" : "tasks"}
            </Text>
          </View>
        ) : null}
      </View>

      <QuoteCard quote={quote} loading={quoteLoading} error={error} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        <Chip
          label={`All ${total}`}
          selected={filter === "All"}
          onPress={() => setFilter("All")}
        />
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={`${c} ${tasks.filter((t) => t.category === c).length}`}
            icon={CATEGORY_ICONS[c]}
            tint={CATEGORY_COLORS[c]}
            selected={filter === c}
            onPress={() => setFilter(c)}
          />
        ))}
      </ScrollView>

      {filtered.length > 0 ? (
        <View style={styles.hintRow}>
          <Ionicons name="arrow-back" size={13} color={colors.subtext} />
          <Text style={[styles.hint, { color: colors.subtext }]}>
            Swipe left on a task to delete it
          </Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View
              style={[
                styles.emptyIcon,
                { backgroundColor: colors.primary + "1F" },
              ]}
            >
              <Ionicons name="leaf-outline" size={34} color={colors.primary} />
            </View>
            <Text
              style={[
                styles.emptyTitle,
                { color: colors.text, fontFamily: SERIF },
              ]}
            >
              {filter === "All" ? "A clean slate" : `No ${filter} tasks`}
            </Text>
            <Text style={[styles.emptyText, { color: colors.subtext }]}>
              {filter === "All"
                ? "Tap the + button to add your first task."
                : "Nothing here yet. Try another category."}
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <TaskCard
            task={item}
            index={index}
            onPress={() =>
              router.push({ pathname: "/task/[id]", params: { id: item.id } })
            }
            onToggle={() => toggleTask(item.id)}
            onDelete={() => deleteTask(item.id)}
          />
        )}
      />

      {/* Floating add button */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.navigate("/add" as never);
        }}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: colors.accent,
            transform: [{ scale: pressed ? 0.94 : 1 }],
          },
        ]}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { paddingHorizontal: 20, paddingBottom: 110 },
  top: { paddingTop: 14, paddingBottom: 18 },
  date: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  greeting: { fontSize: 24, fontWeight: "700", lineHeight: 38 },
  progress: { borderRadius: 22, padding: 18, marginBottom: 22 },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressTitle: { fontSize: 16, fontWeight: "700" },
  progressPercent: { fontSize: 22, fontWeight: "800" },
  track: { height: 8, borderRadius: 4, marginTop: 14, overflow: "hidden" },
  fill: { height: 8, borderRadius: 4 },
  overdueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  chips: { gap: 10, paddingBottom: 12 },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    marginLeft: 2,
  },
  hint: { fontSize: 12 },
  empty: { alignItems: "center", paddingTop: 36, paddingHorizontal: 30 },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  emptyText: { fontSize: 15, textAlign: "center", lineHeight: 21 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
