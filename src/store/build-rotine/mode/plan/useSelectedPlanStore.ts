import { WeeklyPlanGroup } from "@/features/build-routine/utils/groupRoutines";
import { create } from "zustand";

interface SelectedPlanStore {
  selectedPlan: WeeklyPlanGroup | null;
  setSelectedPlan: (plan: WeeklyPlanGroup) => void;
}

export const useSelectedPlanStore = create<SelectedPlanStore>((set) => ({
  selectedPlan: null,
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
}));
