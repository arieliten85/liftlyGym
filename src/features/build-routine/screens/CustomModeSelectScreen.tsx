import { CustomSubMode } from "@/types/routine";
import OnboardingLayout from "@/shared/components/OnboardingLayout";
import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const OPTIONS: {
  type: CustomSubMode;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  badge?: string;
}[] = [
  {
    type: "plan",
    title: "Plan Semanal",
    subtitle: "Organizá tu semana completa",
    icon: "calendar-week",
    badge: "RECOMENDADO",
  },
  {
    type: "single",
    title: "Sesión Única",
    subtitle: "Solo para hoy",
    icon: "lightning-bolt",
  },
];

export default function CustomModeSelectScreen() {
  const { theme, isDark } = useAppTheme();
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();

  const customSubMode = useBuildRoutineStore((s) => s.customSubMode);
  const setCustomSubMode = useBuildRoutineStore((s) => s.setCustomSubMode);

  const TEAL = theme.primary;

  const handleNext = () => {
    if (!customSubMode) return;
    if (customSubMode === "plan") {
      router.push(
        `/(onboarding)/(build-routine)/daysSelect?from=${from ?? "tabs"}`,
      );
    } else {
      router.push(
        `/(onboarding)/(build-routine)/muscleSelect?from=${from ?? "tabs"}`,
      );
    }
  };

  const handleBack = () => {
    if (from === "tabs") {
      router.replace("/(app)/(tabs)/routines");
    } else {
      router.back();
    }
  };

  return (
    <OnboardingLayout
      title="Modo Custom"
      onNext={handleNext}
      onBack={handleBack}
      isNextDisabled={!customSubMode}
      nextButtonText="Continuar"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? "#fff" : theme.text }]}>
            ¿Cómo querés entrenar?
          </Text>
        </View>

        {/* Cards — misma altura con flex:1 en cada una */}
        <View style={styles.cardsContainer}>
          {OPTIONS.map((option) => {
            const isSel = customSubMode === option.type;

            const cardBg = isSel
              ? isDark
                ? "#071310"
                : "#EBF9F7"
              : isDark
                ? "#0C1A18"
                : theme.card;
            const borderColor = isSel
              ? isDark
                ? "rgba(46,207,190,0.55)"
                : TEAL
              : isDark
                ? "rgba(46,207,190,0.15)"
                : theme.border;
            const iconColor = isSel
              ? TEAL
              : isDark
                ? "rgba(255,255,255,0.3)"
                : theme.textSecondary;
            const titleColor = isSel
              ? isDark
                ? "#fff"
                : theme.text
              : isDark
                ? "rgba(255,255,255,0.5)"
                : theme.textSecondary;
            const subColor = isSel
              ? isDark
                ? "rgba(255,255,255,0.5)"
                : theme.textSecondary
              : isDark
                ? "rgba(255,255,255,0.25)"
                : theme.textSecondary;

            return (
              <TouchableOpacity
                key={option.type}
                onPress={() => setCustomSubMode(option.type)}
                activeOpacity={0.85}
                style={[styles.card, { backgroundColor: cardBg, borderColor }]}
              >
                <View style={styles.cardInner}>
                  {/* Icon */}
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name={option.icon}
                      size={40}
                      color={iconColor}
                    />
                  </View>

                  {/* Title + Subtitle */}
                  <Text style={[styles.cardTitle, { color: titleColor }]}>
                    {option.title}
                  </Text>
                  <Text style={[styles.cardSub, { color: subColor }]}>
                    {option.subtitle}
                  </Text>

                  {/* Badge */}
                  {option.badge && (
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: isSel
                            ? isDark
                              ? "rgba(46,207,190,0.15)"
                              : "rgba(46,207,190,0.12)"
                            : "transparent",
                          borderColor: isSel
                            ? TEAL
                            : isDark
                              ? "rgba(255,255,255,0.1)"
                              : theme.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          {
                            color: isSel
                              ? TEAL
                              : isDark
                                ? "rgba(255,255,255,0.3)"
                                : theme.textSecondary,
                          },
                        ]}
                      >
                        {option.badge}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: token.spacing.xl,
  },
  header: {
    marginBottom: token.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  cardsContainer: {
    flex: 1,
    gap: token.spacing.md,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  cardInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: token.spacing.lg,
    gap: token.spacing.sm,
  },
  iconContainer: {
    marginBottom: token.spacing.xs,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  cardSub: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    opacity: 0.7,
  },
  badge: {
    marginTop: token.spacing.xs,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
});
