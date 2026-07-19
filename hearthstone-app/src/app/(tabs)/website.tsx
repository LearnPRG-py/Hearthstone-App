// This screen is never shown — the "Website" tab intercepts its press
// in (tabs)/_layout.tsx and opens projecthearthstone.in in the browser instead.
import { View } from "react-native";

export default function WebsiteTabPlaceholder() {
  return <View style={{ flex: 1, backgroundColor: "#121212" }} />;
}
