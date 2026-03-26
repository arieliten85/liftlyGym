import OnboardingLayout from "@/shared/components/OnboardingLayout";
import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GOAL_OPTION_DATA } from "../constants/routine-builder.constants";

export default function GoalsScreen() {
  const { theme, isDark } = useAppTheme();
  const router = useRouter();

  const selectedGoal = useBuildRoutineStore((s) => s.goal);
  const setGoal = useBuildRoutineStore((s) => s.setGoal);
  const { from } = useLocalSearchParams<{ from?: string }>();

  const handleNext = () => {
    if (selectedGoal)
      router.push(`/(onboarding)/(build-routine)/equipment?from=${from}`);
  };

  // Si viene desde tabs → vuelve a rutinas
  // Si viene desde onboarding → back normal
  const handleBack = () => {
    if (from === "tabs") {
      router.replace("/(app)/(tabs)/rutinas");
    } else {
      router.back();
    }
  };

  const TEAL = theme.primary;
  const cardBg = isDark ? "#0C1119" : theme.card;
  const cardBgSel = isDark ? "#091714" : "#EBF9F7";
  const borderDef = isDark ? "rgba(46,207,190,0.15)" : theme.border;
  const borderSel = isDark ? "rgba(46,207,190,0.5)" : theme.primary;
  const textColor = isDark ? "#DFF0EE" : theme.text;
  const subColor = isDark ? "#4A6A66" : theme.textSecondary;
  const titleSel = TEAL;
  const descSel = isDark ? "#B8D4D0" : theme.text;

  const styles = createStyles(isDark, theme);

  return (
    <OnboardingLayout
      title="Objetivos"
      onNext={handleNext}
      onBack={handleBack}
      isNextDisabled={!selectedGoal}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            ¿Cuál es tu objetivo?
          </Text>
          <Text style={[styles.sectionSubtitle, { color: subColor }]}>
            Selecciona una opción para personalizar tu experiencia
          </Text>
        </View>

        <View style={styles.optionsWrapper}>
          <View style={styles.optionsContainer}>
            {GOAL_OPTION_DATA.map((goal) => {
              const isSelected = selectedGoal === goal.type;
              return (
                <TouchableOpacity
                  key={goal.type}
                  style={[
                    styles.goalCard,
                    { backgroundColor: cardBg, borderColor: borderDef },
                    isSelected && {
                      backgroundColor: cardBgSel,
                      borderColor: borderSel,
                      shadowColor: TEAL,
                    },
                  ]}
                  onPress={() => setGoal(goal.type)}
                  activeOpacity={0.8}
                >
                  {isSelected && (
                    <View
                      style={[styles.cardTopLine, { backgroundColor: TEAL }]}
                    />
                  )}

                  <View style={styles.cardContent}>
                    <View
                      style={[
                        styles.cardIconWrap,
                        {
                          backgroundColor: isSelected
                            ? isDark
                              ? "rgba(46,207,190,0.12)"
                              : "rgba(46,207,190,0.12)"
                            : isDark
                              ? "rgba(255,255,255,0.04)"
                              : "rgba(0,0,0,0.04)",
                          borderColor: isSelected
                            ? isDark
                              ? "rgba(46,207,190,0.35)"
                              : "rgba(46,207,190,0.4)"
                            : isDark
                              ? "rgba(255,255,255,0.06)"
                              : theme.border,
                        },
                      ]}
                    >
                      <Feather
                        name="target"
                        size={20}
                        color={isSelected ? TEAL : subColor}
                      />
                    </View>

                    <View style={styles.cardText}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.goalTitle,
                          { color: isSelected ? titleSel : textColor },
                        ]}
                      >
                        {goal.title}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.goalDescription,
                          { color: isSelected ? descSel : subColor },
                        ]}
                      >
                        {goal.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </View>
    </OnboardingLayout>
  );
}

const createStyles = (isDark: boolean, theme: any) =>
  StyleSheet.create({
    container: { flex: 1 },
    particle: {
      position: "absolute",
      borderRadius: 2,
      backgroundColor: "#2ECFBE",
    },
    headerContainer: {
      marginBottom: token.spacing.xl,
      marginTop: token.spacing.xs,
    },
    sectionTitle: {
      fontSize: token.typography.h2,
      fontWeight: "bold",
      textAlign: "left",
      marginBottom: token.spacing.xs / 2,
    },
    sectionSubtitle: {
      fontSize: token.typography.bodySmall,
      textAlign: "left",
      lineHeight: 20,
    },
    optionsWrapper: { flex: 1, justifyContent: "flex-start" },
    optionsContainer: { gap: token.spacing.md },
    goalCard: {
      width: "100%",
      borderRadius: 16,
      borderWidth: 1,
      overflow: "hidden",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    cardTopLine: {
      height: 1.5,
      width: "70%",
      alignSelf: "center",
      opacity: 0.6,
      borderRadius: 1,
    },
    cardContent: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: token.spacing.lg,
      paddingVertical: token.spacing.md,
      gap: token.spacing.md,
    },
    cardIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
    },
    cardText: { flex: 1 },
    goalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      letterSpacing: 0.5,
      textAlign: "left",
      marginBottom: 3,
    },
    goalDescription: {
      fontSize: token.typography.bodySmall,
      textAlign: "left",
      lineHeight: 18,
    },
    checkBadge: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    bottomSpacer: { height: token.spacing.sm },
  });
