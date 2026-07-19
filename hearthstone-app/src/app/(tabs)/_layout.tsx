import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Linking } from "react-native";

const WEBSITE_URL = "https://projecthearthstone.in";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0d1017",
          borderTopColor: "#263349",
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: "#4da3ff",
        tabBarInactiveTintColor: "#5c7291",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "house.fill", android: "home", web: "home" }}
              tintColor={color}
              size={22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="website"
        options={{
          title: "Website",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "globe", android: "public", web: "globe" }}
              tintColor={color}
              size={22}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            // Don't navigate to an in-app screen — open the real site instead.
            e.preventDefault();
            Linking.openURL(WEBSITE_URL);
          },
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: "Contact",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "envelope.fill", android: "mail", web: "mail" }}
              tintColor={color}
              size={22}
            />
          ),
        }}
      />
    </Tabs>
  );
}
