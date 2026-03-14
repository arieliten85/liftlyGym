import {
  CompletedRoutinePayload,
  ExerciseProgress,
  Routine,
  RoutineExercise,
  RoutineSession,
} from "@/type/routine.type";
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
  }) => void;

  setError: (error: string) => void;

  clearRoutine: () => void;

  // Session management
  startSession: () => void;
  updateExerciseProgress: (
    exerciseIndex: number,
    updates: Partial<ExerciseProgress>,
  ) => void;
  completeExercise: (exerciseIndex: number) => void;
  nextSet: (exerciseIndex: number) => void;
  getExerciseProgress: (exerciseIndex: number) => ExerciseProgress | undefined;
  resetSession: () => void;

  getCompletedRoutinePayload: () => CompletedRoutinePayload | null;
}

export const useRoutineStore = create<RoutineStore>((set, get) => ({
  routine: null,
  session: null,
  isLoading: false,
  error: null,

  setLoading: (value) =>
    set({
      isLoading: value,
    }),

  setRoutine: ({ exercises, goal, experience, routineName }) =>
    set({
      routine: {
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

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  clearRoutine: () =>
    set({
      routine: null,
      session: null,
      error: null,
      isLoading: false,
    }),

  startSession: () => {
    const { routine } = get();
    if (!routine) return;

    const exercises: ExerciseProgress[] = routine.exercises.map(
      (ex, index) => ({
        exerciseIndex: index,
        completed: false,
        currentSet: 1,
        totalSets: ex.sets,
        editedReps: ex.reps,
        editedWeight: ex.weight ?? 0,
        editedRestSeconds: ex.restSeconds,
      }),
    );

    set({
      session: {
        exercises,
        startedAt: new Date().toISOString(),
      },
    });
  },

  updateExerciseProgress: (exerciseIndex, updates) => {
    const { session } = get();
    if (!session) return;

    const updatedExercises = session.exercises.map((ex) =>
      ex.exerciseIndex === exerciseIndex ? { ...ex, ...updates } : ex,
    );

    set({
      session: {
        ...session,
        exercises: updatedExercises,
      },
    });
  },

  completeExercise: (exerciseIndex) => {
    const { session } = get();
    if (!session) return;

    const updatedExercises = session.exercises.map((ex) =>
      ex.exerciseIndex === exerciseIndex ? { ...ex, completed: true } : ex,
    );

    set({
      session: {
        ...session,
        exercises: updatedExercises,
      },
    });
  },

  nextSet: (exerciseIndex) => {
    const { session } = get();
    if (!session) return;

    const exercise = session.exercises.find(
      (ex) => ex.exerciseIndex === exerciseIndex,
    );
    if (!exercise) return;

    if (exercise.currentSet >= exercise.totalSets) {
      get().completeExercise(exerciseIndex);
      return;
    }

    const updatedExercises = session.exercises.map((ex) =>
      ex.exerciseIndex === exerciseIndex
        ? { ...ex, currentSet: ex.currentSet + 1 }
        : ex,
    );

    set({
      session: {
        ...session,
        exercises: updatedExercises,
      },
    });
  },

  getExerciseProgress: (exerciseIndex) => {
    const { session } = get();
    if (!session) return undefined;
    return session.exercises.find((ex) => ex.exerciseIndex === exerciseIndex);
  },

  resetSession: () => {
    set({ session: null });
  },

  getCompletedRoutinePayload: () => {
    const { routine, session } = get();
    if (!routine || !session) return null;

    const exercises = routine.exercises.map((ex, index) => {
      const progress = session.exercises.find((p) => p.exerciseIndex === index);
      return {
        name: ex.name,
        originalSets: ex.sets,
        originalReps: ex.reps,
        originalRestSeconds: ex.restSeconds,
        originalWeight: ex.weight ?? 0,
        editedSets: progress?.totalSets ?? ex.sets,
        editedReps: progress?.editedReps ?? ex.reps,
        editedRestSeconds: progress?.editedRestSeconds ?? ex.restSeconds,
        editedWeight: progress?.editedWeight ?? ex.weight ?? 0,
      };
    });

    const startTime = new Date(session.startedAt).getTime();
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000 / 60);

    return {
      routineName: routine.name,
      goal: routine.goal,
      experience: routine.experience,
      completedAt: new Date().toISOString(),
      duration,
      exercises,
    };
  },
}));
