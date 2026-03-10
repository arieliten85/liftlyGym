import { RoutineSelectionType } from "@/features/onboarding/type/onboarding.type";
import { create } from "zustand";

export type RoutineSource = "AI" | "custom";

export type GoalType = "fuerza" | "hipertrofia" | "resistencia";

export type ExperienceType = "principiante" | "intermedio" | "avanzado";

interface OnboardingState {
  goal: GoalType | null;
  equipment: string | null;
  experience: ExperienceType | null;
  muscleGroups: string[];

  routine: RoutineSelectionType | null;

  selectedEquipmentItems: string[];
  source: RoutineSource;

  setGoal: (goal: GoalType) => void;
  setEquipment: (equipment: string) => void;
  setExperience: (experience: ExperienceType) => void;
  setMuscleGroups: (muscles: string[]) => void;
  toggleMuscleGroup: (muscleId: string) => void;

  setRoutine: (catId: RoutineSelectionType) => void;

  setSelectedEquipmentItems: (items: string[]) => void;
  toggleEquipmentItem: (itemId: string) => void;

  setSource: (source: RoutineSource) => void;
  reset: () => void;
}

const initialState = {
  goal: null,
  equipment: null,
  experience: null,
  muscleGroups: [],
  routine: null,
  selectedEquipmentItems: [],
  source: "AI" as RoutineSource,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,

  setGoal: (goal) => set({ goal }),

  setEquipment: (equipment) => set({ equipment }),

  setExperience: (experience) => set({ experience }),

  setMuscleGroups: (muscles) => set({ muscleGroups: muscles }),

  toggleMuscleGroup: (muscleId) =>
    set((state) => ({
      muscleGroups: state.muscleGroups.includes(muscleId)
        ? state.muscleGroups.filter((id) => id !== muscleId)
        : [...state.muscleGroups, muscleId],
    })),

  setRoutine: (catId) =>
    set((state) => ({
      routine: state.routine === catId ? null : catId,
    })),

  setSelectedEquipmentItems: (items) => set({ selectedEquipmentItems: items }),

  toggleEquipmentItem: (itemId) =>
    set((state) => ({
      selectedEquipmentItems: state.selectedEquipmentItems.includes(itemId)
        ? state.selectedEquipmentItems.filter((id) => id !== itemId)
        : [...state.selectedEquipmentItems, itemId],
    })),

  setSource: (source) => set({ source }),

  reset: () => set(initialState),
}));
