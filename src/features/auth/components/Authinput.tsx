import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface ThemeColors {
  primary: string;
  text: string;
  textSecondary: string;
  border: string;
  surface: string;
}

interface AuthInputProps extends TextInputProps {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  colors: ThemeColors;
  isDark: boolean;
  isPassword?: boolean;
  error?: string;
}

export function AuthInput({
  label,
  icon,
  colors,
  isDark,
  isPassword = false,
  error,
  value,
  onFocus,
  onBlur,
  ...rest
}: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setFocused(true);
    Animated.parallel([
      Animated.timing(labelAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setFocused(false);
    if (!value) {
      Animated.timing(labelAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
    }
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.(e);
  };

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 0],
  });
  const labelSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 11],
  });
  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textSecondary, colors.primary],
  });

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [isDark ? "#2A2E36" : "#E5E7EB", colors.primary],
  });

  return (
    <View style={styles.wrap}>
      <Animated.View
        style={[
          styles.field,
          { borderBottomColor: error ? "#EF4444" : borderColor },
        ]}
      >
        {/* Label flotante */}
        <Animated.Text
          style={[
            styles.label,
            {
              top: labelTop,
              fontSize: labelSize,
              color: error ? "#EF4444" : labelColor,
            },
          ]}
        >
          {label}
        </Animated.Text>

        <View style={styles.row}>
          <Feather
            name={icon}
            size={18}
            color={focused ? colors.primary : colors.textSecondary}
            style={styles.icon}
          />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholderTextColor="transparent"
            secureTextEntry={isPassword && !showPassword}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoCapitalize="none"
            autoCorrect={false}
            {...rest}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
              style={styles.eyeBtn}
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  field: {
    borderBottomWidth: 1.5,
    paddingBottom: 10,
    paddingTop: 22,
    position: "relative",
  },
  label: {
    position: "absolute",
    left: 34,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: { width: 20 },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: Platform.OS === "ios" ? 2 : 0,
    letterSpacing: 0.1,
  },
  eyeBtn: {
    padding: 4,
  },
  error: {
    fontSize: 12,
    fontWeight: "500",
    color: "#EF4444",
    marginLeft: 30,
    marginTop: 2,
  },
});
