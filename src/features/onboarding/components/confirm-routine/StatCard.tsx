// features/onboarding/components/cards/StatCard.tsx
import { StatCardProps } from "@/features/onboarding/type/onboarding.type";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export function StatCard({
  icon,
  value,
  label,
  cardBg,
  borderColor,
  textColor,
  subColor,
  teal,
}: StatCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
      <Ionicons name={icon as any} size={18} color={teal} />
      <Text
        style={[styles.value, { color: textColor }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
      <Text style={[styles.label, { color: subColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
    textAlign: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 14,
  },
});
