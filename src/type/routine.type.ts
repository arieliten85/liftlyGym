export type RoutinePayload = {
  source: "AI" | "custom";
  goal: string | null;
  experience: string | null;
  muscleGroups: string[];
  workoutExercises: string[];
  exerciseVolumeMax: number;
};

export interface RoutineExercise {
  name: string;
  reps: string;
  restSeconds: number;
  sets: number;
}

export interface Routine {
  name: string;
  goal: string;
  experience: string;
  exercises: RoutineExercise[];
  createdAt: string;
  totalExercises: number;
  totalSets: number;
}

export interface RoutineApiResponse {
  routine: {
    routine: {
      exercises: RoutineExercise[];
    };
  };
  success: boolean;
}
