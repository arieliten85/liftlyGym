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

  reset: () => void;
}

const initialState = {
  mode: null as RoutineMode | null,
  goal: null as GoalType | null,
  equipment: null as EquipmentType | null,
  experience: null as ExperienceType | null,
  routine: null as RoutineSelectionType | null,
  musculos: [] as DaySessionType[], // ✅ Cambiado
  diasEntrenamiento: null as number | null,
};

function logPayload(
  tipo: "SESIÓN SUELTA" | "PLAN SEMANAL",
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

      const ejerciciosPorMusculo: SingleSessionExercises = {};
      exercisePlan.forEach((dayPlan) => {
        dayPlan.exercises.forEach((ex) => {
          const key = ex.muscle;
          if (!key) return; // ✅ Guard para evitar índice undefined
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
        musculos, // ✅ Sin cast, ya es DaySessionType[]
        ejerciciosPorMusculo,
      };

      logPayload("SESIÓN SUELTA", payload);
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
