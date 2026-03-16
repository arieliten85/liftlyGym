import { GlobalLoader } from "@/shared/components/GlobalLoader";
import { ThemeProvider, useAppTheme } from "@/theme/ThemeProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
function NavigationStack() {
  const { theme, isDark } = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationStack />
        <Toast />
        <GlobalLoader />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
