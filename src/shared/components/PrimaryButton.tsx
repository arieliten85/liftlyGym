import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  iconLeft?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  fullWidth = true,
  iconLeft,
  iconRight,
}: PrimaryButtonProps) {
  const { theme } = useAppTheme();

  const iconColor = disabled
    ? theme.colors.textSecondary
    : theme.colors.onPrimary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.82}
      style={[
        styles.btn,
        fullWidth && styles.fullWidth,
        {
          backgroundColor: theme.colors.primary,
          shadowColor: theme.colors.primary,
        },
        disabled && { backgroundColor: theme.colors.border, shadowOpacity: 0 },
      ]}
    >
      {iconLeft && <Ionicons name={iconLeft} size={20} color={iconColor} />}
      <Text
        style={[
          styles.label,
          { color: theme.colors.onPrimary },
          disabled && { color: theme.colors.textSecondary },
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
    shadowRadius: 16,
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
