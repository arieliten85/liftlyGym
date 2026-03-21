import { ImageSourcePropType } from "react-native";

// Imágenes de rutina
export const ROUTINE_IMAGES: Record<string, ImageSourcePropType> = {
  fullbody: require("../../../../assets/category-routine/fullbody.png"),
  legs: require("../../../../assets/category-routine/leg.png"),
  lower: require("../../../../assets/category-routine/lower.png"),
  pull: require("../../../../assets/category-routine/pull.png"),
  push: require("../../../../assets/category-routine/push.png"),
  upper: require("../../../../assets/category-routine/upper.png"),
};

// Imágenes de ejercicios - TODOS usan temporalmente upper.png
export const EXECISE_IMAGES: Record<string, ImageSourcePropType> = {
  // PECHO
  press_banca: require("../../../../assets/category-routine/press-banca-pecho.png"),
  press_mancuernas: require("../../../../assets/category-routine/upper.png"),
  press_inclinado_mancuernas: require("../../../../assets/category-routine/upper.png"),
  aperturas_mancuernas: require("../../../../assets/category-routine/upper.png"),
  flexiones: require("../../../../assets/category-routine/upper.png"),
  flexiones_diamante: require("../../../../assets/category-routine/upper.png"),
  press_bandas: require("../../../../assets/category-routine/upper.png"),

  // ESPALDA
  dominadas: require("../../../../assets/category-routine/press-banca-pecho.png"),
  remo_barra: require("../../../../assets/category-routine/upper.png"),
  remo_mancuernas: require("../../../../assets/category-routine/upper.png"),
  jalon_al_pecho: require("../../../../assets/category-routine/upper.png"),
  remo_bandas: require("../../../../assets/category-routine/upper.png"),
  pullover_mancuerna: require("../../../../assets/category-routine/upper.png"),

  // HOMBROS
  press_militar: require("../../../../assets/category-routine/upper.png"),
  press_hombro_mancuernas: require("../../../../assets/category-routine/upper.png"),
  elevaciones_laterales: require("../../../../assets/category-routine/upper.png"),
  elevaciones_frontales: require("../../../../assets/category-routine/upper.png"),
  elevaciones_bandas: require("../../../../assets/category-routine/upper.png"),
  pike_pushups: require("../../../../assets/category-routine/upper.png"),

  // BICEPS
  curl_barra: require("../../../../assets/category-routine/upper.png"),
  curl_mancuernas: require("../../../../assets/category-routine/upper.png"),
  curl_martillo: require("../../../../assets/category-routine/upper.png"),
  curl_bandas: require("../../../../assets/category-routine/upper.png"),
  chinups: require("../../../../assets/category-routine/upper.png"),

  // TRICEPS
  fondos_triceps: require("../../../../assets/category-routine/upper.png"),
  extension_triceps_mancuerna: require("../../../../assets/category-routine/upper.png"),
  extension_triceps_polea: require("../../../../assets/category-routine/upper.png"),
  patada_triceps: require("../../../../assets/category-routine/upper.png"),
  extension_triceps_bandas: require("../../../../assets/category-routine/upper.png"),

  // PIERNAS
  sentadilla: require("../../../../assets/category-routine/upper.png"),
  sentadilla_goblet: require("../../../../assets/category-routine/upper.png"),
  prensa: require("../../../../assets/category-routine/upper.png"),
  peso_muerto_rumano: require("../../../../assets/category-routine/upper.png"),
  zancadas: require("../../../../assets/category-routine/upper.png"),
  sentadilla_bandas: require("../../../../assets/category-routine/upper.png"),
  extension_cuadriceps: require("../../../../assets/category-routine/upper.png"),
  curl_femoral: require("../../../../assets/category-routine/upper.png"),
  elevacion_talones: require("../../../../assets/category-routine/upper.png"),

  // GLUTEOS
  hip_thrust: require("../../../../assets/category-routine/upper.png"),
  puente_gluteos: require("../../../../assets/category-routine/upper.png"),
  patada_gluteo_bandas: require("../../../../assets/category-routine/upper.png"),
  patada_gluteo_polea: require("../../../../assets/category-routine/upper.png"),

  // CORE
  crunch_abdominal: require("../../../../assets/category-routine/upper.png"),
  plancha: require("../../../../assets/category-routine/upper.png"),
  elevaciones_piernas: require("../../../../assets/category-routine/upper.png"),
  rueda_abdominal: require("../../../../assets/category-routine/upper.png"),
  crunch_bandas: require("../../../../assets/category-routine/upper.png"),
};

// Imagen por defecto (opcional)
export const DEFAULT_EXERCISE_IMAGE = require("../../../../assets/category-routine/upper.png");
