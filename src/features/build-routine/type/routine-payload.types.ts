import {
    EquipmentType,
    ExperienceType,
    GoalType,
    RoutineSelectionType,
} from "./routine-builder.types";

export interface RoutinePayload {
  modo: "quick" | "custom";

  objetivo: GoalType;
  nivel: ExperienceType;
  equipamiento: EquipmentType;

  rutina?: RoutineSelectionType;

  musculos?: RoutineSelectionType[];
  ejercicios?: string[];
  volumenMax?: number;
}
