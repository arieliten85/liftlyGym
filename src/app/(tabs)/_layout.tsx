import AppHeader from "@/features/components/AppHeader";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <AppHeader />
      <Tabs>
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
  container: { flex: 1, backgroundColor: "#fff" },
});
