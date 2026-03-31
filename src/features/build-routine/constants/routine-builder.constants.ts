import {
  EquipmentOption,
  ExperienceOption,
  GoalOption,
  RoutineCustomOption,
  RoutineQuickOption,
} from "../type/routine-builder.types";

export const GOAL_OPTION_DATA: GoalOption[] = [
  {
    type: "fuerza",
    title: "FUERZA",
    description: "Aumenta tu fuerza máxima y rendimiento",
  },
  {
    type: "hipertrofia",
    title: "HIPERTROFIA",
    description: "Desarrollo muscular y definición",
  },
  {
    type: "masa",
    title: "MASA MUSCULAR",
    description: "Gana volumen muscular significativo",
  },
];

export const EQUIPAMENTE_OPTION_DATA: EquipmentOption[] = [
  {
    type: "gym",
    title: "GYM",
    description: "Acceso a máquinas, pesas y equipamiento completo",
    icon: "barbell-outline",
  },
  {
    type: "home",
    title: "EN CASA",
    description: "Entrena con peso corporal o equipamiento básico",
    icon: "home-outline",
  },
];

export const EXPERIENCE_OPTION_DATA: ExperienceOption[] = [
  {
    type: "principiante",
    title: "PRINCIPIANTE",
    description: "0 a 1 año - Fundamentos básicos",
  },
  {
    type: "intermedio",
    title: "INTERMEDIO",
    description: "1 a 3 años - Desarrollo independiente",
  },
  {
    type: "avanzado",
    title: "AVANZADO",
    description: "3 años en adelante - Experto y líder técnico",
  },
];

export const MUSCLE_OPTION_DATA: RoutineCustomOption[] = [
  {
    type: "pecho",
    title: "PECHO",
    image: require("../../../../assets/muscle-group/chess.png"),
  },
  {
    type: "espalda",
    title: "ESPALDA",
    image: require("../../../../assets/muscle-group/back.png"),
  },
  {
    type: "biceps",
    title: "BÍCEPS",
    image: require("../../../../assets/muscle-group/biceps.png"),
  },
  {
    type: "triceps",
    title: "TRÍCEPS",
    image: require("../../../../assets/muscle-group/triceps.png"),
  },
  {
    type: "hombros",
    title: "HOMBROS",
    image: require("../../../../assets/muscle-group/hombros.png"),
  },
  {
    type: "piernas",
    title: "PIERNAS",
    image: require("../../../../assets/muscle-group/legs.png"),
  },
];

export const QUICK_OPTION_DATA: RoutineQuickOption[] = [
  {
    type: "push",
    label: "Push",
    subtitle: "Pecho · Hombros · Tríceps",
    muscles: ["pecho", "hombro", "triceps"],
    icon: "arrow-up-circle-outline",
  },
  {
    type: "pull",
    label: "Pull",
    subtitle: "Espalda · Bíceps",
    muscles: ["espalda", "biceps"],
    icon: "arrow-down-circle-outline",
  },
  {
    type: "legs",
    label: "Legs",
    subtitle: "Cuádriceps · Isquios · Glúteos",
    muscles: ["piernas"],
    icon: "flash-outline",
  },
  {
    type: "upper",
    label: "Upper Body",
    subtitle: "Push + Pull — todo el tren superior",
    muscles: ["pecho", "espalda", "hombro", "biceps", "triceps"],
    icon: "body-outline",
  },
  {
    type: "lower",
    label: "Lower Body",
    subtitle: "Piernas completo — quad, femoral, glúteo",
    muscles: ["piernas"],
    icon: "walk-outline",
  },
  {
    type: "fullbody",
    label: "Full Body",
    subtitle: "Todos los grupos — alta frecuencia, bajo volumen por músculo",
    muscles: ["pecho", "espalda", "hombro", "biceps", "triceps", "piernas"],
    icon: "infinite-outline",
  },
];

export const LEVEL_OPTION_DATA: Record<
  string,
  { icon: string; iconFamily: string; label: string; color: string }
> = {
  principiante: {
    icon: "star-o",
    iconFamily: "FontAwesome",
    label: "BEG",
    color: "#2ECFBE",
  },
  intermedio: {
    icon: "star-half-o",
    iconFamily: "FontAwesome",
    label: "MID",
    color: "#2ECFBE",
  },
  avanzado: {
    icon: "star",
    iconFamily: "FontAwesome",
    label: "ADV",
    color: "#2ECFBE",
  },
};

export const SLIDES_OPTION_DATA = [
  {
    id: "1",
    title: "Tu rutina perfecta\nen segundos",
    subtitle: "La IA crea un plan personalizado según tu nivel y objetivos.",
    images: [
      require("../../../../assets/onboarding/crear_rutina_claro.png"),
      require("../../../../assets/onboarding/crear_rutina.png"),
    ],
    imageTitles: ["Configurá tu plan", "Rutina generada"],
  },
  {
    id: "2",
    title: "Seguimiento real\nde tu progreso",
    subtitle: "Medí tu evolución y mantené la motivación cada semana.",
    images: [
      require("../../../../assets/onboarding/progresos_claro.png"),
      require("../../../../assets/onboarding/progresos.png"),
    ],
    imageTitles: ["Seguimiento inteligente", "Detalle del progreso"],
  },
  {
    id: "3",
    title: "Tu plan evoluciona\ncon vos",
    subtitle:
      "La IA ajusta tu entrenamiento automáticamente para que sigas creciendo.",
    images: [
      require("../../../../assets/onboarding/onbiardin_claro.png"),
      require("../../../../assets/onboarding/onbiardin.png"),
    ],
    imageTitles: ["Optimización automática", "Evolución constante"],
  },
];
