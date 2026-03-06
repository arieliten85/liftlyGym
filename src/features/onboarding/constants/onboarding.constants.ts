import {
  EquipmentListMap,
  EquipmentOption,
  Goal,
  GoalConfig,
  GoalId,
  LevelConfig,
  LevelId,
  LevelOption,
  MuscleOption,
} from "@/features/onboarding/type/onboarding.type";

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
    image: require("../../../../assets/muscle-group/chess.png"),
  },
  {
    id: "espalda",
    title: "ESPALDA",
    image: require("../../../../assets/muscle-group/back.png"),
  },
  {
    id: "biceps",
    title: "BÍCEPS",
    image: require("../../../../assets/muscle-group/biceps.png"),
  },
  {
    id: "triceps",
    title: "TRÍCEPS",
    image: require("../../../../assets/muscle-group/triceps.png"),
  },
  {
    id: "hombro",
    title: "HOMBRO",
    image: require("../../../../assets/muscle-group/hombros.png"),
  },
  {
    id: "piernas",
    title: "PIERNAS",
    image: require("../../../../assets/muscle-group/legs.png"),
  },
];

export const SLIDES = [
  {
    id: "1",
    title: "Tu rutina perfecta\nen segundos",
    subtitle: "La IA crea un plan personalizado según tu nivel y objetivos.",
    images: [
      require("../../../../assets//onboarding/crear_rutina_claro.png"),
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

export const GOAL_CONFIG: Record<GoalId, GoalConfig> = {
  fuerza: {
    label: "FUERZA",
    color: "#F97316",
    icon: "barbell-outline",
  },
  hipertrofia: {
    label: "HIPERTROFIA",
    color: "#A78BFA",
    icon: "trending-up-outline",
  },
  resistencia: {
    label: "RESISTENCIA",
    color: "#38BDF8",
    icon: "pulse-outline",
  },
  perdida_de_peso: {
    label: "PÉRDIDA DE PESO",
    color: "#4ADE80",
    icon: "flame-outline",
  },
  definicion: {
    label: "DEFINICIÓN",
    color: "#FB923C",
    icon: "body-outline",
  },
  movilidad: {
    label: "MOVILIDAD",
    color: "#2ECFBE",
    icon: "walk-outline",
  },
};

export const LEVEL_CONFIG: Record<LevelId, LevelConfig> = {
  principiante: {
    label: "PRINCIPIANTE",
    color: "#4ADE80",
    icon: "leaf-outline",
  },
  intermedio: {
    label: "INTERMEDIO",
    color: "#FACC15",
    icon: "flash-outline",
  },
  avanzado: {
    label: "AVANZADO",
    color: "#F97316",
    icon: "flame-outline",
  },
};

export const EQUIPMENT_CAP: Record<string, number> = {
  principiante: 4,
  intermedio: 6,
  avanzado: 8,
};

export const BIG_MUSCLES = new Set(["piernas", "espalda", "pecho"]);

export const equipmentListData: EquipmentListMap = {
  gym: {
    pecho: [
      {
        id: "pecho_press_banca",
        title: "Press de Banca",
        subtitle: "Barra, banco plano. Fundamental para pecho",
        icon: "barbell-outline",
      },
      {
        id: "pecho_press_inclinado_mancuernas",
        title: "Press Inclinado con Mancuernas",
        subtitle: "Banco 30°, mejor activación de pectoral superior",
        icon: "fitness-outline",
      },
      {
        id: "pecho_cruces_poleas",
        title: "Cruces en Poleas",
        subtitle: "Poleas altas, trabajo de contracción y definición",
        icon: "git-merge-outline",
      },
      {
        id: "pecho_fondos",
        title: "Fondos en Paralelas",
        subtitle: "Pecho y tríceps, inclinarse hacia adelante",
        icon: "remove-outline",
      },
    ],
    espalda: [
      {
        id: "espalda_dominadas",
        title: "Dominadas",
        subtitle: "Barra fija, agarre abierto, dorsal y bíceps",
        icon: "remove-outline",
      },
      {
        id: "espalda_remo_barra",
        title: "Remo con Barra",
        subtitle: "Inclinado, agarre prono, espalda completa",
        icon: "barbell-outline",
      },
      {
        id: "espalda_jalones_polea",
        title: "Jalones en Polea Alta",
        subtitle: "Máquina de poleas, agarre ancho, dorsales",
        icon: "arrow-down-outline",
      },
      {
        id: "espalda_peso_muerto",
        title: "Peso Muerto",
        subtitle: "Barra, espalda baja y erectores espinales",
        icon: "barbell-outline",
      },
    ],
    biceps: [
      {
        id: "biceps_curl_barra",
        title: "Curl con Barra Z",
        subtitle: "Barra Z, de pie, trabajo de masa",
        icon: "barbell-outline",
      },
      {
        id: "biceps_curl_mancuernas_alternado",
        title: "Curl Alternado con Mancuernas",
        subtitle: "Sentado o de pie, supinación, bíceps completo",
        icon: "fitness-outline",
      },
      {
        id: "biceps_curl_polea_baja",
        title: "Curl en Polea Baja",
        subtitle: "Cable, tensión constante en todo el recorrido",
        icon: "arrow-up-outline",
      },
      {
        id: "biceps_curl_scott",
        title: "Curl en Banco Scott",
        subtitle: "Máquina o banco, aislamiento total del bíceps",
        icon: "cellular-outline",
      },
    ],
    triceps: [
      {
        id: "triceps_press_frances",
        title: "Press Francés",
        subtitle: "Barra Z, acostado en banco, porción larga del tríceps",
        icon: "barbell-outline",
      },
      {
        id: "triceps_polea_cuerda",
        title: "Extensión en Polea con Cuerda",
        subtitle: "Polea alta, bajar hasta abrir cuerdas, todas las cabezas",
        icon: "arrow-down-outline",
      },
      {
        id: "triceps_fondos",
        title: "Fondos en Paralelas",
        subtitle: "Cuerpo erguido, tríceps al 100%",
        icon: "remove-outline",
      },
      {
        id: "triceps_patada_mancuerna",
        title: "Patada de Tríceps",
        subtitle: "Mancuerna, apoyo en banco, cabeza lateral",
        icon: "fitness-outline",
      },
    ],
    hombro: [
      {
        id: "hombro_press_militar",
        title: "Press Militar",
        subtitle: "Barra, de pie o sentado, deltoides anterior y medio",
        icon: "barbell-outline",
      },
      {
        id: "hombro_elevaciones_laterales",
        title: "Elevaciones Laterales",
        subtitle: "Mancuernas, deltoides medio, peso moderado",
        icon: "fitness-outline",
      },
      {
        id: "hombro_pajaros",
        title: "Pájaros",
        subtitle: "Inclinado, deltoides posterior, postura y salud articular",
        icon: "fitness-outline",
      },
      {
        id: "hombro_press_maquina",
        title: "Press en Máquina",
        subtitle: "Máquina de hombros, para terminar o principiantes",
        icon: "cellular-outline",
      },
    ],
    piernas: [
      {
        id: "piernas_sentadilla",
        title: "Sentadilla",
        subtitle: "Barra en rack, ejercicio rey de piernas",
        icon: "barbell-outline",
      },
      {
        id: "piernas_prensa",
        title: "Prensa de Piernas",
        subtitle: "Máquina 45°, cuádriceps y glúteos",
        icon: "cellular-outline",
      },
      {
        id: "piernas_peso_muerto_rumano",
        title: "Peso Muerto Rumano",
        subtitle: "Barra o mancuernas, femoral y glúteo",
        icon: "barbell-outline",
      },
      {
        id: "piernas_extension",
        title: "Extensión de Cuádriceps",
        subtitle: "Máquina extensora, cuádriceps aislado",
        icon: "git-merge-outline",
      },
    ],
  },

  home: {
    pecho: [
      {
        id: "home_pecho_flexiones",
        title: "Flexiones",
        subtitle: "Pecho, hombros y tríceps. Manos separadas, cuerpo recto",
        icon: "body-outline",
      },
      {
        id: "home_pecho_flexiones_inclinadas",
        title: "Flexiones Inclinadas",
        subtitle: "Manos en silla o sofá, incidencia en pecho inferior",
        icon: "square-outline",
      },
      {
        id: "home_pecho_press_mancuernas_suelo",
        title: "Press con Mancuernas en Suelo",
        subtitle: "Mancuernas, acortamiento del recorrido, seguro para hombros",
        icon: "fitness-outline",
      },
      {
        id: "home_pecho_bandas_cruces",
        title: "Cruces con Bandas",
        subtitle: "Bandas ancladas detrás, simular poleas",
        icon: "ellipse-outline",
      },
    ],
    espalda: [
      {
        id: "espalda_dominadas_barra",
        title: "Dominadas",
        subtitle: "Barra de puerta, agarre amplio o supino",
        icon: "remove-outline",
      },
      {
        id: "espalda_remo_mancuerna",
        title: "Remo Unilateral con Mancuerna",
        subtitle: "Mancuerna, apoyo rodilla en silla, dorsal y romboides",
        icon: "fitness-outline",
      },
      {
        id: "espalda_bandas_jalones",
        title: "Jalones con Bandas",
        subtitle: "Bandas ancladas arriba, simular polea alta",
        icon: "ellipse-outline",
      },
      {
        id: "espalda_peso_muerto_mancuernas",
        title: "Peso Muerto con Mancuernas",
        subtitle: "Mancuernas, espalda baja y erectores",
        icon: "fitness-outline",
      },
    ],
    biceps: [
      {
        id: "biceps_curl_mancuernas",
        title: "Curl con Mancuernas",
        subtitle: "Mancuernas, alternado o simultáneo, supinación",
        icon: "fitness-outline",
      },
      {
        id: "biceps_curl_martillo",
        title: "Curl Martillo",
        subtitle: "Mancuernas o bandas, braquiorradial y braquial",
        icon: "fitness-outline",
      },
      {
        id: "biceps_curl_bandas",
        title: "Curl con Bandas",
        subtitle: "Bandas pisadas o ancladas abajo, resistencia progresiva",
        icon: "ellipse-outline",
      },
      {
        id: "biceps_dominadas_supinas",
        title: "Dominadas Supinas",
        subtitle: "Barra de puerta, agarre cerrado, bíceps al máximo",
        icon: "remove-outline",
      },
    ],
    triceps: [
      {
        id: "triceps_fondos_silla",
        title: "Fondos en Silla",
        subtitle: "Silla firme, pies en suelo, tríceps al fallo",
        icon: "square-outline",
      },
      {
        id: "triceps_extension_mancuerna",
        title: "Extensión sobre Cabeza",
        subtitle: "Mancuerna o botella, dos manos, porción larga",
        icon: "fitness-outline",
      },
      {
        id: "triceps_patada_mancuerna",
        title: "Patada de Tríceps",
        subtitle: "Mancuerna, apoyo en silla, cabeza lateral",
        icon: "fitness-outline",
      },
      {
        id: "triceps_bandas_extension",
        title: "Extensión con Bandas",
        subtitle: "Banda anclada arriba, bajar como polea",
        icon: "ellipse-outline",
      },
    ],
    hombro: [
      {
        id: "hombro_press_mancuernas",
        title: "Press con Mancuernas",
        subtitle: "Mancuernas, de pie o sentado, deltoides completo",
        icon: "fitness-outline",
      },
      {
        id: "hombro_elevaciones_laterales",
        title: "Elevaciones Laterales",
        subtitle: "Mancuernas o botellas, deltoides medio, control",
        icon: "fitness-outline",
      },
      {
        id: "hombro_pajaros_bandas",
        title: "Pájaros con Bandas",
        subtitle: "Bandas ancladas, deltoides posterior y postura",
        icon: "ellipse-outline",
      },
      {
        id: "hombro_flexiones_pike",
        title: "Flexiones Pike",
        subtitle: "Posición de V invertida, hombros y deltoides anterior",
        icon: "body-outline",
      },
    ],
    piernas: [
      {
        id: "piernas_sentadillas",
        title: "Sentadillas",
        subtitle: "Peso corporal o con mochila cargada, base del entrenamiento",
        icon: "body-outline",
      },
      {
        id: "piernas_zancadas",
        title: "Zancadas",
        subtitle: "Alternas, con o sin mancuernas, pierna completa",
        icon: "body-outline",
      },
      {
        id: "piernas_peso_muerto_mancuernas",
        title: "Peso Muerto con Mancuernas",
        subtitle: "Mancuernas, femoral y glúteo, espalda recta",
        icon: "fitness-outline",
      },
      {
        id: "piernas_puente_gluteo",
        title: "Puente de Glúteos",
        subtitle: "Peso corporal o con peso en cadera, glúteo y femoral",
        icon: "body-outline",
      },
    ],
  },
};
