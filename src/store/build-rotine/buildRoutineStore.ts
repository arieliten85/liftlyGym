import {
  CustomPlanPayload,
  CustomSinglePayload,
  DaySessionType,
  EquipmentType,
  ExperienceType,
  GoalType,
  RoutineCustomType,
  RoutinePayload,
  RoutineSelectionType,
  SingleSessionExercises,
} from "@/features/build-routine/type/routine-builder.types";
import { create } from "zustand";
import { createCustomStore, CustomStore } from "./mode/custom/custom.store";
import {
  createExercisesStore,
  ExercisesStore,
} from "./mode/custom/exercises.store";
import { getQuickPayload } from "./mode/quick/quick.store";

// Tipo del store completo

type RoutineMode = "quick" | "custom";

interface BuildRoutineStoreProps extends CustomStore, ExercisesStore {
  // MODE
  mode: RoutineMode | null;
  setMode: (mode: RoutineMode) => void;

  // SHARED
  goal: GoalType | null;
  equipment: EquipmentType | null;
  experience: ExperienceType | null;
  setGoal: (goal: GoalType) => void;
  setEquipment: (equipment: EquipmentType) => void;
  setExperience: (experience: ExperienceType) => void;

  // QUICK
  routine: RoutineSelectionType | null;
  setRoutine: (routine: RoutineSelectionType) => void;
  getQuickPayload: () => RoutinePayload | null;

  // CUSTOM — datos
  musculos: RoutineCustomType[];
  diasEntrenamiento: number | null;
  setMusculos: (musculos: RoutineCustomType[]) => void;
  setDiasEntrenamiento: (dias: number) => void;

  // CUSTOM — payloads separados por sub-modo
  getCustomSinglePayload: () => CustomSinglePayload | null;
  getCustomPlanPayload: () => CustomPlanPayload | null;

  // RESET
  reset: () => void;
}

// Estado inicial

const initialState = {
  mode: null as RoutineMode | null,
  goal: null as GoalType | null,
  equipment: null as EquipmentType | null,
  experience: null as ExperienceType | null,
  routine: null as RoutineSelectionType | null,
  musculos: [] as RoutineCustomType[],
  diasEntrenamiento: null as number | null,
};

function logPayload(
  tipo: "SESIÓN SUELTA" | "PLAN SEMANAL",
  payload: CustomSinglePayload | CustomPlanPayload,
) {
  console.log(`Payload — ${tipo}`);
  console.log(JSON.stringify(payload, null, 2));
}

// Store
export const useBuildRoutineStore = create<BuildRoutineStoreProps>(
  (set, get) => ({
    ...initialState,
    ...createCustomStore(set as Parameters<typeof createCustomStore>[0]),
    ...createExercisesStore(
      set as Parameters<typeof createExercisesStore>[0],
      get as Parameters<typeof createExercisesStore>[1],
    ),

    // MODE
    setMode: (mode) => set({ mode }),

    // ── SHARED
    setGoal: (goal) => set({ goal }),
    setEquipment: (equipment) => set({ equipment }),
    setExperience: (experience) => set({ experience }),

    // ── QUICK
    setRoutine: (routine) =>
      set((state) => ({
        routine: state.routine === routine ? null : routine,
      })),
    getQuickPayload: () => getQuickPayload(get()),

    // ── CUSTOM — datos
    setMusculos: (musculos) => set({ musculos }),
    setDiasEntrenamiento: (dias) => set({ diasEntrenamiento: dias }),

    // ── CUSTOM — sesión única
    getCustomSinglePayload: (): CustomSinglePayload | null => {
      const { goal, equipment, experience, musculos, exercisePlan } = get();

      if (!goal || !equipment || !experience || musculos.length === 0) {
        return null;
      }

      const ejerciciosPorMusculo: SingleSessionExercises = {};
      exercisePlan.forEach((dayPlan) => {
        dayPlan.exercises.forEach((ex) => {
          const key = ex.muscle;
          if (!ejerciciosPorMusculo[key]) {
            ejerciciosPorMusculo[key] = [];
          }
          ejerciciosPorMusculo[key].push(ex);
        });
      });

      const payload: CustomSinglePayload = {
        modo: "custom",
        customSubMode: "single",
        objetivo: goal,
        nivel: experience,
        equipamiento: equipment,
        musculos: musculos as DaySessionType[],
        ejerciciosPorMusculo,
      };

      logPayload("SESIÓN SUELTA", payload);
      return payload;
    },

    // ── CUSTOM — plan semanal
    getCustomPlanPayload: (): CustomPlanPayload | null => {
      const {
        goal,
        equipment,
        experience,
        weekPlan,
        selectedDays,
        exercisePlan,
      } = get();

      if (
        !goal ||
        !equipment ||
        !experience ||
        selectedDays.length === 0 ||
        weekPlan.length === 0
      ) {
        return null;
      }

      const payload: CustomPlanPayload = {
        modo: "custom",
        customSubMode: "plan",
        objetivo: goal,
        nivel: experience,
        equipamiento: equipment,
        dias: selectedDays,
        planSemanal: weekPlan,
        ejercicios: exercisePlan,
      };

      logPayload("PLAN SEMANAL", payload);
      return payload;
    },

    // ── RESET
    reset: () =>
      set({
        ...initialState,
        customSubMode: null,
        selectedDays: [],
        weekPlan: [],
        exercisePlan: [],
      }),
  }),
);
