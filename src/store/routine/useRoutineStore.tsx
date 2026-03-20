import {
  CompletedRoutinePayload,
  ExerciseProgress,
  Routine,
  RoutineExercise,
  RoutineSession,
  SetLog,
} from "@/types/routine";
import { create } from "zustand";

interface RoutineStore {
  routine: Routine | null;
  session: RoutineSession | null;
  isLoading: boolean;
  error: string | null;

  setLoading: (value: boolean) => void;
  setRoutine: (params: {
    exercises: RoutineExercise[];
    goal: string | null;
    experience: string | null;
    routineName: string;
    routineId?: string;
  }) => void;
  setError: (error: string) => void;
  clearRoutine: () => void;

  startSession: () => void;
  getExerciseProgress: (exerciseIndex: number) => ExerciseProgress | undefined;

  /**
   * Actualiza los displayValues (lo que muestra la card en tiempo real).
   * Se llama cada vez que el usuario mueve un stepper — sin completar la serie.
   */
  updateDisplayValues: (
    exerciseIndex: number,
    values: Partial<ExerciseProgress["displayValues"]>,
  ) => void;

  /**
   * Registra el resultado de una serie (completada o skipeada).
   * Un ejercicio se marca como `completed` cuando se registran TODAS las series,
   * independientemente de si fueron completadas o skipeadas.
   */
  logSet: (
    exerciseIndex: number,
    log: {
      repsCompleted: number | null;
      weight: number | null;
      skipped: boolean;
    },
  ) => void;

  /**
   * Actualiza el total de series desde el modal.
   */
  updateTotalSets: (exerciseIndex: number, totalSets: number) => void;

  resetSession: () => void;

  /**
   * Construye el payload exacto que espera el backend.
   * Requiere el feedback de la encuesta para completarlo.
   */
  getCompletedRoutinePayload: (feedback: {
    intensity: number | null;
    energy: number | null;
    painLevel: number | null;
    comment: string;
  }) => CompletedRoutinePayload | null;
}

export const useRoutineStore = create<RoutineStore>((set, get) => ({
  routine: null,
  session: null,
  isLoading: false,
  error: null,

  setLoading: (value) => set({ isLoading: value }),

  setRoutine: ({ exercises, goal, experience, routineName, routineId }) =>
    set({
      routine: {
        routineId,
        name: routineName,
        goal: goal ?? "Objetivo no definido",
        experience: experience ?? "principiante",
        exercises,
        createdAt: new Date().toISOString(),
        totalExercises: exercises.length,
        totalSets: exercises.reduce((acc, ex) => acc + ex.sets, 0),
      },
      isLoading: false,
      error: null,
    }),

  setError: (error) => set({ error, isLoading: false }),

  clearRoutine: () =>
    set({ routine: null, session: null, error: null, isLoading: false }),

  startSession: () => {
    const { routine } = get();
    if (!routine) return;

    const exercises: ExerciseProgress[] = routine.exercises.map(
      (ex, index) => ({
        exerciseIndex: index,
        completed: false,
        currentSet: 1,
        totalSets: ex.sets,
        setLogs: [],
        displayValues: {
          reps: ex.reps,
          weight: ex.weight ?? 0,
          restSeconds: ex.restSeconds,
          sets: ex.sets,
        },
      }),
    );

    set({ session: { exercises, startedAt: new Date().toISOString() } });
  },

  getExerciseProgress: (exerciseIndex) => {
    const { session } = get();
    if (!session) return undefined;
    return session.exercises.find((ex) => ex.exerciseIndex === exerciseIndex);
  },

  updateDisplayValues: (exerciseIndex, values) => {
    const { session } = get();
    if (!session) return;

    const updated = session.exercises.map((ex) =>
      ex.exerciseIndex === exerciseIndex
        ? { ...ex, displayValues: { ...ex.displayValues, ...values } }
        : ex,
    );
    set({ session: { ...session, exercises: updated } });
  },

  logSet: (exerciseIndex, { repsCompleted, weight, skipped }) => {
    const { session } = get();
    if (!session) return;

    const exercise = session.exercises.find(
      (ex) => ex.exerciseIndex === exerciseIndex,
    );
    if (!exercise) return;

    const setNumber = exercise.currentSet;
    const isLastSet = setNumber >= exercise.totalSets;

    const newLog: SetLog = {
      setNumber,
      repsCompleted: skipped ? null : repsCompleted,
      weight: skipped ? null : weight,
      skipped,
    };

    const updated = session.exercises.map((ex) => {
      if (ex.exerciseIndex !== exerciseIndex) return ex;
      return {
        ...ex,
        setLogs: [...ex.setLogs, newLog],
        currentSet: ex.currentSet + 1,
        // ✅ Fix: completed = true cuando se termina la ÚLTIMA serie,
        // sin importar si fue completada o skipeada.
        completed: isLastSet,
      };
    });

    set({ session: { ...session, exercises: updated } });
  },

  updateTotalSets: (exerciseIndex, totalSets) => {
    const { session } = get();
    if (!session) return;

    const updated = session.exercises.map((ex) =>
      ex.exerciseIndex === exerciseIndex
        ? {
            ...ex,
            totalSets,
            displayValues: { ...ex.displayValues, sets: totalSets },
          }
        : ex,
    );
    set({ session: { ...session, exercises: updated } });
  },

  resetSession: () => set({ session: null }),

  getCompletedRoutinePayload: (feedback) => {
    const { routine, session } = get();
    if (!routine || !session) return null;

    const exercises = routine.exercises.map((ex, index) => {
      const progress = session.exercises.find((p) => p.exerciseIndex === index);
      return {
        name: ex.name,
        setLogs: progress?.setLogs ?? [],
      };
    });

    // wasAbandoned = true si hay al menos un ejercicio que nunca se tocó
    // (el usuario no registró ni una sola serie, ni siquiera skipeada).
    // Un ejercicio donde todas las series fueron salteadas NO cuenta como abandonado
    // porque el usuario sí tomó la decisión activa de saltearlo.
    const wasAbandoned = routine.exercises.some((_, index) => {
      const progress = session.exercises.find((p) => p.exerciseIndex === index);
      return !progress || progress.setLogs.length === 0;
    });

    return {
      routineId: routine.routineId,
      startedAt: session.startedAt,
      completedAt: new Date().toISOString(),
      wasAbandoned,
      feedback,
      exercises,
    };
  },
}));
