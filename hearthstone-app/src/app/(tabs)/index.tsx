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

const kAslCourseURL = "https://soft-babka-dec3e0.netlify.app/courses/";

type ButtonDef = {
  label: string;
  action: () => void;
  comingSoon?: boolean;
};

export default function Home() {
  const router = useRouter();

  const buttons: ButtonDef[] = [
    { label: "AI Model", action: () => router.push("/camera") },
    { label: "ASL Course", action: () => Linking.openURL(kAslCourseURL) },
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
            source={require("../../../assets/images/hearthstone-header.png")}
            style={styles.headerImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["transparent", "rgba(18,18,18,0.4)", "#121212"]}
              style={styles.headerFade}
            />
          </ImageBackground>
        </View>

        {/* Featured tier — the 2 live features get real presence */}
        <View style={styles.featuredStack}>
          <TouchableOpacity
            style={[styles.featuredCard, styles.featuredPrimary]}
            activeOpacity={0.85}
            onPress={buttons[0].action}
          >
            <LinearGradient
              colors={["rgba(45,120,255,0.18)", "rgba(18,18,18,0)"]}
              style={styles.featuredGlow}
            />
            <Text style={styles.featuredEyebrow}>LIVE</Text>
            <Text style={styles.featuredTitle}>{buttons[0].label}</Text>
            <Text style={styles.featuredSubtitle}>
              Real-time sign detection
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featuredCard, styles.featuredSecondary]}
            activeOpacity={0.85}
            onPress={buttons[1].action}
          >
            <Text style={styles.featuredEyebrowMuted}>EXTERNAL</Text>
            <Text style={styles.featuredTitleSmall}>{buttons[1].label}</Text>
            <Text style={styles.featuredSubtitle}>
              Learn ASL fingerspelling
            </Text>
          </TouchableOpacity>
        </View>

        {/* Coming soon tier — visually recedes, no glow, smaller */}
        <Text style={styles.sectionLabel}>Coming Soon</Text>
        <View style={styles.grid}>
          {buttons.slice(2).map((btn) => (
            <TouchableOpacity
              key={btn.label}
              style={styles.card}
              activeOpacity={0.6}
              onPress={btn.action}
            >
              <Text style={styles.cardText}>{btn.label}</Text>
              <Text style={styles.comingSoonTag}>Coming Soon</Text>
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

  featuredStack: {
    paddingHorizontal: "5%",
    marginTop: 8,
    gap: 14,
  },
  featuredCard: {
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
  },
  featuredPrimary: {
    height: 150,
    backgroundColor: "#141d2e",
    borderWidth: 1.5,
    borderColor: "#3ecbff",
    justifyContent: "flex-end",
    shadowColor: "#3ecbff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 10,
  },
  featuredGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  featuredSecondary: {
    height: 110,
    backgroundColor: "#161a22",
    borderWidth: 1,
    borderColor: "#2a3a52",
    justifyContent: "flex-end",
  },
  featuredEyebrow: {
    color: "#4da3ff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  featuredEyebrowMuted: {
    color: "#5c7291",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  featuredTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  featuredTitleSmall: {
    color: "#eaf2ff",
    fontSize: 18,
    fontWeight: "700",
  },
  featuredSubtitle: {
    color: "#7a8ba3",
    fontSize: 13,
    marginTop: 4,
  },

  sectionLabel: {
    color: "#5c7291",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    paddingHorizontal: "5%",
    marginTop: 26,
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: "2.5%",
  },
  card: {
    width: "45%",
    aspectRatio: 1.5,
    marginBottom: "5%",
    borderRadius: 14,
    backgroundColor: "#161a22",
    borderWidth: 1,
    borderColor: "#263349",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  cardText: {
    color: "#c7d2e0",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  comingSoonTag: {
    color: "#5c7291",
    fontSize: 9,
    marginTop: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
