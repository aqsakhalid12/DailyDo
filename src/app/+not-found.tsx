import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function NotFound() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "700" }}>
        This screen does not exist
      </Text>
      <Link href="/(tabs)" style={{ color: "#6C5CE7", fontSize: 16 }}>
        Go to Home
      </Link>
    </View>
  );
}
