import { ThemeProvider, useAppTheme } from "@/theme/ThemeProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

function NavigationStack() {
  const { theme, isDark } = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor={theme.colors.background}
        translucent={false}
      />

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Screen
          name="goals"
          options={{
            title: "Objetivos",
          }}
        />

        <Stack.Screen
          name="equipamiento"
          options={{
            title: "Equipamiento",
          }}
        />

        <Stack.Screen
          name="generatingRoutine"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="routine"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationStack />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
