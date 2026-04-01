import { useUserStore } from "@/features/auth/store/userStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppLayout() {
  const { theme } = useAppTheme();
  const user = useUserStore((s) => s.user);
  const insets = useSafeAreaInsets();

  if (!user) return <Redirect href="/(onboarding)" />;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        paddingTop: insets.top,
      }}
    >
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
    </View>
  );
}
