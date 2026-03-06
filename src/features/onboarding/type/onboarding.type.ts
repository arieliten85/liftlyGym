import { Ionicons } from "@expo/vector-icons";
import { ImageSourcePropType } from "react-native";

export type RoutineClassificationType =
  | "solo_pecho"
  | "solo_espalda"
  | "solo_biceps"
  | "solo_triceps"
  | "solo_hombro"
  | "solo_piernas"
  | "pecho_triceps"
  | "espalda_biceps"
  | "pecho_hombro"
  | "hombro_triceps"
  | "espalda_hombro"
  | "pecho_espalda"
  | "biceps_triceps"
  | "piernas_hombro"
  | "push_clasico"
  | "pull_clasico"
  | "torso_completo"
  | "push_pull"
  | "upper_lower"
  | "push_pull_legs"
  | "fullbody"
  | "piernas_plus"
  | "upper_sin_piernas"
  | "custom";

export type RoutineSelectionType =
  | "push"
  | "pull"
  | "legs"
  | "upper"
  | "lower"
  | "fullbody";

export type ExperienceLevel = "principiante" | "intermedio" | "avanzado";

export interface RoutineClassification {
  routineType: RoutineClassificationType;
  routineLabel: string;
  routineDescription: string;
  durationMin: number;
  durationMax: number;
  daysPerWeek: [number, number];
  daysLabel: string;
  muscleGroups: string[];
  splitTags: string[];
  tips: string[];
  daySplitSuggestion?: string;
  exercisesPerMuscle: number;
  setsRange: string;
  levelSummary: string;
}

export interface EquipmentItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

export type EquipmentListMap = Record<string, Record<string, EquipmentItem[]>>;

export interface RoutineOption {
  id: RoutineSelectionType;
  label: string;
  subtitle: string;
  muscles: string[];
  icon: string;
  colorAccent: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface EquipmentOption {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export interface LevelOption {
  id: string;
  title: string;
  description: string;
}

export interface MuscleOption {
  id: string;
  title: string;
  icon?: string;
  image?: ImageSourcePropType;
}

export type GoalId =
  | "fuerza"
  | "hipertrofia"
  | "resistencia"
  | "perdida_de_peso"
  | "definicion"
  | "movilidad";

export type LevelId = "principiante" | "intermedio" | "avanzado";

export interface GoalConfig {
  label: string;
  color: string;
  icon: string;
}

export interface LevelConfig {
  label: string;
  color: string;
  icon: string;
}

export interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  cardBg: string;
  borderColor: string;
  textColor: string;
  subColor: string;
  teal: string;
}

export interface SplitTagProps {
  tag: string;
  isDark: boolean;
  teal: string;
  accentBorder: string;
}
