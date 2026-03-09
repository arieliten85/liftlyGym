import {
  BIG_MUSCLES,
  EQUIPMENT_CAP,
} from "@/features/onboarding/constants/onboarding.constants";
import { getEquipmentList } from "./getEquipmentList";

function calcSlotsPerMuscle(
  muscleGroups: string[],
  experience: string | null,
): Record<string, number> {
  const cap = EQUIPMENT_CAP[experience ?? "principiante"] ?? 4;
  const base = Math.floor(cap / muscleGroups.length);

  const slots: Record<string, number> = Object.fromEntries(
    muscleGroups.map((m) => [m, base]),
  );

  let assigned = base * muscleGroups.length;

  // Primero asignar a músculos grandes
  for (const m of muscleGroups) {
    if (assigned >= cap) break;
    if (BIG_MUSCLES.has(m)) {
      slots[m]++;
      assigned++;
    }
  }

  // Luego distribuir el resto
  for (const m of muscleGroups) {
    if (assigned >= cap) break;
    slots[m]++;
    assigned++;
  }

  return slots;
}

export function getExercisesForMuscles(
  equipment: string | null,
  muscleGroups: string[],
  experience: string | null,
): string[] {
  if (!equipment) return [];

  const slots = calcSlotsPerMuscle(muscleGroups, experience);

  return muscleGroups.flatMap((m) =>
    getEquipmentList(equipment, m)
      .slice(0, slots[m])
      .map((i) => i.id),
  );
}
