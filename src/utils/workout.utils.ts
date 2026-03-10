export function calculateWorkoutTime(
  exercises: { sets: number; restSeconds: number }[],
): number {
  let total = 0;
  exercises.forEach((ex) => {
    total += ex.sets * 40;
    total += (ex.sets - 1) * ex.restSeconds;
  });
  total += (exercises.length - 1) * 90;
  return Math.round(total / 60);
}
