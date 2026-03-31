// quick.store.ts
import {
    EquipmentType,
    ExperienceType,
    GoalType,
    RoutinePayload,
    RoutineQuickType,
    RoutineSelectionType,
} from "@/features/build-routine/type/routine-builder.types";

export const isQuickType = (
  routine: string | null,
): routine is RoutineQuickType =>
  routine !== null &&
  ["push", "pull", "legs", "upper", "lower", "fullbody"].includes(routine);

interface QuickState {
  goal: GoalType | null;
  equipment: EquipmentType | null;
  experience: ExperienceType | null;
  routine: RoutineSelectionType | null;
}

export const getQuickPayload = (state: QuickState): RoutinePayload | null => {
  const { goal, equipment, experience, routine } = state;

  if (!goal || !equipment || !experience || !routine) return null;
  if (!isQuickType(routine)) return null;

  return {
    modo: "quick",
    objetivo: goal,
    nivel: experience,
    equipamiento: equipment,
    rutina: routine,
  };
};
