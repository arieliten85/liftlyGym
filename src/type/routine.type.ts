export interface RoutineExercise {
  name: string;
  reps: string;
  restSeconds: number;
  sets: number;
  weight?: number;
}

export interface ExerciseProgress {
   exerciseIndex: number;
   completed: boolean;
   currentSet: number;
   totalSets: number;
   editedReps: string;
   editedWeight: number;
   editedRestSeconds: number;
   editedSets: number;
}

export interface RoutineSession {
  exercises: ExerciseProgress[];
  startedAt: string;
  completedAt?: string;
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

export interface CompletedRoutinePayload {
  routineName: string;
  goal: string;
  experience: string;
  completedAt: string;
  duration: number;
  exercises: {
    name: string;
    originalSets: number;
    originalReps: string;
    originalRestSeconds: number;
    originalWeight: number;
    editedSets: number;
    editedReps: string;
    editedRestSeconds: number;
    editedWeight: number;
  }[];
}
