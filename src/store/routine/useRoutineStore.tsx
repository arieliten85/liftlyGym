// store/routine/useRoutineStore.ts
// CAMBIO: logSet ahora recibe restSeconds y lo guarda en el SetLog.
// El valor viene del modal (displayValues.restSeconds al momento de completar).
// getCompletedRoutinePayload no necesita cambios — ya serializa setLogs completo.

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

  updateDisplayValues: (
    exerciseIndex: number,
    values: Partial<ExerciseProgress["displayValues"]>,
  ) => void;

  logSet: (
    exerciseIndex: number,
    log: {
      repsCompleted: number | null;
      weight: number | null;
      skipped: boolean;
      restSeconds: number;
    },
  ) => void;

  updateTotalSets: (exerciseIndex: number, totalSets: number) => void;
  resetSession: () => void;

  getCompletedRoutinePayload: (feedback: {
    intensity: number | null;
    energy: number | null;
    painLevel: number | null;
    comment: string;
  }) => CompletedRoutinePayload | null;

  replaceExerciseName: (exerciseIndex: number, newName: string) => void;
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
        mode: "quick",
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

  logSet: (exerciseIndex, { repsCompleted, weight, skipped, restSeconds }) => {
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
      restSeconds, // ← el descanso real de este set específico
    };

    const updated = session.exercises.map((ex) => {
      if (ex.exerciseIndex !== exerciseIndex) return ex;
      return {
        ...ex,
        setLogs: [...ex.setLogs, newLog],
        currentSet: ex.currentSet + 1,
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

  replaceExerciseName: (exerciseIndex, newName) => {
    const { routine } = get();
    if (!routine) return;

    const updatedExercises = routine.exercises.map((ex, idx) =>
      idx === exerciseIndex ? { ...ex, name: newName } : ex,
    );

    set({
      routine: {
        ...routine,
        exercises: updatedExercises,
      },
    });
  },
}));
