import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  CATEGORIES,
  Category,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  PRIORITIES,
  Priority,
  PRIORITY_COLORS,
} from "../constants/colors";
import { TaskDraft } from "../context/TasksContext";
import { useTheme } from "../hooks/useTheme";
import { formatDue, keyFromOffset, parseKey, toKey } from "../utils/date";
import AppButton from "./AppButton";
import Chip from "./Chip";

type Props = {
  initial?: TaskDraft;
  buttonLabel: string;
  resetOnSubmit?: boolean;
  onSubmit: (draft: TaskDraft) => void;
};

const DUE_OPTIONS: { label: string; offset: number | null }[] = [
  { label: "Today", offset: 0 },
  { label: "Tomorrow", offset: 1 },
  { label: "Next week", offset: 7 },
  { label: "No date", offset: null },
];

export default function TaskInput({
  initial,
  buttonLabel,
  resetOnSubmit = true,
  onSubmit,
}: Props) {
  const { colors } = useTheme();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [category, setCategory] = useState<Category>(
    initial?.category ?? "Personal",
  );
  const [priority, setPriority] = useState<Priority>(
    initial?.priority ?? "Medium",
  );
  const [dueDate, setDueDate] = useState<string | null>(
    initial ? initial.dueDate : keyFromOffset(0),
  );
  const [invalid, setInvalid] = useState(false);

  const shiftDay = (days: number) => {
    const base = dueDate ? parseKey(dueDate) : new Date();
    base.setDate(base.getDate() + days);
    setDueDate(toKey(base));
    Haptics.selectionAsync();
  };

  const handleSubmit = () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setInvalid(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Title required", "Please enter a title for your task.");
      return;
    }
    Keyboard.dismiss();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSubmit({
      title: cleanTitle,
      note: note.trim(),
      category,
      priority,
      dueDate,
    });
    if (resetOnSubmit) {
      setTitle("");
      setNote("");
      setPriority("Medium");
      setDueDate(keyFromOffset(0));
      setInvalid(false);
    }
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.surface,
      color: colors.text,
      borderColor: colors.border,
    },
  ];

  return (
    <View>
      <Text style={[styles.label, { color: colors.subtext }]}>TITLE</Text>
      <TextInput
        value={title}
        onChangeText={(t) => {
          setTitle(t);
          if (invalid) setInvalid(false);
        }}
        placeholder="What do you need to do?"
        placeholderTextColor={colors.subtext}
        style={[inputStyle, invalid && { borderColor: colors.danger }]}
      />

      <Text style={[styles.label, { color: colors.subtext }]}>
        NOTE (OPTIONAL)
      </Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Add a few details..."
        placeholderTextColor={colors.subtext}
        multiline
        textAlignVertical="top"
        style={[inputStyle, { height: 100 }]}
      />

      <Text style={[styles.label, { color: colors.subtext }]}>DUE DATE</Text>
      <View style={styles.row}>
        {DUE_OPTIONS.map((o) => (
          <Chip
            key={o.label}
            label={o.label}
            selected={
              dueDate === (o.offset === null ? null : keyFromOffset(o.offset))
            }
            onPress={() =>
              setDueDate(o.offset === null ? null : keyFromOffset(o.offset))
            }
          />
        ))}
      </View>

      <View
        style={[
          styles.stepper,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Pressable onPress={() => shiftDay(-1)} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </Pressable>
        <View style={styles.stepperCenter}>
          <Ionicons name="calendar-outline" size={18} color={colors.subtext} />
          <Text style={{ color: colors.text, fontWeight: "700", fontSize: 15 }}>
            {dueDate ? formatDue(dueDate) : "No due date"}
          </Text>
        </View>
        <Pressable onPress={() => shiftDay(1)} hitSlop={10}>
          <Ionicons name="chevron-forward" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <Text style={[styles.label, { color: colors.subtext }]}>PRIORITY</Text>
      <View style={styles.row}>
        {PRIORITIES.map((p) => (
          <Chip
            key={p}
            label={p}
            icon="flag-outline"
            tint={PRIORITY_COLORS[p]}
            selected={priority === p}
            onPress={() => setPriority(p)}
          />
        ))}
      </View>

      <Text style={[styles.label, { color: colors.subtext }]}>CATEGORY</Text>
      <View style={[styles.row, { marginBottom: 28 }]}>
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={c}
            icon={CATEGORY_ICONS[c]}
            tint={CATEGORY_COLORS[c]}
            selected={category === c}
            onPress={() => setCategory(c)}
          />
        ))}
      </View>

      <AppButton title={buttonLabel} icon="checkmark" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 6,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  stepperCenter: { flexDirection: "row", alignItems: "center", gap: 8 },
});
