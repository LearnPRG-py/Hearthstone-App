import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import GlowButton from "../../components/GlowButton"; // adjust path
import { COLORS } from "../../constants/theme"; // adjust path

const kAslCourseURL = "https://soft-babka-dec3e0.netlify.app/courses/";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export default function Home() {
  const router = useRouter();

  const live: { label: string; sub: string; icon: IconName; tag: string; action: () => void }[] = [
    {
      label: "Speech to Sign",
      sub: "Watch your speech turn into sign",
      icon: "hand-left-outline",
      tag: "LIVE",
      action: () => router.push("/SpeechSign"),
    },
    {
      label: "Transcriber",
      sub: "Speech to text in real time",
      icon: "mic-outline",
      tag: "LIVE",
      action: () => router.push("/transcriber"),
    },
    {
      label: "ASL Course",
      sub: "Learn ASL fingerspelling",
      icon: "school-outline",
      tag: "EXTERNAL",
      action: () => Linking.openURL(kAslCourseURL),
    },
  ];

  const soon: { label: string; route: string }[] = [
    { label: "Indian Sign Language", route: "/coming-soon/isl" },
    { label: "British Sign Language", route: "/coming-soon/bsl" },
    { label: "Dynamic ASL", route: "/coming-soon/dynamic-asl" },
    { label: "Settings", route: "/coming-soon/settings" },
  ];

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <View style={styles.header}>
          <ImageBackground
            source={require("../../../assets/images/hearthstone-header.png")}
            style={styles.headerImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["transparent", "rgba(10,42,107,0.5)", COLORS.bg]}
              style={styles.headerFade}
            />
          </ImageBackground>
        </View>

        <View style={styles.body}>
          {/* Hero */}
          <GlowButton
            radius={24}
            style={styles.hero}
            contentStyle={styles.heroInner}
            onPress={() => router.push("/camera")}
          >
            <View style={styles.heroIcon}>
              <Ionicons name="scan-outline" size={26} color="#fff" />
            </View>
            <Text style={styles.eyebrow}>LIVE</Text>
            <Text style={styles.heroTitle}>AI Model</Text>
            <Text style={styles.subtitle}>Real-time sign detection</Text>
          </GlowButton>

          {/* Live features as full-width rows */}
          {live.map((item) => (
            <GlowButton
              key={item.label}
              radius={20}
              style={styles.row}
              contentStyle={styles.rowInner}
              onPress={item.action}
            >
              <View style={styles.iconWrap}>
                <Ionicons name={item.icon} size={22} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eyebrow}>{item.tag}</Text>
                <Text style={styles.rowTitle}>{item.label}</Text>
                <Text style={styles.subtitle}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
            </GlowButton>
          ))}

          <Text style={styles.sectionLabel}>Coming Soon</Text>

          {soon.map((item) => (
            <GlowButton
              key={item.label}
              radius={14}
              style={styles.soonRow}
              contentStyle={styles.soonInner}
              onPress={() => router.push(item.route as any)}
            >
              <Text style={styles.soonText}>{item.label}</Text>
              <View style={styles.pill}>
                <Text style={styles.pillText}>SOON</Text>
              </View>
            </GlowButton>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  header: { width: "100%", height: 240, backgroundColor: COLORS.bg },
  headerImage: { flex: 1, justifyContent: "flex-end" },
  headerFade: { position: "absolute", bottom: 0, left: 0, right: 0, height: 140 },

  body: { paddingHorizontal: 20, gap: 12 },

  hero: {
    height: 170,
    backgroundColor: COLORS.surfaceStrong,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroInner: { padding: 22, justifyContent: "flex-end" },
  heroIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: { color: "#fff", fontSize: 28, fontWeight: "700" },

  row: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rowInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  eyebrow: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  subtitle: { color: COLORS.muted, fontSize: 13, marginTop: 3 },

  sectionLabel: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 18,
    marginLeft: 4,
  },
  soonRow: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  soonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  soonText: { color: "#D5E1F7", fontSize: 15, fontWeight: "600" },
  pill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  pillText: { color: COLORS.muted, fontSize: 10, fontWeight: "700", letterSpacing: 0.8 },
});