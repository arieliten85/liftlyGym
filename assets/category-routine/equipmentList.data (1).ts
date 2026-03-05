export interface EquipmentItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

export type EquipmentListMap = Record<string, Record<string, EquipmentItem[]>>;

export const equipmentListData: EquipmentListMap = {
  gym: {
    pecho: [
      {
        id: "gym_pecho_press_banca",
        title: "Press de Banca",
        subtitle: "Barra, banco plano. Fundamental para pecho",
        icon: "barbell-outline",
      },
      {
        id: "gym_pecho_press_inclinado_mancuernas",
        title: "Press Inclinado con Mancuernas",
        subtitle: "Banco 30°, mejor activación de pectoral superior",
        icon: "fitness-outline",
      },
      {
        id: "gym_pecho_cruces_poleas",
        title: "Cruces en Poleas",
        subtitle: "Poleas altas, trabajo de contracción y definición",
        icon: "git-merge-outline",
      },
      {
        id: "gym_pecho_fondos",
        title: "Fondos en Paralelas",
        subtitle: "Pecho y tríceps, inclinarse hacia adelante",
        icon: "remove-outline",
      },
    ],
    espalda: [
      {
        id: "gym_espalda_dominadas",
        title: "Dominadas",
        subtitle: "Barra fija, agarre abierto, dorsal y bíceps",
        icon: "remove-outline",
      },
      {
        id: "gym_espalda_remo_barra",
        title: "Remo con Barra",
        subtitle: "Inclinado, agarre prono, espalda completa",
        icon: "barbell-outline",
      },
      {
        id: "gym_espalda_jalones_polea",
        title: "Jalones en Polea Alta",
        subtitle: "Máquina de poleas, agarre ancho, dorsales",
        icon: "arrow-down-outline",
      },
      {
        id: "gym_espalda_peso_muerto",
        title: "Peso Muerto",
        subtitle: "Barra, espalda baja y erectores espinales",
        icon: "barbell-outline",
      },
    ],
    biceps: [
      {
        id: "gym_biceps_curl_barra",
        title: "Curl con Barra Z",
        subtitle: "Barra Z, de pie, trabajo de masa",
        icon: "barbell-outline",
      },
      {
        id: "gym_biceps_curl_mancuernas_alternado",
        title: "Curl Alternado con Mancuernas",
        subtitle: "Sentado o de pie, supinación, bíceps completo",
        icon: "fitness-outline",
      },
      {
        id: "gym_biceps_curl_polea_baja",
        title: "Curl en Polea Baja",
        subtitle: "Cable, tensión constante en todo el recorrido",
        icon: "arrow-up-outline",
      },
      {
        id: "gym_biceps_curl_scott",
        title: "Curl en Banco Scott",
        subtitle: "Máquina o banco, aislamiento total del bíceps",
        icon: "cellular-outline",
      },
    ],
    triceps: [
      {
        id: "gym_triceps_press_frances",
        title: "Press Francés",
        subtitle: "Barra Z, acostado en banco, porción larga del tríceps",
        icon: "barbell-outline",
      },
      {
        id: "gym_triceps_polea_cuerda",
        title: "Extensión en Polea con Cuerda",
        subtitle: "Polea alta, bajar hasta abrir cuerdas, todas las cabezas",
        icon: "arrow-down-outline",
      },
      {
        id: "gym_triceps_fondos",
        title: "Fondos en Paralelas",
        subtitle: "Cuerpo erguido, tríceps al 100%",
        icon: "remove-outline",
      },
      {
        id: "gym_triceps_patada_mancuerna",
        title: "Patada de Tríceps",
        subtitle: "Mancuerna, apoyo en banco, cabeza lateral",
        icon: "fitness-outline",
      },
    ],
    hombro: [
      {
        id: "gym_hombro_press_militar",
        title: "Press Militar",
        subtitle: "Barra, de pie o sentado, deltoides anterior y medio",
        icon: "barbell-outline",
      },
      {
        id: "gym_hombro_elevaciones_laterales",
        title: "Elevaciones Laterales",
        subtitle: "Mancuernas, deltoides medio, peso moderado",
        icon: "fitness-outline",
      },
      {
        id: "gym_hombro_pajaros",
        title: "Pájaros",
        subtitle: "Inclinado, deltoides posterior, postura y salud articular",
        icon: "fitness-outline",
      },
      {
        id: "gym_hombro_press_maquina",
        title: "Press en Máquina",
        subtitle: "Máquina de hombros, para terminar o principiantes",
        icon: "cellular-outline",
      },
    ],
    piernas: [
      {
        id: "gym_piernas_sentadilla",
        title: "Sentadilla",
        subtitle: "Barra en rack, ejercicio rey de piernas",
        icon: "barbell-outline",
      },
      {
        id: "gym_piernas_prensa",
        title: "Prensa de Piernas",
        subtitle: "Máquina 45°, cuádriceps y glúteos",
        icon: "cellular-outline",
      },
      {
        id: "gym_piernas_peso_muerto_rumano",
        title: "Peso Muerto Rumano",
        subtitle: "Barra o mancuernas, femoral y glúteo",
        icon: "barbell-outline",
      },
      {
        id: "gym_piernas_extension",
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
        id: "home_espalda_dominadas_barra",
        title: "Dominadas",
        subtitle: "Barra de puerta, agarre amplio o supino",
        icon: "remove-outline",
      },
      {
        id: "home_espalda_remo_mancuerna",
        title: "Remo Unilateral con Mancuerna",
        subtitle: "Mancuerna, apoyo rodilla en silla, dorsal y romboides",
        icon: "fitness-outline",
      },
      {
        id: "home_espalda_bandas_jalones",
        title: "Jalones con Bandas",
        subtitle: "Bandas ancladas arriba, simular polea alta",
        icon: "ellipse-outline",
      },
      {
        id: "home_espalda_peso_muerto_mancuernas",
        title: "Peso Muerto con Mancuernas",
        subtitle: "Mancuernas, espalda baja y erectores",
        icon: "fitness-outline",
      },
    ],
    biceps: [
      {
        id: "home_biceps_curl_mancuernas",
        title: "Curl con Mancuernas",
        subtitle: "Mancuernas, alternado o simultáneo, supinación",
        icon: "fitness-outline",
      },
      {
        id: "home_biceps_curl_martillo",
        title: "Curl Martillo",
        subtitle: "Mancuernas o bandas, braquiorradial y braquial",
        icon: "fitness-outline",
      },
      {
        id: "home_biceps_curl_bandas",
        title: "Curl con Bandas",
        subtitle: "Bandas pisadas o ancladas abajo, resistencia progresiva",
        icon: "ellipse-outline",
      },
      {
        id: "home_biceps_dominadas_supinas",
        title: "Dominadas Supinas",
        subtitle: "Barra de puerta, agarre cerrado, bíceps al máximo",
        icon: "remove-outline",
      },
    ],
    triceps: [
      {
        id: "home_triceps_fondos_silla",
        title: "Fondos en Silla",
        subtitle: "Silla firme, pies en suelo, tríceps al fallo",
        icon: "square-outline",
      },
      {
        id: "home_triceps_extension_mancuerna",
        title: "Extensión sobre Cabeza",
        subtitle: "Mancuerna o botella, dos manos, porción larga",
        icon: "fitness-outline",
      },
      {
        id: "home_triceps_patada_mancuerna",
        title: "Patada de Tríceps",
        subtitle: "Mancuerna, apoyo en silla, cabeza lateral",
        icon: "fitness-outline",
      },
      {
        id: "home_triceps_bandas_extension",
        title: "Extensión con Bandas",
        subtitle: "Banda anclada arriba, bajar como polea",
        icon: "ellipse-outline",
      },
    ],
    hombro: [
      {
        id: "home_hombro_press_mancuernas",
        title: "Press con Mancuernas",
        subtitle: "Mancuernas, de pie o sentado, deltoides completo",
        icon: "fitness-outline",
      },
      {
        id: "home_hombro_elevaciones_laterales",
        title: "Elevaciones Laterales",
        subtitle: "Mancuernas o botellas, deltoides medio, control",
        icon: "fitness-outline",
      },
      {
        id: "home_hombro_pajaros_bandas",
        title: "Pájaros con Bandas",
        subtitle: "Bandas ancladas, deltoides posterior y postura",
        icon: "ellipse-outline",
      },
      {
        id: "home_hombro_flexiones_pike",
        title: "Flexiones Pike",
        subtitle: "Posición de V invertida, hombros y deltoides anterior",
        icon: "body-outline",
      },
    ],
    piernas: [
      {
        id: "home_piernas_sentadillas",
        title: "Sentadillas",
        subtitle: "Peso corporal o con mochila cargada, base del entrenamiento",
        icon: "body-outline",
      },
      {
        id: "home_piernas_zancadas",
        title: "Zancadas",
        subtitle: "Alternas, con o sin mancuernas, pierna completa",
        icon: "body-outline",
      },
      {
        id: "home_piernas_peso_muerto_mancuernas",
        title: "Peso Muerto con Mancuernas",
        subtitle: "Mancuernas, femoral y glúteo, espalda recta",
        icon: "fitness-outline",
      },
      {
        id: "home_piernas_puente_gluteo",
        title: "Puente de Glúteos",
        subtitle: "Peso corporal o con peso en cadera, glúteo y femoral",
        icon: "body-outline",
      },
    ],
  },
};

export function getEquipmentList(
  equipment: string | null,
  muscleGroup: string | null,
): EquipmentItem[] {
  if (!equipment || !muscleGroup) return [];
  return equipmentListData[equipment]?.[muscleGroup] ?? [];
}
