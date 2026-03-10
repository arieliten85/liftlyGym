import {
  EQUIPMENT_CAP,
  muscleOptions,
} from "@/features/onboarding/constants/onboarding.constants";

import { generateRoutineOnboarding } from "@/services/routineService";
import { Badge } from "@/shared/components/Badge";
import OnboardingLayout from "@/shared/components/OnboardingLayout";
import { StatBar } from "@/shared/components/StatBar";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useRoutineStore } from "@/store/useRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  ExperienceLevel,
  RoutineClassification,
} from "../type/onboarding.type";
import { getExercisesForMuscles } from "../utils/equipmentCalculator";
import { classifyRoutine } from "../utils/routineClassifier";

export default function ConfirmRoutineScreen() {
  const router = useRouter();

  const { theme, isDark } = useAppTheme();
  const goal = useOnboardingStore((s) => s.goal);
  const equipment = useOnboardingStore((s) => s.equipment);
  const experience = useOnboardingStore((s) => s.experience);
  const muscleGroups = useOnboardingStore((s) => s.muscleGroups);
  const source = useOnboardingStore((s) => s.source);

  const setRoutine = useRoutineStore((s) => s.setRoutine);
  const setLoading = useRoutineStore((s) => s.setLoading);
  const setError = useRoutineStore((s) => s.setError);

  const TEAL = theme.colors.primary;
  const textColor = isDark ? "#DFF0EE" : theme.colors.text;
  const subColor = isDark ? "#4A6A66" : theme.colors.textSecondary;
  const cardBg = isDark ? "#0C1119" : theme.colors.card;
  const borderColor = isDark ? "rgba(46,207,190,0.15)" : theme.colors.border;
  const accentBg = isDark ? "rgba(46,207,190,0.07)" : "rgba(46,207,190,0.06)";
  const accentBorder = isDark
    ? "rgba(46,207,190,0.2)"
    : "rgba(46,207,190,0.25)";

  const styles = createStyles();

  const classification = useMemo<RoutineClassification>(
    () =>
      classifyRoutine(
        muscleGroups,
        (experience ?? "principiante") as ExperienceLevel,
      ),
    [muscleGroups, experience],
  );
  const muscleLabels = useMemo(
    () =>
      muscleGroups
        .map((id) => muscleOptions.find((m) => m.id === id)?.title ?? id)
        .join("  ·  "),
    [muscleGroups],
  );

  const handleConfirm = useCallback(async () => {
    try {
      setLoading(true);

      router.push("/generatingRoutine");

      const exercisesForMuscles = getExercisesForMuscles(
        equipment,
        muscleGroups,
        experience,
      );

      const maxExercisesPerSession =
        EQUIPMENT_CAP[experience ?? "principiante"] ?? 4;

      const payload = {
        source,
        goal,
        experience,
        muscleGroups,
        workoutExercises: exercisesForMuscles,
        exerciseVolumeMax: maxExercisesPerSession,
      };

      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const exercises = await generateRoutineOnboarding(payload);
      await delay(1000);

      console.log("------>response api", exercises);
      setRoutine({
        exercises,
        goal,
        experience,
        routineName: classification.routineLabel,
      });
    } catch (error) {
      console.error(error, "No se pudo generar la rutina");
      setError("No se pudo generar la rutina");
    } finally {
      setLoading(false);
    }
  }, [goal, equipment, experience, muscleGroups, source]);

  return (
    <OnboardingLayout
      title="Confirmá tu rutina"
      onNext={handleConfirm}
      isNextDisabled={false}
      nextButtonText="Confirmar y generar"
    >
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.heroCard,
              { backgroundColor: accentBg, borderColor: accentBorder },
            ]}
          >
            <View style={[styles.heroTopLine, { backgroundColor: TEAL }]} />

            <View style={styles.heroContent}>
              <View style={styles.badgesRow}>
                <Badge label={experience ?? "principiante"} color={TEAL} />
                <Badge label={goal ?? "objetivo"} color="#FF7A59" />
              </View>

              <Text style={[styles.routineLabel, { color: TEAL }]}>
                {classification.routineLabel}
              </Text>

              {classification.splitTags.length > 0 && (
                <View style={styles.tagsRow}>
                  {classification.splitTags.map((tag) => (
                    <Badge key={tag} label={tag} color={TEAL} subtle />
                  ))}
                </View>
              )}

              <Text
                style={[
                  styles.routineDescription,
                  { color: isDark ? "#B8D4D0" : textColor },
                ]}
              >
                {classification.routineDescription}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <StatBar
              icon="time-outline"
              value="40–60 min"
              label="por sesión"
              variant="card"
              cardBg={cardBg}
              borderColor={borderColor}
              textColor={textColor}
              subColor={subColor}
              accentColor={TEAL}
            />
            <StatBar
              icon="calendar-outline"
              value={`${classification.daysPerWeek[0]}–${classification.daysPerWeek[1]} días`}
              label="por semana"
              variant="card"
              cardBg={cardBg}
              borderColor={borderColor}
              textColor={textColor}
              subColor={subColor}
              accentColor={TEAL}
            />

            <StatBar
              icon="barbell-outline"
              value={`${classification.exercisesPerMuscle} ejerc.`}
              label="por músculo"
              variant="card"
              cardBg={cardBg}
              borderColor={borderColor}
              textColor={textColor}
              subColor={subColor}
              accentColor={TEAL}
            />
          </View>

          {/* ── Grupos musculares ──────────────────────────────────────── */}
          <View
            style={[styles.section, { backgroundColor: cardBg, borderColor }]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="body-outline" size={16} color={TEAL} />
              <Text style={[styles.sectionTitle, { color: TEAL }]}>
                Grupos musculares
              </Text>
            </View>
            <Text style={[styles.sectionBody, { color: textColor }]}>
              {muscleLabels}
            </Text>
          </View>

          {/* ── Tips ──────────────────────────────────────────────────── */}
          <View
            style={[styles.section, { backgroundColor: cardBg, borderColor }]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb-outline" size={16} color={TEAL} />
              <Text style={[styles.sectionTitle, { color: TEAL }]}>
                Buenas prácticas
              </Text>
            </View>
            <View style={styles.tipsList}>
              {classification.tips.map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <View style={[styles.tipDot, { backgroundColor: TEAL }]} />
                  <Text
                    style={[
                      styles.tipText,
                      { color: isDark ? "#B8D4D0" : textColor },
                    ]}
                  >
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </OnboardingLayout>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: { flex: 1 },
    particle: {
      position: "absolute",
      borderRadius: 2,
      backgroundColor: "#2ECFBE",
    },
    scroll: { flex: 1 },
    scrollContent: {
      gap: token.spacing.md,
      paddingBottom: token.spacing.xl,
    },

    // Hero
    heroCard: {
      borderRadius: 16,
      borderWidth: 1,
      overflow: "hidden",
    },
    heroTopLine: {
      height: 2,
      width: "55%",
      alignSelf: "center",
      opacity: 0.7,
      borderRadius: 1,
    },
    heroContent: {
      padding: token.spacing.lg,
      gap: token.spacing.sm,
    },
    badgesRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: token.spacing.xs,
    },
    routineLabel: {
      fontSize: 26,
      fontWeight: "900",
      letterSpacing: 0.5,
    },
    tagsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: token.spacing.xs,
    },
    routineDescription: {
      fontSize: token.typography.body,
      lineHeight: 22,
    },

    // Stats
    statsRow: {
      flexDirection: "row",
      gap: token.spacing.sm,
    },

    // Sections
    section: {
      borderRadius: 16,
      borderWidth: 1,
      padding: token.spacing.lg,
      gap: token.spacing.sm,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },
    sectionTitle: {
      fontSize: token.typography.bodySmall,
      fontWeight: "800",
      letterSpacing: 1,
    },
    sectionBody: {
      fontSize: token.typography.body,
      fontWeight: "600",
      lineHeight: 24,
    },

    // Tips
    tipsList: { gap: token.spacing.sm },
    tipRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
    },
    tipDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      marginTop: 7,
      flexShrink: 0,
    },
    tipText: {
      flex: 1,
      fontSize: token.typography.bodySmall,
      lineHeight: 20,
    },
  });
