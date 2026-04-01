import { ImageSourcePropType } from "react-native";

export type GoalType = "strength" | "hypertrophy" | "mass";
export type ExperienceType = "beginner" | "intermediate" | "advanced";
export type EquipmentType = "gym" | "dumbbells" | "basic" | "bodyweight";

export type RoutineQuickType =
  | "push"
  | "pull"
  | "legs"
  | "upper"
  | "lower"
  | "fullbody";

export type RoutineCustomType =
  | "chest"
  | "back"
  | "biceps"
  | "triceps"
  | "shoulders"
  | "legs"
  | "glutes"
  | "core"
  | "chest_triceps"
  | "back_biceps"
  | "chest_shoulders"
  | "shoulders_triceps"
  | "back_shoulders"
  | "biceps_triceps"
  | "legs_shoulders";

export type RoutineSelectionType = RoutineQuickType | RoutineCustomType;

// Sub-modo custom

export type CustomSubMode = "plan" | "single";

// Plan semanal

export type WeekDayKey = "lun" | "mar" | "mie" | "jue" | "vie" | "sab" | "dom";

/** Músculo o tipo de rutina quick asignado a un día */
export type DaySessionType = RoutineQuickType | RoutineCustomType;

/** Día del plan semanal con sus músculos asignados */
export interface WeekDayPlan {
  day: WeekDayKey;
  muscles: DaySessionType[];
}

// Ejercicios

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

export interface RoutineSession {
  exercises: ExerciseProgress[];
  startedAt: string;
}

export interface Routine {
  routineId?: string;
  name: string;
  goal: string;
  experience: string;
  mode: "quick" | "custom";
  exercises: RoutineExercise[];
  createdAt: string;
  totalExercises: number;
  totalSets: number;
  durationMinutes?: number;
  muscleGroups?: string[];
  coverColor?: string;
}

export interface CompletedRoutinePayload {
  routineId?: string;
  startedAt: string;
  completedAt: string;
  wasAbandoned: boolean;

  feedback: {
    intensity: number | null;
    energy: number | null;
    painLevel: number | null;
    comment: string;
  };

  exercises: {
    name: string;
    setLogs: SetLog[];
  }[];
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
  image: any;
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
