import { ExerciseProgress } from "@/features/build-routine/type/routine-builder.types";

export interface RoutineExercise {
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  weight?: number;
}

export interface SetLog {
  setNumber: number;
  repsCompleted: number | null;
  weight: number | null;
  skipped: boolean;
}

export interface RoutineSession {
  exercises: ExerciseProgress[];
  startedAt: string;
}

export interface Routine {
  routineId?: string;
  name: string;
  goal: string;
  experience: string;
  exercises: RoutineExercise[];
  createdAt: string;
  totalExercises: number;
  totalSets: number;
}

export interface CompletedRoutinePayload {
  routineId?: string;
  startedAt: string;
  completedAt: string;
  wasAbandoned: boolean;

  feedback: {
    intensity: number | null;
    energy: number | null;
    painLevel: number | null;
    comment: string;
  };

  exercises: {
    name: string;
    setLogs: SetLog[];
  }[];
}
