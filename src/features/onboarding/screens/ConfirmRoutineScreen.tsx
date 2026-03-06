import {
  EQUIPMENT_CAP,
  muscleOptions,
} from "@/features/onboarding/constants/onboarding.constants";

import OnboardingLayout from "@/shared/components/OnboardingLayout";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { GoalBadge } from "../components/confirm-routine/badges/GoalBadge";
import { LevelBadge } from "../components/confirm-routine/badges/LevelBadge";
import { SplitTag } from "../components/confirm-routine/badges/SplitTag";
import { StatCard } from "../components/confirm-routine/StatCard";
import {
  ExperienceLevel,
  RoutineClassification,
} from "../type/onboarding.type";
import { resolveEquipmentIds } from "../utils/equipmentCalculator";
import { classifyRoutine } from "../utils/routineClassifier";

export default function ConfirmRoutineScreen() {
  const { theme, isDark } = useAppTheme();
  const goal = useOnboardingStore((s) => s.goal);
  const equipment = useOnboardingStore((s) => s.equipment);
  const experience = useOnboardingStore((s) => s.experience);
  const muscleGroups = useOnboardingStore((s) => s.muscleGroups);
  const source = useOnboardingStore((s) => s.source);
  const trainingCategories = useOnboardingStore((s) => s.routine);

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

  // Arma y cosolea la rutina generada
  const handleConfirm = useCallback(() => {
    const resolvedEquipment = resolveEquipmentIds(
      equipment,
      muscleGroups,
      experience,
    );
    const maxExercisesPerSession =
      EQUIPMENT_CAP[experience ?? "principiante"] ?? 4;

    const payload = {
      goal,
      equipment,
      experience,
      muscleGroups,
      source,
      trainingCategories,
      workoutExercises: resolvedEquipment,
      exerciseVolumeMax: maxExercisesPerSession,
      routineClassification: {
        splitTags: classification.splitTags[0],
        duration: `${classification.durationMin} a ${classification.durationMax} minutos`,
        daysPerWeek: classification.daysLabel,
        exercisesPerMuscle: classification.exercisesPerMuscle,
      },
    };

    console.log(
      "=== ONBOARDING PAYLOAD ===\n",
      JSON.stringify(payload, null, 2),
    );
  }, [
    goal,
    equipment,
    experience,
    muscleGroups,
    source,
    trainingCategories,
    classification,
  ]);

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
                <LevelBadge
                  level={experience ?? "principiante"}
                  isDark={isDark}
                  teal={TEAL}
                />
                <GoalBadge goal={goal} isDark={isDark} />
              </View>

              <Text style={[styles.routineLabel, { color: TEAL }]}>
                {classification.routineLabel}
              </Text>

              {classification.splitTags.length > 0 && (
                <View style={styles.tagsRow}>
                  {classification.splitTags.map((tag) => (
                    <SplitTag
                      key={tag}
                      tag={tag}
                      isDark={isDark}
                      teal={TEAL}
                      accentBorder={accentBorder}
                    />
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
            <StatCard
              icon="time-outline"
              value={`${classification.durationMin}–${classification.durationMax} min`}
              label="por sesión"
              cardBg={cardBg}
              borderColor={borderColor}
              textColor={textColor}
              subColor={subColor}
              teal={TEAL}
            />
            <StatCard
              icon="calendar-outline"
              value={`${classification.daysPerWeek[0]}–${classification.daysPerWeek[1]} días`}
              label="por semana"
              cardBg={cardBg}
              borderColor={borderColor}
              textColor={textColor}
              subColor={subColor}
              teal={TEAL}
            />
            <StatCard
              icon="barbell-outline"
              value={`${classification.exercisesPerMuscle} ejerc.`}
              label="por músculo"
              cardBg={cardBg}
              borderColor={borderColor}
              textColor={textColor}
              subColor={subColor}
              teal={TEAL}
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
