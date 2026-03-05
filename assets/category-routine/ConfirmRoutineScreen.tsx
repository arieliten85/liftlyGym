// src/feature/onboarding/screens/ConfirmRoutineScreen.tsx

import { muscleOptions } from "@/data/mock.data";
import OnboardingLayout from "@/shared/components/OnboardingLayout";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import {
  classifyRoutine,
  ExperienceLevel,
  RoutineClassification,
} from "@/utils/routineClassifier";
import { CATEGORY_OPTIONS } from "@/utils/trainingCategoryRules";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

// ─── GoalBadge ────────────────────────────────────────────────────────────────

function GoalBadge({ goal, isDark }: { goal: string | null; isDark: boolean }) {
  if (!goal) return null;

  const config: Record<string, { label: string; color: string; icon: string }> =
    {
      fuerza: { label: "FUERZA", color: "#F97316", icon: "barbell-outline" },
      hipertrofia: {
        label: "HIPERTROFIA",
        color: "#A78BFA",
        icon: "trending-up-outline",
      },
      resistencia: {
        label: "RESISTENCIA",
        color: "#38BDF8",
        icon: "pulse-outline",
      },
      perdida_de_peso: {
        label: "PÉRDIDA DE PESO",
        color: "#4ADE80",
        icon: "flame-outline",
      },
      definicion: {
        label: "DEFINICIÓN",
        color: "#FB923C",
        icon: "body-outline",
      },
      movilidad: {
        label: "MOVILIDAD",
        color: "#2ECFBE",
        icon: "walk-outline",
      },
    };

  const c = config[goal] ?? {
    label: goal.toUpperCase(),
    color: "#2ECFBE",
    icon: "star-outline",
  };

  return (
    <View
      style={[
        badgeStyles.pill,
        {
          backgroundColor: isDark ? `${c.color}15` : `${c.color}12`,
          borderColor: isDark ? `${c.color}40` : `${c.color}30`,
        },
      ]}
    >
      <Ionicons name={c.icon as any} size={12} color={c.color} />
      <Text style={[badgeStyles.text, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

// ─── LevelBadge ───────────────────────────────────────────────────────────────

function LevelBadge({
  level,
  isDark,
  teal,
}: {
  level: string;
  isDark: boolean;
  teal: string;
}) {
  const config = {
    principiante: {
      label: "PRINCIPIANTE",
      color: "#4ADE80",
      icon: "leaf-outline",
    },
    intermedio: {
      label: "INTERMEDIO",
      color: "#FACC15",
      icon: "flash-outline",
    },
    avanzado: { label: "AVANZADO", color: "#F97316", icon: "flame-outline" },
  }[level] ?? {
    label: level.toUpperCase(),
    color: teal,
    icon: "person-outline",
  };

  return (
    <View
      style={[
        badgeStyles.pill,
        {
          backgroundColor: isDark ? `${config.color}15` : `${config.color}12`,
          borderColor: isDark ? `${config.color}40` : `${config.color}30`,
        },
      ]}
    >
      <Ionicons name={config.icon as any} size={12} color={config.color} />
      <Text style={[badgeStyles.text, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  text: { fontSize: 11, fontWeight: "700", letterSpacing: 0.8 },
});

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
  cardBg,
  borderColor,
  textColor,
  subColor,
  teal,
  accent,
}: {
  icon: string;
  value: string;
  label: string;
  cardBg: string;
  borderColor: string;
  textColor: string;
  subColor: string;
  teal: string;
  accent?: string;
}) {
  return (
    <View style={[statStyles.card, { backgroundColor: cardBg, borderColor }]}>
      <Ionicons name={icon as any} size={18} color={accent ?? teal} />
      <Text
        style={[statStyles.value, { color: accent ?? textColor }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
      <Text style={[statStyles.label, { color: subColor }]}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
    textAlign: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 14,
  },
});

// ─── SplitTag ─────────────────────────────────────────────────────────────────

function SplitTag({
  tag,
  isDark,
  teal,
  accentBorder,
}: {
  tag: string;
  isDark: boolean;
  teal: string;
  accentBorder: string;
}) {
  return (
    <View
      style={[
        splitTagStyles.tag,
        {
          backgroundColor: isDark
            ? "rgba(46,207,190,0.10)"
            : "rgba(46,207,190,0.08)",
          borderColor: accentBorder,
        },
      ]}
    >
      <Text style={[splitTagStyles.text, { color: teal }]}>{tag}</Text>
    </View>
  );
}

const splitTagStyles = StyleSheet.create({
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function ConfirmRoutineScreen() {
  const { theme, isDark } = useAppTheme();
  const router = useRouter();

  const goal = useOnboardingStore((s) => s.goal);
  const muscleGroups = useOnboardingStore((s) => s.muscleGroups);
  const experience = useOnboardingStore((s) => s.experience);
  const trainingCategories = useOnboardingStore((s) => s.trainingCategories);

  const classification = useMemo<RoutineClassification>(() => {
    return classifyRoutine(
      muscleGroups,
      (experience ?? "principiante") as ExperienceLevel,
    );
  }, [muscleGroups, experience]);

  const categoryLabels = useMemo(() => {
    return trainingCategories
      .map((id) => CATEGORY_OPTIONS.find((c) => c.id === id)?.label ?? id)
      .join("  ·  ");
  }, [trainingCategories]);

  const muscleLabels = useMemo(() => {
    return muscleGroups
      .map((id) => muscleOptions.find((m) => m.id === id)?.title ?? id)
      .join("  ·  ");
  }, [muscleGroups]);

  const handleConfirm = () => router.push("/equipmentList");
  const handleBack = () => router.back();

  // ─── Theme tokens ──────────────────────────────────────────────────────────
  const TEAL = theme.colors.primary;
  const textColor = isDark ? "#DFF0EE" : theme.colors.text;
  const subColor = isDark ? "#4A6A66" : theme.colors.textSecondary;
  const cardBg = isDark ? "#0C1119" : theme.colors.card;
  const borderColor = isDark ? "rgba(46,207,190,0.15)" : theme.colors.border;
  const accentBg = isDark ? "rgba(46,207,190,0.07)" : "rgba(46,207,190,0.06)";
  const accentBorder = isDark
    ? "rgba(46,207,190,0.2)"
    : "rgba(46,207,190,0.25)";

  const styles = createStyles(isDark, theme);

  return (
    <OnboardingLayout
      title="Confirmá tu rutina"
      onNext={handleConfirm}
      isNextDisabled={false}
      nextButtonText="Confirmar y continuar"
    >
      <View style={styles.container}>
        {/* Particles */}
        {isDark &&
          [...Array(10)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.particle,
                {
                  top: `${(i * 21 + 6) % 88}%` as any,
                  left: `${(i * 34 + 7) % 83}%` as any,
                  opacity: 0.05 + (i % 4) * 0.04,
                  width: i % 3 === 0 ? 3 : 2,
                  height: i % 3 === 0 ? 3 : 2,
                },
              ]}
            />
          ))}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero card ─────────────────────────────────────────────── */}
          <View
            style={[
              styles.heroCard,
              { backgroundColor: accentBg, borderColor: accentBorder },
            ]}
          >
            <View style={[styles.heroTopLine, { backgroundColor: TEAL }]} />

            <View style={styles.heroContent}>
              {/* Badges: nivel + objetivo */}
              <View style={styles.badgesRow}>
                <LevelBadge
                  level={experience ?? "principiante"}
                  isDark={isDark}
                  teal={TEAL}
                />
                <GoalBadge goal={goal} isDark={isDark} />
              </View>

              {/* Nombre de la rutina */}
              <Text style={[styles.routineLabel, { color: TEAL }]}>
                {classification.routineLabel}
              </Text>

              {/* Split tags */}
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

              {/* Descripción */}
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

          {/* ── Stats ─────────────────────────────────────────────────── */}
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

          {/* ── Músculos resueltos ─────────────────────────────────────── */}
          <View
            style={[styles.section, { backgroundColor: cardBg, borderColor }]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="body-outline" size={16} color={TEAL} />
              <Text style={[styles.sectionTitle, { color: TEAL }]}>
                Grupos musculares
              </Text>
            </View>
            <Text style={[styles.muscleLabels, { color: textColor }]}>
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = (isDark: boolean, theme: any) =>
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

    // ── Hero ──────────────────────────────────────────────────────────
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

    // Badges row (nivel + objetivo)
    badgesRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: token.spacing.xs,
    },

    // Nombre de la rutina
    routineLabel: {
      fontSize: token.typography.h1 ?? 26,
      fontWeight: "900",
      letterSpacing: 0.5,
    },

    // Split tags row
    tagsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: token.spacing.xs,
    },

    // Descripción
    routineDescription: {
      fontSize: token.typography.body,
      lineHeight: 22,
    },

    // ── Stats row ─────────────────────────────────────────────────────
    statsRow: {
      flexDirection: "row",
      gap: token.spacing.sm,
    },

    // ── Sections ──────────────────────────────────────────────────────
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
    muscleLabels: {
      fontSize: token.typography.body,
      fontWeight: "600",
      lineHeight: 24,
    },

    // ── Tips ──────────────────────────────────────────────────────────
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
