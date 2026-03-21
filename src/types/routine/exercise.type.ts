// Exercise-related types
export interface RoutineExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  weight?: number;
}

export interface SetLog {
  setNumber: number; // 1-based
  repsCompleted: number | null; // null si skipped
  weight: number | null; // null si skipped
  skipped: boolean;
}

export interface ExerciseProgress {
  exerciseIndex: number;
  completed: boolean;
  currentSet: number;
  totalSets: number;
  setLogs: SetLog[];

  // Refleja lo último editado en el modal → lo que muestra la card en tiempo real
  displayValues: {
    reps: string;
    weight: number;
    restSeconds: number;
    sets: number;
  };

  // Editable fields from modal
  editedReps?: string;
  editedWeight?: number;
  editedRestSeconds?: number;
  editedSets?: number;
}
