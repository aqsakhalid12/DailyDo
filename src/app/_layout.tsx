import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import UndoSnackbar from "../components/UndoSnackbar";
import { SERIF } from "../constants/colors";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { TasksProvider } from "../context/TasksContext";
import { ThemeProvider } from "../context/ThemeContext";
import { useTheme } from "../hooks/useTheme";

function RootStack() {
  const { colors, isDark } = useTheme();
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const signedIn = !!session;

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
        {/* Sirf login hone par ye screens khulti hain */}
        <Stack.Protected guard={signedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="task/[id]" options={{ title: "Task details" }} />
          <Stack.Screen
            name="edit-task"
            options={{ title: "Edit task", presentation: "modal" }}
          />
        </Stack.Protected>

        {/* Login na ho to sirf ye */}
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
      {signedIn ? <UndoSnackbar /> : null}
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TasksProvider>
          <RootStack />
        </TasksProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
