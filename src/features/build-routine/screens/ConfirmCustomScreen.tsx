// app/(onboarding)/(build-routine)/confirmCustom.tsx
import { useUserStore } from "@/features/auth/store/userStore";
import { Badge } from "@/shared/components/Badge";
import OnboardingLayout from "@/shared/components/OnboardingLayout";
import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";

import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

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

const DAY_LABELS: Record<string, string> = {
  lun: "Lunes",
  mar: "Martes",
  mie: "Miércoles",
  jue: "Jueves",
  vie: "Viernes",
  sab: "Sábado",
  dom: "Domingo",
};

export default function ConfirmCustomScreen() {
  const { theme, isDark } = useAppTheme();
  const { from } = useLocalSearchParams<{ from?: string }>();

  const goal = useBuildRoutineStore((s) => s.goal);
  const equipment = useBuildRoutineStore((s) => s.equipment);
  const experience = useBuildRoutineStore((s) => s.experience);
  const customSubMode = useBuildRoutineStore((s) => s.customSubMode);
  const musculos = useBuildRoutineStore((s) => s.musculos);
  const weekPlan = useBuildRoutineStore((s) => s.weekPlan);
  const selectedDays = useBuildRoutineStore((s) => s.selectedDays);

  const getCustomSinglePayload = useBuildRoutineStore(
    (s) => s.getCustomSinglePayload,
  );
  const getCustomPlanPayload = useBuildRoutineStore(
    (s) => s.getCustomPlanPayload,
  );
  const reset = useBuildRoutineStore((s) => s.reset);

  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const user = useUserStore((s) => s.user);

  const TEAL = theme.primary;
  const textColor = isDark ? "#DFF0EE" : theme.text;
  const subColor = isDark ? "#4A6A66" : theme.textSecondary;
  const cardBg = isDark ? "#0C1119" : theme.card;
  const borderColor = isDark ? "rgba(46,207,190,0.15)" : theme.border;
  const accentBg = isDark ? "rgba(46,207,190,0.07)" : "rgba(46,207,190,0.06)";
  const accentBorder = isDark
    ? "rgba(46,207,190,0.2)"
    : "rgba(46,207,190,0.25)";

  const goalMeta = GOAL_META[goal ?? "hipertrofia"];
  const levelTip = LEVEL_TIPS[experience ?? "principiante"];
  const levelIcon = LEVEL_ICON[experience ?? "principiante"];
  const isReady = !!(goal && equipment && experience && customSubMode);
  const isSingle = customSubMode === "single";
  const isPlan = customSubMode === "plan";

  // Para single: mostrar músculos seleccionados
  const hasMuscles = musculos.length > 0;
  const muscleLabel = musculos.map((m) => m.toUpperCase()).join(" + ");

  // Para plan: mostrar días con músculos
  const assignedDaysCount = weekPlan.filter((p) => p.muscles.length > 0).length;
  const totalDays = selectedDays.length;

  const handleConfirm = () => {
    if (!isReady) return;

    const payload = isSingle
      ? getCustomSinglePayload()
      : getCustomPlanPayload();

    if (!payload) return;

    // Console.log del payload que iría al backend
    console.log("[v0] ========================================");
    console.log("[v0] PAYLOAD PARA EL BACKEND:");
    console.log("[v0] Tipo:", isSingle ? "SESION SUELTA" : "PLAN SEMANAL");
    console.log("[v0] ----------------------------------------");
    console.log("[v0] Payload completo:", JSON.stringify(payload, null, 2));
    console.log("[v0] ========================================");

    if (!isAuthenticated) {
      console.log("[v0] Usuario no autenticado, redirigiendo a login...");
      router.push("/(onboarding)/(auth)/login");
      return;
    }

    console.log("[v0] Usuario autenticado, procediendo a generar rutina...");
    // Limpiar store y navegar a generando
    reset();
    router.push("/(onboarding)/(build-routine)/generating");
  };

  const getModeBadge = () => {
    if (isSingle) return { label: "SESIÓN SUELTA", icon: "flash-outline" };
    return { label: "PLAN SEMANAL", icon: "calendar-outline" };
  };

  const modeBadge = getModeBadge();

  // Debug: ver estado actual del store
  console.log("[v0] ConfirmCustomScreen - Estado del store:");
  console.log("[v0] goal:", goal);
  console.log("[v0] equipment:", equipment);
  console.log("[v0] experience:", experience);
  console.log("[v0] customSubMode:", customSubMode);
  console.log("[v0] musculos:", musculos);
  console.log("[v0] weekPlan:", weekPlan);
  console.log("[v0] selectedDays:", selectedDays);
  console.log("[v0] isReady:", isReady);
  console.log("[v0] isSingle:", isSingle, "hasMuscles:", hasMuscles);
  console.log("[v0] isPlan:", isPlan, "assignedDaysCount:", assignedDaysCount);
  console.log(
    "[v0] Boton deshabilitado:",
    !isReady || (isSingle ? !hasMuscles : assignedDaysCount === 0),
  );

  return (
    <OnboardingLayout
      title="Confirmá tu rutina"
      onNext={handleConfirm}
      isNextDisabled={
        !isReady || (isSingle ? !hasMuscles : assignedDaysCount === 0)
      }
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
          {/* ── BLOQUE 1: RESUMEN DEL PLAN ── */}
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
                  label={equipment?.toUpperCase() ?? "—"}
                  color="#A78BFA"
                  subtle
                />
              </View>

              {user && (
                <Text style={[styles.userTag, { color: subColor }]}>
                  Rutina para {user.name}
                </Text>
              )}
            </View>
          </View>

          {/* ── BLOQUE 2: DETALLE DEL PLAN (solo si es single o plan) ── */}
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
                      <Text
                        style={[
                          styles.dayLabel,
                          { color: hasMusclesInDay ? TEAL : subColor },
                        ]}
                      >
                        {DAY_LABELS[plan.day]}
                      </Text>
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

          {/* ── BLOQUE 3: OBJETIVO ── */}
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

          {/* ── BLOQUE 4: CONSEJO ── */}
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

          {/* ── BLOQUE 5: EQUIPAMIENTO ── */}
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

          {/* ── BLOQUE 6: AUTH NOTICE (solo si no está logueado) ── */}
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

          {/* ── BLOQUE 7: EXPECTATIVA ── */}
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

  weekPlanContainer: { gap: 12, marginVertical: 4 },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  dayLabel: { fontSize: 14, fontWeight: "700", width: 70 },
  dayMuscles: { fontSize: 13, fontWeight: "500", flex: 1, textAlign: "right" },

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
