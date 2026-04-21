import { MUSCLE_COLORS } from "@/features/build-routine/constants/muscleColors";
import { estimateDuration } from "@/features/build-routine/utils/estimateDuration";
import { useSelectedPlanStore } from "@/store/build-rotine/mode/plan/useSelectedPlanStore";
import { useRoutineStore } from "@/store/routine/useRoutineStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { Routine } from "@/types/routine";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GOAL_LABEL: Record<string, string> = {
  fuerza: "Fuerza",
  hipertrofia: "Hipertrofia",
  masa: "Masa muscular",
  strength: "Fuerza",
  hypertrophy: "Hipertrofia",
  mass: "Masa muscular",
};

const EXPERIENCE_LABEL: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

interface DayInfo {
  day: string;
  muscle: string;
}

interface DayRowProps {
  routine: Routine;
  dayInfo: DayInfo;
  color: string;
  index: number;
  textColor: string;
  subColor: string;
  cardBg: string;
  borderColor: string;
  onStart: (routine: Routine) => void;
}

function DayRow({
  routine,
  dayInfo,
  color,
  index,
  textColor,
  subColor,
  cardBg,
  borderColor,
  onStart,
}: DayRowProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const duration = estimateDuration(routine.exercises);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        delay: 80 + index * 70,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 330,
        delay: 80 + index * 70,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.dayCard,
        { backgroundColor: cardBg, borderColor },
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={[styles.colorBar, { backgroundColor: color }]} />
      <View style={styles.dayCardContent}>
        <View style={styles.dayCardInfo}>
          <View
            style={[
              styles.dayLabelChip,
              { backgroundColor: `${color}18`, borderColor: `${color}35` },
            ]}
          >
            <Text style={[styles.dayLabelText, { color }]}>
              {dayInfo.day.toUpperCase()}
            </Text>
          </View>
          <Text
            style={[styles.muscleText, { color: textColor }]}
            numberOfLines={1}
          >
            {dayInfo.muscle}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={11}
                color={subColor}
              />
              <Text style={[styles.metaText, { color: subColor }]}>
                {routine.exercises.length} ejercicios
              </Text>
            </View>
            <View style={styles.metaSep} />
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={11}
                color={subColor}
              />
              <Text style={[styles.metaText, { color: subColor }]}>
                ~{duration} min
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.startBtn,
            { backgroundColor: color, shadowColor: color },
          ]}
          onPress={() => onStart(routine)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="play" size={16} color="#fff" />
          <Text style={styles.startBtnText}>Iniciar</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default function PlanDetailScreen() {
  const { theme, isDark } = useAppTheme();
  const c = theme;
  const { setRoutine } = useRoutineStore();

  const plan = useSelectedPlanStore((s) => s.selectedPlan);
  const bg = isDark ? "#070B12" : c.background;
  const cardBg = isDark ? "#0E1219" : c.card;
  const subColor = isDark ? "#4A5568" : c.textSecondary;
  const borderCol = isDark ? "#141922" : c.border;
  const TEAL = c.primary;

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 340,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  if (!plan) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
        <View style={styles.errorContainer}>
          <Text style={{ color: c.text }}>No se pudo cargar el plan.</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginTop: 12 }}
          >
            <Text style={{ color: TEAL }}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const goal = plan.routines[0]?.goal ?? "";
  const experience = plan.routines[0]?.experience ?? "";
  const totalExercises = plan.routines.reduce(
    (acc, r) => acc + r.exercises.length,
    0,
  );
  const totalDuration = plan.routines.reduce(
    (acc, r) => acc + estimateDuration(r.exercises),
    0,
  );

  const handleStartRoutine = (routine: Routine) => {
    setRoutine({
      exercises: routine.exercises,
      goal: routine.goal,
      experience: routine.experience,
      routineName: routine.name,
      routineId: routine.routineId,
    });
    router.push("/(app)/routine?from=tabs");
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: bg }]}
      edges={["top"]}
    >
      <Animated.View
        style={[
          styles.topBar,
          { opacity: headerFade, transform: [{ translateY: headerSlide }] },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { borderColor: borderCol }]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color={c.text} />
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={[styles.topBarTitle, { color: c.text }]}>
            Plan semanal
          </Text>
        </View>
        <View style={styles.backBtn} />
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.summaryCard,
            { backgroundColor: cardBg, borderColor: borderCol },
            { opacity: headerFade, transform: [{ translateY: headerSlide }] },
          ]}
        >
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                { backgroundColor: `${TEAL}18`, borderColor: `${TEAL}35` },
              ]}
            >
              <MaterialCommunityIcons
                name="calendar-week"
                size={11}
                color={TEAL}
              />
              <Text style={[styles.badgeText, { color: TEAL }]}>
                PLAN SEMANAL
              </Text>
            </View>
            <View style={[styles.badge, { borderColor: borderCol }]}>
              <Text style={[styles.badgeText, { color: subColor }]}>
                {GOAL_LABEL[goal] ?? goal}
              </Text>
            </View>
            <View style={[styles.badge, { borderColor: borderCol }]}>
              <Text style={[styles.badgeText, { color: subColor }]}>
                {EXPERIENCE_LABEL[experience] ?? experience}
              </Text>
            </View>
          </View>
          <View style={[styles.statsRow, { borderTopColor: borderCol }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: c.text }]}>
                {plan.days.length}
              </Text>
              <Text style={[styles.statLabel, { color: subColor }]}>días</Text>
            </View>
            <View
              style={[styles.statDivider, { backgroundColor: borderCol }]}
            />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: c.text }]}>
                {totalExercises}
              </Text>
              <Text style={[styles.statLabel, { color: subColor }]}>
                ejercicios
              </Text>
            </View>
            <View
              style={[styles.statDivider, { backgroundColor: borderCol }]}
            />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: c.text }]}>
                ~{totalDuration}
              </Text>
              <Text style={[styles.statLabel, { color: subColor }]}>
                min totales
              </Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.daysSection}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>
            Días de entrenamiento
          </Text>
          {plan.routines.map((routine, i) => (
            <DayRow
              key={routine.routineId ?? i}
              routine={routine}
              dayInfo={plan.days[i]}
              color={MUSCLE_COLORS[i % MUSCLE_COLORS.length]}
              index={i}
              textColor={c.text}
              subColor={subColor}
              cardBg={cardBg}
              borderColor={borderCol}
              onStart={handleStartRoutine}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  topBarCenter: { flex: 1, alignItems: "center" },
  topBarTitle: { fontSize: 16, fontWeight: "800", letterSpacing: -0.3 },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { padding: 20, gap: 20, paddingBottom: 48 },
  summaryCard: { borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, padding: 14 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.6 },
  statsRow: { flexDirection: "row", borderTopWidth: 1, paddingVertical: 14 },
  statItem: { flex: 1, alignItems: "center", gap: 2 },
  statValue: { fontSize: 20, fontWeight: "900", letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontWeight: "500" },
  statDivider: { width: 1, marginVertical: 4 },
  daysSection: { gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "900", letterSpacing: -0.4 },
  dayCard: {
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    overflow: "hidden",
  },
  colorBar: { width: 4 },
  dayCardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  dayCardInfo: { flex: 1, gap: 6 },
  dayLabelChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  dayLabelText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.8 },
  muscleText: { fontSize: 15, fontWeight: "800", letterSpacing: -0.3 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { fontSize: 11, fontWeight: "500" },
  metaSep: { width: 3, height: 3, borderRadius: 2, backgroundColor: "#4A5568" },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
});
