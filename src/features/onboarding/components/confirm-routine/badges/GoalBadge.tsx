// features/onboarding/components/badges/GoalBadge.tsx

import { GOAL_CONFIG } from "@/features/onboarding/constants/onboarding.constants";
import { GoalId } from "@/features/onboarding/type/onboarding.type";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface GoalBadgeProps {
  goal: string | null;
  isDark: boolean;
}

export function GoalBadge({ goal, isDark }: GoalBadgeProps) {
  if (!goal) return null;

  // Type guard para verificar si es un GoalId válido
  const isValidGoal = (g: string): g is GoalId => g in GOAL_CONFIG;

  const config = isValidGoal(goal)
    ? GOAL_CONFIG[goal]
    : {
        label: goal.toUpperCase(),
        color: "#2ECFBE",
        icon: "star-outline",
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
