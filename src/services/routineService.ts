import axiosClient from "@/api/axiosClient";
import {
  CompletedRoutinePayload,
  Routine,
  RoutineExercise,
  RoutinePayload,
} from "@/types/routine";
import {
  CompleteSessionResponse,
  RoutineApiResponse,
  RoutineListResponse,
} from "./type/routineService.types";

function mapRoutine(data: RoutineApiResponse["data"]): Routine {
  return {
    routineId: data.id,
    name: data.name,
    goal: data.goal,
    experience: data.experience,
    mode: data.mode,
    exercises: data.exercises ?? [],
    createdAt: data.createdAt,
    totalExercises: (data.exercises ?? []).length,
    totalSets: (data.exercises ?? []).reduce(
      (acc: number, ex: RoutineExercise) => acc + ex.sets,
      0,
    ),
  };
}

export class RoutineService {
  async generateRoutineOnboarding(
    payload: RoutinePayload,
  ): Promise<Routine | Routine[]> {
    try {
      const response = await axiosClient.post<{
        success: boolean;
        data: RoutineApiResponse["data"] | RoutineApiResponse["data"][];
      }>("/routines/generate", payload);

      const raw = response.data.data;

      if (Array.isArray(raw)) {
        return raw.map(mapRoutine);
      }

      return mapRoutine(raw);
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
        mode: r.mode,
        exercises: r.exercises ?? [],
        createdAt: r.createdAt,
        totalExercises: (r.exercises ?? []).length,
        totalSets: (r.exercises ?? []).reduce(
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

  async applyAdjustments(
    routineId: string,
    notificationId: string,
  ): Promise<void> {
    try {
      await axiosClient.post(`/routines/${routineId}/apply-adjustments`, {
        notificationId,
      });
    } catch (error) {
      console.error("Error applying adjustments:", error);
      throw error;
    }
  }

  async replaceExercise(
    routineId: string,
    exerciseName: string,
    newName: string,
  ): Promise<RoutineExercise> {
    const response = await axiosClient.patch<{
      success: boolean;
      data: {
        replaced: string;
        with: string;
        exercise: RoutineExercise;
      };
    }>(`/routines/${routineId}/replace-exercise`, { exerciseName, newName });

    const exercise = response.data.data.exercise;
    if (!exercise) {
      throw new Error("El back no devolvió el ejercicio actualizado");
    }
    return exercise;
  }
}
