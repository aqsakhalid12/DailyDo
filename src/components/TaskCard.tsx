import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  PRIORITY_COLORS,
} from "../constants/colors";
import { Task } from "../context/TasksContext";
import { useTheme } from "../hooks/useTheme";
import { formatDue, isOverdue } from "../utils/date";

type Props = {
  task: Task;
  index: number;
  onPress: () => void;
  onToggle: () => void;
  onDelete: () => void;
};

const SCREEN_W = Dimensions.get("window").width;
const SWIPE_THRESHOLD = -110;

export default function TaskCard({
  task,
  index,
  onPress,
  onToggle,
  onDelete,
}: Props) {
  const { colors } = useTheme();
  const tint = CATEGORY_COLORS[task.category];
  const priorityTint = PRIORITY_COLORS[task.priority];
  const overdue = isOverdue(task.dueDate, task.completed);

  const [appear] = useState(() => new Animated.Value(0));
  const [translateX] = useState(() => new Animated.Value(0));
  const [checkScale] = useState(() => new Animated.Value(1));

  // Keep the latest onDelete so the swipe handler never uses an old one
  const deleteRef = useRef(onDelete);
  useEffect(() => {
    deleteRef.current = onDelete;
  }, [onDelete]);

  // Fade + slide in when the card appears
  useEffect(() => {
    Animated.timing(appear, {
      toValue: 1,
      duration: 320,
      delay: Math.min(index, 6) * 60,
      useNativeDriver: true,
    }).start();
  }, [appear, index]);

  // Swipe left to delete
  const [panResponder] = useState(() =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderMove: (_, g) => {
        if (g.dx < 0) translateX.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx < SWIPE_THRESHOLD) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          Animated.timing(translateX, {
            toValue: -SCREEN_W,
            duration: 220,
            useNativeDriver: true,
          }).start(() => deleteRef.current());
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    }),
  );

  const handleToggle = () => {
    if (task.completed) {
      Haptics.selectionAsync();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Animated.sequence([
      Animated.timing(checkScale, {
        toValue: 1.3,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.spring(checkScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
    onToggle();
  };

  const handleTrash = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDelete();
  };

  const bgOpacity = translateX.interpolate({
    inputRange: [-80, -10, 0],
    outputRange: [1, 0, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        opacity: appear,
        transform: [
          {
            translateY: appear.interpolate({
              inputRange: [0, 1],
              outputRange: [14, 0],
            }),
          },
        ],
      }}
    >
      {/* Red delete background revealed while swiping */}
      <Animated.View
        style={[
          styles.deleteBg,
          { backgroundColor: colors.danger, opacity: bgOpacity },
        ]}
      >
        <Ionicons name="trash" size={20} color="#FFFFFF" />
        <Text style={styles.deleteText}>Delete</Text>
      </Animated.View>

      <Animated.View
        {...panResponder.panHandlers}
        style={{ transform: [{ translateX }] }}
      >
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <View style={[styles.stripe, { backgroundColor: tint }]} />

          <Pressable
            onPress={handleToggle}
            hitSlop={12}
            style={styles.checkWrap}
          >
            <Animated.View
              style={[
                styles.checkbox,
                {
                  borderColor: task.completed ? colors.success : colors.border,
                  backgroundColor: task.completed
                    ? colors.success
                    : "transparent",
                  transform: [{ scale: checkScale }],
                },
              ]}
            >
              {task.completed ? (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              ) : null}
            </Animated.View>
          </Pressable>

          <View style={styles.info}>
            <Text
              style={[
                styles.title,
                {
                  color: task.completed ? colors.subtext : colors.text,
                  textDecorationLine: task.completed ? "line-through" : "none",
                },
              ]}
            >
              {task.title}
            </Text>

            {task.note ? (
              <Text
                numberOfLines={1}
                style={[styles.note, { color: colors.subtext }]}
              >
                {task.note}
              </Text>
            ) : null}

            <View style={styles.pills}>
              <View style={[styles.pill, { backgroundColor: tint + "22" }]}>
                <Ionicons
                  name={CATEGORY_ICONS[task.category]}
                  size={12}
                  color={tint}
                />
                <Text style={{ color: tint, fontSize: 12, fontWeight: "700" }}>
                  {task.category}
                </Text>
              </View>

              <View
                style={[styles.pill, { backgroundColor: priorityTint + "22" }]}
              >
                <Ionicons name="flag" size={12} color={priorityTint} />
                <Text
                  style={{
                    color: priorityTint,
                    fontSize: 12,
                    fontWeight: "700",
                  }}
                >
                  {task.priority}
                </Text>
              </View>

              {task.dueDate ? (
                <View
                  style={[
                    styles.pill,
                    {
                      backgroundColor:
                        (overdue ? colors.danger : colors.subtext) + "1F",
                    },
                  ]}
                >
                  <Ionicons
                    name={overdue ? "alert-circle-outline" : "calendar-outline"}
                    size={12}
                    color={overdue ? colors.danger : colors.subtext}
                  />
                  <Text
                    style={{
                      color: overdue ? colors.danger : colors.subtext,
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    {overdue
                      ? `Overdue · ${formatDue(task.dueDate)}`
                      : formatDue(task.dueDate)}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <Pressable onPress={handleTrash} hitSlop={12}>
            <Ionicons name="trash-outline" size={20} color={colors.subtext} />
          </Pressable>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  deleteBg: {
    ...StyleSheet.absoluteFill,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    paddingRight: 22,
  },
  deleteText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingRight: 16,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  stripe: { width: 5, alignSelf: "stretch", marginRight: 12 },
  checkWrap: { marginRight: 12 },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1, gap: 4 },
  title: { fontSize: 16, fontWeight: "700" },
  note: { fontSize: 13 },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 10,
  },
});
