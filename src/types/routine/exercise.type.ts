export interface RoutineExercise {
  id: string;
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
  restSeconds: number;
}

export interface ExerciseProgress {
  exerciseIndex: number;
  completed: boolean;
  currentSet: number;
  totalSets: number;
  setLogs: SetLog[];
  displayValues: {
    reps: string;
    weight: number;
    restSeconds: number;
    sets: number;
  };
  editedReps?: string;
  editedWeight?: number;
  editedRestSeconds?: number;
  editedSets?: number;
}
