import { equipmentListData } from "@/features/onboarding/constants/onboarding.constants";
import { EquipmentItem } from "../type/onboarding.type";

export function getEquipmentList(
  equipment: string | null,
  muscleGroup: string | null,
): EquipmentItem[] {
  if (!equipment || !muscleGroup) return [];
  return equipmentListData[equipment]?.[muscleGroup] ?? [];
}
