import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";

type Props = {
  quote: { text: string; author: string } | null;
  loading: boolean;
  error: string | null;
};

export default function QuoteCard({ quote, loading, error }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.primary }]}>
      <Text style={styles.heading}>💡 Motivation</Text>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : error ? (
        <Text style={styles.text}>{error}</Text>
      ) : (
        <>
          <Text style={styles.text}>“{quote?.text}”</Text>
          <Text style={styles.author}>— {quote?.author}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 16, marginBottom: 16 },
  heading: { color: "#fff", fontWeight: "700", marginBottom: 8 },
  text: { color: "#fff", fontSize: 15, lineHeight: 22 },
  author: { color: "#fff", marginTop: 8, fontStyle: "italic", opacity: 0.9 },
});