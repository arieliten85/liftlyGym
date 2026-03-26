import { useAppTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RoutineHeaderProps {
  title: string;
  onBack: () => void;
}

export function RoutineHeader({ title, onBack }: RoutineHeaderProps) {
  const { theme, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  const bg = isDark ? "#070B12" : theme.background;
  const borderColor = isDark ? "#1A1A1A" : theme.border;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: bg,
          borderBottomColor: borderColor,
        },
      ]}
    >
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.7}
        style={[
          styles.backBtn,
          {
            backgroundColor: "#eeeaea55",
            borderWidth: 1,
            borderColor: "#eeeaea75",
          },
        ]}
      >
        <Ionicons name="arrow-back" size={20} color="#eeeaea" />
      </TouchableOpacity>

      <Text style={[styles.title, { color: "#eeeaea" }]} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
    textAlign: "center",
    marginHorizontal: 8,
  },
  spacer: {
    width: 40,
  },
});
