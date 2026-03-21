import { ExerciseProgress, RoutineExercise, SetLog } from "./exercise.type";

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
  durationMinutes?: number;
  muscleGroups?: string[];
  coverColor?: string;
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
