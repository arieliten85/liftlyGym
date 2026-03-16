import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import { useRoutineStore } from "@/store/routine/useRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { ExerciseProgress } from "@/type/routine.type";

import { Badge } from "@/shared/components/Badge";
import { PrimaryButton } from "@/shared/components/PrimaryButton";
import { StatBar } from "@/shared/components/StatBar";
import { calculateWorkoutTime } from "@/utils/workout.utils";
import { formatRestTime } from "../build-routine/utils/formatRestTime";
import { formatTextTitle } from "../build-routine/utils/formatTextTitle";
import { ExerciseCard } from "./ExerciseCard";
import { SeriesModal } from "./SeriesModal";
import {
  WorkoutSummaryModal,
  WorkoutSurveyPayload,
} from "./WorkoutSummaryModal";

async function submitRoutinePayload(payload: any) {
  console.log("════════════════════════════════");
  console.log("  PAYLOAD FINAL AL BACKEND");
  console.log("════════════════════════════════");
  console.log(JSON.stringify(payload, null, 2));
  console.log("════════════════════════════════");
  // TODO: fetch POST /api/sessions
}

export function RoutineScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const {
    routine,
    session,
    startSession,
    logSet,
    updateTotalSets,
    updateDisplayValues,
    getCompletedRoutinePayload,
    resetSession,
  } = useRoutineStore();

  const sessionStartRef = useRef<number>(Date.now());
  const [elapsedMin, setElapsedMin] = useState(0);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<
    number | null
  >(null);
  const [seriesIndex, setSeriesIndex] = useState<number | null>(null);
  const [seriesVisible, setSeriesVisible] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [wasAbandoned, setWasAbandoned] = useState(false);

  const colors = useMemo(
    () => ({
      bg: theme.colors.background,
      surface: theme.colors.surface || (isDark ? "#1E1E1E" : "#FFFFFF"),
      textPrimary: theme.colors.text,
      textSecondary: isDark ? "#A0A0A0" : "#5E5E5E",
      primary: theme.colors.primary,
      border: isDark ? "#2C2C2C" : "#F0F0F0",
      cardBg: isDark ? "#1A1A1A" : "#FFFFFF",
    }),
    [theme, isDark],
  );

  useEffect(() => {
    if (routine && !session) {
      sessionStartRef.current = Date.now();
      startSession();
    }
  }, [routine, session, startSession]);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsedMin(Math.round((Date.now() - sessionStartRef.current) / 60000));
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const completedCount = useMemo(() => {
    if (!session) return 0;
    return session.exercises.filter((e) => e.completed).length;
  }, [session]);

  const allCompleted = useMemo(() => {
    if (!session || !routine) return false;
    return completedCount === routine.exercises.length;
  }, [session, routine, completedCount]);

  const totalStats = useMemo(() => {
    if (!routine) return { sets: 0, estimatedMin: 0 };
    return {
      sets: routine.exercises.reduce((a, e) => a + e.sets, 0),
      estimatedMin: calculateWorkoutTime(routine.exercises),
    };
  }, [routine]);

  const seriesProgress = useMemo(
    () =>
      session?.exercises.find((e) => e.exerciseIndex === seriesIndex) ?? null,
    [seriesIndex, session],
  );
  const seriesExercise = useMemo(
    () =>
      seriesIndex !== null && routine ? routine.exercises[seriesIndex] : null,
    [seriesIndex, routine],
  );

  const handleSelectExercise = useCallback(
    (index: number) => setSelectedExerciseIndex(index),
    [],
  );

  const handleStartExercise = useCallback((index: number) => {
    setSelectedExerciseIndex(index);
    setSeriesIndex(index);
    setSeriesVisible(true);
  }, []);

  const handleCloseSeriesModal = useCallback(() => {
    setSeriesVisible(false);
    setSeriesIndex(null);
  }, []);

  const handleLogSet = useCallback(
    (log: {
      repsCompleted: number | null;
      weight: number | null;
      skipped: boolean;
    }) => {
      if (seriesIndex === null) return;
      logSet(seriesIndex, log);
    },
    [seriesIndex, logSet],
  );

  const handleUpdateTotalSets = useCallback(
    (total: number) => {
      if (seriesIndex === null) return;
      updateTotalSets(seriesIndex, total);
    },
    [seriesIndex, updateTotalSets],
  );

  const handleUpdateDisplayValues = useCallback(
    (values: Partial<ExerciseProgress["displayValues"]>) => {
      if (seriesIndex === null) return;
      updateDisplayValues(seriesIndex, values);
    },
    [seriesIndex, updateDisplayValues],
  );

  const handleFinishRoutine = useCallback(() => {
    if (allCompleted) {
      setElapsedMin(Math.round((Date.now() - sessionStartRef.current) / 60000));
      setWasAbandoned(false);
      setSummaryVisible(true);
      return;
    }
    Alert.alert(
      "Finalizar rutina",
      completedCount > 0
        ? `Completaste ${completedCount} de ${routine?.exercises.length} ejercicios. ¿Querés finalizar igual?`
        : "No completaste ningún ejercicio. ¿Querés finalizar la rutina?",
      [
        { text: "Seguir entrenando", style: "cancel" },
        {
          text: "Finalizar",
          style: "destructive",
          onPress: () => {
            setElapsedMin(
              Math.round((Date.now() - sessionStartRef.current) / 60000),
            );
            setWasAbandoned(completedCount < (routine?.exercises.length ?? 1));
            setSummaryVisible(true);
          },
        },
      ],
    );
  }, [allCompleted, completedCount, routine]);

  const handleSurveySubmit = useCallback(
    (survey: WorkoutSurveyPayload) => {
      // El feedback viene del survey — se pasa directamente al payload
      const feedback = {
        intensity: survey.intensity > 0 ? survey.intensity : null,
        energy: survey.energy > 0 ? survey.energy : null,
        painLevel: survey.painLevel > 0 ? survey.painLevel : null,
        comment: survey.comment,
      };

      const payload = getCompletedRoutinePayload(feedback);
      if (payload) submitRoutinePayload(payload);

      setSummaryVisible(false);
      resetSession();
      router.push("../goals");
    },
    [getCompletedRoutinePayload, resetSession, router],
  );

  if (!routine) {
    return (
      <View style={[s.centered, { backgroundColor: colors.bg }]}>
        <Text style={{ color: colors.textSecondary }}>Cargando rutina...</Text>
      </View>
    );
  }

  const progressPct =
    routine.exercises.length > 0
      ? (completedCount / routine.exercises.length) * 100
      : 0;

  return (
    <View style={[s.root, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <Text
            style={[s.routineName, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {routine.name || "Rutina de hoy"}
          </Text>
          <View style={s.badges}>
            <Badge label={routine.goal} color={colors.primary} />
            <Badge
              label={routine.experience}
              color={colors.textSecondary}
              subtle
            />
          </View>
        </View>

        <View
          style={[
            s.progressCard,
            {
              backgroundColor: colors.primary + "0E",
              borderColor: colors.primary + "25",
            },
          ]}
        >
          <View style={s.progressTop}>
            <View style={s.progressLeft}>
              <Ionicons
                name="fitness-outline"
                size={16}
                color={colors.primary}
              />
              <Text style={[s.progressLabel, { color: colors.primary }]}>
                Progreso
              </Text>
            </View>
            <Text style={[s.progressFraction, { color: colors.primary }]}>
              {completedCount}/{routine.exercises.length} ejercicios
            </Text>
          </View>
          <View style={[s.progressTrack, { backgroundColor: colors.border }]}>
            <View
              style={[
                s.progressFill,
                { backgroundColor: colors.primary, width: `${progressPct}%` },
              ]}
            />
          </View>
          <View style={s.miniStats}>
            <StatBar
              icon="layers-outline"
              value={`${totalStats.sets}`}
              label="series"
              color={colors.textSecondary}
            />
            <StatBar
              icon="time-outline"
              value={
                elapsedMin > 0
                  ? `${elapsedMin}m`
                  : `~${totalStats.estimatedMin}m`
              }
              label={elapsedMin > 0 ? "transcurrido" : "estimado"}
              color={colors.textSecondary}
            />
            <StatBar
              icon="checkmark-circle-outline"
              value={`${Math.round(progressPct)}%`}
              label="completado"
              color={allCompleted ? colors.primary : colors.textSecondary}
            />
          </View>
        </View>

        <Text style={[s.listTitle, { color: colors.textPrimary }]}>
          Ejercicios
        </Text>

        {routine.exercises.map((ex, idx) => {
          const progress = session?.exercises.find(
            (e) => e.exerciseIndex === idx,
          );
          return (
            <ExerciseCard
              key={idx}
              exercise={{ ...ex, index: idx } as any}
              index={idx}
              colors={colors}
              isDark={isDark}
              isCompleted={progress?.completed ?? false}
              progress={progress}
              isSelected={selectedExerciseIndex === idx}
              onSelect={() => handleSelectExercise(idx)}
              onStart={() => handleStartExercise(idx)}
              onEdit={() => handleStartExercise(idx)}
              formatRestTime={formatRestTime}
              formatTextTitle={formatTextTitle}
            />
          );
        })}

        <View style={{ height: 20 }} />
      </ScrollView>

      <View
        style={[
          s.finishBar,
          { backgroundColor: colors.bg, borderTopColor: colors.border },
        ]}
      >
        <PrimaryButton
          label={allCompleted ? "¡Finalizar rutina!" : "Finalizar rutina"}
          iconLeft={allCompleted ? "trophy" : "flag-outline"}
          onPress={handleFinishRoutine}
        />
      </View>

      <SeriesModal
        visible={seriesVisible}
        exercise={seriesExercise}
        progress={seriesProgress}
        colors={colors}
        isDark={isDark}
        onClose={handleCloseSeriesModal}
        onLogSet={handleLogSet}
        onUpdateTotalSets={handleUpdateTotalSets}
        onUpdateDisplayValues={handleUpdateDisplayValues}
        formatTextTitle={formatTextTitle}
      />

      <WorkoutSummaryModal
        visible={summaryVisible}
        colors={colors}
        isDark={isDark}
        durationMinutes={elapsedMin}
        exercisesCompleted={completedCount}
        exercisesTotal={routine.exercises.length}
        wasAbandoned={wasAbandoned}
        onSubmit={handleSurveySubmit}
        onClose={() => setSummaryVisible(false)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  scroll: { padding: 20, gap: 14, paddingBottom: 24 },

  header: { gap: 8 },
  routineName: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 6 },

  progressCard: { padding: 16, borderRadius: 18, borderWidth: 1, gap: 12 },
  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  progressLabel: { fontSize: 14, fontWeight: "700" },
  progressFraction: { fontSize: 13, fontWeight: "600" },
  progressTrack: { height: 7, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  miniStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 2,
  },

  listTitle: { fontSize: 19, fontWeight: "700", paddingTop: 4 },

  finishBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
});
