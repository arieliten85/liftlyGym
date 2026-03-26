import { useAppTheme } from "@/theme/ThemeProvider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  color: string;
  subtle?: boolean;
};

export function Badge({ label, color, subtle = false }: Props) {
  const { isDark } = useAppTheme();

  const background = subtle
    ? isDark
      ? color + "55"
      : color + "45"
    : isDark
      ? color + "70"
      : color + "60";

  const border = subtle
    ? isDark
      ? color + "75"
      : color + "65"
    : isDark
      ? color + "90"
      : color + "80";

  const textColor = isDark ? color : color + "CC";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: background, borderColor: border },
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
    letterSpacing: 0.2,
  },
});
