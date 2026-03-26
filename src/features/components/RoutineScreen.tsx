import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import { useLoadingStore } from "@/store/loading/loadingStore";
import { useRoutineStore } from "@/store/routine/useRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { ExerciseProgress } from "@/types/routine/exercise.type";

import { PrimaryButton } from "@/shared/components/PrimaryButton";

import { formatRestTime } from "../build-routine/utils/formatRestTime";
import { formatTextTitle } from "../build-routine/utils/formatTextTitle";

import { AppNotification } from "@/services/notificationService";
import { RoutineService } from "@/services/routineService";
import { useNotificationStore } from "@/store/notification/usenotificationstore";
import { CustomHeaderRoutine } from "../build-routine/components/CustomHeaderRoutine";
import { CompletedExerciseModal } from "./Completedexercisemodal";
import { ExerciseCard } from "./ExerciseCard";
import { PendingAdjustmentsModal } from "./PendingAdjustmentsModal";
import { ReplaceExerciseModal } from "./ReplaceExerciseModal";
import { RoutineHeader } from "./RoutineHeader";
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
    replaceExerciseName,
  } = useRoutineStore();
  const {
    fetchNotifications,
    getPendingAdjustmentNotification,
    clearPendingAdjustments,
  } = useNotificationStore();
  const { setLoading } = useLoadingStore();

  const [replaceModalVisible, setReplaceModalVisible] = useState(false);
  const [exerciseToReplace, setExerciseToReplace] = useState<{
    index: number;
    name: string;
    muscle: string;
  } | null>(null);

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
  const [adjustmentNotif, setAdjustmentNotif] =
    useState<AppNotification | null>(null);
  const isSubmittingRef = useRef(false);
  const { from } = useLocalSearchParams<{ from?: string }>();

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

  // Encontrar el primer ejercicio no completado
  const firstIncompleteExerciseIndex = useMemo(() => {
    if (!session || !routine) return null;
    const incompleteIndex = session.exercises.findIndex((e) => !e.completed);
    return incompleteIndex !== -1 ? incompleteIndex : null;
  }, [session, routine]);

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

    const goBack = () => {
      resetSession();
      if (from === "generating") {
        router.replace("/(app)/(tabs)/rutinas");
      } else {
        router.back();
      }
    };

    if (!hasProgress) {
      goBack();
      return;
    }

    Alert.alert(
      "¿Salir del entrenamiento?",
      "Tu progreso actual no se guardará. ¿Querés salir igual?",
      [
        { text: "Seguir entrenando", style: "cancel" },
        { text: "Salir", style: "destructive", onPress: goBack },
      ],
    );
  }, [session, resetSession, router, from]);

  const totalEstimatedMin = useMemo(() => {
    if (!routine) return 0;
    const totalSets = routine.exercises.reduce((acc, e) => acc + e.sets, 0);
    const avgRestMin =
      routine.exercises.reduce((acc, e) => acc + e.restSeconds, 0) /
      routine.exercises.length /
      60;
    return Math.round(totalSets * (1.5 + avgRestMin));
  }, [routine]);

  const handleSelectExercise = useCallback(
    (index: number) => {
      const progress = session?.exercises.find(
        (e) => e.exerciseIndex === index,
      );
      if (progress?.completed) return;
      setSelectedExerciseIndex((prev) => (prev === index ? null : index));
    },
    [session],
  );

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

  const handleStartFirstIncomplete = useCallback(() => {
    if (firstIncompleteExerciseIndex !== null) {
      handleStartExercise(firstIncompleteExerciseIndex);
    }
  }, [firstIncompleteExerciseIndex, handleStartExercise]);

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
      restSeconds: number;
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
    // Si todos los ejercicios están completados, finalizar directamente sin confirmación
    if (allCompleted) {
      setElapsedMin(Math.round((Date.now() - sessionStartRef.current) / 60000));
      setWasAbandoned(false);
      setSummaryVisible(true);
      return;
    }

    // Si hay ejercicios incompletos, mostrar confirmación antes de finalizar
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

        const pendingNotif = getPendingAdjustmentNotification();
        if (pendingNotif) {
          setAdjustmentNotif(pendingNotif);
          return;
        }
      } catch (error) {
        console.error("[RoutineScreen] Error al guardar sesión:", error);
      } finally {
        setLoading(false);
        if (!getPendingAdjustmentNotification()) {
          isSubmittingRef.current = false;
          resetSession();
          router.replace("/(app)/(tabs)/rutinas");
        }
      }
    },
    [
      fetchNotifications,
      getCompletedRoutinePayload,
      getPendingAdjustmentNotification,
      resetSession,
      router,
      setLoading,
    ],
  );

  const buttonConfig = useMemo(() => {
    if (allCompleted) {
      return {
        label: "¡Finalizar rutina!",
        action: handleFinishRoutine,
        icon: "trophy" as const,
      };
    } else {
      return {
        label: "Empezar ejercicio",
        action: handleStartFirstIncomplete,
        icon: "play-circle" as const,
      };
    }
  }, [allCompleted, handleFinishRoutine, handleStartFirstIncomplete]);

  const handleApplyAdjustments = useCallback(async () => {
    if (!adjustmentNotif?.routineId) return;
    try {
      setLoading(true);
      await routineService.applyAdjustments(
        adjustmentNotif.routineId,
        adjustmentNotif.id,
      );
      clearPendingAdjustments(adjustmentNotif.id);

      const routinas = await routineService.getUserRoutines();
      const updatedRoutine = routinas.find(
        (r) => r.routineId === adjustmentNotif.routineId,
      );
      if (updatedRoutine) {
        useRoutineStore.getState().setRoutine({
          exercises: updatedRoutine.exercises,
          goal: updatedRoutine.goal,
          experience: updatedRoutine.experience,
          routineName: updatedRoutine.name,
          routineId: updatedRoutine.routineId,
        });
      }
    } catch (e) {
      console.error("[RoutineScreen] Error al aplicar ajustes:", e);
    } finally {
      setLoading(false);
      setAdjustmentNotif(null);
      isSubmittingRef.current = false;
      resetSession();
      router.replace("/(app)/(tabs)/rutinas");
    }
  }, [
    adjustmentNotif,
    clearPendingAdjustments,
    resetSession,
    router,
    setLoading,
  ]);

  const handleIgnoreAdjustments = useCallback(() => {
    if (adjustmentNotif) clearPendingAdjustments(adjustmentNotif.id);
    setAdjustmentNotif(null);
    isSubmittingRef.current = false;
    resetSession();
    router.replace("/(app)/(tabs)/rutinas");
  }, [adjustmentNotif, clearPendingAdjustments, resetSession, router]);

  const handleReplaceExercise = useCallback(
    async (newName: string) => {
      if (seriesIndex === null || !routine?.routineId) return;
      const currentExercise = routine.exercises[seriesIndex];
      try {
        setLoading(true);
        await routineService.replaceExercise(
          routine.routineId,
          currentExercise.name,
          newName,
        );
        replaceExerciseName(seriesIndex, newName);
      } catch (e) {
        console.error("[RoutineScreen] Error al reemplazar ejercicio:", e);
      } finally {
        setLoading(false);
      }
    },
    [seriesIndex, routine, setLoading, replaceExerciseName],
  );

  if (!routine) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.bg }]}>
        <Text style={{ color: colors.textSecondary }}>Cargando rutina...</Text>
      </View>
    );
  }

  const progressPct =
    routine.exercises.length > 0
      ? (completedCount / routine.exercises.length) * 100
      : 0;

  // Determinar el texto y acción del botón

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <RoutineHeader title={"Entrenamiento"} onBack={handleGoBack} />

      <ScrollView
        contentContainerStyle={styles.scroll}
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
            styles.progressCard,
            {
              backgroundColor: colors.primary + "0E",
              borderColor: colors.primary + "25",
            },
          ]}
        >
          <View style={styles.progressTop}>
            <View style={styles.progressLeft}>
              <Ionicons
                name="fitness-outline"
                size={16}
                color={colors.primary}
              />
              <Text style={[styles.progressLabel, { color: colors.primary }]}>
                Progreso
              </Text>
            </View>
            <Text style={[styles.progressFraction, { color: colors.primary }]}>
              {completedCount}/{routine.exercises.length} ejercicios
            </Text>
          </View>

          <View
            style={[styles.progressTrack, { backgroundColor: colors.border }]}
          >
            <View
              style={[
                styles.progressFill,
                { backgroundColor: colors.primary, width: `${progressPct}%` },
              ]}
            />
          </View>
        </View>

        <Text style={[styles.listTitle, { color: colors.textPrimary }]}>
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
              onSelect={() => handleSelectExercise(idx)}
              onStart={() => handleStartExercise(idx)}
              onEdit={() => handleStartExercise(idx)}
              onViewSummary={() => handleViewCompletedExercise(idx)}
              formatRestTime={formatRestTime}
              formatTextTitle={formatTextTitle}
            />
          );
        })}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Botón dinámico */}
      <View
        style={[
          styles.finishBar,
          { backgroundColor: colors.bg, borderTopColor: colors.border },
        ]}
      >
        <PrimaryButton
          label={buttonConfig.label}
          iconLeft={buttonConfig.icon}
          onPress={buttonConfig.action}
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
          onReplaceExercise={handleReplaceExercise}
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

      {/* Modal de ajustes de la IA */}
      <PendingAdjustmentsModal
        visible={!!adjustmentNotif}
        routineName={routine.name}
        adjustments={adjustmentNotif?.pendingAdjustments ?? []}
        onApply={handleApplyAdjustments}
        onIgnore={handleIgnoreAdjustments}
      />

      {/* Modal de ajustes de ejercicio */}
      <ReplaceExerciseModal
        visible={replaceModalVisible}
        muscle={exerciseToReplace?.muscle ?? ""}
        currentName={exerciseToReplace?.name ?? ""}
        onSelect={handleReplaceExercise}
        onClose={() => {
          setReplaceModalVisible(false);
          setExerciseToReplace(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
