import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../context/ThemeContext";
import { TasksProvider } from "../context/TasksContext";
import { useTheme } from "../hooks/useTheme";
import { SERIF } from "../constants/colors";
import UndoSnackbar from "../components/UndoSnackbar";

function RootStack() {
  const { colors, isDark } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: SERIF, fontWeight: "700" },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="task/[id]" options={{ title: "Task details" }} />
        <Stack.Screen name="edit-task" options={{ title: "Edit task", presentation: "modal" }} />
      </Stack>
      <UndoSnackbar />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TasksProvider>
        <RootStack />
      </TasksProvider>
    </ThemeProvider>
  );
}