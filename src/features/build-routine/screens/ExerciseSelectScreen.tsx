import { ExerciseService } from "@/services/exerciseService";
import OnboardingLayout from "@/shared/components/OnboardingLayout";
import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { Exercise, RoutineExercise, WeekDayKey } from "@/types/routine";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useShallow } from "zustand/react/shallow";

const exerciseService = new ExerciseService();

const DAY_LABELS: Record<WeekDayKey, string> = {
  lun: "Lunes",
  mar: "Martes",
  mie: "Miercoles",
  jue: "Jueves",
  vie: "Viernes",
  sab: "Sabado",
  dom: "Domingo",
};

const ROUTINE_TYPE_TO_MUSCLES: Record<string, string[]> = {
  push: ["pecho", "hombros", "triceps"],
  pull: ["espalda", "biceps"],
  legs: ["piernas", "gluteos", "core"],
  upper: ["pecho", "espalda", "hombros", "biceps", "triceps"],
  lower: ["piernas", "gluteos", "core"],
  fullbody: [
    "pecho",
    "espalda",
    "hombros",
    "biceps",
    "triceps",
    "piernas",
    "gluteos",
    "core",
  ],
};

// ─── Colors hook ──────────────────────────────────────────────────────────────

function useColors() {
  const { theme, isDark } = useAppTheme();
  return {
    isDark,
    teal: theme.primary,
    text: isDark ? "#DFF0EE" : theme.text,
    sub: isDark ? "#4A6A66" : theme.textSecondary,
    card: isDark ? "#0C1119" : theme.card,
    border: isDark ? "rgba(46,207,190,0.15)" : theme.border,
    modalBg: isDark ? "#0F1923" : "#FFFFFF",
    sheetBg: isDark ? "#111A24" : "#F5F8F7",
  };
}

type Colors = ReturnType<typeof useColors>;

// ─── Config Modal (flotante, maneja su propio teclado) ────────────────────────

type ConfigModalProps = {
  visible: boolean;
  exercise: Exercise | null;
  initialSets: string;
  initialReps: string;
  initialRest: string;
  onConfirm: (sets: string, reps: string, rest: string) => void;
  onCancel: () => void;
  colors: Colors;
};

function ConfigModal({
  visible,
  exercise,
  initialSets,
  initialReps,
  initialRest,
  onConfirm,
  onCancel,
  colors,
}: ConfigModalProps) {
  const [sets, setSets] = useState(initialSets);
  const [reps, setReps] = useState(initialReps);
  const [rest, setRest] = useState(initialRest);
  const repsRef = useRef<TextInput>(null);
  const restRef = useRef<TextInput>(null);

  // sincronizar valores cuando se abre con datos distintos
  useEffect(() => {
    if (visible) {
      setSets(initialSets);
      setReps(initialReps);
      setRest(initialRest);
    }
  }, [visible, initialSets, initialReps, initialRest]);

  if (!exercise) return null;

  const fields = [
    {
      label: "Series",
      value: sets,
      onChange: setSets,
      numeric: true,
      placeholder: "3",
      returnKey: "next" as const,
      onSubmit: () => repsRef.current?.focus(),
      ref: undefined,
    },
    {
      label: "Reps",
      value: reps,
      onChange: setReps,
      numeric: false,
      placeholder: "10",
      returnKey: "next" as const,
      onSubmit: () => restRef.current?.focus(),
      ref: repsRef,
    },
    {
      label: "Descanso (s)",
      value: rest,
      onChange: setRest,
      numeric: true,
      placeholder: "60",
      returnKey: "done" as const,
      onSubmit: () => onConfirm(sets, reps, rest),
      ref: restRef,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={onCancel}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>

        <View style={[styles.modalSheet, { backgroundColor: colors.sheetBg }]}>
          {/* handle */}
          <View
            style={[
              styles.modalHandle,
              { backgroundColor: colors.isDark ? "#2A3A36" : "#DDE" },
            ]}
          />

          <Text style={[styles.modalExerciseName, { color: colors.teal }]}>
            {exercise.name}
          </Text>
          <Text style={[styles.modalMuscleName, { color: colors.sub }]}>
            {exercise.muscle.toUpperCase()}
          </Text>

          <View style={styles.fieldsRow}>
            {fields.map((f) => (
              <View key={f.label} style={styles.fieldCol}>
                <Text style={[styles.fieldLabel, { color: colors.sub }]}>
                  {f.label}
                </Text>
                <TextInput
                  ref={f.ref}
                  style={[
                    styles.fieldInput,
                    {
                      color: colors.text,
                      borderColor: colors.border,
                      backgroundColor: colors.card,
                    },
                  ]}
                  value={f.value}
                  onChangeText={f.onChange}
                  keyboardType={f.numeric ? "numeric" : "default"}
                  placeholder={f.placeholder}
                  placeholderTextColor={colors.sub}
                  returnKeyType={f.returnKey}
                  onSubmitEditing={f.onSubmit}
                  selectTextOnFocus
                />
              </View>
            ))}
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              onPress={onCancel}
              style={[
                styles.modalBtn,
                {
                  backgroundColor: colors.isDark ? "#1a2430" : "#EBEBEB",
                  flex: 1,
                },
              ]}
            >
              <Text style={[styles.modalBtnText, { color: colors.sub }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onConfirm(sets, reps, rest)}
              style={[
                styles.modalBtn,
                { backgroundColor: colors.teal, flex: 2 },
              ]}
            >
              <Text
                style={[
                  styles.modalBtnText,
                  { color: "#fff", fontWeight: "700" },
                ]}
              >
                Guardar ejercicio
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Exercise Card ────────────────────────────────────────────────────────────

type ExerciseCardProps = {
  exercise: Exercise;
  selectedData: RoutineExercise | undefined;
  onPress: () => void;
  onEdit: () => void;
  onRemove: () => void;
  colors: Colors;
};

function ExerciseCard({
  exercise,
  selectedData,
  onPress,
  onEdit,
  onRemove,
  colors,
}: ExerciseCardProps) {
  const selected = !!selectedData;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: selected
            ? colors.isDark
              ? "#091714"
              : "#EBF9F7"
            : colors.card,
          borderColor: selected
            ? colors.isDark
              ? "rgba(46,207,190,0.4)"
              : colors.teal
            : colors.border,
          borderWidth: selected ? 1.5 : 1,
        },
      ]}
    >
      {/* area principal */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.cardTouch}
      >
        <View style={styles.cardInfo}>
          <Text
            style={[
              styles.cardName,
              { color: selected ? colors.teal : colors.text },
            ]}
          >
            {exercise.name}
          </Text>
          <Text style={[styles.cardMuscle, { color: colors.sub }]}>
            {exercise.muscle.toUpperCase()}
          </Text>

          {selectedData && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryText, { color: colors.teal }]}>
                {selectedData.sets}x{selectedData.reps} ·{" "}
                {selectedData.restSeconds}s descanso
              </Text>
              <TouchableOpacity
                onPress={onEdit}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={[styles.editLink, { color: colors.sub }]}>
                  editar
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* boton derecho — completamente separado del area principal */}
      <TouchableOpacity
        onPress={selected ? onRemove : onPress}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={styles.cardAction}
      >
        {selected ? (
          <Ionicons name="close-circle" size={22} color="#ff6b6b" />
        ) : (
          <Ionicons name="add-circle-outline" size={24} color={colors.sub} />
        )}
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ExerciseSelectScreen() {
  const colors = useColors();
  const router = useRouter();
  const { day } = useLocalSearchParams<{ day: WeekDayKey }>();

  const weekPlan = useBuildRoutineStore((s) => s.weekPlan);
  const equipment = useBuildRoutineStore((s) => s.equipment);

  const selectedExercises = useBuildRoutineStore(
    useShallow((s) =>
      day ? (s.exercisePlan.find((p) => p.day === day)?.exercises ?? []) : [],
    ),
  );
  const addExerciseToDay = useBuildRoutineStore((s) => s.addExerciseToDay);
  const removeExerciseFromDay = useBuildRoutineStore(
    (s) => s.removeExerciseFromDay,
  );

  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // modal de configuracion
  const [modalExercise, setModalExercise] = useState<Exercise | null>(null);
  const [modalInitial, setModalInitial] = useState({
    sets: "3",
    reps: "10",
    rest: "60",
  });
  const modalVisible = modalExercise !== null;

  const dayPlan = weekPlan.find((p) => p.day === day);
  const muscles = dayPlan?.muscles ?? [];

  useEffect(() => {
    if (muscles.length > 0) {
      loadExercises();
    } else {
      setLoading(false);
      setError("No hay músculos asignados para este día");
    }
  }, []);

  const loadExercises = async () => {
    setLoading(true);
    setError(null);
    try {
      // Expandir tipos quick a músculos reales
      const resolvedMuscles = muscles.flatMap(
        (m) => ROUTINE_TYPE_TO_MUSCLES[m] ?? [m], // si ya es un músculo real, lo deja igual
      );
      // Deduplicar por si acaso
      const uniqueMuscles = [...new Set(resolvedMuscles)];

      const all: Exercise[] = [];
      for (const muscle of uniqueMuscles) {
        try {
          const result = await exerciseService.getExercisesByMuscle(
            muscle,
            equipment ?? "",
          );
          all.push(...result);
        } catch {
          console.log(`Error loading: ${muscle}`);
        }
      }
      const unique = all.filter(
        (e, i, arr) => arr.findIndex((x) => x.id === e.id) === i,
      );
      setAvailableExercises(unique);
      if (unique.length === 0)
        setError(
          "No se encontraron ejercicios para los músculos seleccionados",
        );
    } catch {
      setError("Error al cargar los ejercicios. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // abre el modal para agregar (valores por defecto)
  const openAdd = (exercise: Exercise) => {
    setModalInitial({ sets: "3", reps: "10", rest: "60" });
    setModalExercise(exercise);
  };

  // abre el modal para editar (valores guardados)
  const openEdit = (exercise: Exercise, saved: RoutineExercise) => {
    setModalInitial({
      sets: saved.sets.toString(),
      reps: saved.reps,
      rest: saved.restSeconds.toString(),
    });
    setModalExercise(exercise);
  };

  const handleConfirm = (sets: string, reps: string, rest: string) => {
    if (!day || !modalExercise) return;
    // si ya existia, reemplazar
    removeExerciseFromDay(day, modalExercise.id);
    addExerciseToDay(day, {
      id: modalExercise.id,
      name: modalExercise.name,
      muscle: modalExercise.muscle,
      sets: parseInt(sets, 10) || 3,
      reps: reps || "10",
      restSeconds: parseInt(rest, 10) || 60,
    });
    setModalExercise(null);
  };

  const handleRemove = (exerciseId: string) => {
    if (!day) return;
    removeExerciseFromDay(day, exerciseId);
  };

  const handleCardPress = (exercise: Exercise) => {
    const already = selectedExercises.find((e) => e.id === exercise.id);
    if (already) return; // card ya seleccionada — no hacer nada, usar editar o ✕
    openAdd(exercise);
  };

  if (!day) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.text }}>Día no especificado</Text>
      </View>
    );
  }

  return (
    <>
      <OnboardingLayout
        title={`Ejercicios · ${DAY_LABELS[day]}`}
        onNext={() => router.back()}
        isNextDisabled={selectedExercises.length === 0 || modalVisible}
        nextButtonText="Guardar"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.headerMuscles, { color: colors.sub }]}>
              {muscles.map((m) => m.toUpperCase()).join("  ·  ")}
            </Text>
            <Text style={[styles.headerCount, { color: colors.teal }]}>
              {selectedExercises.length} seleccionados
            </Text>
          </View>

          {error && (
            <View
              style={[
                styles.errorBox,
                { backgroundColor: colors.isDark ? "#2c1810" : "#fee" },
              ]}
            >
              <Text
                style={[
                  styles.errorText,
                  { color: colors.isDark ? "#ff9999" : "#c00" },
                ]}
              >
                {error}
              </Text>
            </View>
          )}

          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.teal} />
              <Text style={[styles.loadingText, { color: colors.sub }]}>
                Cargando ejercicios...
              </Text>
            </View>
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {availableExercises.length === 0 && !error ? (
                <View style={styles.centered}>
                  <Text style={[styles.emptyText, { color: colors.sub }]}>
                    No hay ejercicios disponibles
                  </Text>
                </View>
              ) : (
                Object.entries(groupByMuscle(availableExercises)).map(
                  ([muscle, exercises]) => (
                    <View key={muscle} style={styles.muscleSection}>
                      {/* ── Título del grupo ── */}
                      <View
                        style={[
                          styles.muscleTitleRow,
                          { borderColor: colors.border },
                        ]}
                      >
                        <Text
                          style={[
                            styles.muscleTitleText,
                            { color: colors.teal },
                          ]}
                        >
                          {MUSCLE_LABELS[muscle] ?? muscle.toUpperCase()}
                        </Text>
                        <View
                          style={[
                            styles.muscleTitleLine,
                            { backgroundColor: colors.border },
                          ]}
                        />
                        <Text
                          style={[
                            styles.muscleTitleCount,
                            { color: colors.sub },
                          ]}
                        >
                          {
                            exercises.filter((ex) =>
                              selectedExercises.some((s) => s.id === ex.id),
                            ).length
                          }{" "}
                          / {exercises.length}
                        </Text>
                      </View>

                      {/* ── Ejercicios del grupo ── */}
                      {exercises.map((exercise) => {
                        const savedData = selectedExercises.find(
                          (e) => e.id === exercise.id,
                        );
                        return (
                          <ExerciseCard
                            key={exercise.id}
                            exercise={exercise}
                            selectedData={savedData}
                            onPress={() => handleCardPress(exercise)}
                            onEdit={() => openEdit(exercise, savedData!)}
                            onRemove={() => handleRemove(exercise.id)}
                            colors={colors}
                          />
                        );
                      })}
                    </View>
                  ),
                )
              )}
            </ScrollView>
          )}
        </View>
      </OnboardingLayout>

      {/* modal fuera del layout para que no compita con nada */}
      <ConfigModal
        visible={modalVisible}
        exercise={modalExercise}
        initialSets={modalInitial.sets}
        initialReps={modalInitial.reps}
        initialRest={modalInitial.rest}
        onConfirm={handleConfirm}
        onCancel={() => setModalExercise(null)}
        colors={colors}
      />
    </>
  );
}

//--------Helper
// ─── Fuera del componente: helper para agrupar ─────────────────────────────
function groupByMuscle(exercises: Exercise[]): Record<string, Exercise[]> {
  return exercises.reduce(
    (acc, ex) => {
      if (!acc[ex.muscle]) acc[ex.muscle] = [];
      acc[ex.muscle].push(ex);
      return acc;
    },
    {} as Record<string, Exercise[]>,
  );
}

const MUSCLE_LABELS: Record<string, string> = {
  pecho: "Pecho",
  espalda: "Espalda",
  hombros: "Hombros",
  biceps: "Bíceps",
  triceps: "Tríceps",
  piernas: "Piernas",
  gluteos: "Glúteos",
  core: "Core",
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: { marginBottom: token.spacing.md },
  headerMuscles: { fontSize: 13, marginBottom: 3 },
  headerCount: { fontSize: 13, fontWeight: "600" },

  scrollContent: { paddingBottom: token.spacing.xl },

  // card
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: token.radius.md,
    borderWidth: 1,
    marginBottom: token.spacing.sm,
    overflow: "hidden",
  },
  cardTouch: { flex: 1, padding: token.spacing.md },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: "600", marginBottom: 2 },
  cardMuscle: { fontSize: 12 },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 5,
  },
  summaryText: { fontSize: 12, fontWeight: "500" },
  editLink: { fontSize: 12, textDecorationLine: "underline" },
  cardAction: {
    paddingHorizontal: token.spacing.md,
    paddingVertical: token.spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },

  // modal flotante
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: token.spacing.lg,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    paddingTop: 12,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalExerciseName: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 2,
  },
  modalMuscleName: {
    fontSize: 12,
    marginBottom: 20,
  },
  fieldsRow: {
    flexDirection: "row",
    gap: token.spacing.sm,
    marginBottom: token.spacing.lg,
  },
  fieldCol: { flex: 1 },
  fieldLabel: { fontSize: 12, marginBottom: 6 },
  fieldInput: {
    borderWidth: 1,
    borderRadius: token.radius.sm,
    padding: token.spacing.sm,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    gap: token.spacing.sm,
  },
  modalBtn: {
    paddingVertical: 14,
    borderRadius: token.radius.md,
    alignItems: "center",
  },
  modalBtnText: { fontSize: 14 },

  // misc
  errorBox: {
    padding: token.spacing.md,
    borderRadius: token.radius.md,
    marginBottom: token.spacing.md,
  },
  errorText: { fontSize: 14, textAlign: "center" },
  emptyText: { fontSize: 14, textAlign: "center" },
  loadingText: { marginTop: token.spacing.md, fontSize: 14 },

  muscleSection: {
    marginBottom: token.spacing.lg,
  },
  muscleTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: token.spacing.sm,
    paddingBottom: token.spacing.xs,
  },
  muscleTitleText: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
    flexShrink: 0,
  },
  muscleTitleLine: {
    flex: 1,
    height: 1,
    opacity: 0.4,
  },
  muscleTitleCount: {
    fontSize: 11,
    fontWeight: "600",
    flexShrink: 0,
  },
});
