// app/(onboarding)/(build-routine)/_layout.tsx
// Flujo lineal. Gestos habilitados en todos menos generating.
import { useAppTheme } from "@/theme/ThemeProvider";
import { Stack } from "expo-router";

export default function BuildRoutineLayout() {
  const { theme } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen name="goals" options={{ title: "Objetivos" }} />
      <Stack.Screen name="splitSelect" options={{ title: "Tipo de rutina" }} />
      <Stack.Screen name="equipment" options={{ title: "Equipamiento" }} />
      <Stack.Screen name="experience" options={{ title: "Experiencia" }} />
      <Stack.Screen name="confirm" options={{ title: "Confirmar rutina" }} />
      <Stack.Screen
        name="generating"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}
