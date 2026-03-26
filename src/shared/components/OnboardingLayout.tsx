import { ParticleBackground } from "@/features/build-routine/components/ParticleBackground";
import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "./PrimaryButton";

interface OnboardingLayoutProps {
  children: ReactNode;
  title: string;
  onNext: () => void;
  isNextDisabled?: boolean;
  nextButtonText?: string;
  onBack?: () => void;
}

export default function OnboardingLayout({
  children,
  title,
  onNext,
  isNextDisabled = true,
  nextButtonText = "Siguiente",
  onBack,
}: OnboardingLayoutProps) {
  const { theme, isDark } = useAppTheme();

  const glowAlpha = isDark ? "rgba(46,207,190,0.15)" : "rgba(46,207,190,0.08)";

  return (
    <>
      <Stack.Screen
        options={{
          title,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: token.typography.h3,
          },
          ...(onBack
            ? {
                headerBackVisible: false,
                gestureEnabled: false,
                headerLeft: () => (
                  <TouchableOpacity
                    onPress={onBack}
                    activeOpacity={0.7}
                    style={styles.backBtn}
                  >
                    <Feather name="arrow-left" size={22} color={theme.text} />
                  </TouchableOpacity>
                ),
              }
            : {
                headerBackTitle: "Atrás",
              }),
        }}
      />

      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
        edges={[]}
      >
        <ParticleBackground isDark={isDark} glowAlpha={glowAlpha} />

        <View style={styles.content}>
          <View style={styles.childrenContainer}>{children}</View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              label={nextButtonText}
              onPress={onNext}
              disabled={isNextDisabled}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: "relative" },
  content: {
    flex: 1,
    paddingHorizontal: token.spacing.lg,
    paddingTop: token.spacing.lg,
    zIndex: 2,
  },
  childrenContainer: { flex: 1 },
  buttonContainer: { marginBottom: token.spacing.md },
  backBtn: { paddingHorizontal: 8, paddingVertical: 4 },
});
