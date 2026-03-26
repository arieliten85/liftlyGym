import AppHeader from "@/features/components/AppHeader";
import { useAppTheme } from "@/theme/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TabsLayout() {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader />
      <Tabs
        screenOptions={{
          tabBarStyle: { backgroundColor: theme.background },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
        }}
      >
        <Tabs.Screen
          name="rutinas"
          options={{
            title: "Rutinas",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-tie-outline"
                color={color}
                size={size}
              />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="progresos"
          options={{
            title: "Progresos",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="chart-line"
                color={color}
                size={size}
              />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
            headerShown: false,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
