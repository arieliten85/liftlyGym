import { useUserStore } from "@/features/auth/store/userStore";
import { RoutineService } from "@/services/routineService";
import { Badge } from "@/shared/components/Badge";
import OnboardingLayout from "@/shared/components/OnboardingLayout";
import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";
import { useRoutineStore } from "@/store/routine/useRoutineStore";

import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

export default function ConfirmRoutineScreen() {
  const { theme, isDark } = useAppTheme();
  const routineService = new RoutineService();

  const goal = useBuildRoutineStore((s) => s.goal);
  const equipment = useBuildRoutineStore((s) => s.equipment);
  const experience = useBuildRoutineStore((s) => s.experience);
  const routine = useBuildRoutineStore((s) => s.routine);
  const getQuickPayload = useBuildRoutineStore((s) => s.getQuickPayload);

  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const user = useUserStore((s) => s.user);

  const setLoading = useRoutineStore((s) => s.setLoading);
  const setRoutine = useRoutineStore((s) => s.setRoutine);
  const setError = useRoutineStore((s) => s.setError);

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
  const isReady = !!(goal && equipment && experience && routine);

  const handleConfirm = async () => {
    if (!isAuthenticated) {
      router.push("/login?returnTo=confirmRoutine");
      return;
    }

    const payload = getQuickPayload();
    if (!payload) return;

    setLoading(true);
    router.push("/generatingRoutine");

    try {
      const saved = await routineService.generateRoutineOnboarding(payload);

      setRoutine({
        routineId: saved.routineId,
        exercises: saved.exercises,
        goal: saved.goal,
        experience: saved.experience,
        routineName: saved.name,
      });
    } catch (e: any) {
      setError(e?.message ?? "Error generando la rutina");
    }
  };
  return (
    <OnboardingLayout
      title="Confirmá tu rutina"
      onNext={handleConfirm}
      isNextDisabled={!isReady}
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
          {/* ── BLOQUE 1: QUÉ VAS A HACER HOY ── */}
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
                  SESIÓN DE HOY
                </Text>
                <Badge label="QUICK" color={TEAL} subtle />
              </View>

              <Text style={[styles.heroRoutine, { color: TEAL }]}>
                {routine?.toUpperCase() ?? "—"}
              </Text>

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

          {/* ── BLOQUE 2: OBJETIVO ── */}
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

          {/* ── BLOQUE 3: CONSEJO ── */}
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

          {/* ── BLOQUE 4: AUTH NOTICE (solo si no está logueado) ── */}
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

          {/* ── BLOQUE 5: EXPECTATIVA ── */}
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
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: 1.5,
    lineHeight: 44,
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
