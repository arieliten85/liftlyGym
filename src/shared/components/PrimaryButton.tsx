import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  fullWidth = true,
}: PrimaryButtonProps) {
  const { theme } = useAppTheme();

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
      <Text
        style={[
          styles.label,
          { color: theme.colors.onPrimary },
          disabled && { color: theme.colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: token.spacing.md,
    borderRadius: token.radius.round,
    alignItems: "center",
    justifyContent: "center",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.35,
    shadowRadius: 16,
    // elevation: 10,
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
