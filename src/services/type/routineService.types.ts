import { RoutineExercise } from "@/types/routine/exercise.type";
import { RoutineSession } from "@/types/routine/session.type";

type Mode = "quick" | "custom";

export interface Adjustment {
  exerciseName: string;
  originalValue: string;
  newValue: string;
  reason: string;
  timestamp: string;
}

export interface RoutineApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error?: string;
}

export interface RoutineDTO {
  id: string;
  name: string;
  goal: string;
  experience: string;
  mode: Mode;
  createdAt: string;
  exercises: RoutineExercise[];
}

export interface RoutineListResponse {
  success: boolean;
  data: RoutineDTO[];
}

export interface CompleteSessionResponse {
  success: boolean;
  data: {
    session: RoutineSession;
    adjustments: Adjustment[] | null;
  };
}
