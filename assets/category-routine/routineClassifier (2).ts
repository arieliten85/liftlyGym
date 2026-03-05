// src/utils/routineClassifier.ts

export type RoutineType =
  | "solo_pecho"
  | "solo_espalda"
  | "solo_biceps"
  | "solo_triceps"
  | "solo_hombro"
  | "solo_piernas"
  | "pecho_triceps"
  | "espalda_biceps"
  | "pecho_hombro"
  | "hombro_triceps"
  | "espalda_hombro"
  | "pecho_espalda"
  | "biceps_triceps"
  | "piernas_hombro"
  | "push_clasico"
  | "pull_clasico"
  | "torso_completo"
  | "push_pull"
  | "upper_lower"
  | "push_pull_legs"
  | "fullbody"
  | "piernas_plus"
  | "upper_sin_piernas"
  | "custom";

export type ExperienceLevel = "principiante" | "intermedio" | "avanzado";

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
  exercisesPerMuscle: number;
  setsRange: string;
  levelSummary: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const has = (m: string[], id: string) => m.includes(id);
const hasAll = (m: string[], ...ids: string[]) =>
  ids.every((id) => m.includes(id));
const hasAny = (m: string[], ...ids: string[]) =>
  ids.some((id) => m.includes(id));

const PUSH = ["pecho", "hombro", "triceps"] as const;
const PULL = ["espalda", "biceps"] as const;
const UPPER = [...PUSH, ...PULL] as const;

const hasPush = (m: string[]) => hasAny(m, ...PUSH);
const hasPull = (m: string[]) => hasAny(m, ...PULL);
const hasLegs = (m: string[]) => has(m, "piernas");
const hasUpper = (m: string[]) => hasAny(m, ...UPPER);

const pushMuscles = (m: string[]) =>
  m.filter((x) => (PUSH as readonly string[]).includes(x));
const pullMuscles = (m: string[]) =>
  m.filter((x) => (PULL as readonly string[]).includes(x));

// ─── Duración ajustada por nivel ─────────────────────────────────────────────

function dur(base: [number, number], lvl: ExperienceLevel): [number, number] {
  const d = lvl === "principiante" ? -10 : lvl === "avanzado" ? +10 : 0;
  return [base[0] + d, base[1] + d];
}

function daysRange(
  base: [number, number],
  lvl: ExperienceLevel,
  advancedBoost = 1,
): [number, number] {
  if (lvl === "avanzado")
    return [base[0], Math.min(base[1] + advancedBoost, 6)];
  if (lvl === "principiante") return [base[0], base[1]];
  return base;
}

// ─── Campos de nivel — centralizados ─────────────────────────────────────────

function levelFields(lvl: ExperienceLevel): {
  exercisesPerMuscle: number;
  setsRange: string;
  levelSummary: string;
} {
  switch (lvl) {
    case "principiante":
      return {
        exercisesPerMuscle: 3,
        setsRange: "3 series · 12-15 reps",
        levelSummary:
          "Como principiante, el foco es aprender la técnica. 3 ejercicios por grupo es suficiente — más volumen no mejora los resultados aún.",
      };
    case "intermedio":
      return {
        exercisesPerMuscle: 4,
        setsRange: "3-4 series · 8-12 reps",
        levelSummary:
          "En nivel intermedio ya podés manejar más volumen. 4 ejercicios por grupo con progresión de carga semana a semana.",
      };
    case "avanzado":
      return {
        exercisesPerMuscle: 5,
        setsRange: "4-5 series · 6-12 reps",
        levelSummary:
          "Nivel avanzado: 5 ejercicios por grupo con técnicas de intensidad (drop sets, rest-pause, superseries).",
      };
  }
}

// ─── Builder ──────────────────────────────────────────────────────────────────

function build(
  type: RoutineType,
  label: string,
  description: string,
  baseDur: [number, number],
  baseDays: [number, number],
  tags: string[],
  tips: string[],
  lvl: ExperienceLevel,
  muscleGroups: string[],
  daySplitSuggestion?: string,
): RoutineClassification {
  const [dMin, dMax] = dur(baseDur, lvl);
  const [dayMin, dayMax] = baseDays;
  const { exercisesPerMuscle, setsRange, levelSummary } = levelFields(lvl);

  return {
    routineType: type,
    routineLabel: label,
    routineDescription: description,
    durationMin: dMin,
    durationMax: dMax,
    daysPerWeek: [dayMin, dayMax],
    daysLabel: `${dayMin} a ${dayMax} días por semana`,
    muscleGroups,
    splitTags: tags,
    tips,
    daySplitSuggestion,
    exercisesPerMuscle,
    setsRange,
    levelSummary,
  };
}

// ─── Clasificador principal ───────────────────────────────────────────────────

export function classifyRoutine(
  muscleGroups: string[],
  experience: ExperienceLevel,
): RoutineClassification {
  const m = muscleGroups;
  const n = m.length;
  const lvl = experience;

  // ══════════════════════════════════════════════════════════════════════════
  // N = 1
  // ══════════════════════════════════════════════════════════════════════════

  if (n === 1) {
    switch (m[0]) {
      case "pecho":
        return build(
          "solo_pecho",
          "Chest Day",
          "Sesión especializada en pectoral. Podés cubrir todos los ángulos (plano, inclinado, declinado) y técnicas de intensidad sin restricción de tiempo.",
          [40, 55],
          [2, 3],
          ["Pecho"],
          [
            "Cubrí los 3 ángulos: plano (volumen), inclinado (porción clavicular), declinado (porción esternal inferior).",
            "Press compuesto primero (barra o mancuernas), aperturas y cables al final.",
            lvl === "principiante"
              ? "3 ejercicios, 3 series cada uno es suficiente para empezar."
              : "Podés aplicar drop sets o rest-pause en el último ejercicio para mayor intensidad.",
            "El pecho sin trabajo de espalda genera desequilibrio postural — asegurate de tener días de espalda en tu semana.",
          ],
          lvl,
          m,
          "Complemento recomendado: Espalda+Bíceps otro día de la semana.",
        );

      case "espalda":
        return build(
          "solo_espalda",
          "Back Day",
          "La espalda es el grupo muscular más complejo del tren superior. Una sesión dedicada permite cubrir todos los planos de movimiento con calidad.",
          [45, 60],
          [2, 3],
          ["Espalda"],
          [
            "Combiná movimientos verticales (dominadas/jalón) con horizontales (remo) para desarrollo completo.",
            "Anchos de agarre variados: supino activa más bíceps, prono aísla la espalda.",
            "Enfocate en la retracción escapular — la mayoría no la trabaja conscientemente.",
            lvl === "principiante"
              ? "Jalón en polea + remo en polea + remo con mancuerna unilateral. Simple y efectivo."
              : "Dominadas con peso + remo con barra + face pull para romboides y trapecio medio.",
          ],
          lvl,
          m,
          "Complemento: agregar bíceps al final si tenés tiempo — ya están calentados por los jalones.",
        );

      case "biceps":
        return build(
          "solo_biceps",
          "Biceps Day",
          "Sesión de aislamiento de bíceps. Alta especialización en el flexor del codo — todas las variantes de curl para maximizar desarrollo.",
          [30, 45],
          [2, 3],
          ["Bíceps"],
          [
            "El bíceps tiene dos cabezas: larga (pico, agarre estrecho) y corta (grosor, agarre ancho). Trabajá ambas.",
            "Curl con barra → curl martillo → curl inclinado (mayor estiramiento) → curl concentrado.",
            "El bíceps se recupera rápido — podés entrenarlo con alta frecuencia (2-3 veces/semana).",
            lvl === "principiante"
              ? "Curl con barra EZ + curl martillo con mancuernas. 3 series de 10-12 cada uno."
              : "Incluí curl en banco Scott para aislar la cabeza larga y curl en polea baja para tensión continua.",
            "Aunque es válido como sesión sola, el bíceps trabaja más en una sesión de espalda — considerar combinar.",
          ],
          lvl,
          m,
        );

      case "triceps":
        return build(
          "solo_triceps",
          "Triceps Day",
          "Sesión de aislamiento de tríceps. El tríceps representa el 60-65% del volumen del brazo — merece atención específica.",
          [30, 45],
          [2, 3],
          ["Tríceps"],
          [
            "El tríceps tiene 3 cabezas. La cabeza larga (la más grande) SOLO se activa completamente con el brazo elevado.",
            "Extensión sobre cabeza (francesa/press francés) → polea alta con cuerda → press cerrado.",
            "Sin trabajo de extensión overhead nunca vas a desarrollar el volumen real del tríceps.",
            lvl === "principiante"
              ? "Press cerrado en banca + polea con cuerda. Simple pero completo."
              : "Press francés con barra EZ (cabeza larga) + polea alta (cabeza lateral) + dips (volumen total).",
            "El tríceps trabaja en todos los press de pecho y hombro — tomá eso en cuenta para el volumen semanal total.",
          ],
          lvl,
          m,
        );

      case "hombro":
        return build(
          "solo_hombro",
          "Shoulder Day",
          "Sesión completa de deltoides. Las 3 cabezas del hombro requieren trabajo específico — ningún otro ejercicio activa las 3 de forma completa.",
          [40, 55],
          [2, 3],
          ["Hombros"],
          [
            "Tres cabezas con función diferente: anterior (press), lateral (elevaciones laterales), posterior (pájaros/face pull).",
            "La cabeza POSTERIOR es la más descuidada y la más importante para postura. Priorizala.",
            "Press militar como base de volumen → elevaciones laterales → face pull o pájaros para posterior.",
            lvl === "principiante"
              ? "Press con mancuernas + elevaciones laterales + pájaros inclinado. Eso es todo lo que necesitás."
              : "Press militar con barra + elevaciones laterales (cable para tensión continua) + face pull con cuerda.",
            "Los hombros trabajan en pecho y espalda — si entrenás 4+ días cuidá el volumen total para no sobrecargar.",
          ],
          lvl,
          m,
        );

      case "piernas":
        return build(
          "solo_piernas",
          "Leg Day",
          "El grupo muscular más grande del cuerpo. Cuádriceps, isquiotibiales, glúteos y pantorrillas en una sesión completa.",
          [50, 70],
          [2, 3],
          ["Piernas"],
          [
            "Dividí la sesión en quad-dominante (sentadilla, prensa, extensión) y femoral-dominante (peso muerto rumano, curl femoral, hip thrust).",
            "La sentadilla o prensa primero cuando el SNC está fresco — son los ejercicios más demandantes.",
            "No descuides isquiotibiales. La mayoría sobredesarrolla cuádriceps y subdesarrolla femorales → lesiones de rodilla.",
            lvl === "principiante"
              ? "Sentadilla + prensa + peso muerto rumano + curl femoral. 4 ejercicios, completo."
              : lvl === "intermedio"
                ? "Sentadilla trasera + prensa + RDL + curl femoral tumbado + extensión + pantorrillas."
                : "Considerá dividir en día quad (Lunes) y día femoral/glúteo (Jueves) para mayor volumen.",
            "Dejá 48-72hs antes de volver a entrenar piernas — tienen la mayor demanda metabólica del cuerpo.",
          ],
          lvl,
          m,
          lvl === "avanzado"
            ? "Con 4+ días: Piernas(quad) / Torso / Piernas(femoral) / Torso"
            : undefined,
        );
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // N = 2
  // ══════════════════════════════════════════════════════════════════════════

  if (n === 2) {
    if (hasAll(m, "pecho", "triceps"))
      return build(
        "pecho_triceps",
        "Chest & Triceps",
        "La combinación de empuje más probada del gym. El tríceps actúa como sinergista en todos los press de pecho — máxima eficiencia.",
        [45, 60],
        [2, 3],
        ["Empuje"],
        [
          "Siempre pecho primero — es más grande y necesita más energía.",
          "El tríceps ya está pre-estimulado por el press → necesita menos series directas (3-4 ejercicios al final).",
          "Orden clásico: Press plano → Press inclinado → Fondos → Polea tríceps → Extensión overhead.",
          lvl === "principiante"
            ? "5-6 ejercicios totales. No más — la calidad cae con el volumen excesivo."
            : "Podés hacer superseries al final: un ejercicio de pecho + uno de tríceps para mayor densidad.",
          "Complementá con Espalda+Bíceps otro día — es el split más balanceado del torso.",
        ],
        lvl,
        m,
        "Split ideal: Pecho+Tríceps / Espalda+Bíceps / Piernas",
      );

    if (hasAll(m, "espalda", "biceps"))
      return build(
        "espalda_biceps",
        "Back & Biceps",
        "La combinación de tirón más efectiva del gym. El bíceps es sinergista en todos los jalones y remos — sinergia máxima.",
        [45, 60],
        [2, 3],
        ["Tirón"],
        [
          "Siempre espalda primero — más grande y compuesta.",
          "El bíceps pre-fatigado por la espalda necesita menos series directas → 3-4 ejercicios de curl al final.",
          "Orden clásico: Dominadas/Jalón → Remo → Remo unilateral → Curl con barra → Curl martillo.",
          lvl === "principiante"
            ? "Jalón en polea + remo en polea + curl con barra EZ. Suficiente para empezar."
            : "Dominadas → Remo con barra → Remo unilateral → Curl EZ → Curl inclinado.",
          "Complementá con Pecho+Tríceps otro día para el balance más fundamental del torso.",
        ],
        lvl,
        m,
        "Split ideal: Espalda+Bíceps / Pecho+Tríceps / Piernas",
      );

    if (hasAll(m, "biceps", "triceps"))
      return build(
        "biceps_triceps",
        "Arms Day",
        "Sesión especializada en brazos. Bíceps y tríceps son antagonistas del codo — las superseries entre ellos son altamente eficientes.",
        [35, 50],
        [2, 3],
        ["Brazos"],
        [
          "Superseries bíceps/tríceps: mientras uno trabaja el otro descansa. Sesiones densas y cortas.",
          "El tríceps representa ~65% del brazo. Si querés brazos grandes, priorizá el tríceps.",
          "Par base: Curl con barra + Extensión en polea (superserie). Repetir 3-4 veces.",
          lvl === "principiante"
            ? "Curl EZ + Polea cuerda + Curl martillo + Press cerrado. 4 ejercicios, completo."
            : "Incluí curl en banco Scott + press francés para cabeza larga de ambos músculos.",
          "Esta sesión tiene más sentido en programas de 4-5 días donde ya cubriste pecho y espalda.",
        ],
        lvl,
        m,
        "Cuándo usar: como 4to/5to día en un programa que ya tiene Pecho+Tríceps y Espalda+Bíceps.",
      );

    if (hasAll(m, "pecho", "hombro"))
      return build(
        "pecho_hombro",
        "Chest & Shoulders",
        "Combinación de empuje con alta sinergia en el deltoides anterior. El hombro anterior trabaja en todos los press de pecho.",
        [45, 60],
        [2, 3],
        ["Empuje"],
        [
          "Pecho primero con press plano/inclinado, luego press militar para hombros.",
          "El deltoides anterior ya está estimulado → enfocá hombros en cabeza lateral y posterior.",
          "Elevaciones laterales y face pull completan el trabajo de hombro sin redundancia.",
          lvl === "principiante"
            ? "Press de banca + Press militar + Elevaciones laterales. Tres ejercicios base, eso es todo."
            : "Sumá trabajo de rotadores (rotación externa con cable) para salud articular del hombro.",
          "Sin tríceps directo podés darle más volumen a pecho y hombros.",
        ],
        lvl,
        m,
        "Complemento natural: agregar Tríceps para completar el bloque de empuje.",
      );

    if (hasAll(m, "hombro", "triceps"))
      return build(
        "hombro_triceps",
        "Shoulders & Triceps",
        "Sesión de empuje enfocada en la parte superior. Útil para dar más frecuencia a hombros y tríceps después de un día de pecho.",
        [40, 55],
        [2, 3],
        ["Empuje"],
        [
          "Press militar como ejercicio central — activa deltoides y tríceps simultáneamente.",
          "Elevaciones laterales + face pull para hombros, luego polea y extensiones para tríceps.",
          "Esta sesión complementa perfectamente un día de pecho 48-72hs antes.",
          lvl === "principiante"
            ? "Press con mancuernas + elevaciones laterales + polea con cuerda."
            : "Press militar con barra + elevaciones laterales en cable + press francés.",
        ],
        lvl,
        m,
        "Estructura posible: Pecho / Hombros+Tríceps / Espalda+Bíceps / Piernas",
      );

    if (hasAll(m, "espalda", "hombro"))
      return build(
        "espalda_hombro",
        "Back & Shoulders",
        "Combinación que desarrolla todo el posterior del cuerpo. El deltoides posterior se activa en ejercicios de espalda.",
        [45, 60],
        [2, 3],
        ["Tirón", "Hombros"],
        [
          "Espalda primero con jalones y remos, luego hombros específicos.",
          "El deltoides posterior (pájaros, face pull) encaja naturalmente después de espalda.",
          "Trabajá las 3 cabezas del hombro: press para anterior, elevaciones para lateral, face pull para posterior.",
          lvl === "principiante"
            ? "Jalón + Remo + Press militar + Elevaciones laterales + Face pull."
            : "Dominadas + Remo con barra + Press militar + Face pull con cuerda.",
        ],
        lvl,
        m,
      );

    if (hasAll(m, "pecho", "espalda"))
      return build(
        "pecho_espalda",
        "Chest & Back",
        "Entrenamiento de músculos antagonistas. La activación del músculo opuesto (potenciación recíproca) mejora el rendimiento en ambos grupos.",
        [50, 65],
        [2, 3],
        ["Torso"],
        [
          "Superseries antagonistas: Press plano + Remo en polea (o dominadas). Muy eficiente.",
          "Mientras uno trabaja el otro descansa activamente — menos tiempo, misma o mayor calidad.",
          "Cubrís la mayor masa muscular del tren superior en una sola sesión.",
          lvl === "principiante"
            ? "3-4 superseries: Press banca + Jalón → Press inclinado + Remo → Fondos + Face pull."
            : "Press con barra + Dominadas como superserie base. Luego aislamiento en las variantes.",
          "Sin brazos directos — podés agregar 2-3 series de curl y tríceps al final si sobra tiempo y energía.",
        ],
        lvl,
        m,
        "Estructura posible: Pecho+Espalda / Piernas / Hombros+Brazos",
      );

    if (hasAll(m, "piernas", "hombro"))
      return build(
        "piernas_hombro",
        "Legs & Shoulders",
        "Combinación sin interferencia: piernas y hombros no comparten sinergistas. Permite trabajar ambos con calidad completa.",
        [55, 70],
        [2, 3],
        ["Piernas", "Hombros"],
        [
          "Empezá con piernas — mayor demanda energética y del sistema nervioso central.",
          "Hombros al final: el trabajo de pecho de días anteriores no va a afectar esta sesión.",
          "Podés darle volumen completo a ambos grupos porque no hay fatiga cruzada.",
          lvl === "principiante"
            ? "Sentadilla + Prensa + Peso muerto rumano → Press militar + Elevaciones laterales."
            : "Sentadilla + Peso muerto rumano + Curl femoral → Press militar + Elevaciones lat. + Face pull.",
          "Útil cuando ya entrenaste torso ayer y necesitás respetar la recuperación de pecho/espalda.",
        ],
        lvl,
        m,
      );

    if (hasLegs(m) && hasUpper(m)) {
      const upperM = m.find((x) => (UPPER as readonly string[]).includes(x))!;
      const upperLabel = upperM.charAt(0).toUpperCase() + upperM.slice(1);
      return build(
        "piernas_plus",
        `Legs & ${upperLabel}`,
        `Combinación de tren inferior con trabajo específico de ${upperM}. Sin interferencia entre grupos — podés trabajar ambos con calidad.`,
        [50, 65],
        [2, 3],
        ["Piernas", upperLabel],
        [
          "Piernas primero — mayor demanda energética.",
          `El trabajo de ${upperM} al final no interfiere con la recuperación de piernas.`,
          "Esta estructura te permite entrenar más frecuente sin solapar recuperación muscular.",
          lvl === "principiante"
            ? "Moderá el volumen en ambos grupos mientras tu cuerpo se adapta al entrenamiento."
            : "Podés llevar piernas a alta intensidad sabiendo que el torso es trabajo complementario.",
        ],
        lvl,
        m,
      );
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // N = 3
  // ══════════════════════════════════════════════════════════════════════════

  if (n === 3) {
    if (hasAll(m, "pecho", "hombro", "triceps"))
      return build(
        "push_clasico",
        "Push",
        "La sesión de empuje definitiva. Los tres grupos trabajan sinérgicamente en cada movimiento de press — máxima eficiencia de empuje.",
        [50, 65],
        [2, 3],
        ["Empuje"],
        [
          "Orden de prioridad: grupo más grande y más importante primero (pecho → hombro → tríceps).",
          "Press plano o inclinado → Press militar → Fondos o Extensión overhead → Polea tríceps.",
          "El tríceps y el hombro anterior ya están pre-estimulados — necesitan menos volumen directo.",
          lvl === "principiante"
            ? "3 ejercicios base: Press banca + Press militar + Polea cuerda. Dominalos antes de agregar más."
            : "Push A (foco pecho): Press plano pesado. Push B (foco hombros): Press militar pesado. Alternando semanas.",
          "El complemento natural es un día Pull (Espalda+Bíceps) — sin él el programa está incompleto.",
        ],
        lvl,
        m,
        "Split más eficiente: Push / Pull / Legs — o — Push / Pull / Descanso (repetir)",
      );

    if (hasAll(m, "espalda", "biceps", "hombro"))
      return build(
        "pull_clasico",
        "Pull + Shoulders",
        "Día de tirón completo con trabajo de hombros. El deltoides posterior se beneficia del calentamiento previo de espalda.",
        [50, 65],
        [2, 3],
        ["Tirón", "Hombros"],
        [
          "Espalda → Bíceps → Hombros (específicamente deltoides posterior y lateral).",
          "Face pull y pájaros para posterior del hombro encajan perfectamente después de espalda.",
          "Variá el agarre en jalones: supino (más bíceps), prono (más espalda).",
          lvl === "principiante"
            ? "Jalón + Remo + Curl EZ + Face pull. Cuatro ejercicios, completo."
            : "Dominadas + Remo barra + Curl inclinado + Face pull + Elevaciones laterales.",
          "Complementá con día Push para el balance de torso.",
        ],
        lvl,
        m,
      );

    if (hasAll(m, "espalda", "biceps") && !hasPush(m) && !hasLegs(m))
      return build(
        "pull_clasico",
        "Pull",
        "Día de tirón clásico. Espalda y bíceps son el par sinérgico más eficiente del tren superior.",
        [45, 60],
        [2, 3],
        ["Tirón"],
        [
          "Jalones/Dominadas como base vertical, Remos como base horizontal.",
          "El bíceps se activa en todos los ejercicios de espalda → necesita menos volumen directo.",
          "Trabajá con agarres variados para diferente énfasis muscular.",
          lvl === "principiante"
            ? "Jalón en polea + Remo sentado + Curl con barra EZ. Básico y efectivo."
            : "Dominadas (lastre si podés) + Remo con barra + Remo unilateral + Curl inclinado.",
        ],
        lvl,
        m,
      );

    if (hasAll(m, "pecho", "espalda", "hombro"))
      return build(
        "torso_completo",
        "Upper Body",
        "Sesión de tren superior sin brazos. Máxima eficiencia para quienes tienen pocos días disponibles.",
        [55, 70],
        [2, 3],
        ["Torso"],
        [
          "Superseries antagonistas: Press plano + Remo, Press inclinado + Jalón.",
          "Hombros al final — ya están calentados por pecho y espalda.",
          "Sin bíceps ni tríceps directos — podés agregar 2-3 series de cada uno al final.",
          lvl === "principiante"
            ? "Press + Jalón + Press militar. 3 ejercicios compuestos, eso es un torso bien trabajado."
            : "3-4 superseries antagonistas + press militar + elevaciones como finalizador.",
          "Ideal para programas de 2-3 días/semana donde necesitás cubrir mucho en poco tiempo.",
        ],
        lvl,
        m,
        "Con 3 días/semana: Torso / Piernas / Torso+Brazos (alternando)",
      );

    if (hasAll(m, "pecho", "espalda", "biceps") && !has(m, "triceps"))
      return build(
        "torso_completo",
        "Upper Body + Biceps",
        "Pecho, espalda y bíceps. Sesión completa de tren superior con énfasis en tirón y brazos.",
        [55, 70],
        [2, 3],
        ["Torso", "Bíceps"],
        [
          "Superseries pecho/espalda para eficiencia, curl de bíceps al final.",
          "El bíceps ya trabajó en la espalda — no necesitás muchas series directas.",
          "Considerá agregar tríceps al final para balance de brazos.",
          lvl === "principiante"
            ? "Press banca + Jalón + Remo + Curl EZ. Eso es completo para esta sesión."
            : "Superserie press/jalón x3 + Remo x3 + Curl inclinado + Curl martillo.",
        ],
        lvl,
        m,
      );

    if (hasAll(m, "pecho", "espalda", "triceps") && !has(m, "biceps"))
      return build(
        "torso_completo",
        "Upper Body + Triceps",
        "Pecho, espalda y tríceps. Sesión completa de tren superior con énfasis en empuje y brazos.",
        [55, 70],
        [2, 3],
        ["Torso", "Tríceps"],
        [
          "Superseries pecho/espalda para eficiencia, tríceps al final.",
          "El tríceps ya trabajó en el pecho — enfocate en cabeza larga (extensión overhead).",
          "Considerá agregar bíceps al final para balance de brazos.",
          lvl === "principiante"
            ? "Press banca + Jalón + Remo + Polea tríceps. Completo."
            : "Superserie press/jalón x3 + Remo x3 + Press francés + Polea cuerda.",
        ],
        lvl,
        m,
      );

    if (hasLegs(m) && hasUpper(m)) {
      const upperSel = m.filter((x) =>
        (UPPER as readonly string[]).includes(x),
      );
      const tags = upperSel.map((u) => u.charAt(0).toUpperCase() + u.slice(1));
      return build(
        "piernas_plus",
        `Legs + ${tags.join(" & ")}`,
        "Combinás tren inferior con trabajo de torso. Sin interferencia muscular — podés dar calidad a ambos grupos.",
        [55, 70],
        [3, 4],
        ["Piernas", ...tags],
        [
          "Piernas primero siempre — la demanda del SNC es mayor.",
          `El trabajo de ${tags.join(" y ")} al final no compromete la recuperación de piernas.`,
          "Con 4 días: 2 días de torso dividido + 2 días de piernas para mayor volumen.",
          lvl === "principiante"
            ? "Moderá el volumen total — estás entrenando grupos distintos en una sola sesión."
            : "Podés llevar piernas a alta intensidad y hacer el torso como trabajo complementario.",
        ],
        lvl,
        m,
        "Estructura posible: Legs+Upper / Upper / Legs / Upper",
      );
    }

    if (hasPush(m) && !hasPull(m) && !hasLegs(m)) {
      const pushSel = pushMuscles(m);
      return build(
        "push_clasico",
        "Push Day",
        `Sesión de empuje: ${pushSel.join(", ")}. Alta sinergia entre los grupos seleccionados.`,
        [45, 60],
        [2, 3],
        ["Empuje"],
        [
          "Ejercicios compuestos primero (press), aislamiento al final.",
          "Sin tirón en esta sesión — fundamental tener días de espalda/bíceps en la semana.",
          lvl === "principiante"
            ? "3-4 ejercicios totales es suficiente."
            : "5-6 ejercicios con variantes de ángulo y agarre para cobertura completa.",
        ],
        lvl,
        m,
      );
    }

    if (hasPull(m) && !hasPush(m) && !hasLegs(m)) {
      const pullSel = pullMuscles(m);
      return build(
        "pull_clasico",
        "Pull Day",
        `Sesión de tirón: ${pullSel.join(", ")}. Sinergia alta entre los grupos seleccionados.`,
        [45, 60],
        [2, 3],
        ["Tirón"],
        [
          "Ejercicios compuestos de espalda primero, aislamiento al final.",
          "Jalones verticales + remos horizontales para desarrollo completo de espalda.",
          lvl === "principiante"
            ? "3-4 ejercicios base."
            : "5-6 ejercicios con variantes de agarre.",
        ],
        lvl,
        m,
      );
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // N = 4
  // ══════════════════════════════════════════════════════════════════════════

  if (n === 4) {
    if (hasPush(m) && hasPull(m) && !hasLegs(m))
      return build(
        "push_pull",
        "Push / Pull",
        "Torso completo. Podés hacer todo en una sesión (mayor duración) o dividido en días Push/Pull para mayor calidad.",
        [55, 75],
        [3, 5],
        ["Empuje", "Tirón"],
        [
          "Como sesión única: superseries antagonistas para eficiencia máxima.",
          "Como split Push/Pull: 2 días push + 2 días pull = 4 días, alta frecuencia por grupo.",
          "Con 3 días: Push / Pull / Torso completo alternando.",
          lvl === "principiante"
            ? "Empezá con 3 días: Push / Pull / Torso completo. Mejor que intentar los 4 días desde el inicio."
            : "4 días Push/Pull/Push/Pull es el estándar de referencia para este bloque.",
          "Sin piernas el programa está incompleto — el tren inferior no puede ignorarse.",
        ],
        lvl,
        m,
        lvl === "principiante"
          ? "3 días: Push / Pull / Torso completo"
          : "4 días: Push / Pull / Push / Pull",
      );

    if (hasLegs(m) && hasPush(m) && hasPull(m))
      return build(
        "upper_lower",
        "Upper / Lower",
        "El split más recomendado por evidencia científica para 4 días. Alta frecuencia (2x por semana por músculo) con recuperación óptima.",
        [55, 70],
        [3, 5],
        ["Torso", "Piernas"],
        [
          "Upper A (énfasis push): Press plano pesado, Press inclinado, Press militar, Tríceps.",
          "Upper B (énfasis pull): Dominadas/Jalón, Remo, Curl bíceps, Face pull.",
          "Lower A y B pueden ser iguales o dividir quad-dominante / femoral-dominante.",
          lvl === "principiante"
            ? "Con 3 días: Upper / Lower / Upper alternando semana a semana con Lower / Upper / Lower."
            : "4 días: Upper A / Lower / Upper B / Lower — cada músculo trabaja 2 veces por semana.",
          "Es el split más estudiado: óptimo en frecuencia, volumen y recuperación.",
        ],
        lvl,
        m,
        "4 días: Upper(push) / Lower / Upper(pull) / Lower",
      );

    if (hasPush(m) && hasLegs(m) && !hasPull(m))
      return build(
        "piernas_plus",
        "Push + Legs",
        "Tren anterior completo + tren inferior. Falta el bloque Pull para un programa balanceado.",
        [55, 70],
        [3, 4],
        ["Empuje", "Piernas"],
        [
          "Distribuí en días: Push / Legs / Push / Legs.",
          "Sin espalda y bíceps — importante añadir 1-2 días Pull a la semana.",
          "Esta selección cubre bien el tren anterior — completá con Pull para balance total.",
          lvl === "principiante"
            ? "3 días: Push / Legs / Push alternando."
            : "Agregá 1-2 días Pull para un programa completo.",
        ],
        lvl,
        m,
      );

    if (hasPull(m) && hasLegs(m) && !hasPush(m))
      return build(
        "piernas_plus",
        "Pull + Legs",
        "Tren posterior completo + tren inferior. Falta el bloque Push para el programa completo.",
        [55, 70],
        [3, 4],
        ["Tirón", "Piernas"],
        [
          "Distribuí en días: Pull / Legs / Pull / Legs.",
          "Sin pecho, hombros y tríceps — el balance de torso está incompleto.",
          "Agregá días Push para completar el programa.",
          lvl === "principiante"
            ? "3 días: Pull / Legs / Pull."
            : "4-5 días: Pull / Legs / Push / Pull / Legs.",
        ],
        lvl,
        m,
      );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // N = 5
  // ══════════════════════════════════════════════════════════════════════════

  if (n === 5) {
    if (hasPush(m) && hasPull(m) && hasLegs(m))
      return build(
        "push_pull_legs",
        "Push / Pull / Legs",
        "Los tres bloques funcionales completos. La estructura más validada científicamente para desarrollo muscular general.",
        [55, 75],
        [3, 6],
        ["Empuje", "Tirón", "Piernas"],
        [
          "Push: pecho + hombros + tríceps en un día.",
          "Pull: espalda + bíceps en un día.",
          "Legs: piernas completo (quad + femoral + pantorrillas).",
          lvl === "principiante"
            ? "PPL 3 días/semana: un ciclo completo. Ideal para el primer año."
            : lvl === "intermedio"
              ? "PPL 5-6 días: dos ciclos por semana — cada músculo recibe 2 estímulos semanales."
              : "PPL 6 días x2 ciclos: máxima frecuencia. Requiere excelente recuperación y nutrición.",
          "Con 6 días agregá un día de descanso activo (caminar, movilidad) para no acumular fatiga.",
        ],
        lvl,
        m,
        lvl === "principiante"
          ? "3 días: Push / Pull / Legs (repetir la semana siguiente)"
          : "6 días: Push / Pull / Legs / Push / Pull / Legs",
      );

    if (!hasLegs(m))
      return build(
        "upper_sin_piernas",
        "Upper Body",
        "Cobertura completa de tren superior. Alta especialización en torso — recordá que las piernas son el 50% de la masa muscular del cuerpo.",
        [55, 75],
        [3, 5],
        ["Torso"],
        [
          "Con 4-5 días: Push / Pull / Upper completo / Arms.",
          "Sin piernas el programa está nutricionalmente y hormonalmente limitado.",
          "El entrenamiento de piernas (sentadilla, peso muerto) genera más testosterona y GH que cualquier ejercicio de torso.",
          lvl === "principiante"
            ? "Agregá aunque sea 1 día de piernas a la semana — es la recomendación más importante."
            : "Sin piernas el techo de desarrollo de torso también se limita — están más conectados de lo que parece.",
        ],
        lvl,
        m,
      );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // N = 6
  // ══════════════════════════════════════════════════════════════════════════

  if (n === 6)
    return build(
      "fullbody",
      "Full Body",
      "Todos los grupos musculares. Ideal como Full Body (todos en cada sesión con 1-2 series por grupo) o como PPL x2 (6 días divididos).",
      [55, 80],
      [3, 6],
      ["Cuerpo Completo"],
      [
        "Full Body 3x: todos los grupos en cada sesión, 2-3 series por grupo. Frecuencia 3x por semana.",
        "PPL 6x: Push/Pull/Legs repetido dos veces. Frecuencia 2x por semana por músculo.",
        lvl === "principiante"
          ? "Full Body 3 días es la MEJOR opción para principiantes. Máxima frecuencia de movimiento."
          : lvl === "intermedio"
            ? "PPL 5-6 días — la frecuencia doble por músculo es clave para continuar progresando."
            : "PPL 6 días o Upper/Lower 4 días son los estándares para atletas avanzados.",
        "Priorizá sueño (7-9hs) y nutrición — sin recuperación el volumen alto es contraproducente.",
        "En Full Body los ejercicios DEBEN ser compuestos. No tiene sentido hacer curl en un programa Full Body.",
      ],
      lvl,
      m,
      lvl === "principiante"
        ? "Full Body: Lunes / Miércoles / Viernes"
        : lvl === "intermedio"
          ? "PPL 5 días: Push / Pull / Legs / Push / Pull"
          : "PPL 6 días: Push / Pull / Legs / Push / Pull / Legs",
    );

  // ══════════════════════════════════════════════════════════════════════════
  // FALLBACK
  // ══════════════════════════════════════════════════════════════════════════

  const autoTags: string[] = [];
  if (hasPush(m)) autoTags.push("Empuje");
  if (hasPull(m)) autoTags.push("Tirón");
  if (hasLegs(m)) autoTags.push("Piernas");
  if (autoTags.length === 0) autoTags.push("Personalizada");

  const [dMin, dMax] = dur([40, 60], lvl);
  const { exercisesPerMuscle, setsRange, levelSummary } = levelFields(lvl);

  return {
    routineType: "custom",
    routineLabel: "Custom",
    routineDescription:
      "Combinación personalizada. La IA va a armar la estructura más eficiente para tu selección específica.",
    durationMin: dMin,
    durationMax: dMax,
    daysPerWeek: [2, 4],
    daysLabel: "2 a 4 días por semana",
    muscleGroups: m,
    splitTags: autoTags,
    tips: [
      "Dejá al menos 48hs de descanso antes de trabajar el mismo músculo.",
      "La IA va a optimizar el orden y volumen según tu selección.",
    ],
    exercisesPerMuscle,
    setsRange,
    levelSummary,
  };
}
