import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../components/AppButton";
import ScreenHeader from "../../components/ScreenHeader";
import { SERIF } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { useTasks } from "../../hooks/useTasks";
import { useTheme } from "../../hooks/useTheme";

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { tasks, clearAll } = useTasks();
  const { user, signOut } = useAuth();

  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const pending = total - done;
  const email = user?.email ?? "";

  const confirmClear = () =>
    Alert.alert(
      "Clear all tasks",
      "All your tasks will be permanently deleted. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear all", style: "destructive", onPress: clearAll },
      ],
    );

  const confirmSignOut = () =>
    Alert.alert("Sign out", "Do you want to sign out of DailyDo?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: signOut },
    ]);

  const stats = [
    { label: "Total", value: total },
    { label: "Done", value: done },
    { label: "Pending", value: pending },
  ];

  const card = { backgroundColor: colors.surface, borderColor: colors.border };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader eyebrow="Your space" title="Profile" />

        <View style={[styles.card, styles.identity, card]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text
              style={[
                styles.initials,
                { color: colors.onPrimary, fontFamily: SERIF },
              ]}
            >
              {email ? email[0].toUpperCase() : "?"}
            </Text>
          </View>
          <Text
            style={[styles.name, { color: colors.text, fontFamily: SERIF }]}
          >
            Aqsa Khalid
          </Text>
          <Text style={{ color: colors.subtext }}>{email}</Text>

          <View style={styles.statsRow}>
            {stats.map((s) => (
              <View key={s.label} style={styles.stat}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {s.value}
                </Text>
                <Text style={{ color: colors.subtext, fontSize: 13 }}>
                  {s.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, styles.row, card]}>
          <View
            style={[styles.iconBox, { backgroundColor: colors.accent + "26" }]}
          >
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={20}
              color={colors.accent}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              Dark mode
            </Text>
            <Text style={{ color: colors.subtext, fontSize: 13 }}>
              Easier on the eyes at night
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.card, card]}>
          <Text style={[styles.rowTitle, { color: colors.text }]}>
            Your data
          </Text>
          <Text
            style={{
              color: colors.subtext,
              marginTop: 4,
              marginBottom: 16,
              lineHeight: 20,
            }}
          >
            Tasks are stored securely in the cloud. You have {total} saved{" "}
            {total === 1 ? "task" : "tasks"}.
          </Text>
          <View style={{ gap: 12 }}>
            <AppButton
              title="Clear all tasks"
              variant="danger"
              icon="trash-outline"
              onPress={confirmClear}
            />
            <AppButton
              title="Sign out"
              variant="soft"
              icon="log-out-outline"
              onPress={confirmSignOut}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  card: { borderRadius: 22, borderWidth: 1, padding: 20 },
  identity: { alignItems: "center" },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  initials: { fontSize: 30, fontWeight: "700" },
  name: { fontSize: 24, fontWeight: "700" },
  statsRow: { flexDirection: "row", marginTop: 20, alignSelf: "stretch" },
  stat: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "800" },
  row: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { fontSize: 16, fontWeight: "700" },
});
