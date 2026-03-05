import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { Stack } from "expo-router";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "./PrimaryButton";

interface OnboardingLayoutProps {
  children: ReactNode;
  title: string;
  onNext: () => void;
  isNextDisabled?: boolean;
  nextButtonText?: string;
}

export default function OnboardingLayout({
  children,
  title,
  onNext,
  isNextDisabled = true,
  nextButtonText = "Siguiente",
}: OnboardingLayoutProps) {
  const { theme } = useAppTheme();

  return (
    <>
      <Stack.Screen
        options={{
          title,
          headerBackTitle: "Atrás",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: token.typography.h3,
          },
        }}
      />

      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={[]}
      >
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
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: token.spacing.lg,
    paddingTop: token.spacing.lg,
  },
  childrenContainer: { flex: 1 },
  buttonContainer: {
    marginBottom: token.spacing.md,
  },
});
