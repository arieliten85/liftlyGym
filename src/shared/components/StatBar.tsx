import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Variant = "inline" | "card";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  variant?: Variant;

  // inline
  color?: string;

  // card
  cardBg?: string;
  borderColor?: string;
  textColor?: string;
  subColor?: string;
  accentColor?: string;
};

export function StatBar({
  icon,
  value,
  label,
  variant = "inline",

  color,

  cardBg,
  borderColor,
  textColor,
  subColor,
  accentColor,
}: Props) {
  if (variant === "card") {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor: borderColor,
          },
        ]}
      >
        <Ionicons name={icon} size={18} color={accentColor} />

        <Text
          style={[styles.cardValue, { color: textColor }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </Text>

        <Text style={[styles.cardLabel, { color: subColor }]}>{label}</Text>
      </View>
    );
  }

  return (
    <View style={styles.inline}>
      <Ionicons name={icon} size={13} color={color} />
      <Text style={[styles.inlineValue, { color }]}>{value}</Text>
      <Text style={[styles.inlineLabel, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  inlineValue: {
    fontSize: 13,
    fontWeight: "700",
  },

  inlineLabel: {
    fontSize: 12,
    fontWeight: "500",
  },

  card: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 4,
  },

  cardValue: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
    textAlign: "center",
  },

  cardLabel: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 14,
  },
});
