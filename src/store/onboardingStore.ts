import { TrainingCategory } from "@/utils/trainingCategoryRules";
import { create } from "zustand";

export type RoutineSource = "AI" | "custom";

interface OnboardingState {
  goal: string | null;
  equipment: string | null;
  experience: string | null;
  muscleGroups: string[];

  routine: TrainingCategory | null;

  selectedEquipmentItems: string[];
  source: RoutineSource;

  setGoal: (goal: string) => void;
  setEquipment: (equipment: string) => void;
  setExperience: (experience: string) => void;
  setMuscleGroups: (muscles: string[]) => void;
  toggleMuscleGroup: (muscleId: string) => void;

  setRoutine: (catId: TrainingCategory) => void;

  setSelectedEquipmentItems: (items: string[]) => void;
  toggleEquipmentItem: (itemId: string) => void;

  setSource: (source: RoutineSource) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  goal: null,
  equipment: null,
  experience: null,
  muscleGroups: [],
  routine: null,
  selectedEquipmentItems: [],
  source: "AI",

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

  reset: () =>
    set({
      goal: null,
      equipment: null,
      experience: null,
      muscleGroups: [],
      routine: null,
      selectedEquipmentItems: [],
      source: "AI",
    }),
}));
