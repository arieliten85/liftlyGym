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
      ? color + "20"
      : color + "12"
    : isDark
      ? color + "30"
      : color + "18";

  const border = subtle
    ? isDark
      ? color + "35"
      : color + "20"
    : isDark
      ? color + "45"
      : color + "30";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: background,
          borderColor: border,
        },
      ]}
    >
      <Text style={[styles.text, { color }]}>{label}</Text>
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
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
