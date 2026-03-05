import { RoutineType } from "@/utils/routineClassifier";
import { Ionicons } from "@expo/vector-icons";
import { ImageSourcePropType } from "react-native";

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
// Agregar al interface RoutineClassification
export interface RoutineClassification {
  routineType: RoutineType;
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
  exercisesPerMuscle: number; // ejercicios recomendados por grupo muscular
  setsRange: string; // ej: "3 series de 10-12 reps"
  levelSummary: string; // resumen textual del nivel aplicado
}
