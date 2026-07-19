import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";

const EMAIL = "theprojecthearthstone@gmail.com";
const WEBSITE_URL = "https://projecthearthstone.in";
const LINKEDIN_URL = "https://www.linkedin.com/company/110919707";
const INSTAGRAM_URL = "https://www.instagram.com/projecthearthstone";
const YOUTUBE_URL = "https://www.youtube.com/@ProjectHearthstone-NGO";

type ContactLink = {
  label: string;
  value: string;
  action: () => void;
};

export default function Contact() {
  const links: ContactLink[] = [
    {
      label: "Email",
      value: EMAIL,
      action: () => Linking.openURL(`mailto:${EMAIL}`),
    },
    {
      label: "Website",
      value: "projecthearthstone.in",
      action: () => Linking.openURL(WEBSITE_URL),
    },
    {
      label: "LinkedIn",
      value: "Project Hearthstone",
      action: () => Linking.openURL(LINKEDIN_URL),
    },
    {
      label: "Instagram",
      value: "@projecthearthstone",
      action: () => Linking.openURL(INSTAGRAM_URL),
    },
    {
      label: "YouTube",
      value: "@ProjectHearthstone-NGO",
      action: () => Linking.openURL(YOUTUBE_URL),
    },
  ];

  return (
    <View style={styles.root}>
      <Text style={styles.heading}>Get in touch</Text>
      <View style={styles.list}>
        {links.map((link) => (
          <TouchableOpacity
            key={link.label}
            style={styles.row}
            activeOpacity={0.7}
            onPress={link.action}
          >
            <Text style={styles.rowLabel}>{link.label}</Text>
            <Text style={styles.rowValue}>{link.value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 80,
    paddingHorizontal: "6%",
  },
  heading: { color: "#fff", fontSize: 24, fontWeight: "700", marginBottom: 24 },
  list: { gap: 12 },
  row: {
    borderRadius: 14,
    backgroundColor: "#161a22",
    borderWidth: 1,
    borderColor: "#263349",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  rowLabel: {
    color: "#5c7291",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  rowValue: { color: "#eaf2ff", fontSize: 15, fontWeight: "600" },
});
