import {
  EquipmentOption,
  Goal,
  LevelOption,
  MuscleOption,
} from "@/type/onboarding.type";

export const goals: Goal[] = [
  {
    id: "fuerza",
    title: "FUERZA",
    description: "Aumenta tu fuerza máxima y rendimiento",
  },
  {
    id: "hipertrofia",
    title: "HIPERTROFIA",
    description: "Desarrollo muscular y definición",
  },
  {
    id: "masa",
    title: "MASA MUSCULAR",
    description: "Gana volumen muscular significativo",
  },
];

export const equipmentOptions: EquipmentOption[] = [
  {
    id: "gym",
    title: "GYM",
    description: "Acceso a máquinas, pesas y equipamiento completo",
    icon: "barbell-outline",
  },
  {
    id: "home",
    title: "EN CASA",
    description: "Entrena con peso corporal o equipamiento básico",
    icon: "home-outline",
  },
];

export const levelOptions: LevelOption[] = [
  {
    id: "principiante",
    title: "PRINCIPIANTE",
    description: "0 a 1 año - Fundamentos básicos",
  },
  {
    id: "intermedio",
    title: "INTERMEDIO",
    description: "1 a 3 años - Desarrollo independiente",
  },
  {
    id: "avanzado",
    title: "AVANZADO",
    description: "3 años en adelante - Experto y líder técnico",
  },
];

export const muscleOptions: MuscleOption[] = [
  {
    id: "pecho",
    title: "PECHO",
    image: require("../../assets/muscle-group/chess.png"),
  },
  {
    id: "espalda",
    title: "ESPALDA",
    image: require("../../assets/muscle-group/back.png"),
  },
  {
    id: "biceps",
    title: "BÍCEPS",
    image: require("../../assets/muscle-group/biceps.png"),
  },
  {
    id: "triceps",
    title: "TRÍCEPS",
    image: require("../../assets/muscle-group/triceps.png"),
  },
  {
    id: "hombro",
    title: "HOMBRO",
    image: require("../../assets/muscle-group/hombros.png"),
  },
  {
    id: "piernas",
    title: "PIERNAS",
    image: require("../../assets/muscle-group/legs.png"),
  },
];

export const SLIDES = [
  {
    id: "1",
    title: "Tu rutina perfecta\nen segundos",
    subtitle: "La IA crea un plan personalizado según tu nivel y objetivos.",
    images: [
      require("../../assets//onboarding/crear_rutina_claro.png"),
      require("../../assets/onboarding/crear_rutina.png"),
    ],
    imageTitles: ["Configurá tu plan", "Rutina generada"],
  },
  {
    id: "2",
    title: "Seguimiento real\nde tu progreso",
    subtitle: "Medí tu evolución y mantené la motivación cada semana.",
    images: [
      require("../../assets/onboarding/progresos_claro.png"),
      require("../../assets/onboarding/progresos.png"),
    ],
    imageTitles: ["Seguimiento inteligente", "Detalle del progreso"],
  },
  {
    id: "3",
    title: "Tu plan evoluciona\ncon vos",
    subtitle:
      "La IA ajusta tu entrenamiento automáticamente para que sigas creciendo.",
    images: [
      require("../../assets/onboarding/onbiardin_claro.png"),
      require("../../assets/onboarding/onbiardin.png"),
    ],
    imageTitles: ["Optimización automática", "Evolución constante"],
  },
];

export const LEVEL_META: Record<
  string,
  { icon: string; iconFamily: string; label: string; color: string }
> = {
  principiante: {
    icon: "star-o", // ☆ estrella vacía
    iconFamily: "FontAwesome",
    label: "BEG",
    color: "#2ECFBE",
  },
  intermedio: {
    icon: "star-half-o", // ✩ media estrella
    iconFamily: "FontAwesome",
    label: "MID",
    color: "#2ECFBE",
  },
  avanzado: {
    icon: "star", // ★ estrella llena
    iconFamily: "FontAwesome",
    label: "ADV",
    color: "#2ECFBE",
  },
};
