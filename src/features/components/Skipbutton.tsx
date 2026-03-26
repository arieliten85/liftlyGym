import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface SkipButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  iconLeft?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
}

export function SkipButton({
  label,
  onPress,
  disabled = false,
  fullWidth = true,
  iconLeft,
  iconRight,
}: SkipButtonProps) {
  const { theme } = useAppTheme();
  const skipColor = "#EF4444";
  const iconColor = disabled ? theme.textSecondary : skipColor;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.82}
      style={[
        styles.btn,
        fullWidth && styles.fullWidth,
        {
          backgroundColor: skipColor + "15",
          borderColor: skipColor + "35",
        },
        disabled && {
          backgroundColor: theme.border,
          borderColor: theme.border,
        },
      ]}
    >
      {iconLeft && <Ionicons name={iconLeft} size={20} color={iconColor} />}
      <Text
        style={[
          styles.label,
          { color: skipColor },
          disabled && { color: theme.textSecondary },
        ]}
      >
        {label}
      </Text>
      {iconRight && <Ionicons name={iconRight} size={20} color={iconColor} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: token.spacing.md,
    borderRadius: token.radius.round,
    borderWidth: 1.5,
  },
  fullWidth: {
    width: "100%",
  },
  label: {
    fontSize: token.typography.button,
    fontWeight: "700",
    letterSpacing: 0.2,
    textAlign: "center",
  },
});
