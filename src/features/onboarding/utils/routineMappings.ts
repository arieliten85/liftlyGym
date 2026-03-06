import { RoutineOption, RoutineType } from "../type/onboarding.type";

export const ROUTINE_OPTIONS: RoutineOption[] = [
  {
    id: "push",
    label: "Push",
    subtitle: "Pecho · Hombros · Tríceps",
    muscles: ["pecho", "hombro", "triceps"],
    icon: "arrow-up-circle-outline",
    colorAccent: "#3B82F6",
  },
  {
    id: "pull",
    label: "Pull",
    subtitle: "Espalda · Bíceps",
    muscles: ["espalda", "biceps"],
    icon: "arrow-down-circle-outline",
    colorAccent: "#8B5CF6",
  },
  {
    id: "legs",
    label: "Legs",
    subtitle: "Cuádriceps · Isquios · Glúteos",
    muscles: ["piernas"],
    icon: "flash-outline",
    colorAccent: "#F59E0B",
  },
  {
    id: "upper",
    label: "Upper Body",
    subtitle: "Push + Pull — todo el tren superior",
    muscles: ["pecho", "espalda", "hombro", "biceps", "triceps"],
    icon: "body-outline",
    colorAccent: "#2ECFBE",
  },
  {
    id: "lower",
    label: "Lower Body",
    subtitle: "Piernas completo — quad, femoral, glúteo",
    muscles: ["piernas"],
    icon: "walk-outline",
    colorAccent: "#F97316",
  },
  {
    id: "fullbody",
    label: "Full Body",
    subtitle: "Todos los grupos — alta frecuencia, bajo volumen por músculo",
    muscles: ["pecho", "espalda", "hombro", "biceps", "triceps", "piernas"],
    icon: "infinite-outline",
    colorAccent: "#10B981",
  },
];

//obtiene grupos musculares de una rutina
export function getMusclesByRoutine(routine: RoutineType): string[] {
  const routineData = ROUTINE_OPTIONS.find((r) => r.id === routine);
  return routineData ? [...routineData.muscles] : [];
}

// captura el nombre de una rutina
export function getRoutineLabel(routine: RoutineType): string {
  const routineData = ROUTINE_OPTIONS.find((r) => r.id === routine);
  return routineData?.label ?? routine;
}
