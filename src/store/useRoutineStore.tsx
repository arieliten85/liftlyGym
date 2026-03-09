import { RoutineExercise } from "@/type/routine.type";
import { create } from "zustand";

export interface Routine {
  name: string;
  goal: string;
  experience: string;
  exercises: RoutineExercise[];
  createdAt: string;
  totalExercises: number;
  totalSets: number;
}

interface RoutineStore {
  routine: Routine | null;
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
}

export const useRoutineStore = create<RoutineStore>((set) => ({
  routine: null,
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
      error: null,
      isLoading: false,
    }),
}));
