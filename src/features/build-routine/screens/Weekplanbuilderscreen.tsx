import {
  MUSCLE_OPTION_DATA,
  QUICK_OPTION_DATA,
} from "@/features/build-routine/constants/routine-builder.constants";
import {
  DaySessionType,
  RoutineCustomType,
  RoutineQuickType,
  WeekDayKey,
  WeekDayPlan,
} from "@/features/build-routine/type/routine-builder.types";
import OnboardingLayout from "@/shared/components/OnboardingLayout";
import { useBuildRoutineStore } from "@/store/build-rotine/buildRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { token } from "@/theme/token";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MuscleSelectionCard } from "../components/MuscleSelectionCard";

const SCREEN_WIDTH = Dimensions.get("window").width;
const H_PADDING = token.spacing.lg * 2;
const COLUMN_GAP = token.spacing.md;
const CARD_WIDTH = (SCREEN_WIDTH - H_PADDING - COLUMN_GAP) / 2;

const DAY_LABELS: Record<WeekDayKey, string> = {
  lun: "Lunes",
  mar: "Martes",
  mie: "Miercoles",
  jue: "Jueves",
  vie: "Viernes",
  sab: "Sabado",
  dom: "Domingo",
};

const QUICK_SET = new Set<string>([
  "push",
  "pull",
  "legs",
  "upper",
  "lower",
  "fullbody",
]);

function isQuickType(t: DaySessionType): t is RoutineQuickType {
  return QUICK_SET.has(t);
}

const COMBOS_PROHIBIDOS: [RoutineCustomType, RoutineCustomType][] = [
  ["pecho", "espalda"],
  ["pecho", "piernas"],
  ["espalda", "piernas"],
  ["hombros", "pecho"],
  ["biceps", "triceps"],
];

const MAX_PER_DAY = 2;

type WeekMode = "none" | "quick" | "muscle";

function getWeekMode(
  weekPlan: WeekDayPlan[],
  excludeDay: WeekDayKey | null,
): WeekMode {
  for (const plan of weekPlan) {
    if (plan.day === excludeDay) continue;
    for (const m of plan.muscles) {
      return isQuickType(m) ? "quick" : "muscle";
    }
  }
  return "none";
}

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
    modalBg: isDark ? "#080D14" : "#F8FAFB",
  };
}

// ─── Day Muscle Modal ─────────────────────────────────────────────────────────

function DayMuscleModal({
  visible,
  day,
  currentMuscles,
  weekPlan,
  onSave,
  onClose,
  onClearExercises,
}: {
  visible: boolean;
  day: WeekDayKey | null;
  currentMuscles: DaySessionType[];
  weekPlan: WeekDayPlan[];
  onSave: (muscles: DaySessionType[]) => void;
  onClose: () => void;
  onClearExercises: (day: WeekDayKey) => void;
}) {
  const { isDark, teal, sub, modalBg } = useColors();
  const { theme } = useAppTheme();

  const [selected, setSelected] = useState<DaySessionType[]>([]);

  useEffect(() => {
    if (visible && day) setSelected(currentMuscles);
  }, [visible, day, currentMuscles]);

  if (!day) return null;

  const weekMode = getWeekMode(weekPlan, day);
  const isQuickSectionLocked = weekMode === "muscle";
  const isMuscleSectionLocked = weekMode === "quick";
  const lineColor = isDark ? "rgba(46,207,190,0.15)" : theme.border;
  const borderDef = isDark ? "rgba(46,207,190,0.15)" : theme.border;

  const confirmTypeSwitch = (onConfirm: () => void) => {
    Alert.alert(
      "Cambiar tipo de entrenamiento",
      "Si cambiás el enfoque de este día se van a borrar los ejercicios ya seleccionados. ¿Querés continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, cambiar",
          style: "destructive",
          onPress: () => {
            onClearExercises(day);
            onConfirm();
          },
        },
      ],
    );
  };

  const toggle = (type: DaySessionType) => {
    if (selected.includes(type)) {
      setSelected(selected.filter((m) => m !== type));
      return;
    }

    const isCandidateQuick = isQuickType(type);
    const hasQuickSelected = selected.some(isQuickType);
    const hasMuscleSelected = selected.some((s) => !isQuickType(s));

    if (weekMode === "muscle" && isCandidateQuick) return;
    if (weekMode === "quick" && !isCandidateQuick) return;

    const hasExercisesForDay = currentMuscles.length > 0 && selected.length > 0;
    const switchingFromQuickToMuscle = hasQuickSelected && !isCandidateQuick;
    const switchingFromMuscleToQuick = hasMuscleSelected && isCandidateQuick;

    if (
      hasExercisesForDay &&
      (switchingFromQuickToMuscle || switchingFromMuscleToQuick)
    ) {
      confirmTypeSwitch(() => setSelected([type]));
      return;
    }

    if (isCandidateQuick) {
      setSelected([type]);
      return;
    }

    if (hasQuickSelected) {
      setSelected([type]);
      return;
    }

    const incompatible = selected.find((s) =>
      COMBOS_PROHIBIDOS.some(
        ([a, b]) => (a === s && b === type) || (a === type && b === s),
      ),
    );
    if (incompatible) {
      setSelected(selected.filter((m) => m !== incompatible).concat(type));
      return;
    }

    if (selected.length >= MAX_PER_DAY) {
      setSelected([selected[1], type]);
      return;
    }

    setSelected([...selected, type]);
  };

  const quickRows = chunk(QUICK_OPTION_DATA, 2);
  const muscleRows = chunk(MUSCLE_OPTION_DATA, 2);

  // ── Orden dinámico: sección habilitada siempre primero ──────────────────
  const sections = [
    {
      label: "TIPOS DE RUTINA",
      locked: isQuickSectionLocked,
      rows: quickRows as (typeof QUICK_OPTION_DATA)[number][][],
      isQuick: true,
    },
    {
      label: "GRUPOS MUSCULARES",
      locked: isMuscleSectionLocked,
      rows: muscleRows as (typeof MUSCLE_OPTION_DATA)[number][][],
      isQuick: false,
    },
  ].sort((a, b) => Number(a.locked) - Number(b.locked));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[modalStyles.container, { backgroundColor: modalBg }]}>
        <View
          style={[
            modalStyles.handle,
            { backgroundColor: isDark ? "#2A3A36" : "#DDE" },
          ]}
        />

        <View style={modalStyles.header}>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeBtn}>
            <Ionicons name="close" size={20} color={sub} />
          </TouchableOpacity>
          <View style={modalStyles.headerCenter}>
            <Text style={[modalStyles.dayLabel, { color: teal }]}>
              {DAY_LABELS[day]}
            </Text>
            <Text style={[modalStyles.headerSub, { color: sub }]}>
              Elegí hasta 2 grupos para este día
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              onSave(selected);
              onClose();
            }}
            disabled={selected.length === 0}
            style={[
              modalStyles.saveBtn,
              {
                backgroundColor:
                  selected.length > 0
                    ? teal
                    : isDark
                      ? "rgba(46,207,190,0.1)"
                      : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <Text
              style={[
                modalStyles.saveBtnText,
                { color: selected.length > 0 ? "#fff" : sub },
              ]}
            >
              Listo
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={modalStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sections.map((section) => (
            <View key={section.label}>
              <SectionDivider
                label={section.label}
                locked={section.locked}
                lineColor={lineColor}
                sub={sub}
              />
              <View
                style={[modalStyles.grid, section.locked && { opacity: 0.4 }]}
              >
                {section.rows.map((row, i) => (
                  <View key={i} style={modalStyles.row}>
                    {row.map((opt) =>
                      section.isQuick ? (
                        <MuscleSelectionCard
                          key={opt.type}
                          type={opt.type}
                          title={
                            (opt as (typeof QUICK_OPTION_DATA)[number]).label
                          }
                          subtitle={
                            (opt as (typeof QUICK_OPTION_DATA)[number]).subtitle
                          }
                          image={opt.image}
                          icon={
                            (opt as (typeof QUICK_OPTION_DATA)[number]).icon
                          }
                          isSelected={selected.includes(opt.type)}
                          isDisabled={section.locked}
                          onPress={() => toggle(opt.type)}
                          isDark={isDark}
                          teal={teal}
                          borderDef={borderDef}
                          theme={theme}
                          cardWidth={CARD_WIDTH}
                        />
                      ) : (
                        <MuscleSelectionCard
                          key={opt.type}
                          type={opt.type}
                          title={
                            (opt as (typeof MUSCLE_OPTION_DATA)[number]).title
                          }
                          image={opt.image}
                          isSelected={selected.includes(opt.type)}
                          isDisabled={section.locked}
                          onPress={() => toggle(opt.type)}
                          isDark={isDark}
                          teal={teal}
                          borderDef={borderDef}
                          theme={theme}
                          cardWidth={CARD_WIDTH}
                        />
                      ),
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Section Divider ──────────────────────────────────────────────────────────

function SectionDivider({
  label,
  locked,
  lineColor,
  sub,
}: {
  label: string;
  locked: boolean;
  lineColor: string;
  sub: string;
}) {
  return (
    <View style={modalStyles.sectionRow}>
      <View style={[modalStyles.sectionLine, { backgroundColor: lineColor }]} />
      <Text
        style={[
          modalStyles.sectionLabel,
          { color: sub },
          locked && { opacity: 0.5 },
        ]}
      >
        {label}
        {locked ? " (bloqueado)" : ""}
      </Text>
      <View style={[modalStyles.sectionLine, { backgroundColor: lineColor }]} />
    </View>
  );
}

// ─── Week Reset Button ────────────────────────────────────────────────────────

function WeekResetButton({
  onReset,
  teal,
  isDark,
}: {
  onReset: () => void;
  teal: string;
  isDark: boolean;
}) {
  const confirmReset = () => {
    Alert.alert(
      "Resetear semana",
      "Se van a borrar todos los grupos y ejercicios asignados. ¿Querés empezar de nuevo?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, resetear", style: "destructive", onPress: onReset },
      ],
    );
  };

  return (
    <TouchableOpacity
      onPress={confirmReset}
      style={[
        styles.resetBtn,
        {
          borderColor: isDark
            ? "rgba(255,107,107,0.3)"
            : "rgba(255,107,107,0.4)",
          backgroundColor: isDark
            ? "rgba(255,107,107,0.06)"
            : "rgba(255,107,107,0.04)",
        },
      ]}
    >
      <Ionicons name="refresh-outline" size={14} color="#ff6b6b" />
      <Text style={styles.resetBtnText}>Resetear semana</Text>
    </TouchableOpacity>
  );
}

// ─── Day Row ──────────────────────────────────────────────────────────────────

function DayRow({
  day,
  muscles,
  exerciseCount,
  onOpenModal,
  onGoToExercises,
  colors,
}: {
  day: WeekDayKey;
  muscles: DaySessionType[];
  exerciseCount: number;
  onOpenModal: () => void;
  onGoToExercises: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  const { isDark, teal, text, sub, card, border } = colors;
  const hasAssignment = muscles.length > 0;
  const hasExercises = exerciseCount > 0;

  return (
    <View
      style={[
        styles.dayRow,
        {
          backgroundColor: hasAssignment
            ? isDark
              ? "#091714"
              : "#EBF9F7"
            : card,
          borderColor: hasAssignment
            ? isDark
              ? "rgba(46,207,190,0.4)"
              : teal
            : border,
        },
      ]}
    >
      {hasAssignment && (
        <View style={[styles.dayTopLine, { backgroundColor: teal }]} />
      )}

      <TouchableOpacity
        onPress={onOpenModal}
        activeOpacity={0.8}
        style={styles.dayRowInner}
      >
        <View
          style={[
            styles.dayBadge,
            {
              backgroundColor: hasAssignment
                ? isDark
                  ? "rgba(46,207,190,0.15)"
                  : "rgba(46,207,190,0.1)"
                : isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.04)",
            },
          ]}
        >
          <Text
            style={[styles.dayBadgeText, { color: hasAssignment ? teal : sub }]}
          >
            {day.toUpperCase()}
          </Text>
        </View>

        <View style={styles.dayContent}>
          <Text
            style={[styles.dayFullName, { color: hasAssignment ? text : sub }]}
          >
            {DAY_LABELS[day]}
          </Text>
          {hasAssignment ? (
            <View style={styles.muscleTagsRow}>
              {muscles.map((m) => (
                <View
                  key={m}
                  style={[
                    styles.muscleTag,
                    {
                      backgroundColor: isDark
                        ? "rgba(46,207,190,0.12)"
                        : "rgba(46,207,190,0.08)",
                    },
                  ]}
                >
                  <Text style={[styles.muscleTagText, { color: teal }]}>
                    {m.toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.dayEmpty, { color: sub }]}>
              Toca para asignar músculos
            </Text>
          )}
        </View>

        <Ionicons
          name={hasAssignment ? "create-outline" : "add-circle-outline"}
          size={20}
          color={hasAssignment ? teal : sub}
        />
      </TouchableOpacity>

      {hasAssignment && (
        <TouchableOpacity
          onPress={onGoToExercises}
          style={[
            styles.exercisesBtn,
            {
              backgroundColor: hasExercises
                ? isDark
                  ? "rgba(46,207,190,0.15)"
                  : "rgba(46,207,190,0.1)"
                : teal,
            },
          ]}
        >
          <Ionicons
            name={hasExercises ? "checkmark-circle" : "barbell-outline"}
            size={14}
            color={hasExercises ? teal : "#fff"}
          />
          <Text
            style={[
              styles.exercisesBtnText,
              { color: hasExercises ? teal : "#fff" },
            ]}
          >
            {hasExercises
              ? `${exerciseCount} ejercicios`
              : "Seleccionar ejercicios"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function WeekPlanBuilderScreen() {
  const colors = useColors();
  const { isDark, teal, text, sub } = colors;
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();

  const selectedDays = useBuildRoutineStore(
    (s) => s.selectedDays,
  ) as WeekDayKey[];
  const weekPlan = useBuildRoutineStore((s) => s.weekPlan);
  const setWeekPlan = useBuildRoutineStore((s) => s.setWeekPlan);
  const getExercisesForDay = useBuildRoutineStore((s) => s.getExercisesForDay);
  const removeExerciseFromDay = useBuildRoutineStore(
    (s) => s.removeExerciseFromDay,
  );

  const [modalDay, setModalDay] = useState<WeekDayKey | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getMusclesForDay = (day: WeekDayKey): DaySessionType[] =>
    weekPlan.find((p) => p.day === day)?.muscles ?? [];

  const handleSaveDay = (day: WeekDayKey, muscles: DaySessionType[]) => {
    const existing = weekPlan.filter((p) => p.day !== day);
    const updated: WeekDayPlan[] =
      muscles.length > 0 ? [...existing, { day, muscles }] : existing;
    setWeekPlan(updated);
  };

  const handleClearExercises = (day: WeekDayKey) => {
    const exercises = getExercisesForDay(day);
    exercises.forEach((e) => removeExerciseFromDay(day, e.id));
  };

  const handleResetWeek = () => {
    selectedDays.forEach((day) => handleClearExercises(day));
    setWeekPlan([]);
  };

  const allAssigned = selectedDays.every(
    (day) => getMusclesForDay(day).length > 0,
  );
  const assignedCount = selectedDays.filter(
    (d) => getMusclesForDay(d).length > 0,
  ).length;
  const hasAnyAssignment = assignedCount > 0;

  return (
    <OnboardingLayout
      title="Plan semanal"
      onNext={() => {
        if (!allAssigned) return;
        router.push(
          `/(onboarding)/(build-routine)/confirmCustom?from=${from ?? "tabs"}`,
        );
      }}
      isNextDisabled={!allAssigned}
      nextButtonText="Confirmar plan"
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.sectionTitle, { color: text }]}>
            Asigná músculos a cada día
          </Text>
          <Text style={[styles.sectionSubtitle, { color: sub }]}>
            Toca un día para elegir qué grupos trabajar
          </Text>
        </View>

        <View
          style={[
            styles.progressCard,
            {
              backgroundColor: isDark
                ? "rgba(46,207,190,0.06)"
                : "rgba(46,207,190,0.05)",
              borderColor: isDark
                ? "rgba(46,207,190,0.15)"
                : "rgba(46,207,190,0.2)",
            },
          ]}
        >
          <View style={styles.progressRow}>
            <Ionicons name="calendar-outline" size={14} color={teal} />
            <Text style={[styles.progressLabel, { color: teal }]}>
              PROGRESO
            </Text>
            <Text style={[styles.progressCount, { color: teal }]}>
              {assignedCount}/{selectedDays.length} días
            </Text>
          </View>
          <View
            style={[
              styles.progressBar,
              {
                backgroundColor: isDark
                  ? "rgba(46,207,190,0.1)"
                  : "rgba(46,207,190,0.08)",
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: teal,
                  width: `${(assignedCount / selectedDays.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {selectedDays.map((day) => (
            <DayRow
              key={day}
              day={day}
              muscles={getMusclesForDay(day)}
              exerciseCount={getExercisesForDay(day).length}
              onOpenModal={() => {
                setModalDay(day);
                setModalVisible(true);
              }}
              onGoToExercises={() =>
                router.push(
                  `/(onboarding)/(build-routine)/exerciseSelect?day=${day}&from=${from ?? "tabs"}`,
                )
              }
              colors={colors}
            />
          ))}

          {hasAnyAssignment && (
            <WeekResetButton
              onReset={handleResetWeek}
              teal={teal}
              isDark={isDark}
            />
          )}
        </ScrollView>
      </View>

      <DayMuscleModal
        visible={modalVisible}
        day={modalDay}
        currentMuscles={modalDay ? getMusclesForDay(modalDay) : []}
        weekPlan={weekPlan}
        onSave={(muscles) => {
          if (modalDay) handleSaveDay(modalDay, muscles);
        }}
        onClose={() => setModalVisible(false)}
        onClearExercises={handleClearExercises}
      />
    </OnboardingLayout>
  );
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size)
    result.push(arr.slice(i, i + size));
  return result;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    marginBottom: token.spacing.lg,
    marginTop: token.spacing.xs,
  },
  sectionTitle: {
    fontSize: token.typography.h2,
    fontWeight: "bold",
    marginBottom: token.spacing.xs / 2,
  },
  sectionSubtitle: { fontSize: token.typography.bodySmall, lineHeight: 20 },
  progressCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: token.spacing.md,
    gap: 8,
    marginBottom: token.spacing.lg,
  },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  progressLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    flex: 1,
  },
  progressCount: { fontSize: 12, fontWeight: "700" },
  progressBar: { height: 4, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  scrollContent: { gap: token.spacing.sm, paddingBottom: token.spacing.xl },
  dayRow: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 3,
  },
  dayTopLine: {
    height: 1.5,
    width: "60%",
    alignSelf: "center",
    opacity: 0.5,
    borderRadius: 1,
  },
  dayRowInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: token.spacing.md,
    gap: token.spacing.md,
  },
  dayBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  dayBadgeText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  dayContent: { flex: 1, gap: 4 },
  dayFullName: { fontSize: 15, fontWeight: "700", letterSpacing: -0.2 },
  muscleTagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  muscleTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  muscleTagText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  dayEmpty: { fontSize: 12, fontWeight: "500" },
  exercisesBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginHorizontal: token.spacing.md,
    marginBottom: token.spacing.md,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exercisesBtnText: { fontSize: 12, fontWeight: "600" },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: token.spacing.sm,
  },
  resetBtnText: { fontSize: 13, fontWeight: "600", color: "#ff6b6b" },
});

const modalStyles = StyleSheet.create({
  container: { flex: 1, paddingTop: 12 },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: token.spacing.lg,
    paddingBottom: token.spacing.md,
    gap: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { flex: 1, alignItems: "center" },
  dayLabel: { fontSize: 18, fontWeight: "900", letterSpacing: -0.3 },
  headerSub: { fontSize: 12, fontWeight: "500", marginTop: 1 },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  saveBtnText: { fontSize: 14, fontWeight: "700" },
  scrollContent: {
    padding: token.spacing.lg,
    gap: token.spacing.lg,
    paddingBottom: 40,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  sectionLine: { flex: 1, height: 1, opacity: 0.5 },
  sectionLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1.4 },
  grid: { gap: token.spacing.md },
  row: { flexDirection: "row", gap: COLUMN_GAP },
});
