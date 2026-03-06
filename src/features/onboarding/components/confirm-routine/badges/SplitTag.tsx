// features/onboarding/components/badges/SplitTag.tsx
import { SplitTagProps } from "@/features/onboarding/type/onboarding.type";
import { StyleSheet, Text, View } from "react-native";

export function SplitTag({ tag, isDark, teal, accentBorder }: SplitTagProps) {
  return (
    <View
      style={[
        styles.tag,
        {
          backgroundColor: isDark
            ? "rgba(46,207,190,0.10)"
            : "rgba(46,207,190,0.08)",
          borderColor: accentBorder,
        },
      ]}
    >
      <Text style={[styles.text, { color: teal }]}>{tag}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
});
