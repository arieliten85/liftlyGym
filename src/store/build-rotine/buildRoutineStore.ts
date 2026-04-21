import {
  CustomPlanPayload,
  CustomSinglePayload,
  DaySessionType,
  EquipmentType,
  ExperienceType,
  GoalType,
  RoutinePayload,
  RoutineSelectionType,
  SingleSessionExercises,
} from "@/types/routine";
import { create } from "zustand";
import { createCustomStore, CustomStore } from "./mode/custom/custom.store";
import {
  createExercisesStore,
  ExercisesStore,
} from "./mode/custom/exercises.store";
import { getQuickPayload } from "./mode/quick/quick.store";

type RoutineMode = "quick" | "custom";

interface BuildRoutineStoreProps extends CustomStore, ExercisesStore {
  mode: RoutineMode | null;
  setMode: (mode: RoutineMode) => void;

  goal: GoalType | null;
  equipment: EquipmentType | null;
  experience: ExperienceType | null;
  setGoal: (goal: GoalType) => void;
  setEquipment: (equipment: EquipmentType) => void;
  setExperience: (experience: ExperienceType) => void;

  routine: RoutineSelectionType | null;
  setRoutine: (routine: RoutineSelectionType) => void;
  getQuickPayload: () => RoutinePayload | null;

  musculos: DaySessionType[];
  diasEntrenamiento: number | null;
  setMusculos: (musculos: DaySessionType[]) => void;
  setDiasEntrenamiento: (dias: number) => void;

  getCustomSinglePayload: () => CustomSinglePayload | null;
  getCustomPlanPayload: () => CustomPlanPayload | null;

  // ── NUEVO: método unificado para GeneratingRoutineScreen ──
  getPayload: () =>
    | RoutinePayload
    | CustomSinglePayload
    | CustomPlanPayload
    | null;

  reset: () => void;
}

const initialState = {
  mode: null as RoutineMode | null,
  goal: null as GoalType | null,
  equipment: null as EquipmentType | null,
  experience: null as ExperienceType | null,
  routine: null as RoutineSelectionType | null,
  musculos: [] as DaySessionType[],
  diasEntrenamiento: null as number | null,
};

function logPayload(
  tipo: "SESIÓN ÚNICA" | "PLAN SEMANAL",
  payload: CustomSinglePayload | CustomPlanPayload,
) {
  console.log(`Payload — ${tipo}`);
  console.log(JSON.stringify(payload, null, 2));
}

export const useBuildRoutineStore = create<BuildRoutineStoreProps>(
  (set, get) => ({
    ...initialState,
    ...createCustomStore(set as Parameters<typeof createCustomStore>[0]),
    ...createExercisesStore(
      set as Parameters<typeof createExercisesStore>[0],
      get as Parameters<typeof createExercisesStore>[1],
    ),

    setMode: (mode) => set({ mode }),

    setGoal: (goal) => set({ goal }),
    setEquipment: (equipment) => set({ equipment }),
    setExperience: (experience) => set({ experience }),

    setRoutine: (routine) =>
      set((state) => ({
        routine: state.routine === routine ? null : routine,
      })),
    getQuickPayload: () => getQuickPayload(get()),

    setMusculos: (musculos) => set({ musculos }),
    setDiasEntrenamiento: (dias) => set({ diasEntrenamiento: dias }),

    getCustomSinglePayload: (): CustomSinglePayload | null => {
      const { goal, equipment, experience, musculos, exercisePlan } = get();

      if (!goal || !equipment || !experience || musculos.length === 0) {
        return null;
      }

      const singleDayPlan = exercisePlan.find((dp) => dp.day === "single");
      const ejercicios = singleDayPlan?.exercises ?? [];

      if (ejercicios.length === 0) {
        console.warn("getCustomSinglePayload: no hay ejercicios en day=single");
        return null;
      }

      const ejerciciosPorMusculo: SingleSessionExercises = {};
      ejercicios.forEach((ex) => {
        const key = ex.muscle;
        if (!key) return;
        if (!ejerciciosPorMusculo[key]) {
          ejerciciosPorMusculo[key] = [];
        }
        ejerciciosPorMusculo[key].push(ex);
      });

      const payload: CustomSinglePayload = {
        modo: "custom",
        customSubMode: "single",
        objetivo: goal,
        nivel: experience,
        equipamiento: equipment,
        musculos,
        ejerciciosPorMusculo,
      };

      logPayload("SESIÓN ÚNICA", payload);
      return payload;
    },

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

    // ── NUEVO: delega al método correcto según mode y customSubMode ──
    getPayload: ():
      | RoutinePayload
      | CustomSinglePayload
      | CustomPlanPayload
      | null => {
      const { mode, customSubMode } = get();

      if (mode === "quick") {
        return get().getQuickPayload();
      }

      if (mode === "custom") {
        if (customSubMode === "single") return get().getCustomSinglePayload();
        if (customSubMode === "plan") return get().getCustomPlanPayload();
      }

      return null;
    },

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
