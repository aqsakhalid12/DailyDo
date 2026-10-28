import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, Keyboard, StyleSheet } from "react-native";
import { CATEGORIES, Category } from "../constants/colors";
import { useTheme } from "../hooks/useTheme";
import AppButton from "./AppButton";

type Props = {
  initialTitle?: string;
  initialCategory?: Category;
  buttonLabel: string;
  onSubmit: (title: string, category: Category) => void;
};

export default function TaskInput({
  initialTitle = "",
  initialCategory = "Personal",
  buttonLabel,
  onSubmit,
}: Props) {
  const { colors } = useTheme();
  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState<Category>(initialCategory);

  const handleSubmit = () => {
    const clean = title.trim();
    if (!clean) {
      Alert.alert("Oops", "Task title cannot be empty.");
      return;
    }
    Keyboard.dismiss();
    onSubmit(clean, category);
    setTitle("");
  };

  return (
    <View>
      <Text style={[styles.label, { color: colors.subtext }]}>Task title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Add a new task"
        placeholderTextColor={colors.subtext}
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
        ]}
      />

      <Text style={[styles.label, { color: colors.subtext }]}>Category</Text>
      <View style={styles.row}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCategory(c)}
            style={[
              styles.chip,
              {
                backgroundColor: category === c ? colors.primary : colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={{ color: category === c ? "#fff" : colors.text, fontWeight: "600" }}>
              {c}
            </Text>
          </Pressable>
        ))}
      </View>

      <AppButton title={buttonLabel} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1 },
});