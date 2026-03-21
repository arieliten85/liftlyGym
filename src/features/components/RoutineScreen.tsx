import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useLoadingStore } from "@/store/loading/loadingStore";
import { useRoutineStore } from "@/store/routine/useRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { ExerciseProgress } from "@/types/routine/exercise.type";

import { PrimaryButton } from "@/shared/components/PrimaryButton";

import { calculateWorkoutTime } from "@/utils/workout.utils";
import { formatRestTime } from "../build-routine/utils/formatRestTime";
import { formatTextTitle } from "../build-routine/utils/formatTextTitle";

import { RoutineService } from "@/services/routineService";
import { useNotificationStore } from "@/store/notification/usenotificationstore";
import { CustomHeaderRoutine } from "../build-routine/components/CustomHeaderRoutine";
import { CompletedExerciseModal } from "./Completedexercisemodal";
import { ExerciseCard } from "./ExerciseCard";
import { SeriesModal } from "./SeriesModal";
import {
  WorkoutSummaryModal,
  WorkoutSurveyPayload,
} from "./WorkoutSummaryModal";

const EXP_LABEL: Record<string, string> = {
  beginner: "PRINCIPIANTE",
  intermediate: "INTERMEDIO",
  advanced: "AVANZADO",
};

const EXP_COLOR: Record<string, string> = {
  beginner: "#22C55E",
  intermediate: "#F59E0B",
  advanced: "#3B82F6",
};

const COVER_BY_GOAL: Record<string, string> = {
  strength: "#1B2E1B",
  hypertrophy: "#1B1B30",
  general_fitness: "#2A2010",
  weight_loss: "#2A1010",
  endurance: "#101828",
};

const routineService = new RoutineService();

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
  const { fetchNotifications } = useNotificationStore();
  const { setLoading } = useLoadingStore();

  const sessionStartRef = useRef<number>(Date.now());
  const [elapsedMin, setElapsedMin] = useState(0);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<
    number | null
  >(null);
  const [seriesIndex, setSeriesIndex] = useState<number | null>(null);
  const [seriesVisible, setSeriesVisible] = useState(false);
  const [summaryExerciseIndex, setSummaryExerciseIndex] = useState<
    number | null
  >(null);
  const [completedSummaryVisible, setCompletedSummaryVisible] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [wasAbandoned, setWasAbandoned] = useState(false);
  const isSubmittingRef = useRef(false);

  const expColor = routine
    ? (EXP_COLOR[routine.experience] ?? "#6B7280")
    : "#6B7280";
  const expLabel = routine
    ? (EXP_LABEL[routine.experience] ?? routine.experience.toUpperCase())
    : "";
  const coverColor = routine
    ? (COVER_BY_GOAL[routine.goal] ?? "#1A1A1A")
    : "#1A1A1A";

  const colors = useMemo(
    () => ({
      bg: theme.background,
      surface: theme.surface || (isDark ? "#1E1E1E" : "#FFFFFF"),
      textPrimary: theme.text,
      textSecondary: isDark ? "#A0A0A0" : "#5E5E5E",
      primary: theme.primary,
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

  const completedCount = useMemo(
    () => session?.exercises.filter((e) => e.completed).length ?? 0,
    [session],
  );

  const allCompleted = useMemo(
    () => !!session && routine && completedCount === routine.exercises.length,
    [session, routine, completedCount],
  );

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
  const summaryExerciseProgress = useMemo(
    () =>
      session?.exercises.find(
        (e) => e.exerciseIndex === summaryExerciseIndex,
      ) ?? null,
    [summaryExerciseIndex, session],
  );
  const summaryExerciseData = useMemo(
    () =>
      summaryExerciseIndex !== null && routine
        ? routine.exercises[summaryExerciseIndex]
        : null,
    [summaryExerciseIndex, routine],
  );

  const handleGoBack = useCallback(() => {
    const hasProgress =
      session?.exercises.some((e) => e.setLogs.length > 0) ?? false;
    if (!hasProgress) {
      resetSession();
      router.replace("/(tabs)/rutinas");
      return;
    }
    Alert.alert(
      "¿Salir del entrenamiento?",
      "Tu progreso actual no se guardará. ¿Querés salir igual?",
      [
        { text: "Seguir entrenando", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: () => {
            resetSession();
            router.replace("/(tabs)/rutinas");
          },
        },
      ],
    );
  }, [session, resetSession, router]);

  const totalEstimatedMin = useMemo(() => {
    if (!routine) return 0;
    const totalSets = routine.exercises.reduce((acc, e) => acc + e.sets, 0);
    const avgRestMin =
      routine.exercises.reduce((acc, e) => acc + e.restSeconds, 0) /
      routine.exercises.length /
      60;
    return Math.round(totalSets * (1.5 + avgRestMin));
  }, [routine]);

  // ── Solo selecciona la card (highlight visual), NO abre el modal ──
  const handleSelectExercise = useCallback(
    (index: number) => {
      const progress = session?.exercises.find(
        (e) => e.exerciseIndex === index,
      );
      if (progress?.completed) return;
      // Alterna la selección: si ya está seleccionada, la deselecciona
      setSelectedExerciseIndex((prev) => (prev === index ? null : index));
    },
    [session],
  );

  // ── Abre el SeriesModal
  const handleStartExercise = useCallback(
    (index: number) => {
      const progress = session?.exercises.find(
        (e) => e.exerciseIndex === index,
      );
      if (progress?.completed) return;
      setSelectedExerciseIndex(index);
      setSeriesIndex(index);
      setSeriesVisible(true);
    },
    [session],
  );

  const handleViewCompletedExercise = useCallback((index: number) => {
    setSummaryExerciseIndex(index);
    setCompletedSummaryVisible(true);
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
    async (survey: WorkoutSurveyPayload) => {
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;

      const feedback = {
        intensity: survey.intensity > 0 ? survey.intensity : null,
        energy: survey.energy > 0 ? survey.energy : null,
        painLevel: survey.painLevel > 0 ? survey.painLevel : null,
        comment: survey.comment,
      };

      const payload = getCompletedRoutinePayload(feedback);
      if (!payload) {
        isSubmittingRef.current = false;
        return;
      }

      setSummaryVisible(false);
      setLoading(true);
      try {
        await routineService.completeSession(payload);
        await fetchNotifications();
      } catch (error) {
        console.error("[RoutineScreen] Error al guardar sesión:", error);
      } finally {
        setLoading(false);
        isSubmittingRef.current = false;
        resetSession();
        router.replace("/(tabs)/rutinas");
      }
    },
    [
      fetchNotifications,
      getCompletedRoutinePayload,
      resetSession,
      router,
      setLoading,
    ],
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
      <TouchableOpacity
        onPress={handleGoBack}
        activeOpacity={0.7}
        style={[s.backBtn, { backgroundColor: isDark ? "#1E1E1E" : "#F0F0F0" }]}
      >
        <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <CustomHeaderRoutine
          routineName={routine.name}
          goal={routine.goal}
          elapsedMinutes={elapsedMin}
          estimatedMinutes={totalEstimatedMin}
          primaryColor={colors.primary}
          containerHeight={250}
        />

        {/* Progreso */}
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
        </View>

        <Text style={[s.listTitle, { color: colors.textPrimary }]}>
          Ejercicios{" "}
          <Text style={{ color: colors.primary }}>
            ({routine.totalExercises})
          </Text>
        </Text>

        {routine.exercises.map((ex, idx) => {
          const progress = session?.exercises.find(
            (e) => e.exerciseIndex === idx,
          );
          const isCompleted = progress?.completed ?? false;
          return (
            <ExerciseCard
              key={idx}
              exercise={{ ...ex, index: idx } as any}
              index={idx}
              colors={colors}
              isDark={isDark}
              isCompleted={isCompleted}
              progress={progress}
              isSelected={selectedExerciseIndex === idx}
              // Tocar la card → solo selecciona (highlight)
              onSelect={() => handleSelectExercise(idx)}
              // Tocar el botón play → abre el SeriesModal
              onStart={() => handleStartExercise(idx)}
              onEdit={() => handleStartExercise(idx)}
              // Ejercicio ya completado → abre el resumen de solo lectura
              onViewSummary={() => handleViewCompletedExercise(idx)}
              formatRestTime={formatRestTime}
              formatTextTitle={formatTextTitle}
            />
          );
        })}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Botón finalizar */}
      <View
        style={[
          s.finishBar,
          { backgroundColor: colors.bg, borderTopColor: colors.border },
        ]}
      >
        <PrimaryButton
          label={allCompleted ? "¡Finalizar rutina!" : "Finalizar rutina"}
          onPress={handleFinishRoutine}
        />
      </View>

      {seriesExercise && (
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
      )}

      <CompletedExerciseModal
        visible={completedSummaryVisible}
        exercise={summaryExerciseData}
        progress={summaryExerciseProgress}
        colors={colors}
        isDark={isDark}
        onClose={() => {
          setCompletedSummaryVisible(false);
          setSummaryExerciseIndex(null);
        }}
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  topBarTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
    textAlign: "center",
    marginHorizontal: 8,
  },
  scroll: { padding: 20, gap: 14, paddingBottom: 24 },
  coverContainer: {
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    marginBottom: 8,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 1,
  },
  expBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    zIndex: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  expText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.8,
  },
  badgesRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
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
