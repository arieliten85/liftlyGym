import {
  EquipmentType,
  ExperienceType,
  GoalType,
  RoutineCustomType,
  RoutinePayload,
  RoutineQuickType,
  RoutineSelectionType,
} from "@/features/build-routine/type/routine-builder.types";
import { create } from "zustand";

const isQuickType = (routine: string | null): routine is RoutineQuickType =>
  routine !== null &&
  ["push", "pull", "legs", "upper", "lower", "fullbody"].includes(routine);

interface BuildRoutineStoreProps {
  goal: GoalType | null;
  equipment: EquipmentType | null;
  experience: ExperienceType | null;
  routine: RoutineSelectionType | null;
  // custom — a implementar
  musculos: RoutineCustomType[];
  diasEntrenamiento: number | null;
  setGoal: (goal: GoalType) => void;
  setEquipment: (equipment: EquipmentType) => void;
  setExperience: (experience: ExperienceType) => void;
  setRoutine: (routine: RoutineSelectionType) => void;
  // custom — a implementar
  setMusculos: (musculos: RoutineCustomType[]) => void;
  setDiasEntrenamiento: (dias: number) => void;
  getQuickPayload: () => RoutinePayload | null;
  getCustomPayload: () => RoutinePayload | null;
  reset: () => void;
}

const initialState = {
  goal: null,
  equipment: null,
  experience: null,
  routine: null,
  musculos: [],
  diasEntrenamiento: null,
};

export const useBuildRoutineStore = create<BuildRoutineStoreProps>(
  (set, get) => ({
    ...initialState,
    setGoal: (goal) => set({ goal }),
    setEquipment: (equipment) => set({ equipment }),
    setExperience: (experience) => set({ experience }),
    setRoutine: (routine) =>
      set((state) => ({
        routine: state.routine === routine ? null : routine,
      })),
    setMusculos: (musculos) => set({ musculos }),
    setDiasEntrenamiento: (dias) => set({ diasEntrenamiento: dias }),
    getQuickPayload: () => {
      const { goal, equipment, experience, routine } = get();
      if (!goal || !equipment || !experience || !routine) return null;
      if (!isQuickType(routine)) return null;
      return {
        modo: "quick",
        objetivo: goal,
        nivel: experience,
        equipamiento: equipment,
        rutina: routine,
      };
    },
    getCustomPayload: () => {
      const { goal, equipment, experience, musculos, diasEntrenamiento } =
        get();
      if (
        !goal ||
        !equipment ||
        !experience ||
        !musculos.length ||
        !diasEntrenamiento
      )
        return null;
      return {
        modo: "custom",
        objetivo: goal,
        nivel: experience,
        equipamiento: equipment,
        musculos,
        diasEntrenamiento,
      };
    },
    reset: () => set(initialState),
  }),
);
