import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import GlowButton from "../components/GlowButton"; // adjust path
import { COLORS } from "../constants/theme"; // adjust path

export default function TranscribeScreen() {
  const [listening, setListening] = useState(false);
  const [finalText, setFinalText] = useState(""); // committed phrases
  const [interim, setInterim] = useState(""); // live, still-changing phrase
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  // ---- Speech recognition events ----
  useSpeechRecognitionEvent("start", () => setListening(true));
  useSpeechRecognitionEvent("end", () => {
    setListening(false);
    setInterim("");
  });
  useSpeechRecognitionEvent("result", (event) => {
    const text = event.results[0]?.transcript ?? "";
    if (event.isFinal) {
      setFinalText((prev) => (prev ? prev + " " : "") + text);
      setInterim("");
    } else {
      setInterim(text);
    }
  });
  useSpeechRecognitionEvent("error", (event) => {
    setListening(false);
    setError(event.message || event.error);
  });

  // ---- Start / stop ----
  const toggle = useCallback(async () => {
    setError(null);

    if (listening) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }

    const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!perm.granted) {
      setError("Microphone access is off. Turn it on in Settings to transcribe.");
      return;
    }

    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true, // real-time partial results
      continuous: true, // keep listening through pauses
    });
  }, [listening]);

  const clear = () => {
    setFinalText("");
    setInterim("");
    setError(null);
  };

  // ---- Pulse animation while listening ----
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!listening) {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [listening, pulse]);

  const ring = (delay: number) => ({
    opacity: pulse.interpolate({
      inputRange: [0, 0.2 + delay, 1],
      outputRange: [0, 0.35, 0],
    }),
    transform: [
      {
        scale: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2.2 + delay * 2],
        }),
      },
    ],
  });

  const hasText = finalText.length > 0 || interim.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <Text style={[styles.label, listening && { color: COLORS.accent }]}>
          {listening ? "LIVE" : "READY"}
        </Text>
        <Text style={styles.title}>Transcriber</Text>
        <Text style={styles.subtitle}>
          {listening ? "Listening…" : "Tap the mic and start speaking"}
        </Text>
      </View>

      {/* Transcript */}
      <View style={styles.panel}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.panelContent}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {hasText ? (
            <Text style={styles.transcript}>
              {finalText}
              {interim ? (
                <Text style={styles.interim}>
                  {finalText ? " " : ""}
                  {interim}
                </Text>
              ) : null}
            </Text>
          ) : (
            <Text style={styles.placeholder}>
              Your words will appear here as you speak.
            </Text>
          )}
        </ScrollView>

        {hasText && !listening && (
          <GlowButton
            radius={12}
            onPress={clear}
            hitSlop={8}
            style={styles.clearBtn}
            contentStyle={styles.clearInner}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.muted} />
            <Text style={styles.clearText}>Clear</Text>
          </GlowButton>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {/* Mic button */}
      <View style={styles.micArea}>
        <Animated.View style={[styles.ring, ring(0)]} />
        <Animated.View style={[styles.ring, ring(0.15)]} />
        <GlowButton
          radius={MIC_SIZE / 2}
          onPress={toggle}
          accessibilityRole="button"
          accessibilityLabel={listening ? "Stop transcribing" : "Start transcribing"}
          style={[styles.micBtn, listening && styles.micBtnActive]}
          contentStyle={styles.micInner}
        >
          <Ionicons name={listening ? "stop" : "mic"} size={44} color="#fff" />
        </GlowButton>
      </View>

      <Text style={styles.hint}>
        {listening ? "Tap to stop" : "Tap to start"}
      </Text>
    </SafeAreaView>
  );
}

const MIC_SIZE = 96;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 12 },
  label: { color: COLORS.muted, fontSize: 12, fontWeight: "700", letterSpacing: 1.5 },
  title: { color: COLORS.text, fontSize: 28, fontWeight: "700", marginTop: 6 },
  subtitle: { color: COLORS.muted, fontSize: 15, marginTop: 4 },

  panel: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 24,
  },
  panelContent: { padding: 20, paddingBottom: 60, flexGrow: 1 },
  transcript: { color: COLORS.text, fontSize: 20, lineHeight: 30 },
  interim: { color: COLORS.accent },
  placeholder: { color: COLORS.muted, fontSize: 17, lineHeight: 26 },

  clearBtn: {
    position: "absolute",
    right: 14,
    bottom: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  clearInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearText: { color: COLORS.muted, fontSize: 13 },

  error: {
    color: COLORS.danger,
    textAlign: "center",
    marginTop: 12,
    marginHorizontal: 24,
    fontSize: 14,
  },

  micArea: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: MIC_SIZE,
    height: MIC_SIZE,
    borderRadius: MIC_SIZE / 2,
    backgroundColor: COLORS.accent,
  },
  micBtn: {
    width: MIC_SIZE,
    height: MIC_SIZE,
    backgroundColor: COLORS.primary,
  },
  micInner: { alignItems: "center", justifyContent: "center" },
  micBtnActive: { backgroundColor: "#2563EB" },
  hint: {
    color: COLORS.muted,
    textAlign: "center",
    fontSize: 14,
    marginTop: -24,
    marginBottom: 24,
  },
});