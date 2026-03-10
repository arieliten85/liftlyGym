// export type RoutinePayload = {
//   source: "AI" | "custom";
//   goal: string | null;
//   experience: string | null;
//   muscleGroups: string[];
//   workoutExercises: string[];
//   exerciseVolumeMax: number;
// };

// export interface RoutineExercise {
//   name: string;
//   reps: string;
//   restSeconds: number;
//   sets: number;
// }

// export interface Routine {
//   name: string;
//   goal: string;
//   experience: string;
//   exercises: RoutineExercise[];
//   createdAt: string;
//   totalExercises: number;
//   totalSets: number;
// }

// export interface RoutineApiResponse {
//   routine: {
//     routine: {
//       exercises: RoutineExercise[];
//     };
//   };
//   success: boolean;
// }
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

export interface RoutineApiResponse {
  routine: {
    routine: {
      exercises: RoutineExercise[];
    };
  };
  success: boolean;
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
