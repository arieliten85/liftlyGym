import axiosClient from "@/api/axiosClient";
import { Exercise } from "@/types/routine";

export interface ExerciseOption {
  name: string;
  muscle: string;
  equipment: string[];
}

export class ExerciseService {
  async getByMuscle(muscle: string): Promise<ExerciseOption[]> {
    const res = await axiosClient.get<{
      success: boolean;
      data: ExerciseOption[];
    }>(`/exercises?muscle=${muscle}`);
    return res.data.data;
  }

  async getExercisesByMuscle(muscle: string): Promise<Exercise[]> {
    const res = await axiosClient.get<{
      success: boolean;
      data: ExerciseOption[];
    }>(`/exercises?muscle=${muscle}`);

    const formatted: Exercise[] = res.data.data.map((ex) => ({
      id: ex.name,
      name: this.formatExerciseName(ex.name),
      muscle: ex.muscle,
    }));

    return formatted.sort((a, b) => a.name.localeCompare(b.name));
  }

  private formatExerciseName(name: string): string {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
