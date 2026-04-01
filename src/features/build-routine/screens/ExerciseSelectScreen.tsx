import { ExerciseService } from "@/services/exerciseService";
import OnboardingLayout from "@/shared/components/OnboardingLayout";
import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { Exercise, RoutineExercise, WeekDayKey } from "@/types/routine";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useShallow } from "zustand/react/shallow";

import { ConfigModal } from "../components/exercise-select/ConfigModal";
import { ExerciseCard } from "../components/exercise-select/ExerciseCard";
import { DAY_LABELS } from "../constants/dayLabels";
import { MUSCLE_LABELS } from "../constants/muscleLabels";
import { ROUTINE_TYPE_TO_MUSCLES } from "../constants/routineTypeToMuscles";

const exerciseService = new ExerciseService();

function useColors() {
  const { theme, isDark } = useAppTheme();
  return {
    isDark,
    teal: theme.primary,
    text: isDark ? "#DFF0EE" : theme.text,
    sub: isDark ? "#4A6A66" : theme.textSecondary,
    card: isDark ? "#0C1119" : theme.card,
    border: isDark ? "rgba(46,207,190,0.15)" : theme.border,
  };
}

export default function ExerciseSelectScreen() {
  const colors = useColors();
  const router = useRouter();
  const { day } = useLocalSearchParams<{ day: WeekDayKey }>();

  const weekPlan = useBuildRoutineStore((s) => s.weekPlan);
  const equipment = useBuildRoutineStore((s) => s.equipment);

  const selectedExercises = useBuildRoutineStore(
    useShallow((s) =>
      day ? (s.exercisePlan.find((p) => p.day === day)?.exercises ?? []) : [],
    ),
  );

  const addExerciseToDay = useBuildRoutineStore((s) => s.addExerciseToDay);
  const removeExerciseFromDay = useBuildRoutineStore(
    (s) => s.removeExerciseFromDay,
  );

  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // modal
  const [modalExercise, setModalExercise] = useState<Exercise | null>(null);
  const [modalInitial, setModalInitial] = useState({
    sets: "3",
    reps: "10",
    rest: "60",
  });

  const modalVisible = modalExercise !== null;

  const dayPlan = weekPlan.find((p) => p.day === day);
  const muscles = dayPlan?.muscles ?? [];

  useEffect(() => {
    if (muscles.length > 0) loadExercises();
    else {
      setLoading(false);
      setError("No hay músculos asignados");
    }
  }, []);

  const loadExercises = async () => {
    setLoading(true);
    try {
      const resolved = muscles.flatMap(
        (m) => ROUTINE_TYPE_TO_MUSCLES[m] ?? [m],
      );

      const unique = [...new Set(resolved)];
      let all: Exercise[] = [];

      for (const m of unique) {
        const res = await exerciseService.getExercisesByMuscle(
          m,
          equipment ?? "",
        );
        all.push(...res);
      }

      setAvailableExercises(
        all.filter((e, i, arr) => arr.findIndex((x) => x.id === e.id) === i),
      );
    } catch {
      setError("Error cargando ejercicios");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = (exercise: Exercise) => {
    setModalInitial({ sets: "3", reps: "10", rest: "60" });
    setModalExercise(exercise);
  };

  const openEdit = (exercise: Exercise, saved: RoutineExercise) => {
    setModalInitial({
      sets: saved.sets.toString(),
      reps: saved.reps,
      rest: saved.restSeconds.toString(),
    });
    setModalExercise(exercise);
  };

  const handleConfirm = (sets: string, reps: string, rest: string) => {
    if (!day || !modalExercise) return;

    removeExerciseFromDay(day, modalExercise.id);

    addExerciseToDay(day, {
      id: modalExercise.id,
      name: modalExercise.name,
      muscle: modalExercise.muscle,
      sets: parseInt(sets) || 3,
      reps: reps || "10",
      restSeconds: parseInt(rest) || 60,
    });

    setModalExercise(null);
  };

  const handleRemove = (id: string) => {
    if (!day) return;
    removeExerciseFromDay(day, id);
  };

  const handlePress = (exercise: Exercise) => {
    const exists = selectedExercises.find((e) => e.id === exercise.id);
    if (!exists) openAdd(exercise);
  };

  if (!day) return null;

  return (
    <>
      <OnboardingLayout
        title={`Ejercicios · ${DAY_LABELS[day]}`}
        onNext={() => router.back()}
        isNextDisabled={!selectedExercises.length || modalVisible}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.headerRow}>
            <Text
              style={{
                color: colors.sub,
                fontSize: 16,
                fontWeight: "600",
                letterSpacing: 0.5,
              }}
            >
              {muscles.join(" · ").toUpperCase()}
            </Text>

            <Text style={{ color: colors.teal }}>
              {selectedExercises.length} seleccionados
            </Text>
          </View>

          {/* ERROR */}
          {error && (
            <View style={styles.errorBox}>
              <Text style={{ color: "red" }}>{error}</Text>
            </View>
          )}

          {/* CONTENT */}
          {loading ? (
            <ActivityIndicator color={colors.teal} />
          ) : (
            <ScrollView>
              {Object.entries(groupByMuscle(availableExercises)).map(
                ([muscle, exercises]) => (
                  <View key={muscle} style={styles.section}>
                    <Text
                      style={{
                        color: colors.teal,
                        paddingVertical: 6,
                      }}
                    >
                      {MUSCLE_LABELS[muscle] ?? muscle}
                    </Text>

                    {exercises.map((ex) => {
                      const saved = selectedExercises.find(
                        (s) => s.id === ex.id,
                      );

                      return (
                        <ExerciseCard
                          key={ex.id}
                          exercise={ex}
                          selectedData={saved}
                          onPress={() => handlePress(ex)}
                          onEdit={() => openEdit(ex, saved!)}
                          onRemove={() => handleRemove(ex.id)}
                          colors={colors}
                        />
                      );
                    })}
                  </View>
                ),
              )}
            </ScrollView>
          )}
        </View>
      </OnboardingLayout>

      <ConfigModal
        visible={modalVisible}
        exercise={modalExercise}
        initial={modalInitial}
        onConfirm={handleConfirm}
        onCancel={() => setModalExercise(null)}
        colors={colors}
      />
    </>
  );
}

function groupByMuscle(exercises: Exercise[]) {
  return exercises.reduce(
    (acc, ex) => {
      if (!acc[ex.muscle]) acc[ex.muscle] = [];
      acc[ex.muscle].push(ex);
      return acc;
    },
    {} as Record<string, Exercise[]>,
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: token.spacing.xl,
  },
  section: {
    marginBottom: token.spacing.lg,
  },

  errorBox: {
    padding: token.spacing.md,
    borderRadius: token.radius.md,
    marginVertical: token.spacing.md,
    backgroundColor: "#fee",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: token.spacing.md,
  },
});
