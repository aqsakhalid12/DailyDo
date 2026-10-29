import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTasks } from "../hooks/useTasks";
import { useTheme } from "../hooks/useTheme";

export default function UndoSnackbar() {
  const { lastDeleted, undoDelete } = useTasks();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [slide] = useState(() => new Animated.Value(0));

  // Slide up whenever a task gets deleted
  useEffect(() => {
    if (lastDeleted) {
      slide.setValue(0);
      Animated.spring(slide, {
        toValue: 1,
        bounciness: 6,
        useNativeDriver: true,
      }).start();
    }
  }, [lastDeleted, slide]);

  if (!lastDeleted) return null;

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          backgroundColor: colors.text,
          bottom: 62 + insets.bottom + 12, // sits just above the tab bar
          opacity: slide,
          transform: [
            {
              translateY: slide.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[styles.text, { color: colors.background }]}
      >
        “{lastDeleted.task.title}” deleted
      </Text>
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          undoDelete();
        }}
        hitSlop={10}
      >
        <Text style={[styles.undo, { color: colors.accent }]}>UNDO</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  text: { flex: 1, fontSize: 14, fontWeight: "600" },
  undo: { fontSize: 14, fontWeight: "800", letterSpacing: 1 },
});
