// app/(onboarding)/(build-routine)/weekPlanBuilder.tsx
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
  mie: "Miércoles",
  jue: "Jueves",
  vie: "Viernes",
  sab: "Sábado",
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
  ["hombro", "pecho"],
  ["biceps", "triceps"],
];

function isCompatible(
  selected: DaySessionType[],
  candidate: DaySessionType,
): boolean {
  if (isQuickType(candidate)) return selected.length === 0;
  if (selected.some(isQuickType)) return false;
  for (const s of selected) {
    if (isQuickType(s)) return false;
    const prohibido = COMBOS_PROHIBIDOS.some(
      ([a, b]) => (a === s && b === candidate) || (a === candidate && b === s),
    );
    if (prohibido) return false;
  }
  return true;
}

const MAX_PER_DAY = 2;

// ── Modal de asignación de músculos por día ───────────────────────────────────
function DayMuscleModal({
  visible,
  day,
  currentMuscles,
  onSave,
  onClose,
  isDark,
  teal,
  theme,
}: {
  visible: boolean;
  day: WeekDayKey | null;
  currentMuscles: DaySessionType[];
  onSave: (muscles: DaySessionType[]) => void;
  onClose: () => void;
  isDark: boolean;
  teal: string;
  theme: any;
}) {
  const [selected, setSelected] = useState<DaySessionType[]>([]);
  const subColor = isDark ? "#4A6A66" : theme.textSecondary;
  const borderDef = isDark ? "rgba(46,207,190,0.15)" : theme.border;
  const modalBg = isDark ? "#080D14" : "#F8FAFB";

  // Reiniciar selected cuando se abre el modal con un nuevo día
  useEffect(() => {
    if (visible && day) {
      setSelected(currentMuscles);
    }
  }, [visible, day, currentMuscles]);

  const toggle = (type: DaySessionType) => {
    if (selected.includes(type)) {
      setSelected(selected.filter((m) => m !== type));
      return;
    }
    if (selected.length >= MAX_PER_DAY) return;
    if (!isCompatible(selected, type)) return;
    setSelected([...selected, type]);
  };

  const quickRows: (typeof QUICK_OPTION_DATA)[] = [];
  for (let i = 0; i < QUICK_OPTION_DATA.length; i += 2) {
    quickRows.push(QUICK_OPTION_DATA.slice(i, i + 2));
  }
  const muscleRows: (typeof MUSCLE_OPTION_DATA)[] = [];
  for (let i = 0; i < MUSCLE_OPTION_DATA.length; i += 2) {
    muscleRows.push(MUSCLE_OPTION_DATA.slice(i, i + 2));
  }

  const lineColor = isDark ? "rgba(46,207,190,0.15)" : theme.border;

  if (!day) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[modalStyles.container, { backgroundColor: modalBg }]}>
        {/* Handle */}
        <View
          style={[
            modalStyles.handle,
            { backgroundColor: isDark ? "#2A3A36" : "#DDE" },
          ]}
        />

        {/* Header */}
        <View style={modalStyles.header}>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeBtn}>
            <Ionicons name="close" size={20} color={subColor} />
          </TouchableOpacity>
          <View style={modalStyles.headerCenter}>
            <Text style={[modalStyles.dayLabel, { color: teal }]}>
              {DAY_LABELS[day]}
            </Text>
            <Text style={[modalStyles.headerSub, { color: subColor }]}>
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
                {
                  color: selected.length > 0 ? "#fff" : subColor,
                },
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
          {/* Tipos de rutina */}
          <View style={modalStyles.sectionRow}>
            <View
              style={[modalStyles.sectionLine, { backgroundColor: lineColor }]}
            />
            <Text style={[modalStyles.sectionLabel, { color: subColor }]}>
              TIPOS DE RUTINA
            </Text>
            <View
              style={[modalStyles.sectionLine, { backgroundColor: lineColor }]}
            />
          </View>
          <View style={modalStyles.grid}>
            {quickRows.map((row, i) => (
              <View key={i} style={modalStyles.row}>
                {row.map((opt) => {
                  const isSel = selected.includes(opt.type);
                  const isDisabled =
                    !isSel && !isCompatible(selected, opt.type);
                  return (
                    <MuscleSelectionCard
                      key={opt.type}
                      type={opt.type}
                      title={opt.label}
                      subtitle={opt.subtitle}
                      image={opt.image}
                      icon={opt.icon}
                      isSelected={isSel}
                      isDisabled={isDisabled}
                      onPress={() => toggle(opt.type)}
                      isDark={isDark}
                      teal={teal}
                      borderDef={borderDef}
                      theme={theme}
                      cardWidth={CARD_WIDTH}
                    />
                  );
                })}
              </View>
            ))}
          </View>

          {/* Grupos musculares */}
          <View style={modalStyles.sectionRow}>
            <View
              style={[modalStyles.sectionLine, { backgroundColor: lineColor }]}
            />
            <Text style={[modalStyles.sectionLabel, { color: subColor }]}>
              GRUPOS MUSCULARES
            </Text>
            <View
              style={[modalStyles.sectionLine, { backgroundColor: lineColor }]}
            />
          </View>
          <View style={modalStyles.grid}>
            {muscleRows.map((row, i) => (
              <View key={i} style={modalStyles.row}>
                {row.map((opt) => {
                  const isSel = selected.includes(opt.type);
                  const isDisabled =
                    !isSel &&
                    (selected.length >= MAX_PER_DAY ||
                      !isCompatible(selected, opt.type));
                  return (
                    <MuscleSelectionCard
                      key={opt.type}
                      type={opt.type}
                      title={opt.title}
                      image={opt.image}
                      isSelected={isSel}
                      isDisabled={isDisabled}
                      onPress={() => toggle(opt.type)}
                      isDark={isDark}
                      teal={teal}
                      borderDef={borderDef}
                      theme={theme}
                      cardWidth={CARD_WIDTH}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Pantalla principal ────────────────────────────────────────────────────────
export default function WeekPlanBuilderScreen() {
  const { theme, isDark } = useAppTheme();
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();

  const selectedDays = useBuildRoutineStore(
    (s) => s.selectedDays,
  ) as WeekDayKey[];
  const weekPlan = useBuildRoutineStore((s) => s.weekPlan);
  const setWeekPlan = useBuildRoutineStore((s) => s.setWeekPlan);

  const [modalDay, setModalDay] = useState<WeekDayKey | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const TEAL = theme.primary;
  const textColor = isDark ? "#DFF0EE" : theme.text;
  const subColor = isDark ? "#4A6A66" : theme.textSecondary;
  const cardBg = isDark ? "#0C1119" : theme.card;
  const borderDef = isDark ? "rgba(46,207,190,0.15)" : theme.border;

  // Obtener músculos asignados a un día
  const getMusclesForDay = (day: WeekDayKey): DaySessionType[] =>
    weekPlan.find((p) => p.day === day)?.muscles ?? [];

  const handleSaveDay = (day: WeekDayKey, muscles: DaySessionType[]) => {
    const existing = weekPlan.filter((p) => p.day !== day);
    const updated: WeekDayPlan[] =
      muscles.length > 0 ? [...existing, { day, muscles }] : existing;
    setWeekPlan(updated);
  };

  const openModal = (day: WeekDayKey) => {
    setModalDay(day);
    setModalVisible(true);
  };

  // Todos los días seleccionados deben tener al menos 1 músculo
  const allAssigned = selectedDays.every(
    (day) => getMusclesForDay(day).length > 0,
  );

  const handleNext = () => {
    if (!allAssigned) return;
    router.push(
      `/(onboarding)/(build-routine)/confirmCustom?from=${from ?? "tabs"}`,
    );
  };

  const assignedCount = selectedDays.filter(
    (d) => getMusclesForDay(d).length > 0,
  ).length;

  return (
    <OnboardingLayout
      title="Plan semanal"
      onNext={handleNext}
      isNextDisabled={!allAssigned}
      nextButtonText="Confirmar plan"
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Asigná músculos a cada día
          </Text>
          <Text style={[styles.sectionSubtitle, { color: subColor }]}>
            Tocá un día para elegir qué grupos trabajar
          </Text>
        </View>

        {/* Progreso */}
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
            <Ionicons name="calendar-outline" size={14} color={TEAL} />
            <Text style={[styles.progressLabel, { color: TEAL }]}>
              PROGRESO
            </Text>
            <Text style={[styles.progressCount, { color: TEAL }]}>
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
                  backgroundColor: TEAL,
                  width: `${(assignedCount / selectedDays.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Lista de días */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {selectedDays.map((day) => {
            const muscles = getMusclesForDay(day);
            const hasAssignment = muscles.length > 0;
            return (
              <TouchableOpacity
                key={day}
                onPress={() => openModal(day)}
                activeOpacity={0.8}
                style={[
                  styles.dayRow,
                  {
                    backgroundColor: hasAssignment
                      ? isDark
                        ? "#091714"
                        : "#EBF9F7"
                      : cardBg,
                    borderColor: hasAssignment
                      ? isDark
                        ? "rgba(46,207,190,0.4)"
                        : TEAL
                      : borderDef,
                  },
                ]}
              >
                {hasAssignment && (
                  <View
                    style={[styles.dayTopLine, { backgroundColor: TEAL }]}
                  />
                )}
                <View style={styles.dayRowInner}>
                  {/* Día */}
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
                      style={[
                        styles.dayBadgeText,
                        {
                          color: hasAssignment ? TEAL : subColor,
                        },
                      ]}
                    >
                      {day.toUpperCase()}
                    </Text>
                  </View>

                  {/* Contenido */}
                  <View style={styles.dayContent}>
                    <Text
                      style={[
                        styles.dayFullName,
                        {
                          color: hasAssignment ? textColor : subColor,
                        },
                      ]}
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
                            <Text
                              style={[styles.muscleTagText, { color: TEAL }]}
                            >
                              {m.toUpperCase()}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Text style={[styles.dayEmpty, { color: subColor }]}>
                        Tocá para asignar músculos
                      </Text>
                    )}
                  </View>

                  {/* Icono derecho */}
                  <Ionicons
                    name={
                      hasAssignment ? "checkmark-circle" : "add-circle-outline"
                    }
                    size={22}
                    color={hasAssignment ? TEAL : subColor}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Modal */}
      <DayMuscleModal
        visible={modalVisible}
        day={modalDay}
        currentMuscles={modalDay ? getMusclesForDay(modalDay) : []}
        onSave={(muscles) => {
          if (modalDay) handleSaveDay(modalDay, muscles);
        }}
        onClose={() => setModalVisible(false)}
        isDark={isDark}
        teal={TEAL}
        theme={theme}
      />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    marginBottom: token.spacing.lg,
    marginTop: token.spacing.xs,
  },
  sectionTitle: {
    fontSize: token.typography.h2,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: token.spacing.xs / 2,
  },
  sectionSubtitle: {
    fontSize: token.typography.bodySmall,
    textAlign: "left",
    lineHeight: 20,
  },
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
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
