import { RoutineExercise } from "@/type/routine.type";

export interface RoutineApiResponse {
  routine: {
    exercises: RoutineExercise[];
  };
  success: boolean;
}
