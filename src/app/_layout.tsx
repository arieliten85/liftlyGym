import { useUserStore } from "@/features/auth/store/userStore";
import { GlobalLoader } from "@/shared/components/GlobalLoader";
import { ThemeProvider, useAppTheme } from "@/theme/ThemeProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

function NavigationStack() {
  const { theme, isDark } = useAppTheme();
  const restoreSession = useUserStore((s) => s.restoreSession);
  const isRestoring = useUserStore((s) => s.isRestoring);

  useEffect(() => {
    restoreSession();
  }, []);

  if (isRestoring) return null;

  return (
    <>
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor={theme.background}
        translucent={false}
      />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </>
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
