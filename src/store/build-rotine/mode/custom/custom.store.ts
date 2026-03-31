import {
  CustomSubMode,
  WeekDayKey,
  WeekDayPlan,
} from "@/features/build-routine/type/routine-builder.types";
import { StoreApi } from "zustand";

export interface CustomStore {
  customSubMode: CustomSubMode | null;
  selectedDays: WeekDayKey[];
  weekPlan: WeekDayPlan[];
  setCustomSubMode: (mode: CustomSubMode) => void;
  setSelectedDays: (days: WeekDayKey[]) => void;
  setWeekPlan: (plan: WeekDayPlan[]) => void;
  resetCustom: () => void;
}

export const createCustomStore = (
  set: StoreApi<CustomStore>["setState"],
): CustomStore => ({
  customSubMode: null,
  selectedDays: [],
  weekPlan: [],

  setCustomSubMode: (mode) =>
    set((state) => ({
      customSubMode: state.customSubMode === mode ? null : mode,
    })),

  setSelectedDays: (days) => set({ selectedDays: days }),

  setWeekPlan: (plan) => set({ weekPlan: plan }),

  resetCustom: () =>
    set({ customSubMode: null, selectedDays: [], weekPlan: [] }),
});
