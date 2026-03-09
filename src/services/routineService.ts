import axiosClient from "@/api/axiosClient";
import {
  RoutineApiResponse,
  RoutineExercise,
  RoutinePayload,
} from "@/type/routine.type";

export const generateRoutineOnboarding = async (
  payload: RoutinePayload,
): Promise<RoutineExercise[]> => {
  try {
    const response = await axiosClient.post<RoutineApiResponse>(
      "/routines/generate-onboarding",
      payload,
    );

    const exercises = response.data?.routine?.routine?.exercises ?? [];
    return exercises;
  } catch (error) {
    console.error("Error generating routine:", error);
    throw error;
  }
};
