import { Routine } from "@/types";

export function estimateDuration(exercises: Routine["exercises"]): number {
  const totalSets = exercises.reduce((acc, e) => acc + e.sets, 0);
  const avgRestMin =
    exercises.reduce((acc, e) => acc + e.restSeconds, 0) /
    exercises.length /
    60;
  return Math.round(totalSets * (1.5 + avgRestMin));
}
