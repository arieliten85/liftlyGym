import { RoutineExercise } from "@/type/routine.type";

export interface RoutineApiResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    goal: string;
    experience: string;
    createdAt: string;
    exercises: RoutineExercise[];
  };
}
export interface RoutineDTO {
  id: string;
  name: string;
  goal: string;
  experience: string;
  createdAt: string;
  exercises: RoutineExercise[];
}

export interface RoutineListResponse {
  success: boolean;
  data: RoutineDTO[];
}

export interface CompleteSessionResponse {
  success: boolean;
  data: {
    session: any;
    adjustments: any[] | null;
  };
}
