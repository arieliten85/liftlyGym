// Ejercicio del plan original

export interface RoutineExercise {
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  weight?: number;
}

// Log de una serie

export interface SetLog {
  setNumber: number;
  repsCompleted: number | null;
  weight: number | null;
  skipped: boolean;
}

//  Progreso

export interface ExerciseProgress {
  exerciseIndex: number;
  completed: boolean;
  currentSet: number;
  totalSets: number;
  setLogs: SetLog[];

  // Refleja lo último editado en el modal , lo que muestra la card en tiempo real
  displayValues: {
    reps: string;
    weight: number;
    restSeconds: number;
    sets: number;
  };
}

// Sesión activa

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
