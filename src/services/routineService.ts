import axiosClient from "@/api/axiosClient";
import { RoutinePayload } from "@/features/build-routine/type/routine-builder.types";
import { RoutineExercise } from "@/type/routine.type";
import { RoutineApiResponse } from "./type/routineService.types";

export class RoutineService {
  async generateRoutineOnboarding(
    payload: RoutinePayload,
  ): Promise<RoutineExercise[]> {
    try {
      const response = await axiosClient.post<RoutineApiResponse>(
        "/routines/generate",
        payload,
      );
      return response.data?.routine?.exercises ?? [];
    } catch (error) {
      console.error("Error generating routine:", error);
      throw error;
    }
  }
}
