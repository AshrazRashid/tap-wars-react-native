import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Dimensions, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Define your color palette
const confettiColors = ["#FFD600", "#FF61A6", "#3DA9FC", "#00D084", "#FF9100"];

// Custom square component for confetti
const SquareConfetti = ({ color }) => (
  <View
    style={{
      width: 16,
      height: 16,
      backgroundColor: color,
      borderRadius: 2, // slight rounding, or set to 0 for sharp squares
    }}
  />
);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <ConfettiCannon
        ref={confettiRef}
        count={150}
        origin={{ x: Dimensions.get("window").width / 2, y: height / 2 }}
        autoStart={false}
        fadeOut
        fallSpeed={2000}
        colors={confettiColors}
        fallingComponent={({ color }) => <SquareConfetti color={color} />}
      />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
