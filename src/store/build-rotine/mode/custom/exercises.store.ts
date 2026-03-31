import {
  DayExercisePlan,
  RoutineExercise,
  WeekDayKey,
} from "@/features/build-routine/type/routine-builder.types";
import { StoreApi } from "zustand";

export interface ExercisesStore {
  exercisePlan: DayExercisePlan[];
  setExercisesForDay: (day: WeekDayKey, exercises: RoutineExercise[]) => void;
  addExerciseToDay: (day: WeekDayKey, exercise: RoutineExercise) => void;
  removeExerciseFromDay: (day: WeekDayKey, exerciseId: string) => void;
  updateExerciseInDay: (
    day: WeekDayKey,
    exerciseId: string,
    updates: Partial<RoutineExercise>,
  ) => void;
  getExercisesForDay: (day: WeekDayKey) => RoutineExercise[];
  resetExercises: () => void;
}

export const createExercisesStore = (
  set: StoreApi<ExercisesStore>["setState"],
  get: StoreApi<ExercisesStore>["getState"],
): ExercisesStore => ({
  exercisePlan: [],

  setExercisesForDay: (day, exercises) =>
    set((state) => {
      const filtered = state.exercisePlan.filter((p) => p.day !== day);
      return {
        exercisePlan:
          exercises.length > 0 ? [...filtered, { day, exercises }] : filtered,
      };
    }),

  addExerciseToDay: (day, exercise) =>
    set((state) => {
      const existing = state.exercisePlan.find((p) => p.day === day);
      if (existing) {
        return {
          exercisePlan: state.exercisePlan.map((p) =>
            p.day === day ? { ...p, exercises: [...p.exercises, exercise] } : p,
          ),
        };
      }
      return {
        exercisePlan: [...state.exercisePlan, { day, exercises: [exercise] }],
      };
    }),

  removeExerciseFromDay: (day, exerciseId) =>
    set((state) => ({
      exercisePlan: state.exercisePlan
        .map((p) =>
          p.day === day
            ? {
                ...p,
                exercises: p.exercises.filter((e) => e.id !== exerciseId),
              }
            : p,
        )
        .filter((p) => p.exercises.length > 0),
    })),

  updateExerciseInDay: (day, exerciseId, updates) =>
    set((state) => ({
      exercisePlan: state.exercisePlan.map((p) =>
        p.day === day
          ? {
              ...p,
              exercises: p.exercises.map((e) =>
                e.id === exerciseId ? { ...e, ...updates } : e,
              ),
            }
          : p,
      ),
    })),

  getExercisesForDay: (day) => {
    const state = get();
    return state.exercisePlan.find((p) => p.day === day)?.exercises ?? [];
  },

  resetExercises: () => set({ exercisePlan: [] }),
});
