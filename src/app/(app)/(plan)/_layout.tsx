import { useAppTheme } from "@/theme/ThemeProvider";
import { Stack } from "expo-router";

export default function PlanLayout() {
  const { theme } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="[groupId]" options={{ headerShown: false }} />
    </Stack>
  );
}
