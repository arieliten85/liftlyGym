// features/build-routine/type/routine-builder.types.ts

import { Ionicons } from "@expo/vector-icons";
import { ImageSourcePropType } from "react-native";

// ─────────────────────────────────────────────────────────────────────────────
// Primitivos compartidos
// ─────────────────────────────────────────────────────────────────────────────
export type GoalType = "fuerza" | "hipertrofia" | "masa";
export type ExperienceType = "principiante" | "intermedio" | "avanzado";
export type EquipmentType = "gym" | "home";

// ─────────────────────────────────────────────────────────────────────────────
// Tipos de rutina
// ─────────────────────────────────────────────────────────────────────────────
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
  | "hombros"
  | "piernas"
  | "gluteos"
  | "core"
  | "pecho_triceps"
  | "espalda_biceps"
  | "pecho_hombros"
  | "hombros_triceps"
  | "espalda_hombros"
  | "biceps_triceps"
  | "piernas_hombros";

export type RoutineSelectionType = RoutineQuickType | RoutineCustomType;

// ─────────────────────────────────────────────────────────────────────────────
// Sub-modo custom
// ─────────────────────────────────────────────────────────────────────────────
export type CustomSubMode = "plan" | "single";

// ─────────────────────────────────────────────────────────────────────────────
// Plan semanal
// ─────────────────────────────────────────────────────────────────────────────
export type WeekDayKey = "lun" | "mar" | "mie" | "jue" | "vie" | "sab" | "dom";

/** Músculo o tipo de rutina quick asignado a un día */
export type DaySessionType = RoutineQuickType | RoutineCustomType;

/** Día del plan semanal con sus músculos asignados */
export interface WeekDayPlan {
  day: WeekDayKey;
  muscles: DaySessionType[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Ejercicios
// ─────────────────────────────────────────────────────────────────────────────
export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  image?: string;
  gif?: string;
  instructions?: string[];
  equipment?: EquipmentType;
}

export interface RoutineExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  muscle?: string;
  restSeconds: number;
  weight?: number;
}

export interface SetLog {
  setNumber: number;
  repsCompleted: number | null;
  weight: number | null;
  skipped: boolean;
  restSeconds: number;
}

export interface ExerciseProgress {
  exerciseIndex: number;
  completed: boolean;
  currentSet: number;
  totalSets: number;
  setLogs: SetLog[];
  displayValues: {
    reps: string;
    weight: number;
    restSeconds: number;
    sets: number;
  };
  editedReps?: string;
  editedWeight?: number;
  editedRestSeconds?: number;
  editedSets?: number;
}

/** Ejercicios agrupados por músculo — modo single */
export type SingleSessionExercises = Record<string, RoutineExercise[]>;

/** Plan de ejercicios de un día — modo plan */
export interface DayExercisePlan {
  day: WeekDayKey;
  exercises: RoutineExercise[];
}

interface BasePayload {
  objetivo: GoalType;
  nivel: ExperienceType;
  equipamiento: EquipmentType;
}

/** Modo rápido: rutina predefinida */
export interface QuickRoutinePayload extends BasePayload {
  modo: "quick";
  rutina: RoutineQuickType;
}

/** Modo custom — sesión única */
export interface CustomSinglePayload extends BasePayload {
  modo: "custom";
  customSubMode: "single";
  musculos: DaySessionType[];
  ejerciciosPorMusculo: SingleSessionExercises;
}

/** Modo custom — plan semanal */
export interface CustomPlanPayload extends BasePayload {
  modo: "custom";
  customSubMode: "plan";
  dias: WeekDayKey[];
  planSemanal: WeekDayPlan[];
  ejercicios: DayExercisePlan[];
}

export type RoutinePayload =
  | QuickRoutinePayload
  | CustomSinglePayload
  | CustomPlanPayload;

// ─────────────────────────────────────────────────────────────────────────────
// Interfaces de opciones (UI)
// ─────────────────────────────────────────────────────────────────────────────
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
