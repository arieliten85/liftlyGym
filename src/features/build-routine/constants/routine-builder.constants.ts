import {
  EquipmentOption,
  ExperienceOption,
  GoalOption,
  RoutineCustomOption,
  RoutineQuickOption,
} from "@/types";

export const GOAL_OPTION_DATA: GoalOption[] = [
  {
    type: "strength",
    title: "FUERZA",
    description: "Aumenta tu fuerza máxima y rendimiento",
  },
  {
    type: "hypertrophy",
    title: "HIPERTROFIA",
    description: "Desarrollo muscular y definición",
  },
  {
    type: "mass",
    title: "MASA MUSCULAR",
    description: "Gana volumen muscular significativo",
  },
];

export const EQUIPAMENTE_OPTION_DATA: EquipmentOption[] = [
  {
    type: "gym",
    title: "GIMNASIO COMPLETO",
    description:
      "Máquinas, barras y mancuernas para un entrenamiento sin límites",
    image: require("../../../../assets/images/equipament/gym.png"),
  },

  {
    type: "basic",
    title: "EQUIPAMIENTO BÁSICO",
    description: "Bandas elásticas y peso corporal para una rutina completa",
    image: require("../../../../assets/images/equipament/basic.png"),
  },

  {
    type: "dumbbells",
    title: "MANCUERNAS EN CASA",
    description: "Entrená con mancuernas y cubrí todos los grupos musculares",
    image: require("../../../../assets/images/equipament/dumbbells.png"),
  },
  {
    type: "bodyweight",
    title: "SOLO PESO CORPORAL",
    description: "Entrená en cualquier lugar usando solo tu cuerpo",
    image: require("../../../../assets/images/equipament/bodyweight.png"),
  },
];

export const EXPERIENCE_OPTION_DATA: ExperienceOption[] = [
  {
    type: "beginner",
    title: "PRINCIPIANTE",
    description: "0 a 1 año - Fundamentos básicos",
  },
  {
    type: "intermediate",
    title: "INTERMEDIO",
    description: "1 a 3 años - Desarrollo independiente",
  },
  {
    type: "advanced",
    title: "AVANZADO",
    description: "3 años en adelante - Experto y líder técnico",
  },
];

export const MUSCLE_OPTION_DATA: RoutineCustomOption[] = [
  {
    type: "chest",
    title: "PECHO",
    image: require("../../../../assets/muscle-group/chess.png"),
  },
  {
    type: "back",
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
    type: "shoulders",
    title: "HOMBROS",
    image: require("../../../../assets/muscle-group/hombros.png"),
  },
  {
    type: "legs",
    title: "PIERNAS",
    image: require("../../../../assets/muscle-group/legs.png"),
  },
];

export const QUICK_OPTION_DATA: RoutineQuickOption[] = [
  {
    type: "push",
    label: "Push",
    subtitle: "Pecho · Hombros · Tríceps",
    muscles: ["chest", "shoulders", "triceps"],
    icon: "arrow-up-circle-outline",
  },
  {
    type: "pull",
    label: "Pull",
    subtitle: "Espalda · Bíceps",
    muscles: ["back", "biceps"],
    icon: "arrow-down-circle-outline",
  },
  {
    type: "legs",
    label: "Legs",
    subtitle: "Cuádriceps · Isquios · Glúteos",
    muscles: ["legs", "glutes"],
    icon: "flash-outline",
  },
  {
    type: "upper",
    label: "Upper Body",
    subtitle: "Push + Pull — todo el tren superior",
    muscles: ["chest", "back", "shoulders", "biceps", "triceps"],
    icon: "body-outline",
  },
  {
    type: "lower",
    label: "Lower Body",
    subtitle: "Piernas completo — quad, femoral, glúteo",
    muscles: ["legs", "glutes"],
    icon: "walk-outline",
  },
  {
    type: "fullbody",
    label: "Full Body",
    subtitle: "Todos los grupos — alta frecuencia, bajo volumen",
    muscles: [
      "chest",
      "back",
      "shoulders",
      "biceps",
      "triceps",
      "legs",
      "glutes",
      "core",
    ],
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
