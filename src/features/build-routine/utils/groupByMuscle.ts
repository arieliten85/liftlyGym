import { Exercise } from "@/types/routine";

export function groupByMuscle(exercises: Exercise[]) {
  return exercises.reduce(
    (acc, ex) => {
      if (!acc[ex.muscle]) acc[ex.muscle] = [];
      acc[ex.muscle].push(ex);
      return acc;
    },
    {} as Record<string, Exercise[]>,
  );
}
