import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { SERIF } from "../constants/colors";
import { useTheme } from "../hooks/useTheme";

type Props = {
  quote: { text: string; author: string } | null;
  loading: boolean;
  error: string | null;
};

export default function QuoteCard({ quote, loading, error }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrap, { borderLeftColor: colors.accent }]}>
      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ alignSelf: "flex-start" }} />
      ) : error ? (
        <Text style={[styles.error, { color: colors.subtext }]}>{error}</Text>
      ) : (
        <>
          <Text style={[styles.text, { color: colors.text, fontFamily: SERIF }]}>
            “{quote?.text}”
          </Text>
          <Text style={[styles.author, { color: colors.subtext }]}>{quote?.author}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderLeftWidth: 3, paddingLeft: 14, paddingVertical: 4, marginBottom: 22 },
  text: { fontSize: 16, lineHeight: 24, fontStyle: "italic" },
  author: { fontSize: 13, fontWeight: "600", marginTop: 8 },
  error: { fontSize: 14 },
});