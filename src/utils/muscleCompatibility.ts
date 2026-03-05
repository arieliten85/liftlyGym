// // src/utils/muscleCompatibility.ts
// //
// // ═══════════════════════════════════════════════════════════════════════════
// // VALIDADOR DE COMBINACIONES MUSCULARES
// // Lógica de coach profesional — 15+ años de experiencia en sala de pesas
// // ═══════════════════════════════════════════════════════════════════════════
// //
// // FILOSOFÍA:
// //   NO penalizamos sesiones especializadas. Un atleta puede entrenar solo
// //   bíceps, solo tríceps, solo piernas — eso es perfectamente válido.
// //   Solo avisamos cuando hay un CONFLICTO REAL que va a perjudicar la sesión
// //   o el cuerpo del usuario a largo plazo.
// //
// // REGLAS BASE DEL COACH:
// //   ✓ Cualquier músculo individual → SIEMPRE válido
// //   ✓ Brazos solos (bíceps + tríceps) → válido (día de brazos clásico)
// //   ✓ Pecho + Espalda → válido (torso, antagonistas, muy eficiente)
// //   ✓ Solo empuje → válido como sesión, AVISO de balance a largo plazo
// //   ✓ Solo tirón → válido como sesión, AVISO de balance a largo plazo
// //
// // ERRORES REALES (los únicos que bloqueamos):
// //   ✗ Pecho + Espalda + Bíceps + Tríceps en una sola sesión
// //     → Demasiado volumen, calidad cero en cada grupo
// //   ✗ Hombros después de pecho y tríceps en la misma sesión con piernas
// //     → Sobrecarga articular del hombro (riesgo de lesión real)
// //
// // WARNINGS (el usuario decide, pero sabe):
// //   ⚠ Solo push (2+ músculos) sin pull → desequilibrio postural a largo plazo
// //   ⚠ Solo pull (2+ músculos) sin push → ídem
// //   ⚠ Pecho + Espalda + Bíceps sin tríceps → asimetría de brazos
// //   ⚠ Pecho + Espalda + Tríceps sin bíceps → ídem
// //   ⚠ Pecho + Tríceps + Bíceps → el bíceps no aporta nada acá, es ruido
// //   ⚠ Espalda + Bíceps + Tríceps → el tríceps no aporta nada acá
// //   ⚠ 5-6 grupos → fullbody session, bajo volumen por grupo (info, no error)
// // ═══════════════════════════════════════════════════════════════════════════

// export type CompatibilitySeverity = "error" | "warning" | "info";

// export interface CompatibilityIssue {
//   severity: CompatibilitySeverity;
//   code: string;
//   title: string;
//   message: string;
//   affectedMuscles: string[];
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const has = (m: string[], id: string) => m.includes(id);
// const hasAll = (m: string[], ...ids: string[]) =>
//   ids.every((id) => m.includes(id));
// const hasAny = (m: string[], ...ids: string[]) =>
//   ids.some((id) => m.includes(id));

// // Bloques funcionales
// const PUSH_MUSCLES = ["pecho", "hombro", "triceps"] as const;
// const PULL_MUSCLES = ["espalda", "biceps"] as const;

// const hasPush = (m: string[]) => hasAny(m, ...PUSH_MUSCLES);
// const hasPull = (m: string[]) => hasAny(m, ...PULL_MUSCLES);

// // Cuántos músculos de empuje están seleccionados
// const pushCount = (m: string[]) =>
//   PUSH_MUSCLES.filter((x) => m.includes(x)).length;

// // Cuántos músculos de tirón están seleccionados
// const pullCount = (m: string[]) =>
//   PULL_MUSCLES.filter((x) => m.includes(x)).length;

// // ─── Evaluador ────────────────────────────────────────────────────────────────

// export function evaluateMuscleCompatibility(
//   selectedMuscles: string[],
// ): CompatibilityIssue[] {
//   const m = selectedMuscles;
//   const n = m.length;
//   const issues: CompatibilityIssue[] = [];

//   // Sin selección o selección única → siempre válido, sin mensajes
//   if (n <= 1) return [];

//   // ══════════════════════════════════════════════════════════════════════════
//   // ERRORES — bloquean continuar
//   // Solo errores que realmente arruinan una sesión o generan riesgo de lesión
//   // ══════════════════════════════════════════════════════════════════════════

//   // ERROR: Pecho + Espalda + Bíceps + Tríceps (4 grupos grandes en una sesión)
//   // Esto es objetivamente un error de programación — cada grupo recibirá
//   // 2-3 series de baja calidad. No hay forma de hacerlo bien en una sola sesión.
//   if (hasAll(m, "pecho", "espalda", "biceps", "triceps") && n === 4) {
//     issues.push({
//       severity: "error",
//       code: "CHEST_BACK_ARMS_OVERLOAD",
//       title: "Demasiado volumen — sesión ineficiente",
//       message:
//         "Pecho + Espalda + Bíceps + Tríceps en una sola sesión es demasiado. Son 4 grupos grandes que compiten por energía y volumen. Cada músculo recibiría 2-3 series de mala calidad. Dividí en dos sesiones: Pecho+Tríceps / Espalda+Bíceps, o simplemente Pecho+Espalda.",
//       affectedMuscles: ["pecho", "espalda", "biceps", "triceps"],
//     });
//   }

//   // ERROR: Los 6 grupos en una sesión como si fuera un entrenamiento normal
//   // Fullbody está bien en 3 días/semana, pero si alguien elige los 6 grupos
//   // probablemente no entiende que es fullbody y va a intentar hacerlo todo con calidad.
//   // Esto es un error de expectativa, no de programación.
//   if (n === 6) {
//     issues.push({
//       severity: "error",
//       code: "ALL_MUSCLES_ONE_SESSION",
//       title: "Esto es Full Body — requiere planificación",
//       message:
//         "Seleccionaste todos los grupos musculares. Esto define una rutina Full Body, donde cada músculo trabaja en cada sesión con 1-2 series. Para que funcione necesitás 3-4 días por semana y entender que el volumen por músculo es bajo pero la frecuencia es alta. Si querés más intensidad por grupo, reducí la selección.",
//       affectedMuscles: m,
//     });
//   }

//   // ══════════════════════════════════════════════════════════════════════════
//   // WARNINGS — válido pero el coach te avisa
//   // ══════════════════════════════════════════════════════════════════════════

//   // WARNING: Pecho + Tríceps + Bíceps
//   // El bíceps no tiene función en una sesión de empuje. No es un error — el
//   // usuario puede hacerlo — pero el bíceps va a llegar fatigado si entrena
//   // espalda otro día pronto, o va a ser un desperdicio si no lo hace.
//   if (hasAll(m, "pecho", "triceps", "biceps") && !has(m, "espalda")) {
//     issues.push({
//       severity: "warning",
//       code: "PUSH_WITH_BICEPS",
//       title: "Bíceps no encaja en una sesión de empuje",
//       message:
//         "Pecho y tríceps son músculos de empuje que trabajan juntos. Agregar bíceps en esta sesión es válido, pero no tiene sinergia — el bíceps no se activa en ningún press. Considerá moverlo a un día de espalda para aprovechar la sinergia del tirón.",
//       affectedMuscles: ["biceps"],
//     });
//   }

//   // WARNING: Espalda + Bíceps + Tríceps
//   // El tríceps no tiene función en una sesión de tirón. Mismo razonamiento.
//   if (hasAll(m, "espalda", "biceps", "triceps") && !has(m, "pecho")) {
//     issues.push({
//       severity: "warning",
//       code: "PULL_WITH_TRICEPS",
//       title: "Tríceps no encaja en una sesión de tirón",
//       message:
//         "Espalda y bíceps son músculos de tirón con alta sinergia. Agregar tríceps en esta sesión es válido, pero el tríceps no se activa en jalones ni remos. Considerá moverlo a un día de pecho o hombros para aprovechar la sinergia del empuje.",
//       affectedMuscles: ["triceps"],
//     });
//   }

//   // WARNING: Solo push (2+ músculos de empuje, sin ningún tirón, sin piernas)
//   // Una sesión de push pura es perfectamente válida. Pero si el usuario está
//   // construyendo su programa completo solo con empuje, va a tener problemas.
//   // Lo avisamos sin bloquear.
//   if (hasPush(m) && !hasPull(m) && !has(m, "piernas") && pushCount(m) >= 2) {
//     issues.push({
//       severity: "warning",
//       code: "PUSH_ONLY_NO_PULL",
//       title: "Sin músculos de tirón en tu selección",
//       message:
//         "Tu selección incluye solo músculos de empuje. Como sesión individual está perfecto. Pero si este es todo tu programa, a mediano plazo vas a desarrollar desequilibrios posturales (hombros caídos, postura encorvada). Asegurate de tener días de espalda en tu semana.",
//       affectedMuscles: m.filter((x) =>
//         (PUSH_MUSCLES as readonly string[]).includes(x),
//       ),
//     });
//   }

//   // WARNING: Solo pull (2+ músculos de tirón, sin ningún empuje, sin piernas)
//   if (hasPull(m) && !hasPush(m) && !has(m, "piernas") && pullCount(m) >= 2) {
//     issues.push({
//       severity: "warning",
//       code: "PULL_ONLY_NO_PUSH",
//       title: "Sin músculos de empuje en tu selección",
//       message:
//         "Tu selección incluye solo músculos de tirón. Como sesión individual está perfecto. Pero si este es todo tu programa, el balance entre tren anterior y posterior se va a perder. Asegurate de tener días de pecho y hombros en tu semana.",
//       affectedMuscles: m.filter((x) =>
//         (PULL_MUSCLES as readonly string[]).includes(x),
//       ),
//     });
//   }

//   // WARNING: Pecho + Espalda + Bíceps sin tríceps
//   // El tríceps va a quedar subdesarrollado — asimetría de brazos.
//   if (
//     hasAll(m, "pecho", "espalda", "biceps") &&
//     !has(m, "triceps") &&
//     !has(m, "hombro")
//   ) {
//     issues.push({
//       severity: "warning",
//       code: "TORSO_BICEPS_NO_TRICEPS",
//       title: "Bíceps sin su contraparte (tríceps)",
//       message:
//         "Tenés pecho, espalda y bíceps, pero no tríceps. El bíceps va a recibir más estímulo directo que el tríceps, generando asimetría en los brazos. Agregá tríceps para balance, o eliminá bíceps y trabajá solo torso.",
//       affectedMuscles: ["biceps"],
//     });
//   }

//   // WARNING: Pecho + Espalda + Tríceps sin bíceps
//   if (
//     hasAll(m, "pecho", "espalda", "triceps") &&
//     !has(m, "biceps") &&
//     !has(m, "hombro")
//   ) {
//     issues.push({
//       severity: "warning",
//       code: "TORSO_TRICEPS_NO_BICEPS",
//       title: "Tríceps sin su contraparte (bíceps)",
//       message:
//         "Tenés pecho, espalda y tríceps, pero no bíceps. El tríceps recibirá más estímulo directo que el bíceps, generando asimetría en los brazos. Agregá bíceps para balance, o eliminá tríceps y trabajá solo torso.",
//       affectedMuscles: ["triceps"],
//     });
//   }

//   // INFO: 5 grupos musculares → prácticamente fullbody
//   // No es error ni warning — es solo información de contexto.
//   if (n === 5) {
//     issues.push({
//       severity: "info",
//       code: "NEAR_FULLBODY",
//       title: "Casi Full Body",
//       message:
//         "Con 5 grupos musculares estás muy cerca de una rutina Full Body. El volumen por grupo va a ser moderado. Esto funciona bien si lo distribuís en 3-4 días por semana.",
//       affectedMuscles: m,
//     });
//   }

//   return issues;
// }

// // ─── Helpers para la UI ───────────────────────────────────────────────────────

// export function hasBlockingError(issues: CompatibilityIssue[]): boolean {
//   return issues.some((i) => i.severity === "error");
// }

// export function getErrors(issues: CompatibilityIssue[]): CompatibilityIssue[] {
//   return issues.filter((i) => i.severity === "error");
// }

// export function getWarnings(
//   issues: CompatibilityIssue[],
// ): CompatibilityIssue[] {
//   return issues.filter((i) => i.severity === "warning");
// }

// export function getInfos(issues: CompatibilityIssue[]): CompatibilityIssue[] {
//   return issues.filter((i) => i.severity === "info");
// }
