// features/onboarding/components/badges/LevelBadge.tsx

import { LEVEL_CONFIG } from "@/features/onboarding/constants/onboarding.constants";
import { LevelId } from "@/features/onboarding/type/onboarding.type";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface LevelBadgeProps {
  level: string;
  isDark: boolean;
  teal: string;
}

export function LevelBadge({ level, isDark, teal }: LevelBadgeProps) {
  const isValidLevel = (l: string): l is LevelId => l in LEVEL_CONFIG;

  const config = isValidLevel(level)
    ? LEVEL_CONFIG[level]
    : {
        label: level.toUpperCase(),
        color: teal,
        icon: "person-outline",
      };

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: isDark ? `${config.color}15` : `${config.color}12`,
          borderColor: isDark ? `${config.color}40` : `${config.color}30`,
        },
      ]}
    >
      <Ionicons name={config.icon as any} size={12} color={config.color} />
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
});
