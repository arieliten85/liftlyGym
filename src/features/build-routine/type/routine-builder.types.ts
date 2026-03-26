// features/build-routine/type/routine-builder.types.ts

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

// ── Custom sub-mode ───────────────────────────────────────────────────────────
export type CustomSubMode = "plan" | "single";

// ── Week plan ─────────────────────────────────────────────────────────────────
export type WeekDayKey = "lun" | "mar" | "mie" | "jue" | "vie" | "sab" | "dom";

/** Un músculo o tipo de rutina quick asignado a un día */
export type DaySessionType = RoutineQuickType | RoutineCustomType;

/** Un día del plan semanal con sus músculos asignados */
export interface WeekDayPlan {
  day: WeekDayKey;
  muscles: DaySessionType[]; // ej: ["pecho", "triceps"]
}

// ── EJERCICIOS (NUEVO) ────────────────────────────────────────────────────────
export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  image?: string;
  gif?: string;
  instructions?: string[];
  equipment?: EquipmentType;
}

export interface SelectedExercise extends Exercise {
  // Puedes extender si quieres permitir personalizar sets/reps más adelante
  customSets?: number;
  customReps?: number;
}

// Para sesión única: agrupa ejercicios por grupo muscular
export interface SingleSessionExercises {
  [muscle: string]: SelectedExercise[];
}

// Para plan semanal: ejercicios por día y por grupo muscular
export interface DayExercises {
  [muscle: string]: SelectedExercise[];
}

export interface WeekPlanExercises {
  [day: string]: DayExercises;
}

// ── Payload (ACTUALIZADO) ─────────────────────────────────────────────────────
export interface RoutinePayload {
  modo: "quick" | "custom";
  objetivo: GoalType;
  nivel: ExperienceType;
  equipamiento: EquipmentType;
  // quick
  rutina?: RoutineQuickType;
  // custom single
  customSubMode?: CustomSubMode;
  musculos?: DaySessionType[];
  ejerciciosPorMusculo?: SingleSessionExercises; // NUEVO
  // custom plan
  weekPlan?: (WeekDayPlan & { ejerciciosPorMusculo?: DayExercises })[]; // ACTUALIZADO
  diasEntrenamiento?: number;
}

// ── Option interfaces ─────────────────────────────────────────────────────────
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
