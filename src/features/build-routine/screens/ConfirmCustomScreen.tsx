import { useUserStore } from "@/features/auth/store/userStore";
import { Badge } from "@/shared/components/Badge";
import OnboardingLayout from "@/shared/components/OnboardingLayout";
import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import {
  CustomPlanPayload,
  CustomSinglePayload,
  EquipmentType,
} from "@/types/routine";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { DAY_LABELS } from "../constants/dayLabels";

const GOAL_META: Record<
  string,
  { description: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  fuerza: {
    description: "Cargas altas, pocas reps. Cada serie cuenta.",
    icon: "barbell-outline",
  },
  hipertrofia: {
    description:
      "Volumen moderado, tensión sostenida. El músculo crece en la constancia.",
    icon: "trending-up-outline",
  },
  masa: {
    description:
      "Progresión de carga semana a semana. El volumen es tu mejor aliado.",
    icon: "albums-outline",
  },
};

const LEVEL_TIPS: Record<string, string> = {
  principiante:
    "Enfocate en aprender la técnica correcta. El peso viene después.",
  intermedio:
    "Ya tenés la base. Es momento de aumentar el volumen progresivamente.",
  avanzado:
    "Priorizá la recuperación y la periodización para seguir progresando.",
};

const LEVEL_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  principiante: "leaf-outline",
  intermedio: "flash-outline",
  avanzado: "flame-outline",
};

// ─────────────────────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────────────────────
export default function ConfirmCustomScreen() {
  const { theme, isDark } = useAppTheme();
  const { from } = useLocalSearchParams<{ from?: string }>();

  // ── Store ─────────────────────────────────────────────────────────────────
  const goal = useBuildRoutineStore((s) => s.goal);
  const equipment = useBuildRoutineStore((s) => s.equipment);
  const experience = useBuildRoutineStore((s) => s.experience);
  const customSubMode = useBuildRoutineStore((s) => s.customSubMode);
  const musculos = useBuildRoutineStore((s) => s.musculos);
  const weekPlan = useBuildRoutineStore((s) => s.weekPlan);
  const selectedDays = useBuildRoutineStore((s) => s.selectedDays);
  const exercisePlan = useBuildRoutineStore((s) => s.exercisePlan);

  const getCustomSinglePayload = useBuildRoutineStore(
    (s) => s.getCustomSinglePayload,
  );
  const getCustomPlanPayload = useBuildRoutineStore(
    (s) => s.getCustomPlanPayload,
  );
  const reset = useBuildRoutineStore((s) => s.reset);

  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const user = useUserStore((s) => s.user);

  // ── Colores ───────────────────────────────────────────────────────────────
  const TEAL = theme.primary;
  const textColor = isDark ? "#DFF0EE" : theme.text;
  const subColor = isDark ? "#4A6A66" : theme.textSecondary;
  const cardBg = isDark ? "#0C1119" : theme.card;
  const borderColor = isDark ? "rgba(46,207,190,0.15)" : theme.border;
  const accentBg = isDark ? "rgba(46,207,190,0.07)" : "rgba(46,207,190,0.06)";
  const accentBorder = isDark
    ? "rgba(46,207,190,0.2)"
    : "rgba(46,207,190,0.25)";

  // ── Derivados ─────────────────────────────────────────────────────────────
  const goalMeta = GOAL_META[goal ?? "hipertrofia"];
  const levelTip = LEVEL_TIPS[experience ?? "principiante"];
  const levelIcon = LEVEL_ICON[experience ?? "principiante"];

  const isSingle = customSubMode === "single";
  const isPlan = customSubMode === "plan";

  const hasMuscles = musculos.length > 0;
  const muscleLabel = musculos.map((m) => m.toUpperCase()).join(" + ");
  const assignedDaysCount = weekPlan.filter((p) => p.muscles.length > 0).length;
  const totalDays = selectedDays.length;

  // Cantidad total de ejercicios cargados
  const totalExercises = exercisePlan.reduce(
    (acc, dp) => acc + dp.exercises.length,
    0,
  );

  const textEquipament: Record<EquipmentType, string> = {
    gym: "Gimnasio completo",
    dumbbells: "Mancuernas",
    basic: "Equipamiento básico",
    bodyweight: "Peso corporal",
  };

  const isReady = !!(goal && equipment && experience && customSubMode);
  const isNextDisabled =
    !isReady || (isSingle ? !hasMuscles : assignedDaysCount === 0);

  // ── Handler ───────────────────────────────────────────────────────────────
  const handleConfirm = () => {
    if (isNextDisabled) return;

    const payload: CustomSinglePayload | CustomPlanPayload | null = isSingle
      ? getCustomSinglePayload()
      : getCustomPlanPayload();

    if (!payload) {
      console.warn("payload null");
      return;
    }

    console.log("JSON completo →", JSON.stringify(payload, null, 2));

    if (!isAuthenticated) {
      router.push("/(onboarding)/(auth)/login");
      return;
    }

    reset();
    router.push("/(onboarding)/(build-routine)/generating");
  };

  const modeBadge = isSingle
    ? { label: "SESIÓN SUELTA", icon: "flash-outline" as const }
    : { label: "PLAN SEMANAL", icon: "calendar-outline" as const };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <OnboardingLayout
      title="Confirmá tu rutina"
      onNext={handleConfirm}
      isNextDisabled={isNextDisabled}
      nextButtonText={
        isAuthenticated ? "Confirmar y generar" : "Iniciar sesión y generar"
      }
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
              <View style={styles.heroTop}>
                <Text style={[styles.heroEyebrow, { color: subColor }]}>
                  {modeBadge.label}
                </Text>
                <Badge label="CUSTOM" color={TEAL} subtle />
              </View>

              {isSingle ? (
                <Text style={[styles.heroRoutine, { color: TEAL }]}>
                  {hasMuscles ? muscleLabel : "—"}
                </Text>
              ) : (
                <Text style={[styles.heroPlanDays, { color: TEAL }]}>
                  {totalDays} días · {assignedDaysCount}/{totalDays} asignados
                </Text>
              )}

              <View
                style={[styles.heroDivider, { backgroundColor: `${TEAL}20` }]}
              />

              <View style={styles.heroMeta}>
                <Badge label={goal?.toUpperCase() ?? "—"} color="#FF7A59" />
                <Badge
                  label={
                    equipment ? textEquipament[equipment].toUpperCase() : "—"
                  }
                  color="#A78BFA"
                  subtle
                />
                {totalExercises > 0 && (
                  <Badge
                    label={`${totalExercises} ejercicios`}
                    color={TEAL}
                    subtle
                  />
                )}
              </View>

              {user && (
                <Text style={[styles.userTag, { color: subColor }]}>
                  Rutina para {user.name}
                </Text>
              )}
            </View>
          </View>

          {/* ── BLOQUE 2A: GRUPOS MUSCULARES (single) ─────────────────── */}
          {isSingle && hasMuscles && (
            <View
              style={[styles.card, { backgroundColor: cardBg, borderColor }]}
            >
              <View style={styles.cardHeader}>
                <Ionicons name="body-outline" size={15} color={TEAL} />
                <Text style={[styles.cardLabel, { color: TEAL }]}>
                  GRUPOS MUSCULARES
                </Text>
              </View>
              <View style={styles.muscleTagsContainer}>
                {musculos.map((m) => (
                  <View
                    key={m}
                    style={[
                      styles.muscleTag,
                      {
                        backgroundColor: `${TEAL}15`,
                        borderColor: `${TEAL}30`,
                      },
                    ]}
                  >
                    <Text style={[styles.muscleTagText, { color: TEAL }]}>
                      {m.toUpperCase()}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.cardHint, { color: subColor }]}>
                {musculos.length === 1
                  ? "Rutina enfocada en un solo grupo muscular"
                  : "Combinación óptima para máximo rendimiento"}
              </Text>
            </View>
          )}

          {/* ── BLOQUE 2B: DISTRIBUCIÓN SEMANAL (plan) ────────────────── */}
          {isPlan && weekPlan.length > 0 && (
            <View
              style={[styles.card, { backgroundColor: cardBg, borderColor }]}
            >
              <View style={styles.cardHeader}>
                <Ionicons name="calendar-outline" size={15} color={TEAL} />
                <Text style={[styles.cardLabel, { color: TEAL }]}>
                  DISTRIBUCIÓN SEMANAL
                </Text>
              </View>
              <View style={styles.weekPlanContainer}>
                {weekPlan.map((plan) => {
                  const hasMusclesInDay = plan.muscles.length > 0;
                  const muscleText = plan.muscles
                    .map((m) => m.toUpperCase())
                    .join(" + ");
                  // Ejercicios del día
                  const dayExercises =
                    exercisePlan.find((ep) => ep.day === plan.day)?.exercises ??
                    [];
                  const exerciseCount = dayExercises.length;

                  return (
                    <View
                      key={plan.day}
                      style={[
                        styles.dayRow,
                        {
                          backgroundColor: hasMusclesInDay
                            ? `${TEAL}08`
                            : "transparent",
                        },
                      ]}
                    >
                      <View style={styles.dayRowLeft}>
                        <Text
                          style={[
                            styles.dayLabel,
                            { color: hasMusclesInDay ? TEAL : subColor },
                          ]}
                        >
                          {DAY_LABELS[plan.day]}
                        </Text>
                        {exerciseCount > 0 && (
                          <Text
                            style={[styles.exerciseCount, { color: subColor }]}
                          >
                            {exerciseCount} ejercicios
                          </Text>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.dayMuscles,
                          { color: hasMusclesInDay ? textColor : subColor },
                        ]}
                      >
                        {hasMusclesInDay ? muscleText : "— Sin asignar"}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <Text style={[styles.cardHint, { color: subColor }]}>
                {assignedDaysCount === totalDays
                  ? "✅ Semana completa asignada"
                  : `⚠️ Faltan ${totalDays - assignedDaysCount} día(s) por asignar`}
              </Text>
            </View>
          )}

          {/* ── BLOQUE 3: EJERCICIOS DETALLE (plan, si los hay) ───────── */}
          {isPlan && exercisePlan.length > 0 && (
            <View
              style={[styles.card, { backgroundColor: cardBg, borderColor }]}
            >
              <View style={styles.cardHeader}>
                <Ionicons name="barbell-outline" size={15} color={TEAL} />
                <Text style={[styles.cardLabel, { color: TEAL }]}>
                  EJERCICIOS SELECCIONADOS
                </Text>
              </View>
              {exercisePlan.map((dp) => (
                <View key={dp.day} style={styles.exerciseDayBlock}>
                  <Text style={[styles.exerciseDayTitle, { color: TEAL }]}>
                    {DAY_LABELS[dp.day] ?? dp.day.toUpperCase()}
                  </Text>
                  {dp.exercises.map((ex) => (
                    <View
                      key={ex.id}
                      style={[styles.exerciseRow, { borderColor: `${TEAL}20` }]}
                    >
                      <Text
                        style={[styles.exerciseName, { color: textColor }]}
                        numberOfLines={1}
                      >
                        {ex.name}
                      </Text>
                      <Text style={[styles.exerciseMeta, { color: subColor }]}>
                        {ex.sets}×{ex.reps} · {ex.restSeconds}s
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* ── BLOQUE 4: OBJETIVO ────────────────────────────────────── */}
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.cardHeader}>
              <Ionicons name={goalMeta.icon} size={15} color={TEAL} />
              <Text style={[styles.cardLabel, { color: TEAL }]}>
                TU OBJETIVO
              </Text>
            </View>
            <Text
              style={[
                styles.cardBody,
                { color: isDark ? "#B8D4D0" : textColor },
              ]}
            >
              {goalMeta.description}
            </Text>
          </View>

          {/* ── BLOQUE 5: CONSEJO ─────────────────────────────────────── */}
          <View
            style={[
              styles.tipCard,
              { backgroundColor: cardBg, borderColor: accentBorder },
            ]}
          >
            <View style={styles.tipHeader}>
              <View
                style={[styles.tipIconWrap, { backgroundColor: `${TEAL}15` }]}
              >
                <Ionicons name={levelIcon} size={16} color={TEAL} />
              </View>
              <View style={styles.tipHeaderText}>
                <Text style={[styles.cardLabel, { color: TEAL }]}>CONSEJO</Text>
                <Text style={[styles.tipLevel, { color: subColor }]}>
                  Para tu nivel · {experience?.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.cardBody,
                { color: isDark ? "#B8D4D0" : textColor },
              ]}
            >
              {levelTip}
            </Text>
          </View>

          {/* ── BLOQUE 6: EQUIPAMIENTO ───────────────────────────────── */}
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="fitness-outline" size={15} color={TEAL} />
              <Text style={[styles.cardLabel, { color: TEAL }]}>
                EQUIPAMIENTO
              </Text>
            </View>
            <Text
              style={[
                styles.cardBody,
                { color: isDark ? "#B8D4D0" : textColor },
              ]}
            >
              {equipment === "gym"
                ? "Rutina diseñada para gimnasio con máquinas, barras y mancuernas"
                : "Rutina adaptada para entrenar en casa con mínimo equipamiento"}
            </Text>
          </View>

          {/* ── BLOQUE 7: AUTH NOTICE ─────────────────────────────────── */}
          {!isAuthenticated && (
            <View
              style={[
                styles.authNotice,
                { backgroundColor: `${TEAL}0A`, borderColor: `${TEAL}25` },
              ]}
            >
              <Ionicons name="lock-closed-outline" size={15} color={TEAL} />
              <Text style={[styles.authNoticeText, { color: subColor }]}>
                Necesitás iniciar sesión para guardar y generar tu rutina.
              </Text>
            </View>
          )}

          {/* ── BLOQUE 8: EXPECTATIVA ────────────────────────────────── */}
          <View style={[styles.infoRow, { borderColor }]}>
            <Ionicons name="sparkles-outline" size={15} color={subColor} />
            <Text style={[styles.infoText, { color: subColor }]}>
              La IA va a armar los ejercicios, series y cargas según tu perfil.
            </Text>
          </View>
        </ScrollView>
      </View>
    </OnboardingLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Estilos
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    gap: token.spacing.md,
    paddingBottom: token.spacing.xl,
  },

  heroCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  heroTopLine: {
    height: 2,
    width: "55%",
    alignSelf: "center",
    opacity: 0.7,
    borderRadius: 1,
  },
  heroContent: { padding: token.spacing.lg, gap: token.spacing.sm },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroEyebrow: { fontSize: 11, fontWeight: "700", letterSpacing: 1.5 },
  heroRoutine: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 1,
    lineHeight: 36,
  },
  heroPlanDays: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.5,
    lineHeight: 32,
  },
  heroDivider: { height: 1, marginVertical: token.spacing.xs / 2 },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: token.spacing.xs,
  },
  userTag: { fontSize: 12, fontWeight: "500", marginTop: 4 },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: token.spacing.lg,
    gap: token.spacing.sm,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  cardBody: { fontSize: token.typography.body, lineHeight: 22 },
  cardHint: { fontSize: 12, lineHeight: 18, marginTop: 4 },

  muscleTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 4,
  },
  muscleTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  muscleTagText: { fontSize: 13, fontWeight: "700", letterSpacing: 0.5 },

  weekPlanContainer: { gap: 10, marginVertical: 4 },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  dayRowLeft: { gap: 2 },
  dayLabel: { fontSize: 14, fontWeight: "700", width: 80 },
  exerciseCount: { fontSize: 11, fontWeight: "500" },
  dayMuscles: { fontSize: 13, fontWeight: "500", flex: 1, textAlign: "right" },

  exerciseDayBlock: { gap: 6, marginTop: 4 },
  exerciseDayTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  exerciseName: { fontSize: 13, fontWeight: "600", flex: 1, marginRight: 8 },
  exerciseMeta: { fontSize: 12, fontWeight: "500" },

  tipCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: token.spacing.lg,
    gap: token.spacing.md,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: token.spacing.sm,
  },
  tipIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tipHeaderText: { gap: 2 },
  tipLevel: { fontSize: 11, fontWeight: "500", letterSpacing: 0.3 },

  authNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: token.spacing.xs,
    padding: token.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
  },
  authNoticeText: {
    flex: 1,
    fontSize: token.typography.bodySmall,
    lineHeight: 18,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: token.spacing.xs,
    paddingVertical: token.spacing.sm,
    borderTopWidth: 1,
    marginTop: token.spacing.xs,
  },
  infoText: { flex: 1, fontSize: token.typography.bodySmall, lineHeight: 18 },
});
