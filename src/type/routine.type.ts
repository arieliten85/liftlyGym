// ─── Ejercicio del plan original ─────────────────────────────────────────────

export interface RoutineExercise {
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  weight?: number;
}

// ─── Log de una serie — alineado al schema del backend ───────────────────────

export interface SetLog {
  setNumber: number; // 1-based
  repsCompleted: number | null; // null si skipped
  weight: number | null; // null si skipped
  skipped: boolean;
}

// ─── Progreso en memoria durante la sesión ────────────────────────────────────

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
}

// ─── Sesión activa ────────────────────────────────────────────────────────────

export interface RoutineSession {
  exercises: ExerciseProgress[];
  startedAt: string;
}

// ─── Rutina ───────────────────────────────────────────────────────────────────

export interface Routine {
  routineId?: string; // opcional hasta que el backend lo devuelva
  name: string;
  goal: string;
  experience: string;
  exercises: RoutineExercise[];
  createdAt: string;
  totalExercises: number;
  totalSets: number;
}

// ─── Payload final al backend ─────────────────────────────────────────────────
// Estructura exacta que espera el backend.

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
