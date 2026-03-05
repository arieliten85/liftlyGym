import { ThemeProvider } from "@/theme/ThemeProvider";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#f3e4e4",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="goals"
            options={{
              headerShown: true,
              title: "Objetivos",
            }}
          />
          <Stack.Screen
            name="equipamiento"
            options={{
              headerShown: true,
              title: "Equipamiento",
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
