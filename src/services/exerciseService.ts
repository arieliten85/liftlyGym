import axiosClient from "@/api/axiosClient";

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
}
