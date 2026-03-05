export type TrainingCategory =
  | "push"
  | "pull"
  | "legs"
  | "upper"
  | "lower"
  | "fullbody";

export interface CategoryOption {
  id: TrainingCategory;
  label: string;
  subtitle: string;
  muscles: string[];
  icon: string;
  colorAccent: string;
}

// ─── Definición de cada categoría ────────────────────────────────────────────

export const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: "push",
    label: "Push",
    subtitle: "Pecho · Hombros · Tríceps",
    muscles: ["pecho", "hombro", "triceps"],
    icon: "arrow-up-circle-outline",
    colorAccent: "#3B82F6", // azul
  },
  {
    id: "pull",
    label: "Pull",
    subtitle: "Espalda · Bíceps",
    muscles: ["espalda", "biceps"],
    icon: "arrow-down-circle-outline",
    colorAccent: "#8B5CF6", // violeta
  },
  {
    id: "legs",
    label: "Legs",
    subtitle: "Cuádriceps · Isquios · Glúteos",
    muscles: ["piernas"],
    icon: "flash-outline",
    colorAccent: "#F59E0B", // naranja
  },
  {
    id: "upper",
    label: "Upper Body",
    subtitle: "Push + Pull — todo el tren superior",
    muscles: ["pecho", "espalda", "hombro", "biceps", "triceps"],
    icon: "body-outline",
    colorAccent: "#2ECFBE", // teal
  },
  {
    id: "lower",
    label: "Lower Body",
    subtitle: "Piernas completo — quad, femoral, glúteo",
    muscles: ["piernas"],
    icon: "walk-outline",
    colorAccent: "#F97316", // naranja fuerte
  },
  {
    id: "fullbody",
    label: "Full Body",
    subtitle: "Todos los grupos — alta frecuencia, bajo volumen por músculo",
    muscles: ["pecho", "espalda", "hombro", "biceps", "triceps", "piernas"],
    icon: "infinite-outline",
    colorAccent: "#10B981", // verde
  },
];

// ─── Reglas de compatibilidad ─────────────────────────────────────────────────
// Qué categorías NO pueden combinarse con cuáles

export type RuleSeverity = "error" | "warning";

export interface CategoryCompatibilityRule {
  severity: RuleSeverity;
  code: string;
  title: string;
  message: string;
  // Si cualquiera de triggerIds está seleccionada junto con cualquiera de conflictIds → aplica la regla
  triggerIds: TrainingCategory[];
  conflictIds: TrainingCategory[];
}

export const CATEGORY_RULES: CategoryCompatibilityRule[] = [
  // ── ERRORES — bloquean continuar ─────────────────────────────────────────

  {
    severity: "error",
    code: "FULLBODY_EXCLUSIVE",
    title: "Full Body no se puede combinar",
    message:
      "Full Body ya incluye todos los grupos musculares. No tiene sentido combinarlo con otra categoría — seleccioná solo Full Body o elegí categorías específicas.",
    triggerIds: ["fullbody"],
    conflictIds: ["push", "pull", "legs", "upper", "lower"],
  },
  {
    severity: "error",
    code: "UPPER_WITH_PUSH_PULL",
    title: "Upper Body ya incluye Push y Pull",
    message:
      "Upper Body cubre todo el tren superior (pecho, espalda, hombros, bíceps, tríceps). Combinarlo con Push o Pull genera superposición total de grupos — no tiene sentido.",
    triggerIds: ["upper"],
    conflictIds: ["push", "pull"],
  },
  {
    severity: "error",
    code: "LOWER_WITH_LEGS",
    title: "Lower Body y Legs son lo mismo",
    message:
      "Lower Body y Legs Day trabajan los mismos músculos. Elegí uno solo según tu preferencia.",
    triggerIds: ["lower"],
    conflictIds: ["legs"],
  },

  // ── WARNINGS — válido pero el coach avisa ────────────────────────────────

  {
    severity: "warning",
    code: "PUSH_NO_PULL",
    title: "Push sin Pull — desequilibrio a largo plazo",
    message:
      "Entrenar solo empuje sin tirón genera desequilibrio muscular y postural. Asegurate de tener días de Pull en tu semana.",
    triggerIds: ["push"],
    conflictIds: [],
    // Este warning aplica cuando hay push pero NO hay pull, upper ni fullbody
    // Se evalúa por separado en la función
  },
  {
    severity: "warning",
    code: "PULL_NO_PUSH",
    title: "Pull sin Push — desequilibrio a largo plazo",
    message:
      "Entrenar solo tirón sin empuje genera desequilibrio muscular. Asegurate de tener días de Push en tu semana.",
    triggerIds: ["pull"],
    conflictIds: [],
  },
];

// ─── Evaluador ────────────────────────────────────────────────────────────────

export interface CategoryIssue {
  severity: RuleSeverity;
  code: string;
  title: string;
  message: string;
  affectedIds: TrainingCategory[];
}

export function evaluateCategoryCompatibility(
  selected: TrainingCategory[],
): CategoryIssue[] {
  const issues: CategoryIssue[] = [];
  const s = new Set(selected);

  if (selected.length <= 1) return [];

  // ── Errores por reglas de superposición ──────────────────────────────────
  for (const rule of CATEGORY_RULES) {
    if (rule.conflictIds.length === 0) continue; // warnings especiales, ver abajo
    const hasTrigger = rule.triggerIds.some((id) => s.has(id));
    const hasConflict = rule.conflictIds.some((id) => s.has(id));
    if (hasTrigger && hasConflict) {
      issues.push({
        severity: rule.severity,
        code: rule.code,
        title: rule.title,
        message: rule.message,
        affectedIds: [
          ...rule.triggerIds.filter((id) => s.has(id)),
          ...rule.conflictIds.filter((id) => s.has(id)),
        ] as TrainingCategory[],
      });
    }
  }

  // ── Warning: Push sin Pull ────────────────────────────────────────────────
  const hasPushCoverage = s.has("push") || s.has("upper") || s.has("fullbody");
  const hasPullCoverage = s.has("pull") || s.has("upper") || s.has("fullbody");

  if (s.has("push") && !hasPullCoverage && selected.length >= 1) {
    issues.push({
      severity: "warning",
      code: "PUSH_NO_PULL",
      title: "Push sin Pull — desequilibrio a largo plazo",
      message:
        "Entrenar solo empuje sin tirón genera desequilibrio muscular y postural. Asegurate de tener días de Pull en tu semana.",
      affectedIds: ["push"],
    });
  }

  if (s.has("pull") && !hasPushCoverage && selected.length >= 1) {
    issues.push({
      severity: "warning",
      code: "PULL_NO_PUSH",
      title: "Pull sin Push — desequilibrio a largo plazo",
      message:
        "Entrenar solo tirón sin empuje genera desequilibrio muscular. Asegurate de tener días de Push en tu semana.",
      affectedIds: ["pull"],
    });
  }

  // ── Warning: Upper + Lower = casi Full Body ───────────────────────────────
  if (s.has("upper") && (s.has("lower") || s.has("legs"))) {
    issues.push({
      severity: "warning",
      code: "UPPER_LOWER_IS_FULLBODY",
      title: "Upper + Lower = Full Body",
      message:
        "Combinar Upper y Lower Body es equivalente a Full Body. Considerá seleccionar Full Body directamente para tener el contexto correcto de volumen y frecuencia.",
      affectedIds: ["upper", s.has("lower") ? "lower" : "legs"],
    });
  }

  return issues;
}

export function hasCategoryBlockingError(issues: CategoryIssue[]): boolean {
  return issues.some((i) => i.severity === "error");
}

// ─── Resolver músculos desde categorías seleccionadas ────────────────────────

export function resolveMusclesFromCategories(
  category: TrainingCategory,
): string[] {
  const cat = CATEGORY_OPTIONS.find((c) => c.id === category);

  if (!cat) return [];

  return [...cat.muscles];
}
