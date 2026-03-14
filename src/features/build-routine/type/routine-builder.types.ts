import { Ionicons } from "@expo/vector-icons";
import { ImageSourcePropType } from "react-native";

export type GoalType = "fuerza" | "hipertrofia" | "masa";
export type ExperienceType = "principiante" | "intermedio" | "avanzado";
export type EquipmentType = "gym" | "home";

export type RoutineQuickType =
  | "push"
  | "pull"
  | "legs"
  | "upper"
  | "lower"
  | "fullbody";

export type RoutineCustomType =
  | "pecho"
  | "espalda"
  | "biceps"
  | "triceps"
  | "hombro"
  | "piernas"
  | "pecho_triceps"
  | "espalda_biceps"
  | "pecho_hombro"
  | "hombro_triceps"
  | "espalda_hombro"
  | "biceps_triceps"
  | "piernas_hombro";

export type RoutineSelectionType = RoutineQuickType | RoutineCustomType;

export interface RoutinePayload {
  modo: "quick" | "custom";
  objetivo: GoalType;
  nivel: ExperienceType;
  equipamiento: EquipmentType;
  rutina?: RoutineQuickType;
  musculos?: RoutineCustomType[];
  diasEntrenamiento?: number;
}

export interface GoalOption {
  type: GoalType;
  title: string;
  description: string;
  icon?: string;
}

export interface EquipmentOption {
  type: EquipmentType;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export interface ExperienceOption {
  type: ExperienceType;
  title: string;
  description: string;
}

export interface RoutineQuickOption {
  type: RoutineQuickType;
  label: string;
  subtitle: string;
  muscles: string[];
  icon?: string;
  image?: ImageSourcePropType;
}

export interface RoutineCustomOption {
  type: RoutineCustomType;
  title: string;
  icon?: string;
  image?: ImageSourcePropType;
}

export type RoutineSelectionOption = RoutineQuickOption | RoutineCustomOption;
