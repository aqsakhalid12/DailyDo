import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function NotFound() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>This screen does not exist</Text>
      <Link href="/(tabs)" style={{ color: "#2F5D50", fontSize: 16, fontWeight: "600" }}>
        Go back home
      </Link>
    </View>
  );
}