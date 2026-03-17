import { GlobalLoader } from "@/shared/components/GlobalLoader";
import { ThemeProvider, useAppTheme } from "@/theme/ThemeProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

function NavigationStack() {
  const { theme, isDark } = useAppTheme();

  return (
    <>
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor={theme.colors.background}
        translucent={false}
      />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        {/* ── Raíz ── */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* ── Auth: back gestual habilitado hacia onboarding ── */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />

        {/* ── Tabs: sin header, sin back, sin gesture (es la raíz post-login) ── */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        {/* ── Flujo de onboarding/build-routine ── */}
        <Stack.Screen name="goals" options={{ title: "Objetivos" }} />
        <Stack.Screen name="equipment" options={{ title: "Equipamiento" }} />
        <Stack.Screen name="experience" options={{ title: "Experiencia" }} />
        <Stack.Screen
          name="confirmRoutine"
          options={{ title: "Confirmar rutina" }}
        />
        <Stack.Screen
          name="generatingRoutine"
          options={{ headerShown: false, gestureEnabled: false }}
        />

        {/* ── Ejecución de rutina ── */}
        <Stack.Screen
          name="routine"
          options={{ headerShown: false, gestureEnabled: false }}
        />
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
