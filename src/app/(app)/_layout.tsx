import { useUserStore } from "@/features/auth/store/userStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const { theme } = useAppTheme();
  const user = useUserStore((s) => s.user);

  if (!user) return <Redirect href="/(onboarding)" />;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="routine"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}
