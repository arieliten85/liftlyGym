// src/feature/onboarding/screens/ConfirmRoutineScreen.tsx

import { getEquipmentList } from "@/data/equipmentList.data";
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
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

// ─── Lógica de equipamiento automático ───────────────────────────────────────
//
// El equipamiento se resuelve automáticamente según nivel y músculos.
// No hay selección manual en esta pantalla.
//
// Reglas:
//   - Cap total por nivel: principiante=4, intermedio=6, avanzado=8
//   - Distribución: base equitativo entre grupos + slot extra a músculos grandes
//   - Músculos grandes (pecho, espalda, piernas) tienen prioridad en el reparto

const EQUIPMENT_CAP: Record<string, number> = {
  principiante: 4,
  intermedio: 6,
  avanzado: 8,
};

const BIG_MUSCLES = new Set(["piernas", "espalda", "pecho"]);

function calcSlotsPerMuscle(
  muscleGroups: string[],
  experience: string | null,
): Record<string, number> {
  const cap = EQUIPMENT_CAP[experience ?? "principiante"] ?? 4;
  const base = Math.floor(cap / muscleGroups.length);
  const slots: Record<string, number> = Object.fromEntries(
    muscleGroups.map((m) => [m, base]),
  );
  let assigned = base * muscleGroups.length;
  for (const m of muscleGroups) {
    if (assigned >= cap) break;
    if (BIG_MUSCLES.has(m)) { slots[m]++; assigned++; }
  }
  for (const m of muscleGroups) {
    if (assigned >= cap) break;
    slots[m]++; assigned++;
  }
  return slots;
}

function resolveEquipmentIds(
  equipment: string | null,
  muscleGroups: string[],
  experience: string | null,
): string[] {
  if (!equipment) return [];
  const slots = calcSlotsPerMuscle(muscleGroups, experience);
  return muscleGroups.flatMap((m) =>
    getEquipmentList(equipment, m).slice(0, slots[m]).map((i) => i.id),
  );
}

// ─── GoalBadge ────────────────────────────────────────────────────────────────

function GoalBadge({ goal, isDark }: { goal: string | null; isDark: boolean }) {
  if (!goal) return null;

  const config: Record<string, { label: string; color: string; icon: string }> = {
    fuerza:          { label: "FUERZA",          color: "#F97316", icon: "barbell-outline" },
    hipertrofia:     { label: "HIPERTROFIA",      color: "#A78BFA", icon: "trending-up-outline" },
    resistencia:     { label: "RESISTENCIA",      color: "#38BDF8", icon: "pulse-outline" },
    perdida_de_peso: { label: "PÉRDIDA DE PESO",  color: "#4ADE80", icon: "flame-outline" },
    definicion:      { label: "DEFINICIÓN",       color: "#FB923C", icon: "body-outline" },
    movilidad:       { label: "MOVILIDAD",        color: "#2ECFBE", icon: "walk-outline" },
  };

  const c = config[goal] ?? { label: goal.toUpperCase(), color: "#2ECFBE", icon: "star-outline" };

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
    principiante: { label: "PRINCIPIANTE", color: "#4ADE80", icon: "leaf-outline" },
    intermedio:   { label: "INTERMEDIO",   color: "#FACC15", icon: "flash-outline" },
    avanzado:     { label: "AVANZADO",     color: "#F97316", icon: "flame-outline" },
  }[level] ?? { label: level.toUpperCase(), color: teal, icon: "person-outline" };

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
      <Text style={[badgeStyles.text, { color: config.color }]}>{config.label}</Text>
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
}: {
  icon: string;
  value: string;
  label: string;
  cardBg: string;
  borderColor: string;
  textColor: string;
  subColor: string;
  teal: string;
}) {
  return (
    <View style={[statStyles.card, { backgroundColor: cardBg, borderColor }]}>
      <Ionicons name={icon as any} size={18} color={teal} />
      <Text style={[statStyles.value, { color: textColor }]} numberOfLines={1} adjustsFontSizeToFit>
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
  value: { fontSize: 15, fontWeight: "800", letterSpacing: 0.3, textAlign: "center" },
  label: { fontSize: 10, fontWeight: "500", textAlign: "center", lineHeight: 14 },
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
          backgroundColor: isDark ? "rgba(46,207,190,0.10)" : "rgba(46,207,190,0.08)",
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
  text: { fontSize: 11, fontWeight: "700", letterSpacing: 0.8 },
});

// ─── ConfirmRoutineScreen ─────────────────────────────────────────────────────

export default function ConfirmRoutineScreen() {
  const { theme, isDark } = useAppTheme();
  const goal         = useOnboardingStore((s) => s.goal);
  const equipment    = useOnboardingStore((s) => s.equipment);
  const experience   = useOnboardingStore((s) => s.experience);
  const muscleGroups = useOnboardingStore((s) => s.muscleGroups);
  const source       = useOnboardingStore((s) => s.source);
  const trainingCategories = useOnboardingStore((s) => s.trainingCategories);

  const classification = useMemo<RoutineClassification>(
    () => classifyRoutine(muscleGroups, (experience ?? "principiante") as ExperienceLevel),
    [muscleGroups, experience],
  );

  const muscleLabels = useMemo(
    () => muscleGroups.map((id) => muscleOptions.find((m) => m.id === id)?.title ?? id).join("  ·  "),
    [muscleGroups],
  );


  // Arma y consuela el payload completo con equipamiento resuelto automáticamente
  const handleConfirm = useCallback(() => {
    const resolvedEquipment = resolveEquipmentIds(equipment, muscleGroups, experience);
    const maxExercisesPerSession = EQUIPMENT_CAP[experience ?? "principiante"] ?? 4;

    const payload = {
      goal,
      equipment,
      experience,
      muscleGroups,
      source,
      trainingCategories,
      selectedEquipmentItems: {
        mode: "auto — resuelto por músculo y nivel",
        ids: resolvedEquipment,
      },
      exerciseVolume: {
        maxExercisesPerSession,
        rationale: `Nivel ${experience ?? "principiante"} con ${muscleGroups.length} grupo(s) muscular(es)`,
      },
      routineClassification: {
        splitTags:           classification.splitTags,
        duration:            `${classification.durationMin} a ${classification.durationMax} minutos`,
        daysPerWeek:         classification.daysLabel,
        daySplitSuggestion:  classification.daySplitSuggestion ?? null,
        exercisesPerMuscle:  classification.exercisesPerMuscle,
        setsRange:           classification.setsRange,
        tips:                classification.tips,
      },
    };

    console.log("=== ONBOARDING PAYLOAD ===\n", JSON.stringify(payload, null, 2));
  }, [goal, equipment, experience, muscleGroups, source, trainingCategories, classification]);

  // ─── Theme tokens ──────────────────────────────────────────────────────────
  const TEAL       = theme.colors.primary;
  const textColor  = isDark ? "#DFF0EE" : theme.colors.text;
  const subColor   = isDark ? "#4A6A66" : theme.colors.textSecondary;
  const cardBg     = isDark ? "#0C1119" : theme.colors.card;
  const borderColor  = isDark ? "rgba(46,207,190,0.15)" : theme.colors.border;
  const accentBg     = isDark ? "rgba(46,207,190,0.07)" : "rgba(46,207,190,0.06)";
  const accentBorder = isDark ? "rgba(46,207,190,0.2)"  : "rgba(46,207,190,0.25)";

  const styles = createStyles(isDark, theme);

  return (
    <OnboardingLayout
      title="Confirmá tu rutina"
      onNext={handleConfirm}
      isNextDisabled={false}
      nextButtonText="Confirmar y generar"
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
                  top:     `${(i * 21 + 6) % 88}%` as any,
                  left:    `${(i * 34 + 7) % 83}%` as any,
                  opacity: 0.05 + (i % 4) * 0.04,
                  width:   i % 3 === 0 ? 3 : 2,
                  height:  i % 3 === 0 ? 3 : 2,
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
          <View style={[styles.heroCard, { backgroundColor: accentBg, borderColor: accentBorder }]}>
            <View style={[styles.heroTopLine, { backgroundColor: TEAL }]} />

            <View style={styles.heroContent}>
              <View style={styles.badgesRow}>
                <LevelBadge level={experience ?? "principiante"} isDark={isDark} teal={TEAL} />
                <GoalBadge goal={goal} isDark={isDark} />
              </View>

              <Text style={[styles.routineLabel, { color: TEAL }]}>
                {classification.routineLabel}
              </Text>

              {classification.splitTags.length > 0 && (
                <View style={styles.tagsRow}>
                  {classification.splitTags.map((tag) => (
                    <SplitTag key={tag} tag={tag} isDark={isDark} teal={TEAL} accentBorder={accentBorder} />
                  ))}
                </View>
              )}

              <Text style={[styles.routineDescription, { color: isDark ? "#B8D4D0" : textColor }]}>
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

          {/* ── Grupos musculares ──────────────────────────────────────── */}
          <View style={[styles.section, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="body-outline" size={16} color={TEAL} />
              <Text style={[styles.sectionTitle, { color: TEAL }]}>Grupos musculares</Text>
            </View>
            <Text style={[styles.sectionBody, { color: textColor }]}>{muscleLabels}</Text>
          </View>

          {/* ── Tips ──────────────────────────────────────────────────── */}
          <View style={[styles.section, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb-outline" size={16} color={TEAL} />
              <Text style={[styles.sectionTitle, { color: TEAL }]}>Buenas prácticas</Text>
            </View>
            <View style={styles.tipsList}>
              {classification.tips.map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <View style={[styles.tipDot, { backgroundColor: TEAL }]} />
                  <Text style={[styles.tipText, { color: isDark ? "#B8D4D0" : textColor }]}>
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
