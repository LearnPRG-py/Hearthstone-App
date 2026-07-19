import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const ASL_COURSE_URL = "https://your-project-hearthstone-site.com"; // swap in real link

type ButtonDef = {
  label: string;
  action: () => void;
  comingSoon?: boolean;
};

export default function Home() {
  const router = useRouter();

  const buttons: ButtonDef[] = [
    { label: "AI Model", action: () => router.push("/camera") },
    { label: "ASL Course", action: () => Linking.openURL(ASL_COURSE_URL) },
    {
      label: "Indian Sign Language",
      action: () => router.push("/coming-soon/isl"),
      comingSoon: true,
    },
    {
      label: "British Sign Language",
      action: () => router.push("/coming-soon/bsl"),
      comingSoon: true,
    },
    {
      label: "Dynamic ASL",
      action: () => router.push("/coming-soon/dynamic-asl"),
      comingSoon: true,
    },
    {
      label: "Speech to Sign",
      action: () => router.push("/coming-soon/speech-to-sign"),
      comingSoon: true,
    },
    {
      label: "Transcriber",
      action: () => router.push("/coming-soon/transcriber"),
      comingSoon: true,
    },
    {
      label: "Settings",
      action: () => router.push("/coming-soon/settings"),
      comingSoon: true,
    },
  ];

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <ImageBackground
            source={require("../../assets/images/hearthstone-header.png")}
            style={styles.headerImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["transparent", "rgba(18,18,18,0.4)", "#121212"]}
              style={styles.headerFade}
            />
          </ImageBackground>
        </View>

        <View style={styles.grid}>
          {buttons.map((btn) => (
            <TouchableOpacity
              key={btn.label}
              style={styles.card}
              activeOpacity={0.7}
              onPress={btn.action}
            >
              <Text style={styles.cardText}>{btn.label}</Text>
              {btn.comingSoon && (
                <Text style={styles.comingSoonTag}>Coming Soon</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#121212" },
  header: { width: "100%", height: 260, backgroundColor: "#000" },
  headerImage: { flex: 1, justifyContent: "flex-end" },
  headerFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: "2.5%",
    marginTop: 12,
  },
  card: {
    width: "45%",
    aspectRatio: 1.3,
    marginBottom: "5%",
    borderRadius: 16,
    backgroundColor: "#1a1a1a",
    borderWidth: 1.5,
    borderColor: "#3ecbff",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    shadowColor: "#3ecbff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  cardText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  comingSoonTag: {
    color: "#888",
    fontSize: 10,
    marginTop: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
