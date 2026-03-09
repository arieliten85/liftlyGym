import { useAppTheme } from "@/theme/ThemeProvider";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/shared/components/PrimaryButton";
import { useRoutineStore } from "@/store/useRoutineStore";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { formatRestTime } from "../onboarding/utils/formatRestTime";
import { formatTextTitle } from "../onboarding/utils/formatTextTitle";

export function RoutineScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const { routine } = useRoutineStore();

  const colors = {
    bg: theme.colors.background,
    surface: theme.colors.surface || (isDark ? "#1E1E1E" : "#FFFFFF"),
    textPrimary: theme.colors.text,
    textSecondary: isDark ? "#A0A0A0" : "#5E5E5E",
    primary: theme.colors.primary,
    border: isDark ? "#2C2C2C" : "#F0F0F0",
    cardBg: isDark ? "#1A1A1A" : "#FFFFFF",
  };

  const totalStats = useMemo(() => {
    if (!routine) return { totalSets: 0, totalExercises: 0, totalTimeMin: 0 };
    const totalSets = routine.exercises.reduce((acc, ex) => acc + ex.sets, 0);
    const totalExercises = routine.exercises.length;
    const totalTimeMin = calculateWorkoutTime(routine.exercises);
    return { totalSets, totalExercises, totalTimeMin };
  }, [routine]);

  if (!routine) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.bg }]}>
        <Text style={{ color: colors.textSecondary }}>
          Cargando tu rutina...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {routine.name || "Rutina de hoy"}
          </Text>

          <View style={styles.headerBadges}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: colors.primary + "15",
                  borderColor: colors.primary + "30",
                },
              ]}
            >
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                {routine.goal}
              </Text>
            </View>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  marginLeft: 6,
                },
              ]}
            >
              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                {routine.experience}
              </Text>
            </View>
          </View>
        </View>

        {/* STATS ROW */}
        <View style={styles.statsRow}>
          <StatCard
            value={totalStats.totalExercises}
            label="EJERCICIOS"
            {...colors}
          />
          <StatCard value={totalStats.totalSets} label="SERIES" {...colors} />
          <StatCard
            value={totalStats.totalTimeMin}
            label="MINUTOS"
            {...colors}
          />
        </View>

        {/* TIPS CARD */}
        <View
          style={[
            styles.tipsCard,
            {
              backgroundColor: colors.primary + "08",
              borderColor: colors.primary + "20",
              borderWidth: 1,
            },
          ]}
        >
          <Text style={[styles.tipsTitle, { color: colors.primary }]}>
            Tips rápidos
          </Text>
          <View style={styles.tipsList}>
            {[
              "Calienta 5-10 minutos antes de empezar",
              "Prioriza la técnica sobre el peso",
              "Hidrátate entre series",
            ].map((tip, i) => (
              <View key={i} style={styles.tipItem}>
                <Text style={[styles.tipBullet, { color: colors.primary }]}>
                  •
                </Text>
                <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* EJERCICIOS SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Ejercicios
          </Text>
        </View>

        {/* EJERCICIOS */}
        {routine.exercises.map((ex, index) => (
          <View
            key={index}
            style={[
              styles.exerciseCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.exerciseHeader}>
              <Text
                style={[styles.exerciseName, { color: colors.textPrimary }]}
              >
                {formatTextTitle(ex.name)}
              </Text>
            </View>

            <View
              style={[
                styles.exerciseDetails,
                { backgroundColor: isDark ? "#111" : "#F8F8F8" },
              ]}
            >
              <DetailItem label="Series" value={ex.sets} colors={colors} />
              <View
                style={[
                  styles.detailDivider,
                  { backgroundColor: colors.border },
                ]}
              />
              <DetailItem label="Rep" value={ex.reps} colors={colors} />
              <View
                style={[
                  styles.detailDivider,
                  { backgroundColor: colors.border },
                ]}
              />
              <DetailItem
                label="Desc"
                value={formatRestTime(ex.restSeconds)}
                colors={colors}
              />
            </View>
          </View>
        ))}

        <View style={styles.footer} />
      </ScrollView>

      {/* BOTÓN FIJO EN LA PARTE INFERIOR */}
      <View style={styles.fixedButtonContainer}>
        <PrimaryButton
          label="Finalizar rutina"
          onPress={() => router.push("../goals")}
        />
      </View>
    </View>
  );
}

function DetailItem({ label, value, colors }: any) {
  return (
    <View style={styles.detailItem}>
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
        {value}
      </Text>
    </View>
  );
}

function StatCard({
  value,
  label,
  primary,
  surface,
  border,
  textSecondary,
}: any) {
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: surface, borderColor: border },
      ]}
    >
      <Text style={[styles.statValue, { color: primary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: textSecondary }]}>{label}</Text>
    </View>
  );
}

function calculateWorkoutTime(exercises: any[]): number {
  const restBetweenExercises = 90;
  let totalSeconds = 0;

  exercises.forEach((ex) => {
    totalSeconds += ex.sets * 40;
    totalSeconds += (ex.sets - 1) * ex.restSeconds;
  });

  totalSeconds += (exercises.length - 1) * restBetweenExercises;
  return Math.round(totalSeconds / 60);
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 90,
    gap: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  header: {
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  headerBadges: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 5,
  },
  statCard: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  sectionHeader: {
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  exerciseCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
    marginBottom: 4,
  },
  exerciseHeader: {
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: 17,
    fontWeight: "600",
  },
  exerciseDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  detailDivider: {
    width: 1,
    height: 30,
  },
  detailLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  tipsCard: {
    padding: 20,
    borderRadius: 20,
    marginVertical: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  tipsList: {
    gap: 10,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tipBullet: {
    fontSize: 18,
    lineHeight: 20,
  },
  tipText: {
    fontSize: 14,
    flex: 1,
  },
  footer: {
    height: 20, // Reducido ya que ahora tenemos paddingBottom en scrollContent
  },
});
