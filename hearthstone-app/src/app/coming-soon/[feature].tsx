import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ComingSoon() {
  const { feature } = useLocalSearchParams<{ feature: string }>();
  const router = useRouter();

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{feature?.replace(/-/g, " ")}</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textTransform: "capitalize",
    textAlign: "center",
  },
  subtitle: { color: "#888", fontSize: 14, marginTop: 8 },
  back: { marginTop: 32 },
  backText: { color: "#3ecbff", fontSize: 15 },
});
