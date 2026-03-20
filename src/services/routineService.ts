import axiosClient from "@/api/axiosClient";
import { RoutinePayload } from "@/features/build-routine/type/routine-builder.types";
import {
  CompletedRoutinePayload,
  Routine,
  RoutineExercise,
} from "@/types/routine";
import {
  CompleteSessionResponse,
  RoutineApiResponse,
  RoutineListResponse,
} from "./type/routineService.types";

export class RoutineService {
  async generateRoutineOnboarding(payload: RoutinePayload): Promise<Routine> {
    try {
      const response = await axiosClient.post<RoutineApiResponse>(
        "/routines/generate",
        payload,
      );
      const data = response.data.data;
      return {
        routineId: data.id,
        name: data.name,
        goal: data.goal,
        experience: data.experience,
        exercises: data.exercises,
        createdAt: data.createdAt,
        totalExercises: data.exercises.length,
        totalSets: data.exercises.reduce(
          (acc: number, ex: RoutineExercise) => acc + ex.sets,
          0,
        ),
      };
    } catch (error) {
      console.error("Error generating routine:", error);
      throw error;
    }
  }

  async getUserRoutines(): Promise<Routine[]> {
    try {
      const response = await axiosClient.get<RoutineListResponse>("/routines");
      const data = response.data.data;
      return data.map((r) => ({
        routineId: r.id,
        name: r.name,
        goal: r.goal,
        experience: r.experience,
        exercises: r.exercises,
        createdAt: r.createdAt,
        totalExercises: r.exercises.length,
        totalSets: r.exercises.reduce(
          (acc: number, ex: RoutineExercise) => acc + ex.sets,
          0,
        ),
      }));
    } catch (error) {
      console.error("Error fetching routines:", error);
      throw error;
    }
  }

  async deleteRoutineById(routineId: string): Promise<void> {
    try {
      await axiosClient.delete(`/routines/${routineId}`);
    } catch (error) {
      console.error("Error deleting routine:", error);
      throw error;
    }
  }

  //  envía la sesión completada al backend

  async completeSession(payload: CompletedRoutinePayload): Promise<void> {
    try {
      await axiosClient.post<CompleteSessionResponse>(
        "/routines/complete",
        payload,
      );
    } catch (error) {
      console.error("Error completing session:", error);
      throw error;
    }
  }
}
