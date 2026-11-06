import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../components/AppButton";
import { SERIF } from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";

export default function LoginScreen() {
  const { colors } = useTheme();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const isSignIn = mode === "signin";

  const submit = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes("@")) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }
    if (busy) return;

    setBusy(true);
    const message = isSignIn
      ? await signIn(cleanEmail, password)
      : await signUp(cleanEmail, password);
    setBusy(false);

    // Success par session khud set ho jata hai aur app Today screen par chali jati hai
    if (message) Alert.alert(isSignIn ? "Sign in failed" : "Sign up", message);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Ionicons name="checkmark" size={38} color={colors.onPrimary} />
          </View>

          <Text
            style={[styles.title, { color: colors.text, fontFamily: SERIF }]}
          >
            {isSignIn ? "Welcome back" : "Create account"}
          </Text>
          <Text style={[styles.sub, { color: colors.subtext }]}>
            {isSignIn
              ? "Sign in to see your tasks on any device."
              : "Sign up to keep your tasks safe in the cloud."}
          </Text>

          <Text style={[styles.label, { color: colors.subtext }]}>EMAIL</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.subtext}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            style={inputStyle}
          />

          <Text style={[styles.label, { color: colors.subtext }]}>
            PASSWORD
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            placeholderTextColor={colors.subtext}
            secureTextEntry
            autoCapitalize="none"
            style={inputStyle}
          />

          <View style={{ marginTop: 8 }}>
            <AppButton
              title={
                busy
                  ? "Please wait..."
                  : isSignIn
                    ? "Sign in"
                    : "Create account"
              }
              icon={isSignIn ? "log-in-outline" : "person-add-outline"}
              onPress={submit}
            />
          </View>

          <Pressable
            onPress={() => setMode(isSignIn ? "signup" : "signin")}
            style={styles.switch}
          >
            <Text style={{ color: colors.subtext }}>
              {isSignIn ? "New here? " : "Already have an account? "}
              <Text style={{ color: colors.primary, fontWeight: "700" }}>
                {isSignIn ? "Create account" : "Sign in"}
              </Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingTop: 40, paddingBottom: 40 },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: { fontSize: 32, fontWeight: "700", marginBottom: 8 },
  sub: { fontSize: 15, lineHeight: 22, marginBottom: 28 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  switch: { alignItems: "center", marginTop: 22 },
});
